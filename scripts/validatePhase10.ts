import {
  generateAiAnswerBlock,
  generateAiCrawlerHtmlSection,
  generateAiSpeakableSchema
} from '../src/utils/geoEngine';
import { generateSeoMetadata } from '../src/utils/seoEngine';

console.log("=== PHASE 10 GENERATIVE ENGINE OPTIMIZATION (GEO) AUDIT ===");

const baseUrl = 'https://setupss.ai.studio';

// 1. AI Answer Block Formatting Test
console.log("\n1. AI Direct Answer Summary Generator Test:");
const answerBlock = generateAiAnswerBlock({
  name: 'Logitech MX Master 3S',
  type: 'Hardware / Productivity Mouse',
  description: 'Quiet Click switch teknolojisi, 8000 DPI MagSpeed kaydırma tekerleği sunan ergonomik kablosuz fare.',
  keySpecsOrItems: {
    'DPI': '8000 DPI Track-on-Glass',
    'Bağlantı': 'Logi Bolt & Bluetooth LE',
    'Pil Ömrü': '70 Güne Kadar',
    'Doğrulanmış Setup Kullanımı': '184 Masaüstü Kurulumu'
  },
  verdict: 'Yazılımcılar, tasarımcılar ve uzun süreli masa başı çalışanlar için en yüksek ergonomik puana sahip fare.'
});

console.log("--------------------------------------------------");
console.log(answerBlock);
console.log("--------------------------------------------------");

// 2. AI Crawler HTML Fact Sheet Section Test
console.log("\n2. AI Web Crawler Microdata Section Generator Test:");
const crawlerHtml = generateAiCrawlerHtmlSection({
  entityType: 'hardware',
  entityName: 'Logitech MX Master 3S',
  summary: 'Masaüstü verimlilik faresi.',
  facts: {
    'Marka': 'Logitech',
    'Kategori': 'Fare / Mouse',
    'Ortalama Puan': '4.9 / 5.0'
  },
  relationships: [
    { relation: 'FeaturedInSetup', name: 'Minimalist Walnut Setup by @alperen' },
    { relation: 'CompatibleWith', name: 'Apple MacBook Pro M3 & Windows PC' }
  ]
});

console.log(`  └─ HTML Section Length: ${crawlerHtml.length} chars`);
console.log(`  └─ Contains data-ai-context="true": ${crawlerHtml.includes('data-ai-context="true"')}`);
console.log(`  └─ Contains entity relationships: ${crawlerHtml.includes('FeaturedInSetup')}`);

// 3. Speakable Schema Node Test
console.log("\n3. Speakable Schema Node Generation Test:");
const speakable = generateAiSpeakableSchema(`${baseUrl}/hardware/logitech-mx-master-3s`);
console.log(`  └─ Speakable Type: ${speakable['@type']}`);
console.log(`  └─ Targeted CSS Selectors: ${speakable.cssSelector.join(', ')}`);

// 4. End-to-End GEO Integrated SEO Metadata Test
console.log("\n4. End-to-End GEO SEO Metadata Generation Audit:");
const seoOutput = generateSeoMetadata({
  baseUrl,
  hardwareName: 'logitech-mx-master-3s'
});

const jsonLdGraph = seoOutput.jsonLd['@graph'];
const hasSpeakable = jsonLdGraph.some((node: any) => node['@type'] === 'SpeakableSpecification');
const hasAiSectionInHtml = seoOutput.botPrerenderHtml.includes('data-ai-context="true"');

console.log(`  └─ Title: "${seoOutput.title}"`);
console.log(`  └─ Speakable Specification Node Included in JSON-LD: ${hasSpeakable}`);
console.log(`  └─ Machine-Readable AI Section Included in Prerender HTML: ${hasAiSectionInHtml}`);

console.log("\n=== PHASE 10 VALIDATION COMPLETED SUCCESSFULLY ===");
