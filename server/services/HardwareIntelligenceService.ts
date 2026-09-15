import { GoogleGenAI, Type } from '@google/genai';
import { HardwareCategoryEnum } from '../../src/types.js';
import { pool } from '../shared/database.js';
import { randomUUID } from 'node:crypto';
const uuidv4 = randomUUID;

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export class HardwareIntelligenceService {
  async normalizeHardwareData(rawText: string, sourceName: string) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is missing');
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: `You are an expert PC hardware normalizer and web research AI. Analyze the following raw hardware data from ${sourceName} and normalize it into the strictly requested schema. 
CRITICAL REQUIREMENTS:
1. Estimate current Turkish retail market price in Turkish Lira (TRY / TL) taking into account local hardware taxes and margins in priceEstimateTry.
2. Translate all technical spec keys and descriptions into clear, accurate Turkish (e.g., 'Çekirdek Sayısı', 'Bellek Miktarı', 'Soket Tipi', 'TDP').
3. Find an exact, direct high-resolution image URL or product photograph for this specific product in imageUrl.
4. Categorize accurately into one of the allowed categories (CPU, GPU, MOTHERBOARD, RAM, STORAGE_SSD, MONITOR, KEYBOARD, MOUSE, CHAIR, DESK_PAD, etc.).

RAW DATA:
${rawText}` }] }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            category: { type: Type.STRING, enum: [...HardwareCategoryEnum] },
            brand: { type: Type.STRING },
            isCanonical: { type: Type.BOOLEAN },
            parentCanonicalName: { type: Type.STRING, nullable: true },
            variantType: { type: Type.STRING, nullable: true },
            specs: { type: Type.OBJECT, description: "Detailed specs dictionary in Turkish for this component" },
            confidenceScore: { type: Type.NUMBER },
            priceEstimateTry: { type: Type.NUMBER, description: "Estimated Turkish retail price in Turkish Lira (TRY) including VAT and local retailer margin" },
            imageUrl: { type: Type.STRING, description: "Direct high resolution image URL of the hardware item" }
          },
          required: ['name', 'category', 'brand', 'isCanonical', 'specs', 'confidenceScore', 'priceEstimateTry']
        },
        temperature: 0.1
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error('No response from Gemini');
    
    const parsed = JSON.parse(resultText);
    return parsed;
  }

  async ingestRawData(rawText: string, sourceName: string) {
    const normalized = await this.normalizeHardwareData(rawText, sourceName);
    
    // Default fallback image by category if Gemini didn't find direct image URL
    let categoryImage = normalized.imageUrl;
    if (!categoryImage || !categoryImage.startsWith('http')) {
      const catUpper = (normalized.category || '').toUpperCase();
      if (catUpper === 'MOUSE') categoryImage = 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1200&q=80';
      else if (catUpper === 'KEYBOARD') categoryImage = 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80';
      else if (catUpper === 'CPU') categoryImage = 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80';
      else if (catUpper === 'GPU') categoryImage = 'https://images.unsplash.com/photo-1587202372616-b43abea06c2a?auto=format&fit=crop&w=1200&q=80';
      else if (catUpper === 'MONITOR') categoryImage = 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80';
      else if (catUpper === 'MOTHERBOARD') categoryImage = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80';
      else if (catUpper === 'RAM') categoryImage = 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1200&q=80';
      else if (catUpper === 'STORAGE_SSD' || catUpper === 'STORAGE_HDD') categoryImage = 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1200&q=80';
      else categoryImage = 'https://images.unsplash.com/photo-1587202372616-b43abea06c2a?auto=format&fit=crop&w=1200&q=80';
    }

    // Save to Database
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      let brandId = null;
      if (normalized.brand) {
        let brandSlug = normalized.brand.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const brandRes = await client.query('SELECT id FROM brands WHERE slug = $1', [brandSlug]);
        if (brandRes.rows.length > 0) {
          brandId = brandRes.rows[0].id;
        } else {
          brandId = uuidv4();
          await client.query('INSERT INTO brands (id, name, slug) VALUES ($1, $2, $3)', [brandId, normalized.brand, brandSlug]);
        }
      }

      let categoryId = null;
      if (normalized.category) {
        let catSlug = normalized.category.toLowerCase().replace(/[^a-z0-9]/g, '-');
        // Map category to standard category slugs in DB
        if (catSlug === 'mouse') catSlug = 'mice';
        else if (catSlug === 'keyboard') catSlug = 'keyboards';
        else if (catSlug === 'cpu') catSlug = 'processors';
        else if (catSlug === 'gpu') catSlug = 'graphics-cards';
        else if (catSlug === 'motherboard') catSlug = 'motherboards';
        else if (catSlug === 'ram') catSlug = 'memory';
        else if (catSlug === 'monitor') catSlug = 'monitors';

        const catRes = await client.query('SELECT id FROM hardware_categories WHERE slug = $1', [catSlug]);
        if (catRes.rows.length > 0) {
          categoryId = catRes.rows[0].id;
        } else {
          categoryId = uuidv4();
          await client.query('INSERT INTO hardware_categories (id, name, slug) VALUES ($1, $2, $3)', [categoryId, normalized.category, catSlug]);
        }
      }

      const slug = normalized.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const hwId = uuidv4();
      
      let parentHardwareId = null;
      if (!normalized.isCanonical && normalized.parentCanonicalName) {
        const parentSlug = normalized.parentCanonicalName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const parentRes = await client.query('SELECT id FROM hardware WHERE slug = $1', [parentSlug]);
        if (parentRes.rows.length > 0) {
          parentHardwareId = parentRes.rows[0].id;
        }
      }

      await client.query(
        `INSERT INTO hardware (id, name, slug, brand_id, category_id, specs, parent_hardware_id, is_canonical, variant_type, price_estimate, image_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (slug) DO UPDATE SET 
           specs = EXCLUDED.specs, 
           is_canonical = EXCLUDED.is_canonical, 
           price_estimate = EXCLUDED.price_estimate,
           image_url = COALESCE(EXCLUDED.image_url, hardware.image_url),
           category_id = EXCLUDED.category_id`,
        [hwId, normalized.name, slug, brandId, categoryId, normalized.specs, parentHardwareId, normalized.isCanonical, normalized.variantType, normalized.priceEstimateTry || 0, categoryImage]
      );
      
      await client.query('COMMIT');
      return { status: 'success', normalized, id: hwId };
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  async searchAndIngestHardware(componentName: string) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is missing');
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{
        role: 'user',
        parts: [{
          text: `Search the web using Google Search and find the precise official specifications, image photo URL, and current Turkish market pricing for this PC component: "${componentName}".
Normalize these specifications into Turkish (e.g. 'Çekirdek Sayısı', 'Bellek Miktarı', 'Soket Tipi', 'TDP', 'Sensör', 'DPI', etc.), find the current retail Turkish price in TL (TRY) incorporating Turkish VAT and margin, and return a JSON matching the requested schema.
CRITICAL TASK FOR IMAGE:
Find an exact direct URL to an official product photograph or image for "${componentName}" in imageUrl.
CRITICAL TASK FOR CATEGORY:
Detect the exact hardware component category (CPU, GPU, MOTHERBOARD, RAM, STORAGE_SSD, MONITOR, KEYBOARD, MOUSE, CHAIR, DESK_PAD, etc.).
Do not hallucinate; use real web search results.`
        }]
      }],
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            category: { type: Type.STRING, enum: [...HardwareCategoryEnum] },
            brand: { type: Type.STRING },
            isCanonical: { type: Type.BOOLEAN },
            parentCanonicalName: { type: Type.STRING, nullable: true },
            variantType: { type: Type.STRING, nullable: true },
            specs: { type: Type.OBJECT, description: "Detailed specs dictionary in Turkish for this hardware component" },
            confidenceScore: { type: Type.NUMBER },
            priceEstimateTry: { type: Type.NUMBER, description: "Estimated local Turkish retail store price in Turkish Lira (TRY) including Turkish VAT and distributor margin" },
            imageUrl: { type: Type.STRING, description: "Direct high resolution product image URL" }
          },
          required: ['name', 'category', 'brand', 'isCanonical', 'specs', 'confidenceScore', 'priceEstimateTry']
        },
        temperature: 0.1
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error('No response from Gemini Search Grounding');

    return await this.ingestRawData(resultText, 'Gemini Web Search Grounding');
  }

  async analyzeSetup(hardwareComponents: any[], resolution: string, game: string) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is missing');
    }

    const componentListText = hardwareComponents.map(c => `- ${c.category}: ${c.name} (${c.brand})`).join('\n');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{
        role: 'user',
        parts: [{
          text: `You are an expert PC hardware analyst. Analyze this hardware setup for gaming at ${resolution} specifically in ${game}.
          
SETUP:
${componentListText}

Provide a comprehensive analysis including:
1. Bottleneck Analysis: Which component is the bottleneck and by what percentage? (estimate realistically based on current benchmarks).
2. FPS Estimation: Realistic average FPS for ${game} at ${resolution} on High/Ultra settings.
3. Compatibility: Are these parts compatible? Any issues?
4. System Scores: Give scores (0-100) for Overall, Gaming, Productivity, and Upgradability.
5. Upgrade Recommendation: What should be upgraded next and why?
6. Knowledge Graph: Identify key relationships for these components (e.g., RECOMMENDED_PAIRING, BOTTLENECKED_BY).

CRITICAL INSTRUCTIONS FOR PERSONA & LANGUAGE:
- TÜM YANITLARI KESİNLİKLE TÜRKÇE VER! (All textual responses must be in Turkish).
- Mizahi, eğlenceli ve biraz iddialı/övünen bir dil kullan. ("PCPartPicker ağlıyor şu an", "Reddit'teki amatörler bunu yapamadı", "Bizim algoritmamız ezer geçer" gibi espriler yap).
- İşlemcinin gücünü ve ekran kartı ile olan darboğaz oranını komik ve abartılı benzetmelerle (ama doğru matematiksel hesaplamalarla) anlat.
- Kullanıcıya donanımın gerçek kapasitesini esprili bir dille öğret ve bizim devasa veritabanımızla ne kadar kusursuz bir iş çıkardığımızı vurgula.

CRITICAL PHYSICAL COHERENCE RULES FOR FPS ESTIMATION:
- Higher resolutions (e.g., 4K) MUST have lower FPS than lower resolutions (e.g., 1080p).
- 1080p FPS is the baseline highest value. 1440p FPS should be roughly 60-80% of 1080p FPS. 4K FPS should be roughly 30-50% of 1080p FPS.
- For a low/mid-tier GPU like a GTX 1660 Super, GTX 1660, or RTX 3050: It is physically impossible to get high FPS at 4K. At 4K, it should get less than 15-20 FPS (unplayable slides), while at 1080p it can get 60-85 FPS.
- For a high-tier GPU like RTX 4090 or RTX 5090: It can easily get 140+ FPS at 4K, and 200+ FPS at 1080p.
- Ensure the FPS estimation you output is physically realistic and calibrated to this pairing. Do not hallucinate high 4K FPS with a low-end GPU!

Output MUST match the requested JSON schema.`
        }]
      }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bottleneck: {
              type: Type.OBJECT,
              properties: {
                percentage: { type: Type.NUMBER, description: "Bottleneck percentage (0-100)" },
                componentCategory: { type: Type.STRING, description: "Category causing the bottleneck (e.g., CPU, GPU)" },
                status: { type: Type.STRING, description: "Short status like 'Excellent', 'Minor CPU Bottleneck'" },
                explanation: { type: Type.STRING }
              },
              required: ['percentage', 'componentCategory', 'status', 'explanation']
            },
            fpsEstimation: {
              type: Type.OBJECT,
              properties: {
                averageFps: { type: Type.NUMBER },
                game: { type: Type.STRING },
                resolution: { type: Type.STRING }
              },
              required: ['averageFps', 'game', 'resolution']
            },
            compatibility: {
              type: Type.OBJECT,
              properties: {
                isCompatible: { type: Type.BOOLEAN },
                issues: { type: Type.ARRAY, items: { type: Type.STRING } },
                note: { type: Type.STRING }
              },
              required: ['isCompatible', 'issues', 'note']
            },
            scores: {
              type: Type.OBJECT,
              properties: {
                overall: { type: Type.NUMBER },
                gaming: { type: Type.NUMBER },
                productivity: { type: Type.NUMBER },
                upgradability: { type: Type.NUMBER }
              },
              required: ['overall', 'gaming', 'productivity', 'upgradability']
            },
            upgradeRecommendation: {
              type: Type.OBJECT,
              properties: {
                priority: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
                targetCategory: { type: Type.STRING },
                reason: { type: Type.STRING },
                expectedGain: { type: Type.STRING }
              },
              required: ['priority', 'targetCategory', 'reason', 'expectedGain']
            },
            graphConnections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sourceCategory: { type: Type.STRING },
                  targetCategory: { type: Type.STRING },
                  targetName: { type: Type.STRING },
                  relationType: { type: Type.STRING, enum: ['COMPATIBLE_WITH', 'RECOMMENDED_PAIRING', 'POWERED_BY', 'BOTTLENECKED_BY', 'UPGRADE_TO', 'USED_FOR'] }
                },
                required: ['sourceCategory', 'targetCategory', 'targetName', 'relationType']
              }
            }
          },
          required: ['bottleneck', 'fpsEstimation', 'compatibility', 'scores', 'upgradeRecommendation', 'graphConnections']
        },
        temperature: 0.1
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error('No response from Gemini');
    
    return JSON.parse(resultText);
  }

  async getHardwareSpecsForAI(slugOrId: string): Promise<string | null> {
    try {
      const { rows } = await pool.query(
        `SELECT h.name, hc.name as category, h.specs 
         FROM hardware h
         LEFT JOIN hardware_categories hc ON h.category_id = hc.id
         WHERE h.slug = $1 OR h.id = $1 OR h.icecat_id::text = $1 LIMIT 1`,
        [slugOrId]
      );
      if (rows.length === 0) return null;
      
      const hw = rows[0];
      return `Donanım: ${hw.name}, Kategori: ${hw.category || 'Belirtilmedi'}, Teknik Özellikler: ${JSON.stringify(hw.specs)}`;
    } catch (err) {
      console.error('Error fetching specs for AI:', err);
      return null;
    }
  }
}

export const hardwareIntelligenceService = new HardwareIntelligenceService();
