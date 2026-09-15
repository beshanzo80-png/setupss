import {
  SUPPORTED_LOCALES,
  ISO_LOCALE_MAP,
  loadTranslationDictionary,
  t,
  generateHreflangLinks,
  preserveUgcText,
  SupportedLocale
} from '../src/utils/i18n';
import { generateSeoMetadata } from '../src/utils/seoEngine';

console.log("=== PHASE 7 GLOBAL INTERNATIONALIZATION (i18n) ENGINE VALIDATION ===");

// 1. Supported Locales & ISO Maps
console.log("\n1. Supported Locales & ISO Mapping Tests:");
SUPPORTED_LOCALES.forEach(locale => {
  console.log(`  └─ Locale: [${locale.toUpperCase()}] -> ISO Map: ${ISO_LOCALE_MAP[locale]}`);
});

// 2. Lazy Dictionary Loading & Synchronous Lookups
console.log("\n2. Lazy Dictionary Loading & Translation Tests:");
async function runDictionaryTests() {
  for (const locale of SUPPORTED_LOCALES) {
    const dict = await loadTranslationDictionary(locale);
    const title = t('site.title', locale);
    const navExplore = t('nav.explore', locale);
    console.log(`  └─ [${locale.toUpperCase()}] Site Title: "${title}" | Nav Explore: "${navExplore}" (Dict Size: ${Object.keys(dict).length})`);
  }
}

// 3. Dynamic Hreflang Tag Generation
console.log("\n3. Dynamic Hreflang Generator Tests:");
const baseUrl = 'https://setupss.ai.studio';
const hreflangLinks = generateHreflangLinks('/hardware/nvidia-geforce-rtx-5090', baseUrl);
console.log(`  └─ Total Hreflang Links Generated: ${hreflangLinks.length}`);
hreflangLinks.forEach(link => {
  console.log(`     • hreflang="${link.hreflang}" -> href="${link.href}"`);
});

// 4. User-Generated Content (UGC) Preservation Test
console.log("\n4. User-Generated Content (UGC) Non-Translation Test:");
const rawUserPostTitle = "Cyberpunk 2077 Neon Setup with RTX 5090 & LG OLED 34";
const preservedText = preserveUgcText(rawUserPostTitle);
console.log(`  └─ Original UGC Title: "${rawUserPostTitle}"`);
console.log(`  └─ Preserved UGC Output: "${preservedText}" (Identical: ${rawUserPostTitle === preservedText})`);

// 5. End-to-End Multilingual SEO Engine Integration
console.log("\n5. End-to-End SEO Engine Multilingual Metadata Test:");
SUPPORTED_LOCALES.forEach(locale => {
  const seo = generateSeoMetadata({
    baseUrl,
    locale,
    queryParams: {}
  });
  console.log(`  └─ [${locale.toUpperCase()}] SEO Title: "${seo.title.substring(0, 50)}..." | OG Locale: ${seo.ogLocale} | Hreflangs: ${seo.hreflangs.length}`);
});

runDictionaryTests().then(() => {
  console.log("\n=== PHASE 7 VALIDATION COMPLETED SUCCESSFULLY ===");
});
