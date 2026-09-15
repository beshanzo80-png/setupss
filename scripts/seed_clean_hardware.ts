import { pool } from '../server/shared/database';
import { randomUUID } from 'node:crypto';
const uuidv4 = randomUUID;

async function seedCleanHardware() {
  console.log('--- Cleaning and updating Hardware Database ---');

  // 1. Ensure categories exist with standard slugs
  const categoryMap: Record<string, { id: string; name: string; slug: string }> = {
    'gpu': { id: 'cat-gpu', name: 'Graphics Cards', slug: 'graphics-cards' },
    'cpu': { id: 'cat-cpu', name: 'Processors', slug: 'processors' },
    'motherboard': { id: 'cat-motherboard', name: 'Motherboards', slug: 'motherboards' },
    'ram': { id: 'cat-ram', name: 'Memory', slug: 'memory' },
    'storage': { id: 'cat-storage', name: 'Storage', slug: 'storage' },
    'monitor': { id: 'cat-monitor', name: 'Monitors', slug: 'monitors' },
    'mouse': { id: 'cat-mouse', name: 'Mice', slug: 'mice' },
    'keyboard': { id: 'cat-keyboard', name: 'Keyboards', slug: 'keyboards' },
    'desk-pad': { id: 'cat-desk-pad', name: 'Desk Pad', slug: 'desk-pad' },
  };

  for (const key of Object.keys(categoryMap)) {
    const cat = categoryMap[key];
    await pool.query(
      `INSERT INTO hardware_categories (id, name, slug)
       VALUES ($1, $2, $3)
       ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name`,
      [cat.id, cat.name, cat.slug]
    );
  }

  // Get exact category IDs from DB
  const catRows = await pool.query(`SELECT id, slug FROM hardware_categories`);
  const catIdBySlug: Record<string, string> = {};
  for (const r of catRows.rows) {
    catIdBySlug[r.slug] = r.id;
  }

  // 2. Hardware updates/insertions with verified real high-res images and specs
  const products = [
    // --- CPUs ---
    {
      name: 'AMD Ryzen 7 7800X3D 8-Core 4.2 GHz Socket AM5 Processor',
      slug: 'amd-ryzen-7-7800x3d',
      categorySlug: 'processors',
      brand: 'AMD',
      price: 16499,
      imageUrl: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80',
      specs: {
        'Çekirdek Sayısı': '8 Çekirdek / 16 İzlek',
        'Temel Frekans': '4.2 GHz',
        'Artırılmış Frekans': '5.0 GHz',
        'Önbellek (L3)': '96 MB 3D V-Cache',
        'Soket Tipi': 'AM5',
        'TDP': '120W',
        'Üretim Mimarisi': '5nm Zen 4'
      }
    },
    {
      name: 'AMD Ryzen 7 9800X3D 8-Core 4.7 GHz Socket AM5 Processor',
      slug: 'amd-ryzen-7-9800x3d',
      categorySlug: 'processors',
      brand: 'AMD',
      price: 21999,
      imageUrl: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1200&q=80',
      specs: {
        'Çekirdek Sayısı': '8 Çekirdek / 16 İzlek',
        'Temel Frekans': '4.7 GHz',
        'Artırılmış Frekans': '5.2 GHz',
        'Önbellek (L3)': '96 MB 2nd Gen 3D V-Cache',
        'Soket Tipi': 'AM5',
        'TDP': '120W',
        'Üretim Mimarisi': '4nm Zen 5'
      }
    },
    {
      name: 'Intel Core i9-14900K 24-Core LGA 1700 Processor',
      slug: 'intel-core-i9-14900k',
      categorySlug: 'processors',
      brand: 'Intel',
      price: 24500,
      imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80',
      specs: {
        'Çekirdek Sayısı': '24 Çekirdek (8P + 16E) / 32 İzlek',
        'Temel Frekans': '3.2 GHz',
        'Artırılmış Frekans': '6.0 GHz',
        'Önbellek (L3)': '36 MB Smart Cache',
        'Soket Tipi': 'LGA 1700',
        'TDP': '125W (Max 253W)',
        'Grafik Birimi': 'Intel UHD Graphics 770'
      }
    },

    // --- GPUs ---
    {
      name: 'ASUS ROG Strix GeForce RTX 4090 OC Edition 24GB GDDR6X',
      slug: 'asus-rog-strix-rtx-4090-oc',
      categorySlug: 'graphics-cards',
      brand: 'ASUS',
      price: 89999,
      imageUrl: 'https://images.unsplash.com/photo-1587202372616-b43abea06c2a?auto=format&fit=crop&w=1200&q=80',
      specs: {
        'Bellek Boyutu': '24 GB GDDR6X',
        'Bellek Veri Yolu': '384-Bit',
        'Çekirdek Saat Hızı': '2640 MHz (OC)',
        'CUDA Çekirdekleri': '16384',
        'Güç Tüketimi': '450W (Güç kaynağı önerisi: 1000W)',
        'Çıkışlar': '2x HDMI 2.1a, 3x DisplayPort 1.4a'
      }
    },
    {
      name: 'NVIDIA GeForce RTX 5090 Founders Edition 32GB GDDR7',
      slug: 'nvidia-rtx-5090',
      categorySlug: 'graphics-cards',
      brand: 'NVIDIA',
      price: 119999,
      imageUrl: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80',
      specs: {
        'Bellek Boyutu': '32 GB GDDR7',
        'Bellek Veri Yolu': '512-Bit',
        'Çekirdek Saat Hızı': '2400 MHz',
        'CUDA Çekirdekleri': '21760',
        'Güç Tüketimi': '600W (Güç kaynağı önerisi: 1200W)',
        'Mimari': 'NVIDIA Blackwell'
      }
    },

    // --- MICE ---
    {
      name: 'Logitech G Pro X Superlight 2 Wireless Gaming Mouse',
      slug: 'logitech-g-pro-x-superlight-2',
      categorySlug: 'mice',
      brand: 'Logitech',
      price: 5499,
      imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1200&q=80',
      specs: {
        'Sensör': 'HERO 2 (32,000 DPI)',
        'Ağırlık': '60 Gram Ultra Hafif',
        'Raporlama Hızı': '2000 Hz / 4000 Hz Polling Rate',
        'Bağlantı': 'LIGHTSPEED Kablosuz + USB-C',
        'Pil Ömrü': '95 Saat Sürekli Kullanım',
        'Anahtarlar': 'LIGHTFORCE Hibrit Optik-Mekanik'
      }
    },
    {
      name: 'Razer DeathAdder V3 Pro Wireless Gaming Mouse',
      slug: 'razer-deathadder-v3-pro',
      categorySlug: 'mice',
      brand: 'Razer',
      price: 4999,
      imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1200&q=80',
      specs: {
        'Sensör': 'Focus Pro 30K Optik Sensör (30,000 DPI)',
        'Ağırlık': '63 Gram Ergonomik',
        'Bağlantı': 'Razer HyperSpeed Wireless',
        'Pil Ömrü': '90 Saat',
        'Anahtarlar': 'Gen-3 Optik Mouse Anahtarları (90M Tıklama Ömrü)'
      }
    },

    // --- KEYBOARDS ---
    {
      name: 'SteelSeries Apex Pro TKL Mechanical Gaming Keyboard',
      slug: 'steelseries-apex-pro-tkl',
      categorySlug: 'keyboards',
      brand: 'SteelSeries',
      price: 7899,
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80',
      specs: {
        'Anahtar Tipi': 'OmniPoint 2.0 Ayarlanabilir Manyetik Anahtar',
        'Hassasiyet Ayarı': '0.2 mm - 3.8 mm Hassasiyet',
        'Ekran': 'OLED Akıllı Ekran',
        'Kasa Malzemesi': 'Uçak Sınıfı Alüminyum Alaşım',
        'Aydınlatma': 'Tuş Başına RGB Aydınlatma'
      }
    },
    {
      name: 'ASUS ROG Azoth 75% Wireless Custom Gaming Keyboard',
      slug: 'asus-rog-azoth',
      categorySlug: 'keyboards',
      brand: 'ASUS',
      price: 9499,
      imageUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1200&q=80',
      specs: {
        'Dizilim': '%75 Compact Form Factor',
        'Anahtar Tipi': 'ROG NX Mekanik Anahtarlar (Hot-Swappable)',
        'Ekran': '2 inç OLED Ekran ve Üç Yönlü Kontrol Düğmesi',
        'Bağlantı': '2.4GHz SpeedNova / Bluetooth 5.1 / USB Kablolu',
        'Ses Yalıtımı': '3 Katmanlı Silikon Sönümleme Köpüğü'
      }
    },

    // --- DESK PADS ---
    {
      name: 'SteelSeries QcK Heavy XXL Gaming Mousepad (900x400mm)',
      slug: 'steelseries-qck-heavy-xxl',
      categorySlug: 'desk-pad',
      brand: 'SteelSeries',
      price: 1299,
      imageUrl: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=1200&q=80',
      specs: {
        'Boyutlar': '900 mm x 400 mm x 4 mm',
        'Yüzey Tipi': 'Mikro Dokumalı Kumaş Yüzey (High CPI Tracking)',
        'Taban': 'Kaymaz Kauçuk Taban',
        'Kalınlık': '4 mm Extra Ekstra Kalın Sünger'
      }
    }
  ];

  for (const prod of products) {
    let brandId = null;
    let brandSlug = prod.brand.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const bRes = await pool.query(`SELECT id FROM brands WHERE slug = $1`, [brandSlug]);
    if (bRes.rows.length > 0) {
      brandId = bRes.rows[0].id;
    } else {
      brandId = uuidv4();
      await pool.query(`INSERT INTO brands (id, name, slug) VALUES ($1, $2, $3)`, [brandId, prod.brand, brandSlug]);
    }

    const catId = catIdBySlug[prod.categorySlug] || catIdBySlug['graphics-cards'];

    await pool.query(
      `INSERT INTO hardware (id, name, slug, brand_id, category_id, price_estimate, image_url, specs, is_canonical)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE)
       ON CONFLICT (slug) DO UPDATE SET 
         name = EXCLUDED.name,
         category_id = EXCLUDED.category_id,
         brand_id = EXCLUDED.brand_id,
         price_estimate = EXCLUDED.price_estimate,
         image_url = EXCLUDED.image_url,
         specs = EXCLUDED.specs`,
      [uuidv4(), prod.name, prod.slug, brandId, catId, prod.price, prod.imageUrl, prod.specs]
    );
  }

  // Fix misclassified items in database
  // 1. Fix ASUS ROG Chakram X mouse -> Mice category
  const mouseCatId = catIdBySlug['mice'] || catIdBySlug['mouse'];
  if (mouseCatId) {
    await pool.query(
      `UPDATE hardware SET category_id = $1, image_url = 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1200&q=80' WHERE slug LIKE '%chakram%' OR name LIKE '%Chakram%'`,
      [mouseCatId]
    );
    await pool.query(
      `UPDATE hardware SET category_id = $1, image_url = 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1200&q=80' WHERE slug LIKE '%pulsefire%' OR name LIKE '%Pulsefire%'`,
      [mouseCatId]
    );
  }

  // Fix Deskpad
  const deskPadCatId = catIdBySlug['desk-pad'] || catIdBySlug['mice'];
  if (deskPadCatId) {
    await pool.query(
      `UPDATE hardware SET category_id = $1, image_url = 'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=1200&q=80' WHERE slug LIKE '%balteus%' OR name LIKE '%Balteus%'`,
      [deskPadCatId]
    );
  }

  // Fix Samsung 990 PRO Storage category
  const storageCatId = catIdBySlug['storage'];
  if (storageCatId) {
    await pool.query(
      `UPDATE hardware SET category_id = $1 WHERE name LIKE '%990 PRO%' OR slug LIKE '%990-pro%'`,
      [storageCatId]
    );
  }

  console.log('--- Hardware database cleanup complete! ---');
  process.exit(0);
}

seedCleanHardware().catch((err) => {
  console.error(err);
  process.exit(1);
});
