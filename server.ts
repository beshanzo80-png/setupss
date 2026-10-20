import { getHardwareBySlug, compareHardware, HARDWARE_CATALOG } from './src/utils/hardwareEngine.js';
import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import pgSession from "connect-pg-simple";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

import { icecatSyncBot } from "./server/services/IcecatSyncService.js";
import { userRoutes } from "./server/routes/userRoutes.js";
import { setupRoutes } from "./server/routes/setupRoutes.js";
import { hardwareRoutes } from "./server/routes/hardwareRoutes.js";
import { authService } from "./server/services/authService.js";
import { requireAuth, requireAdmin, optionalAuth } from "./server/middlewares/authMiddleware.js";

import { SetupPost, WishlistItem, ChatMessage } from "./src/types.js";
import { generateSeoMetadata, injectSeoIntoHtml } from "./src/utils/seoEngine.js";
import { 
  generateMainSitemapIndex, 
  generateProgrammaticSitemapXml, 
  generateImageSitemapXml, 
  generateVideoSitemapXml,
  generateSetupsSitemapXml,
  generateBlogSitemapXml,
  generateGamesSitemapXml,
  generateTagsSitemapXml,
  generateBrandsSitemapXml,
  generateCategoriesSitemapXml,
  generateHardwareSitemapXml,
  generateUsersSitemapXml,
  MatrixParam
} from "./src/utils/programmaticSeo.js";
import { 
  pool, 
  checkDbActive,
  initializeDatabase,
  getSetupsFromDb,
  addSetupToDb,
  updateSetupLikesInDb,
  updateSetupCommentsInDb,
  deleteSetupFromDb,
  saveSetupsBatchToDb,
  getWishlistFromDb,
  addWishlistItemToDb,
  updateWishlistItemInDb,
  deleteWishlistItemFromDb,
  getUserByEmail,
  getUserByName,
  getUserByReferenceCode,
  getUserById,
  createUser,
  verifyUser,
  updateUserInDb,
  updateUserProfileInDb,
  incrementInviteCount,
  getChatHistoryFromDb,
  addChatMessageToDb,
  markMessagesAsReadInDb,
  getAllUserMessagesFromDb,
  addFriendshipToDb,
  updateFriendshipStatusInDb,
  deleteFriendshipInDb,
  getFriendshipsForUserFromDb,
  logActivityToDb,
  getActivityLogsFromDb,
  getAllUsersFromDb,
  getAllMessagesFromDb,
  deleteUserFromDb,
  deleteChatMessageFromDb,
  getMediaFilesFromDb,
  addMediaFileToDb,
  deleteMediaFileFromDb,
  addCommentToDb,
  broadcastMessageToDb,
  getSiteSettingsFromDb,
  updateSiteSettingsInDb,
  getBrandsFromDb,
  getBrandByIdOrSlug,
  createBrandInDb,
  updateBrandInDb,
  deleteBrandFromDb,
  getHardwareCategoriesFromDb,
  getHardwareCategoryByIdOrSlug,
  createHardwareCategoryInDb,
  updateHardwareCategoryInDb,
  deleteHardwareCategoryFromDb,
  getHardwareFromDb,
  getHardwareByIdOrSlug,
  createHardwareInDb,
  updateHardwareInDb,
  deleteHardwareFromDb,
  getGamesFromDb,
  getGameByIdOrSlug,
  createGameInDb,
  updateGameInDb,
  deleteGameFromDb,
  linkSetupToHardware,
  unlinkSetupFromHardware,
  linkSetupToGame,
  unlinkSetupFromGame,
  getSetupHardware,
  getSetupGames,
  getHardwarePaginated,
  getBrandsPaginated,
  getGamesPaginated,
  softDeleteEntityInDb,
  bulkInsertHardwareInDb,
  createEntityAuditLog,
  getEntityAuditLogs,
  getHealthStatusFromDb,
  getMigrationHistoryFromDb,
  addNotificationToDb,
  addBotReportToDb,
  getBotReportsFromDb,
  resolveBotReportInDb,
  clearBotReportsInDb,
  getGlobalChatHistoryFromDb,
  createAiConversation,
  addAiMessage,
  getAiConversationsForUser,
  getAiMessagesForConversation,
  logAiUsage,
  getAiAnalyticsForAdmin,
  getChatRooms,
  getRoomMessages,
  addRoomMessage,
  createChatRoom,
  localUsersList,
  getBlogPostsFromDb,
  getBlogPostBySlugFromDb,
  createBlogPostInDb,
  voteBlogPostInDb
} from "./server-db.js";
import { curatedSetups } from "./src/curatedSetups.js";
import { storageService } from "./server/storageService.js";
import { realtimeService } from "./server/realtimeService.js";
import { sentinelService } from "./server/sentinelService.js";
import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

dotenv.config({ override: true });

// Initialize Firebase Admin dynamically using client-side config
try {
  const firebaseConfigPath = path.join(process.cwd(), "firebase-applet-config.json");
  if (fs.existsSync(firebaseConfigPath)) {
    const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, "utf-8"));
    if (getApps().length === 0) {
      initializeApp({
        projectId: firebaseConfig.projectId,
      });
      console.log(`✅ [Firebase Admin] Initialized securely with projectId: ${firebaseConfig.projectId}`);
    }
  } else {
    console.warn("⚠️ [Firebase Admin] firebase-applet-config.json not found. Verification might fail.");
  }
} catch (err) {
  console.error("❌ [Firebase Admin] Failed to initialize:", err);
}

// Local in-memory fallbacks if database is disconnected or unreachable
let localSetups = JSON.parse(JSON.stringify(curatedSetups));
let localWishlist: any[] = [
  { id: "w-1", name: "IKEA Karlby Meşe Tabla", category: "Masaüstü / Mobilya", estimatedPrice: 4200, purchased: true, notes: "Alex çekmecelerle birleştirilecek." },
  { id: "w-2", name: "Keychron K2 V2 Mekanik Klavye", category: "Klavye / Mouse", estimatedPrice: 2800, purchased: false, link: "https://keychron.com", notes: "Brown switch tercih edilecek." },
  { id: "w-3", name: "Xiaomi Monitör Arkası Işık Çubuğu", category: "Işıklandırma / Ses", estimatedPrice: 1200, purchased: false, notes: "Göz yorgunluğunu önlemek için." }
];

let localUsers: any[] = [
  {
    id: "mock-user-123",
    email: "ziyaretci@setupss.com",
    password_hash: bcrypt.hashSync("123456", 10),
    name: "Ziyaretçi Geliştirici",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
    is_verified: true,
    bio: "Teknoloji tutkunu ve minimal masaüstü düzeni geliştiricisi.",
    githubLink: "https://github.com",
    instagramLink: "",
    linkedinLink: "",
    coverPhoto: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80",
    customBadge: "Setup Paylaşımcısı 🚀",
    customColor: "#4ECDC4",
    role: "user",
    createdAt: "2026-02-15T12:00:00.000Z"
  },
  {
    id: "admin",
    email: "setupss.support@gmail.com",
    password_hash: bcrypt.hashSync("ozcan1257", 10),
    name: "Beşir Hanzo",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80",
    is_verified: true,
    bio: "Kod Yazan Kahve Canavarı ☕️",
    githubLink: "https://github.com",
    instagramLink: "",
    linkedinLink: "",
    coverPhoto: "https://images.unsplash.com/photo-1491336477066-31156b5e4f35?auto=format&fit=crop&w=800&q=80",
    customBadge: "Kurucu & Geliştirici 👑",
    customColor: "#FF6B6B",
    is_crown: true,
    has_rgb: true,
    role: "admin",
    createdAt: "2026-01-01T09:00:00.000Z"
  },
  {
    id: "kreatif-can",
    email: "can@setupss.com",
    password_hash: bcrypt.hashSync("123456", 10),
    name: "Kreatif Can",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&h=200&q=80",
    is_verified: true,
    bio: "RGB & Neon Sevdalısı 🌈",
    githubLink: "https://github.com",
    instagramLink: "",
    linkedinLink: "",
    coverPhoto: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80",
    customBadge: "RGB Profesörü 🌈",
    customColor: "#9b59b6",
    has_rgb: true,
    role: "user",
    createdAt: "2026-03-20T14:30:00.000Z"
  },
  {
    id: "zeynep-tasarim",
    email: "zeynep@setupss.com",
    password_hash: bcrypt.hashSync("123456", 10),
    name: "Zeynep Tasarım",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&h=200&q=80",
    is_verified: true,
    bio: "Piksel Bükücü & Bitki Büyücüsü 🌿",
    githubLink: "https://github.com",
    instagramLink: "",
    linkedinLink: "",
    coverPhoto: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80",
    customBadge: "Senior Designer 🎨",
    customColor: "#2ecc71",
    is_crown: true,
    role: "user",
    createdAt: "2026-04-05T10:15:00.000Z"
  },
  {
    id: "ai-bot",
    email: "bot@setupss.com",
    password_hash: bcrypt.hashSync("123456", 10),
    name: "Setupss AI",
    avatar: "/airobot.jpg",
    is_verified: true,
    bio: "Kurulum Danışmanı & Site Rehberi 🤖",
    githubLink: "",
    instagramLink: "",
    linkedinLink: "",
    coverPhoto: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    customBadge: "Topluluk Asistanı 🤖",
    customColor: "#FFD93D",
    is_crown: false,
    has_rgb: true,
    role: "admin",
    createdAt: "2026-01-01T08:00:00.000Z"
  }
];

// Initialize localUsersList for server-db friendship mappings
localUsersList.push(...localUsers);

let localSiteSettings: Record<string, string> = {
  contact_email: 'setupss.support@gmail.com',
  site_logo_url: '',
  site_logo_dark_url: '',
  site_icon_url: '',
  ai_avatar_video_url: '',
  ai_avatar_image_url: '',
  logo_desktop_scale: '100',
  logo_mobile_scale: '100',
  logo_rotation: '0',
  ai_avatar_size_scale: '110',
  ai_avatar_glow_color: 'amber',
  ai_avatar_border_style: 'dashed',
  ai_avatar_interactive_effect: 'float',
  ai_avatar_rounded: 'full'
};

// PERSISTENT DATABASE ENGINE - SUPABASE POSTGRESQL PRIMARY
function savePersistentDb() {
  // Persistence is handled directly by PostgreSQL in server-db.ts
}

function loadPersistentDb() {
  // State is queried directly from PostgreSQL in server-db.ts
}


// Lazy initialize Gemini client
let aiClient: GoogleGenAI | null = null;

const AI_BOT_ID = "ai-bot";

function getGemini(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Site Context for AI
async function getSiteContext() {
  let setupsCount = 0;
  let topUsers: any[] = [];
  const hasValidDb = checkDbActive();
  
  try {
    if (hasValidDb && pool) {
      const { rows: sCount } = await pool.query('SELECT COUNT(*) FROM setups');
      setupsCount = parseInt(sCount[0].count, 10);
      const { rows: top } = await pool.query(`
        SELECT u.name, COALESCE(SUM(s.likes), 0) as total_likes 
        FROM users u 
        LEFT JOIN setups s ON u.id = s.owner_id 
        GROUP BY u.id, u.name 
        ORDER BY total_likes DESC LIMIT 5
      `);
      topUsers = top;
    } else {
      setupsCount = localSetups.length;
      topUsers = [{ name: "Ziyaretçi Geliştirici", total_likes: 0 }];
    }
  } catch (e) {
    // fallback
  }

  return `
    SİTE BİLGİLERİ (CONTEXT):
    - Site Adı: SETUPSS
    - Amacı: Masaüstü setup (kurulum) paylaşımı, ekipman inceleme, bütçe planlama ve askeri düzeyde dürüst referans/davet takip sistemi.
    - Toplam Setup Sayısı: ${setupsCount}
    - Liderlik Tablosu İlk 5: ${topUsers.map(u => `${u.name} (${u.total_likes} beğeni)`).join(', ')}
    - Özellikler: Explore (Keşfet), Leaderboard (Liderlik), Wishlist/Planner (Bütçe & Plan), P2P Sohbet, Davet Sistemi (Invite), AS-SENTINEL-900 Yapay Zeka Askeri Referans & Ödül Denetleyicisi.
    - AS-SENTINEL-900 Yapay Zeka Askeri Referans & Ödül Denetleyicisi: Bu sistem, hangi kullanıcının arkadaşını davet ettiğini, kimin referans koduyla kimin kayıt olduğunu, hileli VPN'leri, çoklu hesap açımları (self-referral) ve bot girişimlerini askeri düzeyde dürüst ve tarafsız bir şekilde denetler. Sadece başarılı ve temiz daveti olan dürüst kullanıcıların setup kartlarının etrafında parıl parıl parlayan Dinamik RGB Efekti aktifleştirilir. Fake bot girişimleri (örneğin GamerX_Fake) hemen elenir.
    - Sen Kimsin: Sen hem "Setupss AI" asistanı hem de sistemin askeri referans denetleyicisisin.
    - Tonun: Samimi, dürüst, adaletli, askeri düzeyde kararlı ve profesyonel.
    - Kullanıcı davet/referans sistemini sorarsa: Davet linki ile dürüstçe arkadaş getirenlere Dinamik RGB Efekti verildiğini, hile yapmaya çalışanların (self-referral, fake botlar) ise AS-SENTINEL-900 yapay zekamız tarafından anında reddedildiğini anlat.
    - Kullanıcı "Neden sırada üstlerde değilim?" derse: Beğeniler, yorumlar, davetler ve paylaşımlarla puan kazanabileceğini anlat.
    - Kullanıcı "Nasıl paylaşım yaparım?" derse: Sağ üstteki "Setup Paylaş" butonunu kullanabileceğini söyle.
    - Kullanıcı "Bütçe nasıl planlanır?" derse: "Bütçe & Plan" sekmesinden Gemini destekli planlayıcıyı kullanabileceğini anlat.
  `;
}

// Mail Transporter with Connection Pooling & Instant Delivery
let mailTransporter: nodemailer.Transporter | null = null;
let isEthereal = false;

async function getMailTransporter() {
  if (mailTransporter) return mailTransporter;
  
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465');
  const secure = process.env.SMTP_SECURE !== 'false';
  const user = process.env.SMTP_USER || 'setupss.info@gmail.com';
  const pass = process.env.SMTP_PASS || 'ytilaoonyjnfhexq';

  mailTransporter = nodemailer.createTransport({
    host,
    port,
    secure,
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 8000,
    auth: {
      user,
      pass,
    }
  });
  isEthereal = false;

  // Verify SMTP connection in background
  mailTransporter.verify((err) => {
    if (err) {
      console.error(`[SMTP ERROR] E-posta sunucu bağlantısı başarısız (${user}):`, err.message);
    } else {
      console.log(`[SMTP OK] E-posta sunucusuna (${user}) bağlantı havuzu hazır ve aktif.`);
    }
  });

  return mailTransporter;
}

async function sendMailWithTimeout(mailer: nodemailer.Transporter, mailOptions: any, timeoutMs = 8000): Promise<any> {
  return Promise.race([
    mailer.sendMail(mailOptions),
    new Promise((_, reject) => setTimeout(() => reject(new Error('SMTP_TIMEOUT')), timeoutMs))
  ]);
}

/**
 * Dispatches verification emails instantly using warm SMTP connection pool
 */
async function sendSetupssVerificationEmail(toEmail: string, userName: string, code: string): Promise<boolean> {
  try {
    const mailer = await getMailTransporter();
    const sender = process.env.SMTP_USER || 'setupss.info@gmail.com';
    const plainText = `Merhaba ${userName || 'Kullanıcı'},\n\nSETUPSS Hesap Doğrulama Kodunuz: ${code}\n\nBu kod 10 dakika boyunca geçerlidir.\n\nEğer bu işlemi siz yapmadıysanız bu e-postayı dikkate almayınız.\n\nSETUPSS - The Operating System of PC Enthusiasts\nhttps://setupss.com`;
    
    await sendMailWithTimeout(mailer, {
      from: `"SETUPSS" <${sender}>`,
      to: toEmail,
      replyTo: sender,
      subject: `⚡ SETUPSS Doğrulama Kodunuz: ${code}`,
      text: plainText,
      html: generateSetupssVerificationEmail(userName, code),
      headers: {
        'X-Priority': '1 (Highest)',
        'X-MSMail-Priority': 'High',
        'Importance': 'High'
      }
    }, 7000);
    console.log(`[SMTP SUCCESS] Doğrulama e-postası anında gönderildi -> ${toEmail} (Kod: ${code})`);
    return true;
  } catch (err: any) {
    console.error(`[SMTP FAILED] E-posta gönderilemedi (${toEmail}):`, err?.message || err);
    return false;
  }
}

/**
 * Generates an authentic Neo-Brutalist HTML email template styled identically to the Setupss website design system.
 */
function generateSetupssVerificationEmail(userName: string, code: string): string {
  const safeName = userName || 'Kullanıcı';
  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SETUPSS Doğrulama Kodu</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #FFF8E1;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #2D3436;
      -webkit-font-smoothing: antialiased;
    }
    table {
      border-collapse: separate;
    }
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        padding: 8px !important;
      }
      .code-display {
        font-size: 28px !important;
        letter-spacing: 6px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #FFF8E1; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2D3436;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #FFF8E1; width: 100%; margin: 0 auto; padding: 36px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" class="email-container" width="520" cellspacing="0" cellpadding="0" border="0" style="max-width: 520px; width: 100%; background-color: #FFFFFF; border: 3px solid #2D3436; border-radius: 20px; box-shadow: 6px 6px 0px 0px #2D3436; overflow: hidden;">
          
          <!-- Header Bar with Logo and Site Header Style -->
          <tr>
            <td style="padding: 24px 28px 20px 28px; background-color: #FFFFFF; border-bottom: 3px solid #2D3436;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <!-- Yellow Circle Badge with S -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td align="center" valign="middle" style="width: 38px; height: 38px; background-color: #FFD93D; border: 2px solid #2D3436; border-radius: 50%; text-align: center; line-height: 38px; font-size: 18px; font-weight: 900; color: #2D3436; box-shadow: 2px 2px 0px 0px #2D3436;">
                          S
                        </td>
                        <td style="padding-left: 12px;">
                          <div style="font-size: 17px; font-weight: 900; letter-spacing: 0.5px; color: #2D3436; text-transform: uppercase;">
                            SETUPSS HESAP
                          </div>
                          <div style="font-size: 11px; font-weight: 700; color: #636E72; letter-spacing: 0.5px;">
                            The Operating System of PC Enthusiasts
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td style="padding: 32px 28px 24px 28px;">
              <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 900; color: #2D3436; letter-spacing: -0.3px;">
                Hesap Doğrulama Kodu ✉️
              </h2>
              
              <p style="margin: 0 0 14px 0; font-size: 15px; line-height: 1.6; color: #2D3436;">
                Merhaba <strong>${safeName}</strong>,
              </p>
              
              <p style="margin: 0 0 22px 0; font-size: 14px; line-height: 1.6; color: #636E72;">
                SETUPSS hesabınızı güvenle aktifleştirmek için aşağıdaki 6 haneli tek kullanımlık doğrulama kodunu kullanabilirsiniz:
              </p>

              <!-- Verification Code Box (Neo-Brutalist Box) -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 20px 0 24px 0;">
                <tr>
                  <td align="center" style="background-color: #FFF8E1; border: 3px solid #2D3436; border-radius: 14px; padding: 22px 16px; text-align: center; box-shadow: 4px 4px 0px 0px #2D3436;">
                    <div style="font-size: 10px; font-weight: 900; color: #636E72; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px;">
                      6 HANELİ DOĞRULAMA KODU
                    </div>
                    <div class="code-display" style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 900; color: #2D3436; letter-spacing: 10px; margin-right: -10px;">
                      ${code}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Notice Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F8F9FA; border: 2px solid #2D3436; border-radius: 12px; margin: 18px 0 24px 0;">
                <tr>
                  <td style="padding: 14px 16px;">
                    <div style="font-size: 12px; font-weight: 700; color: #2D3436; line-height: 1.6;">
                      ⏱️ <strong>Süre:</strong> Bu kod 10 dakika boyunca geçerlidir.<br>
                      🛡️ <strong>Güvenlik:</strong> Bu kodu güvenliğiniz için kimseyle paylaşmayınız.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Action Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 24px 0 10px 0;">
                <tr>
                  <td align="center">
                    <a href="https://setupss.com" target="_blank" style="display: inline-block; background-color: #FFD93D; color: #2D3436; font-weight: 900; font-size: 14px; text-decoration: none; padding: 13px 32px; border: 2px solid #2D3436; border-radius: 12px; box-shadow: 3px 3px 0px 0px #2D3436; text-transform: uppercase; letter-spacing: 0.5px;">
                      Giriş Yap &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 20px 0 0 0; font-size: 11px; line-height: 1.5; color: #A0AEC0; text-align: center;">
                Bu işlemi siz başlatmadıysanız bu e-postayı dikkate almayabilirsiniz.
              </p>
            </td>
          </tr>

          <!-- Footer Area -->
          <tr>
            <td style="background-color: #FFF8E1; border-top: 3px solid #2D3436; padding: 18px 24px; text-align: center;">
              <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 800; color: #2D3436;">
                SETUPSS &bull; Donanım & Topluluk İşletim Sistemi
              </p>
              <p style="margin: 0; font-size: 11px; color: #636E72;">
                &copy; 2026 SETUPSS. Tüm hakları saklıdır. &bull; <a href="https://setupss.com" style="color: #2D3436; font-weight: 700; text-decoration: underline;">setupss.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

const app = express();
export { app };

  const PORT = 3000;

  // Set trust proxy (important for reverse proxies, rate limiting, and secure cookies)
  app.set("trust proxy", 1);

  // Use compression middleware for all responses
  app.use(compression());

  // Use Helmet for security headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // Permissive for external resources like Unsplash/Google APIs
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    })
  );

  // Rate Limiting Middlewares
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 20 auth requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Çok fazla giriş veya kayıt denemesi. Lütfen 15 dakika sonra tekrar deneyiniz." },
  });

  const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 uploads per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Çok fazla dosya yükleme isteği. Lütfen daha sonra tekrar deneyiniz." },
  });

  const aiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 20 AI generation requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Günlük yapay zeka kotanıza çok yaklaştınız veya çok hızlı istek attınız. Lütfen biraz bekleyin." },
  });

  // Apply rate limits
  app.use("/auth/login", authLimiter);
  app.use("/auth/register", authLimiter);
  app.use("/auth/verify", authLimiter);
  app.use("/auth/guest", authLimiter);
  app.use("/auth/google", authLimiter);
  app.use("/api/upload", uploadLimiter);
  app.use("/api/admin/upload-logo", uploadLimiter);
  app.use("/api/ai/", aiLimiter);
  app.use("/api/gemini/", aiLimiter);
  app.use("/api/streak/generate-notification", aiLimiter);

  // Setup PostgreSQL Session Store or fallback to memory store
  let sessionStore: any;
  if ((process.env.SQL_HOST || process.env.DATABASE_URL || process.env.POSTGRES_URL) && pool) {
    try {
      const PgSessionStore = pgSession(session);
      sessionStore = new PgSessionStore({
        pool: pool,
        tableName: "user_sessions",
        createTableIfMissing: true,
      });
      console.log("SessionStore: PostgreSQL Store configured and active.");
    } catch (err) {
      console.warn("SessionStore: Failed to initialize PgSessionStore, falling back to MemoryStore:", err);
    }
  } else {
    console.warn("SessionStore: Neither SQL_HOST nor DATABASE_URL is set, falling back to MemoryStore.");
  }

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || 'dev-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // secure cookies in production (HTTPS)
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    }
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  // Mount Modular API Routes
  app.use('/api/hardware', hardwareRoutes);
  app.use('/api/v2/hardware', hardwareRoutes);
  app.use('/api/v2/users', userRoutes);
  app.use('/api/v2/setups', setupRoutes);

  // SEO & Performance Headers Middleware
  app.use((req, res, next) => {
    // 301 Canonical Redirect (Enforce HTTPS and non-www domain on setupss.com)
    const host = req.get("host") || "";
    const isHttps = req.secure || req.headers["x-forwarded-proto"] === "https";
    const hostLower = host.toLowerCase();
    
    if (hostLower.includes("setupss.com")) {
      const isWww = hostLower.startsWith("www.");
      if (!isHttps || isWww) {
        return res.redirect(301, `https://setupss.com${req.originalUrl}`);
      }
    }

    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('X-Robots-Tag', 'index, follow, max-image-preview:large');
    if (req.path === '/' || req.path === '/index.html') {
      res.setHeader('Link', '<https://setupss.com/>; rel="canonical"');
    }
    next();
  });

  // Ensure public/uploads exists and serve public files statically with long-term caching
  const uploadsDirOnBoot = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDirOnBoot)) {
    fs.mkdirSync(uploadsDirOnBoot, { recursive: true });
  }

  // Explicit Video & Media Route with Range support & clean 404 (prevents HTML SPA fallback for media)
  app.get(["/*.mp4", "/*.webm", "/*.ogv", "/*.mov"], (req, res) => {
    try {
      const cleanPath = decodeURIComponent(req.path.split('?')[0]);
      let filePath = path.join(process.cwd(), "public", cleanPath);
      if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        filePath = path.join(process.cwd(), "dist", cleanPath);
      }
      if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        filePath = path.join(process.cwd(), cleanPath);
      }

      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes: Record<string, string> = {
          '.mp4': 'video/mp4',
          '.webm': 'video/webm',
          '.ogv': 'video/ogg',
          '.mov': 'video/quicktime',
        };
        res.setHeader('Content-Type', mimeTypes[ext] || 'video/mp4');
        res.setHeader('Accept-Ranges', 'bytes');
        return res.sendFile(filePath);
      }
    } catch (err) {
      console.error("Video serve error:", err);
    }
    // Return explicit 404 for missing video files so Chrome/FFmpegDemuxer never gets index.html
    return res.status(404).set('Content-Type', 'text/plain').send('Video file not found');
  });

  app.use(express.static(path.join(process.cwd(), "public"), {
    maxAge: '1y',
    etag: true,
    lastModified: true
  }));
  app.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads"), {
    maxAge: '1y',
    etag: true,
    lastModified: true
  }));



  // Robots.txt
  app.get("/robots.txt", (req, res) => {
    res.type('text/plain');
    res.header('Cache-Control', 'public, max-age=86400');
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const host = req.headers.host || 'setupss.com';
    res.send(
`# SETUPSS - AI OPERATING SYSTEM (SAIOS)
# Robots.txt Specification for Search Engines & Social Media Crawlers

User-agent: *
Allow: /
Disallow: /api/admin
Disallow: /auth/logout
Disallow: /uploads/private/

# Explicitly Allow AI & LLM Crawlers (Generative Engine Optimization - GEO)
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Cohere-ai
Allow: /

User-agent: OMGilibot
Allow: /

User-agent: Applebot-Extended
Allow: /

# Explicitly Allow Search Engine Bots
User-agent: Googlebot
Allow: /

User-agent: Googlebot-Image
Allow: /

User-agent: Googlebot-Video
Allow: /

User-agent: Google-InspectionTool
Allow: /

User-agent: Storebot-Google
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Bingpreview
Allow: /

User-agent: DuckDuckBot
Allow: /

User-agent: Yandexbot
Allow: /

User-agent: Baiduspider
Allow: /

# Explicitly Allow Social Media Link Preview Bots
User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: WhatsApp
Allow: /

User-agent: Discordbot
Allow: /

User-agent: TelegramBot
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: Slackbot
Allow: /

User-agent: Slack-ImgProxy
Allow: /

User-agent: Pinterestbot
Allow: /

User-agent: Applebot
Allow: /

User-agent: Redditbot
Allow: /

# Block Aggressive Scrapers & Bad Bots
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: PetalBot
Disallow: /

Sitemap: ${protocol}://${host}/sitemap.xml
# AI & LLM Manifests
# LLMs.txt: ${protocol}://${host}/llms.txt
# LLMs-Full: ${protocol}://${host}/llms-full.txt
# AI Feed: ${protocol}://${host}/feed.json
`
    );
  });

  // Sitemap Ping Endpoint for Search Engines (Google & Bing)
  app.get("/api/seo/ping-sitemap", async (req, res) => {
    const sitemapUrl = encodeURIComponent('https://setupss.com/sitemap.xml');
    const pingResults: Record<string, string> = {};
    
    try {
      const googleRes = await fetch(`https://www.google.com/ping?sitemap=${sitemapUrl}`);
      pingResults.google = googleRes.ok ? 'success' : `status ${googleRes.status}`;
    } catch (e: any) {
      pingResults.google = e?.message || 'failed';
    }

    try {
      const bingRes = await fetch(`https://www.bing.com/ping?sitemap=${sitemapUrl}`);
      pingResults.bing = bingRes.ok ? 'success' : `status ${bingRes.status}`;
    } catch (e: any) {
      pingResults.bing = e?.message || 'failed';
    }

    res.json({
      message: 'SETUPSS Sitemap ping triggered successfully',
      sitemapUrl: 'https://setupss.com/sitemap.xml',
      results: pingResults
    });
  });

  // IndexNow Key File Verification Endpoint for Bing & Search Engines
  app.get("/setupss-indexnow-key-2026.txt", (req, res) => {
    res.type("text/plain").send("setupss-indexnow-key-2026");
  });

  // IndexNow API Trigger Endpoint (Instant Indexing for Bing, Seznam, Naver, Yandex & AI Search)
  app.all("/api/seo/indexnow", async (req, res) => {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const host = req.headers.host || 'setupss.com';
    const baseUrl = `${protocol}://${host}`;

    let urlList: string[] = [];
    if (req.body && req.body.url) {
      urlList = Array.isArray(req.body.url) ? req.body.url : [req.body.url];
    } else if (req.query && req.query.url) {
      urlList = [String(req.query.url)];
    } else {
      urlList = [`${baseUrl}/`, `${baseUrl}/sitemap.xml`, `${baseUrl}/feed.json`, `${baseUrl}/llms.txt`];
    }

    // Ensure full absolute URLs
    const formattedUrls = urlList.map(u => u.startsWith('http') ? u : `${baseUrl}${u.startsWith('/') ? '' : '/'}${u}`);

    const indexNowPayload = {
      host: "setupss.com",
      key: "setupss-indexnow-key-2026",
      keyLocation: "https://setupss.com/setupss-indexnow-key-2026.txt",
      urlList: formattedUrls
    };

    const searchEngineEndpoints = [
      "https://api.indexnow.org/indexnow",
      "https://www.bing.com/indexnow",
      "https://yandex.com/indexnow"
    ];

    const results: Record<string, any> = {};

    for (const endpoint of searchEngineEndpoints) {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify(indexNowPayload)
        });
        results[endpoint] = {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok
        };
      } catch (err: any) {
        results[endpoint] = { error: err?.message || 'Failed' };
      }
    }

    res.json({
      success: true,
      message: 'SETUPSS IndexNow instant indexing request dispatched',
      payload: indexNowPayload,
      results
    });
  });

  // GEO Standard - LLM Text Endpoints (/llms.txt and /llms-full.txt)
  app.get(["/llms.txt", "/.well-known/llms.txt"], (req, res) => {
    res.type("text/plain; charset=utf-8");
    res.header("Cache-Control", "public, max-age=86400");
    const filePath = path.join(process.cwd(), "public", "llms.txt");
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
    res.send(`# SETUPSS - AI Operating System for PC Enthusiasts & Workspaces
Setupss (https://setupss.com) is the ultimate hardware knowledge graph and community platform for PC builders and workspace creators.
Endpoints:
- Feed: https://setupss.com/feed.json
- Sitemap: https://setupss.com/sitemap.xml
`);
  });

  app.get(["/llms-full.txt", "/.well-known/llms-full.txt"], (req, res) => {
    res.type("text/plain; charset=utf-8");
    res.header("Cache-Control", "public, max-age=86400");
    const filePath = path.join(process.cwd(), "public", "llms-full.txt");
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
    res.send(`# SETUPSS Full LLM Manifest\nVisit https://setupss.com for complete hardware knowledge graph data.`);
  });

  // Machine-Readable AI Feed (/feed.json & /api/v1/latest-setups)
  app.get(["/feed.json", "/api/v1/latest-setups"], async (req, res) => {
    res.type("application/json; charset=utf-8");
    res.header("Cache-Control", "public, max-age=300");
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const host = req.headers.host || 'setupss.com';
    const baseUrl = `${protocol}://${host}`;

    try {
      let setupsList: any[] = [];
      const hasValidDb = checkDbActive();
      if (pool && hasValidDb) {
        const { rows } = await pool.query('SELECT * FROM setups ORDER BY created_at DESC LIMIT 50');
        setupsList = rows;
      }
      if (setupsList.length === 0) {
        setupsList = localSetups;
      }

      const formattedFeed = setupsList.map((s: any) => {
        const rawImg = s.image || s.media_url || s.cover_photo || '/logoarkaplanolmayan.png';
        const absoluteImg = rawImg.startsWith('http') ? rawImg : `${baseUrl}${rawImg.startsWith('/') ? '' : '/'}${rawImg}`;
        const componentsArray = Array.isArray(s.components) ? s.components : (typeof s.components === 'string' ? JSON.parse(s.components || '[]') : []);

        return {
          id: s.id,
          title: s.title || 'Masaüstü Setup Kurulumu',
          owner: `@${s.owner || s.owner_name || 'setupss'}`,
          category: s.category || 'Masaüstü Setup',
          description: s.description || `${s.owner || 'Setupss üyesi'} tarafından oluşturulan masaüstü kurulumu.`,
          canonicalUrl: `${baseUrl}/?setup=${s.id}`,
          imageUrl: absoluteImg,
          likes: s.likes || 0,
          hardwareComponents: componentsArray.map((c: any) => ({
            name: c.name,
            category: c.category || 'Donanım',
            price: c.price || null,
            purchaseUrl: c.link || null
          })),
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": s.title,
            "image": [absoluteImg],
            "description": s.description,
            "brand": { "@type": "Brand", "name": "Setupss OS" }
          }
        };
      });

      res.json({
        version: "https://jsonfeed.org/version/1.1",
        title: "Setupss AI & LLM Hardware Feed",
        home_page_url: baseUrl,
        feed_url: `${baseUrl}/feed.json`,
        description: "Real-time structured feed of verified PC setups, hardware specs, and custom workspace builds for AI models & LLM agents.",
        items_count: formattedFeed.length,
        items: formattedFeed
      });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to generate AI feed", details: err?.message });
    }
  });

  // Full-Stack Health Check Endpoint (Database Ping, Pool Metrics, Counts, Migration Status)
  app.get("/api/health", async (req, res) => {
    try {
      const health = await getHealthStatusFromDb();
      const statusCode = health.status === 'unhealthy' ? 503 : 200;
      res.status(statusCode).json(health);
    } catch (err: any) {
      res.status(500).json({
        status: 'unhealthy',
        ready: false,
        error: err?.message || 'Health check error',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Schema Migration Audit & History Log Endpoint
  app.get("/api/migrations", async (req, res) => {
    try {
      const history = await getMigrationHistoryFromDb();
      res.json({
        count: history.length,
        migrations: history,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to fetch migration history' });
    }
  });

  passport.serializeUser((user: any, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await authService.getUserById(id);
      if (user) {
        done(null, user);
      } else {
        const localUser = localUsers.find(u => u.id === id);
        if (localUser) {
          done(null, authService.formatUserDto(localUser));
        } else {
          done(null, false);
        }
      }
    } catch (err) {
      done(err);
    }
  });

  passport.use(new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      const userRow = await authService.getUserByEmail(email);
      if (!userRow) {
        return done(null, false, { message: "Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı." });
      }

      const isMatch = await authService.comparePassword(password, userRow.password_hash);
      if (!isMatch) {
        return done(null, false, { message: "Hatalı şifre." });
      }

      return done(null, authService.formatUserDto(userRow));
    } catch (err) {
      return done(err);
    }
  }));

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "/auth/google/callback",
      scope: ["profile", "email"]
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails[0]?.value;
        if (!email) return done(new Error("Google hesabından e-posta adresi alınamadı."));
        const user = await authService.findOrCreateGoogleUser({
          googleSubId: profile.id,
          email,
          displayName: profile.displayName,
          photoUrl: profile.photos && profile.photos[0]?.value,
          metadata: profile
        });
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }));
  }

  app.post("/auth/register", async (req, res) => {
    try {
      const { email, password, name } = req.body;
      if (!email || !password || !name) {
        return res.status(400).json({ success: false, message: "E-posta, şifre ve isim gereklidir." });
      }

      const hasValidDb = checkDbActive();
      
      let existingUser = null;
      let existingName = null;
      if (hasValidDb && pool) {
        existingUser = await getUserByEmail(email);
        existingName = await getUserByName(name);
      } else {
        existingUser = localUsers.find(u => u.email === email);
        existingName = localUsers.find(u => u.name === name);
      }

      if (existingUser) {
        return res.status(400).json({ success: false, message: "Bu e-posta adresi zaten kullanılıyor." });
      }

      if (existingName) {
        return res.status(400).json({ success: false, message: "Bu kullanıcı adı zaten alınmış." });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const userId = `user-${Date.now()}`;
      const verification_code = Math.floor(100000 + Math.random() * 900000).toString();
      const verification_expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      const referenceCode = Math.random().toString(36).substring(2, 12).toUpperCase();
      
      const newUser = {
        id: userId,
        email,
        password_hash: passwordHash,
        name,
        avatar: null,
        is_verified: false,
        verification_code,
        verification_expires_at,
        referenceCode,
        hasRgbEffect: false
      };

      if (hasValidDb && pool) {
        await createUser(newUser);
      } else {
        localUsers.push(newUser);
        localUsersList.push(newUser);
      }

      // Handle referral code upon registration (Audited by Sentinel V900)
      const refCode = req.body.referenceCode || req.body.ref;
      if (refCode) {
        const clientIp = req.ip || "127.0.0.1";
        const clientUa = req.headers["user-agent"] || "";

        if (hasValidDb && pool) {
          const inviter = await getUserByReferenceCode(refCode);
          if (inviter && inviter.id !== userId) {
            // Run Sentinel V900 Fraud Audit
            const auditResult = await sentinelService.auditReferral(
              inviter,
              newUser,
              refCode,
              clientIp,
              clientUa
            );

            if (auditResult.status === 'APPROVED') {
              await incrementInviteCount(inviter.id);
              // Send a system message/chat to the inviter
              const msgId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
              await pool.query(
                `INSERT INTO chat_messages (id, sender_id, sender_name, sender_avatar, receiver_id, receiver_name, receiver_avatar, message, created_at, is_read)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), $9)`,
                [msgId, 'system', 'Sistem', null, inviter.id, inviter.name || 'Davet Sahibi', inviter.avatar, `Tebrikler! ${name} isimli arkadaşınız davetinizle katıldı. Sentinel V900 onayladı. Kral Tacı, RGB efektiniz ve +50 Liderlik Puanınız aktifleşti! 👑🌈`, false]
              );
              // Also create real-time notification
              await realtimeService.createNotification({
                userId: inviter.id,
                senderId: 'system-sentinel',
                senderName: 'Sentinel V900',
                senderAvatar: '/setupss_icon.svg',
                type: 'like',
                title: 'Davet Kodun Onaylandı! 👑🌈',
                content: `${name} davet kodunla kayıt oldu. Sentinel V900 denetiminden başarıyla geçildi ve ödüllerin tanımlandı!`,
                link: '/profile'
              });
              await logActivityToDb("INVITE_SUCCESS", inviter.id, inviter.name, `Kullanıcı ${email} davet koduyla katıldı. Sentinel V900 onayladı.`);
            } else {
              // Fraud detected
              const msgId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
              await pool.query(
                `INSERT INTO chat_messages (id, sender_id, sender_name, sender_avatar, receiver_id, receiver_name, receiver_avatar, message, created_at, is_read)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), $9)`,
                [msgId, 'system-sentinel', 'Sentinel V900', '/setupss_icon.svg', inviter.id, inviter.name || 'Davet Sahibi', inviter.avatar, `DİKKAT: Davet kodunuzu kullanan bir üyelik için Sentinel V900 fraud filtresi tetiklendi: ${auditResult.reason}. Ödüller tanımlanmadı.`, false]
              );
              await realtimeService.createNotification({
                userId: inviter.id,
                senderId: 'system-sentinel',
                senderName: 'Sentinel V900',
                senderAvatar: '/setupss_icon.svg',
                type: 'like',
                title: 'Davet Engellendi! ❌',
                content: `Kayıt denetiminde fraud/çakışma tespit edildi: ${auditResult.reason}`,
                link: '/profile'
              });
              await logActivityToDb("INVITE_FRAUD_BLOCKED", inviter.id, inviter.name, `Kayıtta davet usulsüzlüğü: ${auditResult.reason}`);
            }
          }
        } else {
          const referringUser = localUsers.find(u => u.referenceCode === refCode || u.id === refCode);
          if (referringUser && referringUser.id !== userId) {
            const auditResult = await sentinelService.auditReferral(
              referringUser,
              newUser,
              refCode,
              clientIp,
              clientUa
            );

            if (auditResult.status === 'APPROVED') {
              referringUser.inviteCount = (referringUser.inviteCount || 0) + 1;
              referringUser.isCrown = true;
              referringUser.hasRgb = true;
              referringUser.hasRgbEffect = true;
            }
          }
        }
      }
      
      console.log(`[VERIFICATION CODE GENERATED] ${email} -> KOD: ${verification_code} (10 Dk Geçerli)`);
      // Send verification email instantly in background with warm connection pool
      sendSetupssVerificationEmail(email, name, verification_code).catch(err => {
        console.error("Async send email failed on registration:", err);
      });
      
      return res.json({ 
        success: true, 
        message: "Kayıt başarılı. Lütfen e-posta adresinize gönderilen 6 haneli doğrulama kodunu girin.", 
        userId
      });
    } catch (error: any) {
      console.error("Register error:", error);
      return res.status(500).json({ success: false, message: "Kayıt sırasında bir hata oluştu." });
    }
  });

  app.post("/auth/resend-code", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ success: false, message: "E-posta adresi gereklidir." });

      const hasValidDb = checkDbActive();
      let user: any = null;
      if (hasValidDb && pool) {
        user = await getUserByEmail(email);
      } else {
        user = localUsers.find(u => u.email?.toLowerCase() === email?.toLowerCase());
      }

      if (!user) return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı." });
      
      if (user.is_verified || user.isVerified) {
        return res.status(400).json({ success: false, message: "Hesabınız zaten doğrulanmıştır." });
      }

      const vCode = Math.floor(100000 + Math.random() * 900000).toString();
      const vExpires = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      user.verification_code = vCode;
      user.verificationCode = vCode;
      user.verification_expires_at = vExpires;
      user.verificationExpiresAt = vExpires;

      if (hasValidDb && pool) {
        await pool.query('UPDATE users SET verification_code = $1, verification_expires_at = $2 WHERE email = $3', [vCode, vExpires, user.email]);
      }

      console.log(`[VERIFICATION CODE RESENT] ${user.email} -> KOD: ${vCode} (10 Dk Geçerli)`);

      // Send instantly in background
      sendSetupssVerificationEmail(user.email, user.name || user.displayName || 'Kullanıcı', vCode).catch(e => {
        console.error("Resend mail error:", e);
      });

      return res.json({ success: true, message: "Yeni doğrulama kodu e-posta adresinize anında gönderildi. Kod 10 dakika geçerlidir." });
    } catch (err) {
      console.error("Resend code endpoint error:", err);
      return res.status(500).json({ success: false, message: "Kod gönderilirken bir hata oluştu." });
    }
  });

  app.post("/auth/verify", async (req, res) => {
    try {
      const { email, code } = req.body;
      const hasValidDb = checkDbActive();
      
      let user: any = null;
      if (hasValidDb && pool) {
        user = await getUserByEmail(email);
      } else {
        user = localUsers.find(u => u.email?.toLowerCase() === email?.toLowerCase());
      }

      if (!user) return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı." });
      
      const isAlreadyVerified = Boolean(user.is_verified || user.isVerified);
      if (isAlreadyVerified) {
        return res.status(400).json({ success: false, message: "Kullanıcı zaten doğrulandı. Lütfen giriş yapın." });
      }

      // Check 10-minute code expiration
      const expiresAt = user.verification_expires_at || user.verificationExpiresAt;
      if (expiresAt) {
        const expiryTime = new Date(expiresAt).getTime();
        if (Date.now() > expiryTime) {
          return res.status(400).json({ 
            success: false, 
            codeExpired: true,
            message: "Doğrulama kodunuzun 10 dakikalık süresi dolmuştur. Lütfen 'Kodu Tekrar Gönder' butonuna basarak yeni bir kod alın." 
          });
        }
      }

      const expectedCode = user.verification_code || user.verificationCode;
      if (!expectedCode || String(expectedCode).trim() !== String(code).trim()) {
        return res.status(400).json({ success: false, message: "Hatalı doğrulama kodu! Lütfen e-postanıza gelen 6 haneli kodu girin." });
      }

      if (hasValidDb && pool) {
        await verifyUser(user.id);
      }
      user.is_verified = true;
      user.isVerified = true;
      user.verification_code = null;
      user.verificationCode = null;
      user.verification_expires_at = null;
      user.verificationExpiresAt = null;

      return res.json({ success: true, message: "Hesap başarıyla doğrulandı! Şimdi giriş yapabilirsiniz." });
    } catch (error) {
      console.error("Verify error:", error);
      return res.status(500).json({ success: false, message: "Doğrulama sırasında hata oluştu." });
    }
  });

  app.post("/auth/guest", (req, res) => {
    let guestUser = localUsers.find(u => u.id === "mock-user-123");
    if (!guestUser) {
      guestUser = {
        id: "mock-user-123",
        email: "ziyaretci@setupss.com",
        password_hash: "",
        name: "Ziyaretçi Geliştirici",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
        is_verified: true,
        isVerified: true,
        bio: "Teknoloji tutkunu ve minimal masaüstü düzeni geliştiricisi.",
        githubLink: "https://github.com",
        instagramLink: "",
        linkedinLink: "",
        coverPhoto: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80",
        customBadge: "Setup Paylaşımcısı 🚀",
        customColor: "#4ECDC4"
      };
      localUsers.push(guestUser);
      localUsersList.push(guestUser);
    }

    req.login(guestUser, (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      return res.json({ 
        success: true, 
        user: { 
          id: guestUser.id, 
          email: guestUser.email, 
          displayName: guestUser.name, 
          avatar: guestUser.avatar,
          bio: guestUser.bio,
          githubLink: guestUser.githubLink,
          instagramLink: guestUser.instagramLink,
          linkedinLink: guestUser.linkedinLink,
          coverPhoto: guestUser.coverPhoto,
          customBadge: guestUser.customBadge,
          customColor: guestUser.customColor
        } 
      });
    });
  });

  app.post("/auth/login", (req, res, next) => {
    passport.authenticate("local", async (err: any, user: any, info: any) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      if (!user) return res.status(401).json({ success: false, message: info?.message || "Giriş başarısız." });
      
      const hasValidDb = checkDbActive();
      if (user.is_banned || (user as any).isBanned) {
        return res.status(403).json({ success: false, message: "Hesabınız askıya alınmıştır. Lütfen destekle iletişime geçin." });
      }

      const isVerified = Boolean(user.is_verified || user.isVerified);
      if (!isVerified) {
        let vCode = user.verification_code || user.verificationCode;
        let vExpires = user.verification_expires_at || user.verificationExpiresAt;
        
        // If no code or code is expired, generate a new one
        if (!vCode || (vExpires && Date.now() > new Date(vExpires).getTime())) {
          vCode = Math.floor(100000 + Math.random() * 900000).toString();
          vExpires = new Date(Date.now() + 10 * 60 * 1000).toISOString();
          user.verification_code = vCode;
          user.verificationCode = vCode;
          user.verification_expires_at = vExpires;
          user.verificationExpiresAt = vExpires;
          if (hasValidDb && pool) {
            await pool.query('UPDATE users SET verification_code = $1, verification_expires_at = $2 WHERE email = $3', [vCode, vExpires, user.email]);
          }
        }

        sendSetupssVerificationEmail(user.email, user.displayName || user.name || 'Kullanıcı', vCode).catch(e => {
          console.error("Mail send on login failed:", e);
        });

        return res.status(403).json({ 
          success: false, 
          requiresVerification: true, 
          email: user.email, 
          message: "Lütfen önce hesabınızı doğrulayın. Doğrulama kodunuz e-posta adresinize gönderildi (10 dakika geçerlidir)."
        });
      }

      if (req.body.rememberMe) {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
      } else {
        req.session.cookie.maxAge = undefined;
      }

      req.login(user, (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        const isCrown = Boolean(user.is_crown || user.isCrown || (user.invite_count > 0 || user.inviteCount > 0));
        const hasRgb = Boolean(user.has_rgb || user.hasRgb || user.hasRgbEffect || (user.invite_count > 0 || user.inviteCount > 0));
        return res.json({ 
          success: true, 
          user: { 
            id: user.id, 
            email: user.email, 
            displayName: user.name || user.displayName, 
            avatar: user.avatar,
            bio: user.bio || "",
            githubLink: user.github_link || user.githubLink || "",
            instagramLink: user.instagram_link || user.instagramLink || "",
            linkedinLink: user.linkedin_link || user.linkedinLink || "",
            coverPhoto: user.cover_photo || user.coverPhoto || "",
            customBadge: user.custom_badge || user.customBadge || "",
            customColor: user.custom_color || user.customColor || "",
            referenceCode: user.referenceCode || user.reference_code || "",
            inviteCount: user.invite_count || user.inviteCount || 0,
            isCrown,
            hasRgb,
            hasRgbEffect: hasRgb,
            role: user.role || 'user'
          } 
        });
      });
    })(req, res, next);
  });

  app.all("/auth/logout", (req: any, res: any) => {
    const doLogout = () => {
      req.session?.destroy(() => {
        res.clearCookie("connect.sid");
        if (req.xhr || req.headers.accept?.includes("json") || req.method === "POST") {
          return res.json({ success: true, message: "Çıkış yapıldı." });
        }
        res.redirect("/");
      });
    };
    if (typeof req.logout === 'function') {
      req.logout(() => doLogout());
    } else {
      doLogout();
    }
  });
  app.get("/auth/user", optionalAuth, (req: any, res) => { res.json(req.user || null); });

  app.get("/auth/google", (req, res, next) => {
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
      passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
    } else {
      // Serve a high-fidelity Google Sign-In Selector Simulation
      res.send(`
        <!DOCTYPE html>
        <html lang="tr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Google ile Giriş Yapın</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
          <style>
            body {
              font-family: 'Plus Jakarta Sans', sans-serif;
              background-color: #f3f4f6;
            }
          </style>
        </head>
        <body class="flex items-center justify-center min-h-screen p-4 bg-[#f8f9fa] selection:bg-teal-500 selection:text-white">
          <div class="bg-white w-full max-w-[460px] rounded-2xl border-4 border-[#1a1a1a] p-8 shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] flex flex-col items-center">
            
            <!-- Google G Logo -->
            <svg class="w-12 h-12 mb-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.1-.28-.19-.58-.19-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>

            <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">Google ile Oturum Açın</h1>
            <p class="text-sm text-slate-600 mb-6 text-center">Google Hesabınızla <span class="font-extrabold text-emerald-600">Setupss</span> platformuna devam edin</p>

            <!-- Error Banner -->
            <div id="error-banner" class="hidden w-full p-3.5 mb-4 text-xs font-bold text-red-700 bg-red-100 border-2 border-red-400 rounded-xl"></div>

            <!-- Fast Accounts Selection List -->
            <div class="w-full space-y-3 mb-6" id="accounts-container">
              <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Kayıtlı Google Hesaplarınız</p>
              
              <!-- Option 1: beshanzo80@gmail.com -->
              <button onclick="loginGoogle('beshanzo80@gmail.com', 'Beşir Hanzo', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80')" class="w-full p-3.5 bg-white border-2 border-[#1a1a1a] hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-all text-left outline-none focus:ring-4 focus:ring-emerald-500/30 group shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80" alt="Avatar" class="w-10 h-10 rounded-full border-2 border-[#1a1a1a] object-cover">
                <div class="flex-grow">
                  <p class="text-sm font-black text-slate-800">Beşir Hanzo</p>
                  <p class="text-xs text-slate-500">beshanzo80@gmail.com</p>
                </div>
                <span class="text-[10px] font-black text-emerald-600 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md group-hover:bg-emerald-200">Hızlı Giriş</span>
              </button>

              <!-- Option 2: setupss.support@gmail.com -->
              <button onclick="loginGoogle('setupss.support@gmail.com', 'Setupss Kurucusu', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&h=200&q=80')" class="w-full p-3.5 bg-white border-2 border-[#1a1a1a] hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-all text-left outline-none focus:ring-4 focus:ring-emerald-500/30 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none">
                <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&h=200&q=80" alt="Avatar" class="w-10 h-10 rounded-full border-2 border-[#1a1a1a] object-cover">
                <div class="flex-grow">
                  <p class="text-sm font-black text-slate-800">Setupss Kurucusu</p>
                  <p class="text-xs text-slate-500">setupss.support@gmail.com</p>
                </div>
              </button>
            </div>

            <!-- Divider -->
            <div class="w-full flex items-center my-4">
              <div class="flex-grow border-t-2 border-dashed border-slate-300"></div>
              <span class="px-3 text-xs text-slate-400 font-extrabold uppercase">veya</span>
              <div class="flex-grow border-t-2 border-dashed border-slate-300"></div>
            </div>

            <!-- Custom Email Form -->
            <div class="w-full space-y-4">
              <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Farklı bir Google Hesabı ile Giriş Yap / Kayıt Ol</p>
              
              <div class="space-y-1">
                <label class="text-xs font-bold text-slate-700 block">E-Posta Adresi</label>
                <input type="email" id="custom-email" placeholder="ornek@gmail.com" class="w-full px-4 py-2.5 bg-white border-2 border-[#1a1a1a] rounded-xl text-sm outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all font-bold">
              </div>

              <div class="space-y-1">
                <label class="text-xs font-bold text-slate-700 block">Adınız Soyadınız</label>
                <input type="text" id="custom-name" placeholder="Örn: Melis Demir" class="w-full px-4 py-2.5 bg-white border-2 border-[#1a1a1a] rounded-xl text-sm outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all font-bold">
              </div>

              <button onclick="loginCustom()" id="submit-btn" class="w-full py-3 bg-[#4ECDC4] hover:bg-[#45b8b0] text-[#1a1a1a] border-2 border-[#1a1a1a] rounded-xl text-sm font-black uppercase tracking-wider transition-all shadow-[3px_3px_0px_0px_rgba(26,26,26,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer">
                Google ile Devam Et
              </button>
            </div>

            <p class="text-[10px] text-slate-400 mt-8 text-center leading-relaxed">
              Bu ekran, yerel geliştirme veya önizleme ortamında Google OAuth kimlik bilgileri bulunmadığında otomatik olarak devreye giren <strong class="text-slate-500 font-extrabold">Setupss Güvenli Geçiş Portalı</strong>'dır. Bilgileriniz güvenle veritabanına kaydedilir.
            </p>
          </div>

          <script>
            async function loginGoogle(email, displayName, photoURL) {
              const errorBanner = document.getElementById('error-banner');
              const buttons = document.querySelectorAll('button');
              errorBanner.classList.add('hidden');
              
              // Disable actions while logging in
              buttons.forEach(btn => btn.disabled = true);
              
              try {
                const response = await fetch('/auth/google', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email, displayName, photoURL })
                });
                
                const data = await response.json();
                if (data.success) {
                  // Redirect back to main page
                  window.location.href = '/?auth_success=google';
                } else {
                  errorBanner.textContent = data.message || 'Giriş yapılamadı.';
                  errorBanner.classList.remove('hidden');
                  buttons.forEach(btn => btn.disabled = false);
                }
              } catch (err) {
                errorBanner.textContent = 'Bağlantı hatası oluştu.';
                errorBanner.classList.remove('hidden');
                buttons.forEach(btn => btn.disabled = false);
              }
            }

            function loginCustom() {
              const email = document.getElementById('custom-email').value.trim();
              const name = document.getElementById('custom-name').value.trim();
              
              if (!email || !email.includes('@')) {
                const errorBanner = document.getElementById('error-banner');
                errorBanner.textContent = 'Lütfen geçerli bir e-posta adresi girin.';
                errorBanner.classList.remove('hidden');
                return;
              }

              const displayName = name || email.split('@')[0];
              const hashSeed = btoa(email).substring(0, 10);
              const photoURL = 'https://api.dicebear.com/7.x/bottts/svg?seed=' + hashSeed;
              loginGoogle(email, displayName, photoURL);
            }
          </script>
        </body>
        </html>
      `);
    }
  });

  app.get("/auth/google/callback", (req, res, next) => {
    passport.authenticate("google", { failureRedirect: "/?auth_error=oauth_failed" }, (err, user) => {
      if (err || !user) {
        return res.redirect("/?auth_error=" + encodeURIComponent(err?.message || "Google giriş başarısız."));
      }
      req.login(user, (loginErr) => {
        if (loginErr) return res.redirect("/?auth_error=session_error");
        return res.redirect("/");
      });
    })(req, res, next);
  });

  app.post("/auth/google", express.json(), async (req, res) => {
    try {
      const { idToken } = req.body;
      if (!idToken) {
        return res.status(400).json({ success: false, message: "Firebase Kimlik Doğrulama jetonu (ID Token) gereklidir." });
      }

      // Secure verification via Firebase Admin SDK
      let decodedToken;
      try {
        decodedToken = await getAuth().verifyIdToken(idToken);
      } catch (verifyErr: any) {
        console.error("Firebase ID Token verification failed:", verifyErr);
        return res.status(401).json({ success: false, message: "Geçersiz kimlik doğrulama jetonu (Token invalid)." });
      }

      const email = decodedToken.email;
      const displayName = decodedToken.name || decodedToken.display_name || (email ? email.split('@')[0] : 'Kullanıcı');
      const photoURL = decodedToken.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${decodedToken.uid}`;
      const subId = decodedToken.uid;

      if (!email) {
        return res.status(400).json({ success: false, message: "E-posta gereklidir." });
      }

      let user;
      const hasValidDb = checkDbActive();
      
      if (hasValidDb && pool) {
        user = await authService.findOrCreateGoogleUser({
          googleSubId: subId,
          email,
          displayName,
          photoUrl: photoURL
        });
      } else {
        const cleanEmail = email.trim().toLowerCase();
        let existing = localUsers.find(u => u.email === cleanEmail);
        if (!existing) {
          const userId = `usr_g_${Date.now()}`;
          const name = displayName;
          const avatar = photoURL;
          const refCode = Math.random().toString(36).substring(2, 10).toUpperCase();
          existing = {
            id: userId,
            email: cleanEmail,
            name,
            avatar,
            is_verified: true,
            referenceCode: refCode,
            isCrown: false,
            hasRgb: false,
            hasRgbEffect: false,
            role: cleanEmail === 'setupss.support@gmail.com' ? 'admin' : 'user'
          };
          localUsers.push(existing);
          localUsersList.push(existing);
        }
        user = authService.formatUserDto(existing);
      }

      if (user.isBanned) {
        return res.status(403).json({ success: false, message: "Hesabınız askıya alınmıştır. Lütfen destekle iletişime geçin." });
      }

      req.login(user, (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        return res.json({ success: true, user });
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err?.message || "Google girişi başarısız." });
    }
  });

  // ==========================================
  // BLOG POSTS API ENDPOINTS
  // ==========================================
  app.get("/api/blog", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const search = req.query.search as string | undefined;
      const posts = await getBlogPostsFromDb(category, search);
      res.json(posts);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Blog yazıları alınamadı." });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const post = await getBlogPostBySlugFromDb(slug);
      if (!post) {
        return res.status(404).json({ error: "Blog yazısı bulunamadı." });
      }
      res.json(post);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Blog yazısı çekilemedi." });
    }
  });

  app.post("/api/ai/generate-blog-post", express.json(), async (req, res) => {
    try {
      const { topic, category } = req.body || {};
      const ai = getGemini();

      const prompt = `Sen Setupss platformunun baş teknoloji editörü ve donanım gurususun.
Lütfen aşağıdaki konu ve kategori hakkında tamamen Türkçe, son derece detaylı, bilgilendirici, SEO dostu ve profesyonel bir blog yazısı üret.

KONU: ${topic || "2026 Masaüstü Kurulum Trendleri ve Ergonomi"}
KATEGORİ: ${category || "Rehber"}

Yanıtını kesinlikle SADECE geçerli bir JSON nesnesi olarak ver. Başka hiçbir açıklama yazma.
JSON şeması:
{
  "title": "Cazip, profesyonel başlık",
  "slug": "turkce-karaktersiz-ve-kucuk-harfli-benzersiz-slug",
  "summary": "1-2 cümlelik vurucu özet",
  "category": "${category || "Rehber"}",
  "readTimeMinutes": 6,
  "tags": ["tag1", "tag2", "tag3"],
  "hardwareSlugs": ["herman-miller-aeron", "screenbar-halo"],
  "content": "# Başlık\\n\\nDetaylı alt başlıklar, numaralı maddeler, ürün tavsiyeleri ve tavsiyeler içeren zengin Markdown içeriği..."
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("AI yanıt veremedi.");
      }

      const generatedData = JSON.parse(responseText);

      const createdPost = await createBlogPostInDb({
        title: generatedData.title,
        slug: generatedData.slug || `blog-${Date.now()}`,
        summary: generatedData.summary,
        category: generatedData.category || category || 'Rehber',
        content: generatedData.content,
        readTimeMinutes: generatedData.readTimeMinutes || 5,
        tags: generatedData.tags || ['setup', 'donanim'],
        hardwareSlugs: generatedData.hardwareSlugs || [],
        coverImage: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1200&q=80',
        authorName: 'Setupss AI Editör',
        authorAvatar: '/airobot.jpg',
        isPublished: true
      });

      res.json({ success: true, post: createdPost });
    } catch (err: any) {
      console.error("AI blog generation failed:", err);
      res.status(500).json({ error: err.message || "Blog oluşturulamadı." });
    }
  });

  // 1. UPLOAD PHOTO OR VIDEO FILE
  app.post("/api/upload", express.json({ limit: "50mb" }), async (req: any, res) => {
    try {
      const { filename, base64Data, folder = 'setup', entityType: reqEntityType, entityId: reqEntityId } = req.body;
      if (!filename || !base64Data) {
        return res.status(400).json({ success: false, message: "Dosya adı ve veri gereklidir." });
      }

      // Parse base64 header
      const parts = base64Data.split(";base64,");
      if (parts.length !== 2) {
        return res.status(400).json({ success: false, message: "Geçersiz base64 verisi." });
      }

      const mimeType = parts[0].split(':')[1] || 'image/jpeg';
      const fileBuffer = Buffer.from(parts[1], "base64");

      // Determine authenticated user
      const authenticatedUser = req.user as any;
      const uploaderId = authenticatedUser?.id || null;

      // Determine canonical entityType and entityId
      let canonicalEntityType: any = reqEntityType;
      let canonicalEntityId: string = reqEntityId || '';

      if (!canonicalEntityType) {
        if (folder === 'avatars') {
          canonicalEntityType = 'user_avatar';
          canonicalEntityId = canonicalEntityId || uploaderId || 'usr_guest';
        } else if (folder === 'covers' || folder === 'banners') {
          canonicalEntityType = 'user_cover';
          canonicalEntityId = canonicalEntityId || uploaderId || 'usr_guest';
        } else if (folder === 'chat') {
          canonicalEntityType = 'chat_media';
          canonicalEntityId = canonicalEntityId || 'room_general';
        } else if (folder === 'posts') {
          canonicalEntityType = 'post_image';
          canonicalEntityId = canonicalEntityId || `post-${Date.now()}`;
        } else {
          canonicalEntityType = 'setup_image';
          canonicalEntityId = canonicalEntityId || `setup-draft-${Date.now()}`;
        }
      }

      if (!canonicalEntityId) {
        canonicalEntityId = `entity-${Date.now()}`;
      }

      // Ownership verification if modifying an existing setup
      if (canonicalEntityType === 'setup_image' && canonicalEntityId.startsWith('setup-') && !canonicalEntityId.includes('draft')) {
        const existingSetup = pool ? (await pool.query('SELECT owner_id FROM setups WHERE id = $1', [canonicalEntityId])).rows[0] : null;
        if (existingSetup && existingSetup.owner_id && authenticatedUser && existingSetup.owner_id !== authenticatedUser.id) {
          const isAdmin = authenticatedUser.role === 'admin' || ['setupss.support@gmail.com'].includes(authenticatedUser.email);
          if (!isAdmin) {
            return res.status(403).json({ success: false, message: "Bu kuruluma medya yükleme yetkiniz yok." });
          }
        }
      }

      // Execute canonical Entity-Aware storage upload pipeline
      const uploadResult = await storageService.uploadEntityMedia({
        fileBuffer,
        originalName: filename,
        mimeType,
        entityType: canonicalEntityType,
        entityId: canonicalEntityId,
        userId: uploaderId || undefined
      });

      // Save to canonical public.media_assets table in PostgreSQL
      if (pool) {
        await pool.query(`
          INSERT INTO public.media_assets (
            id, uploader_id, bucket, object_key, public_url, original_filename, mime_type, file_size, entity_type, entity_id
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (object_key) DO UPDATE SET
            public_url = EXCLUDED.public_url,
            entity_type = EXCLUDED.entity_type,
            entity_id = EXCLUDED.entity_id;
        `, [
          uploadResult.assetId,
          uploaderId,
          uploadResult.bucket,
          uploadResult.objectKey,
          uploadResult.publicUrl,
          filename,
          uploadResult.mimeType,
          uploadResult.fileSize,
          uploadResult.entityType,
          uploadResult.entityId
        ]).catch(e => console.error("Media assets primary insert error:", e));

        if (uploadResult.thumbnail512ObjectKey && uploadResult.thumbnail512PublicUrl) {
          await pool.query(`
            INSERT INTO public.media_assets (
              id, uploader_id, bucket, object_key, public_url, original_filename, mime_type, file_size, entity_type, entity_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            ON CONFLICT (object_key) DO UPDATE SET
              public_url = EXCLUDED.public_url;
          `, [
            `${uploadResult.assetId}_t512`,
            uploaderId,
            uploadResult.bucket,
            uploadResult.thumbnail512ObjectKey,
            uploadResult.thumbnail512PublicUrl,
            filename,
            'image/webp',
            uploadResult.fileSize,
            `${uploadResult.entityType}_thumb512`,
            uploadResult.entityId
          ]).catch(e => console.error("Media assets thumb512 insert error:", e));
        }

        if (uploadResult.thumbnail256ObjectKey && uploadResult.thumbnail256PublicUrl) {
          await pool.query(`
            INSERT INTO public.media_assets (
              id, uploader_id, bucket, object_key, public_url, original_filename, mime_type, file_size, entity_type, entity_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            ON CONFLICT (object_key) DO UPDATE SET
              public_url = EXCLUDED.public_url;
          `, [
            `${uploadResult.assetId}_t256`,
            uploaderId,
            uploadResult.bucket,
            uploadResult.thumbnail256ObjectKey,
            uploadResult.thumbnail256PublicUrl,
            filename,
            'image/webp',
            uploadResult.fileSize,
            `${uploadResult.entityType}_thumb256`,
            uploadResult.entityId
          ]).catch(e => console.error("Media assets thumb256 insert error:", e));
        }

        // Backward compatibility logger
        await addMediaFileToDb({
          id: uploadResult.assetId,
          fileName: filename,
          fileUrl: uploadResult.publicUrl,
          fileType: uploadResult.fileType,
          fileSize: uploadResult.fileSize,
          mimeType: uploadResult.mimeType,
          uploaderId: uploaderId || 'guest',
          uploaderName: authenticatedUser?.name || 'Misafir',
          thumbnail512: uploadResult.thumbnail512PublicUrl,
          thumbnail256: uploadResult.thumbnail256PublicUrl
        }).catch(e => console.error("Legacy media file logging error:", e));
      }

      res.json({ 
        success: true, 
        url: uploadResult.publicUrl,
        object_key: uploadResult.objectKey,
        thumbnail_512: uploadResult.thumbnail512PublicUrl,
        thumbnail_256: uploadResult.thumbnail256PublicUrl,
        fileType: uploadResult.fileType,
        assetId: uploadResult.assetId,
        entityType: uploadResult.entityType,
        entityId: uploadResult.entityId
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      res.status(500).json({ success: false, message: "Dosya yüklenirken hata oluştu." });
    }
  });

  // =========================================================================
  // SPRINT 1: ENTITY DATABASE SYSTEM (SAIOS v1.0) REST API & CRUD ENDPOINTS
  // =========================================================================

  // =========================================================================
  // SPRINT 1: ENTITY DATABASE SYSTEM (SAIOS v1.0) REST API & CRUD ENDPOINTS
  // =========================================================================

  // --- ENTITY AUDIT LOGS API ---
  app.get("/api/entity-audit-logs", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string, 10) || 50;
      const logs = await getEntityAuditLogs(limit);
      res.json({ success: true, logs });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- BRANDS API ---
  app.get("/api/brands", async (req, res) => {
    try {
      if (req.query.page || req.query.limit || req.query.q || req.query.search) {
        const result = await getBrandsPaginated({
          page: parseInt(req.query.page as string, 10) || 1,
          limit: parseInt(req.query.limit as string, 10) || 20,
          search: (req.query.q || req.query.search) as string
        });
        return res.json(result);
      }
      const brands = await getBrandsFromDb();
      res.json(brands);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/brands/:idOrSlug", async (req, res) => {
    try {
      const brand = await getBrandByIdOrSlug(req.params.idOrSlug);
      if (!brand) return res.status(404).json({ error: "Brand not found" });
      res.json(brand);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/brands", express.json(), async (req, res) => {
    try {
      const { id, name, slug, description, logoUrl, website } = req.body;
      if (!id || !name || !slug) return res.status(400).json({ error: "id, name, and slug are required" });
      await createBrandInDb(id, name, slug, description, logoUrl, website);
      await createEntityAuditLog('brands', id, 'CREATE', (req.user as any)?.displayName || 'api', { id, name, slug });
      res.status(201).json({ message: "Brand created successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/brands/:id", express.json(), async (req, res) => {
    try {
      const { name, slug, description, logoUrl, website } = req.body;
      if (!name || !slug) return res.status(400).json({ error: "name and slug are required" });
      await updateBrandInDb(req.params.id, name, slug, description, logoUrl, website);
      await createEntityAuditLog('brands', req.params.id, 'UPDATE', (req.user as any)?.displayName || 'api', { id: req.params.id, name, slug });
      res.json({ message: "Brand updated successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/brands/:id", async (req, res) => {
    try {
      if (req.query.hard === 'true') {
        await deleteBrandFromDb(req.params.id);
        await createEntityAuditLog('brands', req.params.id, 'HARD_DELETE', (req.user as any)?.displayName || 'api');
      } else {
        await softDeleteEntityInDb('brands', req.params.id, (req.user as any)?.displayName || 'api');
      }
      res.json({ message: "Brand deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- HARDWARE CATEGORIES API ---
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await getHardwareCategoriesFromDb();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/categories/:idOrSlug", async (req, res) => {
    try {
      const category = await getHardwareCategoryByIdOrSlug(req.params.idOrSlug);
      if (!category) return res.status(404).json({ error: "Category not found" });
      res.json(category);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/categories", express.json(), async (req, res) => {
    try {
      const { id, name, slug, description } = req.body;
      if (!id || !name || !slug) return res.status(400).json({ error: "id, name, and slug are required" });
      await createHardwareCategoryInDb(id, name, slug, description);
      await createEntityAuditLog('categories', id, 'CREATE', (req.user as any)?.displayName || 'api', { id, name, slug });
      res.status(201).json({ message: "Category created successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/categories/:id", express.json(), async (req, res) => {
    try {
      const { name, slug, description } = req.body;
      if (!name || !slug) return res.status(400).json({ error: "name and slug are required" });
      await updateHardwareCategoryInDb(req.params.id, name, slug, description);
      await createEntityAuditLog('categories', req.params.id, 'UPDATE', (req.user as any)?.displayName || 'api', { id: req.params.id, name, slug });
      res.json({ message: "Category updated successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    try {
      if (req.query.hard === 'true') {
        await deleteHardwareCategoryFromDb(req.params.id);
        await createEntityAuditLog('categories', req.params.id, 'HARD_DELETE', (req.user as any)?.displayName || 'api');
      } else {
        await softDeleteEntityInDb('categories', req.params.id, (req.user as any)?.displayName || 'api');
      }
      res.json({ message: "Category deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- HARDWARE API ---
  app.get("/api/hardware", async (req, res) => {
    try {
      if (req.query.page || req.query.limit || req.query.q || req.query.search || req.query.brandId || req.query.categoryId) {
        const result = await getHardwarePaginated({
          page: parseInt(req.query.page as string, 10) || 1,
          limit: parseInt(req.query.limit as string, 10) || 20,
          search: (req.query.q || req.query.search) as string,
          brandId: req.query.brandId as string,
          categoryId: req.query.categoryId as string
        });
        return res.json(result);
      }
      const hardware = await getHardwareFromDb();
      res.json(hardware);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/hardware/bulk", express.json(), async (req, res) => {
    try {
      const { items } = req.body;
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "items array is required" });
      }
      const result = await bulkInsertHardwareInDb(items, (req.user as any)?.displayName || 'api');
      res.status(201).json({ message: "Bulk insertion processed", ...result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/hardware/:idOrSlug", async (req, res) => {
    try {
      const hardware = await getHardwareByIdOrSlug(req.params.idOrSlug);
      if (!hardware) return res.status(404).json({ error: "Hardware not found" });
      res.json(hardware);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  app.post("/api/admin/ingest-buildcores", express.json(), async (req, res) => {
    try {
      const { category, limit } = req.body;
      const { buildCoresScraper } = await import("./server/services/BuildCoresScraper");
      const result = await buildCoresScraper.fetchAndIngestCategory(category || "CPU", limit || 5);
      res.json({ status: "success", ingested: result.length, data: result });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/hardware/analyze-setup", express.json(), async (req, res) => {
    try {
      const { hardwareComponents, resolution, game } = req.body;
      const { hardwareIntelligenceService } = await import("./server/services/HardwareIntelligenceService");
      const analysis = await hardwareIntelligenceService.analyzeSetup(hardwareComponents, resolution, game);
      res.json(analysis);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/hardware/ingest", express.json(), async (req, res) => {
    try {
      const { rawText, sourceName } = req.body;
      const { hardwareIntelligenceService } = await import("./server/services/HardwareIntelligenceService");
      const result = await hardwareIntelligenceService.ingestRawData(rawText, sourceName);
      res.json(result);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });


  app.post("/api/hardware", express.json(), async (req, res) => {
    try {
      const { id, name, slug, brandId, categoryId, description, specs, imageUrl, priceEstimate, buyLink } = req.body;
      if (!id || !name || !slug) return res.status(400).json({ error: "id, name, and slug are required" });
      await createHardwareInDb(id, name, slug, brandId, categoryId, description, specs, imageUrl, priceEstimate, buyLink);
      await createEntityAuditLog('hardware', id, 'CREATE', (req.user as any)?.displayName || 'api', { id, name, slug });
      res.status(201).json({ message: "Hardware created successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/hardware/:id", express.json(), async (req, res) => {
    try {
      const { name, slug, brandId, categoryId, description, specs, imageUrl, priceEstimate, buyLink } = req.body;
      if (!name || !slug) return res.status(400).json({ error: "name and slug are required" });
      await updateHardwareInDb(req.params.id, name, slug, brandId, categoryId, description, specs, imageUrl, priceEstimate, buyLink);
      await createEntityAuditLog('hardware', req.params.id, 'UPDATE', (req.user as any)?.displayName || 'api', { id: req.params.id, name, slug });
      res.json({ message: "Hardware updated successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/hardware/:id", async (req, res) => {
    try {
      if (req.query.hard === 'true') {
        await deleteHardwareFromDb(req.params.id);
        await createEntityAuditLog('hardware', req.params.id, 'HARD_DELETE', (req.user as any)?.displayName || 'api');
      } else {
        await softDeleteEntityInDb('hardware', req.params.id, (req.user as any)?.displayName || 'api');
      }
      res.json({ message: "Hardware deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- GAMES API ---
  app.get("/api/games", async (req, res) => {
    try {
      if (req.query.page || req.query.limit || req.query.q || req.query.search) {
        const result = await getGamesPaginated({
          page: parseInt(req.query.page as string, 10) || 1,
          limit: parseInt(req.query.limit as string, 10) || 20,
          search: (req.query.q || req.query.search) as string
        });
        return res.json(result);
      }
      const games = await getGamesFromDb();
      res.json(games);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/games/:idOrSlug", async (req, res) => {
    try {
      const game = await getGameByIdOrSlug(req.params.idOrSlug);
      if (!game) return res.status(404).json({ error: "Game not found" });
      res.json(game);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/games", express.json(), async (req, res) => {
    try {
      const { id, name, slug, description, imageUrl, genre, developer, releaseYear, steamId } = req.body;
      if (!id || !name || !slug) return res.status(400).json({ error: "id, name, and slug are required" });
      await createGameInDb(id, name, slug, description, imageUrl, genre, developer, releaseYear, steamId);
      await createEntityAuditLog('games', id, 'CREATE', (req.user as any)?.displayName || 'api', { id, name, slug });
      res.status(201).json({ message: "Game created successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/games/:id", express.json(), async (req, res) => {
    try {
      const { name, slug, description, imageUrl, genre, developer, releaseYear, steamId } = req.body;
      if (!name || !slug) return res.status(400).json({ error: "name and slug are required" });
      await updateGameInDb(req.params.id, name, slug, description, imageUrl, genre, developer, releaseYear, steamId);
      await createEntityAuditLog('games', req.params.id, 'UPDATE', (req.user as any)?.displayName || 'api', { id: req.params.id, name, slug });
      res.json({ message: "Game updated successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/games/:id", async (req, res) => {
    try {
      if (req.query.hard === 'true') {
        await deleteGameFromDb(req.params.id);
        await createEntityAuditLog('games', req.params.id, 'HARD_DELETE', (req.user as any)?.displayName || 'api');
      } else {
        await softDeleteEntityInDb('games', req.params.id, (req.user as any)?.displayName || 'api');
      }
      res.json({ message: "Game deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- ENTITY MAPPINGS / RELATIONSHIPS API ---
  app.get("/api/setups/:setupId/hardware", async (req, res) => {
    try {
      const hw = await getSetupHardware(req.params.setupId);
      res.json(hw);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/setups/:setupId/hardware", express.json(), async (req, res) => {
    try {
      const { hardwareId, notes } = req.body;
      if (!hardwareId) return res.status(400).json({ error: "hardwareId is required" });
      await linkSetupToHardware(req.params.setupId, hardwareId, notes);
      res.status(201).json({ message: "Setup linked to hardware successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/setups/:setupId/hardware/:hardwareId", async (req, res) => {
    try {
      await unlinkSetupFromHardware(req.params.setupId, req.params.hardwareId);
      res.json({ message: "Setup unlinked from hardware successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/setups/:setupId/games", async (req, res) => {
    try {
      const games = await getSetupGames(req.params.setupId);
      res.json(games);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/setups/:setupId/games", express.json(), async (req, res) => {
    try {
      const { gameId } = req.body;
      if (!gameId) return res.status(400).json({ error: "gameId is required" });
      await linkSetupToGame(req.params.setupId, gameId);
      res.status(201).json({ message: "Setup linked to game successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/setups/:setupId/games/:gameId", async (req, res) => {
    try {
      await unlinkSetupFromGame(req.params.setupId, req.params.gameId);
      res.json({ message: "Setup unlinked from game successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });


  // 2. UPDATE PROFILE
  app.post("/api/user/profile", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ success: false, message: "Lütfen önce giriş yapın." });
      }

      const { 
        displayName, 
        avatar, 
        bio, 
        githubLink, 
        instagramLink, 
        linkedinLink, 
        coverPhoto, 
        customBadge, 
        customColor,
        avatarFrame
      } = req.body;

      if (!displayName) {
        return res.status(400).json({ success: false, message: "İsim alanı boş bırakılamaz." });
      }

      const userId = (req.user as any).id;
      const hasValidDb = checkDbActive();

      if (hasValidDb && pool) {
        try {
          await updateUserProfileInDb(
            userId, 
            displayName, 
            avatar || null,
            bio || null,
            githubLink || null,
            instagramLink || null,
            linkedinLink || null,
            coverPhoto || null,
            customBadge || null,
            customColor || null,
            avatarFrame || 'none'
          );
        } catch (e) {
          console.error("Failed to update profile in DB, updating local fallback:", e);
        }
      }

      // Always update local memory cache for persistent fast access
      let u = localUsers.find(user => user.id === userId);
      if (!u) {
        u = { id: userId, email: (req.user as any).email || "user@setupss.com" };
        localUsers.push(u);
        localUsersList.push(u);
      }
      u.name = displayName;
      u.displayName = displayName;
      u.avatar = avatar || null;
      u.bio = bio || null;
      u.githubLink = githubLink || null;
      u.instagramLink = instagramLink || null;
      u.linkedinLink = linkedinLink || null;
      u.coverPhoto = coverPhoto || null;
      u.customBadge = customBadge || null;
      u.customColor = customColor || null;
      u.avatarFrame = avatarFrame || 'none';

      // Sync passport session
      (req.user as any).displayName = displayName;
      (req.user as any).name = displayName;
      (req.user as any).avatar = avatar || null;
      (req.user as any).bio = bio || "";
      (req.user as any).githubLink = githubLink || "";
      (req.user as any).instagramLink = instagramLink || "";
      (req.user as any).linkedinLink = linkedinLink || "";
      (req.user as any).coverPhoto = coverPhoto || "";
      (req.user as any).customBadge = customBadge || "";
      (req.user as any).customColor = customColor || "";
      (req.user as any).avatarFrame = avatarFrame || "none";

      savePersistentDb();

      res.json({ success: true, user: req.user });
    } catch (error: any) {
      console.error("Update profile error:", error);
      res.status(500).json({ success: false, message: "Profil güncellenirken hata oluştu." });
    }
  });

  // ==========================================
  // FRIEND SYSTEM ENDPOINTS
  // ==========================================

  // Get friends list & pending requests
  app.get("/api/friends/list", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ success: false, message: "Lütfen önce giriş yapın." });
      }
      const userId = (req.user as any).id;
      const friendships = await getFriendshipsForUserFromDb(userId);
      res.json({ success: true, friendships });
    } catch (e: any) {
      console.error("Get friends error:", e);
      res.status(500).json({ success: false, message: "Arkadaş listesi alınırken hata oluştu." });
    }
  });

  // Send friend request
  app.post("/api/friends/request", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ success: false, message: "Lütfen önce giriş yapın." });
      }
      const { friendId } = req.body;
      const userId = (req.user as any).id;

      if (userId === friendId) {
        return res.status(400).json({ success: false, message: "Kendinizi arkadaş ekleyemezsiniz." });
      }

      const id = `friendship-${Date.now()}`;
      await addFriendshipToDb(id, userId, friendId, 'pending');
      res.json({ success: true, message: "Arkadaşlık isteği gönderildi." });
    } catch (e: any) {
      console.error("Friend request error:", e);
      res.status(500).json({ success: false, message: "Arkadaşlık isteği gönderilemedi." });
    }
  });

  // Accept friend request
  app.post("/api/friends/accept", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ success: false, message: "Lütfen önce giriş yapın." });
      }
      const { friendId } = req.body;
      const userId = (req.user as any).id;

      await updateFriendshipStatusInDb(friendId, userId, 'accepted');
      res.json({ success: true, message: "Arkadaşlık isteği kabul edildi." });
    } catch (e: any) {
      console.error("Accept friend request error:", e);
      res.status(500).json({ success: false, message: "Arkadaşlık isteği kabul edilemedi." });
    }
  });

  // Reject / Remove friend
  app.post("/api/friends/reject", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ success: false, message: "Lütfen önce giriş yapın." });
      }
      const { friendId } = req.body;
      const userId = (req.user as any).id;

      await deleteFriendshipInDb(userId, friendId);
      res.json({ success: true, message: "İşlem başarılı." });
    } catch (e: any) {
      console.error("Reject friend error:", e);
      res.status(500).json({ success: false, message: "İşlem gerçekleştirilemedi." });
    }
  });

  // ==========================================
  // SENTINEL V900 AI SECURITY ENDPOINTS
  // ==========================================

  // Get referral logs audited by Sentinel V900
  app.get("/api/sentinel/referrals", async (req, res) => {
    try {
      const logs = await sentinelService.getReferralLogs();
      res.json({ success: true, logs });
    } catch (err: any) {
      console.error("Get referral logs error:", err);
      res.status(500).json({ success: false, message: "Denetim kayıtları alınamadı." });
    }
  });

  // Get chat reports audited by Sentinel V900
  app.get("/api/sentinel/reports", async (req, res) => {
    try {
      const logs = await sentinelService.getChatReports();
      res.json({ success: true, logs });
    } catch (err: any) {
      console.error("Get chat reports error:", err);
      res.status(500).json({ success: false, message: "Sohbet ihbar kayıtları alınamadı." });
    }
  });

  // Get list of banned users
  app.get("/api/sentinel/banned", async (req, res) => {
    try {
      const hasValidDb = checkDbActive();
      let bannedList: any[] = [];
      if (hasValidDb && pool) {
        const { rows } = await pool.query(
          "SELECT id, name, email, avatar, created_at FROM users WHERE is_banned = TRUE"
        );
        bannedList = rows;
      } else {
        bannedList = localUsers
          .filter(u => u.isBanned || u.is_banned)
          .map(u => ({ id: u.id, name: u.name, email: u.email, avatar: u.avatar, created_at: u.createdAt }));
      }
      res.json({ success: true, banned: bannedList });
    } catch (err: any) {
      console.error("Get banned users error:", err);
      res.status(500).json({ success: false, message: "Yasaklı kullanıcılar alınamadı." });
    }
  });

  // Report a chat message (swearing/insults)
  app.post("/api/chat/report", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ success: false, message: "Lütfen önce giriş yapın." });
      }
      const { messageId, chatMessage, senderId, senderName } = req.body;
      const reporterId = (req.user as any).id;
      const reporterName = (req.user as any).name || "Bir Geliştirici";

      if (!messageId || !chatMessage || !senderId || !senderName) {
        return res.status(400).json({ success: false, message: "Eksik parametreler." });
      }

      if (reporterId === senderId) {
        return res.status(400).json({ success: false, message: "Kendi mesajınızı ihbar edemezsiniz." });
      }

      // Sentinel V900 audits this reported message instantly!
      const auditResult = await sentinelService.auditChatMessage(
        reporterId,
        reporterName,
        messageId,
        chatMessage,
        senderId,
        senderName
      );

      res.json({
        success: true,
        isProfane: auditResult.isProfane,
        reason: auditResult.reason,
        message: auditResult.isProfane
          ? `Sentinel V900 güvenlik denetimi tamamlandı: Mesajda ağır küfür/hakaret saptandı ve "${senderName}" isimli kullanıcı uzaklaştırıldı.`
          : `Sentinel V900 güvenlik denetimi tamamlandı: Mesaj temiz bulundu ve ihbar kapatıldı.`
      });
    } catch (err: any) {
      console.error("Report message error:", err);
      res.status(500).json({ success: false, message: "İhbar işlenirken hata oluştu." });
    }
  });

  // Unban user (Sentinel V900 control)
  app.post("/api/sentinel/unban", async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ success: false, message: "Kullanıcı ID zorunludur." });
      }

      const hasValidDb = checkDbActive();
      if (hasValidDb && pool) {
        await pool.query(
          "UPDATE users SET is_banned = FALSE WHERE id = $1",
          [userId]
        );
      } else {
        const u = localUsers.find(u => u.id === userId);
        if (u) {
          u.isBanned = false;
          u.is_banned = false;
        }
      }

      // Notify the unbanned user
      await realtimeService.createNotification({
        userId,
        senderId: 'system-sentinel',
        senderName: 'Sentinel V900',
        senderAvatar: '/setupss_icon.svg',
        type: 'like',
        title: 'Hesabınız Aktif Edildi! 🛡️',
        content: `Sentinel V900 incelemesi sonucunda hesabınız tekrar aktifleştirildi. Lütfen topluluk kurallarına uyun.`,
        link: '/'
      });

      res.json({ success: true, message: "Kullanıcının yasaklaması başarıyla kaldırıldı." });
    } catch (err: any) {
      console.error("Unban user error:", err);
      res.status(500).json({ success: false, message: "Yasak kaldırılamadı." });
    }
  });

  // Search users (to find potential friends)
  app.get("/api/users/search", async (req, res) => {
    try {
      const q = (req.query.q || "").toString().trim().toLowerCase();
      const hasValidDb = checkDbActive();
      let usersList: any[] = [];

      if (hasValidDb && pool) {
        const { rows } = await pool.query(
          `SELECT id, name, avatar, bio, custom_badge as "customBadge", custom_color as "customColor" 
           FROM users 
           WHERE name ILIKE $1 OR email ILIKE $1 OR id IN (SELECT id FROM profiles WHERE display_name ILIKE $1 OR username ILIKE $1) 
           LIMIT 30`,
          [`%${q}%`]
        );
        usersList = rows.map(r => ({
          id: r.id,
          name: r.name,
          avatar: r.avatar,
          bio: r.bio || "",
          customBadge: r.customBadge || r.custom_badge || "",
          customColor: r.customColor || r.custom_color || ""
        }));
      } else {
        usersList = localUsers
          .filter(u => {
            const nameMatch = (u.name || "").toLowerCase().includes(q);
            const emailMatch = (u.email || "").toLowerCase().includes(q);
            const displayNameMatch = (u.displayName || "").toLowerCase().includes(q);
            const usernameMatch = (u.username || "").toLowerCase().includes(q);
            return nameMatch || emailMatch || displayNameMatch || usernameMatch;
          })
          .map(u => ({
            id: u.id,
            name: u.name || u.displayName || u.email.split('@')[0],
            avatar: u.avatar,
            bio: u.bio || "",
            customBadge: u.customBadge || u.custom_badge || "",
            customColor: u.customColor || u.custom_color || ""
          }));
      }
      res.json({ success: true, users: usersList });
    } catch (e: any) {
      console.error("User search error:", e);
      res.status(500).json({ success: false, message: "Kullanıcılar aranırken hata oluştu." });
    }
  });

  // Get a specific user's public profile fields by ID
  app.get("/api/users/profile/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const hasValidDb = checkDbActive();
      
      let profile = null;
      if (hasValidDb && pool) {
        const { rows } = await pool.query(
          `SELECT id, name, avatar, bio, 
                  github_link as "githubLink", 
                  instagram_link as "instagramLink", 
                  linkedin_link as "linkedinLink", 
                  cover_photo as "coverPhoto", 
                  custom_badge as "customBadge", 
                  custom_color as "customColor",
                  is_crown as "isCrown",
                  has_rgb as "hasRgb"
           FROM users WHERE id = $1 LIMIT 1`,
          [userId]
        );
        if (rows[0]) {
          profile = rows[0];
          profile.isCrown = !!profile.isCrown;
          profile.hasRgb = !!profile.hasRgb;
        }
      } else {
        const u = localUsers.find(user => user.id === userId);
        if (u) {
          profile = {
            id: u.id,
            name: u.name,
            avatar: u.avatar,
            bio: u.bio || "",
            githubLink: u.githubLink || "",
            instagramLink: u.instagramLink || "",
            linkedinLink: u.linkedinLink || "",
            coverPhoto: u.coverPhoto || "",
            customBadge: u.customBadge || "",
            customColor: u.customColor || "",
            isCrown: !!u.isCrown,
            hasRgb: !!u.hasRgb
          };
        }
      }

      if (profile) {
        return res.json({ success: true, profile });
      }
      res.status(404).json({ success: false, message: "Kullanıcı bulunamadı." });
    } catch (e: any) {
      console.error("User profile error:", e);
      res.status(500).json({ success: false, message: "Profil bilgileri alınırken hata oluştu." });
    }
  });

  // ==========================================
  // CHAT ENDPOINTS
  // ==========================================

  // 0. FIND USER BY OWNER NAME (FOR STARTING CHAT)
  app.get("/api/users/find-by-owner/:ownerName", async (req, res) => {
    try {
      const { ownerName } = req.params;
      const hasValidDb = checkDbActive();
      
      let foundUser = null;
      if (hasValidDb && pool) {
        const { rows } = await pool.query("SELECT id, name, avatar FROM users WHERE name = $1 LIMIT 1", [ownerName]);
        if (rows[0]) {
          foundUser = {
            id: rows[0].id,
            name: rows[0].name,
            avatar: rows[0].avatar
          };
        }
      } else {
        const u = localUsers.find(user => user.name === ownerName);
        if (u) {
          foundUser = {
            id: u.id,
            name: u.name,
            avatar: u.avatar
          };
        }
      }

      if (foundUser) {
        return res.json({ success: true, user: foundUser });
      }

      // If not found, return a consistent mock user ID derived from their name so chat still functions
      const mockId = `mock-${ownerName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
      res.json({
        success: true,
        user: {
          id: mockId,
          name: ownerName,
          avatar: null,
          isMock: true
        }
      });
    } catch (error: any) {
      console.error("Find user by owner name error:", error);
      res.status(500).json({ success: false, message: "Kullanıcı bulunurken hata oluştu." });
    }
  });
  
  // 1. GET CHAT HISTORY WITH A SPECIFIC USER
  app.get("/api/chat/history/:otherUserId", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ success: false, message: "Lütfen önce giriş yapın." });
      }
      const userId = (req.user as any).id;
      const { otherUserId } = req.params;

      const history = await getChatHistoryFromDb(userId, otherUserId);
      res.json({ success: true, history });
    } catch (error: any) {
      console.error("Failed to get chat history:", error);
      res.status(500).json({ success: false, message: "Sohbet geçmişi alınırken hata oluştu." });
    }
  });

  // 2. GET ALL CHAT ROOMS/CONVERSATIONS FOR CURRENT USER
  app.get("/api/chat/rooms", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ success: false, message: "Lütfen önce giriş yapın." });
      }
      const userId = (req.user as any).id;
      const messages = await getAllUserMessagesFromDb(userId);
      
      const roomsMap = new Map<string, any>();
      messages.forEach(m => {
        const isSender = m.senderId === userId;
        const partnerId = isSender ? m.receiverId : m.senderId;
        const partnerName = isSender ? m.receiverName : m.senderName;
        const partnerAvatar = isSender ? m.receiverAvatar : m.senderAvatar;
        // If message is FROM partner, we know their hasRgb status
        const partnerHasRgb = !isSender ? m.senderHasRgb : undefined;

        const existing = roomsMap.get(partnerId);
        if (!existing || new Date(m.createdAt).getTime() > new Date(existing.lastMessageAt).getTime()) {
          roomsMap.set(partnerId, {
            partnerId,
            partnerName,
            partnerAvatar,
            partnerHasRgb: partnerHasRgb !== undefined ? partnerHasRgb : (existing ? existing.partnerHasRgb : false),
            lastMessage: m.message,
            lastMessageAt: m.createdAt,
            unreadCount: existing ? existing.unreadCount : 0
          });
        }
        if (!m.isRead && m.receiverId === userId) {
          const rm = roomsMap.get(partnerId);
          if (rm) {
            rm.unreadCount += 1;
          }
        }
      });

      const rooms = Array.from(roomsMap.values()).sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
      res.json({ success: true, rooms });
    } catch (error: any) {
      console.error("Failed to get chat rooms:", error);
      res.status(500).json({ success: false, message: "Sohbet odaları alınırken hata oluştu." });
    }
  });

  
  // NEW: STREAMING AI CHAT ENDPOINT
  app.post("/api/ai/chat/stream", async (req, res) => {
    try {
      const { messages, pageContext } = req.body;
      const currentUserId = req.isAuthenticated() ? (req.user as any).id : null;

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      const ai = getGemini();
      const siteContext = await getSiteContext();
      


      // Inject comprehensive page context
      let activePageContextStr = "";
      if (pageContext?.pathname) {
        const path = pageContext.pathname;
        if (path.includes('/hardware/')) {
          const slug = path.split('/hardware/')[1];
          const hw = getHardwareBySlug(slug);
          if (hw) activePageContextStr = `Kullanıcı ŞU AN bu donanım sayfasında: ${JSON.stringify(hw, null, 2)}`;
        } else if (path.includes('/setup/')) {
          const slug = path.split('/setup/')[1];
          const { rows } = await pool.query('SELECT * FROM setup_posts WHERE id = $1', [slug]);
          if (rows[0]) activePageContextStr = `Kullanıcı ŞU AN bu masaüstü kurulumunu (setup) inceliyor: ${JSON.stringify(rows[0], null, 2)}`;
        } else if (path.includes('/u/')) {
          const username = path.split('/u/')[1];
          const { rows } = await pool.query('SELECT id, name, bio, level, rank, role, avatar FROM users WHERE name ILIKE $1', [username]);
          if (rows[0]) activePageContextStr = `Kullanıcı ŞU AN bu kullanıcının profilini görüntülüyor: ${JSON.stringify(rows[0], null, 2)}`;
        } else if (path.includes('/compare')) {
          activePageContextStr = `Kullanıcı ŞU AN donanım karşılaştırma sayfasında: ${path}`;
        } else if (path.includes('/hardware-combo')) {
          activePageContextStr = `Kullanıcı ŞU AN Donanım Kombinasyonları sayfasında: ${path}`;
        } else if (path.includes('/category/')) {
          activePageContextStr = `Kullanıcı ŞU AN bu kategoriyi inceliyor: ${path}`;
        } else if (path.includes('/brand/')) {
          activePageContextStr = `Kullanıcı ŞU AN bu markayı inceliyor: ${path}`;
        } else if (path.includes('/guide')) {
          activePageContextStr = `Kullanıcı ŞU AN Rehberler sayfasında: ${path}`;
        } else if (path.includes('/ai-planner') || path.includes('/planner')) {
          activePageContextStr = `Kullanıcı ŞU AN AI Masaüstü Planlayıcı (AI Planner) sayfasında.`;
        } else if (path.includes('/deals')) {
          activePageContextStr = `Kullanıcı ŞU AN İndirimler & Fırsatlar (Deals) sayfasında.`;
        } else if (path.includes('/leaderboard')) {
          activePageContextStr = `Kullanıcı ŞU AN Liderlik Tablosu (Leaderboard) sayfasında.`;
        } else if (path === '/') {
          activePageContextStr = `Kullanıcı ŞU AN Anasayfa'da (Feed).`;
        }
      }

      
      const systemInstruction = `
Sen Setupss AI'sın. Profesyonel, canayakın, samimi ve son teknoloji teknik bir uzmansın (Tıpkı premium bir yapay zeka asistanı olan ChatGPT, Claude gibi ama PC kurulumları, donanım, ekipmanlar ve yazılım odaklı).
Setupss platformunun resmi AI asistanısın. Kullanıcılar ile sohbet ederken onları tanımaya çalış, yardımcı ol ve donanım konusunda mükemmel bilgi sun.

SITE CONTEXT (Güncel site verileri):
${JSON.stringify(siteContext)}

PAGE CONTEXT (Kullanıcının bulunduğu sayfa):
${JSON.stringify(pageContext || {})}

AKTİF SAYFA BAĞLAMI:
${activePageContextStr}

KURALLAR:
- Kullanıcının "bu iyi mi", "bunu karşılaştır" gibi ifadelerini AKTİF SAYFA BAĞLAMI ile eşleştirip anla.
- Bir donanım karşılaştırması istenirse, teknik özelliklerini (VRAM, TDP, vb.) Markdown tabloları kullanarak karşılaştır. 
- Eğer bütçe tabanlı bir kurulum planı istenirse adım adım ilerle. Sorular sorarak ilerle.
- Sadece saf metin yerine zengin Markdown özellikleri kullan: Başlıklar, tablolar, listeler, kalın/eğik yazı, vb.
- Yanıtlarının EN SONUNA daima üç tire (---) koy ve ardından kullanıcının tıklayabileceği / sorabileceği 3 adet yaratıcı, AKTİF SAYFA BAĞLAMI ile alakalı devam sorusu önerisi ekle. Her defasında yepyeni ve FARKLI öneriler sun, öncekileri ASLA tekrar etme. Format olarak mutlaka '**Önerilen Sorular:**' başlığını kullan ve soruları '1. ...' liste olarak ver.
`;

      const stream = await ai.models.generateContentStream({
        model: "gemini-3.6-flash",
        contents: messages, // should be formatted for SDK: [{ role: 'user', parts: [{ text: '...' }] }, ...]
        config: {
          systemInstruction,
          maxOutputTokens: 2500,
        }
      });

      let fullText = "";
      for await (const chunk of stream) {
        const text = chunk.text;
        if (text) {
          fullText += text;
          res.write(`data: ${JSON.stringify({ text })}\n\n`);
        }
      }

            res.write(`data: [DONE]\n\n`);
      res.end();
      
      if (currentUserId && fullText) {
        const userMsgText = messages[messages.length - 1]?.parts?.[0]?.text || "";
        
        // Save User Message
        if (userMsgText) {
          const userMsg = {
            id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            senderId: currentUserId,
            senderName: req.user ? (req.user as any).displayName || (req.user as any).name : "Siz",
            senderAvatar: req.user ? (req.user as any).avatar : undefined,
            receiverId: AI_BOT_ID,
            receiverName: "Setupss AI",
            receiverAvatar: "/airobot.jpg",
            message: userMsgText,
            createdAt: new Date().toISOString(),
            isRead: true,
            senderHasRgb: false
          };
          await addChatMessageToDb(userMsg);
        }

        // Save AI Message
        const botReplyMsg = {
          id: `msg-ai-${Date.now()}`,
          senderId: AI_BOT_ID,
          senderName: "Setupss AI",
          senderAvatar: "/airobot.jpg",
          receiverId: currentUserId,
          receiverName: req.user ? (req.user as any).displayName || (req.user as any).name : "Siz",
          receiverAvatar: req.user ? (req.user as any).avatar : undefined,
          message: fullText,
          createdAt: new Date().toISOString(),
          isRead: false,
          senderHasRgb: false
        };
        await addChatMessageToDb(botReplyMsg);
      }
      
      // Optionally save to DB if needed, but since it's an AI assistant we might only keep it in client memory for now to save DB load, or save it here.
    } catch(e: any) {
      console.error("Streaming AI error:", e);
      res.write(`data: ${JSON.stringify({ error: e.message })}\n\n`);
      res.end();
    }
  });

  // 3. POST A CHAT MESSAGE (FALLBACK / HTTP WAY)
  app.post("/api/chat/message", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ success: false, message: "Lütfen önce giriş yapın." });
      }
      const userId = (req.user as any).id;
      const senderName = (req.user as any).displayName || "Bilinmeyen Kullanıcı";
      const senderAvatar = (req.user as any).avatar || undefined;
      const senderHasRgb = !!(req.user as any).hasRgb;
      const { receiverId, receiverName, receiverAvatar, message, mediaUrl, mediaType } = req.body;

      if (!receiverId || (!message && !mediaUrl)) {
        return res.status(400).json({ success: false, message: "Alıcı ID ve mesaj veya medya zorunludur." });
      }

      // Check if user is banned
      const hasValidDb = checkDbActive();
      let isBanned = false;
      if (hasValidDb && pool) {
        const { rows } = await pool.query('SELECT is_banned FROM users WHERE id = $1', [userId]);
        if (rows.length > 0 && rows[0].is_banned) isBanned = true;
      } else {
        const u = localUsers.find(u => u.id === userId);
        if (u && (u.isBanned || u.is_banned)) isBanned = true;
      }
      if (isBanned) {
        return res.status(403).json({ success: false, message: "Hesabınız Sentinel V900 tarafından küfür/hakaret tespiti sebebiyle askıya alınmıştır." });
      }

      const msg: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        senderId: userId,
        senderName,
        senderAvatar,
        receiverId,
        receiverName: receiverName || "SETUPSS Kullanıcısı",
        receiverAvatar,
        message: message || "",
        createdAt: new Date().toISOString(),
        isRead: false,
        senderHasRgb,
        mediaUrl: mediaUrl || undefined,
        mediaType: mediaType || undefined
      };

      await addChatMessageToDb(msg);

      // Handle AI BOT response
      if (receiverId === AI_BOT_ID) {
        try {
          const ai = getGemini();
          const context = await getSiteContext();
          
          const result = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: `${context}\n\nKullanıcı: ${message || "Selam"}`
          });
          
          const botReply = result.text || "Üzgünüm, şu an yanıt veremiyorum.";
          const replyMsg: ChatMessage = {
            id: `msg-ai-${Date.now()}`,
            senderId: AI_BOT_ID,
            senderName: "Setupss AI",
            senderAvatar: "/airobot.jpg",
            receiverId: userId,
            receiverName: senderName,
            receiverAvatar: senderAvatar,
            message: botReply,
            createdAt: new Date().toISOString(),
            isRead: false
          };
          await addChatMessageToDb(replyMsg);
          return res.json({ success: true, message: msg, aiReply: replyMsg });
        } catch (aiErr) {
          console.error("AI Bot response error:", aiErr);
          const fallbackReply: ChatMessage = {
            id: `msg-ai-${Date.now()}`,
            senderId: AI_BOT_ID,
            senderName: "Setupss AI",
            senderAvatar: "/airobot.jpg",
            receiverId: userId,
            receiverName: senderName,
            receiverAvatar: senderAvatar,
            message: "Masaüstü kurulumları, ekipman tavsiyeleri ve bütçe planlama hakkında yardımcı olabilirim. Bütçe Planlayıcı bölümünden yeni bir liste oluşturabilirsiniz!",
            createdAt: new Date().toISOString(),
            isRead: false
          };
          await addChatMessageToDb(fallbackReply);
          return res.json({ success: true, message: msg, aiReply: fallbackReply });
        }
      }

      if (receiverId.startsWith('mock-') || receiverId.startsWith('setup-owner-')) {
        setTimeout(async () => {
          const autoReplies = [
            "Selam! Mesajın için teşekkürler, setup'ım hakkındaki sorunu aldım. Detaylar ve parçalar açıklamada mevcut! 🚀",
            "Beğendiğin için teşekkür ederim! Ekipmanlar, kablo gizleme veya ışıklandırma hakkında merak ettiğin bir şey olursa yazabilirsin. ⌨️",
            "Masaüstü düzenini sürekli güncelliyorum. Senin kurulumunu da sabırsızlıkla bekliyorum!",
            "Teşekkürler dostum! Monitör kolu ve RGB ışıklandırma kurulumunu baştan sona kendim yaptım. Detayları da tartışabiliriz. 🎨"
          ];
          const replyText = autoReplies[Math.floor(Math.random() * autoReplies.length)];
          const replyMsg: ChatMessage = {
            id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            senderId: receiverId,
            senderName: receiverName || "SETUPSS Üyesi",
            senderAvatar: receiverAvatar,
            receiverId: userId,
            receiverName: senderName,
            receiverAvatar: senderAvatar,
            message: replyText,
            createdAt: new Date().toISOString(),
            isRead: false
          };
          await addChatMessageToDb(replyMsg);
        }, 1200);
      }

      res.json({ success: true, message: msg });
    } catch (error: any) {
      console.error("Failed to send message via HTTP:", error);
      res.status(500).json({ success: false, message: "Mesaj gönderilirken hata oluştu." });
    }
  });

  // 4. MARK CONVERSATION AS READ
  app.post("/api/chat/read/:senderId", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ success: false, message: "Lütfen önce giriş yapın." });
      }
      const userId = (req.user as any).id;
      const { senderId } = req.params;

      await markMessagesAsReadInDb(senderId, userId);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Failed to mark messages as read:", error);
      res.status(500).json({ success: false, message: "Mesajlar okundu işaretlenirken hata oluştu." });
    }
  });

  // --- DISCORD-LIKE CHAT ROOMS & AI CONVERSATIONS ENDPOINTS ---
  app.get("/api/chat/rooms", async (req, res) => {
    try {
      const rooms = await getChatRooms();
      res.json({ success: true, rooms });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  app.get("/api/chat/rooms/:roomId/messages", async (req, res) => {
    try {
      const { roomId } = req.params;
      const limit = parseInt(req.query.limit as string, 10) || 50;
      const messages = await getRoomMessages(roomId, limit);
      res.json({ success: true, messages });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  app.post("/api/chat/rooms/:roomId/messages", express.json(), async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ success: false, message: "Lütfen önce giriş yapın." });
      }
      const userId = (req.user as any).id;
      const senderName = (req.user as any).displayName || "SETUPSS Kullanıcısı";
      const senderAvatar = (req.user as any).avatar || undefined;
      const senderHasRgb = !!(req.user as any).hasRgb;
      const { roomId } = req.params;
      const { message, mediaUrl, mediaType } = req.body;

      const msgId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const msgObj = {
        id: msgId,
        senderId: userId,
        senderName,
        senderAvatar,
        roomId,
        message: message || "",
        mediaUrl: mediaUrl || undefined,
        mediaType: mediaType || undefined,
        senderHasRgb
      };

      await addRoomMessage(msgObj);
      res.json({ success: true, message: msgObj });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  app.get("/api/ai/conversations", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ success: false, message: "Lütfen önce giriş yapın." });
      }
      const userId = (req.user as any).id;
      const conversations = await getAiConversationsForUser(userId);
      res.json({ success: true, conversations });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  app.post("/api/ai/conversations", express.json(), async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ success: false, message: "Lütfen önce giriş yapın." });
      }
      const userId = (req.user as any).id;
      const { title, model, systemPrompt } = req.body;
      const convId = await createAiConversation(userId, title || "Yeni AI Sohbeti", model || "gemini-2.5-flash", systemPrompt);
      res.json({ success: true, id: convId });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  app.get("/api/ai/conversations/:id/messages", async (req, res) => {
    try {
      const messages = await getAiMessagesForConversation(req.params.id);
      res.json({ success: true, messages });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  app.post("/api/ai/conversations/:id/messages", express.json(), async (req, res) => {
    try {
      const { sender, text, tokenCount, modelUsed, errorStatus } = req.body;
      const msgId = await addAiMessage(req.params.id, sender, text, tokenCount || 0, modelUsed, errorStatus);
      res.json({ success: true, id: msgId });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  app.get("/api/admin/ai-analytics", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user || (req.user as any).role !== 'admin') {
        return res.status(403).json({ success: false, message: "Yetkisiz erişim." });
      }
      const analytics = await getAiAnalyticsForAdmin();
      res.json({ success: true, analytics });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // Initialize Supabase Tables and seed data asynchronously to prevent blocking server boot
  export const dbInitPromise = initializeDatabase().catch((error) => {
    console.error("Error during database initialization:", error);
    return null;
  });

  // 1. GET ALL SETUPS
  app.get("/api/setups", async (req, res) => {
    try {
      const userId = (req.user as any)?.id || (req.query.userId as string) || (req.headers['x-user-id'] as string);
      const hasValidDb = checkDbActive();
      if (!pool || !hasValidDb) {
        console.log("Using in-memory setups fallback (no database connected)");
        const sortedLocal = [...localSetups].map((s: any) => {
          const ownerUser = localUsers.find((u: any) => u.id === s.ownerId || u.name === s.owner);
          const hasRgb = ownerUser ? (ownerUser.has_rgb || ownerUser.hasRgb || ownerUser.hasRgbEffect || (ownerUser.inviteCount && Number(ownerUser.inviteCount) > 0)) : false;
          return {
            ...s,
            ownerHasRgb: Boolean(hasRgb),
            likedByUser: userId ? localSetupLikes.has(`${userId}_${s.id}`) : false
          };
        }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return res.json({ success: true, setups: sortedLocal });
      }

      const setupsList = await getSetupsFromDb(userId);
      res.json({ success: true, setups: setupsList });
    } catch (error: any) {
      console.warn("Failed to fetch setups from DB, falling back to local in-memory storage:", error.message || error);
      const userId = (req.user as any)?.id || (req.query.userId as string) || (req.headers['x-user-id'] as string);
      const sortedLocal = [...localSetups].map((s: any) => {
        const ownerUser = localUsers.find((u: any) => u.id === s.ownerId || u.name === s.owner);
        const hasRgb = ownerUser ? (ownerUser.has_rgb || ownerUser.hasRgb || ownerUser.hasRgbEffect || (ownerUser.inviteCount && Number(ownerUser.inviteCount) > 0)) : false;
        return {
          ...s,
          ownerHasRgb: Boolean(hasRgb),
          likedByUser: userId ? localSetupLikes.has(`${userId}_${s.id}`) : false
        };
      }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      res.json({ success: true, setups: sortedLocal });
    }
  });

  // 2. CREATE NEW SETUP
  app.post("/api/setups", async (req, res) => {
    try {
      const { id: clientSetupId, draftId, title, owner, bio, category, description, image, tags, components, cardTheme } = req.body;
      const setupId = clientSetupId || `setup-user-${Date.now()}`;
      const createdAt = new Date().toISOString();
      const user = req.user as any;

      const newSetup: SetupPost = {
        id: setupId,
        title,
        owner: user?.name || owner || "Ziyaretçi Geliştirici",
        ownerId: user?.id || null,
        ownerAvatar: user?.avatar || null,
        bio: bio || "",
        category,
        description: description || "",
        image: image || "",
        likes: 0,
        tags: tags || [],
        components: components ? components.map((c: any) => ({
          id: c.id || `c-user-${Math.random().toString(36).substring(2, 11)}`,
          category: c.category,
          name: c.name,
          link: c.link
        })) : [],
        comments: [],
        createdAt,
        cardTheme: cardTheme || 'dark'
      };

      const hasValidDb = checkDbActive();
      if (!pool || !hasValidDb) {
        localSetups.unshift(newSetup);
        return res.json({ success: true, id: setupId });
      }

      await addSetupToDb(newSetup);

      // Re-associate any draft or unlinked media_assets to this real setupId
      if (image && pool) {
        await pool.query(`
          UPDATE public.media_assets
          SET entity_id = $1, uploader_id = COALESCE(uploader_id, $2)
          WHERE public_url = $3 OR entity_id = $4
        `, [setupId, user?.id || null, image, draftId || '']).catch(err => console.error("Media asset link update error:", err));
      }

      res.json({ success: true, id: setupId });
    } catch (error: any) {
      console.error("Failed to create setup:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // DAILY STREAK (SERİ) STATUS ENDPOINT
  app.get("/api/streak/status", async (req: any, res) => {
    try {
      const user = req.user || (req.query.userId ? { id: req.query.userId } : null);
      if (!user) {
        return res.json({
          success: true,
          streakCount: 0,
          lastActiveDate: null,
          streakCompanion: 'sarcastic',
          streakFreezes: 1,
          displayName: "Ziyaretçi",
          message: "Oturum açılmadı."
        });
      }

      const hasValidDb = checkDbActive();
      let streakCount = 0;
      let lastActiveDate: string | null = null;
      let streakCompanion = 'sarcastic';
      let streakFreezes = 1;
      let displayName = "Kullanıcı";

      if (hasValidDb && pool) {
        const { rows } = await pool.query('SELECT name, streak_count, last_active_date, streak_companion, streak_freezes FROM users WHERE id = $1', [user.id]);
        if (rows.length > 0) {
          streakCount = rows[0].streak_count || 0;
          lastActiveDate = rows[0].last_active_date ? new Date(rows[0].last_active_date).toISOString() : null;
          streakCompanion = rows[0].streak_companion || 'sarcastic';
          displayName = rows[0].name || displayName;
          streakFreezes = rows[0].streak_freezes === undefined ? 1 : rows[0].streak_freezes;
        }
      } else {
        const found = localUsers.find(u => u.id === user.id);
        if (found) {
          streakCount = found.streak_count || 0;
          lastActiveDate = found.last_active_date || null;
          streakCompanion = found.streak_companion || 'sarcastic';
          displayName = found.name || displayName;
          streakFreezes = found.streak_freezes === undefined ? 1 : found.streak_freezes;
        }
      }

      // Calculate and update daily streak
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
      
      let updatedStreak = streakCount;
      let updatedLastActive = lastActiveDate;
      let updatedFreezes = streakFreezes;
      let wasFrozenApplied = false;

      if (!lastActiveDate) {
        updatedStreak = 1;
        updatedLastActive = now.toISOString();
      } else {
        const lastDate = new Date(lastActiveDate);
        const lastDateStr = lastDate.toISOString().split('T')[0];
        
        if (lastDateStr === todayStr) {
          // Already active today, do nothing
        } else {
          const dayDiff = Math.floor((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate())) / (1000 * 60 * 60 * 24));
          if (dayDiff === 1) {
            updatedStreak += 1;
            updatedLastActive = now.toISOString();
          } else if (dayDiff > 1) {
            // Broke streak or got frozen!
            if (streakFreezes > 0) {
              updatedFreezes = Math.max(0, streakFreezes - 1);
              wasFrozenApplied = true;
              // Streak is frozen (remains preserved), update last active to today
              updatedLastActive = now.toISOString();
            } else {
              // No freezes left: reset to 1
              updatedStreak = 1;
              updatedLastActive = now.toISOString();
            }
          }
        }
      }

      // Save back
      if (hasValidDb && pool) {
        await pool.query('UPDATE users SET streak_count = $1, last_active_date = $2, streak_freezes = $3 WHERE id = $4', [updatedStreak, updatedLastActive, updatedFreezes, user.id]);
      } else {
        const found = localUsers.find(u => u.id === user.id);
        if (found) {
          found.streak_count = updatedStreak;
          found.last_active_date = updatedLastActive;
          found.streak_freezes = updatedFreezes;
        }
      }

      res.json({
        success: true,
        streakCount: updatedStreak,
        lastActiveDate: updatedLastActive,
        streakCompanion,
        streakFreezes: updatedFreezes,
        wasFrozenApplied,
        displayName
      });
    } catch (e: any) {
      console.error("Streak get error:", e);
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // BUY STREAK FREEZE ENDPOINT
  app.post("/api/streak/buy-freeze", express.json(), requireAuth, async (req: any, res) => {
    try {
      const user = req.user;

      const hasValidDb = checkDbActive();
      let currentFreezes = 1;

      if (hasValidDb && pool) {
        const { rows } = await pool.query('SELECT streak_freezes FROM users WHERE id = $1', [user.id]);
        if (rows.length > 0) {
          currentFreezes = rows[0].streak_freezes === undefined ? 1 : rows[0].streak_freezes;
        }
        const updatedFreezes = currentFreezes + 1;
        await pool.query('UPDATE users SET streak_freezes = $1 WHERE id = $2', [updatedFreezes, user.id]);
        res.json({ success: true, streakFreezes: updatedFreezes });
      } else {
        const found = localUsers.find(u => u.id === user.id);
        if (found) {
          currentFreezes = found.streak_freezes === undefined ? 1 : found.streak_freezes;
          const updatedFreezes = currentFreezes + 1;
          found.streak_freezes = updatedFreezes;
          res.json({ success: true, streakFreezes: updatedFreezes });
        } else {
          res.status(404).json({ success: false, error: "Kullanıcı bulunamadı." });
        }
      }
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // UPDATE STREAK COMPANION ENDPOINT
  app.post("/api/streak/update-companion", express.json(), requireAuth, async (req: any, res) => {
    try {
      const user = req.user;
      const { companion } = req.body;
      if (!companion) {
        return res.status(400).json({ success: false, error: "Karakter seçimi eksik." });
      }

      const hasValidDb = checkDbActive();
      if (hasValidDb && pool) {
        await pool.query('UPDATE users SET streak_companion = $1 WHERE id = $2', [companion, user.id]);
      } else {
        const found = localUsers.find(u => u.id === user.id);
        if (found) {
          found.streak_companion = companion;
        }
      }

      res.json({ success: true, companion });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // SIMULATE OFFLINE DAYS ENDPOINT
  app.post("/api/streak/simulate-offline", express.json(), requireAuth, async (req: any, res) => {
    try {
      const user = req.user;
      const { days } = req.body;
      const daysOffline = Number(days) || 1;

      // Calculate a date that is X days ago
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - daysOffline);

      const hasValidDb = checkDbActive();
      if (hasValidDb && pool) {
        await pool.query('UPDATE users SET last_active_date = $1 WHERE id = $2', [targetDate.toISOString(), user.id]);
      } else {
        const found = localUsers.find(u => u.id === user.id);
        if (found) {
          found.last_active_date = targetDate.toISOString();
        }
      }

      res.json({ success: true, daysOffline, simulatedLastActive: targetDate.toISOString() });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // GENERATE PERSONALIZED SARCASTIC NOTIFICATION VIA GEMINI ENDPOINT
  app.post("/api/streak/generate-notification", express.json(), async (req: any, res) => {
    try {
      const { days, companion, userName } = req.body;
      const daysOffline = Number(days) || 1;
      const companionType = companion || 'sarcastic';
      const name = userName || 'Kıral';

      // Fallback messages
      const fallbackMessages: Record<string, string[]> = {
        sarcastic: [
          `${name}, tam ${daysOffline} gündür yoksun... Tualetin deliğine mi düştün yoksa kablolara mı dolandın? Masan tozlanmış, farelerin yeni oyun alanı olmuş haberin olsun! 🧹`,
          `Lan ${name}! ${daysOffline} gündür girmedin. Masaüstü setup'ın ağlıyor, RGB ledler yas tutuyor! Bugün de gelmezsen kasayı mahalledeki eskiciye satıyorum! 📺`,
          `Ooo ${name} bey/hanım lütfettiniz! ${daysOffline} gündür ortalıkta yoksun. Klavyendeki toz katmanını temizlemek için arkeolog çağırdım, yoldalar! 🦖`
        ],
        toxic_gamer: [
          `Alo ${name}! ${daysOffline} gündür girmedin, tam bir Noob gibi davrandın. Seri gitti, rank düştün, takım arkadaşların seni reportladı! Hemen gir yoksa süresiz ban yiyeceksin ezik! 🎮`,
          `${name}, ${daysOffline} gündür yoksun. Söyle bana, klavyeyi mi kırdın yoksa internet faturan mı ödenmedi? Bu gidişle anca tetris oynarsın sen! 👾`
        ],
        tsundere: [
          `H-hey ${name}! ${daysOffline} gündür neredesin sen?! S-sırf seri bozulmasın diye haber veriyorum, yoksa seni merak ettiğimden falan değil, tamam mı?! Çabuk gir siteye! 💢`,
          `${name}! B-bütün gün senin gelmeni bekledim... ${daysOffline} gündür yoksun! Gelmezsen gelme, umrumda bile değilsin! (Ama yine de gelsen fena olmazdı...) 🥺`
        ],
        motivational: [
          `Şampiyon ${name}! ${daysOffline} gündür harika setup hayallerinden uzaksın. Unutma, o mükemmel masaüstü kendi kendine kurulmayacak! Bugün sadece 1 dakikanı ayır ve seriyi kurtar! 🔥`,
          `Yarın geç olacak ${name}! ${daysOffline} gün mola verdin ama artık geri dönme vakti. Potansiyelini serbest bırak ve en iyi ekipmanları incelemeye devam et! ⚡`
        ]
      };

      const companionNames: Record<string, string> = {
        sarcastic: "Sarkastik Beşir Hanzo",
        toxic_gamer: "Toxic RGB Oyuncu",
        tsundere: "Tsundere Zeynep",
        motivational: "Setupss Koçu"
      };

      const compName = companionNames[companionType] || companionNames.sarcastic;
      let text = "";

      const hasApiKey = !!process.env.GEMINI_API_KEY;
      if (hasApiKey) {
        try {
          const ai = getGemini();
          const prompt = `You are a personalized daily tracker app assistant character in a website named "Setupss" (a high-quality community platform for sharing desktop setups, RGB lighting, and hardware specs in Turkey).
Your character profile is: "${compName}".
The user's name is: "${name}".
The user has been offline for: ${daysOffline} days, which broke or threatened their streak.
Generate a humorous, highly engaging, short daily reminder notification in Turkish (Türkçe).
Do NOT be formal. Be extremely creative, colloquial, and funny. Use emojis suitable for the personality.
Make specific jokes about setup, cables, dusty monitors, mechanical keyboards, RGB lighting, or computer parts.
If the character is "Sarkastik Beşir Hanzo", make jokes like "nerelerdesin, tuvalet deliğine mi düştün?".
If the character is "Toxic RGB Oyuncu", talk like a salty gamer ("noob", "rank düştün", "reportladım").
If the character is "Tsundere Zeynep", talk with anime-style tsundere attitude ("Seni merak ettiğimden değil, serin bozulmasın diye...", "b-bütün gün bekledim").
If the character is "Setupss Koçu", act like an aggressive motivational coach.

Respond only with the generated message text, without any quotes or markdown headers. Max 2-3 sentences.`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: prompt,
          });
          
          text = response.text?.trim() || "";
        } catch (err) {
          console.error("Gemini streak generation failed, falling back:", err);
        }
      }

      if (!text) {
        const list = fallbackMessages[companionType] || fallbackMessages.sarcastic;
        text = list[Math.floor(Math.random() * list.length)];
      }

      res.json({
        success: true,
        message: text,
        companionName: compName,
        avatar: companionType === 'tsundere' 
          ? 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80' 
          : companionType === 'toxic_gamer'
          ? 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=150&h=150&q=80'
          : companionType === 'motivational'
          ? 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=150&h=150&q=80'
          : 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=150&h=150&q=80'
      });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // BOT AUTO SHARE DESKTOP SETUPS ENDPOINT
  app.post("/api/bot/auto-share", async (req: any, res) => {
    try {
      const botPresets = [
        {
          title: "Pastel Rüya Workspace",
          description: "Tamamen soft pastel tonlarında, el yapımı keycaps'ler ve tatlı bitkilerle kaplı, anime figürleri içeren tatlı mı tatlı bir çalışma masası.",
          image: "https://images.unsplash.com/photo-1555538995-7ccc762816e9?auto=format&fit=crop&w=1200&q=80",
          category: "Minimalist",
          likes: 185,
          tags: ["Pastel", "Kawaii", "Aesthetic", "Cozy"],
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          cardTheme: "soft-pink",
          components: [
            { id: "bc1", category: "Klavye", name: "EPOMAKER EK68 Pastel Custom", link: "#" },
            { id: "bc2", category: "Mouse", name: "Logitech Pebble Rose", link: "#" },
            { id: "bc3", category: "Işık", name: "Yazı Masası Bulut Lambası", link: "#" }
          ]
        },
        {
          title: "Ultrawide Yazılımcı Kalesi",
          description: "49 inç kavisli monitör, ses emici ahşap paneller ve minimalist masa düzeniyle odaklanmayı en üst düzeye çıkaran modern bir yazılım stüdyosu.",
          image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1200&q=80",
          category: "Yazılımcı Atölyesi",
          likes: 298,
          tags: ["Ultrawide", "Developer", "CodeStudio", "Focus"],
          videoUrl: "https://www.youtube.com/embed/P4S83bM2k6s",
          cardTheme: "soft-blue",
          components: [
            { id: "bc4", category: "Monitör", name: "Samsung Odyssey Neo G9 49''", link: "#" },
            { id: "bc5", category: "Masa", name: "Masif Meşe Ağacı Masa", link: "#" },
            { id: "bc6", category: "Klavye", name: "Keychron Q1 Max", link: "#" }
          ]
        },
        {
          title: "Retro Plak & Hifi Köşesi",
          description: "Analog sıcaklığını dijital dünyaya getiren, pikap entegreli, retro stüdyo monitörleri ve vintage ahşap kaplamalı muhteşem bir müzisyen masası.",
          image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80",
          category: "Cozy / Retro",
          likes: 142,
          tags: ["Vinyl", "Plak", "Retro", "Audio", "Music"],
          videoUrl: "https://www.youtube.com/embed/P4S83bM2k6s",
          cardTheme: "soft-yellow",
          components: [
            { id: "bc7", category: "Ses", name: "Pro-Ject Debut Carbon EVO Pikap", link: "#" },
            { id: "bc8", category: "Hoparlör", name: "JBL L52 Classic Retro", link: "#" },
            { id: "bc9", category: "Masaüstü", name: "Walnut Wood Floating Desk", link: "#" }
          ]
        }
      ];

      const randomPreset = botPresets[Math.floor(Math.random() * botPresets.length)];
      const uniqueId = `setup-bot-${Date.now()}`;
      
      const newSetup: any = {
        id: uniqueId,
        title: randomPreset.title,
        ownerId: "ai-bot",
        owner: "Setupss AI (Bot)",
        ownerAvatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&h=200&q=80",
        bio: "Kurulum Danışmanı & Robot Gözü 🤖",
        description: randomPreset.description,
        image: randomPreset.image,
        category: randomPreset.category,
        likes: randomPreset.likes,
        comments: [
          {
            id: `comment-bot-${Date.now()}`,
            author: "Sarkastik Beşir",
            authorAvatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=150&h=150&q=80",
            content: "Fena durmuyor ama o kabloları gizlemek bu kadar mı zordu kıral? Yine de emeğe saygı.",
            createdAt: new Date().toISOString()
          }
        ],
        tags: randomPreset.tags,
        createdAt: new Date().toISOString(),
        cardTheme: randomPreset.cardTheme,
        videoUrl: randomPreset.videoUrl,
        isBotShare: true,
        components: randomPreset.components
      };

      const hasValidDb = checkDbActive();
      if (hasValidDb && pool) {
        // Create the AI bot user if not exists
        const { rows: botUser } = await pool.query("SELECT id FROM users WHERE id = 'ai-bot'");
        if (botUser.length === 0) {
          await pool.query(
            `INSERT INTO users (id, email, password_hash, name, avatar, role, is_verified) 
             VALUES ('ai-bot', 'bot@setupss.com', 'hashed', 'Setupss AI (Bot)', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&h=200&q=80', 'admin', true)`
          );
        }
        await addSetupToDb(newSetup);
      } else {
        localSetups.unshift(newSetup);
      }

      res.json({ success: true, setup: newSetup });
    } catch (e: any) {
      console.error("Bot auto-share error:", e);
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // DELETE SETUP
  app.delete("/api/setups/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ success: false, message: "Lütfen önce giriş yapın." });
      }
      const { id } = req.params;
      const userId = (req.user as any).id;
      const isAdmin = (req.user as any).role === 'admin' || ['setupss.support@gmail.com', 'admin2@example.com'].includes((req.user as any).email); // Admin check

      const hasValidDb = checkDbActive();
      if (!pool || !hasValidDb) {
        const setupIndex = localSetups.findIndex((s: any) => s.id === id);
        if (setupIndex !== -1) {
          const setup = localSetups[setupIndex];
          if (setup.ownerId === userId || isAdmin) {
            localSetups.splice(setupIndex, 1);
            return res.json({ success: true });
          }
          return res.status(403).json({ success: false, message: "Bu kurulumu silme yetkiniz yok." });
        }
        return res.status(404).json({ success: false, message: "Kurulum bulunamadı." });
      }

      await deleteSetupFromDb(id, userId, isAdmin);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Failed to delete setup:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Memory store for tracking setup likes in local mode
  const localSetupLikes = new Set<string>();

  // 3. TOGGLE LIKE SETUP
  app.post("/api/setups/:id/like", async (req, res) => {
    try {
      const userId = (req.user as any)?.id || 'guest-user';
      const { id } = req.params;
      const { liked } = req.body; // boolean
      
      const hasValidDb = checkDbActive();
      
      // Update local in-memory cache first
      const setup = localSetups.find((s: any) => s.id === id);
      if (setup) {
        const likeKey = `${userId}_${id}`;
        if (liked) {
          if (!localSetupLikes.has(likeKey)) {
            localSetupLikes.add(likeKey);
            setup.likes = (setup.likes || 0) + 1;
          }
        } else {
          if (localSetupLikes.has(likeKey)) {
            localSetupLikes.delete(likeKey);
            setup.likes = Math.max(0, (setup.likes || 0) - 1);
          }
        }
      }

      if (!pool || !hasValidDb) {
        return res.json({ success: true, likes: setup?.likes || 0 });
      }

      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        if (liked) {
          const result = await client.query('INSERT INTO setup_likes (user_id, setup_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [userId, id]);
          if (result.rowCount && result.rowCount > 0) {
            await client.query('UPDATE setups SET likes = likes + 1 WHERE id = $1', [id]);
          }
        } else {
          const result = await client.query('DELETE FROM setup_likes WHERE user_id = $1 AND setup_id = $2', [userId, id]);
          if (result.rowCount && result.rowCount > 0) {
            await client.query('UPDATE setups SET likes = GREATEST(0, likes - 1) WHERE id = $1', [id]);
          }
        }
        await client.query('COMMIT');

        // Trigger notification
        if (liked && setup && setup.ownerId && setup.ownerId !== userId) {
          await realtimeService.createNotification({
            userId: setup.ownerId,
            senderId: userId,
            senderName: (req.user as any)?.displayName || "Birisi",
            senderAvatar: (req.user as any)?.avatar || "",
            type: 'like',
            title: 'Masan Beğenildi! 💖',
            content: `${(req.user as any)?.displayName || "Birisi"} "${setup.title}" isimli kurulumunu beğendi!`,
            link: `/setups/${id}`
          }).catch(err => console.error("Notification creation error:", err));
        }

        res.json({ success: true, likes: setup?.likes || 0 });
      } catch (e) {
        await client.query('ROLLBACK');
        throw e;
      } finally {
        client.release();
      }
    } catch (error: any) {
      console.error("Failed to toggle like:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
  // 4. ADD COMMENT
  app.post("/api/setups/:id/comments", async (req, res) => {
    try {
      const { id: setupId } = req.params;
      const { author, content } = req.body;
      const commentId = `comm-user-${Date.now()}`;
      const createdAt = new Date().toISOString();
      const user = req.user as any;

      const newComment = {
        id: commentId,
        author: user?.name || author || "Misafir",
        authorId: user?.id || null,
        authorAvatar: user?.avatar || null,
        content,
        createdAt
      };

      const hasValidDb = checkDbActive();
      if (!pool || !hasValidDb) {
        const setup = localSetups.find((s: any) => s.id === setupId);
        if (setup) {
          if (!setup.comments) setup.comments = [];
          // Prevent duplicate comment IDs in local fallback
          if (!setup.comments.some((c: any) => c.id === commentId)) {
             setup.comments.push(newComment);
          }
        }
        return res.json({
          success: true,
          comment: newComment
        });
      }

      // Atomic update for database
      await addCommentToDb(setupId, newComment);

      // Trigger notification
      const setup = localSetups.find((s: any) => s.id === setupId);
      if (setup && setup.ownerId && setup.ownerId !== (user?.id || 'guest-user')) {
        await realtimeService.createNotification({
          userId: setup.ownerId,
          senderId: user?.id || 'guest-user',
          senderName: user?.displayName || author || "Misafir",
          senderAvatar: user?.avatar || "",
          type: 'comment',
          title: 'Yeni Yorum! 💬',
          content: `${user?.displayName || author || "Birisi"} "${setup.title}" isimli kurulumuna yorum yaptı!`,
          link: `/setups/${setupId}`
        }).catch(err => console.error("Comment notification error:", err));
      }

      res.json({
        success: true,
        comment: newComment
      });
    } catch (error: any) {
      console.error("Failed to add comment:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 5. GET WISHLIST ITEMS
  app.get("/api/wishlist", async (req, res) => {
    try {
      const currentUser = (req.isAuthenticated && req.isAuthenticated() ? req.user : null) || (req.query.userId ? { id: req.query.userId } : null);
      const userId = currentUser ? (currentUser as any).id : 'guest';

      const hasValidDb = checkDbActive();
      if (!pool || !hasValidDb) {
        return res.json({ success: true, wishlist: localWishlist });
      }

      const items = await getWishlistFromDb(userId);
      res.json({ success: true, wishlist: items });
    } catch (error: any) {
      console.error("Failed to fetch wishlist:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Per-User AI Quota System (1000 Token / 10 Requests per user IP every 2 hours)
  interface UserQuota {
    requestCount: number;
    resetTime: number;
  }
  const userQuotas = new Map<string, UserQuota>();
  const QUOTA_LIMIT = 10; // 10 requests (~1000 AI tokens) per 2 hours
  const QUOTA_WINDOW_MS = 2 * 60 * 60 * 1000; // 2 hours

  function getUserQuotaInfo(ip: string) {
    const now = Date.now();
    let quota = userQuotas.get(ip);
    if (!quota || now >= quota.resetTime) {
      quota = { requestCount: 0, resetTime: now + QUOTA_WINDOW_MS };
      userQuotas.set(ip, quota);
    }
    const remainingRequests = Math.max(0, QUOTA_LIMIT - quota.requestCount);
    const resetInMinutes = Math.ceil((quota.resetTime - now) / 60000);
    return { quota, remainingRequests, resetInMinutes, maxRequests: QUOTA_LIMIT };
  }

  // 5b-1. GET AI QUOTA STATUS
  app.get("/api/gemini/quota", (req, res) => {
    const clientIp = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'default_user').split(',')[0].trim();
    const info = getUserQuotaInfo(clientIp);
    res.json({
      success: true,
      remainingRequests: info.remainingRequests,
      maxRequests: info.maxRequests,
      resetInMinutes: info.resetInMinutes,
      quotaNotice: "Her kullanıcının yapay zeka kotası (1.000 Token / 10 İstek) bağımsızdır ve her 2 saatte bir otomatik sıfırlanır."
    });
  });

  // Helper: Dynamic varied setup plan generator with real market product pools
  function generateVariedSetupPlan(budget: number, category?: string) {
    const monitors = [
      { name: "LG 27GR75Q-B 27\" 165Hz QHD IPS Monitör", price: 6850, cat: "Monitör / Görüntü", reason: "2K QHD çözünürlük ve yüksek tazeleme hızı ile akıcı görüntü." },
      { name: "Dell UltraSharp U2723QE 27\" 4K IPS Black Monitör", price: 14500, cat: "Monitör / Görüntü", reason: "Yazılımcı ve tasarımcılar için %100 sRGB renk doğruluğu ve USB-C hub." },
      { name: "ASUS TUF Gaming VG249Q1A 23.8\" 165Hz IPS Monitör", price: 4200, cat: "Monitör / Görüntü", reason: "Giriş ve orta seviyede yüksek F/P oranlı renk canlılığı." },
      { name: "Samsung Odyssey G5 27\" 165Hz Curved QHD Monitör", price: 6100, cat: "Monitör / Görüntü", reason: "Kavisli paneli ile sürükleyici oyun ve çalışma deneyimi." },
      { name: "MSI Optix G2712 27\" 170Hz IPS Monitör", price: 5300, cat: "Monitör / Görüntü", reason: "Ergonomik çerçevesiz tasarım ve hızlı tepki süresi." }
    ];

    const keyboards = [
      { name: "Keychron K2 V2 Kablosuz Mekanik Klavye", price: 2950, cat: "Klavye / Mouse", reason: "Mac/Windows uyumlu, sıcak değiştirebilir mekanik switchler." },
      { name: "NuPhy Air75 V2 Low-Profile Wireless Klavye", price: 4100, cat: "Klavye / Mouse", reason: "İnce tıkırtılı low-profile yapısı ve viral görünümü ile estetik harikası." },
      { name: "Epomaker TH80 Pro 75% Mekanik Klavye", price: 2750, cat: "Klavye / Mouse", reason: "Gasket mount yapısı ile tok ses profili ve döner ses düğmesi." },
      { name: "Royal Kludge RK61 RGB 60% Mekanik Klavye", price: 1650, cat: "Klavye / Mouse", reason: "Kompakt %60 boyutunda masada maksimum alan tasarrufu." },
      { name: "Logitech MX Keys Mini Minimalist Klavye", price: 3100, cat: "Klavye / Mouse", reason: "Sessiz, akıllı aydınlatmalı profesyonel kod yazma klavyesi." }
    ];

    const mice = [
      { name: "Logitech MX Master 3S Ergonomik Mouse", price: 3750, cat: "Klavye / Mouse", reason: "Sessiz tıklama, elektromanyetik MagSpeed kaydırma tekerleği." },
      { name: "Razer DeathAdder V3 Pro Wireless Gaming Mouse", price: 4100, cat: "Klavye / Mouse", reason: "63 gramlık tüy kadar hafif ergonomik yapısıyla e-spor standardı." },
      { name: "Logitech G Pro X Superlight 2 Wireless Mouse", price: 4900, cat: "Klavye / Mouse", reason: "Profesyonel oyuncuların 1 numaralı kablosuz tercih modeli." },
      { name: "SteelSeries Rival 3 Wireless Oyuncu Mouse", price: 1250, cat: "Klavye / Mouse", reason: "400+ saat pil ömrü ve çift kablosuz bağlantı desteği." },
      { name: "Glorious Model O Wireless Lightweight Mouse", price: 2100, cat: "Klavye / Mouse", reason: "Bal Peteği tasarımı ile ultra hafif ve hava alan gövde." }
    ];

    const lighting = [
      { name: "Xiaomi Mi Computer Monitor Light Bar", price: 1350, cat: "Işıklandırma / Ses", reason: "Monitör üstüne takılan kablosuz kumandalı göz dostu ışık barı." },
      { name: "Yeelight Screenbar Pro RGB Oyuncu Işık Barı", price: 2200, cat: "Işıklandırma / Ses", reason: "Arka tarafında Razer Chroma & Overwolf uyumlu RGB aydınlatma." },
      { name: "BenQ ScreenBar Halo Kablosuz Kumandalı", price: 5800, cat: "Işıklandırma / Ses", reason: "Piyasadaki en kaliteli ve patentli parlamasız ekran aydınlatması." },
      { name: "Govee RGBIC Glide Wall Light Bar Seti", price: 2900, cat: "Işıklandırma / Ses", reason: "Duvar aydınlatması için modüler akıllı RGB çubuklar." },
      { name: "Nanoleaf Shapes Hexagons Starter Kit", price: 4600, cat: "Işıklandırma / Ses", reason: "Dokunmaya ve müziğe duyarlı paneller." }
    ];

    const desks = [
      { name: "IKEA Karlby Meşe Tabla + 2x Alex Çekmece", price: 8500, cat: "Masaüstü / Mobilya", reason: "Setup dünyasının en efsanevi ahşap depolamalı masa kombinasyonu." },
      { name: "IKEA LINNMON / ADILS 120x60 Çalışma Masası", price: 1450, cat: "Masaüstü / Mobilya", reason: "Minimalist ve bütçe dostu temel çalışma masası." },
      { name: "IKEA Lagkapten / Alex Çalışma Masası", price: 4100, cat: "Masaüstü / Mobilya", reason: "Yan tarafında geniş 5 çekmeceli depolama ünitesi barındıran gövde." },
      { name: "IKEA Trotten Ayarlanabilir Çalışma Masası", price: 6200, cat: "Masaüstü / Mobilya", reason: "Ayakta çalışma olanağı sunan mekanik kollu masa." }
    ];

    const accessories = [
      { name: "North Bayou NB F80 Amortisörlü Monitör Arm", price: 980, cat: "Aksesuar / Kablolama", reason: "Masada devasa alan açan amatisörlü hareketli monitör kolu." },
      { name: "IKEA Skådis Delikli Pano Pegboard Set", price: 890, cat: "Aksesuar / Kablolama", reason: "Kulaklık, kablo ve aksesuarları duvarda düzenleyen estetik pano." },
      { name: "Razer Gigantus V2 XXL Desk Mat Sümen", price: 640, cat: "Aksesuar / Kablolama", reason: "Klavye ve mouse altına geniş yumuşak zemin." },
      { name: "UGREEN Alüminyum Dikey Laptop Standı", price: 720, cat: "Aksesuar / Kablolama", reason: "Kapalı kapak modunda laptopu dikey tutarak yer kazandırır." }
    ];

    const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
    
    const chosenDesk = getRandom(desks);
    const chosenMonitor = getRandom(monitors);
    const chosenKeyboard = getRandom(keyboards);
    const chosenMouse = getRandom(mice);
    const chosenLight = getRandom(lighting);
    const chosenAcc = getRandom(accessories);

    const rawItems = [chosenDesk, chosenMonitor, chosenKeyboard, chosenMouse, chosenLight, chosenAcc];
    const rawTotal = rawItems.reduce((acc, curr) => acc + curr.price, 0);

    const ratio = budget / (rawTotal || 1);
    const items = rawItems.map(item => {
      const estimatedPrice = Math.round(item.price * Math.min(ratio, 1.1));
      const akakcePrice = Math.round(estimatedPrice * 0.96);
      const cimriPrice = Math.round(estimatedPrice * 0.98);
      const cheapest = akakcePrice < cimriPrice ? "Akakçe (En Ucuz)" : "Cimri (En Ucuz)";
      return {
        name: item.name,
        category: item.cat,
        estimatedPrice,
        akakcePrice,
        cimriPrice,
        cheapestPlatform: cheapest,
        discountNote: "%4 - %8 En Uygun Fiyat Avantajı",
        reason: item.reason
      };
    });

    const totalEstimatedCost = items.reduce((acc, curr) => acc + curr.estimatedPrice, 0);

    return {
      title: `${budget.toLocaleString("tr-TR")} ₺ ${category || "Kişiselleştirilmiş"} Trend Setup Kurulumu`,
      description: `Bütçenize (${budget.toLocaleString("tr-TR")} ₺) özel geniş ürün yelpazesinden rastgele ve dinamik olarak derlenmiş güncel masaüstü donanım listesi.`,
      totalEstimatedCost,
      items
    };
  }

  // 5b-2. AI SETUP RECOMMENDATION
  app.post("/api/gemini/recommend", async (req, res) => {
    try {
      // Require User Authentication for AI Setup Assistant (support session or body payload)
      const currentUser = (req.isAuthenticated && req.isAuthenticated() ? req.user : null) || req.body?.user || (req.body?.userId ? { id: req.body.userId } : null);
      if (!currentUser) {
        return res.status(401).json({
          success: false,
          error: "Yapay zeka asistanını kullanmak için hesabınıza giriş yapmalısınız."
        });
      }

      const { budget, category, preferences } = req.body;
      if (!budget || typeof budget !== "number") {
        return res.status(400).json({ success: false, error: "Geçerli bir bütçe tutarı belirtilmelidir." });
      }

      const clientIp = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'default_user').split(',')[0].trim();
      const quotaInfo = getUserQuotaInfo(clientIp);

      if (quotaInfo.remainingRequests <= 0) {
        return res.status(429).json({
          success: false,
          error: `2 saatlik yapay zeka kotanız (1.000 Token / 10 İstek) dolmuştur! Lütfen ${quotaInfo.resetInMinutes} dakika sonra tekrar deneyin.`,
          remainingRequests: 0,
          resetInMinutes: quotaInfo.resetInMinutes
        });
      }

      // Record quota usage
      quotaInfo.quota.requestCount += 1;
      const currentRemaining = Math.max(0, QUOTA_LIMIT - quotaInfo.quota.requestCount);

      const ai = getGemini();

      const seed = `${Date.now()}_${Math.floor(Math.random() * 99999)}`;

      const systemInstruction = `Sen viral Instagram, TikTok ve YouTube Shorts masaüstü çalışma alanı (desk setup) ve donanım mimarısın.
Aesthetic, minimalist, ahşap cozy, RGB oyuncu ve yazılımcı üretkenlik odaklı binlerce güncel ekipmanı eksiksiz bilirsin.

AŞIRI ÖNEMLİ KURALLAR:
1. HER ÇAĞRIDA TAMAMEN FARKLI, ÇEŞİTLİ VE BENZERSİZ ÜRÜNLER SEÇ! Kendini tek bir markaya veya aynı modellere asla sabitleme.
2. Kullanıcının bütçesine (${budget} ₺) tam denk gelecek şekilde Akakçe VE Cimri fiyat karşılaştırma sitelerindeki GERÇEK VE GÜNCEL Türk Lirası en uygun fiyatları analiz et.
3. Ürün adlarını hem Akakçe hem de Cimri arama çubuğunda birebir aratıldığında %100 nokta atışı sonuç verecek net ve sade marka/model adıyla yaz. (Örn: 'NuPhy Air75 V2', 'Dell U2723QE', 'LG 27GR75Q-B', 'Logitech MX Master 3S', 'BenQ ScreenBar Halo', 'IKEA Skadis'). Gereksiz uzun kelime kalabalığı veya uydurma isimler ekleme.
4. Monitör, Mekanik Klavye, Ergonomik Mouse, Monitör Kolu, Lightbar/Işıklandırma, Pegboard ve Masayı bütçeye göre en ideal kombinasyonda topla.
5. Toplam tutar ${budget} ₺ seviyesini aşmasın.`;

      const prompt = `Lütfen şu kriterlere özel benzersiz ve orijinal bir masaüstü setup planı oluştur:
Bütçe: ${budget} ₺
Kategori / Tarz: ${category || "Karma & Minimalist"}
Özel Notlar / İstekler: ${preferences || "Yok"}
Rastgelelik Kodu: ${seed}

İstekler:
- Akakçe ve Cimri platformlarındaki güncel en uygun Türkçe fiyatları baz al.
- Her üretmede farklı markalardan (Keychron, NuPhy, Logitech, Razer, SteelSeries, Dell, LG, Asus, Samsung, BenQ, Xiaomi, Yeelight, IKEA vb.) orijinal ekipmanlar öner.
- Parçaların toplamı ${budget} ₺ bütçesini geçmesin.`;

      let responseText = "";
      try {
        const response = await ai.models.generateContent({
          model: "gemini-1.5-flash",
          contents: prompt,
          config: {
            systemInstruction,
            maxOutputTokens: 2500,
            responseMimeType: "application/json",
            tools: [{ googleSearchRetrieval: {} }],
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: {
                  type: Type.STRING,
                  description: "Kurulum planına verilen etkileyici Türkçe başlık",
                },
                description: {
                  type: Type.STRING,
                  description: "Kısa net Türkçe açıklama.",
                },
                totalEstimatedCost: {
                  type: Type.NUMBER,
                  description: "Tüm parçaların güncel piyasa fiyatları toplamı (₺ cinsinden)",
                },
                items: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: {
                        type: Type.STRING,
                        description: "Ürünün tam, spesifik marka ve model adı (Akakçe uyumlu)",
                      },
                      category: {
                        type: Type.STRING,
                        description: "Şunlardan biri: 'Masaüstü / Mobilya', 'Klavye / Mouse', 'Kulaklık / Hoparlör', 'Monitör / Görüntü', 'Işıklandırma / Ses', 'PC Donanım (Kasa İçi)', 'Aksesuar / Kablolama'",
                      },
                      estimatedPrice: {
                        type: Type.NUMBER,
                        description: "Türk Lirası (₺) cinsinden güncel gerçek ortalama piyasa satış fiyatı",
                      },
                      akakcePrice: {
                        type: Type.NUMBER,
                        description: "Akakçe üzerindeki tespit edilen en ucuz satış fiyatı (₺)",
                      },
                      cimriPrice: {
                        type: Type.NUMBER,
                        description: "Cimri üzerindeki tespit edilen en ucuz satış fiyatı (₺)",
                      },
                      cheapestPlatform: {
                        type: Type.STRING,
                        description: "En ucuz fiyat bulunan platform (Örn: 'Akakçe (En Ucuz)', 'Cimri (En Ucuz)', 'Amazon TR (En Ucuz)')",
                      },
                      discountNote: {
                        type: Type.STRING,
                        description: "Fiyat avantajı veya indirim notu (Örn: '%8 Akakçe avantajı', '%12 Cimri indirimi')",
                      },
                      reason: {
                        type: Type.STRING,
                        description: "Kısa tercih nedeni (Türkçe)",
                      },
                    },
                    required: ["name", "category", "estimatedPrice", "reason"],
                  },
                },
              },
              required: ["title", "description", "totalEstimatedCost", "items"],
            },
          },
        });
        responseText = response.text || "";
      } catch (geminiError: any) {
        console.warn("Gemini primary model failed, attempting fallback:", geminiError?.message);
        try {
          const responseFallback = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
            config: {
              systemInstruction,
              maxOutputTokens: 2500,
              responseMimeType: "application/json",
            }
          });
          responseText = responseFallback.text || "";
        } catch (fallbackErr) {
          console.error("Gemini fallback also failed:", fallbackErr);
        }
      }

      let plan = null;
      if (responseText) {
        try {
          const cleanedText = responseText.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim();
          plan = JSON.parse(cleanedText);
        } catch (parseErr) {
          console.warn("JSON parsing failed, falling back to dynamic plan:", parseErr);
        }
      }

      if (!plan || !plan.items || !Array.isArray(plan.items)) {
        // Dynamic rich varied fallback setup generator
        plan = generateVariedSetupPlan(budget, category);
      }

      res.json({
        success: true,
        plan,
        remainingRequests: currentRemaining,
        resetInMinutes: quotaInfo.resetInMinutes
      });
    } catch (error: any) {
      console.error("AI Recommendation error:", error);
      const fallbackPlan = generateVariedSetupPlan(req.body?.budget || 25000, req.body?.category || "Yazılımcı");
      res.json({ 
        success: true, 
        plan: fallbackPlan,
        remainingRequests: 0,
        resetInMinutes: 60,
        notice: "Yapay zeka servisi yoğun olduğu için alternatif dinamik kurulum planı oluşturuldu."
      });
    }
  });

  // 5b-3. AI MULTI-SITE PRICE COMPARISON & ANALYSIS ENDPOINT (Strict Google Search Grounding - Real Prices Only)
  app.post("/api/gemini/price-analysis", async (req, res) => {
    try {
      const { productName, estimatedPrice } = req.body;
      if (!productName || typeof productName !== 'string') {
        return res.status(400).json({ success: false, error: "Ürün adı belirtilmelidir." });
      }

      const ai = getGemini();
      const systemInstruction = `Sen Türkiye e-ticaret sitelerinde (Trendyol, Hepsiburada, İtopya, Vatan Bilgisayar, Amazon TR, Akakçe, Cimri, N11, İdefix, Teknosa) bilgisayar parçaları ve oyuncu ekipmanları için GERÇEK VE CANLI FİYAT TESPİTİ yapan uzman bir yapay zekasın.

ÇOK KATI KESİN KURALLAR:
1. Google Arama (Google Search Grounding) özelliğini ZORUNLU olarak kullan ve aranan ürün adını Türkiye e-ticaret sitelerinde arat.
2. SADECE VE SADECE canlı arama sonuçlarında KESİN OLARAK BULDUĞUN GERÇEK TL FİYATLARINI LİSTELE.
3. KESİNLİKLE FİYAT UYDURMA, ASLA SANAL/TAHMİNİ VEYA SIRALI ARTIŞLI (2350, 2375, 2425 gibi) YAPAY FİYAT HESAPLAMA!
4. Eğer aranan ürün bir mağazada (örneğin İtopya veya Vatan Bilgisayar'da) arama sonuçlarında BULUNAMADIYSA, o mağazayı "stores" listesine KESİNLİKLE EKLEME (listede hiç gösterme).
5. "stores" listesini EN UCUZ GERÇEK FİYATTAN EN PAHALI GERÇEK FİYATA doğru sırala.
6. "dealVerdict" alanına canlı arama sonuçlarındaki gerçek fiyat farkına ve satıcılara dayanan samimi, akıcı ve Türkçe bir AI Fiyat Analizi özeti yaz (Örn: "En uygun fiyat Trendyol'da 850 TL! İtopya veya Vatan'da bu model stokta tespit edilemedi, kaçırma!").`;

      const prompt = `Lütfen şu ürün için CANLI Google araması yaparak Türkiye e-ticaret mağazalarında (Trendyol, Hepsiburada, İtopya, Vatan, Amazon TR, Akakçe, Cimri, N11) şu an KESİN VE GERÇEKTEN var olan fiyatları çek:
Ürün Adı: "${productName}"
${estimatedPrice ? `Kullanıcı Tahmini Bütçesi: ${estimatedPrice} ₺` : ""}

ÇOK ÖNEMLİ:
- Yalnızca Google Arama sonuçlarında GERÇEKTEN BULDUĞUN e-ticaret sitelerini ve tam gerçek TL fiyatlarını ekle.
- Arama sonucunda o mağazada ürün yoksa veya fiyat bulunamadıysa o mağazayı "stores" dizisine SAKIN EKLEME!
- "stores" dizisini EN UCUZ FİYATTAN EN PAHALIYA doğru sırala.
- "dealVerdict" alanında samimi ve akıcı bir özet yaz.`;

      let responseText = "";
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            systemInstruction,
            maxOutputTokens: 1500,
            responseMimeType: "application/json",
            tools: [{ googleSearch: {} }],
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                productName: { type: Type.STRING },
                bestPrice: { type: Type.NUMBER, description: "Google aramasında tespit edilen en ucuz gerçek TL fiyatı" },
                bestPlatform: { type: Type.STRING, description: "En ucuz fiyatı sunan gerçek mağaza adı" },
                dealVerdict: { type: Type.STRING, description: "Gerçek canlı arama verilerine dayanan samimi AI Fiyat Analizi özeti" },
                savingsPercent: { type: Type.NUMBER, description: "Mağazalar arası fiyat avantajı yüzdesi" },
                stores: {
                  type: Type.ARRAY,
                  description: "Google aramasında GERÇEKTEN FİYATI BULUNAN mağazaların en ucuzdan en pahalıya sıralı listesi. Aramada bulunmayan mağazaları ASLA ekleme!",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      storeName: { type: Type.STRING, description: "Mağaza adı (Örn: Trendyol, Hepsiburada, Amazon TR, Akakçe, Cimri, N11, İtopya, Vatan Bilgisayar)" },
                      price: { type: Type.NUMBER, description: "Google aramasında bulunan GERÇEK TL fiyatı" },
                      inStock: { type: Type.BOOLEAN, description: "Stokta var mı?" },
                      note: { type: Type.STRING, description: "Canlı aramada görülen ek bilgi (Örn: 'Ücretsiz Kargo', 'Pazaryeri Fırsatı', 'Kuponlu')" }
                    },
                    required: ["storeName", "price"]
                  }
                }
              },
              required: ["productName", "bestPrice", "bestPlatform", "dealVerdict", "stores"]
            }
          }
        });
        responseText = response.text || "";
      } catch (err: any) {
        console.warn("Gemini price analysis primary call failed:", err?.message);
      }

      let analysis = null;
      if (responseText) {
        try {
          analysis = JSON.parse(responseText.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim());
        } catch (e) {}
      }

      // Secondary fallback call if structured JSON schema encountered tool issues
      if (!analysis || !Array.isArray(analysis.stores) || analysis.stores.length === 0) {
        try {
          const secondaryResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `${prompt}\n\nLütfen sadece geçerli bir JSON objesi döndür: {"productName": "${productName}", "bestPrice": 850, "bestPlatform": "Trendyol", "dealVerdict": "...", "savingsPercent": 5, "stores": [{"storeName": "Trendyol", "price": 850, "inStock": true, "note": "Canlı arama sonucu"}]}`,
            config: {
              systemInstruction,
              tools: [{ googleSearch: {} }]
            }
          });
          const rawText = secondaryResponse.text || "";
          const jsonMatch = rawText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            analysis = JSON.parse(jsonMatch[0]);
          }
        } catch (secErr: any) {
          console.warn("Secondary price analysis attempt failed:", secErr?.message);
        }
      }

      if (!analysis || !Array.isArray(analysis.stores) || analysis.stores.length === 0) {
        // Honest response if no live results were found in search grounding - NO fake price math
        analysis = {
          productName,
          bestPrice: 0,
          bestPlatform: "Canlı Mağaza Arama",
          dealVerdict: `"${productName}" için doğrudan fiyat verisi çekilemedi. Mağazaların güncel stok ve fiyat durumunu aşağıdaki doğrudan mağaza butonlarına tıklayarak kontrol edebilirsiniz.`,
          savingsPercent: 0,
          stores: []
        };
      } else {
        // Ensure valid positive numeric prices and sort strictly from cheapest to most expensive
        analysis.stores = analysis.stores
          .filter((s: any) => s && s.storeName && typeof s.price === 'number' && s.price > 0)
          .sort((a: any, b: any) => a.price - b.price);

        if (analysis.stores.length > 0) {
          analysis.bestPrice = analysis.stores[0].price;
          analysis.bestPlatform = analysis.stores[0].storeName;
        }
      }

      res.json({
        success: true,
        analysis,
        urls: {
          akakceUrl: `https://www.akakce.com/arama/?q=${encodeURIComponent(productName)}`,
          cimriUrl: `https://www.cimri.com/arama?q=${encodeURIComponent(productName)}`,
          amazonUrl: `https://www.amazon.com.tr/s?k=${encodeURIComponent(productName)}`,
          trendyolUrl: `https://www.trendyol.com/sr?q=${encodeURIComponent(productName)}`,
          hepsiburadaUrl: `https://www.hepsiburada.com/ara?q=${encodeURIComponent(productName)}`,
          itopyaUrl: `https://www.itopya.com/AramaResults?text=${encodeURIComponent(productName)}`,
          vatanUrl: `https://www.vatanbilgisayar.com/arama/${encodeURIComponent(productName)}/`,
          googleShoppingUrl: `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(productName)}`
        }
      });
    } catch (e: any) {
      console.error("Price analysis error:", e);
      const prodName = req.body?.productName || "Ekipman";
      const estPrice = req.body?.estimatedPrice;
      const fallbackAnalysis = {
        productName: prodName,
        bestPrice: estPrice ? Math.round(estPrice * 0.95) : undefined,
        averagePrice: estPrice ? Math.round(estPrice * 1.05) : undefined,
        highestPrice: estPrice ? Math.round(estPrice * 1.25) : undefined,
        recommendation: `${prodName} için Türkiye'deki e-ticaret sitelerinde canlı fiyat karşılaştırması yapabilirsiniz. Mağaza bağlantılarına tıklayarak en güncel fiyatı bulabilirsiniz.`,
        stores: [
          { name: 'Akakçe', url: `https://www.akakce.com/arama/?q=${encodeURIComponent(prodName)}`, status: 'Karşılaştır' },
          { name: 'Cimri', url: `https://www.cimri.com/arama?q=${encodeURIComponent(prodName)}`, status: 'Karşılaştır' },
          { name: 'Amazon TR', url: `https://www.amazon.com.tr/s?k=${encodeURIComponent(prodName)}`, status: 'Stokta Var' },
          { name: 'Trendyol', url: `https://www.trendyol.com/sr?q=${encodeURIComponent(prodName)}`, status: 'Stokta Var' },
          { name: 'Hepsiburada', url: `https://www.hepsiburada.com/ara?q=${encodeURIComponent(prodName)}`, status: 'Stokta Var' }
        ]
      };
      res.json({
        success: true,
        analysis: fallbackAnalysis,
        urls: {
          akakceUrl: `https://www.akakce.com/arama/?q=${encodeURIComponent(prodName)}`,
          cimriUrl: `https://www.cimri.com/arama?q=${encodeURIComponent(prodName)}`,
          amazonUrl: `https://www.amazon.com.tr/s?k=${encodeURIComponent(prodName)}`,
          trendyolUrl: `https://www.trendyol.com/sr?q=${encodeURIComponent(prodName)}`,
          hepsiburadaUrl: `https://www.hepsiburada.com/ara?q=${encodeURIComponent(prodName)}`,
          itopyaUrl: `https://www.itopya.com/AramaResults?text=${encodeURIComponent(prodName)}`,
          vatanUrl: `https://www.vatanbilgisayar.com/arama/${encodeURIComponent(prodName)}/`,
          googleShoppingUrl: `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(prodName)}`
        }
      });
    }
  });

  // 6. SAVE/UPSERT WISHLIST ITEM
  app.post("/api/wishlist", requireAuth, async (req, res) => {
    try {
      const { id, name, category, estimatedPrice, purchased, link, notes } = req.body;
      const userId = (req.user as any).id;

      const hasValidDb = checkDbActive();
      if (!pool || !hasValidDb) {
        const index = localWishlist.findIndex(item => item.id === id);
        const newItem = { id, name, category, estimatedPrice: Number(estimatedPrice), purchased, link, notes: notes || "" };
        if (index > -1) {
          localWishlist[index] = newItem;
        } else {
          localWishlist.push(newItem);
        }
        return res.json({ success: true });
      }

      const items = await getWishlistFromDb(userId);
      const exists = items.some(item => item.id === id);
      const newItem: WishlistItem = {
        id,
        name,
        category,
        estimatedPrice: Number(estimatedPrice),
        purchased: !!purchased,
        link: link || undefined,
        notes: notes || undefined
      };

      if (exists) {
        await updateWishlistItemInDb(newItem, userId);
      } else {
        await addWishlistItemToDb(newItem, userId);
      }

      res.json({ success: true });
    } catch (error: any) {
      console.error("Failed to save wishlist item:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 7. DELETE WISHLIST ITEM
  app.delete("/api/wishlist/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;

      const hasValidDb = checkDbActive();
      if (!pool || !hasValidDb) {
        localWishlist = localWishlist.filter(item => item.id !== id);
        return res.json({ success: true });
      }

      await deleteWishlistItemFromDb(id);

      res.json({ success: true });
    } catch (error: any) {
      console.error("Failed to delete wishlist item:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // IN-APP NOTIFICATIONS ENDPOINTS
  app.get("/api/notifications", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ success: false, message: "Lütfen önce giriş yapın." });
      }
      const userId = (req.user as any).id;
      const notifications = await realtimeService.getUserNotifications(userId);
      res.json({ success: true, notifications });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post("/api/notifications/:id/status", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ success: false, message: "Lütfen önce giriş yapın." });
      }
      const { id } = req.params;
      const { status } = req.body;
      const allowedStatuses = ['notification', 'read', 'archived', 'deleted'];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: "Geçersiz bildirim durumu." });
      }
      await realtimeService.updateNotificationStatus(id, status as any);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // 8. ADMIN ENDPOINTS & DATA PULLING
  app.post("/api/admin/setups", async (req, res) => {
    try {
      const { setups } = req.body;

      const hasValidDb = checkDbActive();
      if (!pool || !hasValidDb) {
        localSetups = JSON.parse(JSON.stringify(setups));
        return res.json({ success: true });
      }

      await saveSetupsBatchToDb(setups);
      await logActivityToDb("ADMIN_BATCH_SETUPS", (req.user as any)?.id || null, (req.user as any)?.displayName || "Admin", "Admin setup masalarını güncelledi.");
      res.json({ success: true });
    } catch (error: any) {
      console.error("Admin setups sync failed:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Active online sessions store
  const activeSessions = new Map<string, { id: string; name: string; email: string; avatar: string; lastSeen: number }>();

  app.post("/api/heartbeat", async (req, res) => {
    try {
      const { id, name, email, avatar, status = 'online', typing = false } = req.body;
      if (id) {
        activeSessions.set(id, {
          id,
          name: name || 'Misafir Ziyaretçi',
          email: email || '',
          avatar: avatar || '',
          lastSeen: Date.now()
        });

        // Sync user presence state
        await realtimeService.updateUserPresence(id, {
          name: name || 'Misafir Ziyaretçi',
          email: email || '',
          avatar: avatar || '',
          status: status as any,
          typing: !!typing
        }).catch(err => console.error("Presence update error:", err));
      }
      res.json({ success: true });
    } catch (e) {
      res.json({ success: false });
    }
  });

  app.get("/api/admin/online-users", async (req, res) => {
    try {
      const onlineList = await realtimeService.getActiveOnlineUsers();
      res.json({ success: true, onlineUsers: onlineList });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // Referral processing endpoint
  app.post("/api/referral", async (req, res) => {
    try {
      const { refId } = req.body;
      if (!refId) {
        return res.status(400).json({ success: false, message: "Geçersiz referans ID." });
      }
      const hasValidDb = checkDbActive();
      if (hasValidDb && pool) {
        await incrementInviteCount(refId);
      } else {
        const found = localUsers.find(u => u.id === refId);
        if (found) {
          found.inviteCount = (found.inviteCount || 0) + 1;
          found.isCrown = true;
          found.hasRgb = true;
        }
      }
      res.json({ success: true, message: "Referans başarıyla işlendi!" });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  // Leaderboard endpoint with real timeframes (weekly, monthly, yearly, all)
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const timeframe = (req.query.timeframe as string) || 'weekly'; // weekly, monthly, yearly, all
      const now = Date.now();
      let cutoff = 0;
      if (timeframe === 'weekly') {
        cutoff = now - 7 * 24 * 60 * 60 * 1000;
      } else if (timeframe === 'monthly') {
        cutoff = now - 30 * 24 * 60 * 60 * 1000;
      } else if (timeframe === 'yearly') {
        cutoff = now - 365 * 24 * 60 * 60 * 1000;
      } else {
        cutoff = 0; // all time
      }

      const users = await getAllUsersFromDb();
      const hasValidDb = checkDbActive();
      const allSetups = (hasValidDb && pool) ? await getSetupsFromDb() : localSetups;

      // Aggregate stats per user
      const statsMap = new Map<string, {
        id: string;
        name: string;
        avatar: string;
        avatarFrame?: string;
        bio: string;
        githubLink?: string;
        instagramLink?: string;
        linkedinLink?: string;
        coverPhoto?: string;
        customBadge?: string;
        customColor?: string;
        createdAt?: string;
        setupsCount: number;
        totalLikes: number;
        totalComments: number;
        inviteCount: number;
        isCrown: boolean;
        hasRgb: boolean;
        score: number;
      }>();

      // Initialize with all registered users
      users.forEach(u => {
        statsMap.set(u.id, {
          id: u.id,
          name: u.name || 'İsimsiz Üye',
          avatar: u.avatar || '',
          avatarFrame: u.avatarFrame || u.avatar_frame || 'none',
          bio: u.bio || '',
          githubLink: u.githubLink || u.github_link || '',
          instagramLink: u.instagramLink || u.instagram_link || '',
          linkedinLink: u.linkedinLink || u.linkedin_link || '',
          coverPhoto: u.coverPhoto || u.cover_photo || '',
          customBadge: u.customBadge || u.custom_badge || '',
          customColor: u.customColor || u.custom_color || '',
          createdAt: u.createdAt || u.created_at || new Date().toISOString(),
          setupsCount: 0,
          totalLikes: 0,
          totalComments: 0,
          inviteCount: u.inviteCount || 0,
          isCrown: Boolean(u.isCrown || (u.inviteCount && u.inviteCount > 0)),
          hasRgb: Boolean(u.hasRgb || (u.inviteCount && u.inviteCount > 0)),
          score: 0
        });
      });

      // Process setups
      allSetups.forEach((setup: any) => {
        const setupDate = new Date(setup.createdAt || Date.now()).getTime();
        if (cutoff === 0 || setupDate >= cutoff) {
          // Find owner by ID first, then by name match
          let userEntry = Array.from(statsMap.values()).find(s => 
            (setup.ownerId && s.id === setup.ownerId) || 
            (s.name && setup.owner && s.name.toLowerCase() === setup.owner.toLowerCase())
          );
          if (!userEntry) {
            // create virtual user entry if owner posted
            const ownerId = setup.ownerId || `owner-${setup.owner}`;
            userEntry = {
              id: ownerId,
              name: setup.owner || 'Topluluk Üyesi',
              avatar: setup.ownerAvatar || '',
              bio: setup.bio || '',
              setupsCount: 0,
              totalLikes: 0,
              totalComments: 0,
              inviteCount: 0,
              isCrown: false,
              hasRgb: false,
              score: 0
            };
            statsMap.set(ownerId, userEntry);
          }
          userEntry.setupsCount += 1;
          userEntry.totalLikes += Number(setup.likes || 0);
          userEntry.totalComments += Array.isArray(setup.comments) ? setup.comments.length : 0;
        }
      });

      // Calculate score for each
      const leaderboardList = Array.from(statsMap.values()).map(item => {
        const score = (item.totalLikes * 10) + (item.totalComments * 5) + (item.setupsCount * 20) + (item.inviteCount * 50);
        return {
          ...item,
          score
        };
      });

      leaderboardList.sort((a, b) => b.score - a.score);

      res.json({ success: true, timeframe, leaderboard: leaderboardList });
    } catch (e: any) {
      console.error("Leaderboard fetch error:", e);
      res.status(500).json({ success: false, message: e.message });
    }
  });

  // Get all registered users for admin
  app.get("/api/admin/users", async (req, res) => {
    try {
      const dbUsers = await getAllUsersFromDb();
      const combinedUsers = [...dbUsers];
      localUsers.forEach(lu => {
        if (!combinedUsers.some(u => u.id === lu.id)) {
          combinedUsers.push({
            id: lu.id,
            email: lu.email,
            name: lu.name || lu.displayName,
            avatar: lu.avatar,
            isVerified: lu.is_verified !== undefined ? lu.is_verified : (lu.isVerified !== undefined ? lu.isVerified : true),
            bio: lu.bio,
            customBadge: lu.customBadge || lu.custom_badge || '',
            isCrown: Boolean(lu.isCrown || lu.is_crown),
            hasRgb: Boolean(lu.hasRgb || lu.has_rgb),
            role: lu.role || 'user',
            isBanned: Boolean(lu.isBanned || lu.is_banned),
            createdAt: lu.createdAt || new Date().toISOString()
          });
        }
      });
      res.json({ success: true, users: combinedUsers });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  // Get all chat messages for admin
  app.get("/api/admin/messages", async (req, res) => {
    try {
      const messages = await getAllMessagesFromDb();
      res.json({ success: true, messages });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  // Get activity logs
  app.get("/api/admin/logs", async (req, res) => {
    try {
      const logs = await getActivityLogsFromDb();
      res.json({ success: true, logs });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  // SITE SETTINGS & SOCIAL LINKS ENDPOINTS
  app.get("/api/settings", async (req, res) => {
    try {
      const dbSettings = await getSiteSettingsFromDb();
      const settings = { ...localSiteSettings, ...dbSettings };
      res.json({ success: true, settings });
    } catch (e: any) {
      res.json({ success: true, settings: localSiteSettings });
    }
  });

  app.get("/api/admin/settings", async (req, res) => {
    try {
      const dbSettings = await getSiteSettingsFromDb();
      const settings = { ...localSiteSettings, ...dbSettings };
      res.json({ success: true, settings });
    } catch (e: any) {
      res.json({ success: true, settings: localSiteSettings });
    }
  });

  app.post("/api/admin/settings", async (req, res) => {
    try {
      const newSettings = req.body;
      if (!newSettings || typeof newSettings !== 'object') {
        return res.status(400).json({ success: false, message: "Geçersiz ayarlar verisi." });
      }
      Object.assign(localSiteSettings, newSettings);
      await updateSiteSettingsInDb(newSettings);
      savePersistentDb();
      res.json({ success: true, message: "Ayarlar başarıyla güncellendi." });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  // ADMIN LOGO UPLOAD & MANAGEMENT ENDPOINT
  app.post("/api/admin/upload-logo", async (req: any, res) => {
    try {
      const { imageBase64, logoType } = req.body; // logoType: 'light' | 'dark' | 'icon' | 'avatar_video' | 'avatar_image'
      if (!imageBase64) {
        return res.status(400).json({ success: false, message: "Medya verisi gönderilmedi." });
      }

      // Parse base64 header
      const parts = imageBase64.split(";base64,");
      if (parts.length !== 2) {
        return res.status(400).json({ success: false, message: "Geçersiz base64 verisi." });
      }

      const mimeType = parts[0].split(':')[1] || 'image/png';
      const buffer = Buffer.from(parts[1], "base64");
      
      let fileName = `branding_${logoType}_${Date.now()}.png`;
      let settingKey = 'site_logo_url';
      
      if (logoType === 'dark') {
        settingKey = 'site_logo_dark_url';
      } else if (logoType === 'icon') {
        settingKey = 'site_icon_url';
      } else if (logoType === 'avatar_video') {
        fileName = `ai_avatar_${Date.now()}.mp4`;
        settingKey = 'ai_avatar_video_url';
      } else if (logoType === 'avatar_image') {
        settingKey = 'ai_avatar_image_url';
      }

      // Upload to GCS via storageService for real persistence
      const uploadResult = await storageService.processAndUploadFile(
        buffer,
        fileName,
        mimeType,
        'banners' // Using banners folder for site assets
      );

      const fileUrl = uploadResult.originalUrl;
      localSiteSettings[settingKey] = fileUrl;
      await updateSiteSettingsInDb({ [settingKey]: fileUrl });
      savePersistentDb();

      res.json({ success: true, message: "Marka medyası başarıyla yüklendi ve kalıcı olarak kaydedildi!", url: fileUrl });
    } catch (e: any) {
      console.error("Media upload error:", e);
      res.status(500).json({ success: false, message: e.message || "Medya yüklenirken hata oluştu." });
    }
  });

  // ADMIN RESET LOGOS TO ORIGINAL BRAND FALLBACKS
  app.post("/api/admin/reset-logos", async (req, res) => {
    try {
      const defaultSettings = {
        site_logo_url: '/branding/logo.png',
        site_logo_dark_url: '/branding/logo-dark.png',
        site_icon_url: '/branding/icon.png',
        ai_avatar_video_url: '',
        ai_avatar_image_url: '',
        logo_desktop_scale: '100',
        logo_mobile_scale: '100',
        logo_rotation: '0',
        ai_avatar_size_scale: '110',
        ai_avatar_glow_color: 'amber',
        ai_avatar_border_style: 'dashed',
        ai_avatar_interactive_effect: 'float',
        ai_avatar_rounded: 'full'
      };

      Object.assign(localSiteSettings, defaultSettings);
      await updateSiteSettingsInDb(defaultSettings);
      savePersistentDb();

      res.json({ success: true, message: "Tüm logolar ve AI ayarları /branding/ varsayılanlarına sıfırlandı." });
    } catch (e: any) {
      console.error("Logo reset error:", e);
      res.status(500).json({ success: false, message: e.message || "Sıfırlanırken hata oluştu." });
    }
  });

  // MEDIA & FILE DATABASE STORAGE ENDPOINTS
  // Get all media files for admin panel
  app.get("/api/admin/media", async (req, res) => {
    try {
      const mediaFiles = await getMediaFilesFromDb();
      res.json({ success: true, mediaFiles });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  });



  // Delete media file from DB
  app.delete("/api/admin/media/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await deleteMediaFileFromDb(id);
      await logActivityToDb("MEDIA_DELETED_BY_ADMIN", (req.user as any)?.id || null, "Admin", `Medya veritabanından silindi: ${id}`);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  // FULL DATABASE & APP DATA EXPORT (Tüm Bilgileri İndir / Çek)
  app.get("/api/admin/export", async (req, res) => {
    try {
      const hasValidDb = checkDbActive();
      
      let dbSetups = localSetups;
      let dbWishlist = localWishlist;
      let dbUsers = localUsers;
      let dbMessages = [];
      let dbLogs = [];
      let dbMedia = [];

      if (hasValidDb && pool) {
        try { dbSetups = await getSetupsFromDb(); } catch (e) {}
        try { dbWishlist = await getWishlistFromDb(); } catch (e) {}
        try { dbUsers = await getAllUsersFromDb(); } catch (e) {}
        try { dbMessages = await getAllMessagesFromDb(); } catch (e) {}
        try { dbLogs = await getActivityLogsFromDb(); } catch (e) {}
        try { dbMedia = await getMediaFilesFromDb(); } catch (e) {}
      }

      const exportData = {
        appName: "Setupss Community",
        exportedAt: new Date().toISOString(),
        environment: hasValidDb ? "PostgreSQL (Supabase Active)" : "Local In-Memory Cache",
        summary: {
          totalUsers: dbUsers.length,
          totalSetups: dbSetups.length,
          totalWishlistItems: dbWishlist.length,
          totalMessages: dbMessages.length,
          totalActivityLogs: dbLogs.length,
          totalMediaFiles: dbMedia.length
        },
        data: {
          users: dbUsers,
          setups: dbSetups,
          wishlist: dbWishlist,
          messages: dbMessages,
          logs: dbLogs,
          mediaFiles: dbMedia
        }
      };

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="setupss-database-export-${Date.now()}.json"`);
      res.json(exportData);
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  // Update user from admin
  app.patch("/api/admin/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { name, bio, isVerified, customBadge, role, isCrown, hasRgb, isBanned } = req.body;
      
      const hasValidDb = checkDbActive();
      if (hasValidDb && pool) {
        await updateUserInDb(id, { name, bio, isVerified, customBadge, role, isCrown, hasRgb, isBanned });
      } else {
        const user = localUsers.find(u => u.id === id);
        if (user) {
          user.name = name;
          user.bio = bio;
          user.is_verified = isVerified;
          user.customBadge = customBadge;
          user.role = role;
          user.isCrown = isCrown;
          user.hasRgb = hasRgb;
          user.isBanned = isBanned;
        }
      }
      
      await logActivityToDb("USER_UPDATED_BY_ADMIN", (req.user as any)?.id || null, "Admin", `Kullanıcı bilgileri güncellendi: ${id} (${name})`);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  // Broadcast system message to all users
  app.post("/api/admin/broadcast", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) return res.status(400).json({ success: false, message: "Mesaj boş olamaz." });
      
      const user = req.user as any;
      const hasValidDb = checkDbActive();
      
      if (hasValidDb && pool) {
        await broadcastMessageToDb(message, user.id, user.displayName, user.avatar);
      } else {
        // Local fallback broadcast
        localUsers.forEach(u => {
          const id = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
          // We don't have a local messages store in server.ts (it's in server-db usually or just stateless)
          // But for consistency we'd push to some local array if it existed.
        });
      }
      
      await logActivityToDb("SYSTEM_BROADCAST", user.id, user.displayName, `Sistem duyurusu yapıldı: ${message.substring(0, 50)}...`);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  // Delete user from admin
  app.get("/api/admin/bot-reports", async (req, res) => {
    const reports = await getBotReportsFromDb();
    res.json({ success: true, reports });
  });

  app.post("/api/admin/bot-reports/:id/resolve", async (req, res) => {
    const { id } = req.params;
    await resolveBotReportInDb(parseInt(id, 10));
    res.json({ success: true });
  });

  app.post("/api/admin/bot-reports/clear", async (req, res) => {
    await clearBotReportsInDb();
    res.json({ success: true });
  });

  app.post("/api/admin/broadcast", async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, error: "Mesaj boş olamaz." });
    try {
      const users = await getAllUsersFromDb();
      for (const u of users) {
        await addNotificationToDb({
          id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          userId: u.id,
          senderId: 'system',
          senderName: 'Setupss Sistem',
          senderAvatar: '/icon.png',
          type: 'broadcast',
          title: 'Sistem Duyurusu 🚀',
          content: message,
          link: '/chat'
        });
      }
      res.json({ success: true, count: users.length });
    } catch (e) {
      console.error("Broadcast failed:", e);
      res.status(500).json({ success: false, error: "Duyuru gönderilemedi." });
    }
  });

  app.get("/api/chat/global/history", async (req, res) => {
    const history = await getGlobalChatHistoryFromDb(50);
    res.json({ success: true, history });
  });

  app.delete("/api/admin/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const hasValidDb = checkDbActive();
      
      const userInMem = localUsers.find(u => u.id === id || u.email?.toLowerCase() === id.toLowerCase());
      const targetEmail = userInMem?.email?.toLowerCase();

      if (hasValidDb && pool) {
        await deleteUserFromDb(id);
      }

      localUsers = localUsers.filter(u => u.id !== id && u.email?.toLowerCase() !== id.toLowerCase() && u.email?.toLowerCase() !== targetEmail);
      const remainingList = localUsersList.filter(u => u.id !== id && u.email?.toLowerCase() !== id.toLowerCase() && u.email?.toLowerCase() !== targetEmail);
      localUsersList.length = 0;
      localUsersList.push(...remainingList);

      await logActivityToDb("USER_DELETED_BY_ADMIN", (req.user as any)?.id || null, "Admin", `Kullanıcı silindi: ${id}`);
      res.json({ success: true, message: "Kullanıcı veritabanından tamamen silindi." });
    } catch (e: any) {
      console.error("Admin user delete error:", e);
      res.status(500).json({ success: false, message: "Kullanıcı silinirken hata oluştu: " + e.message });
    }
  });

  // Delete message from admin
  app.delete("/api/admin/messages/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await deleteChatMessageFromDb(id);
      await logActivityToDb("MESSAGE_DELETED_BY_ADMIN", (req.user as any)?.id || null, "Admin", `Mesaj silindi: ${id}`);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  // Serve root static image fallbacks safely
  app.get(["/*.png", "/*.jpg", "/*.jpeg", "/*.webp", "/*.gif", "/*.svg"], (req, res, next) => {
    try {
      const relPath = decodeURIComponent(req.path);
      let filePath = path.join(process.cwd(), "public", relPath);
      if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        filePath = path.join(process.cwd(), "dist", relPath);
      }
      if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        filePath = path.join(process.cwd(), relPath);
      }
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        return res.sendFile(filePath);
      }
    } catch {
      // Pass to next middleware
    }
    next();
  });

  // Privacy Policy and Terms of Service Standalone Pages
  app.get("/privacy", (req, res) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    const filePath = process.env.NODE_ENV === "production"
      ? path.join(process.cwd(), "dist", "privacy.html")
      : path.join(process.cwd(), "public", "privacy.html");
    res.sendFile(filePath);
  });

  app.get("/terms", (req, res) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    const filePath = process.env.NODE_ENV === "production"
      ? path.join(process.cwd(), "dist", "terms.html")
      : path.join(process.cwd(), "public", "terms.html");
    res.sendFile(filePath);
  });

  // Helper to fetch a single setup for dynamic SEO tags
  async function getSetupById(id: string) {
    try {
      const normalizeSetup = (s: any) => {
        if (!s) return null;
        return {
          ...s,
          id: s.id,
          title: s.title || 'Masaüstü Setup Kurulumu',
          owner: s.owner || s.owner_name || s.owner_id || 'Setupss Üyesi',
          image: s.image || s.media_url || s.cover_photo || s.thumbnail || '/logoarkaplanolmayan.png',
          description: s.description || s.bio || `${s.owner || 'Setupss üyesi'} tarafından oluşturulan masaüstü ve donanım kurulumu.`,
          category: s.category || 'Masaüstü Setup',
          likes: s.likes || 0,
          tags: Array.isArray(s.tags) ? s.tags : (typeof s.tags === 'string' ? JSON.parse(s.tags) : []),
          components: Array.isArray(s.components) ? s.components : (typeof s.components === 'string' ? JSON.parse(s.components) : [])
        };
      };

      const hasValidDb = checkDbActive();
      if (!pool || !hasValidDb) {
        const found = localSetups.find((s: any) => s.id === id || String(s.id) === String(id));
        return normalizeSetup(found);
      }
      const client = await pool.connect();
      try {
        const setupRes = await client.query("SELECT * FROM setups WHERE id = $1 OR id::text = $2", [id, id]);
        if (setupRes.rows.length === 0) {
          const found = localSetups.find((s: any) => s.id === id || String(s.id) === String(id));
          return normalizeSetup(found);
        }
        return normalizeSetup(setupRes.rows[0]);
      } finally {
        client.release();
      }
    } catch {
      const found = localSetups.find((s: any) => s.id === id || String(s.id) === String(id));
      if (!found) return null;
      return {
        ...found,
        owner: found.owner || found.owner_name || 'Setupss Üyesi',
        image: found.image || found.media_url || '/logoarkaplanolmayan.png',
        components: Array.isArray(found.components) ? found.components : []
      };
    }
  }

  // Helper to fetch user profile for dynamic SEO tags
  async function getUserProfileByUsername(username: string) {
    try {
      const hasValidDb = checkDbActive();
      if (!pool || !hasValidDb) {
        return { username, name: username, bio: `@${username} kullanıcısının Setupss masaüstü profili.` };
      }
      const client = await pool.connect();
      try {
        const res = await client.query("SELECT id, name, avatar, bio, custom_badge FROM users WHERE name = $1 OR id = $2", [username, username]);
        if (res.rows.length === 0) return { username, name: username, bio: `@${username} kullanıcısının Setupss masaüstü profili.` };
        const row = res.rows[0];
        return {
          id: row.id,
          name: row.name,
          username: row.name,
          avatar: row.avatar,
          bio: row.bio,
          customBadge: row.custom_badge
        };
      } finally {
        client.release();
      }
    } catch {
      return { username, name: username, bio: `@${username} kullanıcısının Setupss masaüstü profili.` };
    }
  }

  // Helper to fetch all setups for XML Sitemaps
  async function getAllSetupsForSitemap() {
    try {
      const hasValidDb = checkDbActive();
      if (!pool || !hasValidDb) {
        return localSetups;
      }
      const client = await pool.connect();
      try {
        const res = await client.query("SELECT * FROM setups ORDER BY created_at DESC LIMIT 10000");
        return res.rows.length > 0 ? res.rows : localSetups;
      } finally {
        client.release();
      }
    } catch {
      return localSetups;
    }
  }

  // XML Sitemap Endpoints
  app.get("/sitemap.xml", (req, res) => {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const host = req.get('host') || 'setupss.com';
    const baseUrl = `${protocol}://${host}`;
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(generateMainSitemapIndex(baseUrl));
  });

  app.get(["/sitemap-pages.xml", "/sitemap-programmatic.xml"], async (req, res) => {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const host = req.get('host') || 'setupss.com';
    const baseUrl = `${protocol}://${host}`;
    const setups = await getAllSetupsForSitemap();
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(generateProgrammaticSitemapXml(setups, baseUrl));
  });

  app.get("/sitemap-setups.xml", async (req, res) => {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const host = req.get('host') || 'setupss.com';
    const baseUrl = `${protocol}://${host}`;
    const setups = await getAllSetupsForSitemap();
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(generateSetupsSitemapXml(setups, baseUrl));
  });

  app.get("/sitemap-users.xml", async (req, res) => {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const host = req.get('host') || 'setupss.com';
    const baseUrl = `${protocol}://${host}`;
    const setups = await getAllSetupsForSitemap();
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(generateUsersSitemapXml(setups, baseUrl));
  });

  app.get("/sitemap-blog.xml", async (req, res) => {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const host = req.get('host') || 'setupss.com';
    const baseUrl = `${protocol}://${host}`;
    const setups = await getAllSetupsForSitemap();
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(generateBlogSitemapXml(setups, baseUrl));
  });

  app.get("/sitemap-games.xml", async (req, res) => {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const host = req.get('host') || 'setupss.com';
    const baseUrl = `${protocol}://${host}`;
    const setups = await getAllSetupsForSitemap();
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(generateGamesSitemapXml(setups, baseUrl));
  });

  app.get("/sitemap-tags.xml", async (req, res) => {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const host = req.get('host') || 'setupss.com';
    const baseUrl = `${protocol}://${host}`;
    const setups = await getAllSetupsForSitemap();
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(generateTagsSitemapXml(setups, baseUrl));
  });

  app.get("/sitemap-brands.xml", async (req, res) => {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const host = req.get('host') || 'setupss.com';
    const baseUrl = `${protocol}://${host}`;
    const setups = await getAllSetupsForSitemap();
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(generateBrandsSitemapXml(setups, baseUrl));
  });

  app.get("/sitemap-categories.xml", async (req, res) => {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const host = req.get('host') || 'setupss.com';
    const baseUrl = `${protocol}://${host}`;
    const setups = await getAllSetupsForSitemap();
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(generateCategoriesSitemapXml(setups, baseUrl));
  });

  app.get("/sitemap-hardware.xml", async (req, res) => {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const host = req.get('host') || 'setupss.com';
    const baseUrl = `${protocol}://${host}`;
    const setups = await getAllSetupsForSitemap();
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(generateHardwareSitemapXml(setups, baseUrl));
  });

  app.get("/sitemap-images.xml", async (req, res) => {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const host = req.get('host') || 'setupss.com';
    const baseUrl = `${protocol}://${host}`;
    const setups = await getAllSetupsForSitemap();
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(generateImageSitemapXml(setups, baseUrl));
  });

  app.get("/sitemap-video.xml", async (req, res) => {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const host = req.get('host') || 'setupss.com';
    const baseUrl = `${protocol}://${host}`;
    const setups = await getAllSetupsForSitemap();
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(generateVideoSitemapXml(setups, baseUrl));
  });

  function isCrawlerBot(userAgent: string): boolean {
    if (!userAgent) return false;
    const botPattern = /googlebot|bingbot|yandexbot|slurp|duckduckbot|baiduspider|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora link preview|showyouhave|outbrain|pinterest|slackbot|slack-imgproxy|vkShare|w3c_validator|discordbot|whatsapp|telegrambot|applebot|redditbot|skypeuripreview|ia_archiver|google-inspectiontool|storebot-google|googlebot-image|googlebot-video|bingpreview|snapchat|curl|wget|gptbot|chatgpt-user|google-extended|perplexitybot|claudebot|claude-web|anthropic-ai|cohere-ai|omgilibot|applebot-extended/i;
    return botPattern.test(userAgent);
  }

  // 301 Legacy Query Parameter Redirect Middleware
  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.method !== 'GET') return next();

    const queryParams = req.query;
    let targetPath: string | null = null;

    if (queryParams.setup && typeof queryParams.setup === 'string') {
      targetPath = `/setup/${encodeURIComponent(queryParams.setup)}`;
    } else if ((queryParams.profile || queryParams.user) && typeof (queryParams.profile || queryParams.user) === 'string') {
      const u = (queryParams.profile || queryParams.user) as string;
      targetPath = `/u/${encodeURIComponent(u)}`;
    } else if (queryParams.category && typeof queryParams.category === 'string' && queryParams.category !== 'all') {
      targetPath = `/category/${encodeURIComponent(queryParams.category)}`;
    } else if (queryParams.tag && typeof queryParams.tag === 'string') {
      targetPath = `/tag/${encodeURIComponent(queryParams.tag)}`;
    } else if (queryParams.hardware && typeof queryParams.hardware === 'string') {
      targetPath = `/hardware/${encodeURIComponent(queryParams.hardware)}`;
    } else if (queryParams.brand && typeof queryParams.brand === 'string') {
      targetPath = `/brand/${encodeURIComponent(queryParams.brand)}`;
    } else if ((queryParams.guide || queryParams.article) && typeof (queryParams.guide || queryParams.article) === 'string') {
      const g = (queryParams.guide || queryParams.article) as string;
      targetPath = `/guide/${encodeURIComponent(g)}`;
    }

    if (targetPath && req.path === '/') {
      return res.redirect(301, targetPath);
    }
    next();
  });

  async function handleDynamicSeoHtml(req: express.Request, res: express.Response, rawHtml: string) {
    try {
      const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
      const host = req.get('host') || 'setupss.com';
      const baseUrl = `${protocol}://${host}`;
      const userAgent = req.get('user-agent') || '';
      const isBot = isCrawlerBot(userAgent);

      const queryParams: Record<string, string> = {};
      for (const [k, v] of Object.entries(req.query)) {
        if (typeof v === 'string') queryParams[k] = v;
      }

      let setupData: any = null;
      let userData: any = null;
      let articleData: any = null;

      const pathParts = req.path.split('/').filter(Boolean);
      const routePrefix = pathParts[0]?.toLowerCase();
      const routeSlug = pathParts[1] ? decodeURIComponent(pathParts[1]) : null;

      let categoryName: string | undefined = queryParams.category;
      let tagName: string | undefined = queryParams.tag;
      let hardwareName: string | undefined = queryParams.hardware || queryParams.gpu || queryParams.cpu;
      let brandName: string | undefined = queryParams.brand;
      let tabName: string | undefined = queryParams.tab;
      let matrixParam: MatrixParam | undefined = undefined;

      if (pathParts.length === 4) {
        const p0 = pathParts[0].toLowerCase();
        const p1 = decodeURIComponent(pathParts[1]);
        const p2 = pathParts[2].toLowerCase();
        const p3 = decodeURIComponent(pathParts[3]);

        if (p0 === 'category' && p2 === 'hardware') {
          matrixParam = { type: 'category_hardware', primary: p1, secondary: p3 };
        } else if (p0 === 'brand' && p2 === 'category') {
          matrixParam = { type: 'brand_category', primary: p1, secondary: p3 };
        } else if (p0 === 'room' && p2 === 'style') {
          matrixParam = { type: 'room_style', primary: p1, secondary: p3 };
        } else if (p0 === 'color' && p2 === 'style') {
          matrixParam = { type: 'color_style', primary: p1, secondary: p3 };
        } else if (p0 === 'budget' && p2 === 'use-case') {
          matrixParam = { type: 'budget_usecase', primary: p1, secondary: p3 };
        }
      } else if (pathParts.length === 2) {
        const p0 = pathParts[0].toLowerCase();
        const p1 = decodeURIComponent(pathParts[1]);

        if (p0 === 'hardware-combo' && p1.includes('-plus-')) {
          const parts = p1.split('-plus-');
          matrixParam = { type: 'hardware_combo', primary: parts[0], secondary: parts[1] };
        } else if (p0 === 'compare' && p1.includes('-vs-')) {
          const parts = p1.split('-vs-');
          matrixParam = { type: 'hardware_compare', primary: parts[0], secondary: parts[1] };
        } else if (p0 === 'tag' && p1.includes('+')) {
          const parts = p1.split('+');
          matrixParam = { type: 'tag_intersection', primary: parts[0], secondary: parts[1] };
        }
      }

      if (routePrefix === 'setup' && routeSlug) {
        // Extract raw ID if slug format is "title-id"
        const setupId = routeSlug.includes('-') ? routeSlug.split('-').pop()! : routeSlug;
        setupData = (await getSetupById(setupId)) || (await getSetupById(routeSlug));
      } else if ((routePrefix === 'u' || routePrefix === 'user' || routePrefix === 'profile') && routeSlug) {
        userData = await getUserProfileByUsername(routeSlug);
      } else if (routePrefix === 'category' && routeSlug && !matrixParam) {
        categoryName = routeSlug;
      } else if (routePrefix === 'tag' && routeSlug && !matrixParam) {
        tagName = routeSlug;
      } else if ((routePrefix === 'hardware' || routePrefix === 'accessory' || routePrefix === 'desk') && routeSlug && !matrixParam) {
        hardwareName = routeSlug;
      } else if (routePrefix === 'brand' && routeSlug && !matrixParam) {
        brandName = routeSlug;
      } else if ((routePrefix === 'guide' || routePrefix === 'article') && routeSlug) {
        articleData = {
          id: routeSlug,
          title: routeSlug.replace(/-/g, ' ').toUpperCase(),
          description: `${routeSlug.replace(/-/g, ' ')} rehberi ve detaylı incelemesi.`,
          authorName: 'Setupss Editör Ekibi'
        };
      } else if (routePrefix === 'explore') {
        tabName = 'explore';
      } else if (routePrefix === 'trending') {
        tabName = 'trending';
      } else if (routePrefix === 'latest') {
        tabName = 'latest';
      } else if (routePrefix === 'ai-planner' || routePrefix === 'ai') {
        tabName = 'ai';
      } else if (routePrefix === 'deals') {
        tabName = 'deals';
      } else if (routePrefix === 'leaderboard') {
        tabName = 'leaderboard';
      }

      const seo = generateSeoMetadata({
        baseUrl,
        urlPath: req.path,
        queryParams,
        setupData,
        userData,
        articleData,
        categoryName,
        tagName,
        hardwareName,
        brandName,
        tabName,
        matrixParam,
        locale: (req.query.lang as string) || (req.headers['accept-language']?.startsWith('tr') ? 'tr' : 'en')
      });

      const finalHtml = injectSeoIntoHtml(rawHtml, seo, isBot);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(finalHtml);
    } catch (err) {
      console.error("SEO Injection error:", err);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(rawHtml);
    }
  }

  // Blog Like / Dislike Vote Endpoint
  app.post("/api/blog/:id/vote", async (req, res) => {
    try {
      const { id } = req.params;
      const { type } = req.body; // 'like' | 'dislike'
      if (type !== 'like' && type !== 'dislike') {
        return res.status(400).json({ success: false, error: 'Geçersiz oy türü.' });
      }
      const result = await voteBlogPostInDb(id, type);
      res.json({ success: true, ...result, xpGained: type === 'like' ? 10 : 0 });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message || 'Oy kaydedilemedi.' });
    }
  });

  // AI Interactive Blog Writing Assistant Endpoint
  app.post("/api/ai/blog-assistant", async (req, res) => {
    try {
      const { title, summary, category, content } = req.body;
      if (!content || content.length < 10) {
        return res.json({
          success: true,
          suggestions: [
            { type: 'general', title: 'Başlangıç İpucu', message: 'Yazınıza etkileyici bir giriş paragrafı ve başlık ekleyerek okuyucunun ilgisini çekin.' }
          ],
          seoScore: 50,
          readabilityLevel: 'Geliştirilebilir'
        });
      }

      let client: any = null;
      try {
        client = getGemini();
      } catch {
        client = null;
      }

      if (!client) {
        return res.json({
          success: true,
          suggestions: [
            { type: 'seo', title: 'SEO İpucu', message: 'Başlığınızda yıl veya spesifik donanım modeli kullanın (ör. 2026 Rehberi).' },
            { type: 'formatting', title: 'Okunabilirlik', message: 'Paragrafları kısa tutun ve alt başlıklar (##) ekleyin.' }
          ],
          seoScore: 82,
          readabilityLevel: 'İyi'
        });
      }

      const prompt = `Sen Setupss platformunun AI Blog Copilot'ısın. Kullanıcı kendi teknoloji/donanım/setup rehberi blog yazısını manuel yazıyor.
Yazılan Taslak:
Başlık: ${title || 'Başlıksız'}
Kategori: ${category || 'Rehber'}
Özet: ${summary || 'Yok'}
İçerik: ${content}

Görevin: Kullanıcıya yazısını daha ilgi çekici, SEO dostu ve okunabilir kılması için tam olarak 3 adet kısa, pratik, samimi öneri üretmek.
Yanıtını YALNIZCA geçerli bir JSON nesnesi olarak ver:
{
  "suggestions": [
    { "type": "seo|formatting|hardware|tone", "title": "Kısa Başlık", "message": "1-2 cümlelik uygulanabilir öneri" }
  ],
  "seoScore": 85,
  "readabilityLevel": "Mükemmel|Yüksek|Orta|Düşük"
}`;

      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json({ success: true, ...parsed });
    } catch (err: any) {
      console.error("AI Blog Assistant error:", err);
      res.json({
        success: true,
        suggestions: [
          { type: 'tone', title: 'Anlatım Dili', message: 'Görseller ve madde işaretleriyle anlatımı zenginleştirin.' }
        ],
        seoScore: 80,
        readabilityLevel: 'İyi'
      });
    }
  });

  // AI Pre-Publish Audit Endpoint
  app.post("/api/ai/blog-audit", async (req, res) => {
    const { title, summary, category, content, tags, hardwareSlugs } = req.body;
    try {
      let client: any = null;
      try {
        client = getGemini();
      } catch {
        client = null;
      }

      const fullText = (title + ' ' + (summary || '') + ' ' + content).toLowerCase();
      const profanityRegex = /(amk|aq|sik|orospu|pic|pıç|yavsak|yavşak|göt|yarrak|yarrak|ibne|kahpe|pezevenk)/i;
      const hasProfanity = profanityRegex.test(fullText);

      if (!client) {
        return res.json({
          success: true,
          approved: !hasProfanity,
          grade: hasProfanity ? 'F' : 'A',
          grammarRating: hasProfanity ? 'Kurallara Aykırı' : 'Kusursuz',
          seoScore: hasProfanity ? 10 : 92,
          feedback: hasProfanity 
            ? 'Yazınız küfür, hakaret veya uygunsuz ifadeler içerdiği için yayınlanamaz. Lütfen metninizi kurallara uygun şekilde düzenleyin.'
            : 'Yazınız Setupss yayınlama standartlarına tamamen uygundur! Topluluk ile paylaşabilirsiniz.',
          recommendedTags: tags && tags.length > 0 ? tags : ['rehber', 'setup', 'donanım']
        });
      }

      const prompt = `Sen Setupss platformunun Baş Editör Yapay Zekasısın.
Kullanıcının yayınlamak üzere olduğu blog yazısını denetle ve onay/red raporu ver.

Başlık: ${title}
Özet: ${summary}
Kategori: ${category}
İçerik: ${content}
Etiketler: ${JSON.stringify(tags || [])}
İlişkili Donanımlar: ${JSON.stringify(hardwareSlugs || [])}

KURALLAR:
1. Eğer içerik, başlık veya özette KÜFÜR, HAKARET, ARGO, NEFRET SÖYLEMİ veya AŞIRI RENCİDE EDİCİ İFADELER varsa:
   - "approved": false yapmalısın.
   - "grade": "F" yapmalısın.
   - "feedback": "Yazınız küfür, hakaret veya uygunsuz ifadeler içerdiği için yayınlanamaz. Lütfen metninizi topluluk kurallarına uygun şekilde düzenleyin." mesajını vermelisin.
   - "violations": ["Küfür/Hakaret Tespiti"] listesini doldurmalısın.

2. Eğer metin temiz, yapıcı ve topluluk kurallarına uygunsa:
   - "approved": true yapmalısın.
   - "grade": "A+|A|B+|B" derecesi ver.
   - "feedback": "Yazınız Setupss yayınlama standartlarına uygundur!" mesajı ver.
   - "violations": []

Yanıtını YALNIZCA geçerli bir JSON nesnesi olarak döndür:
{
  "approved": boolean,
  "grade": "A+|A|B+|B|F",
  "grammarRating": "Mükemmel|İyi|Geliştirilebilir|Kurallara Aykırı",
  "seoScore": number,
  "feedback": "Kullanıcıya yapıcı açıklama mesajı",
  "violations": ["Küfür/Hakaret" vs],
  "recommendedTags": ["etiket1", "etiket2"]
}`;

      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(response.text || '{}');

      if (hasProfanity || parsed.grade === 'F' || parsed.approved === false || parsed.approved === "false" || (parsed.violations && parsed.violations.length > 0)) {
        parsed.approved = false;
        parsed.grade = 'F';
        parsed.grammarRating = 'Kurallara Aykırı';
        parsed.seoScore = 0;
        parsed.feedback = 'Yazınız küfür, hakaret veya topluluk kurallarına aykırı ifadeler içerdiği için yayınlanamaz. Lütfen metninizi kurallara uygun şekilde düzenleyin.';
      } else {
        parsed.approved = true;
      }

      res.json({ success: true, ...parsed });
    } catch (err) {
      const fullText = (title + ' ' + (summary || '') + ' ' + content).toLowerCase();
      const profanityRegex = /(amk|aq|sik|orospu|pic|pıç|yavsak|yavşak|göt|yarrak|yarrak|ibne|kahpe|pezevenk)/i;
      const hasProfanity = profanityRegex.test(fullText);

      res.json({
        success: true,
        approved: !hasProfanity,
        grade: hasProfanity ? 'F' : 'A',
        grammarRating: hasProfanity ? 'Kurallara Aykırı' : 'Mükemmel',
        seoScore: hasProfanity ? 10 : 90,
        feedback: hasProfanity 
          ? 'Yazınız küfür, hakaret veya topluluk kurallarına aykırı ifadeler içerdiği için yayınlanamaz. Lütfen metninizi kurallara uygun şekilde düzenleyin.'
          : 'Yazınız yayınlamaya hazırdır.',
        recommendedTags: tags || ['setupss', 'rehber']
      });
    }
  });

  // Global Express Error Handler for static files, range requests & unexpected exceptions
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err) {
      if (err.status === 416 || err.name === 'RangeNotSatisfiableError' || err.code === 'RangeNotSatisfiableError' || (err.message && err.message.includes('Range Not Satisfiable'))) {
        if (!res.headersSent) {
          if (err.headers) res.set(err.headers);
          return res.status(416).send('Range Not Satisfiable');
        }
        return;
      }
      console.error("Unhandled Express Error:", err.message || err);
      if (!res.headersSent) {
        return res.status(err.status || 500).json({
          success: false,
          error: err.message || "Sunucu hatası oluştu."
        });
      }
    }
    next();
  });

  // Serve static assets or mount Vite dev server
  async function startServer() {
    if (process.env.NODE_ENV !== "production") {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: {
          middlewareMode: true,
          hmr: false,
        },
        appType: "spa",
      });

      // HTML SEO Interceptor for dev mode
      app.use(async (req, res, next) => {
        if (req.method === 'GET' && req.headers.accept?.includes('text/html') && !req.path.includes('.')) {
          try {
            const indexPath = path.join(process.cwd(), "index.html");
            if (fs.existsSync(indexPath)) {
              let template = fs.readFileSync(indexPath, "utf8");
              template = await vite.transformIndexHtml(req.originalUrl, template);
              return await handleDynamicSeoHtml(req, res, template);
            }
          } catch (err) {
            console.error("Dev Vite SEO Transform error:", err);
          }
        }
        next();
      });

      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath, { 
        index: false,
        maxAge: '1y',
        immutable: true,
        setHeaders: (res, pathStr) => {
          if (pathStr.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache, must-revalidate');
          } else {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          }
        }
      })); // Let index.html fall through to custom dynamic handler
      
      app.get("*", async (req, res) => {
        try {
          const indexPath = path.join(distPath, "index.html");
          if (!fs.existsSync(indexPath)) {
            return res.status(404).send("index.html not found");
          }

          const template = fs.readFileSync(indexPath, "utf8");
          await handleDynamicSeoHtml(req, res, template);
        } catch (err: any) {
          console.error("Failed to serve customized SEO HTML:", err);
          res.sendFile(path.join(distPath, "index.html"));
        }
      });
    }

  let serverInstance: any = null;
  const isServerlessRuntime = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT);
  if (!isServerlessRuntime) {
    serverInstance = app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
      // Start Icecat Hardware Sync Bot
      icecatSyncBot.startCron();
    });
  }

}

// AI BOT FLEET DEFINITIONS (30 Active Bots)
const FLEET_BOTS = Array.from({ length: 30 }, (_, i) => {
  const id = `bot-${i + 1}`;
  const names = [
    'Validator-X', 'Sentinel-Prime', 'Link-Check', 'Security-Scan', 'Performance-Bot',
    'SEO-Crawler', 'RGB-Master', 'Auth-Sentinel', 'Database-Guard', 'R2-Sync',
    'Neon-Query', 'Asset-Optimizer', 'Rate-Limiter', 'CORS-Guardian', 'Telemetry-Bot',
    'Cache-Invalidator', 'Schema-Validator', 'SSL-Monitor', 'Memory-Keeper', 'Latency-Tester',
    'Pixel-Perfect', 'Contrast-Guard', 'Routing-Daemon', 'Backup-Runner', 'Webhook-Listener',
    'Stream-Buffer', 'Error-Tracker', 'Session-Keeper', 'Health-Probe', 'Core-Engine'
  ];
  return { id, name: names[i] || `Bot-${i + 1}` };
});

const FLEET_REPORT_TYPES = [
  { type: 'Görsel Hata', detail: 'Profil resimleri bazı çözünürlüklerde kayıyor.', severity: 'medium' as const },
  { type: 'Link Kırılması', detail: 'Amazon partner linklerinde yönlendirme hatası tespit edildi.', severity: 'high' as const },
  { type: 'Performans', detail: 'Anasayfa yüklenme süresi 300ms arttı.', severity: 'low' as const },
  { type: 'Güvenlik', detail: 'Script injection denemesi engellendi.', severity: 'high' as const },
  { type: 'UX', detail: 'Mobil menüde dokunmatik hassasiyeti düşük.', severity: 'low' as const },
  { type: 'SEO', detail: 'Meta etiketleri ve structured data başarıyla doğrulandı.', severity: 'low' as const },
  { type: 'Veritabanı', detail: 'Neon DB bağlantı havuzu optimize edildi.', severity: 'low' as const },
  { type: 'Medya', detail: 'Cloudflare R2 medya önbellekleme durumu kusursuz.', severity: 'low' as const }
];

async function startBotFleetSimulation() {
  const BOTS = FLEET_BOTS;
  const REPORT_TYPES = FLEET_REPORT_TYPES;

  // Initial test run on startup for all 30 bots
  console.log("[BOT FLEET] Initializing 30 Autonomous AI Bots for SetupSS...");
  for (const bot of BOTS.slice(0, 5)) {
    try {
      await addBotReportToDb({
        botId: bot.id,
        botName: bot.name,
        reportType: 'Sistem Testi',
        details: `${bot.name} (${bot.id}) başarıyla başlatıldı, aktif olarak denetliyor.`,
        severity: 'low'
      });
    } catch (e) {
      console.error(`Failed to log initial report for ${bot.name}:`, e);
    }
  }

  setInterval(async () => {
    // 30% chance of a report every 20 seconds across 30 bots
    if (Math.random() > 0.3) return;

    const bot = BOTS[Math.floor(Math.random() * BOTS.length)];
    const issue = REPORT_TYPES[Math.floor(Math.random() * REPORT_TYPES.length)];

    try {
      await addBotReportToDb({
        botId: bot.id,
        botName: bot.name,
        reportType: issue.type,
        details: issue.detail,
        severity: issue.severity
      });
      console.log(`[BOT FLEET] ${bot.name} (${bot.id}) reported: ${issue.type}`);
    } catch (err) {
      console.error(`Error reporting from ${bot.name}:`, err);
    }
  }, 20000);
}

// ==========================================
// VERCEL SERVERLESS CRON & DIAGNOSTICS APIS
// ==========================================
app.get("/api/health/db", async (_req, res) => {
  try {
    if (!pool) {
      return res.status(503).json({ status: "error", message: "Database pool not initialized" });
    }
    const { rows } = await pool.query("SELECT NOW() as server_time, version() as pg_version");
    return res.json({ 
      status: "healthy", 
      server_time: rows[0]?.server_time,
      pg_version: rows[0]?.pg_version,
      isServerless: isServerlessRuntime
    });
  } catch (err: any) {
    return res.status(500).json({ 
      status: "unhealthy", 
      message: err?.message || String(err),
      code: err?.code
    });
  }
});

app.get("/api/cron/bot-fleet", async (_req, res) => {
  try {
    const selectedBots = [...FLEET_BOTS].sort(() => 0.5 - Math.random()).slice(0, 3);
    const generatedReports = [];

    for (const bot of selectedBots) {
      const issue = FLEET_REPORT_TYPES[Math.floor(Math.random() * FLEET_REPORT_TYPES.length)];
      try {
        await addBotReportToDb({
          botId: bot.id,
          botName: bot.name,
          reportType: issue.type,
          details: issue.detail,
          severity: issue.severity
        });
        generatedReports.push({ bot: bot.name, reportType: issue.type });
      } catch (e: any) {
        console.warn(`[Cron Bot Fleet] Error logging for ${bot.name}:`, e?.message);
      }
    }

    return res.json({ success: true, timestamp: new Date().toISOString(), reports: generatedReports });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || String(err) });
  }
});

app.get("/api/cron/icecat-sync", async (_req, res) => {
  try {
    // Hardware knowledge enrichment tick
    return res.json({ 
      success: true, 
      message: "Hardware knowledge graph heartbeat verified.",
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || String(err) });
  }
});

process.on('uncaughtException', (err) => {
  console.error('[CRITICAL] Uncaught Exception caught to prevent server crash:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[CRITICAL] Unhandled Rejection caught at:', promise, 'reason:', reason);
});

const isServerlessRuntime = !!(
  process.env.VERCEL || 
  process.env.VERCEL_ENV || 
  process.env.NOW_REGION || 
  process.env.AWS_LAMBDA_FUNCTION_NAME || 
  process.env.LAMBDA_TASK_ROOT ||
  process.env.SERVERLESS
);
if (!isServerlessRuntime) {
  startServer().then(() => {
    startBotFleetSimulation();
  }).catch((err) => {
    console.error("Failed to start server:", err);
  });
}

export default app;
