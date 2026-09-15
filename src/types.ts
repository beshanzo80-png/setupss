export type SetupCategory = 'Minimalist' | 'RGB & Oyuncu' | 'Cozy / Retro' | 'Yazılımcı Atölyesi' | 'Kreatif Stüdyo';

export interface SetupComponent {
  id: string;
  category: string; // e.g., "Monitör", "Klavye", "Ekran Kartı", "Masa"
  name: string;     // e.g., "LG UltraFine 32\"", "Logitech MX Keys"
  link?: string;
}

export interface SetupComment {
  id: string;
  author: string;
  authorId?: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}

export interface SetupPost {
  id: string;
  title: string;
  owner: string;
  ownerId?: string;
  ownerAvatar?: string;
  bio: string;
  category: SetupCategory;
  description: string;
  image: string;
  likes: number;
  tags: string[];
  components: SetupComponent[];
  comments: SetupComment[];
  createdAt: string;
  ownerHasRgb?: boolean;
  likedByUser?: boolean;
  cardTheme?: 'dark' | 'soft-blue' | 'soft-purple' | 'soft-green' | 'soft-yellow' | 'soft-pink';
  videoUrl?: string;
  isBotShare?: boolean;
}

export interface WishlistItem {
  id: string;
  name: string;
  category: string;
  estimatedPrice: number;
  purchased: boolean;
  link?: string;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  receiverId: string;
  receiverName: string;
  receiverAvatar?: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  senderHasRgb?: boolean;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'none';
}

export interface Friendship {
  id: string;
  userId: string;
  friendId: string;
  status: 'pending' | 'accepted';
  createdAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  githubLink?: string;
  instagramLink?: string;
  linkedinLink?: string;
  coverPhoto?: string;
  customBadge?: string;
  customColor?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  type: 'like' | 'comment' | 'friend_request' | 'friend_accept' | 'system' | 'streak';
  title: string;
  content: string;
  link?: string;
  status: 'notification' | 'read' | 'archived' | 'deleted';
  createdAt: string;
}

export interface BrandEntity {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  createdAt?: string;
}

export interface HardwareCategoryEntity {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt?: string;
}

export const HardwareCategoryEnum = [
  'CPU', 'GPU', 'MOTHERBOARD', 'RAM', 'STORAGE_SSD', 'STORAGE_HDD',
  'PSU', 'CASE', 'COOLER_CPU', 'MONITOR', 'KEYBOARD', 'MOUSE',
  'HEADSET', 'MIC', 'WEBCAM', 'GAMEPAD', 'CHAIR', 'SPEAKER', 'NETWORK'
] as const;
export type HardwareCategoryType = typeof HardwareCategoryEnum[number];

export const IngestionSourceTypeEnum = [
  'BUILDCORES', 'IGDB', 'TECHPOWERUP', 'AI_SCRAPER', 'MANUAL'
] as const;
export type IngestionSourceType = typeof IngestionSourceTypeEnum[number];

export interface HardwareDbEntity {
  id: string;
  name: string;
  slug: string;
  brandId?: string;
  categoryId?: string;
  category?: HardwareCategoryType; // Added strict category
  parentHardwareId?: string; // 0007
  isCanonical?: boolean; // 0007
  variantType?: string; // 0007
  description?: string;
  specs?: Record<string, string>;
  imageUrl?: string;
  priceEstimate?: number;
  buyLink?: string;
  createdAt?: string;
}

export interface GameEntity {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  genre?: string;
  developer?: string;
  releaseYear?: number;
  steamId?: number;
  createdAt?: string;
}

export interface SetupHardwareRelation {
  setupId: string;
  hardwareId: string;
  notes?: string;
}

export interface SetupGameRelation {
  setupId: string;
  gameId: string;
}

export interface UserHardwareOwnership {
  id: string;
  userId: string;
  hardwareId: string;
  purchaseDate?: string;
  purchasePrice?: number;
  currency?: string;
  isCurrentlyOwned: boolean;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface HardwareAlias {
  id: string;
  alias: string;
  canonicalHardwareId: string;
}

export interface HardwareBenchmarkEntity {
  id: string;
  hardwareId: string;
  gameId?: string;
  cpuId?: string;
  resolution: string;
  preset?: string;
  upscalingTech?: string;
  rayTracingMode?: string;
  avgFps: number;
  onePercentLowFps?: number;
  sourceType?: string;
  sourceName?: string;
  sourceUrl?: string;
  confidenceScore?: number;
  verificationStatus?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  testRigMetadata?: any;
  createdAt: string;
}

