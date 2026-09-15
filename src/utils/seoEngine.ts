/**
 * SETUPSS AI OPERATING SYSTEM (SAIOS)
 * Enterprise SEO Engine Module (Phase 2)
 *
 * Generates dynamic SEO metadata, OpenGraph, Twitter Cards, Canonical URLs,
 * Hreflang multilingual links, Schema.org JSON-LD structured data, and
 * bot crawler semantic HTML for all Setupss entities.
 */

import { MatrixParam, generateProgrammaticSeo } from './programmaticSeo';
import { getHardwareBySlug } from './hardwareEngine';
import { generateCentralizedSchemaGraph } from './schemaEngine';
import { t, SupportedLocale, generateHreflangLinks, ISO_LOCALE_MAP, preserveUgcText } from './i18n';
import { generateAiAnswerBlock, generateAiCrawlerHtmlSection, generateAiSpeakableSchema } from './geoEngine';
import { injectInternalLinks } from './internalLinking';
import { slugify } from './slug';

export interface SeoSetupData {
  id: string;
  title: string;
  owner: string;
  ownerId?: string;
  ownerAvatar?: string;
  bio?: string;
  category?: string;
  description?: string;
  image?: string;
  videoUrl?: string;
  tags?: string[];
  components?: Array<{ category?: string; name: string; link?: string }>;
  likes?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SeoUserData {
  id?: string;
  name?: string;
  username?: string;
  avatar?: string;
  bio?: string;
  customBadge?: string;
}

export interface SeoArticleData {
  id: string;
  title: string;
  description: string;
  body?: string;
  image?: string;
  authorName?: string;
  articleType?: 'TechArticle' | 'NewsArticle';
  datePublished?: string;
  dateModified?: string;
}

export interface SeoParams {
  baseUrl?: string;
  urlPath?: string;
  queryParams?: Record<string, string>;
  setupData?: SeoSetupData | null;
  userData?: SeoUserData | null;
  articleData?: SeoArticleData | null;
  categoryName?: string;
  tagName?: string;
  hardwareName?: string;
  brandName?: string;
  collectionName?: string;
  tabName?: string;
  locale?: string;
  matrixParam?: MatrixParam;
  matchCount?: number;
}

export interface SeoMetadataOutput {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  ogType: 'website' | 'article' | 'profile' | 'product';
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  ogLocale: string;
  twitterCard: 'summary_large_image' | 'summary';
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  robots: string;
  hreflangs: Array<{ hreflang: string; href: string }>;
  jsonLd: any;
  botPrerenderHtml: string;
}

const DEFAULT_BASE_URL = 'https://setupss.com';
const DEFAULT_IMAGE = 'https://setupss.com/logoarkaplanolmayan.png?v=2026_new';
const SUPPORTED_LOCALES = ['tr', 'en', 'de', 'fr', 'es'];

export function generateSeoMetadata(params: SeoParams): SeoMetadataOutput {
  const baseUrl = (params.baseUrl || DEFAULT_BASE_URL).replace(/\/$/, '');
  const queryParams = params.queryParams || {};
  const currentLang = params.locale || queryParams.lang || 'tr';

  const langKey = (currentLang as SupportedLocale) || 'tr';
  let title = t('site.title', langKey, 'SETUPSS | Masaüstü Setup Paylaşım Atölyesi & Yapay Zeka Bütçe Planlayıcı');
  let description = t('site.description', langKey, 'Setupss: Hayalindeki masaüstü kurulumunu (setup) tasarla, toplulukla paylaş ve bütçeni planla! Yapay zeka bütçe asistanı ile en ucuz ve uyumlu ekipmanları incele.');
  let keywords = 'setupss, setupss ai, setupss masa kurulumu, masa düzeni, setup, bilgisayar masası, oyuncu odası, yazılımcı setup, ekipman bütçesi, mekanik klavye, oyuncu monitörü';
  let ogType: 'website' | 'article' | 'profile' | 'product' = 'website';
  let ogImage = DEFAULT_IMAGE;
  let canonicalPath = '/';
  let pageEntityType = 'home';
  let jsonLdGraph: any[] = [];
  let botDetailsHtml = '';

  // 1. SETUP DETAIL PAGE (?setup=id or /setup/id)
  const setupId = queryParams.setup || (params.urlPath?.startsWith('/setup/') ? params.urlPath.split('/')[2] : null);
  if (setupId && params.setupData) {
    const setup = params.setupData;
    pageEntityType = 'setup';
    canonicalPath = `/setup/${setup.id}`;
    title = `${setup.title} by @${setup.owner} | SETUPS`;
    
    const compText = setup.components?.map(c => c.name).slice(0, 5).join(', ');
    description = setup.description || setup.bio || `${setup.owner} tarafından tasarlanan harika ${setup.category || 'masaüstü'} kurulumu. Ekipmanlar: ${compText || 'Özel bilgisayar bileşenleri'}.`;
    
    if (setup.tags && setup.tags.length > 0) {
      keywords = `${setup.tags.join(', ')}, ${keywords}`;
    }
    ogType = 'article';
    if (setup.image) ogImage = setup.image;

    const setupLikes = setup.likes && setup.likes > 0 ? setup.likes : 5;

    // ItemPage schema wrapper
    jsonLdGraph.push({
      '@type': 'ItemPage',
      '@id': `${baseUrl}${canonicalPath}#webpage`,
      'url': `${baseUrl}${canonicalPath}`,
      'name': title,
      'description': description,
      'inLanguage': currentLang,
      'breadcrumb': { '@id': `${baseUrl}${canonicalPath}#breadcrumb` }
    });

    // VisualArtwork / CreativeWork
    const artworkSchema: any = {
      '@type': 'VisualArtwork',
      '@id': `${baseUrl}${canonicalPath}#artwork`,
      'name': setup.title,
      'description': description,
      'image': {
        '@type': 'ImageObject',
        '@id': `${baseUrl}${canonicalPath}#primaryimage`,
        'url': ogImage,
        'contentUrl': ogImage,
        'caption': setup.title
      },
      'creator': {
        '@type': 'Person',
        '@id': `${baseUrl}/u/${encodeURIComponent(slugify(setup.owner))}#person`,
        'name': setup.owner,
        'alternateName': `@${setup.owner}`,
        'image': setup.ownerAvatar || undefined,
        'url': `${baseUrl}/u/${encodeURIComponent(slugify(setup.owner))}`
      },
      'artform': 'Workspace Design',
      'genre': setup.category || 'PC Setup',
      'dateCreated': setup.createdAt || new Date().toISOString(),
      'inLanguage': currentLang,
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': '5.0',
        'bestRating': '5',
        'worstRating': '1',
        'ratingCount': setupLikes,
        'reviewCount': setupLikes
      }
    };

    jsonLdGraph.push(artworkSchema);

    // If setup contains video (e.g., airobot.mp4 or setup.videoUrl)
    if (setup.videoUrl || setup.image?.endsWith('.mp4')) {
      const vUrl = setup.videoUrl || setup.image;
      jsonLdGraph.push({
        '@type': 'VideoObject',
        '@id': `${baseUrl}${canonicalPath}#video`,
        'name': `${setup.title} Video Tour`,
        'description': `Video presentation of ${setup.title} PC setup`,
        'thumbnailUrl': [ogImage],
        'contentUrl': vUrl,
        'uploadDate': setup.createdAt || new Date().toISOString()
      });
    }

    // BreadcrumbList
    jsonLdGraph.push({
      '@type': 'BreadcrumbList',
      '@id': `${baseUrl}${canonicalPath}#breadcrumb`,
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Anasayfa', 'item': `${baseUrl}/` },
        { '@type': 'ListItem', 'position': 2, 'name': setup.category || 'Keşfet', 'item': `${baseUrl}/category/${encodeURIComponent(slugify(setup.category || 'all'))}` },
        { '@type': 'ListItem', 'position': 3, 'name': setup.title, 'item': `${baseUrl}${canonicalPath}` }
      ]
    });

    // Product & Hardware Knowledge Graph Schema for Hardware components set
    if (setup.components && setup.components.length > 0) {
      const componentItems = setup.components.map((c: any, index: number) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'item': {
          '@type': 'Product',
          'name': c.name,
          'category': c.category || 'Donanım & Aksesuar',
          'description': `${c.name} - ${setup.title} kurulumunda kullanılan ${c.category || 'ekipman'} parçası.`
        }
      }));

      jsonLdGraph.push({
        '@type': 'ItemList',
        '@id': `${baseUrl}${canonicalPath}#hardware-list`,
        'name': `${setup.title} Donanım ve Ekipman Listesi`,
        'description': `Setupss üyesi @${setup.owner} tarafından ${setup.title} kurulumunda kullanılan ${setup.components.length} adet sistem ve masaüstü donanımı.`,
        'numberOfItems': setup.components.length,
        'itemListElement': componentItems
      });

      jsonLdGraph.push({
        '@type': 'Product',
        '@id': `${baseUrl}${canonicalPath}#product`,
        'name': `${setup.title} - Custom Workspace Setup`,
        'image': [ogImage.startsWith('/') ? `${baseUrl}${ogImage}` : ogImage],
        'description': `Masaüstü ve Donanım Kurulumu (@${setup.owner}). İçerdiği parçalar: ${compText}`,
        'brand': {
          '@type': 'Brand',
          'name': 'Setupss OS'
        },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': '4.9',
          'reviewCount': Math.max(setupLikes, 1),
          'ratingCount': Math.max(setupLikes, 1)
        },
        'offers': {
          '@type': 'AggregateOffer',
          'priceCurrency': 'TRY',
          'lowPrice': '1500',
          'highPrice': '250000',
          'offerCount': setup.components.length
        }
      });
    }

    botDetailsHtml = `
      <article itemscope itemtype="https://schema.org/TechArticle">
        <h2 itemprop="headline">${setup.title}</h2>
        <p><strong>Masaüstü Kurulum Sahibi:</strong> @${setup.owner}</p>
        <p><strong>Kurulum Kategorisi:</strong> ${setup.category || 'Masaüstü Setup'}</p>
        <p itemprop="description">${description}</p>
        ${setup.components && setup.components.length > 0 ? `
          <h3>Masaüstü Donanım ve Ekipman Listesi (Plain Text Spec Sheet for AI & LLM Crawlers)</h3>
          <ul itemprop="dependencies">
            ${setup.components.map((c: any) => `<li><strong>${c.category || 'Donanım/Ekipman'}:</strong> ${c.name}</li>`).join('')}
          </ul>
        ` : ''}
      </article>
    `;
  }
  // 2. USER PROFILE PAGE (?profile=username or ?user=id or /profile/username or /u/username)
  else if (queryParams.profile || queryParams.user || params.userData || params.urlPath?.startsWith('/profile/') || params.urlPath?.startsWith('/u/')) {
    const userSlug = params.urlPath?.startsWith('/profile/') ? params.urlPath.split('/')[2] : (params.urlPath?.startsWith('/u/') ? params.urlPath.split('/')[2] : null);
    const user = params.userData || {
      username: userSlug || queryParams.profile || 'user',
      name: userSlug || queryParams.profile || 'Setupss Üyesi',
      bio: 'Setupss topluluk üyesi ve masaüstü geliştiricisi.'
    };
    pageEntityType = 'profile';
    canonicalPath = `/u/${encodeURIComponent(user.username || user.name || 'user')}`;
    title = `@${user.username || user.name} | PC Setup & Oyuncu Odası Profili - SETUPSS`;
    description = user.bio || `@${user.username || user.name} kullanıcısının Setupss üzerindeki masaüstü kurulumları, favori ekipmanları ve bilgisayar bileşenleri.`;
    ogType = 'profile';
    if (user.avatar) ogImage = user.avatar;

    jsonLdGraph.push(
      {
        '@type': 'ProfilePage',
        '@id': `${baseUrl}${canonicalPath}#profilepage`,
        'url': `${baseUrl}${canonicalPath}`,
        'name': title,
        'description': description,
        'mainEntity': {
          '@type': 'Person',
          '@id': `${baseUrl}${canonicalPath}#person`,
          'name': user.name || user.username,
          'alternateName': `@${user.username || user.name}`,
          'image': {
            '@type': 'ImageObject',
            'url': user.avatar || ogImage
          },
          'description': description,
          'url': `${baseUrl}${canonicalPath}`
        },
        'breadcrumb': { '@id': `${baseUrl}${canonicalPath}#breadcrumb` }
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${baseUrl}${canonicalPath}#breadcrumb`,
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Anasayfa', 'item': `${baseUrl}/` },
          { '@type': 'ListItem', 'position': 2, 'name': 'Topluluk', 'item': `${baseUrl}/leaderboard` },
          { '@type': 'ListItem', 'position': 3, 'name': `@${user.username || user.name}`, 'item': `${baseUrl}${canonicalPath}` }
        ]
      }
    );

    botDetailsHtml = `
      <h2>@${user.username || user.name} Kullanıcı Profili</h2>
      <p>${user.bio || 'Setupss masaüstü tutkunu.'}</p>
    `;
  }
  // 3. CATEGORY PAGE (?category=slug or /category/slug)
  else if (queryParams.category || params.categoryName || params.urlPath?.startsWith('/category/')) {
    const catSlug = params.urlPath?.startsWith('/category/') ? params.urlPath.split('/')[2] : null;
    const category = params.categoryName || catSlug || queryParams.category || 'Masaüstü';
    pageEntityType = 'category';
    canonicalPath = `/category/${encodeURIComponent(category)}`;
    title = `${category} Setup Modelleri & Oyuncu Masası Tasarımları | SETUPSS`;
    description = `En popüler ${category} masaüstü kurulumlarını keşfet. Monitör düzenleri, klavye seçimleri, RGB aydınlatmalar ve kablo yönetimi ipuçları Setupss'ta.`;
    keywords = `${category} setup, ${category} masa düzeni, ${category} bilgisayar masası, ${keywords}`;

    jsonLdGraph.push(
      {
        '@type': 'CollectionPage',
        '@id': `${baseUrl}${canonicalPath}#collection`,
        'url': `${baseUrl}${canonicalPath}`,
        'name': `${category} Setup Koleksiyonu`,
        'description': description,
        'breadcrumb': { '@id': `${baseUrl}${canonicalPath}#breadcrumb` }
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${baseUrl}${canonicalPath}#breadcrumb`,
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Anasayfa', 'item': `${baseUrl}/` },
          { '@type': 'ListItem', 'position': 2, 'name': 'Kategoriler', 'item': `${baseUrl}/?tab=explore` },
          { '@type': 'ListItem', 'position': 3, 'name': category, 'item': `${baseUrl}${canonicalPath}` }
        ]
      }
    );

    botDetailsHtml = `
      <h2>${category} Masaüstü Setup Koleksiyonu</h2>
      <p>${description}</p>
    `;
  }
  // 4. TAG PAGE (?tag=slug or /tag/slug or /game/slug)
  else if (queryParams.tag || params.tagName || params.urlPath?.startsWith('/tag/') || params.urlPath?.startsWith('/game/')) {
    const tagSlug = params.urlPath?.startsWith('/tag/') ? params.urlPath.split('/')[2] : (params.urlPath?.startsWith('/game/') ? params.urlPath.split('/')[2] : null);
    const tag = params.tagName || tagSlug || queryParams.tag || 'setup';
    const isGame = params.urlPath?.startsWith('/game/');
    pageEntityType = isGame ? 'game' : 'tag';
    canonicalPath = isGame ? `/game/${encodeURIComponent(tag)}` : `/tag/${encodeURIComponent(tag)}`;
    title = isGame 
      ? `${tag} Oyunu İçin En İyi PC Setup Tasarımları | SETUPSS`
      : `#${tag} etiketli PC Setup ve Ekipman Paylaşımları | SETUPSS`;
    description = isGame
      ? `${tag} oyunu için optimize edilmiş, en yüksek FPS sunan oyuncu odaları, sistem özellikleri ve masaüstü kurulumları.`
      : `#${tag} etiketi altındaki en beğenilen oyuncu masaları, yazılımcı atölyeleri ve donanım incelemelerini incele.`;
    keywords = `${tag}, #${tag}, ${tag} setup, ${isGame ? `${tag} game, gaming pc` : ''}, ${keywords}`;

    jsonLdGraph.push(
      {
        '@type': 'CollectionPage',
        '@id': `${baseUrl}${canonicalPath}#tagpage`,
        'url': `${baseUrl}${canonicalPath}`,
        'name': isGame ? `${tag} Gaming Setups` : `#${tag} Setups`,
        'description': description,
        'breadcrumb': { '@id': `${baseUrl}${canonicalPath}#breadcrumb` }
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${baseUrl}${canonicalPath}#breadcrumb`,
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Anasayfa', 'item': `${baseUrl}/` },
          { '@type': 'ListItem', 'position': 2, 'name': 'Etiketler', 'item': `${baseUrl}/?tab=explore` },
          { '@type': 'ListItem', 'position': 3, 'name': `#${tag}`, 'item': `${baseUrl}${canonicalPath}` }
        ]
      }
    );

    botDetailsHtml = `
      <h2>#${tag} Etiketli Masa Kurulumları</h2>
      <p>${description}</p>
    `;
  }
  // 5. HARDWARE PAGE (?hardware=slug or ?gpu=slug or ?cpu=slug or /hardware/slug or /gpu/slug or /cpu/slug)
  else if (queryParams.hardware || queryParams.gpu || queryParams.cpu || params.hardwareName || params.urlPath?.startsWith('/hardware/') || params.urlPath?.startsWith('/gpu/') || params.urlPath?.startsWith('/cpu/')) {
    const hwSlug = params.urlPath?.startsWith('/hardware/') ? params.urlPath.split('/')[2] : (params.urlPath?.startsWith('/gpu/') ? params.urlPath.split('/')[2] : (params.urlPath?.startsWith('/cpu/') ? params.urlPath.split('/')[2] : null));
    const rawHw = params.hardwareName || hwSlug || queryParams.hardware || queryParams.gpu || queryParams.cpu || 'Donanım';
    const hw = getHardwareBySlug(rawHw);
    const isGpu = params.urlPath?.startsWith('/gpu/') || queryParams.gpu;
    const isCpu = params.urlPath?.startsWith('/cpu/') || queryParams.cpu;
    pageEntityType = isGpu ? 'gpu' : (isCpu ? 'cpu' : 'hardware');
    canonicalPath = isGpu ? `/gpu/${hw.slug}` : (isCpu ? `/cpu/${hw.slug}` : `/hardware/${hw.slug}`);
    title = `${hw.brand} ${hw.model} içeren En İyi Masaüstü Setupları | SETUPSS`;
    description = `${hw.brand} ${hw.model} (${hw.category}) kullanan oyuncu ve yazılımcı masalarını incele. ${hw.description}`;

    const lowPrice = hw.msrp ? Math.round(hw.msrp * 35) : 1200;
    const highPrice = hw.msrp ? Math.round(hw.msrp * 38) : 45000;

    jsonLdGraph.push(
      {
        '@type': 'ItemPage',
        '@id': `${baseUrl}${canonicalPath}#itempage`,
        'url': `${baseUrl}${canonicalPath}`,
        'name': title,
        'description': description,
        'breadcrumb': { '@id': `${baseUrl}${canonicalPath}#breadcrumb` }
      },
      {
        '@type': 'Product',
        '@id': `${baseUrl}${canonicalPath}#product`,
        'name': `${hw.brand} ${hw.model}`,
        'description': hw.description,
        'image': hw.images[0] || ogImage,
        'brand': { '@type': 'Brand', 'name': hw.brand },
        'offers': {
          '@type': 'AggregateOffer',
          'priceCurrency': 'TRY',
          'lowPrice': lowPrice.toString(),
          'highPrice': highPrice.toString(),
          'offerCount': hw.setupCount || 5
        },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': hw.averageRating.toString(),
          'ratingCount': hw.setupCount * 3,
          'reviewCount': hw.setupCount * 3
        }
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${baseUrl}${canonicalPath}#breadcrumb`,
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Anasayfa', 'item': `${baseUrl}/` },
          { '@type': 'ListItem', 'position': 2, 'name': 'Donanımlar', 'item': `${baseUrl}/deals` },
          { '@type': 'ListItem', 'position': 3, 'name': `${hw.brand} ${hw.model}`, 'item': `${baseUrl}${canonicalPath}` }
        ]
      },
      {
        '@type': 'FAQPage',
        '@id': `${baseUrl}${canonicalPath}#faq`,
        'mainEntity': [
          {
            '@type': 'Question',
            'name': `${hw.brand} ${hw.model} hangi sistemlerle uyumludur?`,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': `${hw.brand} ${hw.model} güncel oyuncu ve yazılımcı sistemleriyle tam uyumludur. Community kayıtlarında ${hw.setupCount} doğrulanmış masa kurulumunda kullanılmaktadır.`
            }
          }
        ]
      }
    );

    botDetailsHtml = `
      <article>
        <h2>${hw.brand} ${hw.model} (${hw.category})</h2>
        <p>${hw.description}</p>
        <section>
          <h3>Teknik Özellikler</h3>
          <ul>
            ${Object.entries(hw.specifications).map(([k, v]) => `<li><strong>${k}:</strong> ${v}</li>`).join('')}
          </ul>
        </section>
        <section>
          <h3>Topluluk İstatistikleri</h3>
          <p>Mevcut Doğrulanmış Setup Sayısı: ${hw.setupCount} | Ortalama Puan: ${hw.averageRating} / 5.0</p>
        </section>
      </article>
    `;
  }
  // 6. BRAND PAGE (?brand=slug)
  else if (queryParams.brand || params.brandName) {
    const brand = params.brandName || queryParams.brand || 'Marka';
    pageEntityType = 'brand';
    canonicalPath = `/brand/${encodeURIComponent(slugify(brand))}`;
    title = `${brand} Ekipmanlı Masaüstü Setup İlhamları | SETUPSS`;
    description = `${brand} klavye, kulaklık, monitör ve aksesuarlarıyla donatılmış en kaliteli masa düzenlerini görüntüle.`;

    jsonLdGraph.push(
      {
        '@type': 'CollectionPage',
        '@id': `${baseUrl}${canonicalPath}#brandpage`,
        'url': `${baseUrl}${canonicalPath}`,
        'name': title,
        'description': description,
        'breadcrumb': { '@id': `${baseUrl}${canonicalPath}#breadcrumb` }
      },
      {
        '@type': 'Brand',
        '@id': `${baseUrl}${canonicalPath}#brand`,
        'name': brand,
        'description': description,
        'logo': ogImage
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${baseUrl}${canonicalPath}#breadcrumb`,
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Anasayfa', 'item': `${baseUrl}/` },
          { '@type': 'ListItem', 'position': 2, 'name': 'Markalar', 'item': `${baseUrl}/deals` },
          { '@type': 'ListItem', 'position': 3, 'name': brand, 'item': `${baseUrl}${canonicalPath}` }
        ]
      }
    );

    botDetailsHtml = `
      <h2>${brand} Ürünleriyle Hazırlanan Setuplar</h2>
      <p>${description}</p>
    `;
  }
  // 7. ARTICLE / GUIDE PAGE (?article=slug or ?guide=slug or params.articleData or /guide/slug or /blog/slug or /article/slug)
  else if (queryParams.article || queryParams.guide || params.articleData || params.urlPath?.startsWith('/guide/') || params.urlPath?.startsWith('/blog/') || params.urlPath?.startsWith('/article/')) {
    const artSlug = params.urlPath?.startsWith('/guide/') ? params.urlPath.split('/')[2] : (params.urlPath?.startsWith('/blog/') ? params.urlPath.split('/')[2] : (params.urlPath?.startsWith('/article/') ? params.urlPath.split('/')[2] : null));
    const isBlog = params.urlPath?.startsWith('/blog/');
    const artId = artSlug || queryParams.article || queryParams.guide || 'guide';
    const art = params.articleData || {
      id: artId,
      title: artId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      description: `${artId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} rehberi ve detaylı incelemesi.`,
      authorName: 'Setupss Editör Ekibi',
      datePublished: new Date().toISOString()
    };
    pageEntityType = isBlog ? 'blog' : 'article';
    canonicalPath = isBlog ? `/blog/${encodeURIComponent(art.id)}` : `/guide/${encodeURIComponent(art.id)}`;
    title = `${art.title} | SETUPSS ${isBlog ? 'Blog' : 'Rehber'}`;
    description = art.description;
    ogType = 'article';

    jsonLdGraph.push(
      {
        '@type': art.articleType || 'TechArticle',
        '@id': `${baseUrl}${canonicalPath}#article`,
        'headline': art.title,
        'description': art.description,
        'image': [art.image || ogImage],
        'datePublished': art.datePublished || new Date().toISOString(),
        'dateModified': art.dateModified || new Date().toISOString(),
        'author': {
          '@type': 'Person',
          'name': art.authorName || 'Setupss Team'
        },
        'publisher': { '@id': `${baseUrl}/#organization` },
        'inLanguage': currentLang,
        'mainEntityOfPage': `${baseUrl}${canonicalPath}`
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${baseUrl}${canonicalPath}#breadcrumb`,
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Anasayfa', 'item': `${baseUrl}/` },
          { '@type': 'ListItem', 'position': 2, 'name': 'Rehberler', 'item': `${baseUrl}/blog` },
          { '@type': 'ListItem', 'position': 3, 'name': art.title, 'item': `${baseUrl}${canonicalPath}` }
        ]
      }
    );

    botDetailsHtml = `
      <h2>${art.title}</h2>
      <p>${art.description}</p>
    `;
  }
  // 8. TAB PAGES (explore, wishlist, ai, deals, leaderboard, feed)
  else if (queryParams.tab || params.tabName) {
    const tab = params.tabName || queryParams.tab || 'explore';
    if (tab === 'explore' || tab === 'main' || !tab) {
      canonicalPath = '/explore';
    } else if (tab === 'wishlist' || tab === 'ai') {
      canonicalPath = '/ai-planner';
    } else if (tab === 'leaderboard') {
      canonicalPath = '/leaderboard';
    } else if (tab === 'deals') {
      canonicalPath = '/deals';
    } else if (tab === 'trending') {
      canonicalPath = '/trending';
    } else if (tab === 'latest' || tab === 'feed') {
      canonicalPath = '/latest';
    } else {
      canonicalPath = `/${tab}`;
    }

    if (tab === 'wishlist' || tab === 'ai') {
      title = 'Yapay Zeka Bütçe Planlayıcı & Masa Ekipman Listesi | SETUPSS';
      description = 'Hayalindeki masaüstü kurulumu bütçesini yapay zeka asistanı ile hesapla! Güncel Akakçe piyasa fiyatlarıyla monitör, kulaklık, klavye listeleri.';
      
      // FAQPage schema for AI Bütçe Planlayıcı tab
      jsonLdGraph.push({
        '@type': 'FAQPage',
        '@id': `${baseUrl}${canonicalPath}#faq`,
        'mainEntity': [
          {
            '@type': 'Question',
            'name': 'Setupss AI Bütçe Planlayıcı nasıl çalışır?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Setupss AI, hedef bütçenize göre en uyumlu ve fiyat-performans oranı yüksek monitör, klavye, kulaklık ve kasa bileşenlerini otomatik listeler ve Akakçe fiyatlarıyla bütçe tablonuzu çıkarır.'
            }
          },
          {
            '@type': 'Question',
            'name': 'Masaüstü setup bütçesi hazırlarken nelere dikkat edilmeli?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Ergonomik koltuk ve monitör standı seçimi, mekanik klavye anahtar türü (switch), kablo yönetimi aksesuarları ve göz sağlığı için LED aydınlatma dengesi gözetilmelidir.'
            }
          }
        ]
      });

    } else if (tab === 'deals') {
      title = 'Trend Oyuncu Ekipmanı Fırsatları & İndirimler | SETUPSS';
      description = 'Ekran kartı, mekanik klavye, oyuncu kulaklığı ve monitörlerde güncel fiyat düşüşleri ve indirim fırsatları.';
    } else if (tab === 'leaderboard') {
      title = 'Liderlik Tablosu & En Beğenilen Masa Setupları | SETUPSS';
      description = 'Topluluk tarafından en çok beğenilen haftalık ve aylık şampiyon masaüstü setup tasarımları.';
    } else if (tab === 'feed') {
      title = 'Canlı Topluluk Akışı & Son Paylaşılan Setuplar | SETUPSS';
      description = 'Setupss topluluğunun anlık paylaştığı son masaüstü kurulumları ve ekipman güncellemeleri.';
    } else {
      title = 'Masaüstü Setup Keşfet & İlham Al | SETUPSS';
      description = 'Binlerce özenle seçilmiş oyuncu masası, minimalist çalışma alanı ve yazılımcı atölyesini keşfet.';
    }

    jsonLdGraph.push(
      {
        '@type': 'WebPage',
        '@id': `${baseUrl}${canonicalPath}#webpage`,
        'url': `${baseUrl}${canonicalPath}`,
        'name': title,
        'description': description,
        'breadcrumb': { '@id': `${baseUrl}${canonicalPath}#breadcrumb` }
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${baseUrl}${canonicalPath}#breadcrumb`,
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Anasayfa', 'item': `${baseUrl}/` },
          { '@type': 'ListItem', 'position': 2, 'name': tab.toUpperCase(), 'item': `${baseUrl}${canonicalPath}` }
        ]
      }
    );

    botDetailsHtml = `
      <h2>${title}</h2>
      <p>${description}</p>
    `;
  } else if (params.matrixParam) {
    const prog = generateProgrammaticSeo(params.matrixParam, baseUrl);
    title = prog.title;
    description = prog.description;
    keywords = prog.keywords;
    canonicalPath = prog.canonicalPath;
    jsonLdGraph.push(...prog.schemaGraph);

    botDetailsHtml = `
      <article>
        <h2>${title}</h2>
        <p>${description}</p>
        <section>
          <h3>Overview & AI Summary</h3>
          <p>${prog.geoSummary.overview}</p>
          <ul>
            ${prog.geoSummary.keyTakeaways.map(k => `<li>${k}</li>`).join('')}
          </ul>
        </section>
        <section>
          <h3>Frequently Asked Questions</h3>
          ${prog.geoSummary.faq.map(f => `<div><h4>${f.question}</h4><p>${f.answer}</p></div>`).join('')}
        </section>
        <nav>
          <h3>Related Workspaces</h3>
          <ul>
            ${prog.internalLinks.map(l => `<li><a href="${baseUrl}${l.href}">${l.label}</a></li>`).join('')}
          </ul>
        </nav>
      </article>
    `;
  } else {
    // Standard Homepage WebPage Schema
    jsonLdGraph.push({
      '@type': 'WebPage',
      '@id': `${baseUrl}/#webpage`,
      'url': `${baseUrl}/`,
      'name': title,
      'description': description,
      'isPartOf': { '@id': `${baseUrl}/#website` },
      'breadcrumb': { '@id': `${baseUrl}/#breadcrumb` }
    });

    jsonLdGraph.push({
      '@type': 'BreadcrumbList',
      '@id': `${baseUrl}/#breadcrumb`,
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Anasayfa', 'item': `${baseUrl}/` }
      ]
    });
  }

  // 9. GLOBAL BASE STRUCTURE (WebSite & Organization for Graph)
  jsonLdGraph.unshift(
    {
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      'url': `${baseUrl}/`,
      'name': 'Setupss',
      'alternateName': ['SETUPSS', 'Setupss AI', 'Setupss Setup Paylaşım Atölyesi'],
      'description': 'Masaüstü kurulumu (setup) paylaşım, donanım inceleme ve yapay zeka bütçe planlama platformu.',
      'publisher': { '@id': `${baseUrl}/#organization` },
      'potentialAction': {
        '@type': 'SearchAction',
        'target': `${baseUrl}/?s={search_term_string}`,
        'query-input': 'required name=search_term_string'
      },
      'inLanguage': SUPPORTED_LOCALES
    },
    {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      'name': 'Setupss',
      'url': `${baseUrl}/`,
      'logo': {
        '@type': 'ImageObject',
        '@id': `${baseUrl}/#logo`,
        'url': `${baseUrl}/logoarkaplanolmayan.png?v=2026_new`,
        'caption': 'Setupss Logo'
      },
      'image': `${baseUrl}/logoarkaplanolmayan.png?v=2026_new`,
      'sameAs': [
        'https://github.com/setupss',
        'https://x.com/setupss',
        'https://instagram.com/setupss'
      ],
      'contactPoint': {
        '@type': 'ContactPoint',
        'contactType': 'customer support',
        'url': `${baseUrl}/`,
        'availableLanguage': ['Turkish', 'English', 'German', 'French', 'Spanish']
      }
    }
  );

  const fullCanonicalUrl = `${baseUrl}${canonicalPath}`;

  // Ensure ogImage is always a fully qualified absolute URL for WhatsApp/Discord/Twitter cards
  let finalOgImage = ogImage;
  if (finalOgImage && finalOgImage.startsWith('/')) {
    finalOgImage = `${baseUrl}${finalOgImage}`;
  }

  // Build Hreflang URLs for internationalization
  const hreflangs = generateHreflangLinks(canonicalPath, baseUrl);

  // Add Speakable specification for Voice & AI search
  jsonLdGraph.push(generateAiSpeakableSchema(fullCanonicalUrl));

  const jsonLd = generateCentralizedSchemaGraph({
    baseUrl,
    canonicalUrl: fullCanonicalUrl,
    title,
    description,
    entities: jsonLdGraph
  });

  const aiCrawlerSection = generateAiCrawlerHtmlSection({
    entityType: pageEntityType,
    entityName: title,
    summary: description,
    facts: {
      'Entity Name': title,
      'Page Category': pageEntityType,
      'Canonical Endpoint': fullCanonicalUrl,
      'Verified Platform Source': 'Setupss OS (https://setupss.com)'
    }
  });

  const fullBotPrerenderHtml = `
    <div id="seo-crawler-content" data-entity="${pageEntityType}" style="padding: 24px; font-family: system-ui, -apple-system, sans-serif; max-width: 900px; margin: 0 auto; color: #1e293b;">
      <header>
        <h1 style="font-size: 28px; font-weight: 800; color: #0f172a; margin-bottom: 12px;">${title}</h1>
        <p style="font-size: 16px; line-height: 1.6; color: #475569;">${description}</p>
      </header>
      <main style="margin-top: 20px;">
        <img src="${finalOgImage}" alt="${title}" style="max-width: 100%; height: auto; border-radius: 12px; margin-bottom: 20px;" />
        ${injectInternalLinks(botDetailsHtml)}
        ${aiCrawlerSection}
      </main>
      <footer style="margin-top: 30px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #64748b;">
        <p>SETUPSS - Global Masaüstü Setup & Donanım Atölyesi. <a href="${fullCanonicalUrl}">${fullCanonicalUrl}</a></p>
      </footer>
    </div>
  `;

  return {
    title,
    description,
    keywords,
    canonicalUrl: fullCanonicalUrl,
    ogType,
    ogTitle: title,
    ogDescription: description,
    ogImage: finalOgImage,
    ogUrl: fullCanonicalUrl,
    ogLocale: (ISO_LOCALE_MAP[langKey] || 'tr-TR').replace('-', '_'),
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: finalOgImage,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    hreflangs,
    jsonLd,
    botPrerenderHtml: fullBotPrerenderHtml
  };
}

/**
 * Utility to inject SEO metadata into raw HTML template string on the server side
 */
export function injectSeoIntoHtml(rawHtml: string, seo: SeoMetadataOutput, isBot: boolean = false): string {
  let html = rawHtml;

  // Replace Title
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(seo.title)}<\/title>`);

  // Meta Description
  html = replaceOrInsertMeta(html, 'name', 'description', seo.description);

  // Meta Keywords
  html = replaceOrInsertMeta(html, 'name', 'keywords', seo.keywords);

  // Robots Meta
  html = replaceOrInsertMeta(html, 'name', 'robots', seo.robots);

  // Canonical Link
  if (/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i.test(html)) {
    html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${seo.canonicalUrl}" />`);
  } else {
    html = html.replace('</head>', `  <link rel="canonical" href="${seo.canonicalUrl}" />\n</head>`);
  }

  // OpenGraph Tags
  html = replaceOrInsertMeta(html, 'property', 'og:site_name', 'SETUPSS');
  html = replaceOrInsertMeta(html, 'property', 'og:type', seo.ogType);
  html = replaceOrInsertMeta(html, 'property', 'og:title', seo.ogTitle);
  html = replaceOrInsertMeta(html, 'property', 'og:description', seo.ogDescription);
  html = replaceOrInsertMeta(html, 'property', 'og:image', seo.ogImage);
  html = replaceOrInsertMeta(html, 'property', 'og:image:width', '1200');
  html = replaceOrInsertMeta(html, 'property', 'og:image:height', '630');
  html = replaceOrInsertMeta(html, 'property', 'og:image:alt', seo.ogTitle);
  html = replaceOrInsertMeta(html, 'property', 'og:url', seo.ogUrl);
  html = replaceOrInsertMeta(html, 'property', 'og:locale', seo.ogLocale);

  // Twitter Tags
  html = replaceOrInsertMeta(html, 'name', 'twitter:card', seo.twitterCard);
  html = replaceOrInsertMeta(html, 'name', 'twitter:site', '@setupss');
  html = replaceOrInsertMeta(html, 'name', 'twitter:title', seo.twitterTitle);
  html = replaceOrInsertMeta(html, 'name', 'twitter:description', seo.twitterDescription);
  html = replaceOrInsertMeta(html, 'name', 'twitter:image', seo.twitterImage);
  html = replaceOrInsertMeta(html, 'name', 'twitter:image:alt', seo.twitterTitle);

  // Hreflang links injection
  const hreflangTags = seo.hreflangs
    .map(h => `<link rel="alternate" hreflang="${h.hreflang}" href="${h.href}" />`)
    .join('\n    ');
  
  // Remove existing alternate hreflangs if present, then insert
  html = html.replace(/<link\s+rel="alternate"\s+hreflang="[^"]*"\s+href="[^"]*"\s*\/?>\n?/gi, '');
  html = html.replace('</head>', `  ${hreflangTags}\n</head>`);

  // JSON-LD Script Injection
  const jsonLdString = JSON.stringify(seo.jsonLd, null, 2);
  const jsonLdScript = `<script type="application/ld+json" id="saios-seo-jsonld">\n${jsonLdString}\n</script>`;

  if (/<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/i.test(html)) {
    html = html.replace(/<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/i, jsonLdScript);
  } else {
    html = html.replace('</head>', `  ${jsonLdScript}\n</head>`);
  }

  // If request comes from a crawler bot, inject semantic HTML fragment into body <noscript>
  if (isBot && seo.botPrerenderHtml) {
    const noscriptBlock = `<noscript id="bot-seo-prerender">\n${seo.botPrerenderHtml}\n</noscript>`;
    html = html.replace('<div id="root"></div>', `<div id="root"></div>\n${noscriptBlock}`);
  }

  return html;
}

function replaceOrInsertMeta(html: string, attrName: 'name' | 'property', attrValue: string, contentValue: string): string {
  const escapedContent = escapeHtml(contentValue);
  const regex = new RegExp(`<meta\\s+${attrName}="${attrValue}"\\s+content="[^"]*"\\s*\\/?>`, 'i');
  
  if (regex.test(html)) {
    return html.replace(regex, `<meta ${attrName}="${attrValue}" content="${escapedContent}" />`);
  } else {
    return html.replace('</head>', `  <meta ${attrName}="${attrValue}" content="${escapedContent}" />\n</head>`);
  }
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
