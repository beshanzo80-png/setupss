import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.DATABASE_URL;
let poolConfig = {};
if (dbUrl) {
  poolConfig = { connectionString: dbUrl };
} else {
  poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'postgres',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '',
    port: parseInt(process.env.DB_PORT || '5432', 10)
  };
}

const pool = new Pool(poolConfig);
const icecatUsername = process.env.ICECAT_USERNAME || '';
const CATEGORIES = [829, 194, 219, 1161];

async function fetchProducts(categoryId: number) {
  const url = `https://live.icecat.biz/api/?UserName=${icecatUsername}&Language=en&Category=${categoryId}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (data && data.data && Array.isArray(data.data)) return data.data;
    if (data && data.Product) return Array.isArray(data.Product) ? data.Product : [data.Product];
    return [];
  } catch (error: any) {
    console.error(`Error fetching category ${categoryId}: ${error.message}`);
    return [];
  }
}

function extractSpecs(featuresGroups: any[]) {
  const specs: Record<string, string> = {};
  if (!featuresGroups) return specs;
  for (const group of featuresGroups) {
    const features = group.Features || [];
    for (const feature of features) {
      const key = feature.Feature?.Name?.Value;
      const value = feature.Value;
      if (key) specs[key] = value;
    }
  }
  return specs;
}

async function syncIcecat() {
  if (!icecatUsername) {
    console.log("ICECAT_USERNAME is not set in .env");
    return;
  }
  
  for (const categoryId of CATEGORIES) {
    console.log(`Processing category: ${categoryId}`);
    const products = await fetchProducts(categoryId);
    
    for (const product of products) {
      const icecatId = product.GeneralInfo?.IcecatId;
      const ean = product.GeneralInfo?.GTIN?.[0] || null;
      const featuresGroups = product.FeaturesGroups || [];
      const specsDict = extractSpecs(featuresGroups);
      const imageUrl = product.Image?.HighPic || product.GeneralInfo?.ImageUrl;
      
      if (!icecatId) continue;
      
      try {
        await pool.query(`
          INSERT INTO hardware (id, name, slug, icecat_id, ean, specs, image_url, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
          ON CONFLICT (icecat_id) 
          DO UPDATE SET 
              specs = EXCLUDED.specs,
              image_url = EXCLUDED.image_url,
              updated_at = NOW();
        `, [
          `icecat-${icecatId}`, // dummy id
          product.GeneralInfo?.Title || `Icecat Product ${icecatId}`,
          `icecat-${icecatId}`, // dummy slug
          icecatId, 
          ean, 
          JSON.stringify(specsDict), 
          imageUrl
        ]);
        console.log(`Upserted icecat_id: ${icecatId}`);
      } catch (err: any) {
        // Fallback for when ID/slug conflicts or if we're just updating existing
        try {
            await pool.query(`
              UPDATE hardware 
              SET specs = $1, image_url = $2, updated_at = NOW(), ean = $3
              WHERE icecat_id = $4
            `, [JSON.stringify(specsDict), imageUrl, ean, icecatId]);
        } catch (e: any) {
            console.error(`Error inserting icecat_id ${icecatId}: ${e.message}`);
        }
      }
      await new Promise(r => setTimeout(r, 500));
    }
  }
  await pool.end();
  console.log("Sync completed.");
}

syncIcecat();
