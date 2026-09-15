/**
 * SETUPS S AI OPERATING SYSTEM (SAIOS v1.0)
 * Global Internationalization (i18n) Engine (Phase 7)
 *
 * Multilingual architecture supporting EN, TR, DE, FR, and ES with 
 * lazy-loaded translation dictionaries, dynamic hreflang generation,
 * and zero translation of user-generated content (UGC).
 */

export type SupportedLocale = 'en' | 'tr' | 'de' | 'fr' | 'es';

export const SUPPORTED_LOCALES: SupportedLocale[] = ['en', 'tr', 'de', 'fr', 'es'];
export const DEFAULT_LOCALE: SupportedLocale = 'tr';

export const ISO_LOCALE_MAP: Record<SupportedLocale, string> = {
  en: 'en-US',
  tr: 'tr-TR',
  de: 'de-DE',
  fr: 'fr-FR',
  es: 'es-ES'
};

// Lazy loaded dictionary cache
const dictionaryCache = new Map<SupportedLocale, Record<string, string>>();

// Translation Dictionaries for System UI & Core SEO Metadata
const DICTIONARIES: Record<SupportedLocale, Record<string, string>> = {
  tr: {
    'site.title': 'Setupss | PC Setup, Gaming Masaları & Donanım Atölyesi',
    'site.description': 'En iyi PC setupları, oyuncu ve yazılımcı masaları, donanım uyumluluk rehberleri ve AI bütçe planlayıcı.',
    'nav.explore': 'Keşfet',
    'nav.battlestations': 'Setuplar',
    'nav.hardware': 'Donanımlar',
    'nav.planner': 'AI Bütçe Planlayıcı',
    'nav.deals': 'Fırsatlar',
    'nav.guides': 'Rehberler',
    'nav.login': 'Giriş Yap',
    'nav.profile': 'Profilim',
    'hardware.title_suffix': 'içeren En İyi Masaüstü Setupları',
    'hardware.desc_prefix': 'donanımını içeren oyuncu ve yazılımcı masaüstü kurulumlarını inceleyin.',
    'category.title_suffix': 'Masaüstü Kurulum Örnekleri ve Tasarımları',
    'brand.title_suffix': 'Ekipmanlı En Popüler Oyun & Çalışma Alanları',
    'compare.title_suffix': 'Donanım Karşılaştırması ve Masaüstü Performansı'
  },
  en: {
    'site.title': 'Setupss | PC Setups, Gaming Desks & Hardware Workspace',
    'site.description': 'Discover top PC setups, gaming battlestations, developer desks, hardware guides, and AI budget planner.',
    'nav.explore': 'Explore',
    'nav.battlestations': 'Setups',
    'nav.hardware': 'Hardware',
    'nav.planner': 'AI Budget Planner',
    'nav.deals': 'Deals',
    'nav.guides': 'Guides',
    'nav.login': 'Sign In',
    'nav.profile': 'My Profile',
    'hardware.title_suffix': 'Best Desktop Setups Featuring',
    'hardware.desc_prefix': 'Explore gaming and developer desk setups featuring hardware.',
    'category.title_suffix': 'Desktop Setup Examples and Layouts',
    'brand.title_suffix': 'Most Popular Workspaces Featuring',
    'compare.title_suffix': 'Hardware Comparison and Workspace Performance'
  },
  de: {
    'site.title': 'Setupss | PC-Setups, Gaming-Schreibtische & Hardware-Workspace',
    'site.description': 'Entdecken Sie die besten PC-Setups, Gaming-Battlestations, Schreibtische und KI-Budgetplaner.',
    'nav.explore': 'Entdecken',
    'nav.battlestations': 'Setups',
    'nav.hardware': 'Hardware',
    'nav.planner': 'KI-Budgetplaner',
    'nav.deals': 'Angebote',
    'nav.guides': 'Ratgeber',
    'nav.login': 'Anmelden',
    'nav.profile': 'Mein Profil',
    'hardware.title_suffix': 'Die besten Desktop-Setups mit',
    'hardware.desc_prefix': 'Entdecken Sie Gaming- und Schreibtisch-Setups mit Hardware.',
    'category.title_suffix': 'Desktop-Setup-Beispiele und Layouts',
    'brand.title_suffix': 'Beliebteste Arbeitsplätze mit',
    'compare.title_suffix': 'Hardware-Vergleich und Leistung'
  },
  fr: {
    'site.title': 'Setupss | Configurations PC, Bureaux Gaming & Matériel',
    'site.description': 'Découvrez les meilleures configurations PC, bureaux gaming, guides matériel et planificateur IA.',
    'nav.explore': 'Explorer',
    'nav.battlestations': 'Setups',
    'nav.hardware': 'Matériel',
    'nav.planner': 'Planificateur IA',
    'nav.deals': 'Offres',
    'nav.guides': 'Guides',
    'nav.login': 'Se connecter',
    'nav.profile': 'Mon Profil',
    'hardware.title_suffix': 'Meilleures configurations de bureau avec',
    'hardware.desc_prefix': 'Découvrez les configurations de bureau gaming et développeur avec matériel.',
    'category.title_suffix': 'Exemples et agencements de bureau',
    'brand.title_suffix': 'Espaces de travail les plus populaires avec',
    'compare.title_suffix': 'Comparatif matériel et performances'
  },
  es: {
    'site.title': 'Setupss | Setups de PC, Escritorios Gaming y Hardware',
    'site.description': 'Descubre los mejores setups de PC, escritorios gaming, guías de hardware y planificador IA.',
    'nav.explore': 'Explorar',
    'nav.battlestations': 'Setups',
    'nav.hardware': 'Hardware',
    'nav.planner': 'Planificador IA',
    'nav.deals': 'Ofertas',
    'nav.guides': 'Guías',
    'nav.login': 'Iniciar Sesión',
    'nav.profile': 'Mi Perfil',
    'hardware.title_suffix': 'Mejores setups de escritorio con',
    'hardware.desc_prefix': 'Explora setups de escritorio gaming y desarrollador con hardware.',
    'category.title_suffix': 'Ejemplos y diseños de setups de escritorio',
    'brand.title_suffix': 'Espacios de trabajo más populares con',
    'compare.title_suffix': 'Comparativa de hardware y rendimiento'
  }
};

/**
 * Lazy load translation dictionary asynchronously for high performance
 */
export async function loadTranslationDictionary(locale: SupportedLocale): Promise<Record<string, string>> {
  if (dictionaryCache.has(locale)) {
    return dictionaryCache.get(locale)!;
  }

  const dict = DICTIONARIES[locale] || DICTIONARIES[DEFAULT_LOCALE];
  dictionaryCache.set(locale, dict);
  return dict;
}

/**
 * Synchronous dictionary lookup with fallback
 */
export function t(key: string, locale: SupportedLocale = DEFAULT_LOCALE, fallback?: string): string {
  const dict = DICTIONARIES[locale] || DICTIONARIES[DEFAULT_LOCALE];
  return dict[key] || fallback || DICTIONARIES['en'][key] || key;
}

/**
 * Dynamic Hreflang Tag Generator for All Routes
 */
export function generateHreflangLinks(canonicalPath: string, baseUrl: string): Array<{ hreflang: string; href: string }> {
  const cleanBase = baseUrl.replace(/\/$/, '');
  const cleanPath = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`;
  const separator = cleanPath.includes('?') ? '&' : '?';

  const links: Array<{ hreflang: string; href: string }> = SUPPORTED_LOCALES.map(lang => ({
    hreflang: lang,
    href: `${cleanBase}${cleanPath}${separator}lang=${lang}`
  }));

  // Add x-default pointing to English / Default
  links.push({
    hreflang: 'x-default',
    href: `${cleanBase}${cleanPath}`
  });

  return links;
}

/**
 * User-Generated Content Protection Rule:
 * Ensures raw user titles, descriptions, and comments are passed through untouched.
 */
export function preserveUgcText(userContent: string): string {
  return userContent;
}
