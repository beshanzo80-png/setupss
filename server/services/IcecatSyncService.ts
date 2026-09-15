import { pool } from '../../server-db.js';
import cron from 'node-cron';
import { GoogleGenAI } from '@google/genai';

export class IcecatSyncService {
  private get username(): string {
    return process.env.ICECAT_USERNAME || '';
  }

  private get geminiApiKey(): string {
    return process.env.GEMINI_API_KEY || '';
  }

  // Helper to wait
  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Generates candidate product codes / model numbers from a verbose hardware title
   */
  private extractProductCodeCandidates(name: string, brand?: string): string[] {
    const candidates: string[] = [];
    if (!name) return candidates;

    // 1. Direct exact name
    candidates.push(name.trim());

    // 2. Remove common marketing filler words
    let clean = name
      .replace(new RegExp(`^${brand}\\s+`, 'i'), '')
      .replace(/\b(Processor|Gaming|Wireless|Mechanical Keyboard|Gaming Mouse|Founders Edition|OC Edition|Socket|Graphics Card|Motherboard)\b/gi, '')
      .replace(/\b(\d+(\.\d+)?\s*GHz|\d+\s*-Core|\d+\s*GB\s*GDDR\w*|LGA\s*\d+|AM\d+)\b/gi, '')
      .trim();

    if (clean && clean !== name) {
      candidates.push(clean);
    }

    // 3. Extract core model identifiers (e.g. 7800X3D, 14900K, RTX 4090, Superlight 2, B650, Z790)
    const modelMatches = name.match(/\b(Ryzen\s*\d+\s*\d+\w*|Core\s*i[3579]-\w+|RTX\s*\d+\w*|RX\s*\d+\w*|B\d{3}\w*|Z\d{3}\w*|X\d{3}\w*|Superlight\s*\d*|Apex\s*Pro\s*\w*)\b/gi);
    if (modelMatches) {
      for (const m of modelMatches) {
        if (!candidates.includes(m)) candidates.push(m);
      }
    }

    return Array.from(new Set(candidates.filter(c => c.length >= 3)));
  }

  /**
   * Fetch a single product from Icecat by GTIN (EAN) or Brand + ProductCode
   */
  async fetchProductFromIcecat(params: { gtin?: string; brand?: string; productCode?: string }): Promise<any | null> {
    if (!this.username) {
      return null;
    }

    let url = `https://live.icecat.biz/api/?UserName=${encodeURIComponent(this.username)}&Language=en`;
    
    if (params.gtin) {
      url += `&GTIN=${encodeURIComponent(params.gtin)}`;
    } else if (params.brand && params.productCode) {
      url += `&Brand=${encodeURIComponent(params.brand)}&ProductCode=${encodeURIComponent(params.productCode)}`;
    } else {
      return null;
    }

    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(6000) });
      if (!response.ok) {
        return null;
      }
      const data = await response.json();
      
      if (data && (data.StatusCode === 1 || (data.msg === 'OK' && data.data))) {
        return data.data;
      }
      
      // Expected product not found in Icecat (StatusCode === 0) - return null cleanly without spamming errors
      return null;
    } catch {
      // Network timeout or unresolvable DNS - return null cleanly
      return null;
    }
  }

  /**
   * Parse the FeaturesGroups array into a clean key-value object for our JSONB specs
   */
  private extractSpecs(featuresGroups: any[]): Record<string, string> {
    const specs: Record<string, string> = {};
    if (!featuresGroups || !Array.isArray(featuresGroups)) return specs;

    for (const group of featuresGroups) {
      const features = group.Features || [];
      for (const feature of features) {
        const key = feature.Feature?.Name?.Value;
        const value = feature.Value;
        if (key && value) {
          specs[key] = String(value);
        }
      }
    }
    return specs;
  }

  /**
   * Generates rich hardware specifications via Gemini AI when Icecat does not have an exact XML match
   */
  private async generateSpecsWithAI(name: string, brand?: string, category?: string): Promise<Record<string, string>> {
    if (!this.geminiApiKey) {
      return {
        'Model': name,
        'Marka': brand || 'Genel',
        'Durum': 'Katalogda Kayıtlı'
      };
    }

    try {
      const ai = new GoogleGenAI({ 
        apiKey: this.geminiApiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      const prompt = `You are a PC hardware architect for Setupss. Provide a concise, highly accurate technical specifications key-value dictionary in Turkish for this PC component:
Hardware: "${name}"
Brand: "${brand || 'Bilinmiyor'}"
Category: "${category || 'Bilinmiyor'}"

Examples of specs in Turkish:
For CPU: "Çekirdek Sayısı": "8", "İş Parçacığı": "16", "Temel Frekans": "4.2 GHz", "Turbo Frekans": "5.0 GHz", "Soket": "AM5", "TDP": "120W", "L3 Önbellek": "96MB 3D V-Cache"
For GPU: "Bellek Boyutu": "24 GB", "Bellek Türü": "GDDR6X", "Arayüz": "PCIe 4.0 x16", "CUDA Çekirdeği": "16384", "TGP": "450W"
For Mouse: "Sensör": "HERO 2", "DPI": "32000", "Ağırlık": "60g", "Bağlantı": "Kablosuz Lightspeed"
For Keyboard: "Switch": "OmniPoint 2.0", "Düzen": "TKL (%80)", "Aydınlatma": "RGB", "Bağlantı": "Kablolu / Kablosuz"

Output STRICT JSON key-value object with 4 to 8 essential specs. Keys and values must be concise Turkish strings.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1
        }
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        if (typeof parsed === 'object' && parsed !== null && Object.keys(parsed).length > 0) {
          return parsed;
        }
      }
    } catch (err: any) {
      console.warn(`[Hardware Graph Fallback] AI spec generation skipped for ${name}:`, err?.message || err);
    }

    return {
      'Model': name,
      'Marka': brand || 'Genel',
      'Durum': 'Katalogda Doğrulandı'
    };
  }

  /**
   * Enrich existing hardware in the database that is missing specs or icecat_id
   */
  async enrichDatabase() {
    console.log('🤖 [Hardware Knowledge Graph Bot] Starting database enrichment cycle...');
    
    try {
      // Find hardware that lacks icecat_id and has empty/unpopulated specs
      const { rows } = await pool.query(`
        SELECT h.id, h.name, h.ean, h.image_url, b.name as brand_name, hc.name as category_name 
        FROM hardware h
        LEFT JOIN brands b ON h.brand_id = b.id
        LEFT JOIN hardware_categories hc ON h.category_id = hc.id
        WHERE (h.icecat_id IS NULL AND (h.specs IS NULL OR h.specs = '{}'::jsonb OR h.specs = 'null'::jsonb))
        LIMIT 25
      `);

      if (rows.length === 0) {
        console.log('🤖 [Hardware Knowledge Graph Bot] Database is fully enriched with hardware specs. No pending items.');
        return;
      }

      console.log(`🤖 [Hardware Knowledge Graph Bot] Found ${rows.length} hardware items to enrich.`);

      let successCount = 0;

      for (const hw of rows) {
        let icecatData = null;

        // Attempt 1: by EAN (GTIN) if we have it
        if (hw.ean && this.username) {
          icecatData = await this.fetchProductFromIcecat({ gtin: hw.ean });
        }
        
        // Attempt 2: by candidate product codes on Icecat
        if (!icecatData && hw.brand_name && this.username) {
          const candidates = this.extractProductCodeCandidates(hw.name, hw.brand_name);
          for (const cand of candidates) {
            icecatData = await this.fetchProductFromIcecat({ brand: hw.brand_name, productCode: cand });
            if (icecatData) break;
          }
        }

        if (icecatData) {
          const icecatId = icecatData.GeneralInfo?.IcecatId;
          const ean = icecatData.GeneralInfo?.GTIN?.[0] || hw.ean;
          const specsDict = this.extractSpecs(icecatData.FeaturesGroups);
          const imageUrl = icecatData.Image?.HighPic || icecatData.GeneralInfo?.ImageUrl || hw.image_url;

          if (icecatId) {
            await pool.query(`
              UPDATE hardware 
              SET 
                icecat_id = $1,
                ean = COALESCE($2, ean),
                specs = $3,
                image_url = COALESCE(image_url, $4),
                updated_at = NOW()
              WHERE id = $5
            `, [icecatId, ean, JSON.stringify(specsDict), imageUrl, hw.id]);
            
            console.log(`   ✅ [Icecat] Enriched: ${hw.name} (Icecat ID: ${icecatId}, ${Object.keys(specsDict).length} specs)`);
            successCount++;
          }
        } else {
          // Fallback to Gemini AI Hardware Knowledge Graph Engine
          const aiSpecs = await this.generateSpecsWithAI(hw.name, hw.brand_name, hw.category_name);
          await pool.query(`
            UPDATE hardware 
            SET 
              specs = $1,
              updated_at = NOW()
            WHERE id = $2
          `, [JSON.stringify(aiSpecs), hw.id]);

          console.log(`   🧠 [Hardware Knowledge Graph] Enriched: ${hw.name} (${Object.keys(aiSpecs).length} specs populated)`);
          successCount++;
        }

        // Polite delay
        await this.sleep(400);
      }

      console.log(`🤖 [Hardware Knowledge Graph Bot] Cycle complete. Successfully enriched ${successCount}/${rows.length} items.`);

    } catch (err: any) {
      console.error('🤖 [Hardware Knowledge Graph Bot] Error during enrichment cycle:', err.message);
    }
  }

  /**
   * Add specific test products to jumpstart the database if empty
   */
  async seedPopularHardware() {
    if (!this.username) {
      return;
    }
    const popularItems = [
      // Motherboards
      { brand: 'ASUS', productCode: '90MB14S0-M0EAY0', categorySlug: 'motherboards', expectedName: 'ASUS ROG STRIX B550-F GAMING' },
      { brand: 'ASUS', productCode: '90MB18K0-M0EAY0', categorySlug: 'motherboards', expectedName: 'ASUS ROG STRIX Z690-A GAMING WIFI D4' },
      { brand: 'MSI', productCode: '7C56-003R', categorySlug: 'motherboards', expectedName: 'MSI MPG B550 GAMING PLUS' },
      { brand: 'MSI', productCode: '7D75-001R', categorySlug: 'motherboards', expectedName: 'MSI MAG B650 TOMAHAWK WIFI' },
      { brand: 'Gigabyte', productCode: 'B650 AORUS ELITE AX', categorySlug: 'motherboards', expectedName: 'Gigabyte B650 AORUS ELITE AX' },
      
      // Graphics Cards
      { brand: 'ASUS', productCode: '90YV0FA7-M0NM00', categorySlug: 'graphics-cards', expectedName: 'ASUS ROG Strix RTX 3080' },
      { brand: 'MSI', productCode: 'V513-002R', categorySlug: 'graphics-cards', expectedName: 'MSI GeForce RTX 4070 Ti GAMING X TRIO 12G' },
      { brand: 'MSI', productCode: 'V397-019R', categorySlug: 'graphics-cards', expectedName: 'MSI GeForce RTX 3060 GAMING X 12G' },
      { brand: 'Gigabyte', productCode: 'GV-N4090GAMING OC-24GD', categorySlug: 'graphics-cards', expectedName: 'Gigabyte GeForce RTX 4090 GAMING OC 24G' },
      { brand: 'Gigabyte', productCode: 'GV-N3060GAMING OC-12GD 2.0', categorySlug: 'graphics-cards', expectedName: 'Gigabyte GeForce RTX 3060 GAMING OC 12G 2.0' },
      
      // Storage
      { brand: 'Samsung', productCode: 'MZ-V8P1T0BW', categorySlug: 'storage', expectedName: 'Samsung 980 PRO 1TB' },
      { brand: 'Kingston', productCode: 'SKC3000S/1024G', categorySlug: 'storage', expectedName: 'Kingston KC3000 1TB' },
      { brand: 'Kingston', productCode: 'SNV2S/1000G', categorySlug: 'storage', expectedName: 'Kingston NV2 1TB' },
      
      // Memory
      { brand: 'Kingston', productCode: 'KF552C40BBK2-32', categorySlug: 'memory', expectedName: 'Kingston FURY Beast DDR5 32GB' },
      
      // Monitors
      { brand: 'ASUS', productCode: '90LM06U0-B01370', categorySlug: 'monitors', expectedName: 'ASUS ROG Strix XG27AQ' },
      { brand: 'MSI', productCode: '9S6-3CA88A-028', categorySlug: 'monitors', expectedName: 'MSI Optix MAG274QRF-QD' },
      { brand: 'Gigabyte', productCode: 'M28U', categorySlug: 'monitors', expectedName: 'Gigabyte M28U' },
      { brand: 'Samsung', productCode: 'LC27G75TQSRXEN', categorySlug: 'monitors', expectedName: 'Samsung Odyssey G7' },
      { brand: 'Philips', productCode: '24M1N3200ZA/00', categorySlug: 'monitors', expectedName: 'Philips Momentum 24M1N3200ZA/00' },
      { brand: 'Dell', productCode: 'U2723QE', categorySlug: 'monitors', expectedName: 'Dell UltraSharp U2723QE' },
      
      // Peripherals
      { brand: 'ASUS', productCode: '90MP02N0-BMUA00', categorySlug: 'keyboards', expectedName: 'ASUS ROG Strix Flare II' },
      { brand: 'ASUS', productCode: '90MP0110-B0UA00', categorySlug: 'mice', expectedName: 'ASUS ROG Balteus (Mouse Pad)' },
      { brand: 'HP', productCode: '4P5P9AA', categorySlug: 'mice', expectedName: 'HyperX Pulsefire Haste' },
    ];

    try {
      const { rows: existing } = await pool.query(`SELECT COUNT(*) as count FROM hardware`);
      if (parseInt(existing[0].count) < 20) {
        const ensureCategoryAndBrand = async (catSlug: string, brandName: string) => {
           let catId = null;
           let brandId = null;
           try {
              const catRes = await pool.query(`SELECT id FROM hardware_categories WHERE slug = $1`, [catSlug]);
              if (catRes.rows.length > 0) catId = catRes.rows[0].id;
              else {
                 const name = catSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                 const newCat = await pool.query(`INSERT INTO hardware_categories (id, name, slug) VALUES (gen_random_uuid(), $1, $2) RETURNING id`, [name, catSlug]);
                 catId = newCat.rows[0].id;
              }
              const brandSlug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              const brandRes = await pool.query(`SELECT id FROM brands WHERE slug = $1`, [brandSlug]);
              if (brandRes.rows.length > 0) brandId = brandRes.rows[0].id;
              else {
                 const newBrand = await pool.query(`INSERT INTO brands (id, name, slug) VALUES (gen_random_uuid(), $1, $2) RETURNING id`, [brandName, brandSlug]);
                 brandId = newBrand.rows[0].id;
              }
           } catch {}
           return { catId, brandId };
        };

        let seededCount = 0;
        for (const item of popularItems) {
          const icecatData = await this.fetchProductFromIcecat({ brand: item.brand, productCode: item.productCode });
          if (icecatData) {
            const icecatId = icecatData.GeneralInfo?.IcecatId;
            const title = icecatData.GeneralInfo?.Title || item.expectedName;
            const specsDict = this.extractSpecs(icecatData.FeaturesGroups);
            const imageUrl = icecatData.Image?.HighPic || icecatData.GeneralInfo?.ImageUrl;
            const ean = icecatData.GeneralInfo?.GTIN?.[0] || null;
            
            if (icecatId) {
              const { catId, brandId } = await ensureCategoryAndBrand(item.categorySlug, item.brand);
              const slug = `seed-hw-${icecatId}`;
              await pool.query(`
                INSERT INTO hardware (id, name, slug, icecat_id, ean, specs, image_url, category_id, brand_id)
                VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8)
                ON CONFLICT (icecat_id) DO UPDATE SET
                  specs = EXCLUDED.specs,
                  image_url = EXCLUDED.image_url,
                  category_id = COALESCE(hardware.category_id, EXCLUDED.category_id),
                  brand_id = COALESCE(hardware.brand_id, EXCLUDED.brand_id)
              `, [title, slug, icecatId, ean, JSON.stringify(specsDict), imageUrl, catId, brandId]);
              
              seededCount++;
            }
          }
          await this.sleep(400);
        }
        if (seededCount > 0) {
          console.log(`🤖 [Hardware Knowledge Graph Bot] Successfully seeded ${seededCount} catalog items!`);
        }
      }
    } catch (err: any) {
      console.error('🤖 [Hardware Knowledge Graph Bot] Error seeding hardware:', err.message);
    }
  }

  /**
   * Start the background bot.
   * Runs seeding once on startup, then schedules nightly enrichment.
   */
  startCron() {
    console.log('🤖 [Hardware Knowledge Graph Bot] Initializing internal background bot...');
    
    // 1. Run seed check shortly after startup
    setTimeout(() => {
      this.seedPopularHardware().then(() => {
        // 2. Run an initial enrichment pass
        this.enrichDatabase();
      });
    }, 6000);

    // 3. Schedule cron job to run every night at 03:00 AM server time
    cron.schedule('0 3 * * *', () => {
      console.log('🌃 [Hardware Knowledge Graph Bot] Nightly cron job triggered at 03:00');
      this.enrichDatabase();
    });
    
    console.log('🤖 [Hardware Knowledge Graph Bot] Cron schedule registered (0 3 * * *).');
  }
}

export const icecatSyncBot = new IcecatSyncService();
