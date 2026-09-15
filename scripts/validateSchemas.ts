import { generateSeoMetadata } from '../src/utils/seoEngine';

console.log("=== PHASE 2.5 SCHEMA.ORG AUDIT & VALIDATION ===");

const testCases = [
  {
    name: '1. Global / WebSite / Organization / SearchAction',
    params: { baseUrl: 'https://setupss.ai.studio' }
  },
  {
    name: '2. Setup Entity (ItemPage, VisualArtwork, Person, ImageObject, VideoObject, Product, AggregateRating, BreadcrumbList)',
    params: {
      baseUrl: 'https://setupss.ai.studio',
      queryParams: { setup: 'setup-101' },
      setupData: {
        id: 'setup-101',
        title: 'Cyberpunk Neon Workstation',
        owner: 'Batuhan',
        ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
        category: 'Gaming',
        description: 'RGB neon light battlestation with RTX 4090 and OLED Curved monitor.',
        image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6',
        videoUrl: 'https://setupss.ai.studio/0730.mp4',
        likes: 142,
        components: [
          { category: 'GPU', name: 'NVIDIA RTX 4090' },
          { category: 'Monitor', name: 'ASUS ROG Swift OLED 34"' }
        ]
      }
    }
  },
  {
    name: '3. User Profile (ProfilePage, Person, ImageObject, BreadcrumbList)',
    params: {
      baseUrl: 'https://setupss.ai.studio',
      queryParams: { profile: 'Batuhan' },
      userData: {
        username: 'Batuhan',
        name: 'Batuhan Yilmaz',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
        bio: 'Senior Full Stack Developer & Mechanical Keyboard Collector'
      }
    }
  },
  {
    name: '4. Category Page (CollectionPage, BreadcrumbList)',
    params: {
      baseUrl: 'https://setupss.ai.studio',
      queryParams: { category: 'Yazılımcı' },
      categoryName: 'Yazılımcı'
    }
  },
  {
    name: '5. Tag Page (CollectionPage, BreadcrumbList)',
    params: {
      baseUrl: 'https://setupss.ai.studio',
      queryParams: { tag: 'minimal' },
      tagName: 'minimal'
    }
  },
  {
    name: '6. Hardware Entity (ItemPage, Product, AggregateRating, AggregateOffer, Brand, BreadcrumbList)',
    params: {
      baseUrl: 'https://setupss.ai.studio',
      queryParams: { hardware: 'RTX 4090' },
      hardwareName: 'NVIDIA RTX 4090'
    }
  },
  {
    name: '7. Brand Entity (CollectionPage, Brand, BreadcrumbList)',
    params: {
      baseUrl: 'https://setupss.ai.studio',
      queryParams: { brand: 'Logitech' },
      brandName: 'Logitech'
    }
  },
  {
    name: '8. TechArticle Guide (TechArticle, Person, Organization, BreadcrumbList)',
    params: {
      baseUrl: 'https://setupss.ai.studio',
      queryParams: { guide: 'kablo-yonetimi' },
      articleData: {
        id: 'kablo-yonetimi',
        title: 'Masaüstü Kablo Gizleme ve Düzenleme Rehberi',
        description: 'Adım adım masanızdaki kablo karmaşasını yok etme kılavuzu.',
        articleType: 'TechArticle' as const,
        authorName: 'Setupss Editör Ekibi'
      }
    }
  },
  {
    name: '8b. NewsArticle Update (NewsArticle, Person, Organization, BreadcrumbList)',
    params: {
      baseUrl: 'https://setupss.ai.studio',
      queryParams: { article: 'duyuru-2026' },
      articleData: {
        id: 'duyuru-2026',
        title: 'Setupss 2.0 Yayında: Yapay Zeka Bütçe Planlayıcı Yenilendi',
        description: 'Setupss topluluk güncellemeleri ve yeni özellikler duyurusu.',
        articleType: 'NewsArticle' as const,
        authorName: 'Setupss Basın Bülteni'
      }
    }
  },
  {
    name: '9. AI Budget Planner Tab (WebPage, FAQPage, BreadcrumbList)',
    params: {
      baseUrl: 'https://setupss.ai.studio',
      queryParams: { tab: 'ai' },
      tabName: 'ai'
    }
  }
];

const generatedTypes = new Set<string>();

testCases.forEach((tc) => {
  console.log(`\n--- Test Case: ${tc.name} ---`);
  const res = generateSeoMetadata(tc.params);
  const graph = res.jsonLd['@graph'];
  graph.forEach((node: any) => {
    generatedTypes.add(node['@type']);
    console.log(`  └─ Implemented Schema Type: @type = "${node['@type']}" (ID: ${node['@id'] || 'N/A'})`);
  });
});

console.log("\n=== SUMMARY OF GENERATED SCHEMA.ORG TYPES ===");
console.log(Array.from(generatedTypes).sort());
