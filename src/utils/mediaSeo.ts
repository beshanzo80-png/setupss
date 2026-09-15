/**
 * SETUPS S AI OPERATING SYSTEM (SAIOS v1.0)
 * Image & Video Media SEO Engine (Phase 9)
 *
 * Dedicated utilities for media SEO, Schema.org ImageObject / VideoObject generation,
 * image alt text optimization, and Google-compliant image & video XML sitemaps.
 */

export interface ImageMediaData {
  url: string;
  title?: string;
  caption?: string;
  width?: number;
  height?: number;
  authorName?: string;
}

export interface VideoMediaData {
  url: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  uploadDate?: string;
  duration?: string;
}

/**
 * Build Schema.org ImageObject graph node
 */
export function buildImageObjectSchema(data: ImageMediaData, baseUrl: string) {
  const fullUrl = data.url.startsWith('http') ? data.url : `${baseUrl}${data.url.startsWith('/') ? '' : '/'}${data.url}`;
  
  return {
    '@type': 'ImageObject',
    '@id': `${fullUrl}#image`,
    'url': fullUrl,
    'contentUrl': fullUrl,
    'caption': data.caption || data.title || 'Setupss Workspace Image',
    'name': data.title || 'Setupss Workspace Photo',
    'width': data.width || 1920,
    'height': data.height || 1080,
    'author': data.authorName ? {
      '@type': 'Person',
      'name': data.authorName
    } : undefined
  };
}

/**
 * Build Schema.org VideoObject graph node
 */
export function buildVideoObjectSchema(data: VideoMediaData, baseUrl: string) {
  const fullContentUrl = data.url.startsWith('http') ? data.url : `${baseUrl}${data.url.startsWith('/') ? '' : '/'}${data.url}`;
  const fullThumbUrl = data.thumbnailUrl.startsWith('http') ? data.thumbnailUrl : `${baseUrl}${data.thumbnailUrl.startsWith('/') ? '' : '/'}${data.thumbnailUrl}`;

  return {
    '@type': 'VideoObject',
    '@id': `${fullContentUrl}#video`,
    'name': data.title,
    'description': data.description,
    'thumbnailUrl': fullThumbUrl,
    'contentUrl': fullContentUrl,
    'uploadDate': data.uploadDate || '2026-01-01T00:00:00Z',
    'duration': data.duration || 'PT30S',
    'embedUrl': fullContentUrl
  };
}

/**
 * Smart Alt Text Generator for Setups and Hardware
 */
export function generateSmartAltText(
  type: 'setup' | 'hardware' | 'brand' | 'avatar',
  primaryName: string,
  secondaryContext?: string
): string {
  switch (type) {
    case 'setup':
      return `${primaryName} - ${secondaryContext || 'Masaüstü Oyuncu ve Çalışma Alanı Kurulumu'}`;
    case 'hardware':
      return `${primaryName} - ${secondaryContext || 'Masaüstü Bilgisayar Ekipmanı ve Donanımı'}`;
    case 'brand':
      return `${primaryName} Markalı Oyun ve Çalışma Ekipmanları`;
    case 'avatar':
      return `@${primaryName} Profil Fotoğrafı | Setupss Topluluk Üyesi`;
    default:
      return primaryName;
  }
}

/**
 * Extract thumbnail URL (512 or 256) from optimized media folders
 */
export function getThumbnailUrl(url: string | null | undefined, size: 512 | 256 = 512): string {
  if (!url) return '';
  if (url.includes('/original/')) {
    const parts = url.split('/original/');
    if (parts.length === 2) {
      const fileNameParts = parts[1].split('/');
      const fileName = fileNameParts[fileNameParts.length - 1];
      return `${parts[0]}/thumb/${size}_${fileName}`;
    }
  }
  return url;
}
