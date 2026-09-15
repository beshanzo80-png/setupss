import os
import time
import json
import requests
import psycopg2
from urllib.parse import urlparse
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database connection settings
# Check if DATABASE_URL is present, otherwise use individual DB_* vars
db_url = os.getenv("DATABASE_URL")
if db_url:
    parsed = urlparse(db_url)
    db_host = parsed.hostname
    db_name = parsed.path.lstrip('/')
    db_user = parsed.username
    db_password = parsed.password
    db_port = parsed.port or 5432
else:
    db_host = os.getenv("DB_HOST", "localhost")
    db_name = os.getenv("DB_NAME", "postgres")
    db_user = os.getenv("DB_USER", "postgres")
    db_password = os.getenv("DB_PASS", "")
    db_port = os.getenv("DB_PORT", "5432")

icecat_username = os.getenv("ICECAT_USERNAME", "")

CATEGORIES = [829, 194, 219, 1161] # GPU, CPU, MOUSE, CHAIR

def get_db_connection():
    return psycopg2.connect(
        host=db_host,
        database=db_name,
        user=db_user,
        password=db_password,
        port=db_port
    )

def fetch_products_for_category(category_id):
    # This is a generic endpoint structure, modify if your Icecat API access uses a different endpoint for category listing
    # Open Icecat normally provides an XML/JSON index. This assumes a REST-like endpoint for simplicity as requested.
    url = f"https://live.icecat.biz/api/?UserName={icecat_username}&Language=en&Category={category_id}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        
        # Depending on Icecat response structure, you might need to adjust how you extract the product list.
        # Assuming `data['data']` is a list of products.
        if 'data' in data and isinstance(data['data'], list):
            return data['data']
        elif 'Product' in data: # sometimes it returns a single product wrapper
            return [data['Product']] if not isinstance(data['Product'], list) else data['Product']
        return []
    except Exception as e:
        print(f"Error fetching category {category_id}: {e}")
        return []

def extract_specs(features_groups):
    specs_dict = {}
    if not features_groups:
        return specs_dict
        
    for group in features_groups:
        features = group.get('Features', [])
        for feature in features:
            key = feature.get('Feature', {}).get('Name', {}).get('Value', '')
            value = feature.get('Value', '')
            if key:
                specs_dict[key] = value
                
    return specs_dict

def sync_icecat():
    if not icecat_username:
        print("ICECAT_USERNAME is not set in .env")
        return

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
    except Exception as e:
        print(f"Database connection error: {e}")
        return

    for category_id in CATEGORIES:
        print(f"Processing category: {category_id}")
        products = fetch_products_for_category(category_id)
        
        for product in products:
            icecat_id = product.get('GeneralInfo', {}).get('IcecatId')
            ean = product.get('GeneralInfo', {}).get('GTIN', [''])[0] if product.get('GeneralInfo', {}).get('GTIN') else None
            
            features_groups = product.get('FeaturesGroups', [])
            specs_dict = extract_specs(features_groups)
            
            # Assuming 'HighPic' or similar for image
            image_url = product.get('Image', {}).get('HighPic') or product.get('GeneralInfo', {}).get('ImageUrl')
            
            if not icecat_id:
                continue

            try:
                cursor.execute("""
                    INSERT INTO hardware (icecat_id, ean, specs, image_url, updated_at)
                    VALUES (%s, %s, %s, %s, NOW())
                    ON CONFLICT (icecat_id) 
                    DO UPDATE SET 
                        specs = EXCLUDED.specs,
                        image_url = EXCLUDED.image_url,
                        updated_at = NOW();
                """, (icecat_id, ean, json.dumps(specs_dict), image_url))
                conn.commit()
                print(f"Upserted icecat_id: {icecat_id}")
            except Exception as e:
                conn.rollback()
                print(f"Error inserting icecat_id {icecat_id}: {e}")
                
            time.sleep(0.5)
            
    cursor.close()
    conn.close()
    print("Sync completed.")

if __name__ == "__main__":
    sync_icecat()
