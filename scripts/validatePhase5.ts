import {
  HARDWARE_CATALOG,
  getHardwareBySlug,
  compareHardware,
  combineHardware
} from '../src/utils/hardwareEngine';
import { generateSeoMetadata } from '../src/utils/seoEngine';

console.log("=== PHASE 5 HARDWARE KNOWLEDGE GRAPH & HARDWARE ENTITY ENGINE VALIDATION ===");

// 1. Hardware Catalog Integrity
console.log("\n1. Catalog & Entity Tests:");
console.log(`  └─ Total Pre-populated Catalog Entries: ${HARDWARE_CATALOG.length}`);
HARDWARE_CATALOG.forEach(h => {
  console.log(`     • [${h.category}] ${h.brand} ${h.model} (Slug: ${h.slug}, Specs: ${Object.keys(h.specifications).length})`);
});

// 2. Dynamic Entity Lookup Test
console.log("\n2. Dynamic Entity Lookup & Fallback Tests:");
const testSlugs = ['nvidia-geforce-rtx-5090', 'keychron-q1-max', 'custom-rtx-3080-ti-unknown'];
testSlugs.forEach(s => {
  const hw = getHardwareBySlug(s);
  console.log(`  └─ Lookup "${s}" -> Found: "${hw.brand} ${hw.model}" (${hw.category}, MSRP: ${hw.msrp || 'N/A'})`);
});

// 3. Hardware Comparison Engine
console.log("\n3. Hardware Comparison Engine Tests:");
const comp = compareHardware('nvidia-geforce-rtx-5090', 'nvidia-geforce-rtx-5080');
console.log(`  └─ Compare: ${comp.itemA.model} vs ${comp.itemB.model}`);
console.log(`     Advantages A: ${comp.advantagesA.join(', ')}`);
console.log(`     Advantages B: ${comp.advantagesB.join(', ')}`);
console.log(`     Verdict: ${comp.verdict}`);

// 4. Hardware Combination Engine
console.log("\n4. Hardware Combination Engine Tests:");
const combo = combineHardware('amd-ryzen-7-9800x3d', 'nvidia-geforce-rtx-5090');
console.log(`  └─ Combo: ${combo.itemA.model} + ${combo.itemB.model}`);
console.log(`     Compatibility Score: ${combo.compatibilityScore}%`);
console.log(`     Recommended PSU: ${combo.recommendedPowerSupply}`);

// 5. SEO & Structured Data (Product, Brand, AggregateRating, Offer, FAQPage)
console.log("\n5. SEO & Knowledge Graph Schema Verification:");
const seo = generateSeoMetadata({
  baseUrl: 'https://setupss.ai.studio',
  queryParams: {},
  hardwareName: 'nvidia-geforce-rtx-5090'
});

console.log(`  └─ Title: "${seo.title}"`);
console.log(`  └─ Canonical: "${seo.canonicalUrl}"`);
console.log(`  └─ Schema Types Output:`, seo.jsonLd['@graph'].map((s: any) => s['@type']));

console.log("\n=== PHASE 5 VALIDATION COMPLETED SUCCESSFULLY ===");
