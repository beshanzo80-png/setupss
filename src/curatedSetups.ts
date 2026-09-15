import { SetupPost } from './types';

export const curatedSetups: SetupPost[] = [
  {
    id: "setup-1",
    ownerId: "admin",
    owner: "Beşir Hanzo",
    ownerAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80",
    bio: "Kod Yazan Kahve Canavarı ☕️",
    title: "Sade ve Güçlü",
    description: "Tamamen kablosuz ve minimalist bir yazılımcı köşesi. Verimlilik için her şey yerli yerinde.",
    image: "https://images.unsplash.com/photo-1491336477066-31156b5e4f35?auto=format&fit=crop&w=1200&q=80",
    category: "Minimalist",
    likes: 124,
    comments: [],
    tags: ["Minimalist", "Wireless", "Developer"],
    createdAt: new Date().toISOString(),
    cardTheme: "soft-blue",
    components: [
      { id: "c1", category: "Laptop", name: "Apple M3 Max MacBook Pro", link: "#" },
      { id: "c2", category: "Monitör", name: "Dell UltraSharp 32 4K", link: "#" }
    ]
  },
  {
    id: "setup-2",
    ownerId: "admin",
    owner: "Kreatif Can",
    ownerAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&h=200&q=80",
    bio: "RGB Profesörü & Neon Sevdalısı 🌈",
    title: "Renklerin Dansı",
    description: "Yaratıcılığımı tetikleyen bol RGB'li ve geniş ekranlı bir çalışma alanı.",
    image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1200&q=80",
    category: "RGB & Oyuncu",
    likes: 89,
    comments: [],
    tags: ["Gaming", "RGB", "Ultrawide"],
    createdAt: new Date().toISOString(),
    components: [
      { id: "c3", category: "Monitör", name: "Samsung Odyssey G9", link: "#" },
      { id: "c4", category: "Klavye", name: "Custom Mechanical Keyboard", link: "#" }
    ],
    cardTheme: "soft-purple"
  },
  {
    id: "setup-3",
    ownerId: "admin",
    owner: "Zeynep Tasarım",
    ownerAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&h=200&q=80",
    bio: "Piksel Bükücü & Bitki Büyücüsü 🌿",
    title: "Retro Modern Workspace",
    description: "Eski ve yeninin harmanlandığı, bol bitkili ve huzurlu bir tasarım stüdyosu.",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80",
    category: "Cozy / Retro",
    likes: 215,
    comments: [],
    tags: ["Cozy", "Retro", "Plants"],
    createdAt: new Date().toISOString(),
    cardTheme: "soft-green",
    components: [
      { id: "c5", category: "Masa", name: "IKEA Karlby Tabletop", link: "#" },
      { id: "c6", category: "Koltuk", name: "Herman Miller Aeron", link: "#" }
    ]
  },
  {
    id: "setup-4",
    ownerId: "ai-bot",
    owner: "Setupss AI (Bot)",
    ownerAvatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&h=200&q=80",
    bio: "Kurulum Danışmanı & Robot Gözü 🤖",
    title: "Endüstriyel Rustik Köşe",
    description: "Doğal ahşap ve metal aksamların harika birleşimiyle sıcak ama bir o kadar da profesyonel bir yazılımcı çalışma alanı.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    category: "Yazılımcı Atölyesi",
    likes: 312,
    comments: [],
    tags: ["Industrial", "Wood", "Developer", "TourVideo"],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    cardTheme: "soft-yellow",
    videoUrl: "https://www.youtube.com/embed/P4S83bM2k6s",
    isBotShare: true,
    components: [
      { id: "c7", category: "Monitör", name: "BenQ PD3220U 32'' 4K Designer", link: "#" },
      { id: "c8", category: "Aydınlatma", name: "ScreenBar Halo", link: "#" },
      { id: "c9", category: "Ses", name: "Audioengine A2+ Hoparlör", link: "#" }
    ]
  },
  {
    id: "setup-5",
    ownerId: "ai-bot",
    owner: "Setupss AI (Bot)",
    ownerAvatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&h=200&q=80",
    bio: "Kurulum Danışmanı & Robot Gözü 🤖",
    title: "Karanlık Tema & RGB Rüya",
    description: "Maksimum oyun ve üretim verimliliği için tasarlanmış, akıllı LED aydınlatmalı ultra-modern bilgisayar odası.",
    image: "https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?auto=format&fit=crop&w=1200&q=80",
    category: "RGB & Oyuncu",
    likes: 450,
    comments: [],
    tags: ["Gaming", "RGB", "DarkTheme", "SetupWalkthrough"],
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    cardTheme: "dark",
    videoUrl: "https://www.youtube.com/embed/9Xst6E_wTco",
    isBotShare: true,
    components: [
      { id: "c10", category: "Ekran", name: "LG C2 42'' OLED TV as Monitor", link: "#" },
      { id: "c11", category: "Klavye", name: "GMMK Pro Custom Mechanical Keyboard", link: "#" },
      { id: "c12", category: "Kasa", name: "Lian Li O11 Dynamic EVO", link: "#" }
    ]
  }
];

