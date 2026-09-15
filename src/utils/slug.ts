/**
 * SETUPS S Slug Utilities (SAIOS v1.0)
 * Standardized slug generation & normalization across client & server.
 */

export function slugify(text: string): string {
  if (!text) return '';

  return text
    .toString()
    .toLowerCase()
    .trim()
    // Convert Turkish & extended Latin special characters
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/â/g, 'a')
    .replace(/î/g, 'i')
    .replace(/û/g, 'u')
    // Remove all non-word chars (except spaces and dashes)
    .replace(/[^\w\s-]/g, '')
    // Replace spaces and underscores with a single hyphen
    .replace(/[\s_]+/g, '-')
    // Remove duplicate hyphens
    .replace(/-+/g, '-')
    // Remove leading and trailing hyphens
    .replace(/^-+|-+$/g, '');
}

/**
 * Extract an ID or clean title string from a slug.
 * Slugs often carry IDs at the end (e.g. "my-setup-title-setup-123" or "setup-123")
 */
export function parseSlug(slug: string): { cleanSlug: string; id?: string } {
  if (!slug) return { cleanSlug: '' };
  
  const decoded = decodeURIComponent(slug);
  
  // Check if slug ends with an ID pattern or is an ID directly
  // Common ID formats: 'setup-123', 'user-456', or uuid
  const idMatch = decoded.match(/(?:.*-)?([a-zA-Z0-9_-]{4,})$/);
  
  return {
    cleanSlug: decoded,
    id: idMatch ? idMatch[1] : decoded
  };
}
