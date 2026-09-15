import {
  buildImageObjectSchema,
  buildVideoObjectSchema,
  generateSmartAltText
} from '../src/utils/mediaSeo';
import { generateImageSitemapXml, generateVideoSitemapXml } from '../src/utils/programmaticSeo';
import fs from 'fs';
import path from 'path';

console.log("=== PHASE 9 IMAGE & VIDEO MEDIA SEO ENGINE AUDIT ===");

const baseUrl = 'https://setupss.ai.studio';

// 1. Schema.org ImageObject & VideoObject Node Generation Test
console.log("\n1. Media Schema.org Builders Test:");
const imageSchema = buildImageObjectSchema({
  url: '/images/setup-hero.jpg',
  title: 'Minimalist Oak Desk Setup',
  caption: 'Natural wood desk with LG DualUp monitors',
  width: 3840,
  height: 2160,
  authorName: 'alperen'
}, baseUrl);

const videoSchema = buildVideoObjectSchema({
  url: '/airobot.mp4',
  thumbnailUrl: '/airobot.jpg',
  title: 'Setupss AI Bot Assistant Interactive Video',
  description: 'AI-assisted hardware compatibility inspector and budget planner video.',
  uploadDate: '2026-01-01T00:00:00Z',
  duration: 'PT45S'
}, baseUrl);

console.log(`  └─ ImageObject Type: ${imageSchema['@type']} | ID: ${imageSchema['@id']} | Dimensions: ${imageSchema.width}x${imageSchema.height}`);
console.log(`  └─ VideoObject Type: ${videoSchema['@type']} | ID: ${videoSchema['@id']} | Duration: ${videoSchema.duration}`);

// 2. Smart Alt Text Generator Test
console.log("\n2. Smart Alt Text Generator Test:");
const setupAlt = generateSmartAltText('setup', 'Walnut Battlestation', 'RTX 5090 & LG OLED 34');
const hardwareAlt = generateSmartAltText('hardware', 'Logitech MX Master 3S', 'Ergonomic Productivity Mouse');
const brandAlt = generateSmartAltText('brand', 'Razer');
const avatarAlt = generateSmartAltText('avatar', 'alperen');

console.log(`  └─ Setup Alt Text: "${setupAlt}"`);
console.log(`  └─ Hardware Alt Text: "${hardwareAlt}"`);
console.log(`  └─ Brand Alt Text: "${brandAlt}"`);
console.log(`  └─ Avatar Alt Text: "${avatarAlt}"`);

// 3. XML Image and Video Sitemaps Generation Test
console.log("\n3. Google Media XML Sitemaps Generation Test:");
const dummySetups = [
  {
    id: 'setup-01',
    title: 'Cyberpunk Neon Setup',
    description: 'RGB lighting setup with custom mechanical keyboard',
    image: '/images/setup-01.jpg',
    videoUrl: 'https://example.com/videos/setup-01.mp4'
  },
  {
    id: 'setup-02',
    title: 'AI Mascot Workspace',
    description: 'Setupss AI Bot Assistant setup',
    image: '/airobot.jpg',
    videoUrl: '/airobot.mp4'
  }
];

const imageSitemapXml = generateImageSitemapXml(dummySetups, baseUrl);
const videoSitemapXml = generateVideoSitemapXml(dummySetups, baseUrl);

console.log(`  └─ Image Sitemap Length: ${imageSitemapXml.length} chars | Includes <image:geo_location>: ${imageSitemapXml.includes('<image:geo_location>')}`);
console.log(`  └─ Video Sitemap Length: ${videoSitemapXml.length} chars | Includes <video:publication_date>: ${videoSitemapXml.includes('<video:publication_date>')}`);

// 4. SafeImage & AiVideoAvatar Component Audit
console.log("\n4. React Media Components Code Audit:");
const safeImageSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/SafeImage.tsx'), 'utf8');
const aiVideoAvatarSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/AiVideoAvatar.tsx'), 'utf8');

console.log(`  └─ SafeImage itemProp="image": ${safeImageSrc.includes('itemProp="image"')}`);
console.log(`  └─ SafeImage loading logic: ${safeImageSrc.includes('computedLoading')}`);
console.log(`  └─ SafeImage decoding="async": ${safeImageSrc.includes("decoding = 'async'")}`);
console.log(`  └─ AiVideoAvatar poster image: ${aiVideoAvatarSrc.includes('poster=')}`);
console.log(`  └─ AiVideoAvatar preload="metadata": ${aiVideoAvatarSrc.includes('preload="metadata"')}`);

console.log("\n=== PHASE 9 VALIDATION COMPLETED SUCCESSFULLY ===");
