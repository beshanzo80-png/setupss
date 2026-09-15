/**
 * Cleans a product name so Akakçe, Cimri, Trendyol, Hepsiburada, N11, Google Shopping and e-commerce search engines return exact, working search results
 * without returning "Product not found" due to noisy or overly detailed model names.
 */
export function getCleanSearchQuery(rawName: string): string {
  if (!rawName) return '';

  // Clean parentheses, brackets, and quotes
  let cleaned = rawName
    .replace(/\(.*?\)/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/["”'’]/g, '');

  // Noise descriptors to trim out if there are already specific model names
  const noisePattern = /\b(mekanik|kablosuz|wireless|bluetooth|ergonomik|oyuncu|gaming|ekipman|ışığı|ışıklandırma|pano|masaüstü|siyah|beyaz|gri|kırmızı|mavi)\b/gi;

  let stripped = cleaned.replace(noisePattern, ' ').replace(/\s+/g, ' ').trim();

  // If stripped query is too short or empty, revert to first 3 words of cleaned
  if (stripped.length < 3) {
    stripped = cleaned.split(/\s+/).slice(0, 3).join(' ');
  }

  return stripped;
}

export function buildAkakceUrl(productName: string): string {
  const query = getCleanSearchQuery(productName);
  return `https://www.akakce.com/arama/?q=${encodeURIComponent(query)}`;
}

export function buildCimriUrl(productName: string): string {
  const query = getCleanSearchQuery(productName);
  return `https://www.cimri.com/arama?q=${encodeURIComponent(query)}`;
}

export function buildAmazonUrl(productName: string): string {
  const query = getCleanSearchQuery(productName);
  return `https://www.amazon.com.tr/s?k=${encodeURIComponent(query)}`;
}

export function buildTrendyolUrl(productName: string): string {
  const query = getCleanSearchQuery(productName);
  return `https://www.trendyol.com/sr?q=${encodeURIComponent(query)}`;
}

export function buildHepsiburadaUrl(productName: string): string {
  const query = getCleanSearchQuery(productName);
  return `https://www.hepsiburada.com/ara?q=${encodeURIComponent(query)}`;
}

export function buildN11Url(productName: string): string {
  const query = getCleanSearchQuery(productName);
  return `https://www.n11.com/arama?q=${encodeURIComponent(query)}`;
}

export function buildIdefixUrl(productName: string): string {
  const query = getCleanSearchQuery(productName);
  return `https://www.idefix.com/Arama?q=${encodeURIComponent(query)}`;
}

export function buildGoogleShoppingUrl(productName: string): string {
  const query = getCleanSearchQuery(productName);
  return `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(query)}`;
}

export function buildTeknosaUrl(productName: string): string {
  const query = getCleanSearchQuery(productName);
  return `https://www.teknosa.com/arama?s=${encodeURIComponent(query)}`;
}

export function buildVatanUrl(productName: string): string {
  const query = getCleanSearchQuery(productName);
  return `https://www.vatanbilgisayar.com/arama/${encodeURIComponent(query)}`;
}

export function buildPttAvmUrl(productName: string): string {
  const query = getCleanSearchQuery(productName);
  return `https://www.pttavm.com/arama?q=${encodeURIComponent(query)}`;
}
