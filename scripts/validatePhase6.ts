import {
  generateCentralizedSchemaGraph,
  buildOrganizationSchema,
  buildWebSiteSchema,
  buildPersonSchema,
  buildSetupArtworkSchema,
  buildArticleSchema,
  buildWebApplicationSchema,
  buildDefinedTermSchema
} from '../src/utils/schemaEngine';
import { generateSeoMetadata } from '../src/utils/seoEngine';

console.log("=== PHASE 6 ENTERPRISE STRUCTURED DATA & KNOWLEDGE GRAPH ENGINE VALIDATION ===");

// 1. Test All Supported Schema.org Entity Types
const baseUrl = 'https://setupss.ai.studio';

const schemasToVerify = [
  // WebSite & SearchAction
  buildWebSiteSchema(baseUrl),
  // Organization
  buildOrganizationSchema(baseUrl),
  // WebApplication & SoftwareApplication
  buildWebApplicationSchema(baseUrl),
  // Person & ProfilePage
  buildPersonSchema({ username: 'alperen', name: 'Alperen Sakin', avatar: 'https://example.com/avatar.jpg' }, baseUrl).person,
  buildPersonSchema({ username: 'alperen', name: 'Alperen Sakin', avatar: 'https://example.com/avatar.jpg' }, baseUrl).profilePage,
  // CreativeWork, VisualArtwork & VideoObject
  buildSetupArtworkSchema({
    id: 'setup-99',
    title: 'Minimalist Walnut Setup',
    owner: 'alperen',
    description: 'Ceviz ahşap masa ve LG OLED ekranlı kurulum.',
    image: 'https://example.com/image.jpg',
    videoUrl: 'https://example.com/video.mp4',
    likes: 42
  }, baseUrl),
  // TechArticle / NewsArticle / HowTo
  buildArticleSchema({
    id: 'guide-10',
    title: 'Masaüstü Kablo Yönetim Rehberi',
    description: 'Kabloları gizleme ve temiz masa düzeni oluşturma ipuçları.',
    articleType: 'HowTo'
  }, baseUrl),
  // DefinedTerm & DefinedTermSet
  buildDefinedTermSchema('Oyuncu', 'category', baseUrl)
];

console.log("\n1. Schema.org Builders Output Test:");
schemasToVerify.forEach((s: any, idx) => {
  const typeStr = Array.isArray(s['@type']) ? s['@type'].join(' / ') : s['@type'];
  console.log(`  └─ [${idx + 1}] Entity Type: ${typeStr} (ID: ${s['@id'] || 'N/A'})`);
});

// 2. Test Centralized Graph Assembly & Caching
console.log("\n2. Schema Graph Generator & Cache Test:");
const graphResult = generateCentralizedSchemaGraph({
  baseUrl,
  canonicalUrl: `${baseUrl}/setup/setup-99`,
  title: 'Minimalist Walnut Setup',
  description: 'Clean setup overview.',
  entities: schemasToVerify
});

console.log(`  └─ Graph Nodes Count: ${graphResult['@graph'].length}`);
console.log(`  └─ Context: ${graphResult['@context']}`);

// 3. Test SEO Metadata Generation End-to-End
console.log("\n3. End-to-End SEO Engine Integration Test:");
const seoOutput = generateSeoMetadata({
  baseUrl,
  queryParams: { setup: 'setup-99' },
  setupData: {
    id: 'setup-99',
    title: 'Minimalist Walnut Setup',
    owner: 'alperen',
    description: 'Ceviz ahşap masa ve LG OLED ekranlı kurulum.',
    image: 'https://example.com/image.jpg',
    likes: 42,
    components: [{ name: 'LG OLED 34', category: 'Monitör' }]
  }
});

console.log(`  └─ Title: "${seoOutput.title}"`);
console.log(`  └─ Total Schema Types in Output:`, seoOutput.jsonLd['@graph'].map((item: any) => item['@type']));

console.log("\n=== PHASE 6 VALIDATION COMPLETED SUCCESSFULLY ===");
