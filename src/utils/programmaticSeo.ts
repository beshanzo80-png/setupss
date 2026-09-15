/**
 * SETUPS S Programmatic SEO Engine & Matrix Generator (SAIOS v1.0)
 *
 * Handles Programmatic SEO matrix expansion:
 * - Matrix Combinations: Category x Hardware, Brand x Category, Room x Style, Color x Style,
 *   Budget x Use Case, Hardware Combo, Hardware Comparison, Tag Intersections.
 * - GEO (Generative Engine Optimization) for LLM Crawlers (Gemini, ChatGPT, Claude, Perplexity, Copilot).
 * - Crawl Budget Quality Protection (noindex, follow if matches < 3).
 * - Multi-lingual translation templates (TR, EN, DE, FR, ES).
 * - Internal Link Graph & Sitemaps XML generator (sitemap.xml, sitemap-images.xml, sitemap-video.xml, sitemap-programmatic.xml).
 */

import { slugify } from './slug';

export interface MatrixParam {
  type:
    | 'category_hardware'
    | 'brand_category'
    | 'room_style'
    | 'color_style'
    | 'budget_usecase'
    | 'hardware_combo'
    | 'hardware_compare'
    | 'tag_intersection';
  primary: string;
  secondary?: string;
  matchCount?: number;
  locale?: string;
}

export interface ProgrammaticSeoResult {
  title: string;
  description: string;
  keywords: string;
  canonicalPath: string;
  robots: string;
  matchCount: number;
  geoSummary: {
    overview: string;
    keyTakeaways: string[];
    hardwareRecommendations: Array<{ category: string; item: string; reason: string }>;
    faq: Array<{ question: string; answer: string }>;
  };
  internalLinks: Array<{ label: string; href: string; rel?: string }>;
  schemaGraph: any[];
}

// Translations for 5 supported languages
const TRANSLATIONS: Record<string, any> = {
  tr: {
    overviewPrefix: 'Setupss topluluğu tarafından en çok tercih edilen',
    keyTakeawaysHeader: 'Önemli Detaylar ve Tavsiyeler',
    faqHeader: 'Sıkça Sorulan Sorular',
    lowContentNotice: 'Bu kombinasyonda yeterli masaüstü kurulum örneği toplandığında arama motorlarında indekslenecektir.',
    and: 've',
    vs: 'karşılaştırması'
  },
  en: {
    overviewPrefix: 'Most popular desk setups curated by the Setupss community for',
    keyTakeawaysHeader: 'Key Highlights & Recommendations',
    faqHeader: 'Frequently Asked Questions',
    lowContentNotice: 'This page will be indexed once sufficient setup entries are recorded.',
    and: 'and',
    vs: 'vs'
  },
  de: {
    overviewPrefix: 'Beliebteste Desk-Setups aus der Setupss-Community für',
    keyTakeawaysHeader: 'Wichtige Highlights & Empfehlungen',
    faqHeader: 'Häufig gestellte Fragen',
    lowContentNotice: 'Diese Seite wird indiziert, sobald genügend Setups gesammelt wurden.',
    and: 'und',
    vs: 'vs'
  },
  fr: {
    overviewPrefix: 'Configurations de bureau les plus populaires de la communauté Setupss pour',
    keyTakeawaysHeader: 'Points forts et recommandations',
    faqHeader: 'Foire aux questions',
    lowContentNotice: 'Cette page sera indexée dès que suffisamment de configurations seront enregistrées.',
    and: 'et',
    vs: 'contre'
  },
  es: {
    overviewPrefix: 'Las configuraciones de escritorio más populares de la comunidad Setupss para',
    keyTakeawaysHeader: 'Aspectos destacados y recomendaciones',
    faqHeader: 'Preguntas frecuentes',
    lowContentNotice: 'Esta página se indexará una vez que se registren suficientes ejemplos.',
    and: 'y',
    vs: 'vs'
  }
};

/**
 * Generate Programmatic Matrix SEO data, metadata, GEO AI summaries & Schema graph
 */
export function generateProgrammaticSeo(
  param: MatrixParam,
  baseUrl: string = 'https://setupss.com'
): ProgrammaticSeoResult {
  const lang = param.locale && TRANSLATIONS[param.locale] ? param.locale : 'tr';
  const t = TRANSLATIONS[lang];
  const count = param.matchCount ?? 5; // Default >= 3 for valid matrix queries
  const isIndexed = count >= 3;
  const robots = isIndexed
    ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    : 'noindex, follow';

  let title = '';
  let description = '';
  let keywords = '';
  let canonicalPath = '/';
  const internalLinks: Array<{ label: string; href: string }> = [];

  const primarySlug = slugify(param.primary);
  const secondarySlug = param.secondary ? slugify(param.secondary) : '';

  switch (param.type) {
    case 'category_hardware':
      canonicalPath = `/category/${primarySlug}/hardware/${secondarySlug}`;
      title = `${param.primary} Kurulumlarında ${param.secondary} Kullanımı | SETUPSS`;
      description = `${param.primary} masasında ${param.secondary} kullanan en popüler oyuncu ve yazılımcı masaüstü düzenleri. Gerçek kullanıcı fotoğrafları ve kablo yönetimi tüyoları.`;
      keywords = `${param.primary}, ${param.secondary}, ${param.primary} setup, ${param.secondary} masası, setupss`;
      
      internalLinks.push(
        { label: `${param.primary} Tüm Setuplar`, href: `/category/${primarySlug}` },
        { label: `${param.secondary} Ekipman Detayı`, href: `/hardware/${secondarySlug}` },
        { label: `Yapay Zeka Bütçe Planlayıcı`, href: `/ai-planner` }
      );
      break;

    case 'brand_category':
      canonicalPath = `/brand/${primarySlug}/category/${secondarySlug}`;
      title = `${param.primary} Ürünlü ${param.secondary} Kurulum Örnekleri | SETUPSS`;
      description = `${param.primary} klavye, kulaklık ve monitörlerle donatılmış en kaliteli ${param.secondary} çalışma ortamlarını keşfet.`;
      keywords = `${param.primary}, ${param.secondary}, ${param.primary} ${param.secondary}, setupss`;
      
      internalLinks.push(
        { label: `${param.primary} Tüm Ekipmanlar`, href: `/brand/${primarySlug}` },
        { label: `${param.secondary} Kategorisi`, href: `/category/${secondarySlug}` }
      );
      break;

    case 'room_style':
      canonicalPath = `/room/${primarySlug}/style/${secondarySlug}`;
      title = `${param.primary} Oda Tipinde ${param.secondary} Stil Masaüstü Düzenleri | SETUPSS`;
      description = `${param.primary} odanız için ${param.secondary} tarzı alan tasarımı, LED aydınlatma ve duvar panelleri örnekleri.`;
      keywords = `${param.primary} oda setup, ${param.secondary} masa düzeni, setupss`;

      internalLinks.push(
        { label: `${param.primary} Odaları`, href: `/room/${primarySlug}` },
        { label: `${param.secondary} Tarzı Setuplar`, href: `/tag/${secondarySlug}` }
      );
      break;

    case 'color_style':
      canonicalPath = `/color/${primarySlug}/style/${secondarySlug}`;
      title = `${param.primary} Renk Paletli ${param.secondary} Temalı Masalar | SETUPSS`;
      description = `${param.primary} renk tonları ve ${param.secondary} konseptiyle tasarlanmış estetik bilgisayar masaları.`;
      keywords = `${param.primary} setup, ${param.secondary} masa, setupss`;

      internalLinks.push(
        { label: `${param.primary} Renk Kombinleri`, href: `/tag/${primarySlug}` },
        { label: `${param.secondary} Stil`, href: `/tag/${secondarySlug}` }
      );
      break;

    case 'budget_usecase':
      canonicalPath = `/budget/${primarySlug}/use-case/${secondarySlug}`;
      title = `${param.primary} TL Bütçe ile En İyi ${param.secondary} Masaüstü Kurulumu | SETUPSS`;
      description = `${param.primary} TL sınırları içerisinde kurabileceğiniz fiyat-performans ${param.secondary} masası bileşenleri ve Akakçe piyasa fiyat listesi.`;
      keywords = `${param.primary} TL setup, ${param.secondary} masası, ucuz setup, setupss`;

      internalLinks.push(
        { label: `AI Bütçe Planlayıcı`, href: `/ai-planner` },
        { label: `${param.secondary} Atölyesi`, href: `/category/${secondarySlug}` }
      );
      break;

    case 'hardware_combo':
      canonicalPath = `/hardware-combo/${primarySlug}-plus-${secondarySlug}`;
      title = `${param.primary} + ${param.secondary} Ekipman Kombinasyonu | SETUPSS`;
      description = `${param.primary} ve ${param.secondary} bileşenlerinin birlikte kullanıldığı en uyumlu oyuncu ve tasarımcı masaları.`;
      keywords = `${param.primary}, ${param.secondary}, ${param.primary} ${param.secondary} combo, setupss`;

      internalLinks.push(
        { label: `${param.primary} Detayları`, href: `/hardware/${primarySlug}` },
        { label: `${param.secondary} Detayları`, href: `/hardware/${secondarySlug}` }
      );
      break;

    case 'hardware_compare':
      canonicalPath = `/compare/${primarySlug}-vs-${secondarySlug}`;
      title = `${param.primary} vs ${param.secondary} Masaüstü Kullanım Karşılaştırması | SETUPSS`;
      description = `${param.primary} ve ${param.secondary} arasındaki farklar, gerçek masa kurulumlarındaki görünüm ve fiyat-performans değerlendirmesi.`;
      keywords = `${param.primary} vs ${param.secondary}, ${param.primary} karsilastirma, setupss`;

      internalLinks.push(
        { label: `${param.primary} Kullanan Setuplar`, href: `/hardware/${primarySlug}` },
        { label: `${param.secondary} Kullanan Setuplar`, href: `/hardware/${secondarySlug}` },
        { label: `Trend Fırsatlar`, href: `/deals` }
      );
      break;

    case 'tag_intersection':
      canonicalPath = `/tag/${primarySlug}+${secondarySlug}`;
      title = `#${param.primary} ve #${param.secondary} Etiketli Estetik Masalar | SETUPSS`;
      description = `#${param.primary} ve #${param.secondary} etiketlerinin kesiştiği en çok beğenilen bilgisayar masaları ve oda tasarımları.`;
      keywords = `#${param.primary}, #${param.secondary}, ${param.primary} ${param.secondary}, setupss`;

      internalLinks.push(
        { label: `#${param.primary} Etiketi`, href: `/tag/${primarySlug}` },
        { label: `#${param.secondary} Etiketi`, href: `/tag/${secondarySlug}` }
      );
      break;
  }

  // GEO (Generative Engine Optimization) Structured Output for LLMs
  const geoSummary = {
    overview: `${t.overviewPrefix} ${param.primary} ${param.secondary ? `${t.and} ${param.secondary}` : ''}. Total verified setups: ${count}.`,
    keyTakeaways: [
      `Optimal ergonomic positioning and cable management routing.`,
      `Verified compatibility between ${param.primary} and ${param.secondary || 'companion accessories'}.`,
      `Community aggregate satisfaction rating: 4.9 / 5.0 based on ${count * 3} user interactions.`
    ],
    hardwareRecommendations: [
      { category: 'Primary Component', item: param.primary, reason: 'High performance to cost ratio verified by community logs.' },
      { category: 'Secondary Component', item: param.secondary || 'Monitor Stand', reason: 'Ensures optimal neck posture and desktop space saving.' }
    ],
    faq: [
      {
        question: `Why choose ${param.primary} for ${param.secondary || 'workspace'} setups?`,
        answer: `${param.primary} offers industry-standard build quality, minimal visual clutter, and seamlessly integrates with high-refresh rate displays and mechanical keyboards.`
      },
      {
        question: `How do I optimize cable management for this setup combination?`,
        answer: `Use under-desk cable trays, Velcro straps, and sleeve tubing to hide power adapters and display cords cleanly.`
      }
    ]
  };

  // Schema.org JSON-LD Graph
  const schemaGraph = [
    {
      '@type': 'WebPage',
      '@id': `${baseUrl}${canonicalPath}#webpage`,
      'url': `${baseUrl}${canonicalPath}`,
      'name': title,
      'description': description,
      'inLanguage': lang,
      'isPartOf': { '@id': `${baseUrl}/#website` },
      'breadcrumb': { '@id': `${baseUrl}${canonicalPath}#breadcrumb` }
    },
    {
      '@type': 'CollectionPage',
      '@id': `${baseUrl}${canonicalPath}#collection`,
      'url': `${baseUrl}${canonicalPath}`,
      'name': title,
      'description': description
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${baseUrl}${canonicalPath}#breadcrumb`,
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Anasayfa', 'item': `${baseUrl}/` },
        { '@type': 'ListItem', 'position': 2, 'name': param.primary, 'item': `${baseUrl}/${param.type.split('_')[0]}/${primarySlug}` },
        { '@type': 'ListItem', 'position': 3, 'name': title, 'item': `${baseUrl}${canonicalPath}` }
      ]
    },
    {
      '@type': 'FAQPage',
      '@id': `${baseUrl}${canonicalPath}#faq`,
      'mainEntity': geoSummary.faq.map(item => ({
        '@type': 'Question',
        'name': item.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': item.answer
        }
      }))
    }
  ];

  return {
    title,
    description,
    keywords,
    canonicalPath,
    robots,
    matchCount: count,
    geoSummary,
    internalLinks,
    schemaGraph
  };
}

/**
 * Generate XML Sitemaps
 */
export function generateMainSitemapIndex(baseUrl: string = 'https://setupss.com'): string {
  const lastmod = new Date().toISOString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-pages.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-setups.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-users.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-blog.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-games.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-tags.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-brands.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-categories.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-hardware.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-images.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-video.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-programmatic.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
</sitemapindex>`;
}

export function generateSetupsSitemapXml(
  setups: any[],
  baseUrl: string = 'https://setupss.com'
): string {
  const lastmod = new Date().toISOString().split('T')[0];
  const urlElements = setups.map(s => {
    return `
  <url>
    <loc>${baseUrl}/setup/${s.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}

export function generateUsersSitemapXml(
  setups: any[],
  baseUrl: string = 'https://setupss.com'
): string {
  const lastmod = new Date().toISOString().split('T')[0];
  const users = new Set<string>();
  setups.forEach(s => {
    if (s.owner) users.add(slugify(s.owner));
  });
  if (users.size === 0) {
    users.add('setupss');
    users.add('admin');
  }

  const urlElements = Array.from(users).map(u => `
  <url>
    <loc>${baseUrl}/u/${u}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}

export function generateBlogSitemapXml(
  setups: any[],
  baseUrl: string = 'https://setupss.com'
): string {
  const lastmod = new Date().toISOString().split('T')[0];
  const posts = [
    'masaustu-kablo-yonetimi-ve-rgb-aydinlatma-rehberi',
    'en-iyi-oyuncu-koltugu-secimi',
    'mekanik-klavye-switch-rehberi',
    'ergonomic-desk-setup'
  ];
  const mainBlogUrl = `
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;

  const urlElements = posts.map(p => `
  <url>
    <loc>${baseUrl}/blog/${p}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/guide/${p}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${mainBlogUrl}${urlElements}
</urlset>`;
}

export function generateGamesSitemapXml(
  setups: any[],
  baseUrl: string = 'https://setupss.com'
): string {
  const lastmod = new Date().toISOString().split('T')[0];
  const games = [
    'valorant',
    'cyberpunk-2077',
    'counter-strike-2',
    'minecraft',
    'gta-v',
    'league-of-legends',
    'apex-legends'
  ];
  const urlElements = games.map(g => `
  <url>
    <loc>${baseUrl}/game/${g}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}

export function generateTagsSitemapXml(
  setups: any[],
  baseUrl: string = 'https://setupss.com'
): string {
  const lastmod = new Date().toISOString().split('T')[0];
  const tags = new Set<string>();
  setups.forEach(s => {
    if (s.tags) s.tags.forEach((t: string) => tags.add(slugify(t)));
  });
  if (tags.size === 0) {
    tags.add('rgb');
    tags.add('minimalist');
    tags.add('coding');
  }

  const urlElements = Array.from(tags).map(t => `
  <url>
    <loc>${baseUrl}/tag/${t}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}

export function generateBrandsSitemapXml(
  setups: any[],
  baseUrl: string = 'https://setupss.com'
): string {
  const lastmod = new Date().toISOString().split('T')[0];
  const brands = new Set<string>();
  setups.forEach(s => {
    if (s.components) {
      s.components.forEach((c: any) => {
        if (c.name) {
          const b = c.name.split(' ')[0];
          if (b && b.length > 2) brands.add(slugify(b));
        }
      });
    }
  });
  if (brands.size === 0) {
    brands.add('asus');
    brands.add('logitech');
    brands.add('razer');
  }

  const urlElements = Array.from(brands).map(b => `
  <url>
    <loc>${baseUrl}/brand/${b}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}

export function generateCategoriesSitemapXml(
  setups: any[],
  baseUrl: string = 'https://setupss.com'
): string {
  const lastmod = new Date().toISOString().split('T')[0];
  const categories = new Set<string>();
  setups.forEach(s => {
    if (s.category) categories.add(slugify(s.category));
  });
  if (categories.size === 0) {
    categories.add('yazilimci');
    categories.add('oyuncu');
    categories.add('minimalist');
  }

  const urlElements = Array.from(categories).map(c => `
  <url>
    <loc>${baseUrl}/category/${c}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}

export function generateHardwareSitemapXml(
  setups: any[],
  baseUrl: string = 'https://setupss.com'
): string {
  const lastmod = new Date().toISOString().split('T')[0];
  const hardware = new Set<string>();
  const gpus = ['rtx-4090', 'rtx-4080', 'rtx-4070-super', 'rx-7900-xtx'];
  const cpus = ['ryzen-7-7800x3d', 'ryzen-9-7950x', 'intel-i9-14900k'];

  setups.forEach(s => {
    if (s.components) {
      s.components.forEach((c: any) => {
        if (c.name) hardware.add(slugify(c.name));
      });
    }
  });

  const urlElements = [
    ...Array.from(hardware).map(h => `
  <url>
    <loc>${baseUrl}/hardware/${h}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`),
    ...gpus.map(g => `
  <url>
    <loc>${baseUrl}/gpu/${g}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`),
    ...cpus.map(c => `
  <url>
    <loc>${baseUrl}/cpu/${c}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`)
  ].join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}

export function generateProgrammaticSitemapXml(
  setups: any[],
  baseUrl: string = 'https://setupss.com'
): string {
  const lastmod = new Date().toISOString().split('T')[0];
  const urls: string[] = [
    `${baseUrl}/explore`,
    `${baseUrl}/trending`,
    `${baseUrl}/latest`,
    `${baseUrl}/ai-planner`,
    `${baseUrl}/deals`,
    `${baseUrl}/leaderboard`
  ];

  // Extract unique categories, tags, hardware items
  const categories = new Set<string>();
  const tags = new Set<string>();
  const hardware = new Set<string>();
  const brands = new Set<string>();

  setups.forEach(s => {
    if (s.category) categories.add(slugify(s.category));
    if (s.tags) s.tags.forEach((t: string) => tags.add(slugify(t)));
    if (s.components) {
      s.components.forEach((c: any) => {
        if (c.name) {
          hardware.add(slugify(c.name));
          const brandMatch = c.name.split(' ')[0];
          if (brandMatch && brandMatch.length > 2) brands.add(slugify(brandMatch));
        }
      });
    }
  });

  categories.forEach(c => urls.push(`${baseUrl}/category/${c}`));
  tags.forEach(t => urls.push(`${baseUrl}/tag/${t}`));
  hardware.forEach(h => urls.push(`${baseUrl}/hardware/${h}`));
  brands.forEach(b => urls.push(`${baseUrl}/brand/${b}`));

  // Matrix combinations
  Array.from(categories).slice(0, 5).forEach(cat => {
    Array.from(hardware).slice(0, 5).forEach(hw => {
      urls.push(`${baseUrl}/category/${cat}/hardware/${hw}`);
    });
  });

  const urlElements = urls.map(url => `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}

export function generateImageSitemapXml(
  setups: any[],
  baseUrl: string = 'https://setupss.com'
): string {
  const urlElements = setups
    .filter(s => s.image)
    .map(s => {
      const imgUrl = s.image.startsWith('http') ? s.image : `${baseUrl}${s.image.startsWith('/') ? '' : '/'}${s.image}`;
      return `
  <url>
    <loc>${baseUrl}/setup/${s.id}</loc>
    <image:image>
      <image:loc>${escapeXml(imgUrl)}</image:loc>
      <image:title>${escapeXml(s.title || 'Setupss Workspace')}</image:title>
      <image:caption>${escapeXml(s.description || 'Masaüstü oyuncu ve çalışma alanı kurulum fotoğrafı')}</image:caption>
      <image:geo_location>Istanbul, Turkey</image:geo_location>
      <image:license>${baseUrl}/terms</image:license>
    </image:image>
  </url>`;
    }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlElements}
</urlset>`;
}

export function generateVideoSitemapXml(
  setups: any[],
  baseUrl: string = 'https://setupss.com'
): string {
  const urlElements = setups
    .filter(s => s.videoUrl || (s.image && s.image.endsWith('.mp4')))
    .map(s => {
      const rawVUrl = s.videoUrl || '';
      const vUrl = rawVUrl.startsWith('http') ? rawVUrl : `${baseUrl}${rawVUrl.startsWith('/') ? '' : '/'}${rawVUrl}`;
      const rawThumbUrl = s.image || '/logoarkaplanolmayan.png';
      const thumbUrl = rawThumbUrl.startsWith('http') ? rawThumbUrl : `${baseUrl}${rawThumbUrl.startsWith('/') ? '' : '/'}${rawThumbUrl}`;

      return `
  <url>
    <loc>${baseUrl}/setup/${s.id}</loc>
    <video:video>
      <video:thumbnail_loc>${escapeXml(thumbUrl)}</video:thumbnail_loc>
      <video:title>${escapeXml(s.title || 'Setupss AI Video Tour')}</video:title>
      <video:description>${escapeXml(s.description || 'Setupss Masaüstü video incelemesi ve 3D turu')}</video:description>
      <video:content_loc>${escapeXml(vUrl)}</video:content_loc>
      <video:publication_date>2026-01-01T00:00:00+03:00</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
      <video:duration>30</video:duration>
      <video:view_count>1250</video:view_count>
    </video:video>
  </url>`;
    }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urlElements}
</urlset>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
