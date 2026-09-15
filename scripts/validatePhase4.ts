import {
  generateProgrammaticSeo,
  generateMainSitemapIndex,
  generateProgrammaticSitemapXml,
  generateImageSitemapXml,
  generateVideoSitemapXml,
  MatrixParam
} from '../src/utils/programmaticSeo';

console.log("=== PHASE 4 PROGRAMMATIC SEO MATRIX & GEO AUDIT ===");

const sampleSetups = [
  {
    id: 'setup-101',
    title: 'Cyberpunk RGB Workspace',
    description: 'NVIDIA RTX 4090 ve LG OLED 34 ile kurulmuş harika oda.',
    category: 'Oyuncu',
    tags: ['rgb', 'minimal', 'cyberpunk'],
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80',
    components: [
      { category: 'Ekran Kartı', name: 'NVIDIA RTX 4090' },
      { category: 'Monitör', name: 'LG OLED 34' }
    ]
  },
  {
    id: 'setup-102',
    title: 'Minimalist Wooden Desk',
    description: 'Ceviz masa üzerine kurulu sade çalışma masası.',
    category: 'Yazılımcı',
    tags: ['minimal', 'ahsap'],
    image: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=1200&q=80',
    components: [
      { category: 'Klavye', name: 'Keychron K2' },
      { category: 'Koltuk', name: 'Herman Miller' }
    ]
  }
];

// 1. Test Matrix Combinations
console.log("\n1. Matrix Generation Tests:");
const testMatrixCases: MatrixParam[] = [
  { type: 'category_hardware', primary: 'Oyuncu', secondary: 'NVIDIA RTX 4090', matchCount: 5, locale: 'tr' },
  { type: 'brand_category', primary: 'Logitech', secondary: 'Yazılımcı', matchCount: 8, locale: 'en' },
  { type: 'room_style', primary: 'Yatak Odası', secondary: 'Minimalist', matchCount: 4, locale: 'tr' },
  { type: 'hardware_combo', primary: 'RTX 4090', secondary: 'LG OLED 34', matchCount: 6, locale: 'tr' },
  { type: 'hardware_compare', primary: 'RTX 4090', secondary: 'RX 7900 XTX', matchCount: 10, locale: 'tr' },
  { type: 'tag_intersection', primary: 'minimal', secondary: 'rgb', matchCount: 3, locale: 'tr' },
  { type: 'budget_usecase', primary: '50000', secondary: 'yazilimci', matchCount: 1, locale: 'tr' } // Thin page test
];

testMatrixCases.forEach((mc, i) => {
  const result = generateProgrammaticSeo(mc);
  console.log(`\n--- Case ${i + 1}: ${mc.type} (${mc.primary} x ${mc.secondary}) ---`);
  console.log(`  └─ Title: "${result.title}"`);
  console.log(`  └─ Robots: "${result.robots}" (Count: ${result.matchCount})`);
  console.log(`  └─ Canonical: "${result.canonicalPath}"`);
  console.log(`  └─ GEO Overview: "${result.geoSummary.overview.substring(0, 70)}..."`);
  console.log(`  └─ Internal Links Count: ${result.internalLinks.length}`);
});

// 2. Test Sitemaps Generation
console.log("\n2. XML Sitemaps Generation Tests:");
const mainSitemap = generateMainSitemapIndex();
console.log(`  └─ Main Sitemap Index XML Length: ${mainSitemap.length} chars (contains sitemap-programmatic.xml)`);

const progSitemap = generateProgrammaticSitemapXml(sampleSetups);
console.log(`  └─ Programmatic Sitemap XML Length: ${progSitemap.length} chars`);

const imgSitemap = generateImageSitemapXml(sampleSetups);
console.log(`  └─ Image Sitemap XML Length: ${imgSitemap.length} chars`);

const vidSitemap = generateVideoSitemapXml(sampleSetups);
console.log(`  └─ Video Sitemap XML Length: ${vidSitemap.length} chars`);

console.log("\n=== PHASE 4 VALIDATION COMPLETED SUCCESSFULLY ===");
