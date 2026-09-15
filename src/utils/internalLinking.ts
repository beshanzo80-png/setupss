import { slugify } from './slug';

interface InternalLinkRule {
  keywords: string[];
  getPath: (match: string) => string;
}

const LINK_RULES: InternalLinkRule[] = [
  {
    keywords: ['rtx 4090', 'rtx4090', 'geforce rtx 4090'],
    getPath: () => '/gpu/rtx-4090'
  },
  {
    keywords: ['rtx 4080', 'rtx4080', 'geforce rtx 4080'],
    getPath: () => '/gpu/rtx-4080'
  },
  {
    keywords: ['ryzen 7800x3d', '7800x3d', '7800x 3d'],
    getPath: () => '/cpu/ryzen-7-7800x3d'
  },
  {
    keywords: ['valorant', 'valorant setup'],
    getPath: () => '/game/valorant'
  },
  {
    keywords: ['cyberpunk', 'cyberpunk 2077'],
    getPath: () => '/game/cyberpunk-2077'
  },
  {
    keywords: ['oyuncu', 'oyuncu odası', 'oyuncu masası', 'gaming'],
    getPath: () => '/category/oyuncu'
  },
  {
    keywords: ['yazılımcı', 'developer', 'yazılım', 'coding'],
    getPath: () => '/category/yazilimci'
  },
  {
    keywords: ['minimalist', 'minimal', 'sade'],
    getPath: () => '/category/minimalist'
  },
  {
    keywords: ['kablo yönetimi', 'kablo düzenleme', 'kablo gizleme'],
    getPath: () => '/blog/masaustu-kablo-yonetimi-ve-rgb-aydinlatma-rehberi'
  }
];

/**
 * Scans content and automatically inserts relative anchor links for matching setup, category, tag, game, hardware keywords
 * safely without breaking HTML elements.
 */
export function injectInternalLinks(text: string): string {
  if (!text) return '';
  let result = text;
  
  // Sort rules by keyword length descending to prevent substring conflicts (e.g. 'rtx 4090' before '4090')
  const sortedRules = [...LINK_RULES].sort((a, b) => {
    const maxA = Math.max(...a.keywords.map(k => k.length));
    const maxB = Math.max(...b.keywords.map(k => k.length));
    return maxB - maxA;
  });

  // Track already linked terms to prevent double linking same sentence or word
  const linkedUrls = new Set<string>();

  for (const rule of sortedRules) {
    const url = rule.getPath('');
    if (linkedUrls.has(url)) continue;

    for (const keyword of rule.keywords) {
      // Look for keyword with word boundaries, case insensitive, not inside existing html tags
      const regex = new RegExp(`(?<!<[^>]*)\\b(${keyword})\\b(?![^<]*>)`, 'gi');
      if (regex.test(result)) {
        result = result.replace(regex, `<a href="${url}" class="text-blue-600 hover:underline font-medium">$1</a>`);
        linkedUrls.add(url);
        break; // Only link one keyword per rule
      }
    }
  }

  return result;
}
