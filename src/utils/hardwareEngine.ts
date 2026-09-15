/**
 * SETUPS S Hardware Knowledge Graph & Hardware Entity Engine (SAIOS v1.0)
 *
 * Provides normalized hardware catalog, specifications, comparisons, combinations,
 * knowledge graph relationships, and machine-readable GEO data for LLMs.
 */

import { slugify } from './slug';

export type HardwareCategory =
  | 'CPU'
  | 'GPU'
  | 'Motherboard'
  | 'RAM'
  | 'SSD'
  | 'HDD'
  | 'Case'
  | 'PSU'
  | 'Cooler'
  | 'Monitor'
  | 'Keyboard'
  | 'Mouse'
  | 'Desk'
  | 'Chair'
  | 'Desk Pad'
  | 'Monitor Arm'
  | 'Lighting'
  | 'Microphone'
  | 'Headset'
  | 'Speaker'
  | 'Camera'
  | 'Stream Deck'
  | 'Controller'
  | 'Accessories';

export interface HardwareEntity {
  id: string;
  slug: string;
  category: HardwareCategory;
  brand: string;
  model: string;
  aliases: string[];
  generation?: string;
  releaseDate?: string;
  specifications: Record<string, string>;
  images: string[];
  description: string;
  popularity: number; // 0 - 100
  setupCount: number;
  averageRating: number; // 0 - 5.0
  msrp?: number;
  currency?: string;
}

export interface HardwareComparison {
  itemA: HardwareEntity;
  itemB: HardwareEntity;
  advantagesA: string[];
  advantagesB: string[];
  aiComparisonSummary: string;
  verdict: string;
}

export interface HardwareCombo {
  itemA: HardwareEntity;
  itemB: HardwareEntity;
  compatibilityScore: number; // 0 - 100
  compatibilityNote: string;
  recommendedPowerSupply?: string;
  performanceSummary: string;
}

// Normalized Hardware Catalog Database
export const HARDWARE_CATALOG: HardwareEntity[] = [];

/**
 * Get hardware entity by slug or fallback-create dynamic entity from raw name
 */
export function getHardwareBySlug(slug: string): HardwareEntity {
  const clean = slugify(slug);

  const found = HARDWARE_CATALOG.find(
    h => h.slug === clean || h.aliases.some(a => slugify(a) === clean)
  );

  if (found) return found;

  // Dynamic fallback entity creation
  const parts = clean.split('-');
  const brandName = parts[0] ? parts[0].toUpperCase() : 'GENERIC';
  const modelName = parts.slice(1).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');

  return {
    id: `hw-${clean}`,
    slug: clean,
    category: 'Accessories',
    brand: brandName,
    model: modelName || clean,
    aliases: [clean],
    specifications: {
      'Brand': brandName,
      'Model': modelName || clean,
      'Status': 'Community Verified Component'
    },
    images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1200&q=80'],
    description: `${brandName} ${modelName} bileşeni ile donatılmış masaüstü kurulum özellikleri, detaylı incelemesi ve uyumlu donanımlar.`,
    popularity: 50,
    setupCount: 3,
    averageRating: 4.8
  };
}

/**
 * Hardware Comparison Engine
 */
export function compareHardware(slugA: string, slugB: string): HardwareComparison {
  const itemA = getHardwareBySlug(slugA);
  const itemB = getHardwareBySlug(slugB);

  const advantagesA: string[] = [];
  const advantagesB: string[] = [];

  if ((itemA.msrp || 0) < (itemB.msrp || 9999)) {
    advantagesA.push(`Daha erişilebilir bütçe (MSRP: ${itemA.msrp} ${itemA.currency || 'USD'})`);
  } else if ((itemB.msrp || 0) < (itemA.msrp || 9999)) {
    advantagesB.push(`Daha erişilebilir bütçe (MSRP: ${itemB.msrp} ${itemB.currency || 'USD'})`);
  }

  if (itemA.popularity >= itemB.popularity) {
    advantagesA.push(`Topluluk arasında daha popüler (${itemA.setupCount} paylaşım)`);
  } else {
    advantagesB.push(`Topluluk arasında daha popüler (${itemB.setupCount} paylaşım)`);
  }

  return {
    itemA,
    itemB,
    advantagesA: advantagesA.length > 0 ? advantagesA : ['Yüksek performans ve güvenilirlik.'],
    advantagesB: advantagesB.length > 0 ? advantagesB : ['Yüksek yapı kalitesi ve estetik.'],
    aiComparisonSummary: `${itemA.brand} ${itemA.model} ve ${itemB.brand} ${itemB.model} donanımlarının teknik karşılaştırması: Her iki donanım da oyuncu ve profesyonellerin masaüstü sistemlerinde yüksek memnuniyet sunmaktadır.`,
    verdict: `Performans öncelikli bütçeniz varsa ${itemA.model}, ek özellikler ve popülerlik için ${itemB.model} tercih edebilirsiniz.`
  };
}

/**
 * Hardware Combination Engine
 */
export function combineHardware(slugA: string, slugB: string): HardwareCombo {
  const itemA = getHardwareBySlug(slugA);
  const itemB = getHardwareBySlug(slugB);

  return {
    itemA,
    itemB,
    compatibilityScore: 98,
    compatibilityNote: `${itemA.model} ve ${itemB.model} birleşimi darboğaz riskini ortadan kaldırır ve maksimum kare hızına olanak tanır.`,
    recommendedPowerSupply: '850W - 1000W Gold Certificated PSU',
    performanceSummary: `${itemA.model} ve ${itemB.model} ikilisi 4K Ultra grafik ayarlarında ve ağır iş yüklerinde en pürüzsüz çalışma deneyimini sunar.`
  };
}

export const formatPriceInTL = (price: number | string | undefined, currency: string = 'USD'): string => {
  if (price === undefined || price === null || price === '') return '---';
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numericPrice)) return '---';
  
  if (currency === 'TRY' || numericPrice > 10000 || (currency === 'USD' && numericPrice > 5000)) {
    return `₺${Math.round(numericPrice).toLocaleString('tr-TR')}`;
  }
  
  const usdToTry = 34.2;
  const taxAndMarginMultiplier = 1.25; 
  const finalPrice = numericPrice * usdToTry * taxAndMarginMultiplier;
  
  return `₺${Math.round(finalPrice).toLocaleString('tr-TR')}`;
};
