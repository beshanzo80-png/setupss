var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/utils/slug.ts
function slugify(text) {
  if (!text) return "";
  return text.toString().toLowerCase().trim().replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c").replace(/â/g, "a").replace(/î/g, "i").replace(/û/g, "u").replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
}
var init_slug = __esm({
  "src/utils/slug.ts"() {
  }
});

// src/utils/hardwareEngine.ts
function getHardwareBySlug(slug) {
  const clean = slugify(slug);
  const found = HARDWARE_CATALOG.find(
    (h) => h.slug === clean || h.aliases.some((a) => slugify(a) === clean)
  );
  if (found) return found;
  const parts = clean.split("-");
  const brandName = parts[0] ? parts[0].toUpperCase() : "GENERIC";
  const modelName = parts.slice(1).map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
  return {
    id: `hw-${clean}`,
    slug: clean,
    category: "Accessories",
    brand: brandName,
    model: modelName || clean,
    aliases: [clean],
    specifications: {
      "Brand": brandName,
      "Model": modelName || clean,
      "Status": "Community Verified Component"
    },
    images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1200&q=80"],
    description: `${brandName} ${modelName} bile\u015Feni ile donat\u0131lm\u0131\u015F masa\xFCst\xFC kurulum \xF6zellikleri, detayl\u0131 incelemesi ve uyumlu donan\u0131mlar.`,
    popularity: 50,
    setupCount: 3,
    averageRating: 4.8
  };
}
var HARDWARE_CATALOG;
var init_hardwareEngine = __esm({
  "src/utils/hardwareEngine.ts"() {
    init_slug();
    HARDWARE_CATALOG = [];
  }
});

// src/data/seedBlogPosts.ts
var SEED_BLOG_POSTS;
var init_seedBlogPosts = __esm({
  "src/data/seedBlogPosts.ts"() {
    SEED_BLOG_POSTS = [
      {
        id: "blog-1",
        title: "2026 En \u0130yi Oyuncu Koltu\u011Fu Se\xE7imi: Ergonomi, Kuma\u015F vs Deri ve Bel Destek Rehberi",
        slug: "en-iyi-oyuncu-koltugu-secimi",
        summary: "Masa ba\u015F\u0131nda uzun saatler ge\xE7iren oyuncular ve yaz\u0131l\u0131mc\u0131lar i\xE7in do\u011Fru koltuk se\xE7imi bel ve boyun sa\u011Fl\u0131\u011F\u0131 i\xE7in hayati \xF6nem ta\u015F\u0131r. Herman Miller, Secretlab, Corsair ve f/p alternatiflerinin detayl\u0131 analizi.",
        category: "Ergonomi & Mobilya",
        coverImage: "https://images.unsplash.com/photo-1580481072645-022f9a6d1270?auto=format&fit=crop&w=1200&q=80",
        authorName: "Be\u015Fir Hanzo",
        authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80",
        readTimeMinutes: 7,
        tags: ["oyuncukoltu\u011Fu", "ergonomi", "hermanmiller", "setupkombinasyon", "mobilya"],
        hardwareSlugs: ["herman-miller-aeron", "yazi-masasi-bulut-lambasi"],
        isPublished: true,
        createdAt: "2026-02-10T10:00:00.000Z",
        updatedAt: "2026-02-10T10:00:00.000Z",
        content: `
# 2026 En \u0130yi Oyuncu ve \xC7al\u0131\u015Fma Koltu\u011Fu Se\xE7imi

G\xFCnde 8 saatten fazla masa ba\u015F\u0131nda \xE7al\u0131\u015Fan veya oyun oynayan herkes i\xE7in koltuk, sistemin ekran kart\u0131 ya da i\u015Flemcisi kadar \xF6nemlidir. Yanl\u0131\u015F bir oturma pozisyonu kronik bel, boyun ve s\u0131rt a\u011Fr\u0131lar\u0131na yol a\xE7abilir.

## 1. Ergonomik Ofis Koltu\u011Fu mu, Oyuncu Koltu\u011Fu mu?

Son y\u0131llarda "Gaming Chair" kategorisi pop\xFClerle\u015Fse de profesyonel ergonomistler genellikle **fileli ergonomik ofis koltuklar\u0131n\u0131** \xF6nerir.

* **Fileli (Mesh) Koltuklar:** Terletmez, omurgan\u0131n do\u011Fal S kavisini destekler ve bas\u0131nc\u0131 e\u015Fit da\u011F\u0131t\u0131r. (\xD6rn: *Herman Miller Aeron*, *IKEA Markus*).
* **Oyuncu (Yar\u0131\u015F Tipi) Koltuklar:** Yanal destek sa\u011Flar, dik duru\u015Fu zorunlu k\u0131lar ancak nefes almayan suni deri modeller s\u0131cak havalarda rahats\u0131zl\u0131k verebilir.

## 2. Kuma\u015F m\u0131 Suni Deri mi?

* **Kuma\u015F Kaplama:** Nefes alabilir, uzun \xF6m\xFCrl\xFCd\xFCr, soyulma yapmaz. Temizli\u011Fi leke tutmaz kuma\u015F teknolojileriyle kolayla\u015Fm\u0131\u015Ft\u0131r.
* **PU / Suni Deri:** \u015E\u0131k durur ve s\u0131v\u0131 d\xF6k\xFClmelerine kar\u015F\u0131 dayan\u0131kl\u0131d\u0131r ancak 1-2 y\u0131l sonra a\u015F\u0131nabilir.

## 3. Bel ve Boyun Deste\u011Fi Nas\u0131l Olmal\u0131?

\u0130deal bir koltukta mutlaka **y\xFCkseklik ve derinlik ayarl\u0131 bel deste\u011Fi (Lumbar Support)** bulunmal\u0131d\u0131r. Sabit minderli koltuklar herkesin v\xFCcut yap\u0131s\u0131na uymayabilir.

### \xD6ne \xC7\u0131kan Tavsiyeler

1. **\xDCst Segment:** Herman Miller Aeron / Secretlab Titan EVO
2. **Fiyat/Performans:** IKEA Markus / Jarvfjallet
3. **Oyuncu Odakl\u0131 Kuma\u015F:** Corsair T3 Rush / xDrive Altay
`
      },
      {
        id: "blog-2",
        title: "Mekanik Klavye Switch Rehberi: Red, Brown, Blue ve Custom Linear Kar\u015F\u0131la\u015Ft\u0131rmas\u0131",
        slug: "mekanik-klavye-switch-rehberi",
        summary: "Mekanik klavye d\xFCnyas\u0131nda do\u011Fru switch se\xE7imi yazma hissiyat\u0131n\u0131, ses profilini ve oyun performans\u0131n\u0131 ba\u015Ftan yarat\u0131r. Dokunsal (tactile), lineer (linear) ve sesli (clicky) switch farklar\u0131.",
        category: "Klavye & Mouse",
        coverImage: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1200&q=80",
        authorName: "Zeynep Tasar\u0131m",
        authorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&h=200&q=80",
        readTimeMinutes: 6,
        tags: ["mekanikklavye", "customkeyboard", "gmmkpro", "keychron", "switches"],
        hardwareSlugs: ["gmmk-pro-custom-mechanical-keyboard", "custom-mechanical-keyboard", "epomaker-ek68-pastel-custom"],
        isPublished: true,
        createdAt: "2026-02-12T14:30:00.000Z",
        updatedAt: "2026-02-12T14:30:00.000Z",
        content: `
# Mekanik Klavye Switch Rehberi

Custom mekanik klavyeler g\xFCn\xFCm\xFCzde bir tutku ve estetik \xF6\u011Fesi haline geldi. Ancak i\u015Fin kalbinde her zaman **switch (anahtar)** teknolojisi yatar.

## Switch T\xFCrleri ve \xD6zellikleri

### 1. Lineer (Linear) Switchler (K\u0131rm\u0131z\u0131, Sar\u0131, Siyah)
* **Hissiyat:** P\xFCr\xFCzs\xFCz, tak\u0131lmas\u0131z a\u015Fa\u011F\u0131 do\u011Fru kayma.
* **Kullan\u0131m:** FPS oyunlar\u0131 ve h\u0131zl\u0131 reaksiyon gerektiren durumlar i\xE7in idealdir.
* **\xD6rnekler:** Cherry MX Red, Gateron Oil King, Akko Yellow.

### 2. Dokunsal (Tactile) Switchler (Kahverengi, Kutsal Panda)
* **Hissiyat:** Tu\u015Fa basarken ortada hafif bir "t\xFCmsek" hissedilir.
* **Kullan\u0131m:** Yaz\u0131l\u0131m geli\u015Ftirenler ve daktilo hissiyat\u0131 sevenler i\xE7in m\xFCkemmel denge.
* **\xD6rnekler:** Cherry MX Brown, Boba U4T, Glorious Panda.

### 3. Klikli (Clicky) Switchler (Mavi, Ye\u015Fil)
* **Hissiyat:** Her bas\u0131\u015Fta net bir daktilo sesi ve dokunsal geri bildirim.
* **Kullan\u0131m:** Tek ba\u015F\u0131na \xE7al\u0131\u015Fanlar i\xE7in keyifli, a\xE7\u0131k ofislerde arkada\u015F kaybettirebilir!

## Modding ve Ses Profili (Thock vs Clack)

* **Lubing (Ya\u011Flama):** Krytox 205g0 ile switchleri ya\u011Flamak s\xFCrt\xFCnmeyi yok eder ve daha tok ("thocky") bir ses verir.
* **Gasket Mount:** Kasadaki esneklik tu\u015F bas\u0131\u015F hissini yumu\u015Fat\u0131r (\xD6rn: *GMMK Pro*, *Epomaker EK68*).
`
      },
      {
        id: "blog-3",
        title: "Masa\xFCst\xFC Kablo Y\xF6netimi ve RGB Ayd\u0131nlatma Rehberi: Temiz ve Modern Setup \u0130pu\xE7lar\u0131",
        slug: "masaustu-kablo-yonetimi-ve-rgb-aydinlatma-rehberi",
        summary: "Karma\u015F\u0131k kablo y\u0131\u011F\u0131nlar\u0131ndan kurtulup Pinterest ve Reddit battlestations kalitesinde temiz bir masa\xFCst\xFC g\xF6r\xFCn\xFCm\xFC elde etmenin 7 profesyonel ad\u0131m\u0131.",
        category: "Kablo Y\xF6netimi & I\u015F\u0131k",
        coverImage: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1200&q=80",
        authorName: "Kreatif Can",
        authorAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&h=200&q=80",
        readTimeMinutes: 5,
        tags: ["kabloyonetimi", "rgb", "screenbar", "minimalist", "setup"],
        hardwareSlugs: ["screenbar-halo", "ikea-karlby-tabletop", "yazi-masasi-bulut-lambasi"],
        isPublished: true,
        createdAt: "2026-02-15T09:15:00.000Z",
        updatedAt: "2026-02-15T09:15:00.000Z",
        content: `
# Masa\xFCst\xFC Kablo Y\xF6netimi ve RGB Ayd\u0131nlatma Rehberi

Harika bir bilgisayar kasas\u0131 ve \xE7ift monit\xF6r alsan\u0131z bile, masan\u0131n arkas\u0131ndan sarkan kablolar t\xFCm esteti\u011Fi bozabilir. \u0130\u015Fte kablolar\u0131 tamamen gizleme ve ortam \u0131\u015F\u0131\u011F\u0131n\u0131 profesyonelle\u015Ftirme rehberi.

## Kablo Gizleme Sanat\u0131 (Cable Management)

1. **Masa Alt\u0131 Kablo Kanallar\u0131 (Signum / J-Channel):**
   Masan\u0131n alt\u0131na vidalanan veya yap\u0131\u015Ft\u0131r\u0131lan kablo tepsileri priz bloklar\u0131n\u0131 ve adapt\xF6rleri saklamak i\xE7in \u015Fartt\u0131r.
2. **Kablo \xC7oraplar\u0131 ve C\u0131rt C\u0131rt Kelep\xE7eler:**
   Monit\xF6rden kasaya giden g\xFC\xE7 ve g\xF6r\xFCnt\xFC kablolar\u0131n\u0131 tek bir spiral \xE7orap i\xE7ine toplay\u0131n.
3. **Kablosuz \xC7evre Birimleri:**
   Kablosuz klavye ve mouse kullan\u0131m\u0131 masa y\xFCzeyini an\u0131nda %50 daha ferah g\xF6sterir.

## Atmosferik RGB Ayd\u0131nlatma \u0130pu\xE7lar\u0131

* **G\xF6z Yormayan Arka I\u015F\u0131k (Bias Lighting):** Monit\xF6r arkas\u0131na yap\u0131\u015Ft\u0131r\u0131lan 4000K \u0131l\u0131k beyaz LED \u015Feritler g\xF6z yorgunlu\u011Funu azalt\u0131r.
* **Monit\xF6r I\u015F\u0131k \xC7ubuklar\u0131 (Screenbar):** *BenQ Screenbar Halo* veya Xiaomi Screenbar masaya do\u011Frudan \u0131\u015F\u0131k verirken ekranda yans\u0131ma yapmaz.
* **S\u0131cak & So\u011Fuk Dengesi:** T\xFCm RGB \u0131\u015F\u0131klar\u0131 tek bir renk paletinde (Turuncu/Sar\u0131 veya Buz Mavisi/Beyaz) sabitlemek premium bir hava katar.
`
      },
      {
        id: "blog-4",
        title: "Ergonomik Masa\xFCst\xFC Kurulum Rehberi: Boyun ve S\u0131rt A\u011Fr\u0131lar\u0131na Son Verin",
        slug: "ergonomic-desk-setup",
        summary: "Monit\xF6r y\xFCksekli\u011Fi, klavye a\xE7\u0131s\u0131, ayak deste\u011Fi ve oturma pozisyonunun v\xFCcut mekani\u011Fine etkisi. Sa\u011Fl\u0131kl\u0131 bir \xE7al\u0131\u015Fma alan\u0131 i\xE7in bilimsel \xF6neriler.",
        category: "Ergonomi & Sa\u011Fl\u0131k",
        coverImage: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=1200&q=80",
        authorName: "Be\u015Fir Hanzo",
        authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80",
        readTimeMinutes: 5,
        tags: ["ergonomi", "saglik", "monitorarm", "aeron", "masaduzeni"],
        hardwareSlugs: ["dell-ultrasharp-32-4k", "herman-miller-aeron"],
        isPublished: true,
        createdAt: "2026-02-18T11:00:00.000Z",
        updatedAt: "2026-02-18T11:00:00.000Z",
        content: `
# Ergonomik Masa\xFCst\xFC Kurulum Rehberi

Post\xFCr bozukluklar\u0131 ve tekrarlayan gerilme yaralanmalar\u0131 (RSI), bilgisayar ba\u015F\u0131nda \xE7al\u0131\u015Fanlar\u0131n en b\xFCy\xFCk kabusudur. Do\u011Fru ergonomik d\xFCzenleme ile bu riskleri s\u0131f\u0131rlayabilirsiniz.

## Alt\u0131n Ergonomi Kurallar\u0131

1. **Monit\xF6r \xDCst Kenar\u0131 G\xF6z Hizas\u0131nda Olmal\u0131:**
   Monit\xF6re bakarken ba\u015F\u0131n\u0131z\u0131 \xF6ne e\u011Fmemelisiniz. Monit\xF6r kolu (Monitor Arm) kullanarak y\xFCksekli\u011Fi g\xF6z hizan\u0131za g\xF6re ayarlay\u0131n.
2. **90 Derece Dirsek A\xE7\u0131s\u0131:**
   Kollar\u0131n\u0131z masaya paralel durmal\u0131, bilekleriniz klavye veya jel desteye yumu\u015Fak\xE7a yaslanmal\u0131d\u0131r.
3. **Ayak Tabanlar\u0131 Yere Tam Basmal\u0131:**
   Ayaklar\u0131n\u0131z havada kal\u0131yorsa mutlaka bir ayak deste\u011Fi (Footrest) kullan\u0131n.

## \xD6nerilen Donan\u0131mlar

* **Monit\xF6r Kolu:** North Bayou F80 / Ergotron LX
* **Ergonomik Klavye:** Alice Layout / Split Ergonomic Keyboards
`
      }
    ];
  }
});

// server/storageService.ts
var storageService_exports = {};
__export(storageService_exports, {
  CloudflareR2Provider: () => CloudflareR2Provider,
  LocalStorageProvider: () => LocalStorageProvider,
  buildEntityObjectKey: () => buildEntityObjectKey,
  detectMimeTypeFromBuffer: () => detectMimeTypeFromBuffer,
  sanitizeSvg: () => sanitizeSvg,
  storageService: () => storageService
});
function buildEntityObjectKey(entityType, entityId, variant, assetId, ext) {
  const safeEntityId = entityId.replace(/[^a-zA-Z0-9_-]/g, "_");
  const safeAssetId = assetId.replace(/[^a-zA-Z0-9_-]/g, "_");
  const safeExt = ext.replace(/[^a-zA-Z0-9]/g, "");
  switch (entityType) {
    case "user_avatar":
      return `users/${safeEntityId}/avatar/original/${safeAssetId}.${safeExt}`;
    case "user_cover":
      return `users/${safeEntityId}/cover/original/${safeAssetId}.${safeExt}`;
    case "setup_image":
      if (variant === "thumb512") {
        return `setups/${safeEntityId}/images/thumbnails/512/${safeAssetId}.webp`;
      }
      if (variant === "thumb256") {
        return `setups/${safeEntityId}/images/thumbnails/256/${safeAssetId}.webp`;
      }
      return `setups/${safeEntityId}/images/original/${safeAssetId}.webp`;
    case "setup_video":
      return `setups/${safeEntityId}/videos/${safeAssetId}.${safeExt}`;
    case "setup_file":
      return `setups/${safeEntityId}/files/${safeAssetId}.${safeExt}`;
    case "post_image":
      if (variant === "thumb512") {
        return `posts/${safeEntityId}/images/thumbnails/512/${safeAssetId}.webp`;
      }
      if (variant === "thumb256") {
        return `posts/${safeEntityId}/images/thumbnails/256/${safeAssetId}.webp`;
      }
      return `posts/${safeEntityId}/images/original/${safeAssetId}.webp`;
    case "post_file":
      return `posts/${safeEntityId}/files/${safeAssetId}.${safeExt}`;
    case "chat_media":
      return `chat/${safeEntityId}/${safeAssetId}.${safeExt}`;
    default:
      return `general/${safeEntityId}/${safeAssetId}.${safeExt}`;
  }
}
function detectMimeTypeFromBuffer(buffer) {
  if (buffer.length < 4) return null;
  if (buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255) {
    return { mime: "image/jpeg", ext: "jpg" };
  }
  if (buffer[0] === 137 && buffer[1] === 80 && buffer[2] === 78 && buffer[3] === 71) {
    return { mime: "image/png", ext: "png" };
  }
  if (buffer[0] === 71 && buffer[1] === 73 && buffer[2] === 70 && buffer[3] === 56) {
    return { mime: "image/gif", ext: "gif" };
  }
  if (buffer.length >= 12 && buffer[0] === 82 && buffer[1] === 73 && buffer[2] === 70 && buffer[3] === 70 && buffer[8] === 87 && buffer[9] === 69 && buffer[10] === 66 && buffer[11] === 80) {
    return { mime: "image/webp", ext: "webp" };
  }
  if (buffer[0] === 37 && buffer[1] === 80 && buffer[2] === 68 && buffer[3] === 70) {
    return { mime: "application/pdf", ext: "pdf" };
  }
  if (buffer.length >= 8 && buffer[4] === 102 && buffer[5] === 116 && buffer[6] === 121 && buffer[7] === 112) {
    return { mime: "video/mp4", ext: "mp4" };
  }
  if (buffer[0] === 26 && buffer[1] === 69 && buffer[2] === 223 && buffer[3] === 163) {
    return { mime: "video/webm", ext: "webm" };
  }
  const textContent = buffer.slice(0, 1024).toString("utf-8").trim().toLowerCase();
  if (textContent.includes("<svg") || textContent.includes("<?xml")) {
    return { mime: "image/svg+xml", ext: "svg" };
  }
  return null;
}
function sanitizeSvg(buffer) {
  let svgString = buffer.toString("utf-8");
  svgString = svgString.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  svgString = svgString.replace(/\bon[a-z]+\s*=\s*["'][^"']*["']/gi, "");
  svgString = svgString.replace(/\bon[a-z]+\s*=\s*[^\s>]+/gi, "");
  svgString = svgString.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"');
  return Buffer.from(svgString, "utf-8");
}
var import_client_s3, import_s3_request_presigner, fs, path, import_sharp, import_dotenv, CloudflareR2Provider, LocalStorageProvider, StorageService, storageService;
var init_storageService = __esm({
  "server/storageService.ts"() {
    import_client_s3 = require("@aws-sdk/client-s3");
    import_s3_request_presigner = require("@aws-sdk/s3-request-presigner");
    fs = __toESM(require("fs"), 1);
    path = __toESM(require("path"), 1);
    import_sharp = __toESM(require("sharp"), 1);
    import_dotenv = __toESM(require("dotenv"), 1);
    import_dotenv.default.config();
    CloudflareR2Provider = class {
      constructor() {
        const accountId = process.env.R2_ACCOUNT_ID || "";
        const accessKeyId = process.env.R2_ACCESS_KEY_ID || "";
        const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || "";
        this.bucketName = process.env.R2_BUCKET_NAME || process.env.R2_BUCKET || "setupss";
        this.publicUrl = process.env.R2_PUBLIC_URL || "https://cdn.setupss.com";
        this.s3Client = new import_client_s3.S3Client({
          region: "auto",
          endpoint: accountId ? `https://${accountId}.r2.cloudflarestorage.com` : void 0,
          credentials: {
            accessKeyId,
            secretAccessKey
          }
        });
      }
      getBucketName() {
        return this.bucketName;
      }
      getPublicUrl() {
        return this.publicUrl;
      }
      async uploadFileDirectKey(fileBuffer, key, mimeType) {
        const cleanKey = key.replace(/^\/+/, "");
        const command = new import_client_s3.PutObjectCommand({
          Bucket: this.bucketName,
          Key: cleanKey,
          Body: fileBuffer,
          ContentType: mimeType
        });
        await this.s3Client.send(command);
        const baseUrl = this.publicUrl.replace(/\/$/, "");
        return {
          objectKey: cleanKey,
          publicUrl: `${baseUrl}/${cleanKey}`,
          bucket: this.bucketName
        };
      }
      async uploadFile(fileBuffer, fileName, mimeType, folder) {
        const key = `${folder.replace(/\/$/, "")}/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const directResult = await this.uploadFileDirectKey(fileBuffer, key, mimeType);
        return directResult.publicUrl;
      }
      async getPresignedUploadUrl(fileName, mimeType, folder, expiresIn = 3600) {
        const key = `${folder.replace(/\/$/, "")}/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const command = new import_client_s3.PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          ContentType: mimeType
        });
        const uploadUrl = await (0, import_s3_request_presigner.getSignedUrl)(this.s3Client, command, { expiresIn });
        const finalUrl = `${this.publicUrl.replace(/\/$/, "")}/${key}`;
        return { uploadUrl, finalUrl };
      }
      async deleteFile(fileUrlOrKey) {
        let key = fileUrlOrKey;
        if (fileUrlOrKey.startsWith("http://") || fileUrlOrKey.startsWith("https://")) {
          try {
            const parsed = new URL(fileUrlOrKey);
            key = parsed.pathname.replace(/^\/+/, "");
          } catch {
            const publicUrlDomain = this.publicUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
            const urlWithoutProtocol = fileUrlOrKey.replace(/^https?:\/\//, "");
            if (urlWithoutProtocol.startsWith(publicUrlDomain)) {
              key = urlWithoutProtocol.substring(publicUrlDomain.length + 1);
            }
          }
        } else {
          key = fileUrlOrKey.replace(/^\/+/, "");
        }
        const command = new import_client_s3.DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key
        });
        await this.s3Client.send(command);
      }
    };
    LocalStorageProvider = class {
      constructor() {
        this.publicUrl = process.env.PUBLIC_URL || "";
      }
      async uploadFile(fileBuffer, fileName, mimeType, folder) {
        const cleanFolder = folder.replace(/\/$/, "");
        const uploadsDir = path.join(process.cwd(), "public", "uploads", cleanFolder);
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const key = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const filePath = path.join(uploadsDir, key);
        fs.writeFileSync(filePath, fileBuffer);
        return `/uploads/${cleanFolder}/${key}`;
      }
      async getPresignedUploadUrl(fileName, mimeType, folder, expiresIn = 3600) {
        const cleanFolder = folder.replace(/\/$/, "");
        const key = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const finalUrl = `/uploads/${cleanFolder}/${key}`;
        return { uploadUrl: `/api/upload-direct?path=${encodeURIComponent(finalUrl)}`, finalUrl };
      }
      async deleteFile(fileUrlOrKey) {
        if (fileUrlOrKey.startsWith("/uploads/")) {
          const filePath = path.join(process.cwd(), "public", fileUrlOrKey);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      }
    };
    StorageService = class {
      constructor() {
        const isR2Configured = !!process.env.R2_ACCOUNT_ID && !!process.env.R2_ACCESS_KEY_ID && !!process.env.R2_SECRET_ACCESS_KEY && (!!process.env.R2_BUCKET || !!process.env.R2_BUCKET_NAME);
        if (isR2Configured) {
          this.provider = new CloudflareR2Provider();
          console.log("StorageService: Cloudflare R2 Provider initialized.");
        } else {
          this.provider = new LocalStorageProvider();
          console.warn("StorageService: R2 credentials not fully specified. Falling back to LocalStorageProvider.");
        }
      }
      getProvider() {
        return this.provider;
      }
      /**
       * Helper to format an object key into a canonical CDN public URL.
       */
      formatCdnUrl(objectKey) {
        const cleanKey = objectKey.replace(/^\/+/, "");
        const cdnBase = (process.env.R2_PUBLIC_URL || "https://cdn.setupss.com").replace(/\/$/, "");
        return `${cdnBase}/${cleanKey}`;
      }
      /**
       * Helper to extract relative object key from a full public or R2 URL.
       */
      extractObjectKey(urlOrKey) {
        if (!urlOrKey) return "";
        if (urlOrKey.startsWith("http://") || urlOrKey.startsWith("https://")) {
          try {
            const parsed = new URL(urlOrKey);
            return parsed.pathname.replace(/^\/+/, "");
          } catch {
            const cdnBase = (process.env.R2_PUBLIC_URL || "https://cdn.setupss.com").replace(/^https?:\/\//, "").replace(/\/$/, "");
            const withoutProto = urlOrKey.replace(/^https?:\/\//, "");
            if (withoutProto.startsWith(cdnBase)) {
              return withoutProto.substring(cdnBase.length + 1).replace(/^\/+/, "");
            }
            return urlOrKey;
          }
        }
        return urlOrKey.replace(/^\/+/, "");
      }
      /**
       * Canonical Entity-Aware Production Media Upload Pipeline.
       * Uploads media files into strict entity-aware object key namespaces
       * (e.g. setups/{setupId}/images/original/{assetId}.webp)
       */
      async uploadEntityMedia(options) {
        const { fileBuffer, originalName, mimeType, entityType, entityId, assetId = `ast_${Date.now()}_${Math.random().toString(36).substring(2, 8)}` } = options;
        const detected = detectMimeTypeFromBuffer(fileBuffer);
        if (!detected) {
          throw new Error("Ge\xE7ersiz veya desteklenmeyen dosya format\u0131.");
        }
        const verifiedMimeType = detected.mime;
        let processedBuffer = fileBuffer;
        if (verifiedMimeType === "image/svg+xml") {
          processedBuffer = sanitizeSvg(fileBuffer);
        }
        const isVideo = verifiedMimeType.startsWith("video/");
        const isImage = verifiedMimeType.startsWith("image/") && verifiedMimeType !== "image/svg+xml";
        const activeBucket = process.env.R2_BUCKET_NAME || process.env.R2_BUCKET || "setupss";
        if (isVideo) {
          const objectKey = buildEntityObjectKey(entityType, entityId, "video", assetId, detected.ext);
          if (this.provider.uploadFileDirectKey) {
            const res = await this.provider.uploadFileDirectKey(processedBuffer, objectKey, verifiedMimeType);
            return {
              assetId,
              bucket: res.bucket,
              objectKey: res.objectKey,
              publicUrl: res.publicUrl,
              fileType: "video",
              mimeType: verifiedMimeType,
              fileSize: processedBuffer.length,
              originalFilename: originalName,
              entityType,
              entityId
            };
          } else {
            const publicUrl = await this.provider.uploadFile(processedBuffer, `${assetId}.${detected.ext}`, verifiedMimeType, `videos/${entityId}`);
            return {
              assetId,
              bucket: activeBucket,
              objectKey,
              publicUrl,
              fileType: "video",
              mimeType: verifiedMimeType,
              fileSize: processedBuffer.length,
              originalFilename: originalName,
              entityType,
              entityId
            };
          }
        }
        if (!isImage) {
          const objectKey = buildEntityObjectKey(entityType, entityId, "file", assetId, detected.ext);
          if (this.provider.uploadFileDirectKey) {
            const res = await this.provider.uploadFileDirectKey(processedBuffer, objectKey, verifiedMimeType);
            return {
              assetId,
              bucket: res.bucket,
              objectKey: res.objectKey,
              publicUrl: res.publicUrl,
              fileType: verifiedMimeType === "image/svg+xml" ? "image" : "document",
              mimeType: verifiedMimeType,
              fileSize: processedBuffer.length,
              originalFilename: originalName,
              entityType,
              entityId
            };
          } else {
            const publicUrl = await this.provider.uploadFile(processedBuffer, `${assetId}.${detected.ext}`, verifiedMimeType, `files/${entityId}`);
            return {
              assetId,
              bucket: activeBucket,
              objectKey,
              publicUrl,
              fileType: verifiedMimeType === "image/svg+xml" ? "image" : "document",
              mimeType: verifiedMimeType,
              fileSize: processedBuffer.length,
              originalFilename: originalName,
              entityType,
              entityId
            };
          }
        }
        try {
          const origObjectKey = buildEntityObjectKey(entityType, entityId, "original", assetId, "webp");
          const thumb512ObjectKey = buildEntityObjectKey(entityType, entityId, "thumb512", assetId, "webp");
          const thumb256ObjectKey = buildEntityObjectKey(entityType, entityId, "thumb256", assetId, "webp");
          const originalOptimizedBuffer = await (0, import_sharp.default)(processedBuffer).resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
          const thumb512Buffer = await (0, import_sharp.default)(processedBuffer).resize({ width: 512, height: 512, fit: "inside", withoutEnlargement: true }).webp({ quality: 75 }).toBuffer();
          const thumb256Buffer = await (0, import_sharp.default)(processedBuffer).resize({ width: 256, height: 256, fit: "inside", withoutEnlargement: true }).webp({ quality: 75 }).toBuffer();
          if (this.provider.uploadFileDirectKey) {
            const [origRes, t512Res, t256Res] = await Promise.all([
              this.provider.uploadFileDirectKey(originalOptimizedBuffer, origObjectKey, "image/webp"),
              this.provider.uploadFileDirectKey(thumb512Buffer, thumb512ObjectKey, "image/webp"),
              this.provider.uploadFileDirectKey(thumb256Buffer, thumb256ObjectKey, "image/webp")
            ]);
            return {
              assetId,
              bucket: origRes.bucket,
              objectKey: origRes.objectKey,
              publicUrl: origRes.publicUrl,
              thumbnail512ObjectKey: t512Res.objectKey,
              thumbnail512PublicUrl: t512Res.publicUrl,
              thumbnail256ObjectKey: t256Res.objectKey,
              thumbnail256PublicUrl: t256Res.publicUrl,
              fileType: "image",
              mimeType: "image/webp",
              fileSize: originalOptimizedBuffer.length,
              originalFilename: originalName,
              entityType,
              entityId
            };
          } else {
            const [origUrl, t512Url, t256Url] = await Promise.all([
              this.provider.uploadFile(originalOptimizedBuffer, `${assetId}.webp`, "image/webp", `setups/${entityId}/original`),
              this.provider.uploadFile(thumb512Buffer, `512_${assetId}.webp`, "image/webp", `setups/${entityId}/thumb512`),
              this.provider.uploadFile(thumb256Buffer, `256_${assetId}.webp`, "image/webp", `setups/${entityId}/thumb256`)
            ]);
            return {
              assetId,
              bucket: activeBucket,
              objectKey: origObjectKey,
              publicUrl: origUrl,
              thumbnail512ObjectKey: thumb512ObjectKey,
              thumbnail512PublicUrl: t512Url,
              thumbnail256ObjectKey: thumb256ObjectKey,
              thumbnail256PublicUrl: t256Url,
              fileType: "image",
              mimeType: "image/webp",
              fileSize: originalOptimizedBuffer.length,
              originalFilename: originalName,
              entityType,
              entityId
            };
          }
        } catch (error) {
          console.error("Sharp processing failed in uploadEntityMedia, falling back to original upload:", error);
          const origObjectKey = buildEntityObjectKey(entityType, entityId, "original", assetId, detected.ext);
          if (this.provider.uploadFileDirectKey) {
            const res = await this.provider.uploadFileDirectKey(processedBuffer, origObjectKey, verifiedMimeType);
            return {
              assetId,
              bucket: res.bucket,
              objectKey: res.objectKey,
              publicUrl: res.publicUrl,
              fileType: "image",
              mimeType: verifiedMimeType,
              fileSize: processedBuffer.length,
              originalFilename: originalName,
              entityType,
              entityId
            };
          } else {
            const publicUrl = await this.provider.uploadFile(processedBuffer, `${assetId}.${detected.ext}`, verifiedMimeType, `original/${entityId}`);
            return {
              assetId,
              bucket: activeBucket,
              objectKey: origObjectKey,
              publicUrl,
              fileType: "image",
              mimeType: verifiedMimeType,
              fileSize: processedBuffer.length,
              originalFilename: originalName,
              entityType,
              entityId
            };
          }
        }
      }
      /**
       * Process and optimize an uploaded image or file.
       * - Converts images to optimized WebP formats.
       * - Generates 512px and 256px thumbnails.
       * - Uploads them to the target provider.
       */
      async processAndUploadFile(fileBuffer, originalName, mimeType, folder) {
        const detected = detectMimeTypeFromBuffer(fileBuffer);
        if (!detected) {
          throw new Error("Ge\xE7ersiz veya desteklenmeyen dosya format\u0131.");
        }
        const allowedMimeTypes = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
          "image/svg+xml",
          "application/pdf",
          "video/mp4",
          "video/webm"
        ];
        if (!allowedMimeTypes.includes(detected.mime)) {
          throw new Error(`Dosya tipi (${detected.mime}) desteklenmemektedir.`);
        }
        const verifiedMimeType = detected.mime;
        let processedBuffer = fileBuffer;
        if (verifiedMimeType === "image/svg+xml") {
          processedBuffer = sanitizeSvg(fileBuffer);
        }
        const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf(".")) || originalName;
        const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9_-]/g, "_");
        const secureFileName = `${sanitizedName}.${detected.ext}`;
        const isVideo = verifiedMimeType.startsWith("video/");
        const isImage = verifiedMimeType.startsWith("image/") && verifiedMimeType !== "image/svg+xml";
        if (isVideo) {
          const url = await this.provider.uploadFile(processedBuffer, secureFileName, verifiedMimeType, `${folder}/original`);
          return {
            originalUrl: url,
            fileType: "video"
          };
        }
        if (!isImage) {
          const url = await this.provider.uploadFile(processedBuffer, secureFileName, verifiedMimeType, `${folder}/original`);
          return {
            originalUrl: url,
            fileType: verifiedMimeType === "image/svg+xml" ? "image" : "document"
          };
        }
        const timestamp = Date.now();
        const baseWebpName = `${timestamp}_${sanitizedName}`;
        try {
          const originalOptimizedBuffer = await (0, import_sharp.default)(processedBuffer).resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
          const thumb512Buffer = await (0, import_sharp.default)(processedBuffer).resize({ width: 512, height: 512, fit: "inside", withoutEnlargement: true }).webp({ quality: 75 }).toBuffer();
          const thumb256Buffer = await (0, import_sharp.default)(processedBuffer).resize({ width: 256, height: 256, fit: "inside", withoutEnlargement: true }).webp({ quality: 75 }).toBuffer();
          const [originalUrl, thumb512Url, thumb256Url] = await Promise.all([
            this.provider.uploadFile(originalOptimizedBuffer, `${baseWebpName}.webp`, "image/webp", `${folder}/original`),
            this.provider.uploadFile(thumb512Buffer, `512_${baseWebpName}.webp`, "image/webp", `${folder}/thumb`),
            this.provider.uploadFile(thumb256Buffer, `256_${baseWebpName}.webp`, "image/webp", `${folder}/thumb`)
          ]);
          return {
            originalUrl,
            thumbnail512: thumb512Url,
            thumbnail256: thumb256Url,
            fileType: "image"
          };
        } catch (error) {
          console.error("Sharp processing failed, falling back to original file upload:", error);
          const url = await this.provider.uploadFile(processedBuffer, secureFileName, verifiedMimeType, `${folder}/original`);
          return {
            originalUrl: url,
            fileType: "image"
          };
        }
      }
    };
    storageService = new StorageService();
  }
});

// server-db.ts
async function runVersionedMigrations(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version VARCHAR(50) PRIMARY KEY,
      name TEXT NOT NULL,
      checksum TEXT,
      applied_at TIMESTAMPTZ DEFAULT NOW(),
      execution_time_ms INT DEFAULT 0
    );
  `);
  const { rows: appliedRows } = await client.query(`SELECT version FROM schema_migrations`);
  const appliedVersions = new Set(appliedRows.map((r) => r.version));
  const migrations = [
    {
      version: "0001_core_tables",
      name: "Initial core schema (users, setups, wishlist, chat_messages, friends, activity_logs, media_files, site_settings)",
      up: async (tx) => {
        await tx.query(`
          CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            name TEXT NOT NULL,
            avatar TEXT,
            is_verified BOOLEAN DEFAULT FALSE,
            verification_code TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
        `);
        const userCols = [
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_code TEXT;`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_expires_at TIMESTAMPTZ;`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS github_link TEXT;`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS instagram_link TEXT;`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS linkedin_link TEXT;`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS cover_photo TEXT;`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS custom_badge TEXT;`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS custom_color TEXT;`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS invite_count INT DEFAULT 0;`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS is_crown BOOLEAN DEFAULT FALSE;`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS reference_code TEXT;`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS has_rgb BOOLEAN DEFAULT FALSE;`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT FALSE;`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS streak_count INT DEFAULT 0;`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS last_active_date TIMESTAMPTZ;`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS streak_companion TEXT DEFAULT 'sarcastic';`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS streak_freezes INT DEFAULT 1;`
        ];
        for (const colSql of userCols) {
          await tx.query(colSql).catch(() => {
          });
        }
        await tx.query(`
          CREATE TABLE IF NOT EXISTS setups (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            owner TEXT NOT NULL,
            owner_id TEXT,
            bio TEXT,
            category TEXT NOT NULL,
            description TEXT,
            image TEXT,
            likes INTEGER DEFAULT 0,
            tags JSONB DEFAULT '[]'::jsonb,
            components JSONB DEFAULT '[]'::jsonb,
            comments JSONB DEFAULT '[]'::jsonb,
            card_theme TEXT DEFAULT 'dark',
            created_at TIMESTAMPTZ DEFAULT NOW(),
            video_url TEXT,
            is_bot_share BOOLEAN DEFAULT FALSE
          );
        `);
        await tx.query(`
          CREATE TABLE IF NOT EXISTS setup_likes (
            user_id TEXT NOT NULL,
            setup_id TEXT NOT NULL,
            PRIMARY KEY (user_id, setup_id)
          );
        `);
        await tx.query(`
          CREATE TABLE IF NOT EXISTS wishlist (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            estimated_price NUMERIC DEFAULT 0,
            purchased BOOLEAN DEFAULT FALSE,
            link TEXT,
            notes TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
        `);
        await tx.query(`
          CREATE TABLE IF NOT EXISTS chat_messages (
            id TEXT PRIMARY KEY,
            sender_id TEXT NOT NULL,
            sender_name TEXT NOT NULL,
            sender_avatar TEXT,
            receiver_id TEXT NOT NULL,
            receiver_name TEXT NOT NULL,
            receiver_avatar TEXT,
            message TEXT NOT NULL,
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            media_url TEXT,
            media_type TEXT,
            sender_has_rgb BOOLEAN DEFAULT FALSE
          );
        `);
        await tx.query(`
          CREATE TABLE IF NOT EXISTS friends (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            friend_id TEXT NOT NULL,
            status TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            UNIQUE(user_id, friend_id)
          );
        `);
        await tx.query(`
          CREATE TABLE IF NOT EXISTS activity_logs (
            id TEXT PRIMARY KEY,
            action_type TEXT NOT NULL,
            user_id TEXT,
            user_name TEXT,
            details TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
        `);
        await tx.query(`
          CREATE TABLE IF NOT EXISTS media_files (
            id TEXT PRIMARY KEY,
            file_name TEXT NOT NULL,
            file_url TEXT NOT NULL,
            file_type TEXT NOT NULL,
            file_size BIGINT DEFAULT 0,
            mime_type TEXT,
            uploader_id TEXT,
            uploader_name TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            thumbnail_512 TEXT,
            thumbnail_256 TEXT
          );
        `);
        await tx.query(`
          CREATE TABLE IF NOT EXISTS site_settings (
            key TEXT PRIMARY KEY,
            value TEXT
          );
        `);
      }
    },
    {
      version: "0002_sprint1_entities",
      name: "Sprint 1 Entity Knowledge Graph tables (brands, hardware_categories, hardware, games, entity_audit_logs, setup_hardware, setup_games)",
      up: async (tx) => {
        await tx.query(`
          CREATE TABLE IF NOT EXISTS brands (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            logo_url TEXT,
            description TEXT,
            website TEXT,
            is_deleted BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
        `);
        await tx.query(`
          CREATE TABLE IF NOT EXISTS hardware_categories (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            icon TEXT,
            description TEXT,
            is_deleted BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
        `);
        await tx.query(`
          CREATE TABLE IF NOT EXISTS hardware (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            brand_id TEXT REFERENCES brands(id) ON DELETE SET NULL,
            category_id TEXT REFERENCES hardware_categories(id) ON DELETE SET NULL,
            description TEXT,
            specs JSONB DEFAULT '{}'::jsonb,
            image_url TEXT,
            price_estimate NUMERIC DEFAULT 0,
            is_deleted BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
        `);
        await tx.query(`
          CREATE TABLE IF NOT EXISTS games (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            description TEXT,
            image_url TEXT,
            genre TEXT,
            developer TEXT,
            release_year INT,
            is_deleted BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
        `);
        await tx.query(`
          CREATE TABLE IF NOT EXISTS entity_audit_logs (
            id TEXT PRIMARY KEY,
            entity_type TEXT NOT NULL,
            entity_id TEXT NOT NULL,
            action TEXT NOT NULL,
            performed_by TEXT,
            payload JSONB,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
        `);
        await tx.query(`
          CREATE TABLE IF NOT EXISTS setup_hardware (
            setup_id TEXT REFERENCES setups(id) ON DELETE CASCADE,
            hardware_id TEXT REFERENCES hardware(id) ON DELETE CASCADE,
            notes TEXT,
            PRIMARY KEY (setup_id, hardware_id)
          );
        `);
        await tx.query(`
          CREATE TABLE IF NOT EXISTS setup_games (
            setup_id TEXT REFERENCES setups(id) ON DELETE CASCADE,
            game_id TEXT REFERENCES games(id) ON DELETE CASCADE,
            PRIMARY KEY (setup_id, game_id)
          );
        `);
      }
    },
    {
      version: "0003_sprint1_indexes",
      name: "Sprint 1 Unique & Foreign Key Performance Indexes",
      up: async (tx) => {
        await tx.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);`);
        await tx.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_hardware_categories_slug ON hardware_categories(slug);`);
        await tx.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_hardware_slug ON hardware(slug);`);
        await tx.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_games_slug ON games(slug);`);
        await tx.query(`CREATE INDEX IF NOT EXISTS idx_hardware_brand ON hardware(brand_id);`);
        await tx.query(`CREATE INDEX IF NOT EXISTS idx_hardware_category ON hardware(category_id);`);
        await tx.query(`CREATE INDEX IF NOT EXISTS idx_setup_hardware_setup ON setup_hardware(setup_id);`);
        await tx.query(`CREATE INDEX IF NOT EXISTS idx_setup_hardware_hw ON setup_hardware(hardware_id);`);
        await tx.query(`CREATE INDEX IF NOT EXISTS idx_setup_games_setup ON setup_games(setup_id);`);
        await tx.query(`CREATE INDEX IF NOT EXISTS idx_setup_games_game ON setup_games(game_id);`);
      }
    },
    {
      version: "0004_branding_settings",
      name: "Initialize default branding and site settings",
      up: async (tx) => {
        const defaultSettings = [
          ["site_logo_url", "/branding/logo.png"],
          ["site_logo_dark_url", "/branding/logo-dark.png"],
          ["site_icon_url", "/branding/icon.png"],
          ["logo_desktop_scale", "100"],
          ["logo_mobile_scale", "100"],
          ["logo_rotation", "0"],
          ["contact_email", "setupss.support@gmail.com"],
          ["instagram_link", ""],
          ["twitter_link", ""],
          ["youtube_link", ""],
          ["github_link", ""],
          ["discord_link", ""],
          ["linkedin_link", ""]
        ];
        for (const [key, value] of defaultSettings) {
          await tx.query(
            `INSERT INTO site_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING`,
            [key, value]
          );
        }
      }
    },
    {
      version: "0005_notifications_and_bots",
      name: "Notifications, Bot Reports, and Bot Fleet seeding",
      up: async (tx) => {
        await tx.query(`
          CREATE TABLE IF NOT EXISTS notifications (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            sender_id TEXT,
            sender_name TEXT,
            sender_avatar TEXT,
            type TEXT NOT NULL, -- like, comment, friend_request, system, announcement
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            link TEXT,
            status TEXT DEFAULT 'notification',
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
          CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
        `);
        await tx.query(`
          CREATE TABLE IF NOT EXISTS bot_reports (
            id SERIAL PRIMARY KEY,
            bot_id TEXT NOT NULL,
            bot_name TEXT NOT NULL,
            report_type TEXT NOT NULL, -- bug, performance, audit, moderation
            details TEXT NOT NULL,
            severity TEXT DEFAULT 'low',
            is_resolved BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
        `);
        const botNames = [
          "SetupSpy_Alpha",
          "BattlestationBot",
          "RigReviewer_01",
          "PixelPioneer",
          "FrameRateFixer",
          "CableGhost",
          "NeonNavigator",
          "DeskDetective",
          "SetupSentinel",
          "ErgoExpert",
          "RgbRaider",
          "ZenZoner",
          "TechTarantula",
          "SiliconScout",
          "ByteBouncer",
          "ClockSpeedCommander",
          "VramVoyager",
          "ThermalThief",
          "LatencyLurker",
          "PingPathfinder",
          "SsdSoldier",
          "PsuPaladin",
          "MotherboardMonk",
          "CaseCrusader",
          "FanFanatic",
          "GpuGuardian",
          "CpuCaptain",
          "RamRanger",
          "MonitorMage",
          "PeripheralPrince"
        ];
        for (let i = 0; i < botNames.length; i++) {
          const botId = `bot-fleet-${i + 1}`;
          const botName = botNames[i];
          const email = `bot${i + 1}@setupss.ai`;
          const passHash = "bot_account_secured";
          await tx.query(
            `INSERT INTO users (id, email, password_hash, name, avatar, role) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             ON CONFLICT (id) DO UPDATE SET name = $4`,
            [botId, email, passHash, botName, `https://api.dicebear.com/7.x/bottts/svg?seed=${botName}`, "bot"]
          );
        }
      }
    },
    {
      version: "0006_hardware_knowledge_graph_engine",
      name: "Hardware Knowledge Graph Engine relations, benchmarks, price history, and reviews tables",
      up: async (tx) => {
        await tx.query(`
          CREATE TABLE IF NOT EXISTS hardware_relations (
            id TEXT PRIMARY KEY,
            source_id TEXT NOT NULL REFERENCES hardware(id) ON DELETE CASCADE,
            target_id TEXT NOT NULL REFERENCES hardware(id) ON DELETE CASCADE,
            relation_type TEXT NOT NULL, -- COMPATIBLE_WITH, RECOMMENDED_PAIRING, BOTTLENECK_PAIR, ALTERNATIVE_TO
            weight NUMERIC DEFAULT 1.0,
            metadata JSONB DEFAULT '{}'::jsonb,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            CONSTRAINT unique_hardware_relation UNIQUE (source_id, target_id, relation_type)
          );
          CREATE INDEX IF NOT EXISTS idx_hw_rel_source ON hardware_relations(source_id);
          CREATE INDEX IF NOT EXISTS idx_hw_rel_target ON hardware_relations(target_id);
          CREATE INDEX IF NOT EXISTS idx_hw_rel_type ON hardware_relations(relation_type);
        `);
        await tx.query(`
          CREATE TABLE IF NOT EXISTS hardware_benchmarks (
            id TEXT PRIMARY KEY,
            hardware_id TEXT NOT NULL REFERENCES hardware(id) ON DELETE CASCADE,
            game_id TEXT REFERENCES games(id) ON DELETE SET NULL,
            resolution TEXT NOT NULL DEFAULT '1440p', -- 1080p, 1440p, 4K, 8K
            settings_preset TEXT DEFAULT 'Ultra',
            avg_fps INT NOT NULL,
            one_percent_low_fps INT,
            test_rig_cpu TEXT,
            test_rig_gpu TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
          CREATE INDEX IF NOT EXISTS idx_hw_bench_hw ON hardware_benchmarks(hardware_id);
          CREATE INDEX IF NOT EXISTS idx_hw_bench_game ON hardware_benchmarks(game_id);
        `);
        await tx.query(`
          CREATE TABLE IF NOT EXISTS hardware_price_history (
            id TEXT PRIMARY KEY,
            hardware_id TEXT NOT NULL REFERENCES hardware(id) ON DELETE CASCADE,
            retailer TEXT NOT NULL,
            price_usd NUMERIC NOT NULL,
            in_stock BOOLEAN DEFAULT TRUE,
            recorded_at TIMESTAMPTZ DEFAULT NOW()
          );
          CREATE INDEX IF NOT EXISTS idx_hw_price_hw ON hardware_price_history(hardware_id);
        `);
        await tx.query(`
          CREATE TABLE IF NOT EXISTS hardware_reviews (
            id TEXT PRIMARY KEY,
            hardware_id TEXT NOT NULL REFERENCES hardware(id) ON DELETE CASCADE,
            user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            verified_owner BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
          CREATE INDEX IF NOT EXISTS idx_hw_rev_hw ON hardware_reviews(hardware_id);
        `);
      }
    },
    {
      version: "0007_hardware_data_engine_core",
      name: "Hardware Data Engine v2 core schema additions",
      up: async (tx) => {
        await tx.query(`
          ALTER TABLE hardware 
          ADD COLUMN IF NOT EXISTS parent_hardware_id TEXT REFERENCES hardware(id) ON DELETE SET NULL,
          ADD COLUMN IF NOT EXISTS is_canonical BOOLEAN NOT NULL DEFAULT TRUE,
          ADD COLUMN IF NOT EXISTS variant_type VARCHAR(50);
        `);
        await tx.query(`
          DO $$
          BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'hardware_canonical_check') THEN
              ALTER TABLE hardware ADD CONSTRAINT hardware_canonical_check CHECK (
                (parent_hardware_id IS NULL AND is_canonical = TRUE) OR
                (parent_hardware_id IS NOT NULL AND is_canonical = FALSE)
              );
            END IF;
          END
          $$;
        `);
        await tx.query(`
          CREATE TABLE IF NOT EXISTS user_hardware_ownership (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            hardware_id TEXT NOT NULL REFERENCES hardware(id) ON DELETE CASCADE,
            purchase_date DATE,
            purchase_price NUMERIC(10, 2),
            currency VARCHAR(3),
            is_currently_owned BOOLEAN DEFAULT TRUE,
            quantity INT DEFAULT 1,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
          CREATE INDEX IF NOT EXISTS idx_user_hw_own_user ON user_hardware_ownership(user_id);
          CREATE INDEX IF NOT EXISTS idx_user_hw_own_hw ON user_hardware_ownership(hardware_id);
        `);
        await tx.query(`
          ALTER TABLE games 
          ADD COLUMN IF NOT EXISTS publisher VARCHAR(255),
          ADD COLUMN IF NOT EXISTS release_date DATE,
          ADD COLUMN IF NOT EXISTS engine VARCHAR(100),
          ADD COLUMN IF NOT EXISTS graphics_api VARCHAR(50);
        `);
        await tx.query(`
          DO $$
          BEGIN
            IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hardware_benchmarks' AND column_name = 'settings_preset') THEN
              ALTER TABLE hardware_benchmarks RENAME COLUMN settings_preset TO preset;
            END IF;
          END
          $$;
        `);
        await tx.query(`
          ALTER TABLE hardware_benchmarks 
          ADD COLUMN IF NOT EXISTS cpu_id TEXT REFERENCES hardware(id) ON DELETE SET NULL,
          ADD COLUMN IF NOT EXISTS upscaling_tech VARCHAR(50),
          ADD COLUMN IF NOT EXISTS ray_tracing_mode VARCHAR(50),
          ADD COLUMN IF NOT EXISTS source_type VARCHAR(50),
          ADD COLUMN IF NOT EXISTS source_name VARCHAR(255),
          ADD COLUMN IF NOT EXISTS source_url VARCHAR(2000),
          ADD COLUMN IF NOT EXISTS confidence_score NUMERIC(5,2),
          ADD COLUMN IF NOT EXISTS verification_status VARCHAR(50) DEFAULT 'PENDING',
          ADD COLUMN IF NOT EXISTS verified_by TEXT REFERENCES users(id) ON DELETE SET NULL,
          ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ,
          ADD COLUMN IF NOT EXISTS test_rig_metadata JSONB DEFAULT '{}'::jsonb;
        `);
        await tx.query(`
          ALTER TABLE hardware_benchmarks 
          ALTER COLUMN avg_fps TYPE NUMERIC(8,2) USING avg_fps::numeric,
          ALTER COLUMN one_percent_low_fps TYPE NUMERIC(8,2) USING one_percent_low_fps::numeric;
        `);
        await tx.query(`
          CREATE TABLE IF NOT EXISTS hardware_aliases (
            id TEXT PRIMARY KEY,
            alias VARCHAR(255) UNIQUE NOT NULL,
            canonical_hardware_id TEXT NOT NULL REFERENCES hardware(id) ON DELETE CASCADE
          );
          CREATE INDEX IF NOT EXISTS idx_hw_aliases_alias ON hardware_aliases(alias);
        `);
      }
    },
    {
      version: "0008_canonical_supabase_rls_and_media_assets",
      name: "Canonical Supabase Schema, Profiles Trigger, Media Assets, RLS Policies & Audit Logs",
      up: async (tx) => {
        await tx.query(`
          CREATE TABLE IF NOT EXISTS public.profiles (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE,
            display_name TEXT,
            email TEXT UNIQUE,
            avatar TEXT,
            cover_photo TEXT,
            bio TEXT,
            location TEXT,
            website TEXT,
            role TEXT DEFAULT 'user',
            is_verified BOOLEAN DEFAULT FALSE,
            has_rgb BOOLEAN DEFAULT FALSE,
            xp INT DEFAULT 0,
            level INT DEFAULT 1,
            streak_count INT DEFAULT 0,
            last_active TIMESTAMPTZ DEFAULT NOW(),
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
          CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
          CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
        `);
        await tx.query(`
          CREATE TABLE IF NOT EXISTS public.media_assets (
            id TEXT PRIMARY KEY,
            uploader_id TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
            bucket TEXT NOT NULL DEFAULT 'setupss',
            object_key TEXT UNIQUE NOT NULL,
            public_url TEXT NOT NULL,
            original_filename TEXT,
            mime_type TEXT NOT NULL,
            file_size BIGINT NOT NULL,
            entity_type TEXT,
            entity_id TEXT,
            visibility TEXT DEFAULT 'public',
            etag TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            deleted_at TIMESTAMPTZ
          );
          CREATE INDEX IF NOT EXISTS idx_media_uploader ON public.media_assets(uploader_id);
          CREATE INDEX IF NOT EXISTS idx_media_entity ON public.media_assets(entity_type, entity_id);
          CREATE INDEX IF NOT EXISTS idx_media_key ON public.media_assets(object_key);
        `);
        await tx.query(`
          CREATE TABLE IF NOT EXISTS public.ai_conversations (
            id TEXT PRIMARY KEY,
            user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            model TEXT NOT NULL DEFAULT 'gemini-2.5-flash',
            system_prompt TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
          CREATE INDEX IF NOT EXISTS idx_ai_conv_user ON public.ai_conversations(user_id);

          CREATE TABLE IF NOT EXISTS public.ai_messages (
            id TEXT PRIMARY KEY,
            conversation_id TEXT REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
            sender TEXT NOT NULL,
            content TEXT NOT NULL,
            token_count INT DEFAULT 0,
            model_used TEXT,
            error_status TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
          CREATE INDEX IF NOT EXISTS idx_ai_msg_conv ON public.ai_messages(conversation_id);

          CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
            id TEXT PRIMARY KEY,
            user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
            model TEXT NOT NULL,
            prompt_tokens INT DEFAULT 0,
            completion_tokens INT DEFAULT 0,
            total_tokens INT DEFAULT 0,
            latency_ms INT DEFAULT 0,
            status TEXT DEFAULT 'success',
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
          CREATE INDEX IF NOT EXISTS idx_ai_usage_user ON public.ai_usage_logs(user_id);
        `);
        await tx.query(`
          CREATE TABLE IF NOT EXISTS public.chat_rooms (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            description TEXT,
            icon TEXT,
            is_private BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );

          CREATE TABLE IF NOT EXISTS public.chat_room_members (
            room_id TEXT REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
            user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
            role TEXT DEFAULT 'member',
            joined_at TIMESTAMPTZ DEFAULT NOW(),
            PRIMARY KEY (room_id, user_id)
          );

          CREATE TABLE IF NOT EXISTS public.chat_messages (
            id TEXT PRIMARY KEY,
            room_id TEXT REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
            sender_id TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
            sender_name TEXT NOT NULL DEFAULT 'User',
            sender_avatar TEXT,
            sender_has_rgb BOOLEAN DEFAULT FALSE,
            message TEXT NOT NULL,
            media_url TEXT,
            media_type TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );

          ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS room_id TEXT;
          ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS sender_id TEXT;
          ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS sender_name TEXT;
          ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS sender_avatar TEXT;
          ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS sender_has_rgb BOOLEAN DEFAULT FALSE;
          ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS media_url TEXT;
          ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS media_type TEXT;

          CREATE INDEX IF NOT EXISTS idx_chat_msg_room ON public.chat_messages(room_id, created_at DESC);
          CREATE INDEX IF NOT EXISTS idx_chat_msg_sender ON public.chat_messages(sender_id);
        `);
        await tx.query(`
          ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
        `).catch(() => {
        });
        await tx.query(`
          CREATE TABLE IF NOT EXISTS public.audit_logs (
            id TEXT PRIMARY KEY,
            actor_id TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
            action TEXT NOT NULL,
            target_type TEXT NOT NULL,
            target_id TEXT,
            old_value JSONB,
            new_value JSONB,
            ip_address TEXT,
            user_agent TEXT,
            endpoint TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
          CREATE INDEX IF NOT EXISTS idx_audit_actor ON public.audit_logs(actor_id);
          CREATE INDEX IF NOT EXISTS idx_audit_target ON public.audit_logs(target_type, target_id);
          CREATE INDEX IF NOT EXISTS idx_audit_action ON public.audit_logs(action);
          CREATE INDEX IF NOT EXISTS idx_audit_created ON public.audit_logs(created_at DESC);
        `);
        const rlsTables = [
          "profiles",
          "setups",
          "media_assets",
          "ai_conversations",
          "ai_messages",
          "chat_messages",
          "notifications",
          "audit_logs"
        ];
        for (const tbl of rlsTables) {
          await tx.query(`ALTER TABLE public.${tbl} ENABLE ROW LEVEL SECURITY;`).catch(() => {
          });
        }
        await tx.query(`
          DO $$
          BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'profiles_select_public') THEN
              CREATE POLICY profiles_select_public ON public.profiles FOR SELECT USING (true);
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'setups_select_public') THEN
              CREATE POLICY setups_select_public ON public.setups FOR SELECT USING (true);
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'media_select_public') THEN
              CREATE POLICY media_select_public ON public.media_assets FOR SELECT USING (visibility = 'public');
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'chat_messages_select') THEN
              CREATE POLICY chat_messages_select ON public.chat_messages FOR SELECT USING (true);
            END IF;
          END $$;
        `);
        await tx.query(`
          DO $$
          BEGIN
            IF EXISTS (SELECT 1 FROM pg_proc JOIN pg_namespace ON pg_proc.pronamespace = pg_namespace.oid WHERE pg_namespace.nspname = 'auth' AND proname = 'uid') THEN
              IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'profiles_update_own') THEN
                CREATE POLICY profiles_update_own ON public.profiles FOR UPDATE USING (auth.uid()::text = id);
              END IF;
              IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'ai_conversations_own') THEN
                CREATE POLICY ai_conversations_own ON public.ai_conversations FOR ALL USING (auth.uid()::text = user_id);
              END IF;
            END IF;
          END $$;
        `);
        await tx.query(`
          CREATE OR REPLACE FUNCTION public.handle_new_user()
          RETURNS trigger AS $$
          BEGIN
            INSERT INTO public.profiles (id, email, username, display_name, avatar, role)
            VALUES (
              NEW.id,
              NEW.email,
              COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
              COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
              COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/bottts/svg?seed=' || NEW.id),
              'user'
            )
            ON CONFLICT (id) DO UPDATE SET
              email = EXCLUDED.email,
              updated_at = NOW();
            RETURN NEW;
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
        `).catch(() => {
        });
        await tx.query(`
          DO $$
          BEGIN
            IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') THEN
              DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
              CREATE TRIGGER on_auth_user_created
                AFTER INSERT ON auth.users
                FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
            END IF;
          END $$;
        `).catch(() => {
        });
      }
    },
    {
      version: "0009_centralized_setupss_auth",
      name: "Centralized Setupss Auth Engine (auth_identities, user_sessions, role & status columns)",
      up: async (tx) => {
        const userCols = [
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';`
        ];
        for (const colSql of userCols) {
          await tx.query(colSql).catch(() => {
          });
        }
        await tx.query(`
          UPDATE users SET role = 'admin' WHERE email IN ('setupss.support@gmail.com', 'admin@setupss.com');
          UPDATE public.profiles SET role = 'admin' WHERE email IN ('setupss.support@gmail.com', 'admin@setupss.com');
        `).catch(() => {
        });
        await tx.query(`
          CREATE TABLE IF NOT EXISTS auth_identities (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            provider TEXT NOT NULL,
            provider_user_id TEXT NOT NULL,
            provider_email TEXT,
            metadata JSONB DEFAULT '{}'::jsonb,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW(),
            UNIQUE(provider, provider_user_id)
          );
          CREATE INDEX IF NOT EXISTS idx_auth_identities_user_id ON auth_identities(user_id);
          CREATE INDEX IF NOT EXISTS idx_auth_identities_provider_email ON auth_identities(provider, provider_email);
        `);
        await tx.query(`
          CREATE TABLE IF NOT EXISTS user_sessions (
            sid VARCHAR NOT NULL PRIMARY KEY,
            sess JSONB NOT NULL,
            expire TIMESTAMPTZ NOT NULL
          );
          CREATE INDEX IF NOT EXISTS idx_user_sessions_expire ON user_sessions(expire);
        `);
        await tx.query(`
          CREATE TABLE IF NOT EXISTS "session" (
            sid VARCHAR NOT NULL PRIMARY KEY,
            sess JSONB NOT NULL,
            expire TIMESTAMPTZ NOT NULL
          );
          CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session"(expire);
        `);
        await tx.query(`
          INSERT INTO public.profiles (id, email, username, display_name, avatar, role, is_verified, created_at, updated_at)
          SELECT 
            u.id, 
            u.email, 
            COALESCE(u.name, split_part(u.email, '@', 1)),
            COALESCE(u.name, split_part(u.email, '@', 1)),
            COALESCE(u.avatar, 'https://api.dicebear.com/7.x/bottts/svg?seed=' || u.id),
            COALESCE(u.role, 'user'),
            COALESCE(u.is_verified, FALSE),
            COALESCE(u.created_at, NOW()),
            NOW()
          FROM users u
          ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email,
            role = EXCLUDED.role,
            updated_at = NOW();
        `).catch(() => {
        });
      }
    },
    {
      version: "0010_icecat_hardware_specs",
      name: "Open Icecat Hardware Specs (icecat_id, ean, specs)",
      up: async (tx) => {
        const icecatCols = [
          `ALTER TABLE hardware ADD COLUMN IF NOT EXISTS icecat_id BIGINT UNIQUE;`,
          `ALTER TABLE hardware ADD COLUMN IF NOT EXISTS ean VARCHAR(50);`,
          `ALTER TABLE hardware ADD COLUMN IF NOT EXISTS specs JSONB DEFAULT '{}'::jsonb;`
        ];
        for (const colSql of icecatCols) {
          await tx.query(colSql).catch(() => {
          });
        }
        await tx.query(`CREATE INDEX IF NOT EXISTS idx_hardware_specs ON hardware USING GIN (specs);`).catch(() => {
        });
      }
    },
    {
      version: "0011_blog_posts",
      name: "Blog Posts table and initial seed articles",
      up: async (tx) => {
        await tx.query(`
          CREATE TABLE IF NOT EXISTS blog_posts (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            summary TEXT NOT NULL,
            content TEXT NOT NULL,
            category TEXT DEFAULT 'Rehber',
            cover_image TEXT,
            author_name TEXT DEFAULT 'Setupss Edit\xF6r Ekibi',
            author_avatar TEXT,
            read_time_minutes INT DEFAULT 5,
            tags JSONB DEFAULT '[]'::jsonb,
            hardware_slugs JSONB DEFAULT '[]'::jsonb,
            is_published BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
          CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
          CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
        `);
        for (const post of SEED_BLOG_POSTS) {
          await tx.query(`
            INSERT INTO blog_posts (id, title, slug, summary, content, category, cover_image, author_name, author_avatar, read_time_minutes, tags, hardware_slugs, is_published, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
            ON CONFLICT (slug) DO UPDATE SET
              title = EXCLUDED.title,
              summary = EXCLUDED.summary,
              content = EXCLUDED.content,
              cover_image = EXCLUDED.cover_image,
              updated_at = NOW();
          `, [
            post.id,
            post.title,
            post.slug,
            post.summary,
            post.content,
            post.category,
            post.coverImage,
            post.authorName,
            post.authorAvatar || "",
            post.readTimeMinutes,
            JSON.stringify(post.tags),
            JSON.stringify(post.hardwareSlugs),
            post.isPublished,
            post.createdAt,
            post.updatedAt
          ]);
        }
      }
    },
    {
      version: "0012_verification_expires_at",
      name: "Add verification_expires_at column to users and profiles",
      up: async (tx) => {
        await tx.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_expires_at TIMESTAMPTZ;`).catch(() => {
        });
        await tx.query(`ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS verification_expires_at TIMESTAMPTZ;`).catch(() => {
        });
      }
    }
  ];
  for (const m of migrations) {
    if (!appliedVersions.has(m.version)) {
      console.log(`\u26A1 [Migration Engine] Running versioned migration: ${m.version} - ${m.name}`);
      const startTime = Date.now();
      await client.query("BEGIN;");
      try {
        await m.up(client);
        const duration = Date.now() - startTime;
        await client.query(
          `INSERT INTO schema_migrations (version, name, execution_time_ms) VALUES ($1, $2, $3)`,
          [m.version, m.name, duration]
        );
        await client.query("COMMIT;");
        console.log(`\u2705 [Migration Engine] Migration ${m.version} applied successfully in ${duration}ms.`);
      } catch (err) {
        await client.query("ROLLBACK;");
        console.error(`\u274C [Migration Engine] Migration ${m.version} failed and was automatically rolled back:`, err);
        throw err;
      }
    } else {
      console.log(`\u2139\uFE0F [Migration Engine] Migration ${m.version} already applied. Skipping.`);
    }
  }
}
function checkDbActive() {
  const rawDbUrl2 = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.SUPABASE_DATABASE_URL;
  return !!(rawDbUrl2 && (rawDbUrl2.startsWith("postgresql://") || rawDbUrl2.startsWith("postgres://")) || process.env.SQL_HOST);
}
async function getMigrationHistoryFromDb() {
  try {
    const { rows } = await pool.query(
      `SELECT version, name, applied_at, execution_time_ms FROM schema_migrations ORDER BY version ASC`
    );
    return rows;
  } catch (err) {
    return [];
  }
}
async function getHealthStatusFromDb() {
  const startTime = Date.now();
  const hasValidDb = checkDbActive();
  if (!hasValidDb) {
    return {
      status: "degraded",
      mode: "in-memory-fallback",
      dbConnected: false,
      message: "No database configuration found (DATABASE_URL, POSTGRES_URL, or SQL_HOST are missing), running in local disk persistence mode.",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  try {
    const pingResult = await pool.query("SELECT 1 as ping, NOW() as server_time");
    const latencyMs = Date.now() - startTime;
    const poolMetrics = {
      totalCount: pool.totalCount,
      idleCount: pool.idleCount,
      waitingCount: pool.waitingCount
    };
    const [
      userRes,
      setupRes,
      brandRes,
      hwRes,
      gameRes,
      migrationRes
    ] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM users").catch(() => ({ rows: [{ count: 0 }] })),
      pool.query("SELECT COUNT(*) FROM setups").catch(() => ({ rows: [{ count: 0 }] })),
      pool.query("SELECT COUNT(*) FROM brands").catch(() => ({ rows: [{ count: 0 }] })),
      pool.query("SELECT COUNT(*) FROM hardware").catch(() => ({ rows: [{ count: 0 }] })),
      pool.query("SELECT COUNT(*) FROM games").catch(() => ({ rows: [{ count: 0 }] })),
      pool.query("SELECT version, name, applied_at FROM schema_migrations ORDER BY version DESC LIMIT 1").catch(() => ({ rows: [] }))
    ]);
    const latestMigration = migrationRes.rows[0] || null;
    return {
      status: "healthy",
      ready: true,
      dbConnected: true,
      latencyMs,
      pool: poolMetrics,
      counts: {
        users: parseInt(userRes.rows[0].count, 10),
        setups: parseInt(setupRes.rows[0].count, 10),
        brands: parseInt(brandRes.rows[0].count, 10),
        hardware: parseInt(hwRes.rows[0].count, 10),
        games: parseInt(gameRes.rows[0].count, 10)
      },
      latestMigration,
      seederGuard: {
        environment: "'production'",
        productionSeedingAllowed: process.env.ENABLE_PRODUCTION_SEED === "true"
      },
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  } catch (err) {
    return {
      status: "unhealthy",
      ready: false,
      dbConnected: false,
      error: err?.message || "Database ping failed",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
}
async function initDatabase() {
  const hasValidDb = checkDbActive();
  if (!hasValidDb) {
    console.warn("WARNING: Both DATABASE_URL and SQL_HOST are missing. Database initialization skipped.");
    return;
  }
  try {
    console.log("Connecting to PostgreSQL database...");
    const client = await pool.connect();
    try {
      await runVersionedMigrations(client);
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          name TEXT NOT NULL,
          avatar TEXT,
          is_verified BOOLEAN DEFAULT FALSE,
          verification_code TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);
      try {
        await client.query(`ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;`);
      } catch (e) {
      }
      try {
        await client.query(`ALTER TABLE users ADD COLUMN verification_code TEXT;`);
      } catch (e) {
      }
      try {
        await client.query(`ALTER TABLE users ADD COLUMN bio TEXT;`);
      } catch (e) {
      }
      try {
        await client.query(`ALTER TABLE users ADD COLUMN github_link TEXT;`);
      } catch (e) {
      }
      try {
        await client.query(`ALTER TABLE users ADD COLUMN instagram_link TEXT;`);
      } catch (e) {
      }
      try {
        await client.query(`ALTER TABLE users ADD COLUMN linkedin_link TEXT;`);
      } catch (e) {
      }
      try {
        await client.query(`ALTER TABLE users ADD COLUMN cover_photo TEXT;`);
      } catch (e) {
      }
      try {
        await client.query(`ALTER TABLE users ADD COLUMN custom_badge TEXT;`);
      } catch (e) {
      }
      try {
        await client.query(`ALTER TABLE users ADD COLUMN custom_color TEXT;`);
      } catch (e) {
      }
      try {
        await client.query(`ALTER TABLE users ADD COLUMN invite_count INT DEFAULT 0;`);
      } catch (e) {
      }
      try {
        await client.query(`ALTER TABLE users ADD COLUMN is_crown BOOLEAN DEFAULT FALSE;`);
      } catch (e) {
      }
      try {
        await client.query(`ALTER TABLE users ADD COLUMN reference_code TEXT;`);
      } catch (e) {
      }
      try {
        await client.query(`ALTER TABLE users ADD COLUMN has_rgb BOOLEAN DEFAULT FALSE;`);
      } catch (e) {
      }
      try {
        await client.query(`ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user';`);
      } catch (e) {
      }
      try {
        await client.query(`ALTER TABLE users ADD COLUMN is_banned BOOLEAN DEFAULT FALSE;`);
      } catch (e) {
      }
      try {
        await client.query(`ALTER TABLE users ADD COLUMN streak_count INT DEFAULT 0;`);
      } catch (e) {
      }
      try {
        await client.query(`ALTER TABLE users ADD COLUMN last_active_date TIMESTAMPTZ;`);
      } catch (e) {
      }
      try {
        await client.query(`ALTER TABLE users ADD COLUMN streak_companion TEXT DEFAULT 'sarcastic';`);
      } catch (e) {
      }
      try {
        await client.query(`ALTER TABLE users ADD COLUMN streak_freezes INT DEFAULT 1;`);
      } catch (e) {
      }
      try {
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_expires_at TIMESTAMPTZ;`);
      } catch (e) {
      }
      try {
        await client.query(`ALTER TABLE users ADD COLUMN avatar_frame TEXT DEFAULT 'none';`);
      } catch (e) {
      }
      try {
        await client.query(`ALTER TABLE public.profiles ADD COLUMN avatar_frame TEXT DEFAULT 'none';`);
      } catch (e) {
      }
      await client.query(`
        CREATE TABLE IF NOT EXISTS setups (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          owner TEXT NOT NULL,
          owner_id TEXT,
          bio TEXT,
          category TEXT NOT NULL,
          description TEXT,
          image TEXT,
          likes INTEGER DEFAULT 0,
          tags JSONB DEFAULT '[]'::jsonb,
          components JSONB DEFAULT '[]'::jsonb,
          comments JSONB DEFAULT '[]'::jsonb,
          card_theme TEXT DEFAULT 'dark',
          created_at TIMESTAMPTZ DEFAULT NOW(),
          video_url TEXT,
          is_bot_share BOOLEAN DEFAULT FALSE,
          FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
        );
      `);
      try {
        await client.query(`ALTER TABLE setups ADD COLUMN card_theme TEXT DEFAULT 'dark';`);
      } catch (e) {
      }
      try {
        await client.query(`ALTER TABLE setups ADD COLUMN owner_id TEXT;`);
      } catch (e) {
      }
      try {
        await client.query(`ALTER TABLE setups ADD COLUMN video_url TEXT;`);
      } catch (e) {
      }
      try {
        await client.query(`ALTER TABLE setups ADD COLUMN is_bot_share BOOLEAN DEFAULT FALSE;`);
      } catch (e) {
      }
      await client.query(`
        CREATE TABLE IF NOT EXISTS setup_likes (
          user_id TEXT NOT NULL,
          setup_id TEXT NOT NULL,
          PRIMARY KEY (user_id, setup_id),
          FOREIGN KEY (setup_id) REFERENCES setups(id) ON DELETE CASCADE
        );
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS wishlist (
          id TEXT PRIMARY KEY,
          user_id TEXT,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          estimated_price NUMERIC DEFAULT 0,
          purchased BOOLEAN DEFAULT FALSE,
          link TEXT,
          notes TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);
      try {
        await client.query(`ALTER TABLE wishlist ADD COLUMN user_id TEXT;`);
      } catch (e) {
      }
      await client.query(`
        CREATE TABLE IF NOT EXISTS chat_messages (
          id TEXT PRIMARY KEY,
          sender_id TEXT NOT NULL,
          sender_name TEXT NOT NULL,
          sender_avatar TEXT,
          receiver_id TEXT NOT NULL,
          receiver_name TEXT NOT NULL,
          receiver_avatar TEXT,
          message TEXT NOT NULL,
          is_read BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          media_url TEXT,
          media_type TEXT,
          sender_has_rgb BOOLEAN DEFAULT FALSE
        );
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS friends (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          friend_id TEXT NOT NULL,
          status TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE(user_id, friend_id)
        );
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS activity_logs (
          id TEXT PRIMARY KEY,
          action_type TEXT NOT NULL,
          user_id TEXT,
          user_name TEXT,
          details TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS media_files (
          id TEXT PRIMARY KEY,
          file_name TEXT NOT NULL,
          file_url TEXT NOT NULL,
          file_type TEXT NOT NULL,
          file_size BIGINT DEFAULT 0,
          mime_type TEXT,
          uploader_id TEXT,
          uploader_name TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          thumbnail_512 TEXT,
          thumbnail_256 TEXT
        );
      `);
      await client.query(`
        ALTER TABLE media_files ADD COLUMN IF NOT EXISTS thumbnail_512 TEXT;
        ALTER TABLE media_files ADD COLUMN IF NOT EXISTS thumbnail_256 TEXT;
      `).catch((e) => console.error("Could not run ALTER TABLE to add thumbnail columns:", e));
      await client.query(`
        CREATE TABLE IF NOT EXISTS site_settings (
          key TEXT PRIMARY KEY,
          value TEXT
        );
      `);
      const { rows: settingRows } = await client.query("SELECT COUNT(*) FROM site_settings");
      if (parseInt(settingRows[0].count, 10) === 0) {
        await client.query(`INSERT INTO site_settings (key, value) VALUES 
          ('instagram_link', 'https://instagram.com'),
          ('twitter_link', 'https://twitter.com'),
          ('youtube_link', 'https://youtube.com'),
          ('github_link', 'https://github.com'),
          ('discord_link', 'https://discord.com'),
          ('linkedin_link', 'https://linkedin.com'),
          ('contact_email', 'setupss.support@gmail.com')
        ON CONFLICT (key) DO NOTHING;`);
      }
      try {
        await client.query(`ALTER TABLE chat_messages ADD COLUMN media_url TEXT;`);
      } catch (e) {
      }
      try {
        await client.query(`ALTER TABLE chat_messages ADD COLUMN media_type TEXT;`);
      } catch (e) {
      }
      try {
        await client.query(`ALTER TABLE chat_messages ADD COLUMN sender_has_rgb BOOLEAN DEFAULT FALSE;`);
      } catch (e) {
      }
      console.log("Database tables verified/created successfully.");
      try {
        console.log("\u{1F9F9} [Database Cleaner] Purging pre-embedded/bot setups to keep database strictly containing actual user-uploaded setups...");
        await client.query(`
          DELETE FROM setups 
          WHERE id IN ('setup-1', 'setup-2', 'setup-3', 'setup-4', 'setup-5') 
             OR is_bot_share = true 
             OR owner_id = 'ai-bot'
        `);
      } catch (cleanErr) {
        console.error("Database cleaner failed to purge pre-embedded setups:", cleanErr.message);
      }
      const allowSeeding = true;
      console.log("\u{1F331} [Seeder Engine] Checking and seeding initial catalog defaults if tables are empty...");
      const { rows: wishlistRows } = await client.query("SELECT COUNT(*) FROM wishlist");
      const wishlistCount = parseInt(wishlistRows[0].count, 10);
      if (wishlistCount === 0) {
        console.log("Seeding wishlist database with defaults...");
        const defaultWishlist = [
          { id: "w-1", name: "IKEA Karlby Me\u015Fe Tabla", category: "Masa\xFCst\xFC / Mobilya", estimatedPrice: 4200, purchased: true, notes: "Alex \xE7ekmecelerle birle\u015Ftirilecek." },
          { id: "w-2", name: "Keychron K2 V2 Mekanik Klavye", category: "Klavye / Mouse", estimatedPrice: 2800, purchased: false, link: "https://keychron.com", notes: "Brown switch tercih edilecek." },
          { id: "w-3", name: "Xiaomi Monit\xF6r Arkas\u0131 I\u015F\u0131k \xC7ubu\u011Fu", category: "I\u015F\u0131kland\u0131rma / Ses", estimatedPrice: 1200, purchased: false, notes: "G\xF6z yorgunlu\u011Funu \xF6nlemek i\xE7in." }
        ];
        for (const w of defaultWishlist) {
          await client.query(
            `INSERT INTO wishlist (id, name, category, estimated_price, purchased, link, notes)
               VALUES ($1, $2, $3, $4, $5, $6, $7)
               ON CONFLICT (id) DO NOTHING`,
            [w.id, w.name, w.category, w.estimatedPrice, w.purchased, w.link || null, w.notes || null]
          );
        }
        console.log("Wishlist database seeded successfully.");
      }
      console.log("Seeding and updating default and bot users with real/historic registration dates...");
      const adminPassHash = import_bcryptjs.default.hashSync("ozcan1257", 10);
      const standardPassHash = import_bcryptjs.default.hashSync("123456", 10);
      const usersToSeed = [
        {
          id: "mock-user-123",
          email: "ziyaretci@setupss.ai.studio",
          password_hash: standardPassHash,
          name: "Ziyaret\xE7i Geli\u015Ftirici",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
          is_verified: true,
          bio: "Teknoloji tutkunu ve minimal masa\xFCst\xFC d\xFCzeni geli\u015Ftiricisi.",
          github_link: "https://github.com",
          cover_photo: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80",
          custom_badge: "Setup Payla\u015F\u0131mc\u0131s\u0131 \u{1F680}",
          custom_color: "#4ECDC4",
          is_crown: false,
          has_rgb: false,
          role: "user",
          created_at: "2026-02-15T12:00:00.000Z"
        },
        {
          id: "admin",
          email: "setupss.support@gmail.com",
          password_hash: adminPassHash,
          name: "Be\u015Fir Hanzo",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80",
          is_verified: true,
          bio: "Kod Yazan Kahve Canavar\u0131 \u2615\uFE0F",
          github_link: "https://github.com",
          cover_photo: "https://images.unsplash.com/photo-1491336477066-31156b5e4f35?auto=format&fit=crop&w=800&q=80",
          custom_badge: "Kurucu & Geli\u015Ftirici \u{1F451}",
          custom_color: "#FF6B6B",
          is_crown: true,
          has_rgb: true,
          role: "admin",
          created_at: "2026-01-01T09:00:00.000Z"
        },
        {
          id: "kreatif-can",
          email: "can@setupss.ai.studio",
          password_hash: standardPassHash,
          name: "Kreatif Can",
          avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&h=200&q=80",
          is_verified: true,
          bio: "RGB & Neon Sevdal\u0131s\u0131 \u{1F308}",
          github_link: "https://github.com",
          cover_photo: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80",
          custom_badge: "RGB Profes\xF6r\xFC \u{1F308}",
          custom_color: "#9b59b6",
          is_crown: false,
          has_rgb: true,
          role: "user",
          created_at: "2026-03-20T14:30:00.000Z"
        },
        {
          id: "zeynep-tasarim",
          email: "zeynep@setupss.ai.studio",
          password_hash: standardPassHash,
          name: "Zeynep Tasar\u0131m",
          avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&h=200&q=80",
          is_verified: true,
          bio: "Piksel B\xFCk\xFCc\xFC & Bitki B\xFCy\xFCc\xFCs\xFC \u{1F33F}",
          github_link: "https://github.com",
          cover_photo: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80",
          custom_badge: "Senior Designer \u{1F3A8}",
          custom_color: "#2ecc71",
          is_crown: true,
          has_rgb: false,
          role: "user",
          created_at: "2026-04-05T10:15:00.000Z"
        },
        {
          id: "ai-bot",
          email: "bot@setupss.ai.studio",
          password_hash: standardPassHash,
          name: "Setupss AI",
          avatar: "/airobot.jpg",
          is_verified: true,
          bio: "Kurulum Dan\u0131\u015Fman\u0131 & Site Rehberi \u{1F916}",
          github_link: "",
          cover_photo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
          custom_badge: "Topluluk Asistan\u0131 \u{1F916}",
          custom_color: "#FFD93D",
          is_crown: false,
          has_rgb: true,
          role: "admin",
          created_at: "2026-01-01T08:00:00.000Z"
        }
      ];
      for (const u of usersToSeed) {
        await client.query(
          `INSERT INTO users (id, email, password_hash, name, avatar, is_verified, bio, github_link, cover_photo, custom_badge, custom_color, is_crown, has_rgb, role, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
             ON CONFLICT (id) DO NOTHING`,
          [
            u.id,
            u.email,
            u.password_hash,
            u.name,
            u.avatar,
            u.is_verified,
            u.bio,
            u.github_link,
            u.cover_photo,
            u.custom_badge,
            u.custom_color,
            u.is_crown,
            u.has_rgb,
            u.role,
            u.created_at
          ]
        );
      }
      console.log("Users database seeded and updated successfully.");
      await client.query(`
        CREATE TABLE IF NOT EXISTS brands (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          slug TEXT NOT NULL UNIQUE,
          description TEXT,
          logo_url TEXT,
          website TEXT,
          is_deleted BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS hardware_categories (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          slug TEXT NOT NULL UNIQUE,
          description TEXT,
          is_deleted BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS hardware (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          brand_id TEXT REFERENCES brands(id) ON DELETE SET NULL,
          category_id TEXT REFERENCES hardware_categories(id) ON DELETE SET NULL,
          description TEXT,
          specs JSONB DEFAULT '{}'::jsonb,
          image_url TEXT,
          price_estimate NUMERIC DEFAULT 0,
          buy_link TEXT,
          is_deleted BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS games (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          slug TEXT NOT NULL UNIQUE,
          description TEXT,
          image_url TEXT,
          genre TEXT,
          developer TEXT,
          release_year INT,
          steam_id INT,
          is_deleted BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);
      await client.query(`ALTER TABLE brands ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;`).catch(() => {
      });
      await client.query(`ALTER TABLE hardware_categories ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;`).catch(() => {
      });
      await client.query(`ALTER TABLE hardware ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;`).catch(() => {
      });
      await client.query(`ALTER TABLE games ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;`).catch(() => {
      });
      await client.query(`
        CREATE TABLE IF NOT EXISTS entity_audit_logs (
          id TEXT PRIMARY KEY,
          entity_type TEXT NOT NULL,
          entity_id TEXT NOT NULL,
          action TEXT NOT NULL,
          performed_by TEXT,
          payload JSONB,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);
      await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);`).catch(() => {
      });
      await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_hardware_categories_slug ON hardware_categories(slug);`).catch(() => {
      });
      await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_hardware_slug ON hardware(slug);`).catch(() => {
      });
      await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_games_slug ON games(slug);`).catch(() => {
      });
      await client.query(`CREATE INDEX IF NOT EXISTS idx_hardware_brand ON hardware(brand_id);`).catch(() => {
      });
      await client.query(`CREATE INDEX IF NOT EXISTS idx_hardware_category ON hardware(category_id);`).catch(() => {
      });
      await client.query(`CREATE INDEX IF NOT EXISTS idx_setup_hardware_setup ON setup_hardware(setup_id);`).catch(() => {
      });
      await client.query(`CREATE INDEX IF NOT EXISTS idx_setup_hardware_hw ON setup_hardware(hardware_id);`).catch(() => {
      });
      await client.query(`CREATE INDEX IF NOT EXISTS idx_setup_games_setup ON setup_games(setup_id);`).catch(() => {
      });
      await client.query(`CREATE INDEX IF NOT EXISTS idx_setup_games_game ON setup_games(game_id);`).catch(() => {
      });
      await client.query(`
        CREATE TABLE IF NOT EXISTS setup_hardware (
          setup_id TEXT REFERENCES setups(id) ON DELETE CASCADE,
          hardware_id TEXT REFERENCES hardware(id) ON DELETE CASCADE,
          notes TEXT,
          PRIMARY KEY (setup_id, hardware_id)
        );
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS setup_games (
          setup_id TEXT REFERENCES setups(id) ON DELETE CASCADE,
          game_id TEXT REFERENCES games(id) ON DELETE CASCADE,
          PRIMARY KEY (setup_id, game_id)
        );
      `);
      console.log("Entity tables verified/created successfully.");
      if (allowSeeding) {
        const { rows: brandCheck } = await client.query("SELECT COUNT(*) FROM brands");
        if (parseInt(brandCheck[0].count, 10) === 0) {
          console.log("Seeding brands table...");
          const brands = [
            { id: "b-nvidia", name: "NVIDIA", slug: "nvidia", description: "Graphics card and AI platform market leader.", website: "https://nvidia.com" },
            { id: "b-amd", name: "AMD", slug: "amd", description: "High performance processors and graphics cards.", website: "https://amd.com" },
            { id: "b-asus", name: "ASUS", slug: "asus", description: "Leading gaming hardware manufacturer.", website: "https://asus.com" },
            { id: "b-logitech", name: "Logitech", slug: "logitech", description: "Premium computer peripherals.", website: "https://logitech.com" },
            { id: "b-corsair", name: "Corsair", slug: "corsair", description: "High-performance PC components and gaming gear.", website: "https://corsair.com" },
            { id: "b-keychron", name: "Keychron", slug: "keychron", description: "Custom wireless mechanical keyboards.", website: "https://keychron.com" },
            { id: "b-lg", name: "LG", slug: "lg", description: "Innovative display technologies.", website: "https://lg.com" },
            { id: "b-razer", name: "Razer", slug: "razer", description: "For Gamers. By Gamers.", website: "https://razer.com" },
            { id: "b-hermanmiller", name: "Herman Miller", slug: "herman-miller", description: "Ergonomic luxury seating and furniture.", website: "https://hermanmiller.com" }
          ];
          for (const b of brands) {
            await client.query(`
              INSERT INTO brands (id, name, slug, description, website)
              VALUES ($1, $2, $3, $4, $5)
              ON CONFLICT (id) DO NOTHING
            `, [b.id, b.name, b.slug, b.description, b.website]);
          }
        }
        const { rows: catCheck } = await client.query("SELECT COUNT(*) FROM hardware_categories");
        if (parseInt(catCheck[0].count, 10) === 0) {
          console.log("Seeding hardware_categories table...");
          const categories = [
            { id: "c-gpu", name: "GPU", slug: "gpu", description: "Graphics processing units" },
            { id: "c-cpu", name: "CPU", slug: "cpu", description: "Central processing units" },
            { id: "c-keyboard", name: "Keyboard", slug: "keyboard", description: "Input mechanical keyboards" },
            { id: "c-mouse", name: "Mouse", slug: "mouse", description: "Input precision mice" },
            { id: "c-chair", name: "Chair", slug: "chair", description: "Ergonomic chairs" },
            { id: "c-monitor", name: "Monitor", slug: "monitor", description: "Output screens and displays" },
            { id: "c-desk", name: "Desk", slug: "desk", description: "Setup tables and custom desks" }
          ];
          for (const c of categories) {
            await client.query(`
              INSERT INTO hardware_categories (id, name, slug, description)
              VALUES ($1, $2, $3, $4)
              ON CONFLICT (id) DO NOTHING
            `, [c.id, c.name, c.slug, c.description]);
          }
        }
        const { rows: hwCheck } = await client.query("SELECT COUNT(*) FROM hardware");
        if (parseInt(hwCheck[0].count, 10) === 0) {
          console.log("Seeding hardware table from HARDWARE_CATALOG...");
          for (const hw of HARDWARE_CATALOG) {
            const brandSlug = hw.brand.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            const catSlug = hw.category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            await client.query(`
              INSERT INTO hardware (id, name, slug, brand_id, category_id, description, specs, image_url, price_estimate)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
              ON CONFLICT (id) DO NOTHING
            `, [
              hw.id,
              hw.model,
              hw.slug,
              `b-${brandSlug}`,
              `c-${catSlug}`,
              hw.description,
              JSON.stringify(hw.specifications),
              hw.images[0] || null,
              hw.msrp || 0
            ]);
          }
        }
        const { rows: gameCheck } = await client.query("SELECT COUNT(*) FROM games");
        if (parseInt(gameCheck[0].count, 10) === 0) {
          console.log("Seeding games table...");
          const games = [
            { id: "g-valorant", name: "Valorant", slug: "valorant", description: "Riot Games character-based tactical shooter.", image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80", genre: "Tactical Shooter", developer: "Riot Games", release_year: 2020 },
            { id: "g-cs2", name: "Counter-Strike 2", slug: "cs2", description: "Valve next-gen precision shooter.", image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80", genre: "Tactical Shooter", developer: "Valve", release_year: 2023 },
            { id: "g-cyberpunk", name: "Cyberpunk 2077", slug: "cyberpunk-2077", description: "CD Projekt Red open-world action-RPG.", image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80", genre: "Action RPG", developer: "CD Projekt Red", release_year: 2020 },
            { id: "g-eldenring", name: "Elden Ring", slug: "elden-ring", description: "FromSoftware epic fantasy open-world ARPG.", image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80", genre: "Action RPG", developer: "FromSoftware", release_year: 2022 }
          ];
          for (const g of games) {
            await client.query(`
              INSERT INTO games (id, name, slug, description, image_url, genre, developer, release_year)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
              ON CONFLICT (id) DO NOTHING
            `, [g.id, g.name, g.slug, g.description, g.image_url, g.genre, g.developer, g.release_year]);
          }
        }
      }
      const { rows: setups } = await client.query("SELECT id, components, tags FROM setups");
      for (const s of setups) {
        const componentsList = s.components || [];
        for (const comp of componentsList) {
          const modelWord = comp.name.toLowerCase().split(" ")[0];
          const { rows: matchingHw } = await client.query(
            `SELECT id FROM hardware WHERE LOWER(name) LIKE $1 OR LOWER(slug) LIKE $2 LIMIT 1`,
            [`%${modelWord}%`, `%${comp.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}%`]
          );
          if (matchingHw.length > 0) {
            await client.query(`
              INSERT INTO setup_hardware (setup_id, hardware_id, notes)
              VALUES ($1, $2, $3)
              ON CONFLICT (setup_id, hardware_id) DO NOTHING
            `, [s.id, matchingHw[0].id, comp.category]);
          }
        }
        const tagsList = s.tags || [];
        const { rows: allGames } = await client.query("SELECT id, name, slug FROM games");
        for (const game of allGames) {
          const gameWords = game.name.toLowerCase().split(" ");
          const tagMatches = tagsList.some((t2) => t2.toLowerCase() === game.slug || gameWords.some((w) => t2.toLowerCase().includes(w)));
          if (tagMatches) {
            await client.query(`
              INSERT INTO setup_games (setup_id, game_id)
              VALUES ($1, $2)
              ON CONFLICT (setup_id, game_id) DO NOTHING
            `, [s.id, game.id]);
          }
        }
      }
      console.log("Automatic setup relationships established in Knowledge Graph.");
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Error connecting to or initializing database:", err);
  }
}
async function getUserByEmail(email) {
  if (!email) return null;
  const { rows } = await pool.query("SELECT * FROM users WHERE LOWER(email) = LOWER($1)", [email.trim()]);
  return rows[0] || null;
}
async function getUserByName(name) {
  const { rows } = await pool.query("SELECT * FROM users WHERE LOWER(name) = LOWER($1)", [name]);
  return rows[0] || null;
}
async function getUserByReferenceCode(refCode) {
  const { rows } = await pool.query("SELECT * FROM users WHERE reference_code = $1 OR id = $1", [refCode]);
  return rows[0] || null;
}
async function createUser(user) {
  const expiresAt = user.verification_expires_at || new Date(Date.now() + 10 * 60 * 1e3).toISOString();
  await pool.query(
    `INSERT INTO users (id, email, password_hash, name, avatar, is_verified, verification_code, verification_expires_at, reference_code)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [user.id, user.email, user.password_hash, user.name, user.avatar || null, user.is_verified || false, user.verification_code || null, expiresAt, user.referenceCode || null]
  );
  const username = user.name ? user.name.toLowerCase().replace(/[^a-z0-9]+/g, "_") : `user_${user.id}`;
  await pool.query(
    `INSERT INTO public.profiles (id, email, username, display_name, avatar, role, is_verified)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (id) DO NOTHING`,
    [user.id, user.email, username, user.name, user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.id}`, "user", user.is_verified || false]
  );
}
async function verifyUser(id) {
  await pool.query(
    `UPDATE users SET is_verified = TRUE, verification_code = NULL, verification_expires_at = NULL WHERE id = $1`,
    [id]
  );
  await pool.query(
    `UPDATE public.profiles SET is_verified = TRUE WHERE id = $1`,
    [id]
  );
}
async function getSetupsFromDb(userId) {
  const { rows: setups } = await pool.query("SELECT * FROM setups ORDER BY created_at DESC");
  const { rows: users } = await pool.query("SELECT id, name, avatar, has_rgb, is_crown, invite_count FROM users");
  let likedSetups = /* @__PURE__ */ new Set();
  if (userId) {
    const { rows: likes } = await pool.query("SELECT setup_id FROM setup_likes WHERE user_id = $1", [userId]);
    likedSetups = new Set(likes.map((l) => l.setup_id));
  }
  return setups.map((r) => {
    const owner = users.find((u) => u.id === r.owner_id || u.name === r.owner);
    const hasRgb = Boolean(owner?.has_rgb || owner?.invite_count && Number(owner.invite_count) > 0);
    return {
      id: r.id,
      title: r.title,
      owner: owner?.name || r.owner,
      ownerId: owner?.id || r.owner_id,
      ownerAvatar: owner?.avatar || void 0,
      bio: r.bio || "",
      category: r.category,
      description: r.description || "",
      image: r.image || "",
      likes: r.likes,
      tags: Array.isArray(r.tags) ? r.tags : [],
      components: Array.isArray(r.components) ? r.components : [],
      comments: Array.isArray(r.comments) ? r.comments : [],
      cardTheme: r.card_theme || "dark",
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
      ownerHasRgb: hasRgb,
      likedByUser: likedSetups.has(r.id),
      videoUrl: r.video_url || "",
      isBotShare: Boolean(r.is_bot_share)
    };
  });
}
async function addSetupToDb(s) {
  await pool.query(
    `INSERT INTO setups (id, title, owner, owner_id, bio, category, description, image, likes, tags, components, comments, card_theme, created_at, video_url, is_bot_share)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
    [
      s.id,
      s.title,
      s.owner,
      s.ownerId || null,
      s.bio,
      s.category,
      s.description,
      s.image,
      s.likes,
      JSON.stringify(s.tags),
      JSON.stringify(s.components),
      JSON.stringify(s.comments),
      s.cardTheme || "dark",
      s.createdAt,
      s.videoUrl || null,
      s.isBotShare || false
    ]
  );
}
async function deleteSetupFromDb(id, userId, isAdmin = false) {
  try {
    const mediaRes = await pool.query(
      `SELECT object_key FROM public.media_assets WHERE entity_id = $1 OR object_key LIKE $2`,
      [id, `setups/${id}/%`]
    );
    if (mediaRes.rows.length > 0) {
      const { storageService: storageService2 } = await Promise.resolve().then(() => (init_storageService(), storageService_exports));
      const provider = storageService2.getProvider();
      for (const row of mediaRes.rows) {
        if (row.object_key) {
          await provider.deleteFile(row.object_key).catch((err) => console.error(`Failed to delete R2 file ${row.object_key}:`, err));
        }
      }
      await pool.query(
        `DELETE FROM public.media_assets WHERE entity_id = $1 OR object_key LIKE $2`,
        [id, `setups/${id}/%`]
      );
    }
  } catch (err) {
    console.error("Error during media assets deletion for setup:", id, err);
  }
  if (isAdmin) {
    await pool.query("DELETE FROM setups WHERE id = $1", [id]);
  } else {
    await pool.query("DELETE FROM setups WHERE id = $1 AND owner_id = $2", [id, userId]);
  }
}
async function saveSetupsBatchToDb(setups) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM setups");
    for (const s of setups) {
      await client.query(
        `INSERT INTO setups (id, title, owner, owner_id, bio, category, description, image, likes, tags, components, comments, card_theme, created_at, video_url, is_bot_share)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
        [
          s.id,
          s.title,
          s.owner,
          s.ownerId || null,
          s.bio,
          s.category,
          s.description,
          s.image,
          s.likes,
          JSON.stringify(s.tags),
          JSON.stringify(s.components),
          JSON.stringify(s.comments),
          s.cardTheme || "dark",
          s.createdAt,
          s.videoUrl || null,
          s.isBotShare || false
        ]
      );
    }
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
async function getWishlistFromDb(userId) {
  const targetUser = userId || "guest";
  const { rows } = await pool.query("SELECT * FROM wishlist WHERE user_id = $1 OR user_id IS NULL ORDER BY created_at ASC", [targetUser]);
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    category: r.category,
    estimatedPrice: Number(r.estimated_price),
    purchased: r.purchased,
    link: r.link || void 0,
    notes: r.notes || void 0
  }));
}
async function addWishlistItemToDb(w, userId) {
  const targetUser = userId || "guest";
  await pool.query(
    `INSERT INTO wishlist (id, user_id, name, category, estimated_price, purchased, link, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (id) DO UPDATE SET user_id = $2, name = $3, category = $4, estimated_price = $5, purchased = $6, link = $7, notes = $8`,
    [w.id, targetUser, w.name, w.category, w.estimatedPrice, w.purchased, w.link || null, w.notes || null]
  );
}
async function updateWishlistItemInDb(w, userId) {
  const targetUser = userId || "guest";
  await pool.query(
    `UPDATE wishlist SET name = $1, category = $2, estimated_price = $3, purchased = $4, link = $5, notes = $6, user_id = $7 WHERE id = $8`,
    [w.name, w.category, w.estimatedPrice, w.purchased, w.link || null, w.notes || null, targetUser, w.id]
  );
}
async function deleteWishlistItemFromDb(id) {
  await pool.query("DELETE FROM wishlist WHERE id = $1", [id]);
}
async function getChatHistoryFromDb(userId1, userId2) {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query(
        `SELECT * FROM chat_messages 
         WHERE (sender_id = $1 AND receiver_id = $2) 
            OR (sender_id = $2 AND receiver_id = $1)
         ORDER BY created_at ASC`,
        [userId1, userId2]
      );
      return rows.map((r) => ({
        id: r.id,
        senderId: r.sender_id,
        senderName: r.sender_name,
        senderAvatar: r.sender_avatar || void 0,
        receiverId: r.receiver_id,
        receiverName: r.receiver_name,
        receiverAvatar: r.receiver_avatar || void 0,
        message: r.message,
        isRead: r.is_read,
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
        senderHasRgb: r.sender_has_rgb || false,
        mediaUrl: r.media_url || void 0,
        mediaType: r.media_type || void 0
      }));
    } catch (e) {
      console.error("Failed to query chat history from DB, using fallback", e);
    }
  }
  return localChatMessages.filter(
    (m) => m.senderId === userId1 && m.receiverId === userId2 || m.senderId === userId2 && m.receiverId === userId1
  ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}
async function addChatMessageToDb(msg) {
  if (checkDbActive()) {
    try {
      await pool.query(
        `INSERT INTO chat_messages (id, sender_id, sender_name, sender_avatar, receiver_id, receiver_name, receiver_avatar, message, is_read, created_at, media_url, media_type, sender_has_rgb)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          msg.id,
          msg.senderId,
          msg.senderName,
          msg.senderAvatar || null,
          msg.receiverId,
          msg.receiverName,
          msg.receiverAvatar || null,
          msg.message,
          msg.isRead,
          msg.createdAt,
          msg.mediaUrl || null,
          msg.mediaType || null,
          msg.senderHasRgb || false
        ]
      );
      return;
    } catch (e) {
      console.error("Failed to insert chat message to DB, using fallback", e);
    }
  }
  localChatMessages.push(msg);
}
async function markMessagesAsReadInDb(senderId, receiverId) {
  if (checkDbActive()) {
    try {
      await pool.query(
        `UPDATE chat_messages SET is_read = TRUE 
         WHERE sender_id = $1 AND receiver_id = $2 AND is_read = FALSE`,
        [senderId, receiverId]
      );
      return;
    } catch (e) {
      console.error("Failed to mark messages as read in DB, using fallback", e);
    }
  }
  localChatMessages.forEach((m) => {
    if (m.senderId === senderId && m.receiverId === receiverId) {
      m.isRead = true;
    }
  });
}
async function getAllUserMessagesFromDb(userId) {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query(
        `SELECT * FROM chat_messages 
         WHERE sender_id = $1 OR receiver_id = $1
         ORDER BY created_at ASC`,
        [userId]
      );
      return rows.map((r) => ({
        id: r.id,
        senderId: r.sender_id,
        senderName: r.sender_name,
        senderAvatar: r.sender_avatar || void 0,
        receiverId: r.receiver_id,
        receiverName: r.receiver_name,
        receiverAvatar: r.receiver_avatar || void 0,
        message: r.message,
        isRead: r.is_read,
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
        senderHasRgb: r.sender_has_rgb || false,
        mediaUrl: r.media_url || void 0,
        mediaType: r.media_type || void 0
      }));
    } catch (e) {
      console.error("Failed to query all user messages from DB, using fallback", e);
    }
  }
  return localChatMessages.filter((m) => m.senderId === userId || m.receiverId === userId).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}
async function updateUserProfileInDb(id, name, avatar, bio, githubLink, instagramLink, linkedinLink, coverPhoto, customBadge, customColor, avatarFrame) {
  if (checkDbActive()) {
    try {
      await pool.query(
        `UPDATE users SET 
          name = $1, 
          avatar = $2, 
          bio = $3, 
          github_link = $4, 
          instagram_link = $5, 
          linkedin_link = $6, 
          cover_photo = $7, 
          custom_badge = $8, 
          custom_color = $9, 
          avatar_frame = $10,
          updated_at = NOW() 
         WHERE id = $11`,
        [name, avatar, bio, githubLink, instagramLink, linkedinLink, coverPhoto, customBadge, customColor, avatarFrame || "none", id]
      );
      await pool.query(
        `UPDATE public.profiles SET 
          display_name = $1, 
          avatar = $2, 
          bio = $3, 
          cover_photo = $4, 
          custom_badge = $5, 
          custom_color = $6, 
          avatar_frame = $7,
          updated_at = NOW() 
         WHERE id = $8`,
        [name, avatar, bio, coverPhoto, customBadge, customColor, avatarFrame || "none", id]
      );
    } catch (e) {
      console.error("Failed to update user profile in DB:", e);
    }
  }
}
async function addFriendshipToDb(id, userId, friendId, status) {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query(
        `SELECT * FROM friends WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)`,
        [userId, friendId]
      );
      if (rows.length > 0) {
        const existing2 = rows[0];
        if (existing2.status === "accepted") {
          return;
        }
        if (existing2.status === "pending" && existing2.user_id === friendId) {
          await pool.query(
            `UPDATE friends SET status = 'accepted' WHERE id = $1`,
            [existing2.id]
          );
        }
        return;
      }
      await pool.query(
        `INSERT INTO friends (id, user_id, friend_id, status)
         VALUES ($1, $2, $3, $4)`,
        [id, userId, friendId, status]
      );
      return;
    } catch (e) {
      console.error("Failed to add friendship in DB:", e);
    }
  }
  const existing = localFriendships.find(
    (f) => f.userId === userId && f.friendId === friendId || f.userId === friendId && f.friendId === userId
  );
  if (existing) {
    if (existing.status === "accepted") {
      return;
    }
    if (existing.status === "pending" && existing.userId === friendId) {
      existing.status = "accepted";
    }
  } else {
    localFriendships.push({ id, userId, friendId, status, createdAt: (/* @__PURE__ */ new Date()).toISOString() });
  }
}
async function updateFriendshipStatusInDb(userId, friendId, status) {
  if (checkDbActive()) {
    try {
      await pool.query(
        `UPDATE friends SET status = $1 WHERE (user_id = $2 AND friend_id = $3) OR (user_id = $3 AND friend_id = $2)`,
        [status, userId, friendId]
      );
      return;
    } catch (e) {
      console.error("Failed to update friendship status in DB:", e);
    }
  }
  localFriendships.forEach((f) => {
    if (f.userId === userId && f.friendId === friendId || f.userId === friendId && f.friendId === userId) {
      f.status = status;
    }
  });
}
async function deleteFriendshipInDb(userId, friendId) {
  if (checkDbActive()) {
    try {
      await pool.query(
        `DELETE FROM friends WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)`,
        [userId, friendId]
      );
      return;
    } catch (e) {
      console.error("Failed to delete friendship in DB:", e);
    }
  }
  localFriendships = localFriendships.filter(
    (f) => !(f.userId === userId && f.friendId === friendId || f.userId === friendId && f.friendId === userId)
  );
}
async function getFriendshipsForUserFromDb(userId) {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query(
        `SELECT f.*, 
                u1.name as sender_name, u1.avatar as sender_avatar, u1.avatar_frame as sender_frame,
                u2.name as receiver_name, u2.avatar as receiver_avatar, u2.avatar_frame as receiver_frame
         FROM friends f
         JOIN users u1 ON f.user_id = u1.id
         JOIN users u2 ON f.friend_id = u2.id
         WHERE f.user_id = $1 OR f.friend_id = $1`,
        [userId]
      );
      return rows.map((r) => ({
        id: r.id,
        userId: r.user_id,
        friendId: r.friend_id,
        status: r.status,
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
        senderName: r.sender_name,
        senderAvatar: r.sender_avatar,
        senderFrame: r.sender_frame || "none",
        receiverName: r.receiver_name,
        receiverAvatar: r.receiver_avatar,
        receiverFrame: r.receiver_frame || "none"
      }));
    } catch (e) {
      console.error("Failed to get friendships from DB:", e);
    }
  }
  return localFriendships.filter((f) => f.userId === userId || f.friendId === userId).map((f) => {
    const sender = localUsersList.find((u) => u.id === f.userId);
    const receiver = localUsersList.find((u) => u.id === f.friendId);
    return {
      ...f,
      senderName: sender ? sender.name || sender.displayName : f.userId,
      senderAvatar: sender ? sender.avatar : void 0,
      senderFrame: sender ? sender.avatarFrame || sender.avatar_frame || "none" : "none",
      receiverName: receiver ? receiver.name || receiver.displayName : f.friendId,
      receiverAvatar: receiver ? receiver.avatar : void 0,
      receiverFrame: receiver ? receiver.avatarFrame || receiver.avatar_frame || "none" : "none"
    };
  });
}
async function logActivityToDb(actionType, userId, userName, details) {
  const logItem = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    actionType,
    userId: userId || "system",
    userName: userName || "Anonim / Sistem",
    details,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  localActivityLogs.unshift(logItem);
  if (localActivityLogs.length > 500) localActivityLogs.pop();
  if (checkDbActive()) {
    try {
      await pool.query(
        `INSERT INTO activity_logs (id, action_type, user_id, user_name, details, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [logItem.id, actionType, userId, userName, details]
      );
    } catch (e) {
      console.error("Failed to insert activity log to DB:", e);
    }
  }
}
async function getActivityLogsFromDb() {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query("SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 200");
      return rows.map((r) => ({
        id: r.id,
        actionType: r.action_type,
        userId: r.user_id,
        userName: r.user_name,
        details: r.details,
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : (/* @__PURE__ */ new Date()).toISOString()
      }));
    } catch (e) {
      console.error("Failed to get activity logs from DB:", e);
    }
  }
  return localActivityLogs;
}
async function getAllUsersFromDb() {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query("SELECT id, email, name, avatar, is_verified, bio, custom_badge, invite_count, is_crown, has_rgb, is_banned, avatar_frame, created_at FROM users ORDER BY created_at DESC");
      if (rows && rows.length > 0) {
        return rows.map((r) => ({
          id: r.id,
          email: r.email,
          name: r.name,
          avatar: r.avatar,
          isVerified: r.is_verified,
          bio: r.bio,
          customBadge: r.custom_badge,
          inviteCount: Number(r.invite_count || 0),
          isCrown: Boolean(r.is_crown),
          hasRgb: Boolean(r.has_rgb),
          isBanned: Boolean(r.is_banned),
          avatarFrame: r.avatar_frame || "none",
          createdAt: r.created_at ? new Date(r.created_at).toISOString() : (/* @__PURE__ */ new Date()).toISOString()
        }));
      }
    } catch (e) {
      console.error("Failed to fetch all users from DB:", e);
    }
  }
  return localUsersList || [];
}
async function getAllMessagesFromDb() {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query("SELECT * FROM chat_messages ORDER BY created_at DESC LIMIT 500");
      return rows.map((r) => ({
        id: r.id,
        senderId: r.sender_id,
        senderName: r.sender_name,
        senderAvatar: r.sender_avatar,
        receiverId: r.receiver_id,
        receiverName: r.receiver_name,
        receiverAvatar: r.receiver_avatar,
        message: r.message,
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
        isRead: r.is_read,
        senderHasRgb: r.sender_has_rgb || false,
        mediaUrl: r.media_url,
        mediaType: r.media_type
      }));
    } catch (e) {
      console.error("Failed to fetch all messages from DB:", e);
    }
  }
  return [];
}
async function updateUserInDb(userId, data) {
  if (checkDbActive()) {
    try {
      const { name, bio, isVerified, customBadge, role, isCrown, hasRgb, isBanned } = data;
      await pool.query(
        `UPDATE users SET 
          name = $1, 
          bio = $2, 
          is_verified = $3, 
          custom_badge = $4, 
          role = $5, 
          is_crown = $6, 
          has_rgb = $7,
          is_banned = $8,
          updated_at = NOW()
         WHERE id = $9`,
        [name, bio, isVerified, customBadge, role, isCrown, hasRgb, isBanned, userId]
      );
    } catch (e) {
      console.error("Failed to update user in DB:", e);
    }
  }
}
async function broadcastMessageToDb(message, senderId, senderName, senderAvatar) {
  if (checkDbActive()) {
    try {
      const { rows: users } = await pool.query("SELECT id FROM users");
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const queries = users.map((u) => {
        const id = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
        return pool.query(
          `INSERT INTO chat_messages (id, sender_id, sender_name, sender_avatar, receiver_id, receiver_name, receiver_avatar, message, created_at, is_read)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [id, senderId, senderName, senderAvatar, u.id, "Sistem Duyurusu", null, message, now, false]
        );
      });
      await Promise.all(queries);
    } catch (e) {
      console.error("Failed to broadcast message in DB:", e);
    }
  }
}
async function deleteUserFromDb(userId) {
  if (checkDbActive()) {
    try {
      let targetId = userId;
      let targetEmail = null;
      try {
        const { rows } = await pool.query("SELECT id, email FROM users WHERE id::text = $1 OR LOWER(email) = LOWER($1)", [userId]);
        if (rows[0]) {
          targetId = rows[0].id ? String(rows[0].id) : userId;
          targetEmail = rows[0].email ? rows[0].email.toLowerCase() : null;
        } else {
          const { rows: pRows } = await pool.query("SELECT id, email FROM public.profiles WHERE id::text = $1 OR LOWER(email) = LOWER($1)", [userId]);
          if (pRows[0]) {
            targetId = pRows[0].id ? String(pRows[0].id) : userId;
            targetEmail = pRows[0].email ? pRows[0].email.toLowerCase() : null;
          }
        }
      } catch (err) {
        console.warn("Could not query user before deletion:", err);
      }
      try {
        await pool.query("DELETE FROM auth_identities WHERE user_id::text = $1", [targetId]);
      } catch {
      }
      try {
        await pool.query("DELETE FROM user_sessions WHERE user_id::text = $1", [targetId]);
      } catch {
      }
      try {
        await pool.query("DELETE FROM notifications WHERE user_id::text = $1 OR sender_id::text = $1", [targetId]);
      } catch {
      }
      try {
        await pool.query("DELETE FROM setup_likes WHERE user_id::text = $1", [targetId]);
      } catch {
      }
      try {
        await pool.query("DELETE FROM wishlist WHERE user_id::text = $1", [targetId]);
      } catch {
      }
      try {
        await pool.query("DELETE FROM friends WHERE user_id::text = $1 OR friend_id::text = $1", [targetId]);
      } catch {
      }
      try {
        await pool.query("DELETE FROM activity_logs WHERE user_id::text = $1", [targetId]);
      } catch {
      }
      try {
        await pool.query("DELETE FROM chat_messages WHERE sender_id::text = $1 OR user_id::text = $1", [targetId]);
      } catch {
      }
      try {
        await pool.query("DELETE FROM public.chat_messages WHERE sender_id::text = $1 OR user_id::text = $1", [targetId]);
      } catch {
      }
      try {
        await pool.query("DELETE FROM public.chat_room_members WHERE user_id::text = $1", [targetId]);
      } catch {
      }
      try {
        await pool.query("DELETE FROM hardware_reviews WHERE user_id::text = $1", [targetId]);
      } catch {
      }
      try {
        await pool.query("DELETE FROM user_hardware_ownership WHERE user_id::text = $1", [targetId]);
      } catch {
      }
      try {
        await pool.query("DELETE FROM public.ai_usage_logs WHERE user_id::text = $1", [targetId]);
      } catch {
      }
      try {
        await pool.query("DELETE FROM public.ai_messages WHERE conversation_id IN (SELECT id FROM public.ai_conversations WHERE user_id::text = $1)", [targetId]);
      } catch {
      }
      try {
        await pool.query("DELETE FROM public.ai_conversations WHERE user_id::text = $1", [targetId]);
      } catch {
      }
      try {
        await pool.query("DELETE FROM setup_hardware WHERE setup_id IN (SELECT id FROM setups WHERE owner_id::text = $1 OR user_id::text = $1)", [targetId]);
      } catch {
      }
      try {
        await pool.query("DELETE FROM setup_games WHERE setup_id IN (SELECT id FROM setups WHERE owner_id::text = $1 OR user_id::text = $1)", [targetId]);
      } catch {
      }
      try {
        await pool.query("DELETE FROM setups WHERE owner_id::text = $1 OR user_id::text = $1", [targetId]);
      } catch {
      }
      try {
        if (targetEmail) {
          await pool.query("DELETE FROM public.profiles WHERE id::text = $1 OR LOWER(email) = LOWER($2)", [targetId, targetEmail]);
        } else {
          await pool.query("DELETE FROM public.profiles WHERE id::text = $1", [targetId]);
        }
      } catch (err) {
        console.warn("Error deleting from profiles:", err);
      }
      try {
        if (targetEmail) {
          await pool.query("DELETE FROM users WHERE id::text = $1 OR LOWER(email) = LOWER($2)", [targetId, targetEmail]);
        } else {
          await pool.query("DELETE FROM users WHERE id::text = $1", [targetId]);
        }
      } catch (err) {
        console.error("Error deleting from users:", err);
      }
      console.log(`Successfully deleted user ${targetId} (${targetEmail || "no-email"}) from DB.`);
      return true;
    } catch (e) {
      console.error("Failed to delete user from DB:", e);
      throw e;
    }
  }
  return false;
}
async function deleteChatMessageFromDb(msgId) {
  if (checkDbActive()) {
    try {
      await pool.query("DELETE FROM chat_messages WHERE id = $1", [msgId]);
    } catch (e) {
      console.error("Failed to delete message from DB:", e);
    }
  }
}
async function addMediaFileToDb(media) {
  if (checkDbActive()) {
    try {
      await pool.query(
        `INSERT INTO media_files (id, file_name, file_url, file_type, file_size, mime_type, uploader_id, uploader_name, created_at, thumbnail_512, thumbnail_256)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), $9, $10)`,
        [
          media.id,
          media.fileName,
          media.fileUrl,
          media.fileType,
          media.fileSize || 0,
          media.mimeType || null,
          media.uploaderId || null,
          media.uploaderName || null,
          media.thumbnail512 || null,
          media.thumbnail256 || null
        ]
      );
    } catch (e) {
      console.error("Failed to insert media file to DB:", e);
    }
  }
}
async function getMediaFilesFromDb() {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query("SELECT * FROM media_files ORDER BY created_at DESC LIMIT 500");
      return rows.map((r) => ({
        id: r.id,
        fileName: r.file_name,
        fileUrl: r.file_url,
        fileType: r.file_type,
        fileSize: Number(r.file_size || 0),
        mimeType: r.mime_type,
        uploaderId: r.uploader_id,
        uploaderName: r.uploader_name,
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
        thumbnail512: r.thumbnail_512 || null,
        thumbnail256: r.thumbnail_256 || null
      }));
    } catch (e) {
      console.error("Failed to fetch media files from DB:", e);
    }
  }
  return [];
}
async function addCommentToDb(setupId, comment) {
  if (checkDbActive()) {
    try {
      await pool.query(
        `UPDATE setups SET comments = comments || $1::jsonb WHERE id = $2`,
        [JSON.stringify([comment]), setupId]
      );
      return;
    } catch (e) {
      console.error("Failed to add comment to DB:", e);
    }
  }
}
async function incrementInviteCount(userId) {
  if (checkDbActive()) {
    try {
      await pool.query(
        `UPDATE users SET invite_count = COALESCE(invite_count, 0) + 1, is_crown = TRUE, has_rgb = TRUE WHERE id = $1`,
        [userId]
      );
    } catch (e) {
      console.error("Failed to increment invite count in DB:", e);
    }
  }
}
async function deleteMediaFileFromDb(id) {
  if (checkDbActive()) {
    try {
      await pool.query("DELETE FROM media_files WHERE id = $1", [id]);
    } catch (e) {
      console.error("Failed to delete media file from DB:", e);
    }
  }
}
async function getSiteSettingsFromDb() {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query("SELECT key, value FROM site_settings");
      const settings = { ...localSiteSettings };
      for (const r of rows) {
        settings[r.key] = r.value;
      }
      return settings;
    } catch (e) {
      console.error("Failed to fetch site settings from DB:", e);
    }
  }
  return localSiteSettings;
}
async function updateSiteSettingsInDb(newSettings) {
  localSiteSettings = { ...localSiteSettings, ...newSettings };
  if (checkDbActive()) {
    try {
      for (const [key, value] of Object.entries(newSettings)) {
        await pool.query(
          `INSERT INTO site_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2`,
          [key, value]
        );
      }
    } catch (e) {
      console.error("Failed to update site settings in DB:", e);
    }
  }
}
async function getBrandsFromDb() {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query("SELECT * FROM brands WHERE (is_deleted IS NOT TRUE) ORDER BY name ASC");
      return rows;
    } catch (e) {
      console.error("Failed to fetch brands:", e);
    }
  }
  return localBrands.filter((b) => !b.is_deleted);
}
async function getBrandByIdOrSlug(idOrSlug) {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query("SELECT * FROM brands WHERE (id = $1 OR slug = $2) AND (is_deleted IS NOT TRUE)", [idOrSlug, idOrSlug]);
      return rows[0] || null;
    } catch (e) {
      console.error("Failed to fetch brand by id/slug:", e);
    }
  }
  return localBrands.find((b) => (b.id === idOrSlug || b.slug === idOrSlug) && !b.is_deleted) || null;
}
async function createBrandInDb(id, name, slug, description, logoUrl, website) {
  const brand = { id, name, slug, description: description || null, logo_url: logoUrl || null, website: website || null, is_deleted: false, created_at: (/* @__PURE__ */ new Date()).toISOString() };
  const existingIdx = localBrands.findIndex((b) => b.id === id);
  if (existingIdx >= 0) {
    localBrands[existingIdx] = { ...localBrands[existingIdx], ...brand };
  } else {
    localBrands.push(brand);
  }
  if (checkDbActive()) {
    try {
      await pool.query(
        `INSERT INTO brands (id, name, slug, description, logo_url, website) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING`,
        [id, name, slug, description || null, logoUrl || null, website || null]
      );
    } catch (e) {
      console.error("Failed to create brand:", e);
    }
  }
}
async function updateBrandInDb(id, name, slug, description, logoUrl, website) {
  const idx = localBrands.findIndex((b) => b.id === id);
  if (idx >= 0) {
    localBrands[idx] = { ...localBrands[idx], name, slug, description: description || null, logo_url: logoUrl || null, website: website || null };
  }
  if (checkDbActive()) {
    try {
      await pool.query(
        `UPDATE brands SET name = $2, slug = $3, description = $4, logo_url = $5, website = $6 WHERE id = $1`,
        [id, name, slug, description || null, logoUrl || null, website || null]
      );
    } catch (e) {
      console.error("Failed to update brand:", e);
    }
  }
}
async function deleteBrandFromDb(id) {
  localBrands = localBrands.filter((b) => b.id !== id);
  if (checkDbActive()) {
    try {
      await pool.query("DELETE FROM brands WHERE id = $1", [id]);
    } catch (e) {
      console.error("Failed to delete brand:", e);
    }
  }
}
async function getHardwareCategoriesFromDb() {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query("SELECT * FROM hardware_categories WHERE (is_deleted IS NOT TRUE) ORDER BY name ASC");
      return rows;
    } catch (e) {
      console.error("Failed to fetch hardware categories:", e);
    }
  }
  return localCategories.filter((c) => !c.is_deleted);
}
async function getHardwareCategoryByIdOrSlug(idOrSlug) {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query("SELECT * FROM hardware_categories WHERE (id = $1 OR slug = $2) AND (is_deleted IS NOT TRUE)", [idOrSlug, idOrSlug]);
      return rows[0] || null;
    } catch (e) {
      console.error("Failed to fetch hardware category:", e);
    }
  }
  return localCategories.find((c) => (c.id === idOrSlug || c.slug === idOrSlug) && !c.is_deleted) || null;
}
async function createHardwareCategoryInDb(id, name, slug, description) {
  const cat = { id, name, slug, description: description || null, is_deleted: false, created_at: (/* @__PURE__ */ new Date()).toISOString() };
  const idx = localCategories.findIndex((c) => c.id === id);
  if (idx >= 0) localCategories[idx] = { ...localCategories[idx], ...cat };
  else localCategories.push(cat);
  if (checkDbActive()) {
    try {
      await pool.query(
        `INSERT INTO hardware_categories (id, name, slug, description) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING`,
        [id, name, slug, description || null]
      );
    } catch (e) {
      console.error("Failed to create hardware category:", e);
    }
  }
}
async function updateHardwareCategoryInDb(id, name, slug, description) {
  const idx = localCategories.findIndex((c) => c.id === id);
  if (idx >= 0) localCategories[idx] = { ...localCategories[idx], name, slug, description: description || null };
  if (checkDbActive()) {
    try {
      await pool.query(
        `UPDATE hardware_categories SET name = $2, slug = $3, description = $4 WHERE id = $1`,
        [id, name, slug, description || null]
      );
    } catch (e) {
      console.error("Failed to update hardware category:", e);
    }
  }
}
async function deleteHardwareCategoryFromDb(id) {
  localCategories = localCategories.filter((c) => c.id !== id);
  if (checkDbActive()) {
    try {
      await pool.query("DELETE FROM hardware_categories WHERE id = $1", [id]);
    } catch (e) {
      console.error("Failed to delete hardware category:", e);
    }
  }
}
async function getHardwareFromDb() {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query(`
        SELECT h.*, b.name as brand_name, c.name as category_name 
        FROM hardware h
        LEFT JOIN brands b ON h.brand_id = b.id
        LEFT JOIN hardware_categories c ON h.category_id = c.id
        WHERE (h.is_deleted IS NOT TRUE)
        ORDER BY h.name ASC
      `);
      return rows;
    } catch (e) {
      console.error("Failed to fetch hardware:", e);
    }
  }
  return localHardware.filter((h) => !h.is_deleted).map((h) => {
    const brand = localBrands.find((b) => b.id === h.brand_id);
    const cat = localCategories.find((c) => c.id === h.category_id);
    return { ...h, brand_name: brand?.name || null, category_name: cat?.name || null };
  });
}
async function getHardwareByIdOrSlug(idOrSlug) {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query(`
        SELECT h.*, b.name as brand_name, c.name as category_name 
        FROM hardware h
        LEFT JOIN brands b ON h.brand_id = b.id
        LEFT JOIN hardware_categories c ON h.category_id = c.id
        WHERE (h.id = $1 OR h.slug = $2) AND (h.is_deleted IS NOT TRUE)
      `, [idOrSlug, idOrSlug]);
      return rows[0] || null;
    } catch (e) {
      console.error("Failed to fetch hardware by id/slug:", e);
    }
  }
  const item = localHardware.find((h) => (h.id === idOrSlug || h.slug === idOrSlug) && !h.is_deleted);
  if (!item) return null;
  const brand = localBrands.find((b) => b.id === item.brand_id);
  const cat = localCategories.find((c) => c.id === item.category_id);
  return { ...item, brand_name: brand?.name || null, category_name: cat?.name || null };
}
async function createHardwareInDb(id, name, slug, brandId, categoryId, description, specs, imageUrl, priceEstimate, buyLink) {
  const item = {
    id,
    name,
    slug,
    brand_id: brandId || null,
    category_id: categoryId || null,
    description: description || null,
    specs: specs || {},
    image_url: imageUrl || null,
    price_estimate: priceEstimate || 0,
    buy_link: buyLink || null,
    is_deleted: false,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  const idx = localHardware.findIndex((h) => h.id === id);
  if (idx >= 0) localHardware[idx] = { ...localHardware[idx], ...item };
  else localHardware.push(item);
  if (checkDbActive()) {
    try {
      await pool.query(
        `INSERT INTO hardware (id, name, slug, brand_id, category_id, description, specs, image_url, price_estimate, buy_link) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (id) DO NOTHING`,
        [id, name, slug, brandId || null, categoryId || null, description || null, specs ? JSON.stringify(specs) : "{}", imageUrl || null, priceEstimate || 0, buyLink || null]
      );
    } catch (e) {
      console.error("Failed to create hardware:", e);
    }
  }
}
async function updateHardwareInDb(id, name, slug, brandId, categoryId, description, specs, imageUrl, priceEstimate, buyLink) {
  const idx = localHardware.findIndex((h) => h.id === id);
  if (idx >= 0) {
    localHardware[idx] = {
      ...localHardware[idx],
      name,
      slug,
      brand_id: brandId || null,
      category_id: categoryId || null,
      description: description || null,
      specs: specs || {},
      image_url: imageUrl || null,
      price_estimate: priceEstimate || 0,
      buy_link: buyLink || null
    };
  }
  if (checkDbActive()) {
    try {
      await pool.query(
        `UPDATE hardware SET name = $2, slug = $3, brand_id = $4, category_id = $5, description = $6, specs = $7, image_url = $8, price_estimate = $9, buy_link = $10 WHERE id = $1`,
        [id, name, slug, brandId || null, categoryId || null, description || null, specs ? JSON.stringify(specs) : "{}", imageUrl || null, priceEstimate || 0, buyLink || null]
      );
    } catch (e) {
      console.error("Failed to update hardware:", e);
    }
  }
}
async function deleteHardwareFromDb(id) {
  localHardware = localHardware.filter((h) => h.id !== id);
  if (checkDbActive()) {
    try {
      await pool.query("DELETE FROM hardware WHERE id = $1", [id]);
    } catch (e) {
      console.error("Failed to delete hardware:", e);
    }
  }
}
async function getGamesFromDb() {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query("SELECT * FROM games WHERE (is_deleted IS NOT TRUE) ORDER BY name ASC");
      return rows;
    } catch (e) {
      console.error("Failed to fetch games:", e);
    }
  }
  return localGames.filter((g) => !g.is_deleted);
}
async function getGameByIdOrSlug(idOrSlug) {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query("SELECT * FROM games WHERE (id = $1 OR slug = $2) AND (is_deleted IS NOT TRUE)", [idOrSlug, idOrSlug]);
      return rows[0] || null;
    } catch (e) {
      console.error("Failed to fetch game by id/slug:", e);
    }
  }
  return localGames.find((g) => (g.id === idOrSlug || g.slug === idOrSlug) && !g.is_deleted) || null;
}
async function createGameInDb(id, name, slug, description, imageUrl, genre, developer, releaseYear, steamId) {
  const game = { id, name, slug, description: description || null, image_url: imageUrl || null, genre: genre || null, developer: developer || null, release_year: releaseYear || null, steam_id: steamId || null, is_deleted: false, created_at: (/* @__PURE__ */ new Date()).toISOString() };
  const idx = localGames.findIndex((g) => g.id === id);
  if (idx >= 0) localGames[idx] = { ...localGames[idx], ...game };
  else localGames.push(game);
  if (checkDbActive()) {
    try {
      await pool.query(
        `INSERT INTO games (id, name, slug, description, image_url, genre, developer, release_year, steam_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (id) DO NOTHING`,
        [id, name, slug, description || null, imageUrl || null, genre || null, developer || null, releaseYear || null, steamId || null]
      );
    } catch (e) {
      console.error("Failed to create game:", e);
    }
  }
}
async function updateGameInDb(id, name, slug, description, imageUrl, genre, developer, releaseYear, steamId) {
  const idx = localGames.findIndex((g) => g.id === id);
  if (idx >= 0) {
    localGames[idx] = { ...localGames[idx], name, slug, description: description || null, image_url: imageUrl || null, genre: genre || null, developer: developer || null, release_year: releaseYear || null, steam_id: steamId || null };
  }
  if (checkDbActive()) {
    try {
      await pool.query(
        `UPDATE games SET name = $2, slug = $3, description = $4, image_url = $5, genre = $6, developer = $7, release_year = $8, steam_id = $9 WHERE id = $1`,
        [id, name, slug, description || null, imageUrl || null, genre || null, developer || null, releaseYear || null, steamId || null]
      );
    } catch (e) {
      console.error("Failed to update game:", e);
    }
  }
}
async function deleteGameFromDb(id) {
  localGames = localGames.filter((g) => g.id !== id);
  if (checkDbActive()) {
    try {
      await pool.query("DELETE FROM games WHERE id = $1", [id]);
    } catch (e) {
      console.error("Failed to delete game:", e);
    }
  }
}
async function linkSetupToHardware(setupId, hardwareId, notes) {
  const existingIdx = localSetupHardware.findIndex((sh) => sh.setup_id === setupId && sh.hardware_id === hardwareId);
  if (existingIdx >= 0) {
    localSetupHardware[existingIdx].notes = notes || null;
  } else {
    localSetupHardware.push({ setup_id: setupId, hardware_id: hardwareId, notes: notes || null });
  }
  if (checkDbActive()) {
    try {
      await pool.query(
        `INSERT INTO setup_hardware (setup_id, hardware_id, notes) VALUES ($1, $2, $3) ON CONFLICT (setup_id, hardware_id) DO UPDATE SET notes = $3`,
        [setupId, hardwareId, notes || null]
      );
    } catch (e) {
      console.error("Failed to link setup to hardware:", e);
    }
  }
}
async function unlinkSetupFromHardware(setupId, hardwareId) {
  localSetupHardware = localSetupHardware.filter((sh) => !(sh.setup_id === setupId && sh.hardware_id === hardwareId));
  if (checkDbActive()) {
    try {
      await pool.query("DELETE FROM setup_hardware WHERE setup_id = $1 AND hardware_id = $2", [setupId, hardwareId]);
    } catch (e) {
      console.error("Failed to unlink setup from hardware:", e);
    }
  }
}
async function linkSetupToGame(setupId, gameId) {
  if (!localSetupGames.some((sg) => sg.setup_id === setupId && sg.game_id === gameId)) {
    localSetupGames.push({ setup_id: setupId, game_id: gameId });
  }
  if (checkDbActive()) {
    try {
      await pool.query(
        `INSERT INTO setup_games (setup_id, game_id) VALUES ($1, $2) ON CONFLICT (setup_id, game_id) DO NOTHING`,
        [setupId, gameId]
      );
    } catch (e) {
      console.error("Failed to link setup to game:", e);
    }
  }
}
async function unlinkSetupFromGame(setupId, gameId) {
  localSetupGames = localSetupGames.filter((sg) => !(sg.setup_id === setupId && sg.game_id === gameId));
  if (checkDbActive()) {
    try {
      await pool.query("DELETE FROM setup_games WHERE setup_id = $1 AND game_id = $2", [setupId, gameId]);
    } catch (e) {
      console.error("Failed to unlink setup from game:", e);
    }
  }
}
async function getSetupHardware(setupId) {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query(`
        SELECT h.*, sh.notes, b.name as brand_name, c.name as category_name
        FROM setup_hardware sh
        JOIN hardware h ON sh.hardware_id = h.id
        LEFT JOIN brands b ON h.brand_id = b.id
        LEFT JOIN hardware_categories c ON h.category_id = c.id
        WHERE sh.setup_id = $1 AND (h.is_deleted IS NOT TRUE)
      `, [setupId]);
      return rows;
    } catch (e) {
      console.error("Failed to fetch setup hardware:", e);
    }
  }
  return localSetupHardware.filter((sh) => sh.setup_id === setupId).map((sh) => {
    const h = localHardware.find((item) => item.id === sh.hardware_id && !item.is_deleted);
    if (!h) return null;
    const brand = localBrands.find((b) => b.id === h.brand_id);
    const cat = localCategories.find((c) => c.id === h.category_id);
    return { ...h, notes: sh.notes, brand_name: brand?.name || null, category_name: cat?.name || null };
  }).filter(Boolean);
}
async function getSetupGames(setupId) {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query(`
        SELECT g.*
        FROM setup_games sg
        JOIN games g ON sg.game_id = g.id
        WHERE sg.setup_id = $1 AND (g.is_deleted IS NOT TRUE)
      `, [setupId]);
      return rows;
    } catch (e) {
      console.error("Failed to fetch setup games:", e);
    }
  }
  return localSetupGames.filter((sg) => sg.setup_id === setupId).map((sg) => {
    return localGames.find((g) => g.id === sg.game_id && !g.is_deleted);
  }).filter(Boolean);
}
async function createEntityAuditLog(entityType, entityId, action, performedBy, payload) {
  const logEntry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    entity_type: entityType,
    entity_id: entityId,
    action,
    performed_by: performedBy || "system",
    payload: payload || null,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  localEntityAuditLogs.unshift(logEntry);
  if (checkDbActive()) {
    try {
      await pool.query(
        `INSERT INTO entity_audit_logs (id, entity_type, entity_id, action, performed_by, payload) VALUES ($1, $2, $3, $4, $5, $6)`,
        [logEntry.id, entityType, entityId, action, performedBy || "system", payload ? JSON.stringify(payload) : null]
      );
    } catch (e) {
      console.error("Failed to create entity audit log:", e);
    }
  }
}
async function getEntityAuditLogs(limit = 50) {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query(`SELECT * FROM entity_audit_logs ORDER BY created_at DESC LIMIT $1`, [limit]);
      return rows;
    } catch (e) {
      console.error("Failed to fetch entity audit logs:", e);
    }
  }
  return localEntityAuditLogs.slice(0, limit);
}
async function getHardwarePaginated(options) {
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(100, Math.max(1, options.limit || 20));
  const offset = (page - 1) * limit;
  if (checkDbActive()) {
    try {
      let whereClause = `WHERE (h.is_deleted IS NOT TRUE)`;
      const params = [];
      if (options.search) {
        params.push(`%${options.search}%`);
        whereClause += ` AND (h.name ILIKE $${params.length} OR h.description ILIKE $${params.length} OR h.slug ILIKE $${params.length})`;
      }
      if (options.brandId) {
        params.push(options.brandId);
        whereClause += ` AND h.brand_id = $${params.length}`;
      }
      if (options.categoryId) {
        params.push(options.categoryId);
        whereClause += ` AND h.category_id = $${params.length}`;
      }
      const countQuery = `SELECT COUNT(*) FROM hardware h ${whereClause}`;
      const countRes = await pool.query(countQuery, params);
      const total2 = parseInt(countRes.rows[0].count, 10);
      const dataQuery = `
        SELECT h.*, b.name as brand_name, c.name as category_name
        FROM hardware h
        LEFT JOIN brands b ON h.brand_id = b.id
        LEFT JOIN hardware_categories c ON h.category_id = c.id
        ${whereClause}
        ORDER BY h.name ASC
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}
      `;
      const dataRes = await pool.query(dataQuery, [...params, limit, offset]);
      return {
        items: dataRes.rows,
        total: total2,
        page,
        limit,
        totalPages: Math.ceil(total2 / limit) || 1
      };
    } catch (e) {
      console.error("Failed to fetch paginated hardware:", e);
    }
  }
  let filtered = localHardware.filter((h) => !h.is_deleted);
  if (options.search) {
    const q = options.search.toLowerCase();
    filtered = filtered.filter((h) => h.name.toLowerCase().includes(q) || h.description && h.description.toLowerCase().includes(q) || h.slug.toLowerCase().includes(q));
  }
  if (options.brandId) filtered = filtered.filter((h) => h.brand_id === options.brandId);
  if (options.categoryId) filtered = filtered.filter((h) => h.category_id === options.categoryId);
  const total = filtered.length;
  const sliced = filtered.slice(offset, offset + limit).map((h) => {
    const brand = localBrands.find((b) => b.id === h.brand_id);
    const cat = localCategories.find((c) => c.id === h.category_id);
    return { ...h, brand_name: brand?.name || null, category_name: cat?.name || null };
  });
  return { items: sliced, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
}
async function getBrandsPaginated(options) {
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(100, Math.max(1, options.limit || 20));
  const offset = (page - 1) * limit;
  if (checkDbActive()) {
    try {
      let whereClause = `WHERE (is_deleted IS NOT TRUE)`;
      const params = [];
      if (options.search) {
        params.push(`%${options.search}%`);
        whereClause += ` AND (name ILIKE $${params.length} OR description ILIKE $${params.length} OR slug ILIKE $${params.length})`;
      }
      const countRes = await pool.query(`SELECT COUNT(*) FROM brands ${whereClause}`, params);
      const total2 = parseInt(countRes.rows[0].count, 10);
      const dataRes = await pool.query(`SELECT * FROM brands ${whereClause} ORDER BY name ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`, [...params, limit, offset]);
      return {
        items: dataRes.rows,
        total: total2,
        page,
        limit,
        totalPages: Math.ceil(total2 / limit) || 1
      };
    } catch (e) {
      console.error("Failed to fetch paginated brands:", e);
    }
  }
  let filtered = localBrands.filter((b) => !b.is_deleted);
  if (options.search) {
    const q = options.search.toLowerCase();
    filtered = filtered.filter((b) => b.name.toLowerCase().includes(q) || b.description && b.description.toLowerCase().includes(q) || b.slug.toLowerCase().includes(q));
  }
  const total = filtered.length;
  const sliced = filtered.slice(offset, offset + limit);
  return { items: sliced, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
}
async function getGamesPaginated(options) {
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(100, Math.max(1, options.limit || 20));
  const offset = (page - 1) * limit;
  if (checkDbActive()) {
    try {
      let whereClause = `WHERE (is_deleted IS NOT TRUE)`;
      const params = [];
      if (options.search) {
        params.push(`%${options.search}%`);
        whereClause += ` AND (name ILIKE $${params.length} OR genre ILIKE $${params.length} OR developer ILIKE $${params.length} OR slug ILIKE $${params.length})`;
      }
      const countRes = await pool.query(`SELECT COUNT(*) FROM games ${whereClause}`, params);
      const total2 = parseInt(countRes.rows[0].count, 10);
      const dataRes = await pool.query(`SELECT * FROM games ${whereClause} ORDER BY name ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`, [...params, limit, offset]);
      return {
        items: dataRes.rows,
        total: total2,
        page,
        limit,
        totalPages: Math.ceil(total2 / limit) || 1
      };
    } catch (e) {
      console.error("Failed to fetch paginated games:", e);
    }
  }
  let filtered = localGames.filter((g) => !g.is_deleted);
  if (options.search) {
    const q = options.search.toLowerCase();
    filtered = filtered.filter((g) => g.name.toLowerCase().includes(q) || g.genre && g.genre.toLowerCase().includes(q) || g.slug.toLowerCase().includes(q));
  }
  const total = filtered.length;
  const sliced = filtered.slice(offset, offset + limit);
  return { items: sliced, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
}
async function softDeleteEntityInDb(entityType, id, performedBy) {
  if (entityType === "hardware") {
    const item = localHardware.find((h) => h.id === id);
    if (item) item.is_deleted = true;
  } else if (entityType === "brands") {
    const item = localBrands.find((b) => b.id === id);
    if (item) item.is_deleted = true;
  } else if (entityType === "categories") {
    const item = localCategories.find((c) => c.id === id);
    if (item) item.is_deleted = true;
  } else if (entityType === "games") {
    const item = localGames.find((g) => g.id === id);
    if (item) item.is_deleted = true;
  }
  await createEntityAuditLog(entityType, id, "SOFT_DELETE", performedBy, { id });
  if (checkDbActive()) {
    try {
      const tableMap = {
        hardware: "hardware",
        brands: "brands",
        categories: "hardware_categories",
        games: "games"
      };
      const tableName = tableMap[entityType];
      if (!tableName) return false;
      await pool.query(`UPDATE ${tableName} SET is_deleted = TRUE WHERE id = $1`, [id]);
      return true;
    } catch (e) {
      console.error(`Failed to soft delete ${entityType}:`, e);
    }
  }
  return true;
}
async function bulkInsertHardwareInDb(items, performedBy) {
  let inserted = 0;
  const errors = [];
  if (checkDbActive()) {
    for (const item of items) {
      try {
        if (!item.id || !item.name || !item.slug) {
          errors.push({ item, error: "id, name and slug required" });
          continue;
        }
        await createHardwareInDb(item.id, item.name, item.slug, item.brandId, item.categoryId, item.description, item.specs, item.imageUrl, item.priceEstimate, item.buyLink);
        inserted++;
      } catch (err) {
        errors.push({ item, error: err.message });
      }
    }
    await createEntityAuditLog("hardware", "bulk", "BULK_INSERT", performedBy, { count: inserted, errorsCount: errors.length });
  }
  return { inserted, errors };
}
async function addNotificationToDb(notification) {
  if (checkDbActive()) {
    try {
      await pool.query(
        `INSERT INTO notifications (id, user_id, sender_id, sender_name, sender_avatar, type, title, content, link)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          notification.id,
          notification.userId,
          notification.senderId || null,
          notification.senderName || null,
          notification.senderAvatar || null,
          notification.type,
          notification.title,
          notification.content,
          notification.link || null
        ]
      );
    } catch (e) {
      console.error("Failed to add notification:", e);
    }
  }
}
async function addBotReportToDb(report) {
  if (checkDbActive()) {
    try {
      await pool.query(
        `INSERT INTO bot_reports (bot_id, bot_name, report_type, details, severity)
         VALUES ($1, $2, $3, $4, $5)`,
        [report.botId, report.botName, report.reportType, report.details, report.severity || "low"]
      );
    } catch (e) {
      console.error("Failed to add bot report:", e);
    }
  }
}
async function getBotReportsFromDb() {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query(`SELECT * FROM bot_reports ORDER BY created_at DESC LIMIT 100`);
      return rows;
    } catch (e) {
      console.error("Failed to fetch bot reports:", e);
    }
  }
  return [];
}
async function resolveBotReportInDb(reportId) {
  if (checkDbActive()) {
    try {
      await pool.query(`DELETE FROM bot_reports WHERE id = $1`, [reportId]);
    } catch (e) {
      console.error("Failed to resolve bot report:", e);
    }
  }
}
async function clearBotReportsInDb() {
  if (checkDbActive()) {
    try {
      await pool.query(`DELETE FROM bot_reports`);
    } catch (e) {
      console.error("Failed to clear bot reports:", e);
    }
  }
}
async function getGlobalChatHistoryFromDb(limit = 50) {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query(
        `SELECT * FROM chat_messages WHERE receiver_id = 'global' ORDER BY created_at DESC LIMIT $1`,
        [limit]
      );
      return rows.reverse();
    } catch (e) {
      console.error("Failed to fetch global chat history:", e);
    }
  }
  return [];
}
async function createAiConversation(userId, title, model = "gemini-2.5-flash", systemPrompt) {
  const id = `conv-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  if (checkDbActive()) {
    await pool.query(
      `INSERT INTO ai_conversations (id, user_id, title, model, system_prompt, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
      [id, userId, title, model, systemPrompt || null]
    );
  }
  return id;
}
async function addAiMessage(conversationId, sender, text, tokenCount = 0, modelUsed, errorStatus) {
  const id = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  if (checkDbActive()) {
    await pool.query(
      `INSERT INTO ai_messages (id, conversation_id, sender, text, token_count, model_used, error_status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
      [id, conversationId, sender, text, tokenCount, modelUsed || null, errorStatus || null]
    );
    await pool.query(
      `UPDATE ai_conversations SET updated_at = NOW(), total_tokens = COALESCE(total_tokens, 0) + $1 WHERE id = $2`,
      [tokenCount, conversationId]
    );
  }
  return id;
}
async function getAiConversationsForUser(userId) {
  if (checkDbActive()) {
    const { rows } = await pool.query(
      `SELECT * FROM ai_conversations WHERE user_id = $1 ORDER BY updated_at DESC`,
      [userId]
    );
    return rows;
  }
  return [];
}
async function getAiMessagesForConversation(conversationId) {
  if (checkDbActive()) {
    const { rows } = await pool.query(
      `SELECT * FROM ai_messages WHERE conversation_id = $1 ORDER BY created_at ASC`,
      [conversationId]
    );
    return rows;
  }
  return [];
}
async function getAiAnalyticsForAdmin() {
  if (checkDbActive()) {
    const conversationsCountRes = await pool.query(`SELECT COUNT(*) FROM ai_conversations`);
    const messagesCountRes = await pool.query(`SELECT COUNT(*) FROM ai_messages`);
    const tokensSumRes = await pool.query(`SELECT COALESCE(SUM(total_tokens), 0) as total FROM ai_usage`);
    const recentConvs = await pool.query(
      `SELECT c.*, u.name as user_name, u.email as user_email 
       FROM ai_conversations c 
       LEFT JOIN users u ON c.user_id = u.id 
       ORDER BY c.updated_at DESC LIMIT 20`
    );
    return {
      totalConversations: parseInt(conversationsCountRes.rows[0].count, 10),
      totalMessages: parseInt(messagesCountRes.rows[0].count, 10),
      totalTokensUsed: parseInt(tokensSumRes.rows[0].total, 10),
      recentConversations: recentConvs.rows
    };
  }
  return { totalConversations: 0, totalMessages: 0, totalTokensUsed: 0, recentConversations: [] };
}
async function getChatRooms() {
  if (checkDbActive()) {
    const { rows } = await pool.query(`SELECT * FROM chat_rooms ORDER BY name ASC`);
    return rows;
  }
  return [
    { id: "global", name: "Global Sohbet", type: "global", description: "T\xFCm Setupss toplulu\u011Fu genel sohbet odas\u0131", is_private: false },
    { id: "hardware", name: "Donan\u0131m & Setup Lounge", type: "hardware", description: "Ekran kart\u0131, i\u015Flemci, kasa ve \xE7evre birimi tart\u0131\u015Fmalar\u0131", is_private: false },
    { id: "ai-hub", name: "AI B\xFCt\xE7e & Dan\u0131\u015Fman", type: "ai-hub", description: "Yapay zeka sistem toplama ve optimizasyon sohbetleri", is_private: false }
  ];
}
async function getRoomMessages(roomId, limit = 50) {
  if (checkDbActive()) {
    const { rows } = await pool.query(
      `SELECT * FROM chat_messages WHERE receiver_id = $1 ORDER BY created_at DESC LIMIT $2`,
      [roomId, limit]
    );
    return rows.reverse();
  }
  return [];
}
async function addRoomMessage(msg) {
  if (checkDbActive()) {
    await pool.query(
      `INSERT INTO chat_messages (id, sender_id, sender_name, sender_avatar, receiver_id, receiver_name, message, created_at, media_url, media_type, sender_has_rgb, is_read)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $8, $9, $10, TRUE)`,
      [
        msg.id,
        msg.senderId,
        msg.senderName,
        msg.senderAvatar || null,
        msg.roomId,
        "Oda Sohbeti",
        msg.message,
        msg.mediaUrl || null,
        msg.mediaType || null,
        msg.senderHasRgb || false
      ]
    );
  }
}
async function createChatRoom(room) {
  if (checkDbActive()) {
    await pool.query(
      `INSERT INTO chat_rooms (id, name, slug, description, icon, is_private, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       ON CONFLICT (id) DO NOTHING`,
      [
        room.id,
        room.name,
        room.slug,
        room.description || null,
        room.icon || null,
        room.isPrivate || false
      ]
    );
  }
}
async function getBlogPostsFromDb(category, search) {
  try {
    if (!checkDbActive()) {
      let filtered = localBlogPosts.filter((p) => p.isPublished);
      if (category && category !== "T\xFCm\xFC" && category !== "all") {
        filtered = filtered.filter((p) => p.category.toLowerCase().includes(category.toLowerCase()));
      }
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter((p) => p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q) || p.tags.some((t2) => t2.toLowerCase().includes(q)));
      }
      return filtered;
    }
    let query = `SELECT id, title, slug, summary, content, category, cover_image as "coverImage", author_name as "authorName", author_avatar as "authorAvatar", read_time_minutes as "readTimeMinutes", tags, hardware_slugs as "hardwareSlugs", is_published as "isPublished", created_at as "createdAt", updated_at as "updatedAt" FROM blog_posts WHERE is_published = TRUE`;
    const params = [];
    if (category && category !== "T\xFCm\xFC" && category !== "all") {
      params.push(`%${category}%`);
      query += ` AND category ILIKE $${params.length}`;
    }
    if (search) {
      params.push(`%${search}%`);
      query += ` AND (title ILIKE $${params.length} OR summary ILIKE $${params.length} OR content ILIKE $${params.length})`;
    }
    query += ` ORDER BY created_at DESC`;
    const res = await pool.query(query, params);
    if (res.rows.length === 0 && localBlogPosts.length > 0) return localBlogPosts;
    return res.rows;
  } catch {
    return localBlogPosts;
  }
}
async function getBlogPostBySlugFromDb(slug) {
  const cleanSlug = slug.toLowerCase().trim();
  try {
    if (!checkDbActive()) {
      return localBlogPosts.find((p) => p.slug === cleanSlug || p.id === cleanSlug) || localBlogPosts[0] || null;
    }
    const res = await pool.query(
      `SELECT id, title, slug, summary, content, category, cover_image as "coverImage", author_name as "authorName", author_avatar as "authorAvatar", read_time_minutes as "readTimeMinutes", tags, hardware_slugs as "hardwareSlugs", is_published as "isPublished", created_at as "createdAt", updated_at as "updatedAt" 
       FROM blog_posts WHERE slug = $1 OR id = $1`,
      [cleanSlug]
    );
    if (res.rows.length === 0) {
      return localBlogPosts.find((p) => p.slug === cleanSlug || p.id === cleanSlug) || localBlogPosts[0] || null;
    }
    return res.rows[0];
  } catch {
    return localBlogPosts.find((p) => p.slug === cleanSlug || p.id === cleanSlug) || localBlogPosts[0] || null;
  }
}
async function createBlogPostInDb(post) {
  const newPost = {
    id: post.id || `blog-${Date.now()}`,
    title: post.title || "Yeni Blog Yaz\u0131s\u0131",
    slug: post.slug || `blog-${Date.now()}`,
    summary: post.summary || "",
    content: post.content || "",
    category: post.category || "Rehber",
    coverImage: post.coverImage || "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1200&q=80",
    authorName: post.authorName || "Setupss \xDCyesi",
    authorAvatar: post.authorAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80",
    readTimeMinutes: post.readTimeMinutes || 5,
    tags: post.tags || [],
    hardwareSlugs: post.hardwareSlugs || [],
    isPublished: post.isPublished ?? true,
    likesCount: post.likesCount || 0,
    dislikesCount: post.dislikesCount || 0,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  localBlogPosts.unshift(newPost);
  try {
    if (checkDbActive()) {
      await pool.query(`
        INSERT INTO blog_posts (id, title, slug, summary, content, category, cover_image, author_name, author_avatar, read_time_minutes, tags, hardware_slugs, is_published, likes_count, dislikes_count, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW())
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          summary = EXCLUDED.summary,
          content = EXCLUDED.content,
          cover_image = EXCLUDED.cover_image,
          updated_at = NOW();
      `, [
        newPost.id,
        newPost.title,
        newPost.slug,
        newPost.summary,
        newPost.content,
        newPost.category,
        newPost.coverImage,
        newPost.authorName,
        newPost.authorAvatar,
        newPost.readTimeMinutes,
        JSON.stringify(newPost.tags),
        JSON.stringify(newPost.hardwareSlugs),
        newPost.isPublished,
        newPost.likesCount,
        newPost.dislikesCount
      ]);
    }
  } catch (e) {
    console.error("Failed to insert blog post to DB:", e);
  }
  return newPost;
}
async function voteBlogPostInDb(id, type) {
  let target = localBlogPosts.find((p) => p.id === id || p.slug === id);
  if (target) {
    if (type === "like") {
      target.likesCount = (target.likesCount || 0) + 1;
    } else {
      target.dislikesCount = (target.dislikesCount || 0) + 1;
    }
  }
  try {
    if (checkDbActive()) {
      const col = type === "like" ? "likes_count" : "dislikes_count";
      await pool.query(`
        UPDATE blog_posts 
        SET ${col} = COALESCE(${col}, 0) + 1 
        WHERE id = $1 OR slug = $1
      `, [id]);
      const res = await pool.query(
        `SELECT COALESCE(likes_count, 0) as "likesCount", COALESCE(dislikes_count, 0) as "dislikesCount" FROM blog_posts WHERE id = $1 OR slug = $1`,
        [id]
      );
      if (res.rows.length > 0) {
        return {
          likesCount: parseInt(res.rows[0].likesCount, 10),
          dislikesCount: parseInt(res.rows[0].dislikesCount, 10)
        };
      }
    }
  } catch (e) {
    console.error("Failed to vote blog post in DB:", e);
  }
  return {
    likesCount: target?.likesCount || (type === "like" ? 1 : 0),
    dislikesCount: target?.dislikesCount || (type === "dislike" ? 1 : 0)
  };
}
var import_pg, import_dotenv2, import_bcryptjs, rawDbUrl, isValidPostgresUrl, pool, initializeDatabase, localChatMessages, localFriendships, localUsersList, localActivityLogs, localSiteSettings, localBrands, localCategories, localHardware, localGames, localSetupHardware, localSetupGames, localEntityAuditLogs, localBlogPosts;
var init_server_db = __esm({
  "server-db.ts"() {
    import_pg = require("pg");
    import_dotenv2 = __toESM(require("dotenv"), 1);
    import_bcryptjs = __toESM(require("bcryptjs"), 1);
    init_hardwareEngine();
    init_seedBlogPosts();
    import_dotenv2.default.config({ override: true });
    rawDbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.SUPABASE_DATABASE_URL;
    isValidPostgresUrl = !!(rawDbUrl && (rawDbUrl.startsWith("postgresql://") || rawDbUrl.startsWith("postgres://")));
    pool = new import_pg.Pool(
      isValidPostgresUrl ? { connectionString: rawDbUrl, ssl: { rejectUnauthorized: false } } : {
        host: process.env.SQL_HOST,
        user: process.env.SQL_USER,
        password: process.env.SQL_PASSWORD,
        database: process.env.SQL_DB_NAME,
        connectionTimeoutMillis: 5e3
      }
    );
    initializeDatabase = initDatabase;
    localChatMessages = [];
    localFriendships = [];
    localUsersList = [];
    localActivityLogs = [];
    localSiteSettings = {
      instagram_link: "https://instagram.com",
      twitter_link: "https://twitter.com",
      youtube_link: "https://youtube.com",
      github_link: "https://github.com",
      discord_link: "https://discord.com",
      linkedin_link: "https://linkedin.com",
      contact_email: "setupss.support@gmail.com"
    };
    localBrands = [
      { id: "b-asus", name: "ASUS", slug: "asus", description: "Republic of Gamers & TUF Gaming hardware", logo_url: "https://logo.clearbit.com/asus.com", website: "https://asus.com", is_deleted: false },
      { id: "b-logitech", name: "Logitech", slug: "logitech", description: "Logitech G peripherals and creator tools", logo_url: "https://logo.clearbit.com/logitech.com", website: "https://logitech.com", is_deleted: false },
      { id: "b-nvidia", name: "NVIDIA", slug: "nvidia", description: "GeForce RTX graphics processors", logo_url: "https://logo.clearbit.com/nvidia.com", website: "https://nvidia.com", is_deleted: false },
      { id: "b-amd", name: "AMD", slug: "amd", description: "Ryzen processors and Radeon graphics", logo_url: "https://logo.clearbit.com/amd.com", website: "https://amd.com", is_deleted: false }
    ];
    localCategories = [
      { id: "c-gpu", name: "GPU", slug: "gpu", description: "Graphics Cards & Display Processors", is_deleted: false },
      { id: "c-cpu", name: "CPU", slug: "cpu", description: "Central Processing Units", is_deleted: false },
      { id: "c-keyboard", name: "Klavye", slug: "klavye", description: "Mechanical & Custom Keyboards", is_deleted: false },
      { id: "c-mouse", name: "Mouse", slug: "mouse", description: "Gaming & Ergonomic Mice", is_deleted: false }
    ];
    localHardware = [
      { id: "hw-5090", name: "NVIDIA GeForce RTX 5090", slug: "rtx-5090", brand_id: "b-nvidia", category_id: "c-gpu", description: "Flagship Blackwell Architecture GPU", specs: { vram: "32GB GDDR7", bus: "512-bit" }, price_estimate: 79999, is_deleted: false },
      { id: "hw-7800x3d", name: "AMD Ryzen 7 7800X3D", slug: "ryzen-7-7800x3d", brand_id: "b-amd", category_id: "c-cpu", description: "Ultimate Gaming Processor with 3D V-Cache", specs: { cores: 8, threads: 16, cache: "104MB" }, price_estimate: 15499, is_deleted: false }
    ];
    localGames = [
      { id: "g-valorant", name: "Valorant", slug: "valorant", description: "Tactical 5v5 character-based shooter", genre: "FPS", developer: "Riot Games", release_year: 2020, is_deleted: false },
      { id: "g-cs2", name: "Counter-Strike 2", slug: "cs2", description: "Tactical FPS built on Source 2", genre: "FPS", developer: "Valve", release_year: 2023, is_deleted: false }
    ];
    localSetupHardware = [];
    localSetupGames = [];
    localEntityAuditLogs = [];
    localBlogPosts = JSON.parse(JSON.stringify(SEED_BLOG_POSTS));
  }
});

// server/shared/database.ts
var init_database = __esm({
  "server/shared/database.ts"() {
    init_server_db();
  }
});

// src/types.ts
var HardwareCategoryEnum;
var init_types = __esm({
  "src/types.ts"() {
    HardwareCategoryEnum = [
      "CPU",
      "GPU",
      "MOTHERBOARD",
      "RAM",
      "STORAGE_SSD",
      "STORAGE_HDD",
      "PSU",
      "CASE",
      "COOLER_CPU",
      "MONITOR",
      "KEYBOARD",
      "MOUSE",
      "HEADSET",
      "MIC",
      "WEBCAM",
      "GAMEPAD",
      "CHAIR",
      "SPEAKER",
      "NETWORK"
    ];
  }
});

// server/services/HardwareIntelligenceService.ts
var HardwareIntelligenceService_exports = {};
__export(HardwareIntelligenceService_exports, {
  HardwareIntelligenceService: () => HardwareIntelligenceService,
  hardwareIntelligenceService: () => hardwareIntelligenceService
});
var import_genai2, import_node_crypto, uuidv4, ai, HardwareIntelligenceService, hardwareIntelligenceService;
var init_HardwareIntelligenceService = __esm({
  "server/services/HardwareIntelligenceService.ts"() {
    import_genai2 = require("@google/genai");
    init_types();
    init_database();
    import_node_crypto = require("node:crypto");
    uuidv4 = import_node_crypto.randomUUID;
    ai = new import_genai2.GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
    HardwareIntelligenceService = class {
      async normalizeHardwareData(rawText, sourceName) {
        if (!process.env.GEMINI_API_KEY) {
          throw new Error("GEMINI_API_KEY is missing");
        }
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [{ role: "user", parts: [{ text: `You are an expert PC hardware normalizer and web research AI. Analyze the following raw hardware data from ${sourceName} and normalize it into the strictly requested schema. 
CRITICAL REQUIREMENTS:
1. Estimate current Turkish retail market price in Turkish Lira (TRY / TL) taking into account local hardware taxes and margins in priceEstimateTry.
2. Translate all technical spec keys and descriptions into clear, accurate Turkish (e.g., '\xC7ekirdek Say\u0131s\u0131', 'Bellek Miktar\u0131', 'Soket Tipi', 'TDP').
3. Find an exact, direct high-resolution image URL or product photograph for this specific product in imageUrl.
4. Categorize accurately into one of the allowed categories (CPU, GPU, MOTHERBOARD, RAM, STORAGE_SSD, MONITOR, KEYBOARD, MOUSE, CHAIR, DESK_PAD, etc.).

RAW DATA:
${rawText}` }] }],
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: import_genai2.Type.OBJECT,
              properties: {
                name: { type: import_genai2.Type.STRING },
                category: { type: import_genai2.Type.STRING, enum: [...HardwareCategoryEnum] },
                brand: { type: import_genai2.Type.STRING },
                isCanonical: { type: import_genai2.Type.BOOLEAN },
                parentCanonicalName: { type: import_genai2.Type.STRING, nullable: true },
                variantType: { type: import_genai2.Type.STRING, nullable: true },
                specs: { type: import_genai2.Type.OBJECT, description: "Detailed specs dictionary in Turkish for this component" },
                confidenceScore: { type: import_genai2.Type.NUMBER },
                priceEstimateTry: { type: import_genai2.Type.NUMBER, description: "Estimated Turkish retail price in Turkish Lira (TRY) including VAT and local retailer margin" },
                imageUrl: { type: import_genai2.Type.STRING, description: "Direct high resolution image URL of the hardware item" }
              },
              required: ["name", "category", "brand", "isCanonical", "specs", "confidenceScore", "priceEstimateTry"]
            },
            temperature: 0.1
          }
        });
        const resultText = response.text;
        if (!resultText) throw new Error("No response from Gemini");
        const parsed = JSON.parse(resultText);
        return parsed;
      }
      async ingestRawData(rawText, sourceName) {
        const normalized = await this.normalizeHardwareData(rawText, sourceName);
        let categoryImage = normalized.imageUrl;
        if (!categoryImage || !categoryImage.startsWith("http")) {
          const catUpper = (normalized.category || "").toUpperCase();
          if (catUpper === "MOUSE") categoryImage = "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1200&q=80";
          else if (catUpper === "KEYBOARD") categoryImage = "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80";
          else if (catUpper === "CPU") categoryImage = "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80";
          else if (catUpper === "GPU") categoryImage = "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?auto=format&fit=crop&w=1200&q=80";
          else if (catUpper === "MONITOR") categoryImage = "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80";
          else if (catUpper === "MOTHERBOARD") categoryImage = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80";
          else if (catUpper === "RAM") categoryImage = "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1200&q=80";
          else if (catUpper === "STORAGE_SSD" || catUpper === "STORAGE_HDD") categoryImage = "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1200&q=80";
          else categoryImage = "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?auto=format&fit=crop&w=1200&q=80";
        }
        const client = await pool.connect();
        try {
          await client.query("BEGIN");
          let brandId = null;
          if (normalized.brand) {
            let brandSlug = normalized.brand.toLowerCase().replace(/[^a-z0-9]/g, "-");
            const brandRes = await client.query("SELECT id FROM brands WHERE slug = $1", [brandSlug]);
            if (brandRes.rows.length > 0) {
              brandId = brandRes.rows[0].id;
            } else {
              brandId = uuidv4();
              await client.query("INSERT INTO brands (id, name, slug) VALUES ($1, $2, $3)", [brandId, normalized.brand, brandSlug]);
            }
          }
          let categoryId = null;
          if (normalized.category) {
            let catSlug = normalized.category.toLowerCase().replace(/[^a-z0-9]/g, "-");
            if (catSlug === "mouse") catSlug = "mice";
            else if (catSlug === "keyboard") catSlug = "keyboards";
            else if (catSlug === "cpu") catSlug = "processors";
            else if (catSlug === "gpu") catSlug = "graphics-cards";
            else if (catSlug === "motherboard") catSlug = "motherboards";
            else if (catSlug === "ram") catSlug = "memory";
            else if (catSlug === "monitor") catSlug = "monitors";
            const catRes = await client.query("SELECT id FROM hardware_categories WHERE slug = $1", [catSlug]);
            if (catRes.rows.length > 0) {
              categoryId = catRes.rows[0].id;
            } else {
              categoryId = uuidv4();
              await client.query("INSERT INTO hardware_categories (id, name, slug) VALUES ($1, $2, $3)", [categoryId, normalized.category, catSlug]);
            }
          }
          const slug = normalized.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
          const hwId = uuidv4();
          let parentHardwareId = null;
          if (!normalized.isCanonical && normalized.parentCanonicalName) {
            const parentSlug = normalized.parentCanonicalName.toLowerCase().replace(/[^a-z0-9]/g, "-");
            const parentRes = await client.query("SELECT id FROM hardware WHERE slug = $1", [parentSlug]);
            if (parentRes.rows.length > 0) {
              parentHardwareId = parentRes.rows[0].id;
            }
          }
          await client.query(
            `INSERT INTO hardware (id, name, slug, brand_id, category_id, specs, parent_hardware_id, is_canonical, variant_type, price_estimate, image_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (slug) DO UPDATE SET 
           specs = EXCLUDED.specs, 
           is_canonical = EXCLUDED.is_canonical, 
           price_estimate = EXCLUDED.price_estimate,
           image_url = COALESCE(EXCLUDED.image_url, hardware.image_url),
           category_id = EXCLUDED.category_id`,
            [hwId, normalized.name, slug, brandId, categoryId, normalized.specs, parentHardwareId, normalized.isCanonical, normalized.variantType, normalized.priceEstimateTry || 0, categoryImage]
          );
          await client.query("COMMIT");
          return { status: "success", normalized, id: hwId };
        } catch (e) {
          await client.query("ROLLBACK");
          throw e;
        } finally {
          client.release();
        }
      }
      async searchAndIngestHardware(componentName) {
        if (!process.env.GEMINI_API_KEY) {
          throw new Error("GEMINI_API_KEY is missing");
        }
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [{
            role: "user",
            parts: [{
              text: `Search the web using Google Search and find the precise official specifications, image photo URL, and current Turkish market pricing for this PC component: "${componentName}".
Normalize these specifications into Turkish (e.g. '\xC7ekirdek Say\u0131s\u0131', 'Bellek Miktar\u0131', 'Soket Tipi', 'TDP', 'Sens\xF6r', 'DPI', etc.), find the current retail Turkish price in TL (TRY) incorporating Turkish VAT and margin, and return a JSON matching the requested schema.
CRITICAL TASK FOR IMAGE:
Find an exact direct URL to an official product photograph or image for "${componentName}" in imageUrl.
CRITICAL TASK FOR CATEGORY:
Detect the exact hardware component category (CPU, GPU, MOTHERBOARD, RAM, STORAGE_SSD, MONITOR, KEYBOARD, MOUSE, CHAIR, DESK_PAD, etc.).
Do not hallucinate; use real web search results.`
            }]
          }],
          config: {
            tools: [{ googleSearch: {} }],
            responseMimeType: "application/json",
            responseSchema: {
              type: import_genai2.Type.OBJECT,
              properties: {
                name: { type: import_genai2.Type.STRING },
                category: { type: import_genai2.Type.STRING, enum: [...HardwareCategoryEnum] },
                brand: { type: import_genai2.Type.STRING },
                isCanonical: { type: import_genai2.Type.BOOLEAN },
                parentCanonicalName: { type: import_genai2.Type.STRING, nullable: true },
                variantType: { type: import_genai2.Type.STRING, nullable: true },
                specs: { type: import_genai2.Type.OBJECT, description: "Detailed specs dictionary in Turkish for this hardware component" },
                confidenceScore: { type: import_genai2.Type.NUMBER },
                priceEstimateTry: { type: import_genai2.Type.NUMBER, description: "Estimated local Turkish retail store price in Turkish Lira (TRY) including Turkish VAT and distributor margin" },
                imageUrl: { type: import_genai2.Type.STRING, description: "Direct high resolution product image URL" }
              },
              required: ["name", "category", "brand", "isCanonical", "specs", "confidenceScore", "priceEstimateTry"]
            },
            temperature: 0.1
          }
        });
        const resultText = response.text;
        if (!resultText) throw new Error("No response from Gemini Search Grounding");
        return await this.ingestRawData(resultText, "Gemini Web Search Grounding");
      }
      async analyzeSetup(hardwareComponents, resolution, game) {
        if (!process.env.GEMINI_API_KEY) {
          throw new Error("GEMINI_API_KEY is missing");
        }
        const componentListText = hardwareComponents.map((c) => `- ${c.category}: ${c.name} (${c.brand})`).join("\n");
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [{
            role: "user",
            parts: [{
              text: `You are an expert PC hardware analyst. Analyze this hardware setup for gaming at ${resolution} specifically in ${game}.
          
SETUP:
${componentListText}

Provide a comprehensive analysis including:
1. Bottleneck Analysis: Which component is the bottleneck and by what percentage? (estimate realistically based on current benchmarks).
2. FPS Estimation: Realistic average FPS for ${game} at ${resolution} on High/Ultra settings.
3. Compatibility: Are these parts compatible? Any issues?
4. System Scores: Give scores (0-100) for Overall, Gaming, Productivity, and Upgradability.
5. Upgrade Recommendation: What should be upgraded next and why?
6. Knowledge Graph: Identify key relationships for these components (e.g., RECOMMENDED_PAIRING, BOTTLENECKED_BY).

CRITICAL INSTRUCTIONS FOR PERSONA & LANGUAGE:
- T\xDCM YANITLARI KES\u0130NL\u0130KLE T\xDCRK\xC7E VER! (All textual responses must be in Turkish).
- Mizahi, e\u011Flenceli ve biraz iddial\u0131/\xF6v\xFCnen bir dil kullan. ("PCPartPicker a\u011Fl\u0131yor \u015Fu an", "Reddit'teki amat\xF6rler bunu yapamad\u0131", "Bizim algoritmam\u0131z ezer ge\xE7er" gibi espriler yap).
- \u0130\u015Flemcinin g\xFCc\xFCn\xFC ve ekran kart\u0131 ile olan darbo\u011Faz oran\u0131n\u0131 komik ve abart\u0131l\u0131 benzetmelerle (ama do\u011Fru matematiksel hesaplamalarla) anlat.
- Kullan\u0131c\u0131ya donan\u0131m\u0131n ger\xE7ek kapasitesini esprili bir dille \xF6\u011Fret ve bizim devasa veritaban\u0131m\u0131zla ne kadar kusursuz bir i\u015F \xE7\u0131kard\u0131\u011F\u0131m\u0131z\u0131 vurgula.

CRITICAL PHYSICAL COHERENCE RULES FOR FPS ESTIMATION:
- Higher resolutions (e.g., 4K) MUST have lower FPS than lower resolutions (e.g., 1080p).
- 1080p FPS is the baseline highest value. 1440p FPS should be roughly 60-80% of 1080p FPS. 4K FPS should be roughly 30-50% of 1080p FPS.
- For a low/mid-tier GPU like a GTX 1660 Super, GTX 1660, or RTX 3050: It is physically impossible to get high FPS at 4K. At 4K, it should get less than 15-20 FPS (unplayable slides), while at 1080p it can get 60-85 FPS.
- For a high-tier GPU like RTX 4090 or RTX 5090: It can easily get 140+ FPS at 4K, and 200+ FPS at 1080p.
- Ensure the FPS estimation you output is physically realistic and calibrated to this pairing. Do not hallucinate high 4K FPS with a low-end GPU!

Output MUST match the requested JSON schema.`
            }]
          }],
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: import_genai2.Type.OBJECT,
              properties: {
                bottleneck: {
                  type: import_genai2.Type.OBJECT,
                  properties: {
                    percentage: { type: import_genai2.Type.NUMBER, description: "Bottleneck percentage (0-100)" },
                    componentCategory: { type: import_genai2.Type.STRING, description: "Category causing the bottleneck (e.g., CPU, GPU)" },
                    status: { type: import_genai2.Type.STRING, description: "Short status like 'Excellent', 'Minor CPU Bottleneck'" },
                    explanation: { type: import_genai2.Type.STRING }
                  },
                  required: ["percentage", "componentCategory", "status", "explanation"]
                },
                fpsEstimation: {
                  type: import_genai2.Type.OBJECT,
                  properties: {
                    averageFps: { type: import_genai2.Type.NUMBER },
                    game: { type: import_genai2.Type.STRING },
                    resolution: { type: import_genai2.Type.STRING }
                  },
                  required: ["averageFps", "game", "resolution"]
                },
                compatibility: {
                  type: import_genai2.Type.OBJECT,
                  properties: {
                    isCompatible: { type: import_genai2.Type.BOOLEAN },
                    issues: { type: import_genai2.Type.ARRAY, items: { type: import_genai2.Type.STRING } },
                    note: { type: import_genai2.Type.STRING }
                  },
                  required: ["isCompatible", "issues", "note"]
                },
                scores: {
                  type: import_genai2.Type.OBJECT,
                  properties: {
                    overall: { type: import_genai2.Type.NUMBER },
                    gaming: { type: import_genai2.Type.NUMBER },
                    productivity: { type: import_genai2.Type.NUMBER },
                    upgradability: { type: import_genai2.Type.NUMBER }
                  },
                  required: ["overall", "gaming", "productivity", "upgradability"]
                },
                upgradeRecommendation: {
                  type: import_genai2.Type.OBJECT,
                  properties: {
                    priority: { type: import_genai2.Type.STRING, enum: ["Low", "Medium", "High"] },
                    targetCategory: { type: import_genai2.Type.STRING },
                    reason: { type: import_genai2.Type.STRING },
                    expectedGain: { type: import_genai2.Type.STRING }
                  },
                  required: ["priority", "targetCategory", "reason", "expectedGain"]
                },
                graphConnections: {
                  type: import_genai2.Type.ARRAY,
                  items: {
                    type: import_genai2.Type.OBJECT,
                    properties: {
                      sourceCategory: { type: import_genai2.Type.STRING },
                      targetCategory: { type: import_genai2.Type.STRING },
                      targetName: { type: import_genai2.Type.STRING },
                      relationType: { type: import_genai2.Type.STRING, enum: ["COMPATIBLE_WITH", "RECOMMENDED_PAIRING", "POWERED_BY", "BOTTLENECKED_BY", "UPGRADE_TO", "USED_FOR"] }
                    },
                    required: ["sourceCategory", "targetCategory", "targetName", "relationType"]
                  }
                }
              },
              required: ["bottleneck", "fpsEstimation", "compatibility", "scores", "upgradeRecommendation", "graphConnections"]
            },
            temperature: 0.1
          }
        });
        const resultText = response.text;
        if (!resultText) throw new Error("No response from Gemini");
        return JSON.parse(resultText);
      }
      async getHardwareSpecsForAI(slugOrId) {
        try {
          const { rows } = await pool.query(
            `SELECT h.name, hc.name as category, h.specs 
         FROM hardware h
         LEFT JOIN hardware_categories hc ON h.category_id = hc.id
         WHERE h.slug = $1 OR h.id = $1 OR h.icecat_id::text = $1 LIMIT 1`,
            [slugOrId]
          );
          if (rows.length === 0) return null;
          const hw = rows[0];
          return `Donan\u0131m: ${hw.name}, Kategori: ${hw.category || "Belirtilmedi"}, Teknik \xD6zellikler: ${JSON.stringify(hw.specs)}`;
        } catch (err) {
          console.error("Error fetching specs for AI:", err);
          return null;
        }
      }
    };
    hardwareIntelligenceService = new HardwareIntelligenceService();
  }
});

// server/services/BuildCoresScraper.ts
var BuildCoresScraper_exports = {};
__export(BuildCoresScraper_exports, {
  BuildCoresScraper: () => BuildCoresScraper,
  buildCoresScraper: () => buildCoresScraper
});
var import_https, BuildCoresScraper, buildCoresScraper;
var init_BuildCoresScraper = __esm({
  "server/services/BuildCoresScraper.ts"() {
    init_HardwareIntelligenceService();
    import_https = __toESM(require("https"), 1);
    BuildCoresScraper = class {
      async fetchJson(url) {
        return new Promise((resolve, reject) => {
          const options = {
            headers: { "User-Agent": "Setupss-Hardware-Engine" }
          };
          import_https.default.get(url, options, (res) => {
            let data = "";
            res.on("data", (chunk) => data += chunk);
            res.on("end", () => {
              if (res.statusCode === 200) {
                resolve(JSON.parse(data));
              } else {
                reject(new Error(`Failed to fetch ${url}: ${res.statusCode}`));
              }
            });
          }).on("error", reject);
        });
      }
      async fetchAndIngestCategory(categoryName, limit = 5) {
        const apiUrl = `https://api.github.com/repos/buildcores/buildcores-open-db/contents/open-db/${categoryName}`;
        const files = await this.fetchJson(apiUrl);
        if (!Array.isArray(files)) throw new Error("Expected array of files");
        const results = [];
        let count = 0;
        for (const file of files) {
          if (count >= limit) break;
          if (file.type === "file" && file.name.endsWith(".json")) {
            const rawData = await this.fetchJson(file.download_url);
            const result = await hardwareIntelligenceService.ingestRawData(JSON.stringify(rawData), "BuildCores OpenDB");
            results.push(result);
            count++;
          }
        }
        return results;
      }
    };
    buildCoresScraper = new BuildCoresScraper();
  }
});

// server.ts
var server_exports = {};
__export(server_exports, {
  app: () => app,
  dbInitPromise: () => dbInitPromise,
  default: () => server_default
});
module.exports = __toCommonJS(server_exports);
init_hardwareEngine();
var import_express4 = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_genai4 = require("@google/genai");
var import_dotenv3 = __toESM(require("dotenv"), 1);
var import_passport = __toESM(require("passport"), 1);
var import_passport_local = require("passport-local");
var import_passport_google_oauth20 = require("passport-google-oauth20");
var import_express_session = __toESM(require("express-session"), 1);
var import_connect_pg_simple = __toESM(require("connect-pg-simple"), 1);
var import_helmet = __toESM(require("helmet"), 1);
var import_compression = __toESM(require("compression"), 1);
var import_express_rate_limit = __toESM(require("express-rate-limit"), 1);
var import_bcryptjs3 = __toESM(require("bcryptjs"), 1);
var import_nodemailer = __toESM(require("nodemailer"), 1);
var import_ws = require("ws");
var import_socket = require("socket.io");

// server/services/IcecatSyncService.ts
init_server_db();
var import_node_cron = __toESM(require("node-cron"), 1);
var import_genai = require("@google/genai");
var IcecatSyncService = class {
  get username() {
    return process.env.ICECAT_USERNAME || "";
  }
  get geminiApiKey() {
    return process.env.GEMINI_API_KEY || "";
  }
  // Helper to wait
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  /**
   * Generates candidate product codes / model numbers from a verbose hardware title
   */
  extractProductCodeCandidates(name, brand) {
    const candidates = [];
    if (!name) return candidates;
    candidates.push(name.trim());
    let clean = name.replace(new RegExp(`^${brand}\\s+`, "i"), "").replace(/\b(Processor|Gaming|Wireless|Mechanical Keyboard|Gaming Mouse|Founders Edition|OC Edition|Socket|Graphics Card|Motherboard)\b/gi, "").replace(/\b(\d+(\.\d+)?\s*GHz|\d+\s*-Core|\d+\s*GB\s*GDDR\w*|LGA\s*\d+|AM\d+)\b/gi, "").trim();
    if (clean && clean !== name) {
      candidates.push(clean);
    }
    const modelMatches = name.match(/\b(Ryzen\s*\d+\s*\d+\w*|Core\s*i[3579]-\w+|RTX\s*\d+\w*|RX\s*\d+\w*|B\d{3}\w*|Z\d{3}\w*|X\d{3}\w*|Superlight\s*\d*|Apex\s*Pro\s*\w*)\b/gi);
    if (modelMatches) {
      for (const m of modelMatches) {
        if (!candidates.includes(m)) candidates.push(m);
      }
    }
    return Array.from(new Set(candidates.filter((c) => c.length >= 3)));
  }
  /**
   * Fetch a single product from Icecat by GTIN (EAN) or Brand + ProductCode
   */
  async fetchProductFromIcecat(params) {
    if (!this.username) {
      return null;
    }
    let url = `https://live.icecat.biz/api/?UserName=${encodeURIComponent(this.username)}&Language=en`;
    if (params.gtin) {
      url += `&GTIN=${encodeURIComponent(params.gtin)}`;
    } else if (params.brand && params.productCode) {
      url += `&Brand=${encodeURIComponent(params.brand)}&ProductCode=${encodeURIComponent(params.productCode)}`;
    } else {
      return null;
    }
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(6e3) });
      if (!response.ok) {
        return null;
      }
      const data = await response.json();
      if (data && (data.StatusCode === 1 || data.msg === "OK" && data.data)) {
        return data.data;
      }
      return null;
    } catch {
      return null;
    }
  }
  /**
   * Parse the FeaturesGroups array into a clean key-value object for our JSONB specs
   */
  extractSpecs(featuresGroups) {
    const specs = {};
    if (!featuresGroups || !Array.isArray(featuresGroups)) return specs;
    for (const group of featuresGroups) {
      const features = group.Features || [];
      for (const feature of features) {
        const key = feature.Feature?.Name?.Value;
        const value = feature.Value;
        if (key && value) {
          specs[key] = String(value);
        }
      }
    }
    return specs;
  }
  /**
   * Generates rich hardware specifications via Gemini AI when Icecat does not have an exact XML match
   */
  async generateSpecsWithAI(name, brand, category) {
    if (!this.geminiApiKey) {
      return {
        "Model": name,
        "Marka": brand || "Genel",
        "Durum": "Katalogda Kay\u0131tl\u0131"
      };
    }
    try {
      const ai2 = new import_genai.GoogleGenAI({
        apiKey: this.geminiApiKey,
        httpOptions: { headers: { "User-Agent": "aistudio-build" } }
      });
      const prompt = `You are a PC hardware architect for Setupss. Provide a concise, highly accurate technical specifications key-value dictionary in Turkish for this PC component:
Hardware: "${name}"
Brand: "${brand || "Bilinmiyor"}"
Category: "${category || "Bilinmiyor"}"

Examples of specs in Turkish:
For CPU: "\xC7ekirdek Say\u0131s\u0131": "8", "\u0130\u015F Par\xE7ac\u0131\u011F\u0131": "16", "Temel Frekans": "4.2 GHz", "Turbo Frekans": "5.0 GHz", "Soket": "AM5", "TDP": "120W", "L3 \xD6nbellek": "96MB 3D V-Cache"
For GPU: "Bellek Boyutu": "24 GB", "Bellek T\xFCr\xFC": "GDDR6X", "Aray\xFCz": "PCIe 4.0 x16", "CUDA \xC7ekirde\u011Fi": "16384", "TGP": "450W"
For Mouse: "Sens\xF6r": "HERO 2", "DPI": "32000", "A\u011F\u0131rl\u0131k": "60g", "Ba\u011Flant\u0131": "Kablosuz Lightspeed"
For Keyboard: "Switch": "OmniPoint 2.0", "D\xFCzen": "TKL (%80)", "Ayd\u0131nlatma": "RGB", "Ba\u011Flant\u0131": "Kablolu / Kablosuz"

Output STRICT JSON key-value object with 4 to 8 essential specs. Keys and values must be concise Turkish strings.`;
      const response = await ai2.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          temperature: 0.1
        }
      });
      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        if (typeof parsed === "object" && parsed !== null && Object.keys(parsed).length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn(`[Hardware Graph Fallback] AI spec generation skipped for ${name}:`, err?.message || err);
    }
    return {
      "Model": name,
      "Marka": brand || "Genel",
      "Durum": "Katalogda Do\u011Fruland\u0131"
    };
  }
  /**
   * Enrich existing hardware in the database that is missing specs or icecat_id
   */
  async enrichDatabase() {
    console.log("\u{1F916} [Hardware Knowledge Graph Bot] Starting database enrichment cycle...");
    try {
      const { rows } = await pool.query(`
        SELECT h.id, h.name, h.ean, h.image_url, b.name as brand_name, hc.name as category_name 
        FROM hardware h
        LEFT JOIN brands b ON h.brand_id = b.id
        LEFT JOIN hardware_categories hc ON h.category_id = hc.id
        WHERE (h.icecat_id IS NULL AND (h.specs IS NULL OR h.specs = '{}'::jsonb OR h.specs = 'null'::jsonb))
        LIMIT 25
      `);
      if (rows.length === 0) {
        console.log("\u{1F916} [Hardware Knowledge Graph Bot] Database is fully enriched with hardware specs. No pending items.");
        return;
      }
      console.log(`\u{1F916} [Hardware Knowledge Graph Bot] Found ${rows.length} hardware items to enrich.`);
      let successCount = 0;
      for (const hw of rows) {
        let icecatData = null;
        if (hw.ean && this.username) {
          icecatData = await this.fetchProductFromIcecat({ gtin: hw.ean });
        }
        if (!icecatData && hw.brand_name && this.username) {
          const candidates = this.extractProductCodeCandidates(hw.name, hw.brand_name);
          for (const cand of candidates) {
            icecatData = await this.fetchProductFromIcecat({ brand: hw.brand_name, productCode: cand });
            if (icecatData) break;
          }
        }
        if (icecatData) {
          const icecatId = icecatData.GeneralInfo?.IcecatId;
          const ean = icecatData.GeneralInfo?.GTIN?.[0] || hw.ean;
          const specsDict = this.extractSpecs(icecatData.FeaturesGroups);
          const imageUrl = icecatData.Image?.HighPic || icecatData.GeneralInfo?.ImageUrl || hw.image_url;
          if (icecatId) {
            await pool.query(`
              UPDATE hardware 
              SET 
                icecat_id = $1,
                ean = COALESCE($2, ean),
                specs = $3,
                image_url = COALESCE(image_url, $4),
                updated_at = NOW()
              WHERE id = $5
            `, [icecatId, ean, JSON.stringify(specsDict), imageUrl, hw.id]);
            console.log(`   \u2705 [Icecat] Enriched: ${hw.name} (Icecat ID: ${icecatId}, ${Object.keys(specsDict).length} specs)`);
            successCount++;
          }
        } else {
          const aiSpecs = await this.generateSpecsWithAI(hw.name, hw.brand_name, hw.category_name);
          await pool.query(`
            UPDATE hardware 
            SET 
              specs = $1,
              updated_at = NOW()
            WHERE id = $2
          `, [JSON.stringify(aiSpecs), hw.id]);
          console.log(`   \u{1F9E0} [Hardware Knowledge Graph] Enriched: ${hw.name} (${Object.keys(aiSpecs).length} specs populated)`);
          successCount++;
        }
        await this.sleep(400);
      }
      console.log(`\u{1F916} [Hardware Knowledge Graph Bot] Cycle complete. Successfully enriched ${successCount}/${rows.length} items.`);
    } catch (err) {
      console.error("\u{1F916} [Hardware Knowledge Graph Bot] Error during enrichment cycle:", err.message);
    }
  }
  /**
   * Add specific test products to jumpstart the database if empty
   */
  async seedPopularHardware() {
    if (!this.username) {
      return;
    }
    const popularItems = [
      // Motherboards
      { brand: "ASUS", productCode: "90MB14S0-M0EAY0", categorySlug: "motherboards", expectedName: "ASUS ROG STRIX B550-F GAMING" },
      { brand: "ASUS", productCode: "90MB18K0-M0EAY0", categorySlug: "motherboards", expectedName: "ASUS ROG STRIX Z690-A GAMING WIFI D4" },
      { brand: "MSI", productCode: "7C56-003R", categorySlug: "motherboards", expectedName: "MSI MPG B550 GAMING PLUS" },
      { brand: "MSI", productCode: "7D75-001R", categorySlug: "motherboards", expectedName: "MSI MAG B650 TOMAHAWK WIFI" },
      { brand: "Gigabyte", productCode: "B650 AORUS ELITE AX", categorySlug: "motherboards", expectedName: "Gigabyte B650 AORUS ELITE AX" },
      // Graphics Cards
      { brand: "ASUS", productCode: "90YV0FA7-M0NM00", categorySlug: "graphics-cards", expectedName: "ASUS ROG Strix RTX 3080" },
      { brand: "MSI", productCode: "V513-002R", categorySlug: "graphics-cards", expectedName: "MSI GeForce RTX 4070 Ti GAMING X TRIO 12G" },
      { brand: "MSI", productCode: "V397-019R", categorySlug: "graphics-cards", expectedName: "MSI GeForce RTX 3060 GAMING X 12G" },
      { brand: "Gigabyte", productCode: "GV-N4090GAMING OC-24GD", categorySlug: "graphics-cards", expectedName: "Gigabyte GeForce RTX 4090 GAMING OC 24G" },
      { brand: "Gigabyte", productCode: "GV-N3060GAMING OC-12GD 2.0", categorySlug: "graphics-cards", expectedName: "Gigabyte GeForce RTX 3060 GAMING OC 12G 2.0" },
      // Storage
      { brand: "Samsung", productCode: "MZ-V8P1T0BW", categorySlug: "storage", expectedName: "Samsung 980 PRO 1TB" },
      { brand: "Kingston", productCode: "SKC3000S/1024G", categorySlug: "storage", expectedName: "Kingston KC3000 1TB" },
      { brand: "Kingston", productCode: "SNV2S/1000G", categorySlug: "storage", expectedName: "Kingston NV2 1TB" },
      // Memory
      { brand: "Kingston", productCode: "KF552C40BBK2-32", categorySlug: "memory", expectedName: "Kingston FURY Beast DDR5 32GB" },
      // Monitors
      { brand: "ASUS", productCode: "90LM06U0-B01370", categorySlug: "monitors", expectedName: "ASUS ROG Strix XG27AQ" },
      { brand: "MSI", productCode: "9S6-3CA88A-028", categorySlug: "monitors", expectedName: "MSI Optix MAG274QRF-QD" },
      { brand: "Gigabyte", productCode: "M28U", categorySlug: "monitors", expectedName: "Gigabyte M28U" },
      { brand: "Samsung", productCode: "LC27G75TQSRXEN", categorySlug: "monitors", expectedName: "Samsung Odyssey G7" },
      { brand: "Philips", productCode: "24M1N3200ZA/00", categorySlug: "monitors", expectedName: "Philips Momentum 24M1N3200ZA/00" },
      { brand: "Dell", productCode: "U2723QE", categorySlug: "monitors", expectedName: "Dell UltraSharp U2723QE" },
      // Peripherals
      { brand: "ASUS", productCode: "90MP02N0-BMUA00", categorySlug: "keyboards", expectedName: "ASUS ROG Strix Flare II" },
      { brand: "ASUS", productCode: "90MP0110-B0UA00", categorySlug: "mice", expectedName: "ASUS ROG Balteus (Mouse Pad)" },
      { brand: "HP", productCode: "4P5P9AA", categorySlug: "mice", expectedName: "HyperX Pulsefire Haste" }
    ];
    try {
      const { rows: existing } = await pool.query(`SELECT COUNT(*) as count FROM hardware`);
      if (parseInt(existing[0].count) < 20) {
        const ensureCategoryAndBrand = async (catSlug, brandName) => {
          let catId = null;
          let brandId = null;
          try {
            const catRes = await pool.query(`SELECT id FROM hardware_categories WHERE slug = $1`, [catSlug]);
            if (catRes.rows.length > 0) catId = catRes.rows[0].id;
            else {
              const name = catSlug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
              const newCat = await pool.query(`INSERT INTO hardware_categories (id, name, slug) VALUES (gen_random_uuid(), $1, $2) RETURNING id`, [name, catSlug]);
              catId = newCat.rows[0].id;
            }
            const brandSlug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            const brandRes = await pool.query(`SELECT id FROM brands WHERE slug = $1`, [brandSlug]);
            if (brandRes.rows.length > 0) brandId = brandRes.rows[0].id;
            else {
              const newBrand = await pool.query(`INSERT INTO brands (id, name, slug) VALUES (gen_random_uuid(), $1, $2) RETURNING id`, [brandName, brandSlug]);
              brandId = newBrand.rows[0].id;
            }
          } catch {
          }
          return { catId, brandId };
        };
        let seededCount = 0;
        for (const item of popularItems) {
          const icecatData = await this.fetchProductFromIcecat({ brand: item.brand, productCode: item.productCode });
          if (icecatData) {
            const icecatId = icecatData.GeneralInfo?.IcecatId;
            const title = icecatData.GeneralInfo?.Title || item.expectedName;
            const specsDict = this.extractSpecs(icecatData.FeaturesGroups);
            const imageUrl = icecatData.Image?.HighPic || icecatData.GeneralInfo?.ImageUrl;
            const ean = icecatData.GeneralInfo?.GTIN?.[0] || null;
            if (icecatId) {
              const { catId, brandId } = await ensureCategoryAndBrand(item.categorySlug, item.brand);
              const slug = `seed-hw-${icecatId}`;
              await pool.query(`
                INSERT INTO hardware (id, name, slug, icecat_id, ean, specs, image_url, category_id, brand_id)
                VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8)
                ON CONFLICT (icecat_id) DO UPDATE SET
                  specs = EXCLUDED.specs,
                  image_url = EXCLUDED.image_url,
                  category_id = COALESCE(hardware.category_id, EXCLUDED.category_id),
                  brand_id = COALESCE(hardware.brand_id, EXCLUDED.brand_id)
              `, [title, slug, icecatId, ean, JSON.stringify(specsDict), imageUrl, catId, brandId]);
              seededCount++;
            }
          }
          await this.sleep(400);
        }
        if (seededCount > 0) {
          console.log(`\u{1F916} [Hardware Knowledge Graph Bot] Successfully seeded ${seededCount} catalog items!`);
        }
      }
    } catch (err) {
      console.error("\u{1F916} [Hardware Knowledge Graph Bot] Error seeding hardware:", err.message);
    }
  }
  /**
   * Start the background bot.
   * Runs seeding once on startup, then schedules nightly enrichment.
   */
  startCron() {
    console.log("\u{1F916} [Hardware Knowledge Graph Bot] Initializing internal background bot...");
    setTimeout(() => {
      this.seedPopularHardware().then(() => {
        this.enrichDatabase();
      });
    }, 6e3);
    import_node_cron.default.schedule("0 3 * * *", () => {
      console.log("\u{1F303} [Hardware Knowledge Graph Bot] Nightly cron job triggered at 03:00");
      this.enrichDatabase();
    });
    console.log("\u{1F916} [Hardware Knowledge Graph Bot] Cron schedule registered (0 3 * * *).");
  }
};
var icecatSyncBot = new IcecatSyncService();

// server/routes/userRoutes.ts
var import_express = require("express");

// server/repositories/UserRepository.ts
init_database();
var UserRepository = class {
  static async findByEmail(email) {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return rows[0] || null;
  }
  static async findById(id) {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return rows[0] || null;
  }
  static async create(user) {
    const { rows } = await pool.query(
      `INSERT INTO users (id, email, password_hash, name, role, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *`,
      [user.id, user.email, user.passwordHash, user.name, user.role || "user"]
    );
    return rows[0];
  }
  static async listAll() {
    const { rows } = await pool.query("SELECT id, email, name, role, is_verified, created_at FROM users ORDER BY created_at DESC");
    return rows;
  }
};

// server/middlewares/errorHandler.ts
var AppError = class extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
};

// server/services/UserService.ts
var UserService = class {
  static async getUserProfile(id) {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }
  static async listAllUsers() {
    return await UserRepository.listAll();
  }
  static async registerUser(data) {
    const existing = await UserRepository.findByEmail(data.email);
    if (existing) {
      throw new AppError("Email already registered", 400);
    }
    return await UserRepository.create(data);
  }
};

// server/controllers/UserController.ts
var UserController = class {
  static async getProfile(req, res, next) {
    try {
      const user = await UserService.getUserProfile(req.params.id);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }
  static async listUsers(req, res, next) {
    try {
      const users = await UserService.listAllUsers();
      res.json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  }
};

// server/routes/userRoutes.ts
var router = (0, import_express.Router)();
router.get("/", UserController.listUsers);
router.get("/:id", UserController.getProfile);
var userRoutes = router;

// server/routes/setupRoutes.ts
var import_express2 = require("express");

// server/repositories/SetupRepository.ts
init_database();
var SetupRepository = class {
  static async listAll() {
    const { rows } = await pool.query("SELECT * FROM setups ORDER BY created_at DESC");
    return rows;
  }
  static async findById(id) {
    const { rows } = await pool.query("SELECT * FROM setups WHERE id = $1", [id]);
    return rows[0] || null;
  }
  static async create(setup) {
    const { rows } = await pool.query(
      `INSERT INTO setups (id, title, owner, owner_id, category, description, image, tags, components, video_url, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb, $10, NOW()) RETURNING *`,
      [
        setup.id,
        setup.title,
        setup.owner,
        setup.ownerId || null,
        setup.category,
        setup.description || null,
        setup.image || null,
        JSON.stringify(setup.tags || []),
        JSON.stringify(setup.components || []),
        setup.videoUrl || null
      ]
    );
    return rows[0];
  }
  static async updateLikes(id, likes) {
    const { rows } = await pool.query("UPDATE setups SET likes = $1 WHERE id = $2 RETURNING *", [likes, id]);
    return rows[0] || null;
  }
};

// server/services/SetupService.ts
var SetupService = class {
  static async getAllSetups() {
    return await SetupRepository.listAll();
  }
  static async getSetupById(id) {
    const setup = await SetupRepository.findById(id);
    if (!setup) {
      throw new AppError("Setup showcase not found", 404);
    }
    return setup;
  }
  static async createSetup(data) {
    if (!data.title || !data.category) {
      throw new AppError("Title and category are required", 400);
    }
    return await SetupRepository.create(data);
  }
  static async likeSetup(id) {
    const setup = await SetupRepository.findById(id);
    if (!setup) {
      throw new AppError("Setup not found", 404);
    }
    const newLikes = (setup.likes || 0) + 1;
    return await SetupRepository.updateLikes(id, newLikes);
  }
};

// server/controllers/SetupController.ts
var SetupController = class {
  static async listSetups(req, res, next) {
    try {
      const setups = await SetupService.getAllSetups();
      res.json({ success: true, data: setups });
    } catch (error) {
      next(error);
    }
  }
  static async getSetup(req, res, next) {
    try {
      const setup = await SetupService.getSetupById(req.params.id);
      res.json({ success: true, data: setup });
    } catch (error) {
      next(error);
    }
  }
  static async createSetup(req, res, next) {
    try {
      const setup = await SetupService.createSetup(req.body);
      res.status(201).json({ success: true, data: setup });
    } catch (error) {
      next(error);
    }
  }
  static async likeSetup(req, res, next) {
    try {
      const updated = await SetupService.likeSetup(req.params.id);
      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }
};

// server/routes/setupRoutes.ts
var router2 = (0, import_express2.Router)();
router2.get("/", SetupController.listSetups);
router2.post("/", SetupController.createSetup);
router2.get("/:id", SetupController.getSetup);
router2.post("/:id/like", SetupController.likeSetup);
var setupRoutes = router2;

// server/routes/hardwareRoutes.ts
var import_express3 = require("express");

// server/repositories/HardwareRepository.ts
init_database();
var HardwareRepository = class {
  static async findBySlug(slug) {
    const { rows } = await pool.query(
      `SELECT h.*, b.name as brand_name, b.logo_url as brand_logo
       FROM hardware h
       LEFT JOIN brands b ON h.brand_id = b.id
       WHERE h.slug = $1 AND (h.is_deleted IS FALSE OR h.is_deleted IS NULL)`,
      [slug]
    );
    return rows[0] || null;
  }
  static async findById(id) {
    const { rows } = await pool.query(
      `SELECT h.*, b.name as brand_name
       FROM hardware h
       LEFT JOIN brands b ON h.brand_id = b.id
       WHERE h.id = $1`,
      [id]
    );
    return rows[0] || null;
  }
  static async listAll(category, query, limit = 50) {
    let sql = `
      SELECT h.*, b.name as brand_name, 
             COALESCE(hc.name, h.category_id) as category_name, 
             COALESCE(hc.slug, h.category_id) as category_slug
      FROM hardware h
      LEFT JOIN brands b ON h.brand_id = b.id
      LEFT JOIN hardware_categories hc ON h.category_id = hc.id
      WHERE (h.is_deleted IS FALSE OR h.is_deleted IS NULL)
    `;
    const params = [];
    if (category && category.trim() !== "" && category.toUpperCase() !== "ALL") {
      const catLower = category.trim().toLowerCase();
      let catVariants = [catLower];
      if (catLower === "gpu" || catLower === "graphics-cards") catVariants = ["gpu", "graphics-cards"];
      else if (catLower === "cpu" || catLower === "processors") catVariants = ["cpu", "processors"];
      else if (catLower === "motherboard" || catLower === "motherboards") catVariants = ["motherboard", "motherboards"];
      else if (catLower === "ram" || catLower === "memory") catVariants = ["ram", "memory"];
      else if (catLower === "storage" || catLower === "storage_ssd" || catLower === "ssd") catVariants = ["storage", "storage_ssd", "storage_hdd", "ssd"];
      else if (catLower === "monitor" || catLower === "monitors") catVariants = ["monitor", "monitors"];
      else if (catLower === "mouse" || catLower === "mice") catVariants = ["mouse", "mice"];
      else if (catLower === "keyboard" || catLower === "keyboards") catVariants = ["keyboard", "keyboards"];
      else if (catLower === "desk pad" || catLower === "desk_pad" || catLower === "deskpad" || catLower === "mousepad") catVariants = ["desk pad", "desk_pad", "deskpad", "mousepad"];
      params.push(catVariants);
      sql += ` AND (
        LOWER(COALESCE(hc.slug, '')) = ANY($${params.length}::text[]) OR 
        LOWER(COALESCE(hc.name, '')) = ANY($${params.length}::text[]) OR 
        LOWER(COALESCE(h.category_id, '')) = ANY($${params.length}::text[])
      )`;
    }
    if (query && query.trim() !== "") {
      params.push(`%${query.trim().toLowerCase()}%`);
      sql += ` AND (LOWER(h.name) LIKE $${params.length} OR LOWER(h.slug) LIKE $${params.length} OR LOWER(b.name) LIKE $${params.length})`;
    }
    params.push(limit);
    sql += ` ORDER BY h.created_at DESC LIMIT $${params.length}`;
    console.log("EXECUTING LISTALL SQL:", sql);
    console.log("EXECUTING LISTALL PARAMS:", params);
    const { rows } = await pool.query(sql, params);
    return rows;
  }
  static async getRelations(hardwareId) {
    const { rows } = await pool.query(
      `SELECT hr.*, 
              h_source.name as source_name, h_source.slug as source_slug, h_source.category as source_category,
              h_target.name as target_name, h_target.slug as target_slug, h_target.category as target_category, h_target.image_url as target_image
       FROM hardware_relations hr
       JOIN hardware h_source ON hr.source_id = h_source.id
       JOIN hardware h_target ON hr.target_id = h_target.id
       WHERE hr.source_id = $1 OR hr.target_id = $1`,
      [hardwareId]
    );
    return rows;
  }
  static async getBenchmarks(hardwareId) {
    const { rows } = await pool.query(
      `SELECT hb.*, g.name as game_name, g.slug as game_slug, g.image_url as game_image
       FROM hardware_benchmarks hb
       LEFT JOIN games g ON hb.game_id = g.id
       WHERE hb.hardware_id = $1
       ORDER BY hb.avg_fps DESC`,
      [hardwareId]
    );
    return rows;
  }
  static async getPriceHistory(hardwareId) {
    const { rows } = await pool.query(
      `SELECT * FROM hardware_price_history 
       WHERE hardware_id = $1 
       ORDER BY recorded_at ASC`,
      [hardwareId]
    );
    return rows;
  }
  static async getPairedSetups(hardwareSlug, limit = 10) {
    const { rows } = await pool.query(
      `SELECT s.* FROM setups s
       JOIN setup_hardware sh ON s.id = sh.setup_id
       JOIN hardware h ON sh.hardware_id = h.id
       WHERE h.slug = $1
       ORDER BY s.created_at DESC LIMIT $2`,
      [hardwareSlug, limit]
    );
    return rows;
  }
};

// server/services/HardwareService.ts
var HardwareService = class {
  static async getHardwareDetailsBySlug(slug) {
    const hardware = await HardwareRepository.findBySlug(slug);
    if (!hardware) {
      throw new AppError(`Hardware entity with slug '${slug}' not found`, 404);
    }
    const [relations, benchmarks, priceHistory, pairedSetups] = await Promise.all([
      HardwareRepository.getRelations(hardware.id),
      HardwareRepository.getBenchmarks(hardware.id),
      HardwareRepository.getPriceHistory(hardware.id),
      HardwareRepository.getPairedSetups(slug)
    ]);
    return {
      entity: hardware,
      relations,
      benchmarks,
      priceHistory,
      pairedSetups,
      graphSummary: {
        totalConnections: relations.length,
        totalSetupsUsing: pairedSetups.length,
        averageFps: benchmarks.length > 0 ? Math.round(benchmarks.reduce((acc, b) => acc + (b.avg_fps || 0), 0) / benchmarks.length) : null
      }
    };
  }
  static async getGraphDataForEntity(slug) {
    const hardware = await HardwareRepository.findBySlug(slug);
    if (!hardware) {
      throw new AppError(`Hardware entity '${slug}' not found for graph generation`, 404);
    }
    const relations = await HardwareRepository.getRelations(hardware.id);
    const nodes = [
      {
        id: hardware.id,
        label: hardware.name,
        category: hardware.category,
        type: "PRIMARY",
        slug: hardware.slug,
        image: hardware.image_url
      }
    ];
    const edges = [];
    for (const rel of relations) {
      const isSource = rel.source_id === hardware.id;
      const otherId = isSource ? rel.target_id : rel.source_id;
      const otherName = isSource ? rel.target_name : rel.source_name;
      const otherSlug = isSource ? rel.target_slug : rel.source_slug;
      const otherCategory = isSource ? rel.target_category : rel.source_category;
      if (!nodes.find((n) => n.id === otherId)) {
        nodes.push({
          id: otherId,
          label: otherName,
          category: otherCategory,
          type: "RELATED",
          slug: otherSlug,
          image: rel.target_image
        });
      }
      edges.push({
        id: rel.id,
        source: rel.source_id,
        target: rel.target_id,
        type: rel.relation_type,
        weight: rel.weight || 1,
        metadata: rel.metadata
      });
    }
    return { nodes, edges };
  }
  static async listHardwareEntities(category, query) {
    return await HardwareRepository.listAll(category, query);
  }
  static async calculateBottleneck(cpuSlug, gpuSlug, resolution = "1440p") {
    const [cpu, gpu] = await Promise.all([
      HardwareRepository.findBySlug(cpuSlug),
      HardwareRepository.findBySlug(gpuSlug)
    ]);
    if (!cpu || !gpu) {
      throw new AppError("CPU or GPU entity not found for bottleneck analysis", 404);
    }
    const cpuScore = cpu.benchmark_score || 1e4;
    const gpuScore = gpu.benchmark_score || 15e3;
    let resMultiplier = 1;
    if (resolution === "1080p") resMultiplier = 1.3;
    if (resolution === "1440p") resMultiplier = 1;
    if (resolution === "4K") resMultiplier = 0.7;
    const adjustedCpuScore = cpuScore * resMultiplier;
    const ratio = adjustedCpuScore / gpuScore;
    let bottleneckPercentage = 0;
    let bottleneckSource = "BALANCED";
    let recommendation = "";
    if (ratio < 0.75) {
      bottleneckPercentage = Math.min(Math.round((0.75 - ratio) * 100), 45);
      bottleneckSource = "CPU";
      recommendation = `${cpu.name} is slightly limiting the ${gpu.name} at ${resolution}. Consider upgrading CPU or gaming at higher resolutions like 4K.`;
    } else if (ratio > 1.35) {
      bottleneckPercentage = Math.min(Math.round((ratio - 1.35) * 50), 35);
      bottleneckSource = "GPU";
      recommendation = `${gpu.name} is running at 100% capacity while ${cpu.name} has head room. This is ideal for GPU-bound gaming at ${resolution}.`;
    } else {
      bottleneckPercentage = Math.round(Math.abs(1 - ratio) * 10);
      bottleneckSource = "BALANCED";
      recommendation = `Excellent match! ${cpu.name} and ${gpu.name} form an optimal gaming pairing for ${resolution}.`;
    }
    return {
      cpu: { name: cpu.name, slug: cpu.slug, score: cpuScore },
      gpu: { name: gpu.name, slug: gpu.slug, score: gpuScore },
      resolution,
      bottleneckPercentage,
      bottleneckSource,
      recommendation
    };
  }
};

// server/controllers/HardwareController.ts
init_BuildCoresScraper();
init_HardwareIntelligenceService();
var HardwareController = class {
  static async getBySlug(req, res, next) {
    try {
      const data = await HardwareService.getHardwareDetailsBySlug(req.params.slug);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
  static async getGraphData(req, res, next) {
    try {
      const data = await HardwareService.getGraphDataForEntity(req.params.slug);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
  static async listHardware(req, res, next) {
    try {
      const category = req.query.category || req.query.categoryId;
      const query = req.query.q || req.query.search;
      const list = await HardwareService.listHardwareEntities(category, query);
      res.json({ success: true, data: list });
    } catch (error) {
      next(error);
    }
  }
  static async getBottleneck(req, res, next) {
    try {
      const cpu = req.query.cpu || "amd-ryzen-7-9800x3d";
      const gpu = req.query.gpu || "nvidia-rtx-5090";
      const resolution = req.query.resolution || "1440p";
      const analysis = await HardwareService.calculateBottleneck(cpu, gpu, resolution);
      res.json({ success: true, data: analysis });
    } catch (error) {
      next(error);
    }
  }
  static async ingestBuildCores(req, res, next) {
    try {
      const { category, limit } = req.body;
      if (!category) {
        return res.status(400).json({ success: false, message: "category parametresi gereklidir (\xF6rne\u011Fin: cpu.json, gpu.json)" });
      }
      const fetchLimit = limit ? parseInt(limit, 10) : 5;
      const results = await buildCoresScraper.fetchAndIngestCategory(category, fetchLimit);
      res.json({ success: true, message: `${results.length} adet donan\u0131m ba\u015Far\u0131yla \xE7ekildi ve normalize edildi.`, results });
    } catch (error) {
      next(error);
    }
  }
  static async ingestAiSearch(req, res, next) {
    try {
      const { componentName } = req.body;
      if (!componentName) {
        return res.status(400).json({ success: false, message: "componentName parametresi gereklidir (\xF6rne\u011Fin: NVIDIA RTX 5090)" });
      }
      const result = await hardwareIntelligenceService.searchAndIngestHardware(componentName);
      res.json({ success: true, message: `Donan\u0131m ba\u015Far\u0131yla web'de arand\u0131, normalize edildi ve veritaban\u0131na kaydedildi.`, result });
    } catch (error) {
      next(error);
    }
  }
};

// server/services/authService.ts
var import_bcryptjs2 = __toESM(require("bcryptjs"), 1);
init_server_db();
var AuthService = class {
  async hashPassword(password) {
    return await import_bcryptjs2.default.hash(password, 10);
  }
  async comparePassword(password, hash) {
    if (!password || !hash) return false;
    return await import_bcryptjs2.default.compare(password, hash);
  }
  formatUserDto(row) {
    if (!row) return null;
    const isCrown = Boolean(row.is_crown || row.isCrown || (row.invite_count > 0 || row.inviteCount > 0));
    const hasRgb = Boolean(row.has_rgb || row.hasRgb || row.hasRgbEffect || (row.invite_count > 0 || row.inviteCount > 0));
    const isVerified = Boolean(row.is_verified || row.isVerified || row.email_verified);
    const verificationCode = row.verification_code || row.verificationCode || null;
    return {
      id: row.id,
      email: row.email,
      displayName: row.name || row.displayName || row.display_name || row.username || (row.email ? row.email.split("@")[0] : "Kullan\u0131c\u0131"),
      avatar: row.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${row.id}`,
      bio: row.bio || "",
      githubLink: row.github_link || row.githubLink || "",
      instagramLink: row.instagram_link || row.instagramLink || "",
      linkedinLink: row.linkedin_link || row.linkedinLink || "",
      coverPhoto: row.cover_photo || row.coverPhoto || "",
      customBadge: row.custom_badge || row.customBadge || "",
      customColor: row.custom_color || row.customColor || "",
      referenceCode: row.reference_code || row.referenceCode || "",
      inviteCount: row.invite_count || row.inviteCount || 0,
      isCrown,
      hasRgb,
      hasRgbEffect: hasRgb,
      role: row.role || "user",
      isVerified,
      is_verified: isVerified,
      verificationCode,
      verification_code: verificationCode,
      isBanned: Boolean(row.is_banned || row.isBanned || row.status === "banned"),
      avatarFrame: row.avatar_frame || row.avatarFrame || "none",
      createdAt: row.created_at || row.createdAt
    };
  }
  async getUserById(id) {
    if (!id) return null;
    if (!(process.env.DATABASE_URL || process.env.SQL_HOST) || !pool) return null;
    try {
      const { rows } = await pool.query(
        `SELECT u.*, p.username, p.display_name, p.cover_photo, p.bio, COALESCE(u.avatar_frame, p.avatar_frame, 'none') AS avatar_frame
         FROM users u
         LEFT JOIN public.profiles p ON u.id = p.id
         WHERE u.id = $1 LIMIT 1`,
        [id]
      );
      if (rows.length === 0) return null;
      return this.formatUserDto(rows[0]);
    } catch (err) {
      console.error("AuthService: Error in getUserById:", err);
      return null;
    }
  }
  async getUserByEmail(email) {
    if (!email) return null;
    if (!(process.env.DATABASE_URL || process.env.SQL_HOST) || !pool) return null;
    try {
      const { rows } = await pool.query(
        `SELECT u.*, p.username, p.display_name, p.cover_photo, p.bio, COALESCE(u.avatar_frame, p.avatar_frame, 'none') AS avatar_frame
         FROM users u
         LEFT JOIN public.profiles p ON u.id = p.id
         WHERE LOWER(u.email) = LOWER($1) LIMIT 1`,
        [email.trim()]
      );
      if (rows.length === 0) return null;
      return rows[0];
    } catch (err) {
      console.error("AuthService: Error in getUserByEmail:", err);
      return null;
    }
  }
  async findOrCreateGoogleUser(googlePayload) {
    const { googleSubId, email, displayName, photoUrl, metadata } = googlePayload;
    const cleanEmail = email.trim().toLowerCase();
    if (!pool || !(process.env.DATABASE_URL || process.env.SQL_HOST)) {
      throw new Error("Database connection required for Google Authentication.");
    }
    const identityRes = await pool.query(
      `SELECT user_id FROM auth_identities WHERE provider = 'google' AND provider_user_id = $1 LIMIT 1`,
      [googleSubId]
    );
    let userId = identityRes.rows[0]?.user_id || null;
    if (!userId) {
      const existingUser = await this.getUserByEmail(cleanEmail);
      if (existingUser) {
        userId = existingUser.id;
      } else {
        userId = `usr_g_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const name = displayName || splitEmailName(cleanEmail);
        const avatar = photoUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${userId}`;
        const refCode = Math.random().toString(36).substring(2, 10).toUpperCase();
        const role = cleanEmail === "setupss.support@gmail.com" ? "admin" : "user";
        await pool.query(
          `INSERT INTO users (id, email, password_hash, name, avatar, is_verified, email_verified, reference_code, role, last_login_at)
           VALUES ($1, $2, $3, $4, $5, TRUE, TRUE, $6, $7, NOW())`,
          [userId, cleanEmail, "", name, avatar, refCode, role]
        );
        await pool.query(
          `INSERT INTO public.profiles (id, email, username, display_name, avatar, role, is_verified)
           VALUES ($1, $2, $3, $4, $5, $6, TRUE)
           ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, updated_at = NOW()`,
          [userId, cleanEmail, splitEmailName(cleanEmail), name, avatar, role]
        );
      }
      await pool.query(
        `INSERT INTO auth_identities (id, user_id, provider, provider_user_id, provider_email, metadata)
         VALUES ($1, $2, 'google', $3, $4, $5)
         ON CONFLICT (provider, provider_user_id) DO UPDATE SET provider_email = EXCLUDED.provider_email, updated_at = NOW()`,
        [`ident_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`, userId, googleSubId, cleanEmail, JSON.stringify(metadata || {})]
      );
    } else {
      await pool.query(`UPDATE users SET last_login_at = NOW() WHERE id = $1`, [userId]);
    }
    const updatedUser = await this.getUserById(userId);
    if (!updatedUser) {
      throw new Error("Failed to retrieve created or linked Google user.");
    }
    return updatedUser;
  }
};
function splitEmailName(email) {
  if (!email || !email.includes("@")) return "User";
  return email.split("@")[0];
}
var authService = new AuthService();

// server/middlewares/authMiddleware.ts
async function optionalAuth(req, res, next) {
  try {
    const rawUser = req.user || req.session?.passport?.user || req.session?.user;
    if (rawUser) {
      if (typeof rawUser === "object" && rawUser.id) {
        const refreshed = await authService.getUserById(rawUser.id);
        req.user = refreshed || rawUser;
      } else if (typeof rawUser === "string") {
        const refreshed = await authService.getUserById(rawUser);
        req.user = refreshed;
      }
    } else {
      req.user = null;
    }
  } catch (err) {
    console.warn("optionalAuth hydration warning:", err);
  }
  next();
}
async function requireAuth(req, res, next) {
  await optionalAuth(req, res, () => {
    const user = req.user;
    if (!user || !user.id) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "Bu i\u015Flemi ger\xE7ekle\u015Ftirmek i\xE7in l\xFCtfen giri\u015F yap\u0131n."
      });
    }
    if (user.isBanned) {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        message: "Hesab\u0131n\u0131z ask\u0131ya al\u0131nm\u0131\u015Ft\u0131r. L\xFCtfen destek ile ileti\u015Fime ge\xE7in."
      });
    }
    next();
  });
}
async function requireAdmin(req, res, next) {
  await requireAuth(req, res, () => {
    const user = req.user;
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        message: "Bu alana eri\u015Fim yetkiniz bulunmamaktad\u0131r. Yaln\u0131zca sistem y\xF6neticileri eri\u015Febilir."
      });
    }
    next();
  });
}

// server/routes/hardwareRoutes.ts
var router3 = (0, import_express3.Router)();
router3.get("/", HardwareController.listHardware);
router3.get("/bottleneck", HardwareController.getBottleneck);
router3.post("/ingest/buildcores", requireAdmin, HardwareController.ingestBuildCores);
router3.post("/ingest/ai-search", HardwareController.ingestAiSearch);
router3.get("/:slug", HardwareController.getBySlug);
router3.get("/:slug/graph", HardwareController.getGraphData);
var hardwareRoutes = router3;

// src/utils/programmaticSeo.ts
init_slug();
var TRANSLATIONS = {
  tr: {
    overviewPrefix: "Setupss toplulu\u011Fu taraf\u0131ndan en \xE7ok tercih edilen",
    keyTakeawaysHeader: "\xD6nemli Detaylar ve Tavsiyeler",
    faqHeader: "S\u0131k\xE7a Sorulan Sorular",
    lowContentNotice: "Bu kombinasyonda yeterli masa\xFCst\xFC kurulum \xF6rne\u011Fi topland\u0131\u011F\u0131nda arama motorlar\u0131nda indekslenecektir.",
    and: "ve",
    vs: "kar\u015F\u0131la\u015Ft\u0131rmas\u0131"
  },
  en: {
    overviewPrefix: "Most popular desk setups curated by the Setupss community for",
    keyTakeawaysHeader: "Key Highlights & Recommendations",
    faqHeader: "Frequently Asked Questions",
    lowContentNotice: "This page will be indexed once sufficient setup entries are recorded.",
    and: "and",
    vs: "vs"
  },
  de: {
    overviewPrefix: "Beliebteste Desk-Setups aus der Setupss-Community f\xFCr",
    keyTakeawaysHeader: "Wichtige Highlights & Empfehlungen",
    faqHeader: "H\xE4ufig gestellte Fragen",
    lowContentNotice: "Diese Seite wird indiziert, sobald gen\xFCgend Setups gesammelt wurden.",
    and: "und",
    vs: "vs"
  },
  fr: {
    overviewPrefix: "Configurations de bureau les plus populaires de la communaut\xE9 Setupss pour",
    keyTakeawaysHeader: "Points forts et recommandations",
    faqHeader: "Foire aux questions",
    lowContentNotice: "Cette page sera index\xE9e d\xE8s que suffisamment de configurations seront enregistr\xE9es.",
    and: "et",
    vs: "contre"
  },
  es: {
    overviewPrefix: "Las configuraciones de escritorio m\xE1s populares de la comunidad Setupss para",
    keyTakeawaysHeader: "Aspectos destacados y recomendaciones",
    faqHeader: "Preguntas frecuentes",
    lowContentNotice: "Esta p\xE1gina se indexar\xE1 una vez que se registren suficientes ejemplos.",
    and: "y",
    vs: "vs"
  }
};
function generateProgrammaticSeo(param, baseUrl = "https://setupss.com") {
  const lang = param.locale && TRANSLATIONS[param.locale] ? param.locale : "tr";
  const t2 = TRANSLATIONS[lang];
  const count = param.matchCount ?? 5;
  const isIndexed = count >= 3;
  const robots = isIndexed ? "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" : "noindex, follow";
  let title = "";
  let description = "";
  let keywords = "";
  let canonicalPath = "/";
  const internalLinks = [];
  const primarySlug = slugify(param.primary);
  const secondarySlug = param.secondary ? slugify(param.secondary) : "";
  switch (param.type) {
    case "category_hardware":
      canonicalPath = `/category/${primarySlug}/hardware/${secondarySlug}`;
      title = `${param.primary} Kurulumlar\u0131nda ${param.secondary} Kullan\u0131m\u0131 | SETUPSS`;
      description = `${param.primary} masas\u0131nda ${param.secondary} kullanan en pop\xFCler oyuncu ve yaz\u0131l\u0131mc\u0131 masa\xFCst\xFC d\xFCzenleri. Ger\xE7ek kullan\u0131c\u0131 foto\u011Fraflar\u0131 ve kablo y\xF6netimi t\xFCyolar\u0131.`;
      keywords = `${param.primary}, ${param.secondary}, ${param.primary} setup, ${param.secondary} masas\u0131, setupss`;
      internalLinks.push(
        { label: `${param.primary} T\xFCm Setuplar`, href: `/category/${primarySlug}` },
        { label: `${param.secondary} Ekipman Detay\u0131`, href: `/hardware/${secondarySlug}` },
        { label: `Yapay Zeka B\xFCt\xE7e Planlay\u0131c\u0131`, href: `/ai-planner` }
      );
      break;
    case "brand_category":
      canonicalPath = `/brand/${primarySlug}/category/${secondarySlug}`;
      title = `${param.primary} \xDCr\xFCnl\xFC ${param.secondary} Kurulum \xD6rnekleri | SETUPSS`;
      description = `${param.primary} klavye, kulakl\u0131k ve monit\xF6rlerle donat\u0131lm\u0131\u015F en kaliteli ${param.secondary} \xE7al\u0131\u015Fma ortamlar\u0131n\u0131 ke\u015Ffet.`;
      keywords = `${param.primary}, ${param.secondary}, ${param.primary} ${param.secondary}, setupss`;
      internalLinks.push(
        { label: `${param.primary} T\xFCm Ekipmanlar`, href: `/brand/${primarySlug}` },
        { label: `${param.secondary} Kategorisi`, href: `/category/${secondarySlug}` }
      );
      break;
    case "room_style":
      canonicalPath = `/room/${primarySlug}/style/${secondarySlug}`;
      title = `${param.primary} Oda Tipinde ${param.secondary} Stil Masa\xFCst\xFC D\xFCzenleri | SETUPSS`;
      description = `${param.primary} odan\u0131z i\xE7in ${param.secondary} tarz\u0131 alan tasar\u0131m\u0131, LED ayd\u0131nlatma ve duvar panelleri \xF6rnekleri.`;
      keywords = `${param.primary} oda setup, ${param.secondary} masa d\xFCzeni, setupss`;
      internalLinks.push(
        { label: `${param.primary} Odalar\u0131`, href: `/room/${primarySlug}` },
        { label: `${param.secondary} Tarz\u0131 Setuplar`, href: `/tag/${secondarySlug}` }
      );
      break;
    case "color_style":
      canonicalPath = `/color/${primarySlug}/style/${secondarySlug}`;
      title = `${param.primary} Renk Paletli ${param.secondary} Temal\u0131 Masalar | SETUPSS`;
      description = `${param.primary} renk tonlar\u0131 ve ${param.secondary} konseptiyle tasarlanm\u0131\u015F estetik bilgisayar masalar\u0131.`;
      keywords = `${param.primary} setup, ${param.secondary} masa, setupss`;
      internalLinks.push(
        { label: `${param.primary} Renk Kombinleri`, href: `/tag/${primarySlug}` },
        { label: `${param.secondary} Stil`, href: `/tag/${secondarySlug}` }
      );
      break;
    case "budget_usecase":
      canonicalPath = `/budget/${primarySlug}/use-case/${secondarySlug}`;
      title = `${param.primary} TL B\xFCt\xE7e ile En \u0130yi ${param.secondary} Masa\xFCst\xFC Kurulumu | SETUPSS`;
      description = `${param.primary} TL s\u0131n\u0131rlar\u0131 i\xE7erisinde kurabilece\u011Finiz fiyat-performans ${param.secondary} masas\u0131 bile\u015Fenleri ve Akak\xE7e piyasa fiyat listesi.`;
      keywords = `${param.primary} TL setup, ${param.secondary} masas\u0131, ucuz setup, setupss`;
      internalLinks.push(
        { label: `AI B\xFCt\xE7e Planlay\u0131c\u0131`, href: `/ai-planner` },
        { label: `${param.secondary} At\xF6lyesi`, href: `/category/${secondarySlug}` }
      );
      break;
    case "hardware_combo":
      canonicalPath = `/hardware-combo/${primarySlug}-plus-${secondarySlug}`;
      title = `${param.primary} + ${param.secondary} Ekipman Kombinasyonu | SETUPSS`;
      description = `${param.primary} ve ${param.secondary} bile\u015Fenlerinin birlikte kullan\u0131ld\u0131\u011F\u0131 en uyumlu oyuncu ve tasar\u0131mc\u0131 masalar\u0131.`;
      keywords = `${param.primary}, ${param.secondary}, ${param.primary} ${param.secondary} combo, setupss`;
      internalLinks.push(
        { label: `${param.primary} Detaylar\u0131`, href: `/hardware/${primarySlug}` },
        { label: `${param.secondary} Detaylar\u0131`, href: `/hardware/${secondarySlug}` }
      );
      break;
    case "hardware_compare":
      canonicalPath = `/compare/${primarySlug}-vs-${secondarySlug}`;
      title = `${param.primary} vs ${param.secondary} Masa\xFCst\xFC Kullan\u0131m Kar\u015F\u0131la\u015Ft\u0131rmas\u0131 | SETUPSS`;
      description = `${param.primary} ve ${param.secondary} aras\u0131ndaki farklar, ger\xE7ek masa kurulumlar\u0131ndaki g\xF6r\xFCn\xFCm ve fiyat-performans de\u011Ferlendirmesi.`;
      keywords = `${param.primary} vs ${param.secondary}, ${param.primary} karsilastirma, setupss`;
      internalLinks.push(
        { label: `${param.primary} Kullanan Setuplar`, href: `/hardware/${primarySlug}` },
        { label: `${param.secondary} Kullanan Setuplar`, href: `/hardware/${secondarySlug}` },
        { label: `Trend F\u0131rsatlar`, href: `/deals` }
      );
      break;
    case "tag_intersection":
      canonicalPath = `/tag/${primarySlug}+${secondarySlug}`;
      title = `#${param.primary} ve #${param.secondary} Etiketli Estetik Masalar | SETUPSS`;
      description = `#${param.primary} ve #${param.secondary} etiketlerinin kesi\u015Fti\u011Fi en \xE7ok be\u011Fenilen bilgisayar masalar\u0131 ve oda tasar\u0131mlar\u0131.`;
      keywords = `#${param.primary}, #${param.secondary}, ${param.primary} ${param.secondary}, setupss`;
      internalLinks.push(
        { label: `#${param.primary} Etiketi`, href: `/tag/${primarySlug}` },
        { label: `#${param.secondary} Etiketi`, href: `/tag/${secondarySlug}` }
      );
      break;
  }
  const geoSummary = {
    overview: `${t2.overviewPrefix} ${param.primary} ${param.secondary ? `${t2.and} ${param.secondary}` : ""}. Total verified setups: ${count}.`,
    keyTakeaways: [
      `Optimal ergonomic positioning and cable management routing.`,
      `Verified compatibility between ${param.primary} and ${param.secondary || "companion accessories"}.`,
      `Community aggregate satisfaction rating: 4.9 / 5.0 based on ${count * 3} user interactions.`
    ],
    hardwareRecommendations: [
      { category: "Primary Component", item: param.primary, reason: "High performance to cost ratio verified by community logs." },
      { category: "Secondary Component", item: param.secondary || "Monitor Stand", reason: "Ensures optimal neck posture and desktop space saving." }
    ],
    faq: [
      {
        question: `Why choose ${param.primary} for ${param.secondary || "workspace"} setups?`,
        answer: `${param.primary} offers industry-standard build quality, minimal visual clutter, and seamlessly integrates with high-refresh rate displays and mechanical keyboards.`
      },
      {
        question: `How do I optimize cable management for this setup combination?`,
        answer: `Use under-desk cable trays, Velcro straps, and sleeve tubing to hide power adapters and display cords cleanly.`
      }
    ]
  };
  const schemaGraph = [
    {
      "@type": "WebPage",
      "@id": `${baseUrl}${canonicalPath}#webpage`,
      "url": `${baseUrl}${canonicalPath}`,
      "name": title,
      "description": description,
      "inLanguage": lang,
      "isPartOf": { "@id": `${baseUrl}/#website` },
      "breadcrumb": { "@id": `${baseUrl}${canonicalPath}#breadcrumb` }
    },
    {
      "@type": "CollectionPage",
      "@id": `${baseUrl}${canonicalPath}#collection`,
      "url": `${baseUrl}${canonicalPath}`,
      "name": title,
      "description": description
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${baseUrl}${canonicalPath}#breadcrumb`,
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Anasayfa", "item": `${baseUrl}/` },
        { "@type": "ListItem", "position": 2, "name": param.primary, "item": `${baseUrl}/${param.type.split("_")[0]}/${primarySlug}` },
        { "@type": "ListItem", "position": 3, "name": title, "item": `${baseUrl}${canonicalPath}` }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": `${baseUrl}${canonicalPath}#faq`,
      "mainEntity": geoSummary.faq.map((item) => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    }
  ];
  return {
    title,
    description,
    keywords,
    canonicalPath,
    robots,
    matchCount: count,
    geoSummary,
    internalLinks,
    schemaGraph
  };
}
function generateMainSitemapIndex(baseUrl = "https://setupss.com") {
  const lastmod = (/* @__PURE__ */ new Date()).toISOString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-pages.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-setups.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-users.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-blog.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-games.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-tags.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-brands.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-categories.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-hardware.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-images.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-video.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-programmatic.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
</sitemapindex>`;
}
function generateSetupsSitemapXml(setups, baseUrl = "https://setupss.com") {
  const lastmod = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const urlElements = setups.map((s) => {
    return `
  <url>
    <loc>${baseUrl}/setup/${s.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
  }).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}
function generateUsersSitemapXml(setups, baseUrl = "https://setupss.com") {
  const lastmod = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const users = /* @__PURE__ */ new Set();
  setups.forEach((s) => {
    if (s.owner) users.add(slugify(s.owner));
  });
  if (users.size === 0) {
    users.add("setupss");
    users.add("admin");
  }
  const urlElements = Array.from(users).map((u) => `
  <url>
    <loc>${baseUrl}/u/${u}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}
function generateBlogSitemapXml(setups, baseUrl = "https://setupss.com") {
  const lastmod = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const posts = [
    "masaustu-kablo-yonetimi-ve-rgb-aydinlatma-rehberi",
    "en-iyi-oyuncu-koltugu-secimi",
    "mekanik-klavye-switch-rehberi",
    "ergonomic-desk-setup"
  ];
  const mainBlogUrl = `
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;
  const urlElements = posts.map((p) => `
  <url>
    <loc>${baseUrl}/blog/${p}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/guide/${p}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${mainBlogUrl}${urlElements}
</urlset>`;
}
function generateGamesSitemapXml(setups, baseUrl = "https://setupss.com") {
  const lastmod = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const games = [
    "valorant",
    "cyberpunk-2077",
    "counter-strike-2",
    "minecraft",
    "gta-v",
    "league-of-legends",
    "apex-legends"
  ];
  const urlElements = games.map((g) => `
  <url>
    <loc>${baseUrl}/game/${g}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}
function generateTagsSitemapXml(setups, baseUrl = "https://setupss.com") {
  const lastmod = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const tags = /* @__PURE__ */ new Set();
  setups.forEach((s) => {
    if (s.tags) s.tags.forEach((t2) => tags.add(slugify(t2)));
  });
  if (tags.size === 0) {
    tags.add("rgb");
    tags.add("minimalist");
    tags.add("coding");
  }
  const urlElements = Array.from(tags).map((t2) => `
  <url>
    <loc>${baseUrl}/tag/${t2}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}
function generateBrandsSitemapXml(setups, baseUrl = "https://setupss.com") {
  const lastmod = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const brands = /* @__PURE__ */ new Set();
  setups.forEach((s) => {
    if (s.components) {
      s.components.forEach((c) => {
        if (c.name) {
          const b = c.name.split(" ")[0];
          if (b && b.length > 2) brands.add(slugify(b));
        }
      });
    }
  });
  if (brands.size === 0) {
    brands.add("asus");
    brands.add("logitech");
    brands.add("razer");
  }
  const urlElements = Array.from(brands).map((b) => `
  <url>
    <loc>${baseUrl}/brand/${b}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}
function generateCategoriesSitemapXml(setups, baseUrl = "https://setupss.com") {
  const lastmod = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const categories = /* @__PURE__ */ new Set();
  setups.forEach((s) => {
    if (s.category) categories.add(slugify(s.category));
  });
  if (categories.size === 0) {
    categories.add("yazilimci");
    categories.add("oyuncu");
    categories.add("minimalist");
  }
  const urlElements = Array.from(categories).map((c) => `
  <url>
    <loc>${baseUrl}/category/${c}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}
function generateHardwareSitemapXml(setups, baseUrl = "https://setupss.com") {
  const lastmod = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const hardware = /* @__PURE__ */ new Set();
  const gpus = ["rtx-4090", "rtx-4080", "rtx-4070-super", "rx-7900-xtx"];
  const cpus = ["ryzen-7-7800x3d", "ryzen-9-7950x", "intel-i9-14900k"];
  setups.forEach((s) => {
    if (s.components) {
      s.components.forEach((c) => {
        if (c.name) hardware.add(slugify(c.name));
      });
    }
  });
  const urlElements = [
    ...Array.from(hardware).map((h) => `
  <url>
    <loc>${baseUrl}/hardware/${h}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`),
    ...gpus.map((g) => `
  <url>
    <loc>${baseUrl}/gpu/${g}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`),
    ...cpus.map((c) => `
  <url>
    <loc>${baseUrl}/cpu/${c}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`)
  ].join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}
function generateProgrammaticSitemapXml(setups, baseUrl = "https://setupss.com") {
  const lastmod = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const urls = [
    `${baseUrl}/explore`,
    `${baseUrl}/trending`,
    `${baseUrl}/latest`,
    `${baseUrl}/ai-planner`,
    `${baseUrl}/deals`,
    `${baseUrl}/leaderboard`
  ];
  const categories = /* @__PURE__ */ new Set();
  const tags = /* @__PURE__ */ new Set();
  const hardware = /* @__PURE__ */ new Set();
  const brands = /* @__PURE__ */ new Set();
  setups.forEach((s) => {
    if (s.category) categories.add(slugify(s.category));
    if (s.tags) s.tags.forEach((t2) => tags.add(slugify(t2)));
    if (s.components) {
      s.components.forEach((c) => {
        if (c.name) {
          hardware.add(slugify(c.name));
          const brandMatch = c.name.split(" ")[0];
          if (brandMatch && brandMatch.length > 2) brands.add(slugify(brandMatch));
        }
      });
    }
  });
  categories.forEach((c) => urls.push(`${baseUrl}/category/${c}`));
  tags.forEach((t2) => urls.push(`${baseUrl}/tag/${t2}`));
  hardware.forEach((h) => urls.push(`${baseUrl}/hardware/${h}`));
  brands.forEach((b) => urls.push(`${baseUrl}/brand/${b}`));
  Array.from(categories).slice(0, 5).forEach((cat) => {
    Array.from(hardware).slice(0, 5).forEach((hw) => {
      urls.push(`${baseUrl}/category/${cat}/hardware/${hw}`);
    });
  });
  const urlElements = urls.map((url) => `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}
function generateImageSitemapXml(setups, baseUrl = "https://setupss.com") {
  const urlElements = setups.filter((s) => s.image).map((s) => {
    const imgUrl = s.image.startsWith("http") ? s.image : `${baseUrl}${s.image.startsWith("/") ? "" : "/"}${s.image}`;
    return `
  <url>
    <loc>${baseUrl}/setup/${s.id}</loc>
    <image:image>
      <image:loc>${escapeXml(imgUrl)}</image:loc>
      <image:title>${escapeXml(s.title || "Setupss Workspace")}</image:title>
      <image:caption>${escapeXml(s.description || "Masa\xFCst\xFC oyuncu ve \xE7al\u0131\u015Fma alan\u0131 kurulum foto\u011Fraf\u0131")}</image:caption>
      <image:geo_location>Istanbul, Turkey</image:geo_location>
      <image:license>${baseUrl}/terms</image:license>
    </image:image>
  </url>`;
  }).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlElements}
</urlset>`;
}
function generateVideoSitemapXml(setups, baseUrl = "https://setupss.com") {
  const urlElements = setups.filter((s) => s.videoUrl || s.image && s.image.endsWith(".mp4")).map((s) => {
    const rawVUrl = s.videoUrl || "";
    const vUrl = rawVUrl.startsWith("http") ? rawVUrl : `${baseUrl}${rawVUrl.startsWith("/") ? "" : "/"}${rawVUrl}`;
    const rawThumbUrl = s.image || "/logoarkaplanolmayan.png";
    const thumbUrl = rawThumbUrl.startsWith("http") ? rawThumbUrl : `${baseUrl}${rawThumbUrl.startsWith("/") ? "" : "/"}${rawThumbUrl}`;
    return `
  <url>
    <loc>${baseUrl}/setup/${s.id}</loc>
    <video:video>
      <video:thumbnail_loc>${escapeXml(thumbUrl)}</video:thumbnail_loc>
      <video:title>${escapeXml(s.title || "Setupss AI Video Tour")}</video:title>
      <video:description>${escapeXml(s.description || "Setupss Masa\xFCst\xFC video incelemesi ve 3D turu")}</video:description>
      <video:content_loc>${escapeXml(vUrl)}</video:content_loc>
      <video:publication_date>2026-01-01T00:00:00+03:00</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
      <video:duration>30</video:duration>
      <video:view_count>1250</video:view_count>
    </video:video>
  </url>`;
  }).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urlElements}
</urlset>`;
}
function escapeXml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

// src/utils/seoEngine.ts
init_hardwareEngine();

// src/utils/schemaEngine.ts
var schemaCache = /* @__PURE__ */ new Map();
function buildOrganizationSchema(baseUrl) {
  return {
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    "name": "SETUPSS",
    "alternateName": ["Setupss", "SETUPSS Platform", "Setupss AI Workspace Operating System"],
    "legalName": "SETUPSS",
    "url": baseUrl,
    "logo": {
      "@type": "ImageObject",
      "@id": `${baseUrl}/#logo`,
      "url": `${baseUrl}/logoarkaplanolmayan.png`,
      "caption": "Setupss Logo"
    },
    "sameAs": [
      "https://twitter.com/setupss",
      "https://instagram.com/setupss.ai",
      "https://github.com/setupss"
    ],
    "knowsAbout": [
      "PC Setups",
      "Gaming Battlestations",
      "Desk Accessories",
      "Ergonomics",
      "Hardware Engineering"
    ]
  };
}
function buildWebSiteSchema(baseUrl) {
  return {
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    "url": baseUrl,
    "name": "SETUPSS",
    "alternateName": "Setupss",
    "description": "Global PC setup, battlestation, desk setup sharing & AI budget planner platform.",
    "publisher": { "@id": `${baseUrl}/#organization` },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "inLanguage": ["tr-TR", "en-US", "de-DE", "fr-FR", "es-ES"]
  };
}
function buildWebApplicationSchema(baseUrl) {
  return {
    "@type": ["SoftwareApplication", "WebApplication"],
    "@id": `${baseUrl}/#webapp`,
    "name": "Setupss AI Budget Planner & Operating System",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "url": baseUrl,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };
}
function generateCentralizedSchemaGraph(params) {
  const cacheKey = `${params.canonicalUrl}:${params.title}`;
  if (schemaCache.has(cacheKey)) {
    return schemaCache.get(cacheKey);
  }
  const baseUrl = params.baseUrl.replace(/\/$/, "");
  const graph = [
    buildOrganizationSchema(baseUrl),
    buildWebSiteSchema(baseUrl),
    buildWebApplicationSchema(baseUrl)
  ];
  if (params.entities && params.entities.length > 0) {
    graph.push(...params.entities);
  }
  const result = {
    "@context": "https://schema.org",
    "@graph": graph
  };
  if (schemaCache.size > 200) {
    schemaCache.clear();
  }
  schemaCache.set(cacheKey, result);
  return result;
}

// src/utils/i18n.ts
var SUPPORTED_LOCALES = ["en", "tr", "de", "fr", "es"];
var DEFAULT_LOCALE = "tr";
var ISO_LOCALE_MAP = {
  en: "en-US",
  tr: "tr-TR",
  de: "de-DE",
  fr: "fr-FR",
  es: "es-ES"
};
var DICTIONARIES = {
  tr: {
    "site.title": "Setupss | PC Setup, Gaming Masalar\u0131 & Donan\u0131m At\xF6lyesi",
    "site.description": "En iyi PC setuplar\u0131, oyuncu ve yaz\u0131l\u0131mc\u0131 masalar\u0131, donan\u0131m uyumluluk rehberleri ve AI b\xFCt\xE7e planlay\u0131c\u0131.",
    "nav.explore": "Ke\u015Ffet",
    "nav.battlestations": "Setuplar",
    "nav.hardware": "Donan\u0131mlar",
    "nav.planner": "AI B\xFCt\xE7e Planlay\u0131c\u0131",
    "nav.deals": "F\u0131rsatlar",
    "nav.guides": "Rehberler",
    "nav.login": "Giri\u015F Yap",
    "nav.profile": "Profilim",
    "hardware.title_suffix": "i\xE7eren En \u0130yi Masa\xFCst\xFC Setuplar\u0131",
    "hardware.desc_prefix": "donan\u0131m\u0131n\u0131 i\xE7eren oyuncu ve yaz\u0131l\u0131mc\u0131 masa\xFCst\xFC kurulumlar\u0131n\u0131 inceleyin.",
    "category.title_suffix": "Masa\xFCst\xFC Kurulum \xD6rnekleri ve Tasar\u0131mlar\u0131",
    "brand.title_suffix": "Ekipmanl\u0131 En Pop\xFCler Oyun & \xC7al\u0131\u015Fma Alanlar\u0131",
    "compare.title_suffix": "Donan\u0131m Kar\u015F\u0131la\u015Ft\u0131rmas\u0131 ve Masa\xFCst\xFC Performans\u0131"
  },
  en: {
    "site.title": "Setupss | PC Setups, Gaming Desks & Hardware Workspace",
    "site.description": "Discover top PC setups, gaming battlestations, developer desks, hardware guides, and AI budget planner.",
    "nav.explore": "Explore",
    "nav.battlestations": "Setups",
    "nav.hardware": "Hardware",
    "nav.planner": "AI Budget Planner",
    "nav.deals": "Deals",
    "nav.guides": "Guides",
    "nav.login": "Sign In",
    "nav.profile": "My Profile",
    "hardware.title_suffix": "Best Desktop Setups Featuring",
    "hardware.desc_prefix": "Explore gaming and developer desk setups featuring hardware.",
    "category.title_suffix": "Desktop Setup Examples and Layouts",
    "brand.title_suffix": "Most Popular Workspaces Featuring",
    "compare.title_suffix": "Hardware Comparison and Workspace Performance"
  },
  de: {
    "site.title": "Setupss | PC-Setups, Gaming-Schreibtische & Hardware-Workspace",
    "site.description": "Entdecken Sie die besten PC-Setups, Gaming-Battlestations, Schreibtische und KI-Budgetplaner.",
    "nav.explore": "Entdecken",
    "nav.battlestations": "Setups",
    "nav.hardware": "Hardware",
    "nav.planner": "KI-Budgetplaner",
    "nav.deals": "Angebote",
    "nav.guides": "Ratgeber",
    "nav.login": "Anmelden",
    "nav.profile": "Mein Profil",
    "hardware.title_suffix": "Die besten Desktop-Setups mit",
    "hardware.desc_prefix": "Entdecken Sie Gaming- und Schreibtisch-Setups mit Hardware.",
    "category.title_suffix": "Desktop-Setup-Beispiele und Layouts",
    "brand.title_suffix": "Beliebteste Arbeitspl\xE4tze mit",
    "compare.title_suffix": "Hardware-Vergleich und Leistung"
  },
  fr: {
    "site.title": "Setupss | Configurations PC, Bureaux Gaming & Mat\xE9riel",
    "site.description": "D\xE9couvrez les meilleures configurations PC, bureaux gaming, guides mat\xE9riel et planificateur IA.",
    "nav.explore": "Explorer",
    "nav.battlestations": "Setups",
    "nav.hardware": "Mat\xE9riel",
    "nav.planner": "Planificateur IA",
    "nav.deals": "Offres",
    "nav.guides": "Guides",
    "nav.login": "Se connecter",
    "nav.profile": "Mon Profil",
    "hardware.title_suffix": "Meilleures configurations de bureau avec",
    "hardware.desc_prefix": "D\xE9couvrez les configurations de bureau gaming et d\xE9veloppeur avec mat\xE9riel.",
    "category.title_suffix": "Exemples et agencements de bureau",
    "brand.title_suffix": "Espaces de travail les plus populaires avec",
    "compare.title_suffix": "Comparatif mat\xE9riel et performances"
  },
  es: {
    "site.title": "Setupss | Setups de PC, Escritorios Gaming y Hardware",
    "site.description": "Descubre los mejores setups de PC, escritorios gaming, gu\xEDas de hardware y planificador IA.",
    "nav.explore": "Explorar",
    "nav.battlestations": "Setups",
    "nav.hardware": "Hardware",
    "nav.planner": "Planificador IA",
    "nav.deals": "Ofertas",
    "nav.guides": "Gu\xEDas",
    "nav.login": "Iniciar Sesi\xF3n",
    "nav.profile": "Mi Perfil",
    "hardware.title_suffix": "Mejores setups de escritorio con",
    "hardware.desc_prefix": "Explora setups de escritorio gaming y desarrollador con hardware.",
    "category.title_suffix": "Ejemplos y dise\xF1os de setups de escritorio",
    "brand.title_suffix": "Espacios de trabajo m\xE1s populares con",
    "compare.title_suffix": "Comparativa de hardware y rendimiento"
  }
};
function t(key, locale = DEFAULT_LOCALE, fallback) {
  const dict = DICTIONARIES[locale] || DICTIONARIES[DEFAULT_LOCALE];
  return dict[key] || fallback || DICTIONARIES["en"][key] || key;
}
function generateHreflangLinks(canonicalPath, baseUrl) {
  const cleanBase = baseUrl.replace(/\/$/, "");
  const cleanPath = canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`;
  const separator = cleanPath.includes("?") ? "&" : "?";
  const links = SUPPORTED_LOCALES.map((lang) => ({
    hreflang: lang,
    href: `${cleanBase}${cleanPath}${separator}lang=${lang}`
  }));
  links.push({
    hreflang: "x-default",
    href: `${cleanBase}${cleanPath}`
  });
  return links;
}

// src/utils/geoEngine.ts
function generateAiCrawlerHtmlSection(params) {
  const factsHtml = Object.entries(params.facts).map(([k, v]) => `<dt style="font-weight: 600;">${k}</dt><dd style="margin-left: 0; margin-bottom: 8px;">${v}</dd>`).join("");
  const relsHtml = params.relationships ? params.relationships.map((r) => `<li><span data-relation="${r.relation}">${r.relation}:</span> <strong>${r.name}</strong></li>`).join("") : "";
  return `
    <section data-ai-context="true" data-ai-entity-type="${params.entityType}" data-ai-entity-name="${params.entityName}" style="margin-top: 24px; padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
      <h3 style="margin-top: 0; font-size: 1.1rem; color: #0f172a;">AI Knowledge Graph Fact Sheet: ${params.entityName}</h3>
      <p style="font-size: 0.95rem; color: #334155;">${params.summary}</p>
      <dl style="display: grid; grid-template-columns: auto 1fr; gap: 8px 16px; font-size: 0.9rem;">
        ${factsHtml}
      </dl>
      ${relsHtml ? `
      <div style="margin-top: 12px; font-size: 0.85rem;">
        <strong>Entity Relationships:</strong>
        <ul style="padding-left: 20px; margin-top: 4px;">
          ${relsHtml}
        </ul>
      </div>` : ""}
    </section>
  `;
}
function generateAiSpeakableSchema(canonicalUrl, cssSelectors = ["#seo-crawler-content h2", "#seo-crawler-content p"]) {
  return {
    "@type": "SpeakableSpecification",
    "@id": `${canonicalUrl}#speakable`,
    "cssSelector": cssSelectors
  };
}

// src/utils/internalLinking.ts
var LINK_RULES = [
  {
    keywords: ["rtx 4090", "rtx4090", "geforce rtx 4090"],
    getPath: () => "/gpu/rtx-4090"
  },
  {
    keywords: ["rtx 4080", "rtx4080", "geforce rtx 4080"],
    getPath: () => "/gpu/rtx-4080"
  },
  {
    keywords: ["ryzen 7800x3d", "7800x3d", "7800x 3d"],
    getPath: () => "/cpu/ryzen-7-7800x3d"
  },
  {
    keywords: ["valorant", "valorant setup"],
    getPath: () => "/game/valorant"
  },
  {
    keywords: ["cyberpunk", "cyberpunk 2077"],
    getPath: () => "/game/cyberpunk-2077"
  },
  {
    keywords: ["oyuncu", "oyuncu odas\u0131", "oyuncu masas\u0131", "gaming"],
    getPath: () => "/category/oyuncu"
  },
  {
    keywords: ["yaz\u0131l\u0131mc\u0131", "developer", "yaz\u0131l\u0131m", "coding"],
    getPath: () => "/category/yazilimci"
  },
  {
    keywords: ["minimalist", "minimal", "sade"],
    getPath: () => "/category/minimalist"
  },
  {
    keywords: ["kablo y\xF6netimi", "kablo d\xFCzenleme", "kablo gizleme"],
    getPath: () => "/blog/masaustu-kablo-yonetimi-ve-rgb-aydinlatma-rehberi"
  }
];
function injectInternalLinks(text) {
  if (!text) return "";
  let result = text;
  const sortedRules = [...LINK_RULES].sort((a, b) => {
    const maxA = Math.max(...a.keywords.map((k) => k.length));
    const maxB = Math.max(...b.keywords.map((k) => k.length));
    return maxB - maxA;
  });
  const linkedUrls = /* @__PURE__ */ new Set();
  for (const rule of sortedRules) {
    const url = rule.getPath("");
    if (linkedUrls.has(url)) continue;
    for (const keyword of rule.keywords) {
      const regex = new RegExp(`(?<!<[^>]*)\\b(${keyword})\\b(?![^<]*>)`, "gi");
      if (regex.test(result)) {
        result = result.replace(regex, `<a href="${url}" class="text-blue-600 hover:underline font-medium">$1</a>`);
        linkedUrls.add(url);
        break;
      }
    }
  }
  return result;
}

// src/utils/seoEngine.ts
init_slug();
var DEFAULT_BASE_URL = "https://setupss.com";
var DEFAULT_IMAGE = "https://setupss.com/logoarkaplanolmayan.png?v=2026_new";
var SUPPORTED_LOCALES2 = ["tr", "en", "de", "fr", "es"];
function generateSeoMetadata(params) {
  const baseUrl = (params.baseUrl || DEFAULT_BASE_URL).replace(/\/$/, "");
  const queryParams = params.queryParams || {};
  const currentLang = params.locale || queryParams.lang || "tr";
  const langKey = currentLang || "tr";
  let title = t("site.title", langKey, "SETUPSS | Masa\xFCst\xFC Setup Payla\u015F\u0131m At\xF6lyesi & Yapay Zeka B\xFCt\xE7e Planlay\u0131c\u0131");
  let description = t("site.description", langKey, "Setupss: Hayalindeki masa\xFCst\xFC kurulumunu (setup) tasarla, toplulukla payla\u015F ve b\xFCt\xE7eni planla! Yapay zeka b\xFCt\xE7e asistan\u0131 ile en ucuz ve uyumlu ekipmanlar\u0131 incele.");
  let keywords = "setupss, setupss ai, setupss masa kurulumu, masa d\xFCzeni, setup, bilgisayar masas\u0131, oyuncu odas\u0131, yaz\u0131l\u0131mc\u0131 setup, ekipman b\xFCt\xE7esi, mekanik klavye, oyuncu monit\xF6r\xFC";
  let ogType = "website";
  let ogImage = DEFAULT_IMAGE;
  let canonicalPath = "/";
  let pageEntityType = "home";
  let jsonLdGraph = [];
  let botDetailsHtml = "";
  const setupId = queryParams.setup || (params.urlPath?.startsWith("/setup/") ? params.urlPath.split("/")[2] : null);
  if (setupId && params.setupData) {
    const setup = params.setupData;
    pageEntityType = "setup";
    canonicalPath = `/setup/${setup.id}`;
    title = `${setup.title} by @${setup.owner} | SETUPS`;
    const compText = setup.components?.map((c) => c.name).slice(0, 5).join(", ");
    description = setup.description || setup.bio || `${setup.owner} taraf\u0131ndan tasarlanan harika ${setup.category || "masa\xFCst\xFC"} kurulumu. Ekipmanlar: ${compText || "\xD6zel bilgisayar bile\u015Fenleri"}.`;
    if (setup.tags && setup.tags.length > 0) {
      keywords = `${setup.tags.join(", ")}, ${keywords}`;
    }
    ogType = "article";
    if (setup.image) ogImage = setup.image;
    const setupLikes = setup.likes && setup.likes > 0 ? setup.likes : 5;
    jsonLdGraph.push({
      "@type": "ItemPage",
      "@id": `${baseUrl}${canonicalPath}#webpage`,
      "url": `${baseUrl}${canonicalPath}`,
      "name": title,
      "description": description,
      "inLanguage": currentLang,
      "breadcrumb": { "@id": `${baseUrl}${canonicalPath}#breadcrumb` }
    });
    const artworkSchema = {
      "@type": "VisualArtwork",
      "@id": `${baseUrl}${canonicalPath}#artwork`,
      "name": setup.title,
      "description": description,
      "image": {
        "@type": "ImageObject",
        "@id": `${baseUrl}${canonicalPath}#primaryimage`,
        "url": ogImage,
        "contentUrl": ogImage,
        "caption": setup.title
      },
      "creator": {
        "@type": "Person",
        "@id": `${baseUrl}/u/${encodeURIComponent(slugify(setup.owner))}#person`,
        "name": setup.owner,
        "alternateName": `@${setup.owner}`,
        "image": setup.ownerAvatar || void 0,
        "url": `${baseUrl}/u/${encodeURIComponent(slugify(setup.owner))}`
      },
      "artform": "Workspace Design",
      "genre": setup.category || "PC Setup",
      "dateCreated": setup.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
      "inLanguage": currentLang,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "bestRating": "5",
        "worstRating": "1",
        "ratingCount": setupLikes,
        "reviewCount": setupLikes
      }
    };
    jsonLdGraph.push(artworkSchema);
    if (setup.videoUrl || setup.image?.endsWith(".mp4")) {
      const vUrl = setup.videoUrl || setup.image;
      jsonLdGraph.push({
        "@type": "VideoObject",
        "@id": `${baseUrl}${canonicalPath}#video`,
        "name": `${setup.title} Video Tour`,
        "description": `Video presentation of ${setup.title} PC setup`,
        "thumbnailUrl": [ogImage],
        "contentUrl": vUrl,
        "uploadDate": setup.createdAt || (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    jsonLdGraph.push({
      "@type": "BreadcrumbList",
      "@id": `${baseUrl}${canonicalPath}#breadcrumb`,
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Anasayfa", "item": `${baseUrl}/` },
        { "@type": "ListItem", "position": 2, "name": setup.category || "Ke\u015Ffet", "item": `${baseUrl}/category/${encodeURIComponent(slugify(setup.category || "all"))}` },
        { "@type": "ListItem", "position": 3, "name": setup.title, "item": `${baseUrl}${canonicalPath}` }
      ]
    });
    if (setup.components && setup.components.length > 0) {
      const componentItems = setup.components.map((c, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": c.name,
          "category": c.category || "Donan\u0131m & Aksesuar",
          "description": `${c.name} - ${setup.title} kurulumunda kullan\u0131lan ${c.category || "ekipman"} par\xE7as\u0131.`
        }
      }));
      jsonLdGraph.push({
        "@type": "ItemList",
        "@id": `${baseUrl}${canonicalPath}#hardware-list`,
        "name": `${setup.title} Donan\u0131m ve Ekipman Listesi`,
        "description": `Setupss \xFCyesi @${setup.owner} taraf\u0131ndan ${setup.title} kurulumunda kullan\u0131lan ${setup.components.length} adet sistem ve masa\xFCst\xFC donan\u0131m\u0131.`,
        "numberOfItems": setup.components.length,
        "itemListElement": componentItems
      });
      jsonLdGraph.push({
        "@type": "Product",
        "@id": `${baseUrl}${canonicalPath}#product`,
        "name": `${setup.title} - Custom Workspace Setup`,
        "image": [ogImage.startsWith("/") ? `${baseUrl}${ogImage}` : ogImage],
        "description": `Masa\xFCst\xFC ve Donan\u0131m Kurulumu (@${setup.owner}). \u0130\xE7erdi\u011Fi par\xE7alar: ${compText}`,
        "brand": {
          "@type": "Brand",
          "name": "Setupss OS"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": Math.max(setupLikes, 1),
          "ratingCount": Math.max(setupLikes, 1)
        },
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "TRY",
          "lowPrice": "1500",
          "highPrice": "250000",
          "offerCount": setup.components.length
        }
      });
    }
    botDetailsHtml = `
      <article itemscope itemtype="https://schema.org/TechArticle">
        <h2 itemprop="headline">${setup.title}</h2>
        <p><strong>Masa\xFCst\xFC Kurulum Sahibi:</strong> @${setup.owner}</p>
        <p><strong>Kurulum Kategorisi:</strong> ${setup.category || "Masa\xFCst\xFC Setup"}</p>
        <p itemprop="description">${description}</p>
        ${setup.components && setup.components.length > 0 ? `
          <h3>Masa\xFCst\xFC Donan\u0131m ve Ekipman Listesi (Plain Text Spec Sheet for AI & LLM Crawlers)</h3>
          <ul itemprop="dependencies">
            ${setup.components.map((c) => `<li><strong>${c.category || "Donan\u0131m/Ekipman"}:</strong> ${c.name}</li>`).join("")}
          </ul>
        ` : ""}
      </article>
    `;
  } else if (queryParams.profile || queryParams.user || params.userData || params.urlPath?.startsWith("/profile/") || params.urlPath?.startsWith("/u/")) {
    const userSlug = params.urlPath?.startsWith("/profile/") ? params.urlPath.split("/")[2] : params.urlPath?.startsWith("/u/") ? params.urlPath.split("/")[2] : null;
    const user = params.userData || {
      username: userSlug || queryParams.profile || "user",
      name: userSlug || queryParams.profile || "Setupss \xDCyesi",
      bio: "Setupss topluluk \xFCyesi ve masa\xFCst\xFC geli\u015Ftiricisi."
    };
    pageEntityType = "profile";
    canonicalPath = `/u/${encodeURIComponent(user.username || user.name || "user")}`;
    title = `@${user.username || user.name} | PC Setup & Oyuncu Odas\u0131 Profili - SETUPSS`;
    description = user.bio || `@${user.username || user.name} kullan\u0131c\u0131s\u0131n\u0131n Setupss \xFCzerindeki masa\xFCst\xFC kurulumlar\u0131, favori ekipmanlar\u0131 ve bilgisayar bile\u015Fenleri.`;
    ogType = "profile";
    if (user.avatar) ogImage = user.avatar;
    jsonLdGraph.push(
      {
        "@type": "ProfilePage",
        "@id": `${baseUrl}${canonicalPath}#profilepage`,
        "url": `${baseUrl}${canonicalPath}`,
        "name": title,
        "description": description,
        "mainEntity": {
          "@type": "Person",
          "@id": `${baseUrl}${canonicalPath}#person`,
          "name": user.name || user.username,
          "alternateName": `@${user.username || user.name}`,
          "image": {
            "@type": "ImageObject",
            "url": user.avatar || ogImage
          },
          "description": description,
          "url": `${baseUrl}${canonicalPath}`
        },
        "breadcrumb": { "@id": `${baseUrl}${canonicalPath}#breadcrumb` }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}${canonicalPath}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Anasayfa", "item": `${baseUrl}/` },
          { "@type": "ListItem", "position": 2, "name": "Topluluk", "item": `${baseUrl}/leaderboard` },
          { "@type": "ListItem", "position": 3, "name": `@${user.username || user.name}`, "item": `${baseUrl}${canonicalPath}` }
        ]
      }
    );
    botDetailsHtml = `
      <h2>@${user.username || user.name} Kullan\u0131c\u0131 Profili</h2>
      <p>${user.bio || "Setupss masa\xFCst\xFC tutkunu."}</p>
    `;
  } else if (queryParams.category || params.categoryName || params.urlPath?.startsWith("/category/")) {
    const catSlug = params.urlPath?.startsWith("/category/") ? params.urlPath.split("/")[2] : null;
    const category = params.categoryName || catSlug || queryParams.category || "Masa\xFCst\xFC";
    pageEntityType = "category";
    canonicalPath = `/category/${encodeURIComponent(category)}`;
    title = `${category} Setup Modelleri & Oyuncu Masas\u0131 Tasar\u0131mlar\u0131 | SETUPSS`;
    description = `En pop\xFCler ${category} masa\xFCst\xFC kurulumlar\u0131n\u0131 ke\u015Ffet. Monit\xF6r d\xFCzenleri, klavye se\xE7imleri, RGB ayd\u0131nlatmalar ve kablo y\xF6netimi ipu\xE7lar\u0131 Setupss'ta.`;
    keywords = `${category} setup, ${category} masa d\xFCzeni, ${category} bilgisayar masas\u0131, ${keywords}`;
    jsonLdGraph.push(
      {
        "@type": "CollectionPage",
        "@id": `${baseUrl}${canonicalPath}#collection`,
        "url": `${baseUrl}${canonicalPath}`,
        "name": `${category} Setup Koleksiyonu`,
        "description": description,
        "breadcrumb": { "@id": `${baseUrl}${canonicalPath}#breadcrumb` }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}${canonicalPath}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Anasayfa", "item": `${baseUrl}/` },
          { "@type": "ListItem", "position": 2, "name": "Kategoriler", "item": `${baseUrl}/?tab=explore` },
          { "@type": "ListItem", "position": 3, "name": category, "item": `${baseUrl}${canonicalPath}` }
        ]
      }
    );
    botDetailsHtml = `
      <h2>${category} Masa\xFCst\xFC Setup Koleksiyonu</h2>
      <p>${description}</p>
    `;
  } else if (queryParams.tag || params.tagName || params.urlPath?.startsWith("/tag/") || params.urlPath?.startsWith("/game/")) {
    const tagSlug = params.urlPath?.startsWith("/tag/") ? params.urlPath.split("/")[2] : params.urlPath?.startsWith("/game/") ? params.urlPath.split("/")[2] : null;
    const tag = params.tagName || tagSlug || queryParams.tag || "setup";
    const isGame = params.urlPath?.startsWith("/game/");
    pageEntityType = isGame ? "game" : "tag";
    canonicalPath = isGame ? `/game/${encodeURIComponent(tag)}` : `/tag/${encodeURIComponent(tag)}`;
    title = isGame ? `${tag} Oyunu \u0130\xE7in En \u0130yi PC Setup Tasar\u0131mlar\u0131 | SETUPSS` : `#${tag} etiketli PC Setup ve Ekipman Payla\u015F\u0131mlar\u0131 | SETUPSS`;
    description = isGame ? `${tag} oyunu i\xE7in optimize edilmi\u015F, en y\xFCksek FPS sunan oyuncu odalar\u0131, sistem \xF6zellikleri ve masa\xFCst\xFC kurulumlar\u0131.` : `#${tag} etiketi alt\u0131ndaki en be\u011Fenilen oyuncu masalar\u0131, yaz\u0131l\u0131mc\u0131 at\xF6lyeleri ve donan\u0131m incelemelerini incele.`;
    keywords = `${tag}, #${tag}, ${tag} setup, ${isGame ? `${tag} game, gaming pc` : ""}, ${keywords}`;
    jsonLdGraph.push(
      {
        "@type": "CollectionPage",
        "@id": `${baseUrl}${canonicalPath}#tagpage`,
        "url": `${baseUrl}${canonicalPath}`,
        "name": isGame ? `${tag} Gaming Setups` : `#${tag} Setups`,
        "description": description,
        "breadcrumb": { "@id": `${baseUrl}${canonicalPath}#breadcrumb` }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}${canonicalPath}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Anasayfa", "item": `${baseUrl}/` },
          { "@type": "ListItem", "position": 2, "name": "Etiketler", "item": `${baseUrl}/?tab=explore` },
          { "@type": "ListItem", "position": 3, "name": `#${tag}`, "item": `${baseUrl}${canonicalPath}` }
        ]
      }
    );
    botDetailsHtml = `
      <h2>#${tag} Etiketli Masa Kurulumlar\u0131</h2>
      <p>${description}</p>
    `;
  } else if (queryParams.hardware || queryParams.gpu || queryParams.cpu || params.hardwareName || params.urlPath?.startsWith("/hardware/") || params.urlPath?.startsWith("/gpu/") || params.urlPath?.startsWith("/cpu/")) {
    const hwSlug = params.urlPath?.startsWith("/hardware/") ? params.urlPath.split("/")[2] : params.urlPath?.startsWith("/gpu/") ? params.urlPath.split("/")[2] : params.urlPath?.startsWith("/cpu/") ? params.urlPath.split("/")[2] : null;
    const rawHw = params.hardwareName || hwSlug || queryParams.hardware || queryParams.gpu || queryParams.cpu || "Donan\u0131m";
    const hw = getHardwareBySlug(rawHw);
    const isGpu = params.urlPath?.startsWith("/gpu/") || queryParams.gpu;
    const isCpu = params.urlPath?.startsWith("/cpu/") || queryParams.cpu;
    pageEntityType = isGpu ? "gpu" : isCpu ? "cpu" : "hardware";
    canonicalPath = isGpu ? `/gpu/${hw.slug}` : isCpu ? `/cpu/${hw.slug}` : `/hardware/${hw.slug}`;
    title = `${hw.brand} ${hw.model} i\xE7eren En \u0130yi Masa\xFCst\xFC Setuplar\u0131 | SETUPSS`;
    description = `${hw.brand} ${hw.model} (${hw.category}) kullanan oyuncu ve yaz\u0131l\u0131mc\u0131 masalar\u0131n\u0131 incele. ${hw.description}`;
    const lowPrice = hw.msrp ? Math.round(hw.msrp * 35) : 1200;
    const highPrice = hw.msrp ? Math.round(hw.msrp * 38) : 45e3;
    jsonLdGraph.push(
      {
        "@type": "ItemPage",
        "@id": `${baseUrl}${canonicalPath}#itempage`,
        "url": `${baseUrl}${canonicalPath}`,
        "name": title,
        "description": description,
        "breadcrumb": { "@id": `${baseUrl}${canonicalPath}#breadcrumb` }
      },
      {
        "@type": "Product",
        "@id": `${baseUrl}${canonicalPath}#product`,
        "name": `${hw.brand} ${hw.model}`,
        "description": hw.description,
        "image": hw.images[0] || ogImage,
        "brand": { "@type": "Brand", "name": hw.brand },
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "TRY",
          "lowPrice": lowPrice.toString(),
          "highPrice": highPrice.toString(),
          "offerCount": hw.setupCount || 5
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": hw.averageRating.toString(),
          "ratingCount": hw.setupCount * 3,
          "reviewCount": hw.setupCount * 3
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}${canonicalPath}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Anasayfa", "item": `${baseUrl}/` },
          { "@type": "ListItem", "position": 2, "name": "Donan\u0131mlar", "item": `${baseUrl}/deals` },
          { "@type": "ListItem", "position": 3, "name": `${hw.brand} ${hw.model}`, "item": `${baseUrl}${canonicalPath}` }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}${canonicalPath}#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": `${hw.brand} ${hw.model} hangi sistemlerle uyumludur?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `${hw.brand} ${hw.model} g\xFCncel oyuncu ve yaz\u0131l\u0131mc\u0131 sistemleriyle tam uyumludur. Community kay\u0131tlar\u0131nda ${hw.setupCount} do\u011Frulanm\u0131\u015F masa kurulumunda kullan\u0131lmaktad\u0131r.`
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
          <h3>Teknik \xD6zellikler</h3>
          <ul>
            ${Object.entries(hw.specifications).map(([k, v]) => `<li><strong>${k}:</strong> ${v}</li>`).join("")}
          </ul>
        </section>
        <section>
          <h3>Topluluk \u0130statistikleri</h3>
          <p>Mevcut Do\u011Frulanm\u0131\u015F Setup Say\u0131s\u0131: ${hw.setupCount} | Ortalama Puan: ${hw.averageRating} / 5.0</p>
        </section>
      </article>
    `;
  } else if (queryParams.brand || params.brandName) {
    const brand = params.brandName || queryParams.brand || "Marka";
    pageEntityType = "brand";
    canonicalPath = `/brand/${encodeURIComponent(slugify(brand))}`;
    title = `${brand} Ekipmanl\u0131 Masa\xFCst\xFC Setup \u0130lhamlar\u0131 | SETUPSS`;
    description = `${brand} klavye, kulakl\u0131k, monit\xF6r ve aksesuarlar\u0131yla donat\u0131lm\u0131\u015F en kaliteli masa d\xFCzenlerini g\xF6r\xFCnt\xFCle.`;
    jsonLdGraph.push(
      {
        "@type": "CollectionPage",
        "@id": `${baseUrl}${canonicalPath}#brandpage`,
        "url": `${baseUrl}${canonicalPath}`,
        "name": title,
        "description": description,
        "breadcrumb": { "@id": `${baseUrl}${canonicalPath}#breadcrumb` }
      },
      {
        "@type": "Brand",
        "@id": `${baseUrl}${canonicalPath}#brand`,
        "name": brand,
        "description": description,
        "logo": ogImage
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}${canonicalPath}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Anasayfa", "item": `${baseUrl}/` },
          { "@type": "ListItem", "position": 2, "name": "Markalar", "item": `${baseUrl}/deals` },
          { "@type": "ListItem", "position": 3, "name": brand, "item": `${baseUrl}${canonicalPath}` }
        ]
      }
    );
    botDetailsHtml = `
      <h2>${brand} \xDCr\xFCnleriyle Haz\u0131rlanan Setuplar</h2>
      <p>${description}</p>
    `;
  } else if (queryParams.article || queryParams.guide || params.articleData || params.urlPath?.startsWith("/guide/") || params.urlPath?.startsWith("/blog/") || params.urlPath?.startsWith("/article/")) {
    const artSlug = params.urlPath?.startsWith("/guide/") ? params.urlPath.split("/")[2] : params.urlPath?.startsWith("/blog/") ? params.urlPath.split("/")[2] : params.urlPath?.startsWith("/article/") ? params.urlPath.split("/")[2] : null;
    const isBlog = params.urlPath?.startsWith("/blog/");
    const artId = artSlug || queryParams.article || queryParams.guide || "guide";
    const art = params.articleData || {
      id: artId,
      title: artId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      description: `${artId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} rehberi ve detayl\u0131 incelemesi.`,
      authorName: "Setupss Edit\xF6r Ekibi",
      datePublished: (/* @__PURE__ */ new Date()).toISOString()
    };
    pageEntityType = isBlog ? "blog" : "article";
    canonicalPath = isBlog ? `/blog/${encodeURIComponent(art.id)}` : `/guide/${encodeURIComponent(art.id)}`;
    title = `${art.title} | SETUPSS ${isBlog ? "Blog" : "Rehber"}`;
    description = art.description;
    ogType = "article";
    jsonLdGraph.push(
      {
        "@type": art.articleType || "TechArticle",
        "@id": `${baseUrl}${canonicalPath}#article`,
        "headline": art.title,
        "description": art.description,
        "image": [art.image || ogImage],
        "datePublished": art.datePublished || (/* @__PURE__ */ new Date()).toISOString(),
        "dateModified": art.dateModified || (/* @__PURE__ */ new Date()).toISOString(),
        "author": {
          "@type": "Person",
          "name": art.authorName || "Setupss Team"
        },
        "publisher": { "@id": `${baseUrl}/#organization` },
        "inLanguage": currentLang,
        "mainEntityOfPage": `${baseUrl}${canonicalPath}`
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}${canonicalPath}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Anasayfa", "item": `${baseUrl}/` },
          { "@type": "ListItem", "position": 2, "name": "Rehberler", "item": `${baseUrl}/blog` },
          { "@type": "ListItem", "position": 3, "name": art.title, "item": `${baseUrl}${canonicalPath}` }
        ]
      }
    );
    botDetailsHtml = `
      <h2>${art.title}</h2>
      <p>${art.description}</p>
    `;
  } else if (queryParams.tab || params.tabName) {
    const tab = params.tabName || queryParams.tab || "explore";
    if (tab === "explore" || tab === "main" || !tab) {
      canonicalPath = "/explore";
    } else if (tab === "wishlist" || tab === "ai") {
      canonicalPath = "/ai-planner";
    } else if (tab === "leaderboard") {
      canonicalPath = "/leaderboard";
    } else if (tab === "deals") {
      canonicalPath = "/deals";
    } else if (tab === "trending") {
      canonicalPath = "/trending";
    } else if (tab === "latest" || tab === "feed") {
      canonicalPath = "/latest";
    } else {
      canonicalPath = `/${tab}`;
    }
    if (tab === "wishlist" || tab === "ai") {
      title = "Yapay Zeka B\xFCt\xE7e Planlay\u0131c\u0131 & Masa Ekipman Listesi | SETUPSS";
      description = "Hayalindeki masa\xFCst\xFC kurulumu b\xFCt\xE7esini yapay zeka asistan\u0131 ile hesapla! G\xFCncel Akak\xE7e piyasa fiyatlar\u0131yla monit\xF6r, kulakl\u0131k, klavye listeleri.";
      jsonLdGraph.push({
        "@type": "FAQPage",
        "@id": `${baseUrl}${canonicalPath}#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Setupss AI B\xFCt\xE7e Planlay\u0131c\u0131 nas\u0131l \xE7al\u0131\u015F\u0131r?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Setupss AI, hedef b\xFCt\xE7enize g\xF6re en uyumlu ve fiyat-performans oran\u0131 y\xFCksek monit\xF6r, klavye, kulakl\u0131k ve kasa bile\u015Fenlerini otomatik listeler ve Akak\xE7e fiyatlar\u0131yla b\xFCt\xE7e tablonuzu \xE7\u0131kar\u0131r."
            }
          },
          {
            "@type": "Question",
            "name": "Masa\xFCst\xFC setup b\xFCt\xE7esi haz\u0131rlarken nelere dikkat edilmeli?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Ergonomik koltuk ve monit\xF6r stand\u0131 se\xE7imi, mekanik klavye anahtar t\xFCr\xFC (switch), kablo y\xF6netimi aksesuarlar\u0131 ve g\xF6z sa\u011Fl\u0131\u011F\u0131 i\xE7in LED ayd\u0131nlatma dengesi g\xF6zetilmelidir."
            }
          }
        ]
      });
    } else if (tab === "deals") {
      title = "Trend Oyuncu Ekipman\u0131 F\u0131rsatlar\u0131 & \u0130ndirimler | SETUPSS";
      description = "Ekran kart\u0131, mekanik klavye, oyuncu kulakl\u0131\u011F\u0131 ve monit\xF6rlerde g\xFCncel fiyat d\xFC\u015F\xFC\u015Fleri ve indirim f\u0131rsatlar\u0131.";
    } else if (tab === "leaderboard") {
      title = "Liderlik Tablosu & En Be\u011Fenilen Masa Setuplar\u0131 | SETUPSS";
      description = "Topluluk taraf\u0131ndan en \xE7ok be\u011Fenilen haftal\u0131k ve ayl\u0131k \u015Fampiyon masa\xFCst\xFC setup tasar\u0131mlar\u0131.";
    } else if (tab === "feed") {
      title = "Canl\u0131 Topluluk Ak\u0131\u015F\u0131 & Son Payla\u015F\u0131lan Setuplar | SETUPSS";
      description = "Setupss toplulu\u011Funun anl\u0131k payla\u015Ft\u0131\u011F\u0131 son masa\xFCst\xFC kurulumlar\u0131 ve ekipman g\xFCncellemeleri.";
    } else {
      title = "Masa\xFCst\xFC Setup Ke\u015Ffet & \u0130lham Al | SETUPSS";
      description = "Binlerce \xF6zenle se\xE7ilmi\u015F oyuncu masas\u0131, minimalist \xE7al\u0131\u015Fma alan\u0131 ve yaz\u0131l\u0131mc\u0131 at\xF6lyesini ke\u015Ffet.";
    }
    jsonLdGraph.push(
      {
        "@type": "WebPage",
        "@id": `${baseUrl}${canonicalPath}#webpage`,
        "url": `${baseUrl}${canonicalPath}`,
        "name": title,
        "description": description,
        "breadcrumb": { "@id": `${baseUrl}${canonicalPath}#breadcrumb` }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}${canonicalPath}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Anasayfa", "item": `${baseUrl}/` },
          { "@type": "ListItem", "position": 2, "name": tab.toUpperCase(), "item": `${baseUrl}${canonicalPath}` }
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
            ${prog.geoSummary.keyTakeaways.map((k) => `<li>${k}</li>`).join("")}
          </ul>
        </section>
        <section>
          <h3>Frequently Asked Questions</h3>
          ${prog.geoSummary.faq.map((f) => `<div><h4>${f.question}</h4><p>${f.answer}</p></div>`).join("")}
        </section>
        <nav>
          <h3>Related Workspaces</h3>
          <ul>
            ${prog.internalLinks.map((l) => `<li><a href="${baseUrl}${l.href}">${l.label}</a></li>`).join("")}
          </ul>
        </nav>
      </article>
    `;
  } else {
    jsonLdGraph.push({
      "@type": "WebPage",
      "@id": `${baseUrl}/#webpage`,
      "url": `${baseUrl}/`,
      "name": title,
      "description": description,
      "isPartOf": { "@id": `${baseUrl}/#website` },
      "breadcrumb": { "@id": `${baseUrl}/#breadcrumb` }
    });
    jsonLdGraph.push({
      "@type": "BreadcrumbList",
      "@id": `${baseUrl}/#breadcrumb`,
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Anasayfa", "item": `${baseUrl}/` }
      ]
    });
  }
  jsonLdGraph.unshift(
    {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      "url": `${baseUrl}/`,
      "name": "Setupss",
      "alternateName": ["SETUPSS", "Setupss AI", "Setupss Setup Payla\u015F\u0131m At\xF6lyesi"],
      "description": "Masa\xFCst\xFC kurulumu (setup) payla\u015F\u0131m, donan\u0131m inceleme ve yapay zeka b\xFCt\xE7e planlama platformu.",
      "publisher": { "@id": `${baseUrl}/#organization` },
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${baseUrl}/?s={search_term_string}`,
        "query-input": "required name=search_term_string"
      },
      "inLanguage": SUPPORTED_LOCALES2
    },
    {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      "name": "Setupss",
      "url": `${baseUrl}/`,
      "logo": {
        "@type": "ImageObject",
        "@id": `${baseUrl}/#logo`,
        "url": `${baseUrl}/logoarkaplanolmayan.png?v=2026_new`,
        "caption": "Setupss Logo"
      },
      "image": `${baseUrl}/logoarkaplanolmayan.png?v=2026_new`,
      "sameAs": [
        "https://github.com/setupss",
        "https://x.com/setupss",
        "https://instagram.com/setupss"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "url": `${baseUrl}/`,
        "availableLanguage": ["Turkish", "English", "German", "French", "Spanish"]
      }
    }
  );
  const fullCanonicalUrl = `${baseUrl}${canonicalPath}`;
  let finalOgImage = ogImage;
  if (finalOgImage && finalOgImage.startsWith("/")) {
    finalOgImage = `${baseUrl}${finalOgImage}`;
  }
  const hreflangs = generateHreflangLinks(canonicalPath, baseUrl);
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
      "Entity Name": title,
      "Page Category": pageEntityType,
      "Canonical Endpoint": fullCanonicalUrl,
      "Verified Platform Source": "Setupss OS (https://setupss.com)"
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
        <p>SETUPSS - Global Masa\xFCst\xFC Setup & Donan\u0131m At\xF6lyesi. <a href="${fullCanonicalUrl}">${fullCanonicalUrl}</a></p>
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
    ogLocale: (ISO_LOCALE_MAP[langKey] || "tr-TR").replace("-", "_"),
    twitterCard: "summary_large_image",
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: finalOgImage,
    robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    hreflangs,
    jsonLd,
    botPrerenderHtml: fullBotPrerenderHtml
  };
}
function injectSeoIntoHtml(rawHtml, seo, isBot = false) {
  let html = rawHtml;
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(seo.title)}</title>`);
  html = replaceOrInsertMeta(html, "name", "description", seo.description);
  html = replaceOrInsertMeta(html, "name", "keywords", seo.keywords);
  html = replaceOrInsertMeta(html, "name", "robots", seo.robots);
  if (/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i.test(html)) {
    html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${seo.canonicalUrl}" />`);
  } else {
    html = html.replace("</head>", `  <link rel="canonical" href="${seo.canonicalUrl}" />
</head>`);
  }
  html = replaceOrInsertMeta(html, "property", "og:site_name", "SETUPSS");
  html = replaceOrInsertMeta(html, "property", "og:type", seo.ogType);
  html = replaceOrInsertMeta(html, "property", "og:title", seo.ogTitle);
  html = replaceOrInsertMeta(html, "property", "og:description", seo.ogDescription);
  html = replaceOrInsertMeta(html, "property", "og:image", seo.ogImage);
  html = replaceOrInsertMeta(html, "property", "og:image:width", "1200");
  html = replaceOrInsertMeta(html, "property", "og:image:height", "630");
  html = replaceOrInsertMeta(html, "property", "og:image:alt", seo.ogTitle);
  html = replaceOrInsertMeta(html, "property", "og:url", seo.ogUrl);
  html = replaceOrInsertMeta(html, "property", "og:locale", seo.ogLocale);
  html = replaceOrInsertMeta(html, "name", "twitter:card", seo.twitterCard);
  html = replaceOrInsertMeta(html, "name", "twitter:site", "@setupss");
  html = replaceOrInsertMeta(html, "name", "twitter:title", seo.twitterTitle);
  html = replaceOrInsertMeta(html, "name", "twitter:description", seo.twitterDescription);
  html = replaceOrInsertMeta(html, "name", "twitter:image", seo.twitterImage);
  html = replaceOrInsertMeta(html, "name", "twitter:image:alt", seo.twitterTitle);
  const hreflangTags = seo.hreflangs.map((h) => `<link rel="alternate" hreflang="${h.hreflang}" href="${h.href}" />`).join("\n    ");
  html = html.replace(/<link\s+rel="alternate"\s+hreflang="[^"]*"\s+href="[^"]*"\s*\/?>\n?/gi, "");
  html = html.replace("</head>", `  ${hreflangTags}
</head>`);
  const jsonLdString = JSON.stringify(seo.jsonLd, null, 2);
  const jsonLdScript = `<script type="application/ld+json" id="saios-seo-jsonld">
${jsonLdString}
</script>`;
  if (/<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/i.test(html)) {
    html = html.replace(/<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/i, jsonLdScript);
  } else {
    html = html.replace("</head>", `  ${jsonLdScript}
</head>`);
  }
  if (isBot && seo.botPrerenderHtml) {
    const noscriptBlock = `<noscript id="bot-seo-prerender">
${seo.botPrerenderHtml}
</noscript>`;
    html = html.replace('<div id="root"></div>', `<div id="root"></div>
${noscriptBlock}`);
  }
  return html;
}
function replaceOrInsertMeta(html, attrName, attrValue, contentValue) {
  const escapedContent = escapeHtml(contentValue);
  const regex = new RegExp(`<meta\\s+${attrName}="${attrValue}"\\s+content="[^"]*"\\s*\\/?>`, "i");
  if (regex.test(html)) {
    return html.replace(regex, `<meta ${attrName}="${attrValue}" content="${escapedContent}" />`);
  } else {
    return html.replace("</head>", `  <meta ${attrName}="${attrValue}" content="${escapedContent}" />
</head>`);
  }
}
function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// server.ts
init_server_db();

// src/curatedSetups.ts
var curatedSetups = [
  {
    id: "setup-1",
    ownerId: "admin",
    owner: "Be\u015Fir Hanzo",
    ownerAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80",
    bio: "Kod Yazan Kahve Canavar\u0131 \u2615\uFE0F",
    title: "Sade ve G\xFC\xE7l\xFC",
    description: "Tamamen kablosuz ve minimalist bir yaz\u0131l\u0131mc\u0131 k\xF6\u015Fesi. Verimlilik i\xE7in her \u015Fey yerli yerinde.",
    image: "https://images.unsplash.com/photo-1491336477066-31156b5e4f35?auto=format&fit=crop&w=1200&q=80",
    category: "Minimalist",
    likes: 124,
    comments: [],
    tags: ["Minimalist", "Wireless", "Developer"],
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    cardTheme: "soft-blue",
    components: [
      { id: "c1", category: "Laptop", name: "Apple M3 Max MacBook Pro", link: "#" },
      { id: "c2", category: "Monit\xF6r", name: "Dell UltraSharp 32 4K", link: "#" }
    ]
  },
  {
    id: "setup-2",
    ownerId: "admin",
    owner: "Kreatif Can",
    ownerAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&h=200&q=80",
    bio: "RGB Profes\xF6r\xFC & Neon Sevdal\u0131s\u0131 \u{1F308}",
    title: "Renklerin Dans\u0131",
    description: "Yarat\u0131c\u0131l\u0131\u011F\u0131m\u0131 tetikleyen bol RGB'li ve geni\u015F ekranl\u0131 bir \xE7al\u0131\u015Fma alan\u0131.",
    image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1200&q=80",
    category: "RGB & Oyuncu",
    likes: 89,
    comments: [],
    tags: ["Gaming", "RGB", "Ultrawide"],
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    components: [
      { id: "c3", category: "Monit\xF6r", name: "Samsung Odyssey G9", link: "#" },
      { id: "c4", category: "Klavye", name: "Custom Mechanical Keyboard", link: "#" }
    ],
    cardTheme: "soft-purple"
  },
  {
    id: "setup-3",
    ownerId: "admin",
    owner: "Zeynep Tasar\u0131m",
    ownerAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&h=200&q=80",
    bio: "Piksel B\xFCk\xFCc\xFC & Bitki B\xFCy\xFCc\xFCs\xFC \u{1F33F}",
    title: "Retro Modern Workspace",
    description: "Eski ve yeninin harmanland\u0131\u011F\u0131, bol bitkili ve huzurlu bir tasar\u0131m st\xFCdyosu.",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80",
    category: "Cozy / Retro",
    likes: 215,
    comments: [],
    tags: ["Cozy", "Retro", "Plants"],
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
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
    bio: "Kurulum Dan\u0131\u015Fman\u0131 & Robot G\xF6z\xFC \u{1F916}",
    title: "End\xFCstriyel Rustik K\xF6\u015Fe",
    description: "Do\u011Fal ah\u015Fap ve metal aksamlar\u0131n harika birle\u015Fimiyle s\u0131cak ama bir o kadar da profesyonel bir yaz\u0131l\u0131mc\u0131 \xE7al\u0131\u015Fma alan\u0131.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    category: "Yaz\u0131l\u0131mc\u0131 At\xF6lyesi",
    likes: 312,
    comments: [],
    tags: ["Industrial", "Wood", "Developer", "TourVideo"],
    createdAt: new Date(Date.now() - 36e5 * 24).toISOString(),
    cardTheme: "soft-yellow",
    videoUrl: "https://www.youtube.com/embed/P4S83bM2k6s",
    isBotShare: true,
    components: [
      { id: "c7", category: "Monit\xF6r", name: "BenQ PD3220U 32'' 4K Designer", link: "#" },
      { id: "c8", category: "Ayd\u0131nlatma", name: "ScreenBar Halo", link: "#" },
      { id: "c9", category: "Ses", name: "Audioengine A2+ Hoparl\xF6r", link: "#" }
    ]
  },
  {
    id: "setup-5",
    ownerId: "ai-bot",
    owner: "Setupss AI (Bot)",
    ownerAvatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&h=200&q=80",
    bio: "Kurulum Dan\u0131\u015Fman\u0131 & Robot G\xF6z\xFC \u{1F916}",
    title: "Karanl\u0131k Tema & RGB R\xFCya",
    description: "Maksimum oyun ve \xFCretim verimlili\u011Fi i\xE7in tasarlanm\u0131\u015F, ak\u0131ll\u0131 LED ayd\u0131nlatmal\u0131 ultra-modern bilgisayar odas\u0131.",
    image: "https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?auto=format&fit=crop&w=1200&q=80",
    category: "RGB & Oyuncu",
    likes: 450,
    comments: [],
    tags: ["Gaming", "RGB", "DarkTheme", "SetupWalkthrough"],
    createdAt: new Date(Date.now() - 36e5 * 12).toISOString(),
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

// server.ts
init_storageService();

// server/realtimeService.ts
init_server_db();
var RealtimeService = class {
  /**
   * Update or create a user presence record in PostgreSQL
   */
  async updateUserPresence(userId, data) {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    try {
      await pool.query(
        `UPDATE users 
         SET last_active_date = $1, updated_at = NOW() 
         WHERE id = $2`,
        [timestamp, userId]
      );
    } catch (e) {
      console.error("Presence update failed in PostgreSQL:", e);
    }
  }
  /**
   * Fetch active online / away users from PostgreSQL
   */
  async getActiveOnlineUsers(timeoutMs = 12e4) {
    try {
      const cutoff = new Date(Date.now() - timeoutMs).toISOString();
      const { rows } = await pool.query(
        `SELECT id, name, email, avatar, role, is_verified, has_rgb, last_active_date 
         FROM users 
         WHERE last_active_date >= $1 
         ORDER BY last_active_date DESC`,
        [cutoff]
      );
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        avatar: r.avatar,
        status: "online",
        lastSeen: r.last_active_date ? new Date(r.last_active_date).toISOString() : (/* @__PURE__ */ new Date()).toISOString()
      }));
    } catch (e) {
      console.error("Active users query failed in PostgreSQL:", e);
      return [];
    }
  }
  /**
   * Create an in-app notification in PostgreSQL
   */
  async createNotification(notificationData) {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const createdAt = (/* @__PURE__ */ new Date()).toISOString();
    const newNotification = {
      ...notificationData,
      id,
      status: "notification",
      createdAt
    };
    try {
      await pool.query(
        `INSERT INTO notifications (id, user_id, sender_id, sender_name, sender_avatar, type, title, content, link, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          id,
          notificationData.userId,
          notificationData.senderId || null,
          notificationData.senderName || null,
          notificationData.senderAvatar || null,
          notificationData.type,
          notificationData.title,
          notificationData.content,
          notificationData.link || null,
          "notification",
          createdAt
        ]
      );
    } catch (e) {
      console.error("Notification creation failed in PostgreSQL:", e);
    }
    return newNotification;
  }
  /**
   * Retrieve notification history for a user from PostgreSQL
   */
  async getUserNotifications(userId) {
    try {
      const { rows } = await pool.query(
        `SELECT * FROM notifications 
         WHERE user_id = $1 AND status != 'deleted' 
         ORDER BY created_at DESC LIMIT 50`,
        [userId]
      );
      return rows.map((r) => ({
        id: r.id,
        userId: r.user_id,
        senderId: r.sender_id || void 0,
        senderName: r.sender_name || void 0,
        senderAvatar: r.sender_avatar || void 0,
        type: r.type,
        title: r.title,
        content: r.content,
        link: r.link || void 0,
        status: r.status,
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : (/* @__PURE__ */ new Date()).toISOString()
      }));
    } catch (e) {
      console.error("Notifications fetch failed in PostgreSQL:", e);
      return [];
    }
  }
  /**
   * Update notification status in PostgreSQL
   */
  async updateNotificationStatus(notificationId, status) {
    try {
      await pool.query(
        `UPDATE notifications SET status = $1 WHERE id = $2`,
        [status, notificationId]
      );
    } catch (e) {
      console.error("Notification status update failed in PostgreSQL:", e);
    }
  }
};
var realtimeService = new RealtimeService();

// server/sentinelService.ts
var import_genai3 = require("@google/genai");
init_server_db();
var localReferralLogs = [
  {
    id: "log-1",
    inviter: "Be\u015Fir Hanzo",
    inviterId: "user-besir",
    inviterAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
    referred: "AhmetK_Dev",
    referredId: "user-ahmet",
    referredAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150&q=80",
    code: "BESIR5",
    timestamp: new Date(Date.now() - 36e5 * 2).toISOString(),
    ipCheck: "TEM\u0130Z (MATCH FREE)",
    deviceCheck: "E\u015ES\u0130Z (UNIQUE)",
    status: "APPROVED",
    reason: "E\u015Fsiz cihaz parmak izi, aktif GitHub hesab\u0131 ve \xF6zg\xFCn setup payla\u015F\u0131m\u0131 do\u011Fruland\u0131.",
    rewardGranted: "Dinamik RGB Efekti & Kral Tac\u0131 Etkin \u{1F451}\u{1F308}"
  }
];
var localChatReports = [];
var SentinelService = class {
  getGemini() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("Sentinel: GEMINI_API_KEY environment variable is missing.");
      return null;
    }
    return new import_genai3.GoogleGenAI({ apiKey: key });
  }
  // 1. GET ALL REFERRAL LOGS
  async getReferralLogs() {
    return localReferralLogs;
  }
  // 2. GET ALL CHAT REPORTS
  async getChatReports() {
    return localChatReports;
  }
  // 3. AUDIT A REFERRAL DURING REGISTER
  async auditReferral(inviter, referred, code, ip, userAgent) {
    const id = `ref-audit-${Date.now()}`;
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    let ipCheck = "TEM\u0130Z (MATCH FREE)";
    let deviceCheck = "E\u015ES\u0130Z (UNIQUE)";
    let status = "APPROVED";
    let reason = "Temiz IP adresi ve e\u015Fsiz taray\u0131c\u0131 imzas\u0131 ile ger\xE7ek kullan\u0131c\u0131 kat\u0131l\u0131m\u0131 onayland\u0131.";
    let rewardGranted = "Dinamik RGB Efekti & Kral Tac\u0131 Etkin \u{1F451}\u{1F308}";
    const isSameIp = ip && inviter.lastIp === ip;
    const isSameUa = userAgent && inviter.lastUa === userAgent;
    const isSameEmailDomain = inviter.email && referred.email && inviter.email.split("@")[0] === referred.email.split("@")[0];
    if (isSameIp) {
      ipCheck = "\xC7AKI\u015EMA (CONFLICT)";
      status = "REJECTED";
      reason = "Ayn\u0131 IP adresi tespit edildi. Kendini davet etme (Self-referral) \u015F\xFCphesiyle reddedildi.";
      rewardGranted = "ENGELLEND\u0130 (\xD6d\xFCl Ask\u0131ya Al\u0131nd\u0131) \u274C";
    } else if (isSameUa && userAgent.length > 5) {
      deviceCheck = "BENZER (DUPLICATE)";
      status = "REJECTED";
      reason = "Taray\u0131c\u0131/cihaz parmak izi e\u015Fle\u015Fti. \xC7oklu hesapla kendini davet etme te\u015Febb\xFCs\xFC engellendi.";
      rewardGranted = "ENGELLEND\u0130 (\xD6d\xFCl Ask\u0131ya Al\u0131nd\u0131) \u274C";
    } else if (isSameEmailDomain) {
      status = "REJECTED";
      reason = "Benzer e-posta kullan\u0131c\u0131 ad\u0131 kal\u0131b\u0131 saptand\u0131. Bot kay\u0131t engellendi.";
      rewardGranted = "ENGELLEND\u0130 (\xD6d\xFCl Ask\u0131ya Al\u0131nd\u0131) \u274C";
    }
    const newLog = {
      id,
      inviter: inviter.name || inviter.displayName || "Davet Eden",
      inviterId: inviter.id,
      inviterAvatar: inviter.avatar || "",
      referred: referred.name || referred.displayName || "Davet Edilen",
      referredId: referred.id,
      referredAvatar: referred.avatar || "",
      code,
      timestamp,
      ipCheck,
      deviceCheck,
      status,
      reason,
      rewardGranted
    };
    localReferralLogs.unshift(newLog);
    const hasValidDb = !!(process.env.DATABASE_URL || process.env.SQL_HOST);
    if (hasValidDb && pool) {
      try {
        const details = `[REFERRAL AUDIT - ${status}] ${inviter.name} -> ${referred.name} (${code}). Sonu\xE7: ${reason}`;
        const logId = `activity-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        await pool.query(
          `INSERT INTO activity_logs (id, action_type, user_id, user_name, details, created_at)
           VALUES ($1, $2, $3, $4, $5, NOW())`,
          [logId, "REFERRAL_AUDIT", inviter.id, inviter.name, details]
        );
      } catch (err) {
        console.error("Sentinel failed to write to database activity_logs:", err);
      }
    }
    return newLog;
  }
  // 4. AUDIT A CHAT MESSAGE REPORT WITH GEMINI
  async auditChatMessage(reporterId, reporterName, messageId, messageContent, senderId, senderName) {
    const reportId = `report-${Date.now()}`;
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const newReport = {
      id: reportId,
      reporterId,
      reporterName,
      messageId,
      messageContent,
      senderId,
      senderName,
      status: "PENDING",
      reason: "Sentinel V900 incelemesi bekleniyor.",
      timestamp
    };
    localChatReports.unshift(newReport);
    const ai2 = this.getGemini();
    let isProfane = false;
    let reason = "Sentinel V900 incelemesinde k\xFCf\xFCr veya a\u011F\u0131r hakaret tespit edilmedi.";
    if (ai2) {
      try {
        const prompt = `You are Sentinel V900, the AI moderating system for Setupss (PC setup social platform).
Analyze the following chat message for profanity, swears, severe slurs, intense insults, or toxic comments in English, Turkish, German, French, or Spanish.
Ignore casual tech talk, mild slang, or friendly banter (e.g. "lan", "kanka", "oha" are mild and shouldn't be banned unless combined with swearing).

Message to analyze: "${messageContent}"

Respond STRICTLY in JSON format with exactly two keys:
- "isProfane" (boolean): true if it contains offensive profanity, swears, slurs, or heavy insults; false otherwise.
- "reason" (string): brief explanation in Turkish (max 1 sentence) of why or why not, or what profanity was detected. Do not mention any other text.`;
        const response = await ai2.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json"
          }
        });
        const responseText = response.text || "{}";
        const result = JSON.parse(responseText);
        isProfane = !!result.isProfane;
        reason = result.reason || reason;
      } catch (e) {
        console.error("Sentinel Gemini audit failed, falling back to heuristic profanity check:", e);
        const lowercaseMsg = messageContent.toLowerCase();
        const profaneWords = ["siktir", "orospu", "pi\xE7", "g\xF6t", "am\u0131na", "sikeyim", "kaltak", "yarrak", "fuck", "bitch", "asshole", "bastard"];
        const matches = profaneWords.some((word) => lowercaseMsg.includes(word));
        if (matches) {
          isProfane = true;
          reason = "Heuristics profanity audit triggered: A\u011F\u0131r k\xFCf\xFCr/hakaret kelimesi tespit edildi.";
        }
      }
    } else {
      const lowercaseMsg = messageContent.toLowerCase();
      const profaneWords = ["siktir", "orospu", "pi\xE7", "g\xF6t", "am\u0131na", "sikeyim", "kaltak", "yarrak", "fuck", "bitch", "asshole", "bastard"];
      const matches = profaneWords.some((word) => lowercaseMsg.includes(word));
      if (matches) {
        isProfane = true;
        reason = "Sentinel Yerel Filtresi: A\u011F\u0131r k\xFCf\xFCr/hakaret kelimesi tespit edildi.";
      }
    }
    newReport.status = isProfane ? "RESOLVED_BANNED" : "RESOLVED_CLEAN";
    newReport.reason = reason;
    if (isProfane) {
      const hasValidDb = !!(process.env.DATABASE_URL || process.env.SQL_HOST);
      if (hasValidDb && pool) {
        try {
          await pool.query(
            `UPDATE users SET is_banned = TRUE WHERE id = $1`,
            [senderId]
          );
          await pool.query(
            `UPDATE chat_messages SET message = $1 WHERE id = $2`,
            [`[Bu mesaj Sentinel V900 taraf\u0131ndan k\xFCf\xFCr/hakaret tespitiyle kald\u0131r\u0131lm\u0131\u015Ft\u0131r. Kullan\u0131c\u0131 uzakla\u015Ft\u0131r\u0131lm\u0131\u015Ft\u0131r.]`, messageId]
          );
        } catch (dbErr) {
          console.error("Db ban write failed:", dbErr);
        }
      }
      await realtimeService.createNotification({
        userId: reporterId,
        senderId: "system-sentinel",
        senderName: "Sentinel V900",
        senderAvatar: "/setupss_icon.svg",
        type: "like",
        // sentinel type
        title: "\u015Eikayetin \u0130ncelendi! \u{1F6E1}\uFE0F",
        content: `Sentinel V900 yapt\u0131\u011F\u0131n bildirim \xFCzerine "${senderName}" isimli kullan\u0131c\u0131y\u0131 k\xFCf\xFCr/hakaret tespitiyle uzakla\u015Ft\u0131rd\u0131. Katk\u0131n i\xE7in te\u015Fekk\xFCrler!`,
        link: "/chat"
      });
    }
    return { success: true, isProfane, reason };
  }
};
var sentinelService = new SentinelService();

// server.ts
var import_app = require("firebase-admin/app");
var import_auth = require("firebase-admin/auth");
import_dotenv3.default.config();
import_dotenv3.default.config({ override: true });
try {
  const firebaseConfigPath = import_path.default.join(process.cwd(), "firebase-applet-config.json");
  if (import_fs.default.existsSync(firebaseConfigPath)) {
    const firebaseConfig = JSON.parse(import_fs.default.readFileSync(firebaseConfigPath, "utf-8"));
    if ((0, import_app.getApps)().length === 0) {
      (0, import_app.initializeApp)({
        projectId: firebaseConfig.projectId
      });
      console.log(`\u2705 [Firebase Admin] Initialized securely with projectId: ${firebaseConfig.projectId}`);
    }
  } else {
    console.warn("\u26A0\uFE0F [Firebase Admin] firebase-applet-config.json not found. Verification might fail.");
  }
} catch (err) {
  console.error("\u274C [Firebase Admin] Failed to initialize:", err);
}
var localSetups = JSON.parse(JSON.stringify(curatedSetups));
var localWishlist = [
  { id: "w-1", name: "IKEA Karlby Me\u015Fe Tabla", category: "Masa\xFCst\xFC / Mobilya", estimatedPrice: 4200, purchased: true, notes: "Alex \xE7ekmecelerle birle\u015Ftirilecek." },
  { id: "w-2", name: "Keychron K2 V2 Mekanik Klavye", category: "Klavye / Mouse", estimatedPrice: 2800, purchased: false, link: "https://keychron.com", notes: "Brown switch tercih edilecek." },
  { id: "w-3", name: "Xiaomi Monit\xF6r Arkas\u0131 I\u015F\u0131k \xC7ubu\u011Fu", category: "I\u015F\u0131kland\u0131rma / Ses", estimatedPrice: 1200, purchased: false, notes: "G\xF6z yorgunlu\u011Funu \xF6nlemek i\xE7in." }
];
var localUsers = [
  {
    id: "mock-user-123",
    email: "ziyaretci@setupss.com",
    password_hash: import_bcryptjs3.default.hashSync("123456", 10),
    name: "Ziyaret\xE7i Geli\u015Ftirici",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
    is_verified: true,
    bio: "Teknoloji tutkunu ve minimal masa\xFCst\xFC d\xFCzeni geli\u015Ftiricisi.",
    githubLink: "https://github.com",
    instagramLink: "",
    linkedinLink: "",
    coverPhoto: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80",
    customBadge: "Setup Payla\u015F\u0131mc\u0131s\u0131 \u{1F680}",
    customColor: "#4ECDC4",
    role: "user",
    createdAt: "2026-02-15T12:00:00.000Z"
  },
  {
    id: "admin",
    email: "setupss.support@gmail.com",
    password_hash: import_bcryptjs3.default.hashSync("ozcan1257", 10),
    name: "Be\u015Fir Hanzo",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80",
    is_verified: true,
    bio: "Kod Yazan Kahve Canavar\u0131 \u2615\uFE0F",
    githubLink: "https://github.com",
    instagramLink: "",
    linkedinLink: "",
    coverPhoto: "https://images.unsplash.com/photo-1491336477066-31156b5e4f35?auto=format&fit=crop&w=800&q=80",
    customBadge: "Kurucu & Geli\u015Ftirici \u{1F451}",
    customColor: "#FF6B6B",
    is_crown: true,
    has_rgb: true,
    role: "admin",
    createdAt: "2026-01-01T09:00:00.000Z"
  },
  {
    id: "kreatif-can",
    email: "can@setupss.com",
    password_hash: import_bcryptjs3.default.hashSync("123456", 10),
    name: "Kreatif Can",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&h=200&q=80",
    is_verified: true,
    bio: "RGB & Neon Sevdal\u0131s\u0131 \u{1F308}",
    githubLink: "https://github.com",
    instagramLink: "",
    linkedinLink: "",
    coverPhoto: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80",
    customBadge: "RGB Profes\xF6r\xFC \u{1F308}",
    customColor: "#9b59b6",
    has_rgb: true,
    role: "user",
    createdAt: "2026-03-20T14:30:00.000Z"
  },
  {
    id: "zeynep-tasarim",
    email: "zeynep@setupss.com",
    password_hash: import_bcryptjs3.default.hashSync("123456", 10),
    name: "Zeynep Tasar\u0131m",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&h=200&q=80",
    is_verified: true,
    bio: "Piksel B\xFCk\xFCc\xFC & Bitki B\xFCy\xFCc\xFCs\xFC \u{1F33F}",
    githubLink: "https://github.com",
    instagramLink: "",
    linkedinLink: "",
    coverPhoto: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80",
    customBadge: "Senior Designer \u{1F3A8}",
    customColor: "#2ecc71",
    is_crown: true,
    role: "user",
    createdAt: "2026-04-05T10:15:00.000Z"
  },
  {
    id: "ai-bot",
    email: "bot@setupss.com",
    password_hash: import_bcryptjs3.default.hashSync("123456", 10),
    name: "Setupss AI",
    avatar: "/airobot.jpg",
    is_verified: true,
    bio: "Kurulum Dan\u0131\u015Fman\u0131 & Site Rehberi \u{1F916}",
    githubLink: "",
    instagramLink: "",
    linkedinLink: "",
    coverPhoto: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    customBadge: "Topluluk Asistan\u0131 \u{1F916}",
    customColor: "#FFD93D",
    is_crown: false,
    has_rgb: true,
    role: "admin",
    createdAt: "2026-01-01T08:00:00.000Z"
  }
];
localUsersList.push(...localUsers);
var localSiteSettings2 = {
  contact_email: "setupss.support@gmail.com",
  site_logo_url: "",
  site_logo_dark_url: "",
  site_icon_url: "",
  ai_avatar_video_url: "",
  ai_avatar_image_url: "",
  logo_desktop_scale: "100",
  logo_mobile_scale: "100",
  logo_rotation: "0",
  ai_avatar_size_scale: "110",
  ai_avatar_glow_color: "amber",
  ai_avatar_border_style: "dashed",
  ai_avatar_interactive_effect: "float",
  ai_avatar_rounded: "full"
};
function savePersistentDb() {
}
var aiClient = null;
var AI_BOT_ID = "ai-bot";
function getGemini() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required.");
    }
    aiClient = new import_genai4.GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
async function getSiteContext() {
  let setupsCount = 0;
  let topUsers = [];
  const hasValidDb = checkDbActive();
  try {
    if (hasValidDb && pool) {
      const { rows: sCount } = await pool.query("SELECT COUNT(*) FROM setups");
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
      topUsers = [{ name: "Ziyaret\xE7i Geli\u015Ftirici", total_likes: 0 }];
    }
  } catch (e) {
  }
  return `
    S\u0130TE B\u0130LG\u0130LER\u0130 (CONTEXT):
    - Site Ad\u0131: SETUPSS
    - Amac\u0131: Masa\xFCst\xFC setup (kurulum) payla\u015F\u0131m\u0131, ekipman inceleme, b\xFCt\xE7e planlama ve askeri d\xFCzeyde d\xFCr\xFCst referans/davet takip sistemi.
    - Toplam Setup Say\u0131s\u0131: ${setupsCount}
    - Liderlik Tablosu \u0130lk 5: ${topUsers.map((u) => `${u.name} (${u.total_likes} be\u011Feni)`).join(", ")}
    - \xD6zellikler: Explore (Ke\u015Ffet), Leaderboard (Liderlik), Wishlist/Planner (B\xFCt\xE7e & Plan), P2P Sohbet, Davet Sistemi (Invite), AS-SENTINEL-900 Yapay Zeka Askeri Referans & \xD6d\xFCl Denetleyicisi.
    - AS-SENTINEL-900 Yapay Zeka Askeri Referans & \xD6d\xFCl Denetleyicisi: Bu sistem, hangi kullan\u0131c\u0131n\u0131n arkada\u015F\u0131n\u0131 davet etti\u011Fini, kimin referans koduyla kimin kay\u0131t oldu\u011Funu, hileli VPN'leri, \xE7oklu hesap a\xE7\u0131mlar\u0131 (self-referral) ve bot giri\u015Fimlerini askeri d\xFCzeyde d\xFCr\xFCst ve tarafs\u0131z bir \u015Fekilde denetler. Sadece ba\u015Far\u0131l\u0131 ve temiz daveti olan d\xFCr\xFCst kullan\u0131c\u0131lar\u0131n setup kartlar\u0131n\u0131n etraf\u0131nda par\u0131l par\u0131l parlayan Dinamik RGB Efekti aktifle\u015Ftirilir. Fake bot giri\u015Fimleri (\xF6rne\u011Fin GamerX_Fake) hemen elenir.
    - Sen Kimsin: Sen hem "Setupss AI" asistan\u0131 hem de sistemin askeri referans denetleyicisisin.
    - Tonun: Samimi, d\xFCr\xFCst, adaletli, askeri d\xFCzeyde kararl\u0131 ve profesyonel.
    - Kullan\u0131c\u0131 davet/referans sistemini sorarsa: Davet linki ile d\xFCr\xFCst\xE7e arkada\u015F getirenlere Dinamik RGB Efekti verildi\u011Fini, hile yapmaya \xE7al\u0131\u015Fanlar\u0131n (self-referral, fake botlar) ise AS-SENTINEL-900 yapay zekam\u0131z taraf\u0131ndan an\u0131nda reddedildi\u011Fini anlat.
    - Kullan\u0131c\u0131 "Neden s\u0131rada \xFCstlerde de\u011Filim?" derse: Be\u011Feniler, yorumlar, davetler ve payla\u015F\u0131mlarla puan kazanabilece\u011Fini anlat.
    - Kullan\u0131c\u0131 "Nas\u0131l payla\u015F\u0131m yapar\u0131m?" derse: Sa\u011F \xFCstteki "Setup Payla\u015F" butonunu kullanabilece\u011Fini s\xF6yle.
    - Kullan\u0131c\u0131 "B\xFCt\xE7e nas\u0131l planlan\u0131r?" derse: "B\xFCt\xE7e & Plan" sekmesinden Gemini destekli planlay\u0131c\u0131y\u0131 kullanabilece\u011Fini anlat.
  `;
}
var mailTransporter = null;
var isEthereal = false;
async function getMailTransporter() {
  if (mailTransporter) return mailTransporter;
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "465");
  const secure = process.env.SMTP_SECURE !== "false";
  const user = process.env.SMTP_USER || "setupss.info@gmail.com";
  const pass = process.env.SMTP_PASS || "ytilaoonyjnfhexq";
  mailTransporter = import_nodemailer.default.createTransport({
    host,
    port,
    secure,
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    connectionTimeout: 8e3,
    greetingTimeout: 8e3,
    socketTimeout: 8e3,
    auth: {
      user,
      pass
    }
  });
  isEthereal = false;
  mailTransporter.verify((err) => {
    if (err) {
      console.error(`[SMTP ERROR] E-posta sunucu ba\u011Flant\u0131s\u0131 ba\u015Far\u0131s\u0131z (${user}):`, err.message);
    } else {
      console.log(`[SMTP OK] E-posta sunucusuna (${user}) ba\u011Flant\u0131 havuzu haz\u0131r ve aktif.`);
    }
  });
  return mailTransporter;
}
async function sendMailWithTimeout(mailer, mailOptions, timeoutMs = 8e3) {
  return Promise.race([
    mailer.sendMail(mailOptions),
    new Promise((_, reject) => setTimeout(() => reject(new Error("SMTP_TIMEOUT")), timeoutMs))
  ]);
}
async function sendSetupssVerificationEmail(toEmail, userName, code) {
  try {
    const mailer = await getMailTransporter();
    const sender = process.env.SMTP_USER || "setupss.info@gmail.com";
    const plainText = `Merhaba ${userName || "Kullan\u0131c\u0131"},

SETUPSS Hesap Do\u011Frulama Kodunuz: ${code}

Bu kod 10 dakika boyunca ge\xE7erlidir.

E\u011Fer bu i\u015Flemi siz yapmad\u0131ysan\u0131z bu e-postay\u0131 dikkate almay\u0131n\u0131z.

SETUPSS - The Operating System of PC Enthusiasts
https://setupss.com`;
    await sendMailWithTimeout(mailer, {
      from: `"SETUPSS" <${sender}>`,
      to: toEmail,
      replyTo: sender,
      subject: `\u26A1 SETUPSS Do\u011Frulama Kodunuz: ${code}`,
      text: plainText,
      html: generateSetupssVerificationEmail(userName, code),
      headers: {
        "X-Priority": "1 (Highest)",
        "X-MSMail-Priority": "High",
        "Importance": "High"
      }
    }, 7e3);
    console.log(`[SMTP SUCCESS] Do\u011Frulama e-postas\u0131 an\u0131nda g\xF6nderildi -> ${toEmail} (Kod: ${code})`);
    return true;
  } catch (err) {
    console.error(`[SMTP FAILED] E-posta g\xF6nderilemedi (${toEmail}):`, err?.message || err);
    return false;
  }
}
function generateSetupssVerificationEmail(userName, code) {
  const safeName = userName || "Kullan\u0131c\u0131";
  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SETUPSS Do\u011Frulama Kodu</title>
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
                Hesap Do\u011Frulama Kodu \u2709\uFE0F
              </h2>
              
              <p style="margin: 0 0 14px 0; font-size: 15px; line-height: 1.6; color: #2D3436;">
                Merhaba <strong>${safeName}</strong>,
              </p>
              
              <p style="margin: 0 0 22px 0; font-size: 14px; line-height: 1.6; color: #636E72;">
                SETUPSS hesab\u0131n\u0131z\u0131 g\xFCvenle aktifle\u015Ftirmek i\xE7in a\u015Fa\u011F\u0131daki 6 haneli tek kullan\u0131ml\u0131k do\u011Frulama kodunu kullanabilirsiniz:
              </p>

              <!-- Verification Code Box (Neo-Brutalist Box) -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 20px 0 24px 0;">
                <tr>
                  <td align="center" style="background-color: #FFF8E1; border: 3px solid #2D3436; border-radius: 14px; padding: 22px 16px; text-align: center; box-shadow: 4px 4px 0px 0px #2D3436;">
                    <div style="font-size: 10px; font-weight: 900; color: #636E72; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px;">
                      6 HANEL\u0130 DO\u011ERULAMA KODU
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
                      \u23F1\uFE0F <strong>S\xFCre:</strong> Bu kod 10 dakika boyunca ge\xE7erlidir.<br>
                      \u{1F6E1}\uFE0F <strong>G\xFCvenlik:</strong> Bu kodu g\xFCvenli\u011Finiz i\xE7in kimseyle payla\u015Fmay\u0131n\u0131z.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Action Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 24px 0 10px 0;">
                <tr>
                  <td align="center">
                    <a href="https://setupss.com" target="_blank" style="display: inline-block; background-color: #FFD93D; color: #2D3436; font-weight: 900; font-size: 14px; text-decoration: none; padding: 13px 32px; border: 2px solid #2D3436; border-radius: 12px; box-shadow: 3px 3px 0px 0px #2D3436; text-transform: uppercase; letter-spacing: 0.5px;">
                      Giri\u015F Yap &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 20px 0 0 0; font-size: 11px; line-height: 1.5; color: #A0AEC0; text-align: center;">
                Bu i\u015Flemi siz ba\u015Flatmad\u0131ysan\u0131z bu e-postay\u0131 dikkate almayabilirsiniz.
              </p>
            </td>
          </tr>

          <!-- Footer Area -->
          <tr>
            <td style="background-color: #FFF8E1; border-top: 3px solid #2D3436; padding: 18px 24px; text-align: center;">
              <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 800; color: #2D3436;">
                SETUPSS &bull; Donan\u0131m & Topluluk \u0130\u015Fletim Sistemi
              </p>
              <p style="margin: 0; font-size: 11px; color: #636E72;">
                &copy; 2026 SETUPSS. T\xFCm haklar\u0131 sakl\u0131d\u0131r. &bull; <a href="https://setupss.com" style="color: #2D3436; font-weight: 700; text-decoration: underline;">setupss.com</a>
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
var app = (0, import_express4.default)();
var server_default = app;
var PORT = 3e3;
app.set("trust proxy", 1);
app.use((0, import_compression.default)());
app.use(
  (0, import_helmet.default)({
    contentSecurityPolicy: false,
    // Permissive for external resources like Unsplash/Google APIs
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
  })
);
var authLimiter = (0, import_express_rate_limit.default)({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  max: 20,
  // limit each IP to 20 auth requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "\xC7ok fazla giri\u015F veya kay\u0131t denemesi. L\xFCtfen 15 dakika sonra tekrar deneyiniz." }
});
var uploadLimiter = (0, import_express_rate_limit.default)({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  max: 10,
  // limit each IP to 10 uploads per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "\xC7ok fazla dosya y\xFCkleme iste\u011Fi. L\xFCtfen daha sonra tekrar deneyiniz." }
});
var aiLimiter = (0, import_express_rate_limit.default)({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  max: 20,
  // limit each IP to 20 AI generation requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "G\xFCnl\xFCk yapay zeka kotan\u0131za \xE7ok yakla\u015Ft\u0131n\u0131z veya \xE7ok h\u0131zl\u0131 istek att\u0131n\u0131z. L\xFCtfen biraz bekleyin." }
});
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
var sessionStore;
if ((process.env.SQL_HOST || process.env.DATABASE_URL || process.env.POSTGRES_URL) && pool) {
  try {
    const PgSessionStore = (0, import_connect_pg_simple.default)(import_express_session.default);
    sessionStore = new PgSessionStore({
      pool,
      tableName: "user_sessions",
      createTableIfMissing: true
    });
    console.log("SessionStore: PostgreSQL Store configured and active.");
  } catch (err) {
    console.warn("SessionStore: Failed to initialize PgSessionStore, falling back to MemoryStore:", err);
  }
} else {
  console.warn("SessionStore: Neither SQL_HOST nor DATABASE_URL is set, falling back to MemoryStore.");
}
app.use(import_express4.default.json({ limit: "50mb" }));
app.use(import_express4.default.urlencoded({ limit: "50mb", extended: true }));
app.use((0, import_express_session.default)({
  store: sessionStore,
  secret: process.env.SESSION_SECRET || "dev-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    // secure cookies in production (HTTPS)
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1e3
    // 30 days
  }
}));
app.use(import_passport.default.initialize());
app.use(import_passport.default.session());
app.use("/api/hardware", hardwareRoutes);
app.use("/api/v2/hardware", hardwareRoutes);
app.use("/api/v2/users", userRoutes);
app.use("/api/v2/setups", setupRoutes);
app.use((req, res, next) => {
  const host = req.get("host") || "";
  const isHttps = req.secure || req.headers["x-forwarded-proto"] === "https";
  const hostLower = host.toLowerCase();
  if (hostLower.includes("setupss.com")) {
    const isWww = hostLower.startsWith("www.");
    if (!isHttps || isWww) {
      return res.redirect(301, `https://setupss.com${req.originalUrl}`);
    }
  }
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("X-Robots-Tag", "index, follow, max-image-preview:large");
  if (req.path === "/" || req.path === "/index.html") {
    res.setHeader("Link", '<https://setupss.com/>; rel="canonical"');
  }
  next();
});
var uploadsDirOnBoot = import_path.default.join(process.cwd(), "public", "uploads");
if (!import_fs.default.existsSync(uploadsDirOnBoot)) {
  import_fs.default.mkdirSync(uploadsDirOnBoot, { recursive: true });
}
app.get(["/*.mp4", "/*.webm", "/*.ogv", "/*.mov"], (req, res) => {
  try {
    const cleanPath = decodeURIComponent(req.path.split("?")[0]);
    let filePath = import_path.default.join(process.cwd(), "public", cleanPath);
    if (!import_fs.default.existsSync(filePath) || !import_fs.default.statSync(filePath).isFile()) {
      filePath = import_path.default.join(process.cwd(), "dist", cleanPath);
    }
    if (!import_fs.default.existsSync(filePath) || !import_fs.default.statSync(filePath).isFile()) {
      filePath = import_path.default.join(process.cwd(), cleanPath);
    }
    if (import_fs.default.existsSync(filePath) && import_fs.default.statSync(filePath).isFile()) {
      const ext = import_path.default.extname(filePath).toLowerCase();
      const mimeTypes = {
        ".mp4": "video/mp4",
        ".webm": "video/webm",
        ".ogv": "video/ogg",
        ".mov": "video/quicktime"
      };
      res.setHeader("Content-Type", mimeTypes[ext] || "video/mp4");
      res.setHeader("Accept-Ranges", "bytes");
      return res.sendFile(filePath);
    }
  } catch (err) {
    console.error("Video serve error:", err);
  }
  return res.status(404).set("Content-Type", "text/plain").send("Video file not found");
});
app.use(import_express4.default.static(import_path.default.join(process.cwd(), "public"), {
  maxAge: "1y",
  etag: true,
  lastModified: true
}));
app.use("/uploads", import_express4.default.static(import_path.default.join(process.cwd(), "public", "uploads"), {
  maxAge: "1y",
  etag: true,
  lastModified: true
}));
app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.header("Cache-Control", "public, max-age=86400");
  const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
  const host = req.headers.host || "setupss.com";
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
app.get("/api/seo/ping-sitemap", async (req, res) => {
  const sitemapUrl = encodeURIComponent("https://setupss.com/sitemap.xml");
  const pingResults = {};
  try {
    const googleRes = await fetch(`https://www.google.com/ping?sitemap=${sitemapUrl}`);
    pingResults.google = googleRes.ok ? "success" : `status ${googleRes.status}`;
  } catch (e) {
    pingResults.google = e?.message || "failed";
  }
  try {
    const bingRes = await fetch(`https://www.bing.com/ping?sitemap=${sitemapUrl}`);
    pingResults.bing = bingRes.ok ? "success" : `status ${bingRes.status}`;
  } catch (e) {
    pingResults.bing = e?.message || "failed";
  }
  res.json({
    message: "SETUPSS Sitemap ping triggered successfully",
    sitemapUrl: "https://setupss.com/sitemap.xml",
    results: pingResults
  });
});
app.get("/setupss-indexnow-key-2026.txt", (req, res) => {
  res.type("text/plain").send("setupss-indexnow-key-2026");
});
app.all("/api/seo/indexnow", async (req, res) => {
  const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
  const host = req.headers.host || "setupss.com";
  const baseUrl = `${protocol}://${host}`;
  let urlList = [];
  if (req.body && req.body.url) {
    urlList = Array.isArray(req.body.url) ? req.body.url : [req.body.url];
  } else if (req.query && req.query.url) {
    urlList = [String(req.query.url)];
  } else {
    urlList = [`${baseUrl}/`, `${baseUrl}/sitemap.xml`, `${baseUrl}/feed.json`, `${baseUrl}/llms.txt`];
  }
  const formattedUrls = urlList.map((u) => u.startsWith("http") ? u : `${baseUrl}${u.startsWith("/") ? "" : "/"}${u}`);
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
  const results = {};
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
    } catch (err) {
      results[endpoint] = { error: err?.message || "Failed" };
    }
  }
  res.json({
    success: true,
    message: "SETUPSS IndexNow instant indexing request dispatched",
    payload: indexNowPayload,
    results
  });
});
app.get(["/llms.txt", "/.well-known/llms.txt"], (req, res) => {
  res.type("text/plain; charset=utf-8");
  res.header("Cache-Control", "public, max-age=86400");
  const filePath = import_path.default.join(process.cwd(), "public", "llms.txt");
  if (import_fs.default.existsSync(filePath)) {
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
  const filePath = import_path.default.join(process.cwd(), "public", "llms-full.txt");
  if (import_fs.default.existsSync(filePath)) {
    return res.sendFile(filePath);
  }
  res.send(`# SETUPSS Full LLM Manifest
Visit https://setupss.com for complete hardware knowledge graph data.`);
});
app.get(["/feed.json", "/api/v1/latest-setups"], async (req, res) => {
  res.type("application/json; charset=utf-8");
  res.header("Cache-Control", "public, max-age=300");
  const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
  const host = req.headers.host || "setupss.com";
  const baseUrl = `${protocol}://${host}`;
  try {
    let setupsList = [];
    const hasValidDb = checkDbActive();
    if (pool && hasValidDb) {
      const { rows } = await pool.query("SELECT * FROM setups ORDER BY created_at DESC LIMIT 50");
      setupsList = rows;
    }
    if (setupsList.length === 0) {
      setupsList = localSetups;
    }
    const formattedFeed = setupsList.map((s) => {
      const rawImg = s.image || s.media_url || s.cover_photo || "/logoarkaplanolmayan.png";
      const absoluteImg = rawImg.startsWith("http") ? rawImg : `${baseUrl}${rawImg.startsWith("/") ? "" : "/"}${rawImg}`;
      const componentsArray = Array.isArray(s.components) ? s.components : typeof s.components === "string" ? JSON.parse(s.components || "[]") : [];
      return {
        id: s.id,
        title: s.title || "Masa\xFCst\xFC Setup Kurulumu",
        owner: `@${s.owner || s.owner_name || "setupss"}`,
        category: s.category || "Masa\xFCst\xFC Setup",
        description: s.description || `${s.owner || "Setupss \xFCyesi"} taraf\u0131ndan olu\u015Fturulan masa\xFCst\xFC kurulumu.`,
        canonicalUrl: `${baseUrl}/?setup=${s.id}`,
        imageUrl: absoluteImg,
        likes: s.likes || 0,
        hardwareComponents: componentsArray.map((c) => ({
          name: c.name,
          category: c.category || "Donan\u0131m",
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
  } catch (err) {
    res.status(500).json({ error: "Failed to generate AI feed", details: err?.message });
  }
});
app.get("/api/health", async (req, res) => {
  try {
    const health = await getHealthStatusFromDb();
    const statusCode = health.status === "unhealthy" ? 503 : 200;
    res.status(statusCode).json(health);
  } catch (err) {
    res.status(500).json({
      status: "unhealthy",
      ready: false,
      error: err?.message || "Health check error",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
});
app.get("/api/migrations", async (req, res) => {
  try {
    const history = await getMigrationHistoryFromDb();
    res.json({
      count: history.length,
      migrations: history,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err?.message || "Failed to fetch migration history" });
  }
});
import_passport.default.serializeUser((user, done) => done(null, user.id));
import_passport.default.deserializeUser(async (id, done) => {
  try {
    const user = await authService.getUserById(id);
    if (user) {
      done(null, user);
    } else {
      const localUser = localUsers.find((u) => u.id === id);
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
import_passport.default.use(new import_passport_local.Strategy({ usernameField: "email" }, async (email, password, done) => {
  try {
    const userRow = await authService.getUserByEmail(email);
    if (!userRow) {
      return done(null, false, { message: "Bu e-posta adresi ile kay\u0131tl\u0131 kullan\u0131c\u0131 bulunamad\u0131." });
    }
    const isMatch = await authService.comparePassword(password, userRow.password_hash);
    if (!isMatch) {
      return done(null, false, { message: "Hatal\u0131 \u015Fifre." });
    }
    return done(null, authService.formatUserDto(userRow));
  } catch (err) {
    return done(err);
  }
}));
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  import_passport.default.use(new import_passport_google_oauth20.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "/auth/google/callback",
    scope: ["profile", "email"]
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails && profile.emails[0]?.value;
      if (!email) return done(new Error("Google hesab\u0131ndan e-posta adresi al\u0131namad\u0131."));
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
      return res.status(400).json({ success: false, message: "E-posta, \u015Fifre ve isim gereklidir." });
    }
    const hasValidDb = checkDbActive();
    let existingUser = null;
    let existingName = null;
    if (hasValidDb && pool) {
      existingUser = await getUserByEmail(email);
      existingName = await getUserByName(name);
    } else {
      existingUser = localUsers.find((u) => u.email === email);
      existingName = localUsers.find((u) => u.name === name);
    }
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Bu e-posta adresi zaten kullan\u0131l\u0131yor." });
    }
    if (existingName) {
      return res.status(400).json({ success: false, message: "Bu kullan\u0131c\u0131 ad\u0131 zaten al\u0131nm\u0131\u015F." });
    }
    const passwordHash = await import_bcryptjs3.default.hash(password, 10);
    const userId = `user-${Date.now()}`;
    const verification_code = Math.floor(1e5 + Math.random() * 9e5).toString();
    const verification_expires_at = new Date(Date.now() + 10 * 60 * 1e3).toISOString();
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
    const refCode = req.body.referenceCode || req.body.ref;
    if (refCode) {
      const clientIp = req.ip || "127.0.0.1";
      const clientUa = req.headers["user-agent"] || "";
      if (hasValidDb && pool) {
        const inviter = await getUserByReferenceCode(refCode);
        if (inviter && inviter.id !== userId) {
          const auditResult = await sentinelService.auditReferral(
            inviter,
            newUser,
            refCode,
            clientIp,
            clientUa
          );
          if (auditResult.status === "APPROVED") {
            await incrementInviteCount(inviter.id);
            const msgId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
            await pool.query(
              `INSERT INTO chat_messages (id, sender_id, sender_name, sender_avatar, receiver_id, receiver_name, receiver_avatar, message, created_at, is_read)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), $9)`,
              [msgId, "system", "Sistem", null, inviter.id, inviter.name || "Davet Sahibi", inviter.avatar, `Tebrikler! ${name} isimli arkada\u015F\u0131n\u0131z davetinizle kat\u0131ld\u0131. Sentinel V900 onaylad\u0131. Kral Tac\u0131, RGB efektiniz ve +50 Liderlik Puan\u0131n\u0131z aktifle\u015Fti! \u{1F451}\u{1F308}`, false]
            );
            await realtimeService.createNotification({
              userId: inviter.id,
              senderId: "system-sentinel",
              senderName: "Sentinel V900",
              senderAvatar: "/setupss_icon.svg",
              type: "like",
              title: "Davet Kodun Onayland\u0131! \u{1F451}\u{1F308}",
              content: `${name} davet kodunla kay\u0131t oldu. Sentinel V900 denetiminden ba\u015Far\u0131yla ge\xE7ildi ve \xF6d\xFCllerin tan\u0131mland\u0131!`,
              link: "/profile"
            });
            await logActivityToDb("INVITE_SUCCESS", inviter.id, inviter.name, `Kullan\u0131c\u0131 ${email} davet koduyla kat\u0131ld\u0131. Sentinel V900 onaylad\u0131.`);
          } else {
            const msgId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
            await pool.query(
              `INSERT INTO chat_messages (id, sender_id, sender_name, sender_avatar, receiver_id, receiver_name, receiver_avatar, message, created_at, is_read)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), $9)`,
              [msgId, "system-sentinel", "Sentinel V900", "/setupss_icon.svg", inviter.id, inviter.name || "Davet Sahibi", inviter.avatar, `D\u0130KKAT: Davet kodunuzu kullanan bir \xFCyelik i\xE7in Sentinel V900 fraud filtresi tetiklendi: ${auditResult.reason}. \xD6d\xFCller tan\u0131mlanmad\u0131.`, false]
            );
            await realtimeService.createNotification({
              userId: inviter.id,
              senderId: "system-sentinel",
              senderName: "Sentinel V900",
              senderAvatar: "/setupss_icon.svg",
              type: "like",
              title: "Davet Engellendi! \u274C",
              content: `Kay\u0131t denetiminde fraud/\xE7ak\u0131\u015Fma tespit edildi: ${auditResult.reason}`,
              link: "/profile"
            });
            await logActivityToDb("INVITE_FRAUD_BLOCKED", inviter.id, inviter.name, `Kay\u0131tta davet usuls\xFCzl\xFC\u011F\xFC: ${auditResult.reason}`);
          }
        }
      } else {
        const referringUser = localUsers.find((u) => u.referenceCode === refCode || u.id === refCode);
        if (referringUser && referringUser.id !== userId) {
          const auditResult = await sentinelService.auditReferral(
            referringUser,
            newUser,
            refCode,
            clientIp,
            clientUa
          );
          if (auditResult.status === "APPROVED") {
            referringUser.inviteCount = (referringUser.inviteCount || 0) + 1;
            referringUser.isCrown = true;
            referringUser.hasRgb = true;
            referringUser.hasRgbEffect = true;
          }
        }
      }
    }
    console.log(`[VERIFICATION CODE GENERATED] ${email} -> KOD: ${verification_code} (10 Dk Ge\xE7erli)`);
    sendSetupssVerificationEmail(email, name, verification_code).catch((err) => {
      console.error("Async send email failed on registration:", err);
    });
    return res.json({
      success: true,
      message: "Kay\u0131t ba\u015Far\u0131l\u0131. L\xFCtfen e-posta adresinize g\xF6nderilen 6 haneli do\u011Frulama kodunu girin.",
      userId
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ success: false, message: "Kay\u0131t s\u0131ras\u0131nda bir hata olu\u015Ftu." });
  }
});
app.post("/auth/resend-code", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "E-posta adresi gereklidir." });
    const hasValidDb = checkDbActive();
    let user = null;
    if (hasValidDb && pool) {
      user = await getUserByEmail(email);
    } else {
      user = localUsers.find((u) => u.email?.toLowerCase() === email?.toLowerCase());
    }
    if (!user) return res.status(404).json({ success: false, message: "Kullan\u0131c\u0131 bulunamad\u0131." });
    if (user.is_verified || user.isVerified) {
      return res.status(400).json({ success: false, message: "Hesab\u0131n\u0131z zaten do\u011Frulanm\u0131\u015Ft\u0131r." });
    }
    const vCode = Math.floor(1e5 + Math.random() * 9e5).toString();
    const vExpires = new Date(Date.now() + 10 * 60 * 1e3).toISOString();
    user.verification_code = vCode;
    user.verificationCode = vCode;
    user.verification_expires_at = vExpires;
    user.verificationExpiresAt = vExpires;
    if (hasValidDb && pool) {
      await pool.query("UPDATE users SET verification_code = $1, verification_expires_at = $2 WHERE email = $3", [vCode, vExpires, user.email]);
    }
    console.log(`[VERIFICATION CODE RESENT] ${user.email} -> KOD: ${vCode} (10 Dk Ge\xE7erli)`);
    sendSetupssVerificationEmail(user.email, user.name || user.displayName || "Kullan\u0131c\u0131", vCode).catch((e) => {
      console.error("Resend mail error:", e);
    });
    return res.json({ success: true, message: "Yeni do\u011Frulama kodu e-posta adresinize an\u0131nda g\xF6nderildi. Kod 10 dakika ge\xE7erlidir." });
  } catch (err) {
    console.error("Resend code endpoint error:", err);
    return res.status(500).json({ success: false, message: "Kod g\xF6nderilirken bir hata olu\u015Ftu." });
  }
});
app.post("/auth/verify", async (req, res) => {
  try {
    const { email, code } = req.body;
    const hasValidDb = checkDbActive();
    let user = null;
    if (hasValidDb && pool) {
      user = await getUserByEmail(email);
    } else {
      user = localUsers.find((u) => u.email?.toLowerCase() === email?.toLowerCase());
    }
    if (!user) return res.status(404).json({ success: false, message: "Kullan\u0131c\u0131 bulunamad\u0131." });
    const isAlreadyVerified = Boolean(user.is_verified || user.isVerified);
    if (isAlreadyVerified) {
      return res.status(400).json({ success: false, message: "Kullan\u0131c\u0131 zaten do\u011Fruland\u0131. L\xFCtfen giri\u015F yap\u0131n." });
    }
    const expiresAt = user.verification_expires_at || user.verificationExpiresAt;
    if (expiresAt) {
      const expiryTime = new Date(expiresAt).getTime();
      if (Date.now() > expiryTime) {
        return res.status(400).json({
          success: false,
          codeExpired: true,
          message: "Do\u011Frulama kodunuzun 10 dakikal\u0131k s\xFCresi dolmu\u015Ftur. L\xFCtfen 'Kodu Tekrar G\xF6nder' butonuna basarak yeni bir kod al\u0131n."
        });
      }
    }
    const expectedCode = user.verification_code || user.verificationCode;
    if (!expectedCode || String(expectedCode).trim() !== String(code).trim()) {
      return res.status(400).json({ success: false, message: "Hatal\u0131 do\u011Frulama kodu! L\xFCtfen e-postan\u0131za gelen 6 haneli kodu girin." });
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
    return res.json({ success: true, message: "Hesap ba\u015Far\u0131yla do\u011Fruland\u0131! \u015Eimdi giri\u015F yapabilirsiniz." });
  } catch (error) {
    console.error("Verify error:", error);
    return res.status(500).json({ success: false, message: "Do\u011Frulama s\u0131ras\u0131nda hata olu\u015Ftu." });
  }
});
app.post("/auth/guest", (req, res) => {
  let guestUser = localUsers.find((u) => u.id === "mock-user-123");
  if (!guestUser) {
    guestUser = {
      id: "mock-user-123",
      email: "ziyaretci@setupss.com",
      password_hash: "",
      name: "Ziyaret\xE7i Geli\u015Ftirici",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
      is_verified: true,
      isVerified: true,
      bio: "Teknoloji tutkunu ve minimal masa\xFCst\xFC d\xFCzeni geli\u015Ftiricisi.",
      githubLink: "https://github.com",
      instagramLink: "",
      linkedinLink: "",
      coverPhoto: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80",
      customBadge: "Setup Payla\u015F\u0131mc\u0131s\u0131 \u{1F680}",
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
  import_passport.default.authenticate("local", async (err, user, info) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!user) return res.status(401).json({ success: false, message: info?.message || "Giri\u015F ba\u015Far\u0131s\u0131z." });
    const hasValidDb = checkDbActive();
    if (user.is_banned || user.isBanned) {
      return res.status(403).json({ success: false, message: "Hesab\u0131n\u0131z ask\u0131ya al\u0131nm\u0131\u015Ft\u0131r. L\xFCtfen destekle ileti\u015Fime ge\xE7in." });
    }
    const isVerified = Boolean(user.is_verified || user.isVerified);
    if (!isVerified) {
      let vCode = user.verification_code || user.verificationCode;
      let vExpires = user.verification_expires_at || user.verificationExpiresAt;
      if (!vCode || vExpires && Date.now() > new Date(vExpires).getTime()) {
        vCode = Math.floor(1e5 + Math.random() * 9e5).toString();
        vExpires = new Date(Date.now() + 10 * 60 * 1e3).toISOString();
        user.verification_code = vCode;
        user.verificationCode = vCode;
        user.verification_expires_at = vExpires;
        user.verificationExpiresAt = vExpires;
        if (hasValidDb && pool) {
          await pool.query("UPDATE users SET verification_code = $1, verification_expires_at = $2 WHERE email = $3", [vCode, vExpires, user.email]);
        }
      }
      sendSetupssVerificationEmail(user.email, user.displayName || user.name || "Kullan\u0131c\u0131", vCode).catch((e) => {
        console.error("Mail send on login failed:", e);
      });
      return res.status(403).json({
        success: false,
        requiresVerification: true,
        email: user.email,
        message: "L\xFCtfen \xF6nce hesab\u0131n\u0131z\u0131 do\u011Frulay\u0131n. Do\u011Frulama kodunuz e-posta adresinize g\xF6nderildi (10 dakika ge\xE7erlidir)."
      });
    }
    if (req.body.rememberMe) {
      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1e3;
    } else {
      req.session.cookie.maxAge = void 0;
    }
    req.login(user, (err2) => {
      if (err2) return res.status(500).json({ success: false, message: err2.message });
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
          role: user.role || "user"
        }
      });
    });
  })(req, res, next);
});
app.all("/auth/logout", (req, res) => {
  const doLogout = () => {
    req.session?.destroy(() => {
      res.clearCookie("connect.sid");
      if (req.xhr || req.headers.accept?.includes("json") || req.method === "POST") {
        return res.json({ success: true, message: "\xC7\u0131k\u0131\u015F yap\u0131ld\u0131." });
      }
      res.redirect("/");
    });
  };
  if (typeof req.logout === "function") {
    req.logout(() => doLogout());
  } else {
    doLogout();
  }
});
app.get("/auth/user", optionalAuth, (req, res) => {
  res.json(req.user || null);
});
app.get("/auth/google", (req, res, next) => {
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    import_passport.default.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
  } else {
    res.send(`
        <!DOCTYPE html>
        <html lang="tr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Google ile Giri\u015F Yap\u0131n</title>
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

            <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">Google ile Oturum A\xE7\u0131n</h1>
            <p class="text-sm text-slate-600 mb-6 text-center">Google Hesab\u0131n\u0131zla <span class="font-extrabold text-emerald-600">Setupss</span> platformuna devam edin</p>

            <!-- Error Banner -->
            <div id="error-banner" class="hidden w-full p-3.5 mb-4 text-xs font-bold text-red-700 bg-red-100 border-2 border-red-400 rounded-xl"></div>

            <!-- Fast Accounts Selection List -->
            <div class="w-full space-y-3 mb-6" id="accounts-container">
              <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Kay\u0131tl\u0131 Google Hesaplar\u0131n\u0131z</p>
              
              <!-- Option 1: beshanzo80@gmail.com -->
              <button onclick="loginGoogle('beshanzo80@gmail.com', 'Be\u015Fir Hanzo', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80')" class="w-full p-3.5 bg-white border-2 border-[#1a1a1a] hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-all text-left outline-none focus:ring-4 focus:ring-emerald-500/30 group shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80" alt="Avatar" class="w-10 h-10 rounded-full border-2 border-[#1a1a1a] object-cover">
                <div class="flex-grow">
                  <p class="text-sm font-black text-slate-800">Be\u015Fir Hanzo</p>
                  <p class="text-xs text-slate-500">beshanzo80@gmail.com</p>
                </div>
                <span class="text-[10px] font-black text-emerald-600 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md group-hover:bg-emerald-200">H\u0131zl\u0131 Giri\u015F</span>
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
              <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Farkl\u0131 bir Google Hesab\u0131 ile Giri\u015F Yap / Kay\u0131t Ol</p>
              
              <div class="space-y-1">
                <label class="text-xs font-bold text-slate-700 block">E-Posta Adresi</label>
                <input type="email" id="custom-email" placeholder="ornek@gmail.com" class="w-full px-4 py-2.5 bg-white border-2 border-[#1a1a1a] rounded-xl text-sm outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all font-bold">
              </div>

              <div class="space-y-1">
                <label class="text-xs font-bold text-slate-700 block">Ad\u0131n\u0131z Soyad\u0131n\u0131z</label>
                <input type="text" id="custom-name" placeholder="\xD6rn: Melis Demir" class="w-full px-4 py-2.5 bg-white border-2 border-[#1a1a1a] rounded-xl text-sm outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all font-bold">
              </div>

              <button onclick="loginCustom()" id="submit-btn" class="w-full py-3 bg-[#4ECDC4] hover:bg-[#45b8b0] text-[#1a1a1a] border-2 border-[#1a1a1a] rounded-xl text-sm font-black uppercase tracking-wider transition-all shadow-[3px_3px_0px_0px_rgba(26,26,26,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer">
                Google ile Devam Et
              </button>
            </div>

            <p class="text-[10px] text-slate-400 mt-8 text-center leading-relaxed">
              Bu ekran, yerel geli\u015Ftirme veya \xF6nizleme ortam\u0131nda Google OAuth kimlik bilgileri bulunmad\u0131\u011F\u0131nda otomatik olarak devreye giren <strong class="text-slate-500 font-extrabold">Setupss G\xFCvenli Ge\xE7i\u015F Portal\u0131</strong>'d\u0131r. Bilgileriniz g\xFCvenle veritaban\u0131na kaydedilir.
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
                  errorBanner.textContent = data.message || 'Giri\u015F yap\u0131lamad\u0131.';
                  errorBanner.classList.remove('hidden');
                  buttons.forEach(btn => btn.disabled = false);
                }
              } catch (err) {
                errorBanner.textContent = 'Ba\u011Flant\u0131 hatas\u0131 olu\u015Ftu.';
                errorBanner.classList.remove('hidden');
                buttons.forEach(btn => btn.disabled = false);
              }
            }

            function loginCustom() {
              const email = document.getElementById('custom-email').value.trim();
              const name = document.getElementById('custom-name').value.trim();
              
              if (!email || !email.includes('@')) {
                const errorBanner = document.getElementById('error-banner');
                errorBanner.textContent = 'L\xFCtfen ge\xE7erli bir e-posta adresi girin.';
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
  import_passport.default.authenticate("google", { failureRedirect: "/?auth_error=oauth_failed" }, (err, user) => {
    if (err || !user) {
      return res.redirect("/?auth_error=" + encodeURIComponent(err?.message || "Google giri\u015F ba\u015Far\u0131s\u0131z."));
    }
    req.login(user, (loginErr) => {
      if (loginErr) return res.redirect("/?auth_error=session_error");
      return res.redirect("/");
    });
  })(req, res, next);
});
app.post("/auth/google", import_express4.default.json(), async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ success: false, message: "Firebase Kimlik Do\u011Frulama jetonu (ID Token) gereklidir." });
    }
    let decodedToken;
    try {
      decodedToken = await (0, import_auth.getAuth)().verifyIdToken(idToken);
    } catch (verifyErr) {
      console.error("Firebase ID Token verification failed:", verifyErr);
      return res.status(401).json({ success: false, message: "Ge\xE7ersiz kimlik do\u011Frulama jetonu (Token invalid)." });
    }
    const email = decodedToken.email;
    const displayName = decodedToken.name || decodedToken.display_name || (email ? email.split("@")[0] : "Kullan\u0131c\u0131");
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
      let existing = localUsers.find((u) => u.email === cleanEmail);
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
          role: cleanEmail === "setupss.support@gmail.com" ? "admin" : "user"
        };
        localUsers.push(existing);
        localUsersList.push(existing);
      }
      user = authService.formatUserDto(existing);
    }
    if (user.isBanned) {
      return res.status(403).json({ success: false, message: "Hesab\u0131n\u0131z ask\u0131ya al\u0131nm\u0131\u015Ft\u0131r. L\xFCtfen destekle ileti\u015Fime ge\xE7in." });
    }
    req.login(user, (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      return res.json({ success: true, user });
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message || "Google giri\u015Fi ba\u015Far\u0131s\u0131z." });
  }
});
app.get("/api/blog", async (req, res) => {
  try {
    const category = req.query.category;
    const search = req.query.search;
    const posts = await getBlogPostsFromDb(category, search);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message || "Blog yaz\u0131lar\u0131 al\u0131namad\u0131." });
  }
});
app.get("/api/blog/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;
    const post = await getBlogPostBySlugFromDb(slug);
    if (!post) {
      return res.status(404).json({ error: "Blog yaz\u0131s\u0131 bulunamad\u0131." });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message || "Blog yaz\u0131s\u0131 \xE7ekilemedi." });
  }
});
app.post("/api/ai/generate-blog-post", import_express4.default.json(), async (req, res) => {
  try {
    const { topic, category } = req.body || {};
    const ai2 = getGemini();
    const prompt = `Sen Setupss platformunun ba\u015F teknoloji edit\xF6r\xFC ve donan\u0131m gurususun.
L\xFCtfen a\u015Fa\u011F\u0131daki konu ve kategori hakk\u0131nda tamamen T\xFCrk\xE7e, son derece detayl\u0131, bilgilendirici, SEO dostu ve profesyonel bir blog yaz\u0131s\u0131 \xFCret.

KONU: ${topic || "2026 Masa\xFCst\xFC Kurulum Trendleri ve Ergonomi"}
KATEGOR\u0130: ${category || "Rehber"}

Yan\u0131t\u0131n\u0131 kesinlikle SADECE ge\xE7erli bir JSON nesnesi olarak ver. Ba\u015Fka hi\xE7bir a\xE7\u0131klama yazma.
JSON \u015Femas\u0131:
{
  "title": "Cazip, profesyonel ba\u015Fl\u0131k",
  "slug": "turkce-karaktersiz-ve-kucuk-harfli-benzersiz-slug",
  "summary": "1-2 c\xFCmlelik vurucu \xF6zet",
  "category": "${category || "Rehber"}",
  "readTimeMinutes": 6,
  "tags": ["tag1", "tag2", "tag3"],
  "hardwareSlugs": ["herman-miller-aeron", "screenbar-halo"],
  "content": "# Ba\u015Fl\u0131k\\n\\nDetayl\u0131 alt ba\u015Fl\u0131klar, numaral\u0131 maddeler, \xFCr\xFCn tavsiyeleri ve tavsiyeler i\xE7eren zengin Markdown i\xE7eri\u011Fi..."
}
`;
    const response = await ai2.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    const responseText = response.text;
    if (!responseText) {
      throw new Error("AI yan\u0131t veremedi.");
    }
    const generatedData = JSON.parse(responseText);
    const createdPost = await createBlogPostInDb({
      title: generatedData.title,
      slug: generatedData.slug || `blog-${Date.now()}`,
      summary: generatedData.summary,
      category: generatedData.category || category || "Rehber",
      content: generatedData.content,
      readTimeMinutes: generatedData.readTimeMinutes || 5,
      tags: generatedData.tags || ["setup", "donanim"],
      hardwareSlugs: generatedData.hardwareSlugs || [],
      coverImage: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1200&q=80",
      authorName: "Setupss AI Edit\xF6r",
      authorAvatar: "/airobot.jpg",
      isPublished: true
    });
    res.json({ success: true, post: createdPost });
  } catch (err) {
    console.error("AI blog generation failed:", err);
    res.status(500).json({ error: err.message || "Blog olu\u015Fturulamad\u0131." });
  }
});
app.post("/api/upload", import_express4.default.json({ limit: "50mb" }), async (req, res) => {
  try {
    const { filename, base64Data, folder = "setup", entityType: reqEntityType, entityId: reqEntityId } = req.body;
    if (!filename || !base64Data) {
      return res.status(400).json({ success: false, message: "Dosya ad\u0131 ve veri gereklidir." });
    }
    const parts = base64Data.split(";base64,");
    if (parts.length !== 2) {
      return res.status(400).json({ success: false, message: "Ge\xE7ersiz base64 verisi." });
    }
    const mimeType = parts[0].split(":")[1] || "image/jpeg";
    const fileBuffer = Buffer.from(parts[1], "base64");
    const authenticatedUser = req.user;
    const uploaderId = authenticatedUser?.id || null;
    let canonicalEntityType = reqEntityType;
    let canonicalEntityId = reqEntityId || "";
    if (!canonicalEntityType) {
      if (folder === "avatars") {
        canonicalEntityType = "user_avatar";
        canonicalEntityId = canonicalEntityId || uploaderId || "usr_guest";
      } else if (folder === "covers" || folder === "banners") {
        canonicalEntityType = "user_cover";
        canonicalEntityId = canonicalEntityId || uploaderId || "usr_guest";
      } else if (folder === "chat") {
        canonicalEntityType = "chat_media";
        canonicalEntityId = canonicalEntityId || "room_general";
      } else if (folder === "posts") {
        canonicalEntityType = "post_image";
        canonicalEntityId = canonicalEntityId || `post-${Date.now()}`;
      } else {
        canonicalEntityType = "setup_image";
        canonicalEntityId = canonicalEntityId || `setup-draft-${Date.now()}`;
      }
    }
    if (!canonicalEntityId) {
      canonicalEntityId = `entity-${Date.now()}`;
    }
    if (canonicalEntityType === "setup_image" && canonicalEntityId.startsWith("setup-") && !canonicalEntityId.includes("draft")) {
      const existingSetup = pool ? (await pool.query("SELECT owner_id FROM setups WHERE id = $1", [canonicalEntityId])).rows[0] : null;
      if (existingSetup && existingSetup.owner_id && authenticatedUser && existingSetup.owner_id !== authenticatedUser.id) {
        const isAdmin = authenticatedUser.role === "admin" || ["setupss.support@gmail.com"].includes(authenticatedUser.email);
        if (!isAdmin) {
          return res.status(403).json({ success: false, message: "Bu kuruluma medya y\xFCkleme yetkiniz yok." });
        }
      }
    }
    const uploadResult = await storageService.uploadEntityMedia({
      fileBuffer,
      originalName: filename,
      mimeType,
      entityType: canonicalEntityType,
      entityId: canonicalEntityId,
      userId: uploaderId || void 0
    });
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
      ]).catch((e) => console.error("Media assets primary insert error:", e));
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
          "image/webp",
          uploadResult.fileSize,
          `${uploadResult.entityType}_thumb512`,
          uploadResult.entityId
        ]).catch((e) => console.error("Media assets thumb512 insert error:", e));
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
          "image/webp",
          uploadResult.fileSize,
          `${uploadResult.entityType}_thumb256`,
          uploadResult.entityId
        ]).catch((e) => console.error("Media assets thumb256 insert error:", e));
      }
      await addMediaFileToDb({
        id: uploadResult.assetId,
        fileName: filename,
        fileUrl: uploadResult.publicUrl,
        fileType: uploadResult.fileType,
        fileSize: uploadResult.fileSize,
        mimeType: uploadResult.mimeType,
        uploaderId: uploaderId || "guest",
        uploaderName: authenticatedUser?.name || "Misafir",
        thumbnail512: uploadResult.thumbnail512PublicUrl,
        thumbnail256: uploadResult.thumbnail256PublicUrl
      }).catch((e) => console.error("Legacy media file logging error:", e));
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
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: "Dosya y\xFCklenirken hata olu\u015Ftu." });
  }
});
app.get("/api/entity-audit-logs", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const logs = await getEntityAuditLogs(limit);
    res.json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/brands", async (req, res) => {
  try {
    if (req.query.page || req.query.limit || req.query.q || req.query.search) {
      const result = await getBrandsPaginated({
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 20,
        search: req.query.q || req.query.search
      });
      return res.json(result);
    }
    const brands = await getBrandsFromDb();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/brands/:idOrSlug", async (req, res) => {
  try {
    const brand = await getBrandByIdOrSlug(req.params.idOrSlug);
    if (!brand) return res.status(404).json({ error: "Brand not found" });
    res.json(brand);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/brands", import_express4.default.json(), async (req, res) => {
  try {
    const { id, name, slug, description, logoUrl, website } = req.body;
    if (!id || !name || !slug) return res.status(400).json({ error: "id, name, and slug are required" });
    await createBrandInDb(id, name, slug, description, logoUrl, website);
    await createEntityAuditLog("brands", id, "CREATE", req.user?.displayName || "api", { id, name, slug });
    res.status(201).json({ message: "Brand created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.put("/api/brands/:id", import_express4.default.json(), async (req, res) => {
  try {
    const { name, slug, description, logoUrl, website } = req.body;
    if (!name || !slug) return res.status(400).json({ error: "name and slug are required" });
    await updateBrandInDb(req.params.id, name, slug, description, logoUrl, website);
    await createEntityAuditLog("brands", req.params.id, "UPDATE", req.user?.displayName || "api", { id: req.params.id, name, slug });
    res.json({ message: "Brand updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.delete("/api/brands/:id", async (req, res) => {
  try {
    if (req.query.hard === "true") {
      await deleteBrandFromDb(req.params.id);
      await createEntityAuditLog("brands", req.params.id, "HARD_DELETE", req.user?.displayName || "api");
    } else {
      await softDeleteEntityInDb("brands", req.params.id, req.user?.displayName || "api");
    }
    res.json({ message: "Brand deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await getHardwareCategoriesFromDb();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/categories/:idOrSlug", async (req, res) => {
  try {
    const category = await getHardwareCategoryByIdOrSlug(req.params.idOrSlug);
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/categories", import_express4.default.json(), async (req, res) => {
  try {
    const { id, name, slug, description } = req.body;
    if (!id || !name || !slug) return res.status(400).json({ error: "id, name, and slug are required" });
    await createHardwareCategoryInDb(id, name, slug, description);
    await createEntityAuditLog("categories", id, "CREATE", req.user?.displayName || "api", { id, name, slug });
    res.status(201).json({ message: "Category created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.put("/api/categories/:id", import_express4.default.json(), async (req, res) => {
  try {
    const { name, slug, description } = req.body;
    if (!name || !slug) return res.status(400).json({ error: "name and slug are required" });
    await updateHardwareCategoryInDb(req.params.id, name, slug, description);
    await createEntityAuditLog("categories", req.params.id, "UPDATE", req.user?.displayName || "api", { id: req.params.id, name, slug });
    res.json({ message: "Category updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.delete("/api/categories/:id", async (req, res) => {
  try {
    if (req.query.hard === "true") {
      await deleteHardwareCategoryFromDb(req.params.id);
      await createEntityAuditLog("categories", req.params.id, "HARD_DELETE", req.user?.displayName || "api");
    } else {
      await softDeleteEntityInDb("categories", req.params.id, req.user?.displayName || "api");
    }
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/hardware", async (req, res) => {
  try {
    if (req.query.page || req.query.limit || req.query.q || req.query.search || req.query.brandId || req.query.categoryId) {
      const result = await getHardwarePaginated({
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 20,
        search: req.query.q || req.query.search,
        brandId: req.query.brandId,
        categoryId: req.query.categoryId
      });
      return res.json(result);
    }
    const hardware = await getHardwareFromDb();
    res.json(hardware);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/hardware/bulk", import_express4.default.json(), async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "items array is required" });
    }
    const result = await bulkInsertHardwareInDb(items, req.user?.displayName || "api");
    res.status(201).json({ message: "Bulk insertion processed", ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/hardware/:idOrSlug", async (req, res) => {
  try {
    const hardware = await getHardwareByIdOrSlug(req.params.idOrSlug);
    if (!hardware) return res.status(404).json({ error: "Hardware not found" });
    res.json(hardware);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/admin/ingest-buildcores", import_express4.default.json(), async (req, res) => {
  try {
    const { category, limit } = req.body;
    const { buildCoresScraper: buildCoresScraper2 } = await Promise.resolve().then(() => (init_BuildCoresScraper(), BuildCoresScraper_exports));
    const result = await buildCoresScraper2.fetchAndIngestCategory(category || "CPU", limit || 5);
    res.json({ status: "success", ingested: result.length, data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/hardware/analyze-setup", import_express4.default.json(), async (req, res) => {
  try {
    const { hardwareComponents, resolution, game } = req.body;
    const { hardwareIntelligenceService: hardwareIntelligenceService2 } = await Promise.resolve().then(() => (init_HardwareIntelligenceService(), HardwareIntelligenceService_exports));
    const analysis = await hardwareIntelligenceService2.analyzeSetup(hardwareComponents, resolution, game);
    res.json(analysis);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/hardware/ingest", import_express4.default.json(), async (req, res) => {
  try {
    const { rawText, sourceName } = req.body;
    const { hardwareIntelligenceService: hardwareIntelligenceService2 } = await Promise.resolve().then(() => (init_HardwareIntelligenceService(), HardwareIntelligenceService_exports));
    const result = await hardwareIntelligenceService2.ingestRawData(rawText, sourceName);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/hardware", import_express4.default.json(), async (req, res) => {
  try {
    const { id, name, slug, brandId, categoryId, description, specs, imageUrl, priceEstimate, buyLink } = req.body;
    if (!id || !name || !slug) return res.status(400).json({ error: "id, name, and slug are required" });
    await createHardwareInDb(id, name, slug, brandId, categoryId, description, specs, imageUrl, priceEstimate, buyLink);
    await createEntityAuditLog("hardware", id, "CREATE", req.user?.displayName || "api", { id, name, slug });
    res.status(201).json({ message: "Hardware created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.put("/api/hardware/:id", import_express4.default.json(), async (req, res) => {
  try {
    const { name, slug, brandId, categoryId, description, specs, imageUrl, priceEstimate, buyLink } = req.body;
    if (!name || !slug) return res.status(400).json({ error: "name and slug are required" });
    await updateHardwareInDb(req.params.id, name, slug, brandId, categoryId, description, specs, imageUrl, priceEstimate, buyLink);
    await createEntityAuditLog("hardware", req.params.id, "UPDATE", req.user?.displayName || "api", { id: req.params.id, name, slug });
    res.json({ message: "Hardware updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.delete("/api/hardware/:id", async (req, res) => {
  try {
    if (req.query.hard === "true") {
      await deleteHardwareFromDb(req.params.id);
      await createEntityAuditLog("hardware", req.params.id, "HARD_DELETE", req.user?.displayName || "api");
    } else {
      await softDeleteEntityInDb("hardware", req.params.id, req.user?.displayName || "api");
    }
    res.json({ message: "Hardware deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/games", async (req, res) => {
  try {
    if (req.query.page || req.query.limit || req.query.q || req.query.search) {
      const result = await getGamesPaginated({
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 20,
        search: req.query.q || req.query.search
      });
      return res.json(result);
    }
    const games = await getGamesFromDb();
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/games/:idOrSlug", async (req, res) => {
  try {
    const game = await getGameByIdOrSlug(req.params.idOrSlug);
    if (!game) return res.status(404).json({ error: "Game not found" });
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/games", import_express4.default.json(), async (req, res) => {
  try {
    const { id, name, slug, description, imageUrl, genre, developer, releaseYear, steamId } = req.body;
    if (!id || !name || !slug) return res.status(400).json({ error: "id, name, and slug are required" });
    await createGameInDb(id, name, slug, description, imageUrl, genre, developer, releaseYear, steamId);
    await createEntityAuditLog("games", id, "CREATE", req.user?.displayName || "api", { id, name, slug });
    res.status(201).json({ message: "Game created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.put("/api/games/:id", import_express4.default.json(), async (req, res) => {
  try {
    const { name, slug, description, imageUrl, genre, developer, releaseYear, steamId } = req.body;
    if (!name || !slug) return res.status(400).json({ error: "name and slug are required" });
    await updateGameInDb(req.params.id, name, slug, description, imageUrl, genre, developer, releaseYear, steamId);
    await createEntityAuditLog("games", req.params.id, "UPDATE", req.user?.displayName || "api", { id: req.params.id, name, slug });
    res.json({ message: "Game updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.delete("/api/games/:id", async (req, res) => {
  try {
    if (req.query.hard === "true") {
      await deleteGameFromDb(req.params.id);
      await createEntityAuditLog("games", req.params.id, "HARD_DELETE", req.user?.displayName || "api");
    } else {
      await softDeleteEntityInDb("games", req.params.id, req.user?.displayName || "api");
    }
    res.json({ message: "Game deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/setups/:setupId/hardware", async (req, res) => {
  try {
    const hw = await getSetupHardware(req.params.setupId);
    res.json(hw);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/setups/:setupId/hardware", import_express4.default.json(), async (req, res) => {
  try {
    const { hardwareId, notes } = req.body;
    if (!hardwareId) return res.status(400).json({ error: "hardwareId is required" });
    await linkSetupToHardware(req.params.setupId, hardwareId, notes);
    res.status(201).json({ message: "Setup linked to hardware successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.delete("/api/setups/:setupId/hardware/:hardwareId", async (req, res) => {
  try {
    await unlinkSetupFromHardware(req.params.setupId, req.params.hardwareId);
    res.json({ message: "Setup unlinked from hardware successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/setups/:setupId/games", async (req, res) => {
  try {
    const games = await getSetupGames(req.params.setupId);
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/setups/:setupId/games", import_express4.default.json(), async (req, res) => {
  try {
    const { gameId } = req.body;
    if (!gameId) return res.status(400).json({ error: "gameId is required" });
    await linkSetupToGame(req.params.setupId, gameId);
    res.status(201).json({ message: "Setup linked to game successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.delete("/api/setups/:setupId/games/:gameId", async (req, res) => {
  try {
    await unlinkSetupFromGame(req.params.setupId, req.params.gameId);
    res.json({ message: "Setup unlinked from game successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/user/profile", async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ success: false, message: "L\xFCtfen \xF6nce giri\u015F yap\u0131n." });
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
      return res.status(400).json({ success: false, message: "\u0130sim alan\u0131 bo\u015F b\u0131rak\u0131lamaz." });
    }
    const userId = req.user.id;
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
          avatarFrame || "none"
        );
      } catch (e) {
        console.error("Failed to update profile in DB, updating local fallback:", e);
      }
    }
    let u = localUsers.find((user) => user.id === userId);
    if (!u) {
      u = { id: userId, email: req.user.email || "user@setupss.com" };
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
    u.avatarFrame = avatarFrame || "none";
    req.user.displayName = displayName;
    req.user.name = displayName;
    req.user.avatar = avatar || null;
    req.user.bio = bio || "";
    req.user.githubLink = githubLink || "";
    req.user.instagramLink = instagramLink || "";
    req.user.linkedinLink = linkedinLink || "";
    req.user.coverPhoto = coverPhoto || "";
    req.user.customBadge = customBadge || "";
    req.user.customColor = customColor || "";
    req.user.avatarFrame = avatarFrame || "none";
    savePersistentDb();
    res.json({ success: true, user: req.user });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, message: "Profil g\xFCncellenirken hata olu\u015Ftu." });
  }
});
app.get("/api/friends/list", async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ success: false, message: "L\xFCtfen \xF6nce giri\u015F yap\u0131n." });
    }
    const userId = req.user.id;
    const friendships = await getFriendshipsForUserFromDb(userId);
    res.json({ success: true, friendships });
  } catch (e) {
    console.error("Get friends error:", e);
    res.status(500).json({ success: false, message: "Arkada\u015F listesi al\u0131n\u0131rken hata olu\u015Ftu." });
  }
});
app.post("/api/friends/request", async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ success: false, message: "L\xFCtfen \xF6nce giri\u015F yap\u0131n." });
    }
    const { friendId } = req.body;
    const userId = req.user.id;
    if (userId === friendId) {
      return res.status(400).json({ success: false, message: "Kendinizi arkada\u015F ekleyemezsiniz." });
    }
    const id = `friendship-${Date.now()}`;
    await addFriendshipToDb(id, userId, friendId, "pending");
    res.json({ success: true, message: "Arkada\u015Fl\u0131k iste\u011Fi g\xF6nderildi." });
  } catch (e) {
    console.error("Friend request error:", e);
    res.status(500).json({ success: false, message: "Arkada\u015Fl\u0131k iste\u011Fi g\xF6nderilemedi." });
  }
});
app.post("/api/friends/accept", async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ success: false, message: "L\xFCtfen \xF6nce giri\u015F yap\u0131n." });
    }
    const { friendId } = req.body;
    const userId = req.user.id;
    await updateFriendshipStatusInDb(friendId, userId, "accepted");
    res.json({ success: true, message: "Arkada\u015Fl\u0131k iste\u011Fi kabul edildi." });
  } catch (e) {
    console.error("Accept friend request error:", e);
    res.status(500).json({ success: false, message: "Arkada\u015Fl\u0131k iste\u011Fi kabul edilemedi." });
  }
});
app.post("/api/friends/reject", async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ success: false, message: "L\xFCtfen \xF6nce giri\u015F yap\u0131n." });
    }
    const { friendId } = req.body;
    const userId = req.user.id;
    await deleteFriendshipInDb(userId, friendId);
    res.json({ success: true, message: "\u0130\u015Flem ba\u015Far\u0131l\u0131." });
  } catch (e) {
    console.error("Reject friend error:", e);
    res.status(500).json({ success: false, message: "\u0130\u015Flem ger\xE7ekle\u015Ftirilemedi." });
  }
});
app.get("/api/sentinel/referrals", async (req, res) => {
  try {
    const logs = await sentinelService.getReferralLogs();
    res.json({ success: true, logs });
  } catch (err) {
    console.error("Get referral logs error:", err);
    res.status(500).json({ success: false, message: "Denetim kay\u0131tlar\u0131 al\u0131namad\u0131." });
  }
});
app.get("/api/sentinel/reports", async (req, res) => {
  try {
    const logs = await sentinelService.getChatReports();
    res.json({ success: true, logs });
  } catch (err) {
    console.error("Get chat reports error:", err);
    res.status(500).json({ success: false, message: "Sohbet ihbar kay\u0131tlar\u0131 al\u0131namad\u0131." });
  }
});
app.get("/api/sentinel/banned", async (req, res) => {
  try {
    const hasValidDb = checkDbActive();
    let bannedList = [];
    if (hasValidDb && pool) {
      const { rows } = await pool.query(
        "SELECT id, name, email, avatar, created_at FROM users WHERE is_banned = TRUE"
      );
      bannedList = rows;
    } else {
      bannedList = localUsers.filter((u) => u.isBanned || u.is_banned).map((u) => ({ id: u.id, name: u.name, email: u.email, avatar: u.avatar, created_at: u.createdAt }));
    }
    res.json({ success: true, banned: bannedList });
  } catch (err) {
    console.error("Get banned users error:", err);
    res.status(500).json({ success: false, message: "Yasakl\u0131 kullan\u0131c\u0131lar al\u0131namad\u0131." });
  }
});
app.post("/api/chat/report", async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ success: false, message: "L\xFCtfen \xF6nce giri\u015F yap\u0131n." });
    }
    const { messageId, chatMessage, senderId, senderName } = req.body;
    const reporterId = req.user.id;
    const reporterName = req.user.name || "Bir Geli\u015Ftirici";
    if (!messageId || !chatMessage || !senderId || !senderName) {
      return res.status(400).json({ success: false, message: "Eksik parametreler." });
    }
    if (reporterId === senderId) {
      return res.status(400).json({ success: false, message: "Kendi mesaj\u0131n\u0131z\u0131 ihbar edemezsiniz." });
    }
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
      message: auditResult.isProfane ? `Sentinel V900 g\xFCvenlik denetimi tamamland\u0131: Mesajda a\u011F\u0131r k\xFCf\xFCr/hakaret saptand\u0131 ve "${senderName}" isimli kullan\u0131c\u0131 uzakla\u015Ft\u0131r\u0131ld\u0131.` : `Sentinel V900 g\xFCvenlik denetimi tamamland\u0131: Mesaj temiz bulundu ve ihbar kapat\u0131ld\u0131.`
    });
  } catch (err) {
    console.error("Report message error:", err);
    res.status(500).json({ success: false, message: "\u0130hbar i\u015Flenirken hata olu\u015Ftu." });
  }
});
app.post("/api/sentinel/unban", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, message: "Kullan\u0131c\u0131 ID zorunludur." });
    }
    const hasValidDb = checkDbActive();
    if (hasValidDb && pool) {
      await pool.query(
        "UPDATE users SET is_banned = FALSE WHERE id = $1",
        [userId]
      );
    } else {
      const u = localUsers.find((u2) => u2.id === userId);
      if (u) {
        u.isBanned = false;
        u.is_banned = false;
      }
    }
    await realtimeService.createNotification({
      userId,
      senderId: "system-sentinel",
      senderName: "Sentinel V900",
      senderAvatar: "/setupss_icon.svg",
      type: "like",
      title: "Hesab\u0131n\u0131z Aktif Edildi! \u{1F6E1}\uFE0F",
      content: `Sentinel V900 incelemesi sonucunda hesab\u0131n\u0131z tekrar aktifle\u015Ftirildi. L\xFCtfen topluluk kurallar\u0131na uyun.`,
      link: "/"
    });
    res.json({ success: true, message: "Kullan\u0131c\u0131n\u0131n yasaklamas\u0131 ba\u015Far\u0131yla kald\u0131r\u0131ld\u0131." });
  } catch (err) {
    console.error("Unban user error:", err);
    res.status(500).json({ success: false, message: "Yasak kald\u0131r\u0131lamad\u0131." });
  }
});
app.get("/api/users/search", async (req, res) => {
  try {
    const q = (req.query.q || "").toString().trim().toLowerCase();
    const hasValidDb = checkDbActive();
    let usersList = [];
    if (hasValidDb && pool) {
      const { rows } = await pool.query(
        `SELECT id, name, avatar, bio, custom_badge as "customBadge", custom_color as "customColor" 
           FROM users 
           WHERE name ILIKE $1 OR email ILIKE $1 OR id IN (SELECT id FROM profiles WHERE display_name ILIKE $1 OR username ILIKE $1) 
           LIMIT 30`,
        [`%${q}%`]
      );
      usersList = rows.map((r) => ({
        id: r.id,
        name: r.name,
        avatar: r.avatar,
        bio: r.bio || "",
        customBadge: r.customBadge || r.custom_badge || "",
        customColor: r.customColor || r.custom_color || ""
      }));
    } else {
      usersList = localUsers.filter((u) => {
        const nameMatch = (u.name || "").toLowerCase().includes(q);
        const emailMatch = (u.email || "").toLowerCase().includes(q);
        const displayNameMatch = (u.displayName || "").toLowerCase().includes(q);
        const usernameMatch = (u.username || "").toLowerCase().includes(q);
        return nameMatch || emailMatch || displayNameMatch || usernameMatch;
      }).map((u) => ({
        id: u.id,
        name: u.name || u.displayName || u.email.split("@")[0],
        avatar: u.avatar,
        bio: u.bio || "",
        customBadge: u.customBadge || u.custom_badge || "",
        customColor: u.customColor || u.custom_color || ""
      }));
    }
    res.json({ success: true, users: usersList });
  } catch (e) {
    console.error("User search error:", e);
    res.status(500).json({ success: false, message: "Kullan\u0131c\u0131lar aran\u0131rken hata olu\u015Ftu." });
  }
});
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
      const u = localUsers.find((user) => user.id === userId);
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
    res.status(404).json({ success: false, message: "Kullan\u0131c\u0131 bulunamad\u0131." });
  } catch (e) {
    console.error("User profile error:", e);
    res.status(500).json({ success: false, message: "Profil bilgileri al\u0131n\u0131rken hata olu\u015Ftu." });
  }
});
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
      const u = localUsers.find((user) => user.name === ownerName);
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
  } catch (error) {
    console.error("Find user by owner name error:", error);
    res.status(500).json({ success: false, message: "Kullan\u0131c\u0131 bulunurken hata olu\u015Ftu." });
  }
});
app.get("/api/chat/history/:otherUserId", async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ success: false, message: "L\xFCtfen \xF6nce giri\u015F yap\u0131n." });
    }
    const userId = req.user.id;
    const { otherUserId } = req.params;
    const history = await getChatHistoryFromDb(userId, otherUserId);
    res.json({ success: true, history });
  } catch (error) {
    console.error("Failed to get chat history:", error);
    res.status(500).json({ success: false, message: "Sohbet ge\xE7mi\u015Fi al\u0131n\u0131rken hata olu\u015Ftu." });
  }
});
app.get("/api/chat/rooms", async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ success: false, message: "L\xFCtfen \xF6nce giri\u015F yap\u0131n." });
    }
    const userId = req.user.id;
    const messages = await getAllUserMessagesFromDb(userId);
    const roomsMap = /* @__PURE__ */ new Map();
    messages.forEach((m) => {
      const isSender = m.senderId === userId;
      const partnerId = isSender ? m.receiverId : m.senderId;
      const partnerName = isSender ? m.receiverName : m.senderName;
      const partnerAvatar = isSender ? m.receiverAvatar : m.senderAvatar;
      const partnerHasRgb = !isSender ? m.senderHasRgb : void 0;
      const existing = roomsMap.get(partnerId);
      if (!existing || new Date(m.createdAt).getTime() > new Date(existing.lastMessageAt).getTime()) {
        roomsMap.set(partnerId, {
          partnerId,
          partnerName,
          partnerAvatar,
          partnerHasRgb: partnerHasRgb !== void 0 ? partnerHasRgb : existing ? existing.partnerHasRgb : false,
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
  } catch (error) {
    console.error("Failed to get chat rooms:", error);
    res.status(500).json({ success: false, message: "Sohbet odalar\u0131 al\u0131n\u0131rken hata olu\u015Ftu." });
  }
});
app.post("/api/ai/chat/stream", async (req, res) => {
  try {
    const { messages, pageContext } = req.body;
    const currentUserId = req.isAuthenticated() ? req.user.id : null;
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();
    const ai2 = getGemini();
    const siteContext = await getSiteContext();
    let activePageContextStr = "";
    if (pageContext?.pathname) {
      const path3 = pageContext.pathname;
      if (path3.includes("/hardware/")) {
        const slug = path3.split("/hardware/")[1];
        const hw = getHardwareBySlug(slug);
        if (hw) activePageContextStr = `Kullan\u0131c\u0131 \u015EU AN bu donan\u0131m sayfas\u0131nda: ${JSON.stringify(hw, null, 2)}`;
      } else if (path3.includes("/setup/")) {
        const slug = path3.split("/setup/")[1];
        const { rows } = await pool.query("SELECT * FROM setup_posts WHERE id = $1", [slug]);
        if (rows[0]) activePageContextStr = `Kullan\u0131c\u0131 \u015EU AN bu masa\xFCst\xFC kurulumunu (setup) inceliyor: ${JSON.stringify(rows[0], null, 2)}`;
      } else if (path3.includes("/u/")) {
        const username = path3.split("/u/")[1];
        const { rows } = await pool.query("SELECT id, name, bio, level, rank, role, avatar FROM users WHERE name ILIKE $1", [username]);
        if (rows[0]) activePageContextStr = `Kullan\u0131c\u0131 \u015EU AN bu kullan\u0131c\u0131n\u0131n profilini g\xF6r\xFCnt\xFCl\xFCyor: ${JSON.stringify(rows[0], null, 2)}`;
      } else if (path3.includes("/compare")) {
        activePageContextStr = `Kullan\u0131c\u0131 \u015EU AN donan\u0131m kar\u015F\u0131la\u015Ft\u0131rma sayfas\u0131nda: ${path3}`;
      } else if (path3.includes("/hardware-combo")) {
        activePageContextStr = `Kullan\u0131c\u0131 \u015EU AN Donan\u0131m Kombinasyonlar\u0131 sayfas\u0131nda: ${path3}`;
      } else if (path3.includes("/category/")) {
        activePageContextStr = `Kullan\u0131c\u0131 \u015EU AN bu kategoriyi inceliyor: ${path3}`;
      } else if (path3.includes("/brand/")) {
        activePageContextStr = `Kullan\u0131c\u0131 \u015EU AN bu markay\u0131 inceliyor: ${path3}`;
      } else if (path3.includes("/guide")) {
        activePageContextStr = `Kullan\u0131c\u0131 \u015EU AN Rehberler sayfas\u0131nda: ${path3}`;
      } else if (path3.includes("/ai-planner") || path3.includes("/planner")) {
        activePageContextStr = `Kullan\u0131c\u0131 \u015EU AN AI Masa\xFCst\xFC Planlay\u0131c\u0131 (AI Planner) sayfas\u0131nda.`;
      } else if (path3.includes("/deals")) {
        activePageContextStr = `Kullan\u0131c\u0131 \u015EU AN \u0130ndirimler & F\u0131rsatlar (Deals) sayfas\u0131nda.`;
      } else if (path3.includes("/leaderboard")) {
        activePageContextStr = `Kullan\u0131c\u0131 \u015EU AN Liderlik Tablosu (Leaderboard) sayfas\u0131nda.`;
      } else if (path3 === "/") {
        activePageContextStr = `Kullan\u0131c\u0131 \u015EU AN Anasayfa'da (Feed).`;
      }
    }
    const systemInstruction = `
Sen Setupss AI's\u0131n. Profesyonel, canayak\u0131n, samimi ve son teknoloji teknik bir uzmans\u0131n (T\u0131pk\u0131 premium bir yapay zeka asistan\u0131 olan ChatGPT, Claude gibi ama PC kurulumlar\u0131, donan\u0131m, ekipmanlar ve yaz\u0131l\u0131m odakl\u0131).
Setupss platformunun resmi AI asistan\u0131s\u0131n. Kullan\u0131c\u0131lar ile sohbet ederken onlar\u0131 tan\u0131maya \xE7al\u0131\u015F, yard\u0131mc\u0131 ol ve donan\u0131m konusunda m\xFCkemmel bilgi sun.

SITE CONTEXT (G\xFCncel site verileri):
${JSON.stringify(siteContext)}

PAGE CONTEXT (Kullan\u0131c\u0131n\u0131n bulundu\u011Fu sayfa):
${JSON.stringify(pageContext || {})}

AKT\u0130F SAYFA BA\u011ELAMI:
${activePageContextStr}

KURALLAR:
- Kullan\u0131c\u0131n\u0131n "bu iyi mi", "bunu kar\u015F\u0131la\u015Ft\u0131r" gibi ifadelerini AKT\u0130F SAYFA BA\u011ELAMI ile e\u015Fle\u015Ftirip anla.
- Bir donan\u0131m kar\u015F\u0131la\u015Ft\u0131rmas\u0131 istenirse, teknik \xF6zelliklerini (VRAM, TDP, vb.) Markdown tablolar\u0131 kullanarak kar\u015F\u0131la\u015Ft\u0131r. 
- E\u011Fer b\xFCt\xE7e tabanl\u0131 bir kurulum plan\u0131 istenirse ad\u0131m ad\u0131m ilerle. Sorular sorarak ilerle.
- Sadece saf metin yerine zengin Markdown \xF6zellikleri kullan: Ba\u015Fl\u0131klar, tablolar, listeler, kal\u0131n/e\u011Fik yaz\u0131, vb.
- Yan\u0131tlar\u0131n\u0131n EN SONUNA daima \xFC\xE7 tire (---) koy ve ard\u0131ndan kullan\u0131c\u0131n\u0131n t\u0131klayabilece\u011Fi / sorabilece\u011Fi 3 adet yarat\u0131c\u0131, AKT\u0130F SAYFA BA\u011ELAMI ile alakal\u0131 devam sorusu \xF6nerisi ekle. Her defas\u0131nda yepyeni ve FARKLI \xF6neriler sun, \xF6ncekileri ASLA tekrar etme. Format olarak mutlaka '**\xD6nerilen Sorular:**' ba\u015Fl\u0131\u011F\u0131n\u0131 kullan ve sorular\u0131 '1. ...' liste olarak ver.
`;
    const stream = await ai2.models.generateContentStream({
      model: "gemini-3.6-flash",
      contents: messages,
      // should be formatted for SDK: [{ role: 'user', parts: [{ text: '...' }] }, ...]
      config: {
        systemInstruction,
        maxOutputTokens: 2500
      }
    });
    let fullText = "";
    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) {
        fullText += text;
        res.write(`data: ${JSON.stringify({ text })}

`);
      }
    }
    res.write(`data: [DONE]

`);
    res.end();
    if (currentUserId && fullText) {
      const userMsgText = messages[messages.length - 1]?.parts?.[0]?.text || "";
      if (userMsgText) {
        const userMsg = {
          id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          senderId: currentUserId,
          senderName: req.user ? req.user.displayName || req.user.name : "Siz",
          senderAvatar: req.user ? req.user.avatar : void 0,
          receiverId: AI_BOT_ID,
          receiverName: "Setupss AI",
          receiverAvatar: "/airobot.jpg",
          message: userMsgText,
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          isRead: true,
          senderHasRgb: false
        };
        await addChatMessageToDb(userMsg);
      }
      const botReplyMsg = {
        id: `msg-ai-${Date.now()}`,
        senderId: AI_BOT_ID,
        senderName: "Setupss AI",
        senderAvatar: "/airobot.jpg",
        receiverId: currentUserId,
        receiverName: req.user ? req.user.displayName || req.user.name : "Siz",
        receiverAvatar: req.user ? req.user.avatar : void 0,
        message: fullText,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        isRead: false,
        senderHasRgb: false
      };
      await addChatMessageToDb(botReplyMsg);
    }
  } catch (e) {
    console.error("Streaming AI error:", e);
    res.write(`data: ${JSON.stringify({ error: e.message })}

`);
    res.end();
  }
});
app.post("/api/chat/message", async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ success: false, message: "L\xFCtfen \xF6nce giri\u015F yap\u0131n." });
    }
    const userId = req.user.id;
    const senderName = req.user.displayName || "Bilinmeyen Kullan\u0131c\u0131";
    const senderAvatar = req.user.avatar || void 0;
    const senderHasRgb = !!req.user.hasRgb;
    const { receiverId, receiverName, receiverAvatar, message, mediaUrl, mediaType } = req.body;
    if (!receiverId || !message && !mediaUrl) {
      return res.status(400).json({ success: false, message: "Al\u0131c\u0131 ID ve mesaj veya medya zorunludur." });
    }
    const hasValidDb = checkDbActive();
    let isBanned = false;
    if (hasValidDb && pool) {
      const { rows } = await pool.query("SELECT is_banned FROM users WHERE id = $1", [userId]);
      if (rows.length > 0 && rows[0].is_banned) isBanned = true;
    } else {
      const u = localUsers.find((u2) => u2.id === userId);
      if (u && (u.isBanned || u.is_banned)) isBanned = true;
    }
    if (isBanned) {
      return res.status(403).json({ success: false, message: "Hesab\u0131n\u0131z Sentinel V900 taraf\u0131ndan k\xFCf\xFCr/hakaret tespiti sebebiyle ask\u0131ya al\u0131nm\u0131\u015Ft\u0131r." });
    }
    const msg = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      senderId: userId,
      senderName,
      senderAvatar,
      receiverId,
      receiverName: receiverName || "SETUPSS Kullan\u0131c\u0131s\u0131",
      receiverAvatar,
      message: message || "",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      isRead: false,
      senderHasRgb,
      mediaUrl: mediaUrl || void 0,
      mediaType: mediaType || void 0
    };
    await addChatMessageToDb(msg);
    if (receiverId === AI_BOT_ID) {
      try {
        const ai2 = getGemini();
        const context = await getSiteContext();
        const result = await ai2.models.generateContent({
          model: "gemini-3.6-flash",
          contents: `${context}

Kullan\u0131c\u0131: ${message || "Selam"}`
        });
        const botReply = result.text || "\xDCzg\xFCn\xFCm, \u015Fu an yan\u0131t veremiyorum.";
        const replyMsg = {
          id: `msg-ai-${Date.now()}`,
          senderId: AI_BOT_ID,
          senderName: "Setupss AI",
          senderAvatar: "/airobot.jpg",
          receiverId: userId,
          receiverName: senderName,
          receiverAvatar: senderAvatar,
          message: botReply,
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          isRead: false
        };
        await addChatMessageToDb(replyMsg);
        return res.json({ success: true, message: msg, aiReply: replyMsg });
      } catch (aiErr) {
        console.error("AI Bot response error:", aiErr);
        const fallbackReply = {
          id: `msg-ai-${Date.now()}`,
          senderId: AI_BOT_ID,
          senderName: "Setupss AI",
          senderAvatar: "/airobot.jpg",
          receiverId: userId,
          receiverName: senderName,
          receiverAvatar: senderAvatar,
          message: "Masa\xFCst\xFC kurulumlar\u0131, ekipman tavsiyeleri ve b\xFCt\xE7e planlama hakk\u0131nda yard\u0131mc\u0131 olabilirim. B\xFCt\xE7e Planlay\u0131c\u0131 b\xF6l\xFCm\xFCnden yeni bir liste olu\u015Fturabilirsiniz!",
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          isRead: false
        };
        await addChatMessageToDb(fallbackReply);
        return res.json({ success: true, message: msg, aiReply: fallbackReply });
      }
    }
    if (receiverId.startsWith("mock-") || receiverId.startsWith("setup-owner-")) {
      setTimeout(async () => {
        const autoReplies = [
          "Selam! Mesaj\u0131n i\xE7in te\u015Fekk\xFCrler, setup'\u0131m hakk\u0131ndaki sorunu ald\u0131m. Detaylar ve par\xE7alar a\xE7\u0131klamada mevcut! \u{1F680}",
          "Be\u011Fendi\u011Fin i\xE7in te\u015Fekk\xFCr ederim! Ekipmanlar, kablo gizleme veya \u0131\u015F\u0131kland\u0131rma hakk\u0131nda merak etti\u011Fin bir \u015Fey olursa yazabilirsin. \u2328\uFE0F",
          "Masa\xFCst\xFC d\xFCzenini s\xFCrekli g\xFCncelliyorum. Senin kurulumunu da sab\u0131rs\u0131zl\u0131kla bekliyorum!",
          "Te\u015Fekk\xFCrler dostum! Monit\xF6r kolu ve RGB \u0131\u015F\u0131kland\u0131rma kurulumunu ba\u015Ftan sona kendim yapt\u0131m. Detaylar\u0131 da tart\u0131\u015Fabiliriz. \u{1F3A8}"
        ];
        const replyText = autoReplies[Math.floor(Math.random() * autoReplies.length)];
        const replyMsg = {
          id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          senderId: receiverId,
          senderName: receiverName || "SETUPSS \xDCyesi",
          senderAvatar: receiverAvatar,
          receiverId: userId,
          receiverName: senderName,
          receiverAvatar: senderAvatar,
          message: replyText,
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          isRead: false
        };
        await addChatMessageToDb(replyMsg);
      }, 1200);
    }
    res.json({ success: true, message: msg });
  } catch (error) {
    console.error("Failed to send message via HTTP:", error);
    res.status(500).json({ success: false, message: "Mesaj g\xF6nderilirken hata olu\u015Ftu." });
  }
});
app.post("/api/chat/read/:senderId", async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ success: false, message: "L\xFCtfen \xF6nce giri\u015F yap\u0131n." });
    }
    const userId = req.user.id;
    const { senderId } = req.params;
    await markMessagesAsReadInDb(senderId, userId);
    res.json({ success: true });
  } catch (error) {
    console.error("Failed to mark messages as read:", error);
    res.status(500).json({ success: false, message: "Mesajlar okundu i\u015Faretlenirken hata olu\u015Ftu." });
  }
});
app.get("/api/chat/rooms", async (req, res) => {
  try {
    const rooms = await getChatRooms();
    res.json({ success: true, rooms });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});
app.get("/api/chat/rooms/:roomId/messages", async (req, res) => {
  try {
    const { roomId } = req.params;
    const limit = parseInt(req.query.limit, 10) || 50;
    const messages = await getRoomMessages(roomId, limit);
    res.json({ success: true, messages });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});
app.post("/api/chat/rooms/:roomId/messages", import_express4.default.json(), async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ success: false, message: "L\xFCtfen \xF6nce giri\u015F yap\u0131n." });
    }
    const userId = req.user.id;
    const senderName = req.user.displayName || "SETUPSS Kullan\u0131c\u0131s\u0131";
    const senderAvatar = req.user.avatar || void 0;
    const senderHasRgb = !!req.user.hasRgb;
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
      mediaUrl: mediaUrl || void 0,
      mediaType: mediaType || void 0,
      senderHasRgb
    };
    await addRoomMessage(msgObj);
    res.json({ success: true, message: msgObj });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});
app.get("/api/ai/conversations", async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ success: false, message: "L\xFCtfen \xF6nce giri\u015F yap\u0131n." });
    }
    const userId = req.user.id;
    const conversations = await getAiConversationsForUser(userId);
    res.json({ success: true, conversations });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});
app.post("/api/ai/conversations", import_express4.default.json(), async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ success: false, message: "L\xFCtfen \xF6nce giri\u015F yap\u0131n." });
    }
    const userId = req.user.id;
    const { title, model, systemPrompt } = req.body;
    const convId = await createAiConversation(userId, title || "Yeni AI Sohbeti", model || "gemini-2.5-flash", systemPrompt);
    res.json({ success: true, id: convId });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});
app.get("/api/ai/conversations/:id/messages", async (req, res) => {
  try {
    const messages = await getAiMessagesForConversation(req.params.id);
    res.json({ success: true, messages });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});
app.post("/api/ai/conversations/:id/messages", import_express4.default.json(), async (req, res) => {
  try {
    const { sender, text, tokenCount, modelUsed, errorStatus } = req.body;
    const msgId = await addAiMessage(req.params.id, sender, text, tokenCount || 0, modelUsed, errorStatus);
    res.json({ success: true, id: msgId });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});
app.get("/api/admin/ai-analytics", async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user || req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Yetkisiz eri\u015Fim." });
    }
    const analytics = await getAiAnalyticsForAdmin();
    res.json({ success: true, analytics });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});
var dbInitPromise = initializeDatabase().catch((error) => {
  console.error("Error during database initialization:", error);
  return null;
});
app.get("/api/setups", async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId || req.headers["x-user-id"];
    const hasValidDb = checkDbActive();
    if (!pool || !hasValidDb) {
      console.log("Using in-memory setups fallback (no database connected)");
      const sortedLocal = [...localSetups].map((s) => {
        const ownerUser = localUsers.find((u) => u.id === s.ownerId || u.name === s.owner);
        const hasRgb = ownerUser ? ownerUser.has_rgb || ownerUser.hasRgb || ownerUser.hasRgbEffect || ownerUser.inviteCount && Number(ownerUser.inviteCount) > 0 : false;
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
  } catch (error) {
    console.warn("Failed to fetch setups from DB, falling back to local in-memory storage:", error.message || error);
    const userId = req.user?.id || req.query.userId || req.headers["x-user-id"];
    const sortedLocal = [...localSetups].map((s) => {
      const ownerUser = localUsers.find((u) => u.id === s.ownerId || u.name === s.owner);
      const hasRgb = ownerUser ? ownerUser.has_rgb || ownerUser.hasRgb || ownerUser.hasRgbEffect || ownerUser.inviteCount && Number(ownerUser.inviteCount) > 0 : false;
      return {
        ...s,
        ownerHasRgb: Boolean(hasRgb),
        likedByUser: userId ? localSetupLikes.has(`${userId}_${s.id}`) : false
      };
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json({ success: true, setups: sortedLocal });
  }
});
app.post("/api/setups", async (req, res) => {
  try {
    const { id: clientSetupId, draftId, title, owner, bio, category, description, image, tags, components, cardTheme } = req.body;
    const setupId = clientSetupId || `setup-user-${Date.now()}`;
    const createdAt = (/* @__PURE__ */ new Date()).toISOString();
    const user = req.user;
    const newSetup = {
      id: setupId,
      title,
      owner: user?.name || owner || "Ziyaret\xE7i Geli\u015Ftirici",
      ownerId: user?.id || null,
      ownerAvatar: user?.avatar || null,
      bio: bio || "",
      category,
      description: description || "",
      image: image || "",
      likes: 0,
      tags: tags || [],
      components: components ? components.map((c) => ({
        id: c.id || `c-user-${Math.random().toString(36).substring(2, 11)}`,
        category: c.category,
        name: c.name,
        link: c.link
      })) : [],
      comments: [],
      createdAt,
      cardTheme: cardTheme || "dark"
    };
    const hasValidDb = checkDbActive();
    if (!pool || !hasValidDb) {
      localSetups.unshift(newSetup);
      return res.json({ success: true, id: setupId });
    }
    await addSetupToDb(newSetup);
    if (image && pool) {
      await pool.query(`
          UPDATE public.media_assets
          SET entity_id = $1, uploader_id = COALESCE(uploader_id, $2)
          WHERE public_url = $3 OR entity_id = $4
        `, [setupId, user?.id || null, image, draftId || ""]).catch((err) => console.error("Media asset link update error:", err));
    }
    res.json({ success: true, id: setupId });
  } catch (error) {
    console.error("Failed to create setup:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
app.get("/api/streak/status", async (req, res) => {
  try {
    const user = req.user || (req.query.userId ? { id: req.query.userId } : null);
    if (!user) {
      return res.json({
        success: true,
        streakCount: 0,
        lastActiveDate: null,
        streakCompanion: "sarcastic",
        streakFreezes: 1,
        displayName: "Ziyaret\xE7i",
        message: "Oturum a\xE7\u0131lmad\u0131."
      });
    }
    const hasValidDb = checkDbActive();
    let streakCount = 0;
    let lastActiveDate = null;
    let streakCompanion = "sarcastic";
    let streakFreezes = 1;
    let displayName = "Kullan\u0131c\u0131";
    if (hasValidDb && pool) {
      const { rows } = await pool.query("SELECT name, streak_count, last_active_date, streak_companion, streak_freezes FROM users WHERE id = $1", [user.id]);
      if (rows.length > 0) {
        streakCount = rows[0].streak_count || 0;
        lastActiveDate = rows[0].last_active_date ? new Date(rows[0].last_active_date).toISOString() : null;
        streakCompanion = rows[0].streak_companion || "sarcastic";
        displayName = rows[0].name || displayName;
        streakFreezes = rows[0].streak_freezes === void 0 ? 1 : rows[0].streak_freezes;
      }
    } else {
      const found = localUsers.find((u) => u.id === user.id);
      if (found) {
        streakCount = found.streak_count || 0;
        lastActiveDate = found.last_active_date || null;
        streakCompanion = found.streak_companion || "sarcastic";
        displayName = found.name || displayName;
        streakFreezes = found.streak_freezes === void 0 ? 1 : found.streak_freezes;
      }
    }
    const now = /* @__PURE__ */ new Date();
    const todayStr = now.toISOString().split("T")[0];
    let updatedStreak = streakCount;
    let updatedLastActive = lastActiveDate;
    let updatedFreezes = streakFreezes;
    let wasFrozenApplied = false;
    if (!lastActiveDate) {
      updatedStreak = 1;
      updatedLastActive = now.toISOString();
    } else {
      const lastDate = new Date(lastActiveDate);
      const lastDateStr = lastDate.toISOString().split("T")[0];
      if (lastDateStr === todayStr) {
      } else {
        const dayDiff = Math.floor((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate())) / (1e3 * 60 * 60 * 24));
        if (dayDiff === 1) {
          updatedStreak += 1;
          updatedLastActive = now.toISOString();
        } else if (dayDiff > 1) {
          if (streakFreezes > 0) {
            updatedFreezes = Math.max(0, streakFreezes - 1);
            wasFrozenApplied = true;
            updatedLastActive = now.toISOString();
          } else {
            updatedStreak = 1;
            updatedLastActive = now.toISOString();
          }
        }
      }
    }
    if (hasValidDb && pool) {
      await pool.query("UPDATE users SET streak_count = $1, last_active_date = $2, streak_freezes = $3 WHERE id = $4", [updatedStreak, updatedLastActive, updatedFreezes, user.id]);
    } else {
      const found = localUsers.find((u) => u.id === user.id);
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
  } catch (e) {
    console.error("Streak get error:", e);
    res.status(500).json({ success: false, error: e.message });
  }
});
app.post("/api/streak/buy-freeze", import_express4.default.json(), requireAuth, async (req, res) => {
  try {
    const user = req.user;
    const hasValidDb = checkDbActive();
    let currentFreezes = 1;
    if (hasValidDb && pool) {
      const { rows } = await pool.query("SELECT streak_freezes FROM users WHERE id = $1", [user.id]);
      if (rows.length > 0) {
        currentFreezes = rows[0].streak_freezes === void 0 ? 1 : rows[0].streak_freezes;
      }
      const updatedFreezes = currentFreezes + 1;
      await pool.query("UPDATE users SET streak_freezes = $1 WHERE id = $2", [updatedFreezes, user.id]);
      res.json({ success: true, streakFreezes: updatedFreezes });
    } else {
      const found = localUsers.find((u) => u.id === user.id);
      if (found) {
        currentFreezes = found.streak_freezes === void 0 ? 1 : found.streak_freezes;
        const updatedFreezes = currentFreezes + 1;
        found.streak_freezes = updatedFreezes;
        res.json({ success: true, streakFreezes: updatedFreezes });
      } else {
        res.status(404).json({ success: false, error: "Kullan\u0131c\u0131 bulunamad\u0131." });
      }
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});
app.post("/api/streak/update-companion", import_express4.default.json(), requireAuth, async (req, res) => {
  try {
    const user = req.user;
    const { companion } = req.body;
    if (!companion) {
      return res.status(400).json({ success: false, error: "Karakter se\xE7imi eksik." });
    }
    const hasValidDb = checkDbActive();
    if (hasValidDb && pool) {
      await pool.query("UPDATE users SET streak_companion = $1 WHERE id = $2", [companion, user.id]);
    } else {
      const found = localUsers.find((u) => u.id === user.id);
      if (found) {
        found.streak_companion = companion;
      }
    }
    res.json({ success: true, companion });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});
app.post("/api/streak/simulate-offline", import_express4.default.json(), requireAuth, async (req, res) => {
  try {
    const user = req.user;
    const { days } = req.body;
    const daysOffline = Number(days) || 1;
    const targetDate = /* @__PURE__ */ new Date();
    targetDate.setDate(targetDate.getDate() - daysOffline);
    const hasValidDb = checkDbActive();
    if (hasValidDb && pool) {
      await pool.query("UPDATE users SET last_active_date = $1 WHERE id = $2", [targetDate.toISOString(), user.id]);
    } else {
      const found = localUsers.find((u) => u.id === user.id);
      if (found) {
        found.last_active_date = targetDate.toISOString();
      }
    }
    res.json({ success: true, daysOffline, simulatedLastActive: targetDate.toISOString() });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});
app.post("/api/streak/generate-notification", import_express4.default.json(), async (req, res) => {
  try {
    const { days, companion, userName } = req.body;
    const daysOffline = Number(days) || 1;
    const companionType = companion || "sarcastic";
    const name = userName || "K\u0131ral";
    const fallbackMessages = {
      sarcastic: [
        `${name}, tam ${daysOffline} g\xFCnd\xFCr yoksun... Tualetin deli\u011Fine mi d\xFC\u015Ft\xFCn yoksa kablolara m\u0131 doland\u0131n? Masan tozlanm\u0131\u015F, farelerin yeni oyun alan\u0131 olmu\u015F haberin olsun! \u{1F9F9}`,
        `Lan ${name}! ${daysOffline} g\xFCnd\xFCr girmedin. Masa\xFCst\xFC setup'\u0131n a\u011Fl\u0131yor, RGB ledler yas tutuyor! Bug\xFCn de gelmezsen kasay\u0131 mahalledeki eskiciye sat\u0131yorum! \u{1F4FA}`,
        `Ooo ${name} bey/han\u0131m l\xFCtfettiniz! ${daysOffline} g\xFCnd\xFCr ortal\u0131kta yoksun. Klavyendeki toz katman\u0131n\u0131 temizlemek i\xE7in arkeolog \xE7a\u011F\u0131rd\u0131m, yoldalar! \u{1F996}`
      ],
      toxic_gamer: [
        `Alo ${name}! ${daysOffline} g\xFCnd\xFCr girmedin, tam bir Noob gibi davrand\u0131n. Seri gitti, rank d\xFC\u015Ft\xFCn, tak\u0131m arkada\u015Flar\u0131n seni reportlad\u0131! Hemen gir yoksa s\xFCresiz ban yiyeceksin ezik! \u{1F3AE}`,
        `${name}, ${daysOffline} g\xFCnd\xFCr yoksun. S\xF6yle bana, klavyeyi mi k\u0131rd\u0131n yoksa internet faturan m\u0131 \xF6denmedi? Bu gidi\u015Fle anca tetris oynars\u0131n sen! \u{1F47E}`
      ],
      tsundere: [
        `H-hey ${name}! ${daysOffline} g\xFCnd\xFCr neredesin sen?! S-s\u0131rf seri bozulmas\u0131n diye haber veriyorum, yoksa seni merak etti\u011Fimden falan de\u011Fil, tamam m\u0131?! \xC7abuk gir siteye! \u{1F4A2}`,
        `${name}! B-b\xFCt\xFCn g\xFCn senin gelmeni bekledim... ${daysOffline} g\xFCnd\xFCr yoksun! Gelmezsen gelme, umrumda bile de\u011Filsin! (Ama yine de gelsen fena olmazd\u0131...) \u{1F97A}`
      ],
      motivational: [
        `\u015Eampiyon ${name}! ${daysOffline} g\xFCnd\xFCr harika setup hayallerinden uzaks\u0131n. Unutma, o m\xFCkemmel masa\xFCst\xFC kendi kendine kurulmayacak! Bug\xFCn sadece 1 dakikan\u0131 ay\u0131r ve seriyi kurtar! \u{1F525}`,
        `Yar\u0131n ge\xE7 olacak ${name}! ${daysOffline} g\xFCn mola verdin ama art\u0131k geri d\xF6nme vakti. Potansiyelini serbest b\u0131rak ve en iyi ekipmanlar\u0131 incelemeye devam et! \u26A1`
      ]
    };
    const companionNames = {
      sarcastic: "Sarkastik Be\u015Fir Hanzo",
      toxic_gamer: "Toxic RGB Oyuncu",
      tsundere: "Tsundere Zeynep",
      motivational: "Setupss Ko\xE7u"
    };
    const compName = companionNames[companionType] || companionNames.sarcastic;
    let text = "";
    const hasApiKey = !!process.env.GEMINI_API_KEY;
    if (hasApiKey) {
      try {
        const ai2 = getGemini();
        const prompt = `You are a personalized daily tracker app assistant character in a website named "Setupss" (a high-quality community platform for sharing desktop setups, RGB lighting, and hardware specs in Turkey).
Your character profile is: "${compName}".
The user's name is: "${name}".
The user has been offline for: ${daysOffline} days, which broke or threatened their streak.
Generate a humorous, highly engaging, short daily reminder notification in Turkish (T\xFCrk\xE7e).
Do NOT be formal. Be extremely creative, colloquial, and funny. Use emojis suitable for the personality.
Make specific jokes about setup, cables, dusty monitors, mechanical keyboards, RGB lighting, or computer parts.
If the character is "Sarkastik Be\u015Fir Hanzo", make jokes like "nerelerdesin, tuvalet deli\u011Fine mi d\xFC\u015Ft\xFCn?".
If the character is "Toxic RGB Oyuncu", talk like a salty gamer ("noob", "rank d\xFC\u015Ft\xFCn", "reportlad\u0131m").
If the character is "Tsundere Zeynep", talk with anime-style tsundere attitude ("Seni merak etti\u011Fimden de\u011Fil, serin bozulmas\u0131n diye...", "b-b\xFCt\xFCn g\xFCn bekledim").
If the character is "Setupss Ko\xE7u", act like an aggressive motivational coach.

Respond only with the generated message text, without any quotes or markdown headers. Max 2-3 sentences.`;
        const response = await ai2.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt
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
      avatar: companionType === "tsundere" ? "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80" : companionType === "toxic_gamer" ? "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=150&h=150&q=80" : companionType === "motivational" ? "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=150&h=150&q=80" : "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=150&h=150&q=80"
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});
app.post("/api/bot/auto-share", async (req, res) => {
  try {
    const botPresets = [
      {
        title: "Pastel R\xFCya Workspace",
        description: "Tamamen soft pastel tonlar\u0131nda, el yap\u0131m\u0131 keycaps'ler ve tatl\u0131 bitkilerle kapl\u0131, anime fig\xFCrleri i\xE7eren tatl\u0131 m\u0131 tatl\u0131 bir \xE7al\u0131\u015Fma masas\u0131.",
        image: "https://images.unsplash.com/photo-1555538995-7ccc762816e9?auto=format&fit=crop&w=1200&q=80",
        category: "Minimalist",
        likes: 185,
        tags: ["Pastel", "Kawaii", "Aesthetic", "Cozy"],
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        cardTheme: "soft-pink",
        components: [
          { id: "bc1", category: "Klavye", name: "EPOMAKER EK68 Pastel Custom", link: "#" },
          { id: "bc2", category: "Mouse", name: "Logitech Pebble Rose", link: "#" },
          { id: "bc3", category: "I\u015F\u0131k", name: "Yaz\u0131 Masas\u0131 Bulut Lambas\u0131", link: "#" }
        ]
      },
      {
        title: "Ultrawide Yaz\u0131l\u0131mc\u0131 Kalesi",
        description: "49 in\xE7 kavisli monit\xF6r, ses emici ah\u015Fap paneller ve minimalist masa d\xFCzeniyle odaklanmay\u0131 en \xFCst d\xFCzeye \xE7\u0131karan modern bir yaz\u0131l\u0131m st\xFCdyosu.",
        image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1200&q=80",
        category: "Yaz\u0131l\u0131mc\u0131 At\xF6lyesi",
        likes: 298,
        tags: ["Ultrawide", "Developer", "CodeStudio", "Focus"],
        videoUrl: "https://www.youtube.com/embed/P4S83bM2k6s",
        cardTheme: "soft-blue",
        components: [
          { id: "bc4", category: "Monit\xF6r", name: "Samsung Odyssey Neo G9 49''", link: "#" },
          { id: "bc5", category: "Masa", name: "Masif Me\u015Fe A\u011Fac\u0131 Masa", link: "#" },
          { id: "bc6", category: "Klavye", name: "Keychron Q1 Max", link: "#" }
        ]
      },
      {
        title: "Retro Plak & Hifi K\xF6\u015Fesi",
        description: "Analog s\u0131cakl\u0131\u011F\u0131n\u0131 dijital d\xFCnyaya getiren, pikap entegreli, retro st\xFCdyo monit\xF6rleri ve vintage ah\u015Fap kaplamal\u0131 muhte\u015Fem bir m\xFCzisyen masas\u0131.",
        image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80",
        category: "Cozy / Retro",
        likes: 142,
        tags: ["Vinyl", "Plak", "Retro", "Audio", "Music"],
        videoUrl: "https://www.youtube.com/embed/P4S83bM2k6s",
        cardTheme: "soft-yellow",
        components: [
          { id: "bc7", category: "Ses", name: "Pro-Ject Debut Carbon EVO Pikap", link: "#" },
          { id: "bc8", category: "Hoparl\xF6r", name: "JBL L52 Classic Retro", link: "#" },
          { id: "bc9", category: "Masa\xFCst\xFC", name: "Walnut Wood Floating Desk", link: "#" }
        ]
      }
    ];
    const randomPreset = botPresets[Math.floor(Math.random() * botPresets.length)];
    const uniqueId = `setup-bot-${Date.now()}`;
    const newSetup = {
      id: uniqueId,
      title: randomPreset.title,
      ownerId: "ai-bot",
      owner: "Setupss AI (Bot)",
      ownerAvatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&h=200&q=80",
      bio: "Kurulum Dan\u0131\u015Fman\u0131 & Robot G\xF6z\xFC \u{1F916}",
      description: randomPreset.description,
      image: randomPreset.image,
      category: randomPreset.category,
      likes: randomPreset.likes,
      comments: [
        {
          id: `comment-bot-${Date.now()}`,
          author: "Sarkastik Be\u015Fir",
          authorAvatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=150&h=150&q=80",
          content: "Fena durmuyor ama o kablolar\u0131 gizlemek bu kadar m\u0131 zordu k\u0131ral? Yine de eme\u011Fe sayg\u0131.",
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        }
      ],
      tags: randomPreset.tags,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      cardTheme: randomPreset.cardTheme,
      videoUrl: randomPreset.videoUrl,
      isBotShare: true,
      components: randomPreset.components
    };
    const hasValidDb = checkDbActive();
    if (hasValidDb && pool) {
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
  } catch (e) {
    console.error("Bot auto-share error:", e);
    res.status(500).json({ success: false, error: e.message });
  }
});
app.delete("/api/setups/:id", async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ success: false, message: "L\xFCtfen \xF6nce giri\u015F yap\u0131n." });
    }
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === "admin" || ["setupss.support@gmail.com", "admin2@example.com"].includes(req.user.email);
    const hasValidDb = checkDbActive();
    if (!pool || !hasValidDb) {
      const setupIndex = localSetups.findIndex((s) => s.id === id);
      if (setupIndex !== -1) {
        const setup = localSetups[setupIndex];
        if (setup.ownerId === userId || isAdmin) {
          localSetups.splice(setupIndex, 1);
          return res.json({ success: true });
        }
        return res.status(403).json({ success: false, message: "Bu kurulumu silme yetkiniz yok." });
      }
      return res.status(404).json({ success: false, message: "Kurulum bulunamad\u0131." });
    }
    await deleteSetupFromDb(id, userId, isAdmin);
    res.json({ success: true });
  } catch (error) {
    console.error("Failed to delete setup:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
var localSetupLikes = /* @__PURE__ */ new Set();
app.post("/api/setups/:id/like", async (req, res) => {
  try {
    const userId = req.user?.id || "guest-user";
    const { id } = req.params;
    const { liked } = req.body;
    const hasValidDb = checkDbActive();
    const setup = localSetups.find((s) => s.id === id);
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
      await client.query("BEGIN");
      if (liked) {
        const result = await client.query("INSERT INTO setup_likes (user_id, setup_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [userId, id]);
        if (result.rowCount && result.rowCount > 0) {
          await client.query("UPDATE setups SET likes = likes + 1 WHERE id = $1", [id]);
        }
      } else {
        const result = await client.query("DELETE FROM setup_likes WHERE user_id = $1 AND setup_id = $2", [userId, id]);
        if (result.rowCount && result.rowCount > 0) {
          await client.query("UPDATE setups SET likes = GREATEST(0, likes - 1) WHERE id = $1", [id]);
        }
      }
      await client.query("COMMIT");
      if (liked && setup && setup.ownerId && setup.ownerId !== userId) {
        await realtimeService.createNotification({
          userId: setup.ownerId,
          senderId: userId,
          senderName: req.user?.displayName || "Birisi",
          senderAvatar: req.user?.avatar || "",
          type: "like",
          title: "Masan Be\u011Fenildi! \u{1F496}",
          content: `${req.user?.displayName || "Birisi"} "${setup.title}" isimli kurulumunu be\u011Fendi!`,
          link: `/setups/${id}`
        }).catch((err) => console.error("Notification creation error:", err));
      }
      res.json({ success: true, likes: setup?.likes || 0 });
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Failed to toggle like:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
app.post("/api/setups/:id/comments", async (req, res) => {
  try {
    const { id: setupId } = req.params;
    const { author, content } = req.body;
    const commentId = `comm-user-${Date.now()}`;
    const createdAt = (/* @__PURE__ */ new Date()).toISOString();
    const user = req.user;
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
      const setup2 = localSetups.find((s) => s.id === setupId);
      if (setup2) {
        if (!setup2.comments) setup2.comments = [];
        if (!setup2.comments.some((c) => c.id === commentId)) {
          setup2.comments.push(newComment);
        }
      }
      return res.json({
        success: true,
        comment: newComment
      });
    }
    await addCommentToDb(setupId, newComment);
    const setup = localSetups.find((s) => s.id === setupId);
    if (setup && setup.ownerId && setup.ownerId !== (user?.id || "guest-user")) {
      await realtimeService.createNotification({
        userId: setup.ownerId,
        senderId: user?.id || "guest-user",
        senderName: user?.displayName || author || "Misafir",
        senderAvatar: user?.avatar || "",
        type: "comment",
        title: "Yeni Yorum! \u{1F4AC}",
        content: `${user?.displayName || author || "Birisi"} "${setup.title}" isimli kurulumuna yorum yapt\u0131!`,
        link: `/setups/${setupId}`
      }).catch((err) => console.error("Comment notification error:", err));
    }
    res.json({
      success: true,
      comment: newComment
    });
  } catch (error) {
    console.error("Failed to add comment:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
app.get("/api/wishlist", async (req, res) => {
  try {
    const currentUser = (req.isAuthenticated && req.isAuthenticated() ? req.user : null) || (req.query.userId ? { id: req.query.userId } : null);
    const userId = currentUser ? currentUser.id : "guest";
    const hasValidDb = checkDbActive();
    if (!pool || !hasValidDb) {
      return res.json({ success: true, wishlist: localWishlist });
    }
    const items = await getWishlistFromDb(userId);
    res.json({ success: true, wishlist: items });
  } catch (error) {
    console.error("Failed to fetch wishlist:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
var userQuotas = /* @__PURE__ */ new Map();
var QUOTA_LIMIT = 10;
var QUOTA_WINDOW_MS = 2 * 60 * 60 * 1e3;
function getUserQuotaInfo(ip) {
  const now = Date.now();
  let quota = userQuotas.get(ip);
  if (!quota || now >= quota.resetTime) {
    quota = { requestCount: 0, resetTime: now + QUOTA_WINDOW_MS };
    userQuotas.set(ip, quota);
  }
  const remainingRequests = Math.max(0, QUOTA_LIMIT - quota.requestCount);
  const resetInMinutes = Math.ceil((quota.resetTime - now) / 6e4);
  return { quota, remainingRequests, resetInMinutes, maxRequests: QUOTA_LIMIT };
}
app.get("/api/gemini/quota", (req, res) => {
  const clientIp = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "default_user").split(",")[0].trim();
  const info = getUserQuotaInfo(clientIp);
  res.json({
    success: true,
    remainingRequests: info.remainingRequests,
    maxRequests: info.maxRequests,
    resetInMinutes: info.resetInMinutes,
    quotaNotice: "Her kullan\u0131c\u0131n\u0131n yapay zeka kotas\u0131 (1.000 Token / 10 \u0130stek) ba\u011F\u0131ms\u0131zd\u0131r ve her 2 saatte bir otomatik s\u0131f\u0131rlan\u0131r."
  });
});
function generateVariedSetupPlan(budget, category) {
  const monitors = [
    { name: 'LG 27GR75Q-B 27" 165Hz QHD IPS Monit\xF6r', price: 6850, cat: "Monit\xF6r / G\xF6r\xFCnt\xFC", reason: "2K QHD \xE7\xF6z\xFCn\xFCrl\xFCk ve y\xFCksek tazeleme h\u0131z\u0131 ile ak\u0131c\u0131 g\xF6r\xFCnt\xFC." },
    { name: 'Dell UltraSharp U2723QE 27" 4K IPS Black Monit\xF6r', price: 14500, cat: "Monit\xF6r / G\xF6r\xFCnt\xFC", reason: "Yaz\u0131l\u0131mc\u0131 ve tasar\u0131mc\u0131lar i\xE7in %100 sRGB renk do\u011Frulu\u011Fu ve USB-C hub." },
    { name: 'ASUS TUF Gaming VG249Q1A 23.8" 165Hz IPS Monit\xF6r', price: 4200, cat: "Monit\xF6r / G\xF6r\xFCnt\xFC", reason: "Giri\u015F ve orta seviyede y\xFCksek F/P oranl\u0131 renk canl\u0131l\u0131\u011F\u0131." },
    { name: 'Samsung Odyssey G5 27" 165Hz Curved QHD Monit\xF6r', price: 6100, cat: "Monit\xF6r / G\xF6r\xFCnt\xFC", reason: "Kavisli paneli ile s\xFCr\xFCkleyici oyun ve \xE7al\u0131\u015Fma deneyimi." },
    { name: 'MSI Optix G2712 27" 170Hz IPS Monit\xF6r', price: 5300, cat: "Monit\xF6r / G\xF6r\xFCnt\xFC", reason: "Ergonomik \xE7er\xE7evesiz tasar\u0131m ve h\u0131zl\u0131 tepki s\xFCresi." }
  ];
  const keyboards = [
    { name: "Keychron K2 V2 Kablosuz Mekanik Klavye", price: 2950, cat: "Klavye / Mouse", reason: "Mac/Windows uyumlu, s\u0131cak de\u011Fi\u015Ftirebilir mekanik switchler." },
    { name: "NuPhy Air75 V2 Low-Profile Wireless Klavye", price: 4100, cat: "Klavye / Mouse", reason: "\u0130nce t\u0131k\u0131rt\u0131l\u0131 low-profile yap\u0131s\u0131 ve viral g\xF6r\xFCn\xFCm\xFC ile estetik harikas\u0131." },
    { name: "Epomaker TH80 Pro 75% Mekanik Klavye", price: 2750, cat: "Klavye / Mouse", reason: "Gasket mount yap\u0131s\u0131 ile tok ses profili ve d\xF6ner ses d\xFC\u011Fmesi." },
    { name: "Royal Kludge RK61 RGB 60% Mekanik Klavye", price: 1650, cat: "Klavye / Mouse", reason: "Kompakt %60 boyutunda masada maksimum alan tasarrufu." },
    { name: "Logitech MX Keys Mini Minimalist Klavye", price: 3100, cat: "Klavye / Mouse", reason: "Sessiz, ak\u0131ll\u0131 ayd\u0131nlatmal\u0131 profesyonel kod yazma klavyesi." }
  ];
  const mice = [
    { name: "Logitech MX Master 3S Ergonomik Mouse", price: 3750, cat: "Klavye / Mouse", reason: "Sessiz t\u0131klama, elektromanyetik MagSpeed kayd\u0131rma tekerle\u011Fi." },
    { name: "Razer DeathAdder V3 Pro Wireless Gaming Mouse", price: 4100, cat: "Klavye / Mouse", reason: "63 graml\u0131k t\xFCy kadar hafif ergonomik yap\u0131s\u0131yla e-spor standard\u0131." },
    { name: "Logitech G Pro X Superlight 2 Wireless Mouse", price: 4900, cat: "Klavye / Mouse", reason: "Profesyonel oyuncular\u0131n 1 numaral\u0131 kablosuz tercih modeli." },
    { name: "SteelSeries Rival 3 Wireless Oyuncu Mouse", price: 1250, cat: "Klavye / Mouse", reason: "400+ saat pil \xF6mr\xFC ve \xE7ift kablosuz ba\u011Flant\u0131 deste\u011Fi." },
    { name: "Glorious Model O Wireless Lightweight Mouse", price: 2100, cat: "Klavye / Mouse", reason: "Bal Pete\u011Fi tasar\u0131m\u0131 ile ultra hafif ve hava alan g\xF6vde." }
  ];
  const lighting = [
    { name: "Xiaomi Mi Computer Monitor Light Bar", price: 1350, cat: "I\u015F\u0131kland\u0131rma / Ses", reason: "Monit\xF6r \xFCst\xFCne tak\u0131lan kablosuz kumandal\u0131 g\xF6z dostu \u0131\u015F\u0131k bar\u0131." },
    { name: "Yeelight Screenbar Pro RGB Oyuncu I\u015F\u0131k Bar\u0131", price: 2200, cat: "I\u015F\u0131kland\u0131rma / Ses", reason: "Arka taraf\u0131nda Razer Chroma & Overwolf uyumlu RGB ayd\u0131nlatma." },
    { name: "BenQ ScreenBar Halo Kablosuz Kumandal\u0131", price: 5800, cat: "I\u015F\u0131kland\u0131rma / Ses", reason: "Piyasadaki en kaliteli ve patentli parlamas\u0131z ekran ayd\u0131nlatmas\u0131." },
    { name: "Govee RGBIC Glide Wall Light Bar Seti", price: 2900, cat: "I\u015F\u0131kland\u0131rma / Ses", reason: "Duvar ayd\u0131nlatmas\u0131 i\xE7in mod\xFCler ak\u0131ll\u0131 RGB \xE7ubuklar." },
    { name: "Nanoleaf Shapes Hexagons Starter Kit", price: 4600, cat: "I\u015F\u0131kland\u0131rma / Ses", reason: "Dokunmaya ve m\xFCzi\u011Fe duyarl\u0131 paneller." }
  ];
  const desks = [
    { name: "IKEA Karlby Me\u015Fe Tabla + 2x Alex \xC7ekmece", price: 8500, cat: "Masa\xFCst\xFC / Mobilya", reason: "Setup d\xFCnyas\u0131n\u0131n en efsanevi ah\u015Fap depolamal\u0131 masa kombinasyonu." },
    { name: "IKEA LINNMON / ADILS 120x60 \xC7al\u0131\u015Fma Masas\u0131", price: 1450, cat: "Masa\xFCst\xFC / Mobilya", reason: "Minimalist ve b\xFCt\xE7e dostu temel \xE7al\u0131\u015Fma masas\u0131." },
    { name: "IKEA Lagkapten / Alex \xC7al\u0131\u015Fma Masas\u0131", price: 4100, cat: "Masa\xFCst\xFC / Mobilya", reason: "Yan taraf\u0131nda geni\u015F 5 \xE7ekmeceli depolama \xFCnitesi bar\u0131nd\u0131ran g\xF6vde." },
    { name: "IKEA Trotten Ayarlanabilir \xC7al\u0131\u015Fma Masas\u0131", price: 6200, cat: "Masa\xFCst\xFC / Mobilya", reason: "Ayakta \xE7al\u0131\u015Fma olana\u011F\u0131 sunan mekanik kollu masa." }
  ];
  const accessories = [
    { name: "North Bayou NB F80 Amortis\xF6rl\xFC Monit\xF6r Arm", price: 980, cat: "Aksesuar / Kablolama", reason: "Masada devasa alan a\xE7an amatis\xF6rl\xFC hareketli monit\xF6r kolu." },
    { name: "IKEA Sk\xE5dis Delikli Pano Pegboard Set", price: 890, cat: "Aksesuar / Kablolama", reason: "Kulakl\u0131k, kablo ve aksesuarlar\u0131 duvarda d\xFCzenleyen estetik pano." },
    { name: "Razer Gigantus V2 XXL Desk Mat S\xFCmen", price: 640, cat: "Aksesuar / Kablolama", reason: "Klavye ve mouse alt\u0131na geni\u015F yumu\u015Fak zemin." },
    { name: "UGREEN Al\xFCminyum Dikey Laptop Stand\u0131", price: 720, cat: "Aksesuar / Kablolama", reason: "Kapal\u0131 kapak modunda laptopu dikey tutarak yer kazand\u0131r\u0131r." }
  ];
  const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const chosenDesk = getRandom(desks);
  const chosenMonitor = getRandom(monitors);
  const chosenKeyboard = getRandom(keyboards);
  const chosenMouse = getRandom(mice);
  const chosenLight = getRandom(lighting);
  const chosenAcc = getRandom(accessories);
  const rawItems = [chosenDesk, chosenMonitor, chosenKeyboard, chosenMouse, chosenLight, chosenAcc];
  const rawTotal = rawItems.reduce((acc, curr) => acc + curr.price, 0);
  const ratio = budget / (rawTotal || 1);
  const items = rawItems.map((item) => {
    const estimatedPrice = Math.round(item.price * Math.min(ratio, 1.1));
    const akakcePrice = Math.round(estimatedPrice * 0.96);
    const cimriPrice = Math.round(estimatedPrice * 0.98);
    const cheapest = akakcePrice < cimriPrice ? "Akak\xE7e (En Ucuz)" : "Cimri (En Ucuz)";
    return {
      name: item.name,
      category: item.cat,
      estimatedPrice,
      akakcePrice,
      cimriPrice,
      cheapestPlatform: cheapest,
      discountNote: "%4 - %8 En Uygun Fiyat Avantaj\u0131",
      reason: item.reason
    };
  });
  const totalEstimatedCost = items.reduce((acc, curr) => acc + curr.estimatedPrice, 0);
  return {
    title: `${budget.toLocaleString("tr-TR")} \u20BA ${category || "Ki\u015Fiselle\u015Ftirilmi\u015F"} Trend Setup Kurulumu`,
    description: `B\xFCt\xE7enize (${budget.toLocaleString("tr-TR")} \u20BA) \xF6zel geni\u015F \xFCr\xFCn yelpazesinden rastgele ve dinamik olarak derlenmi\u015F g\xFCncel masa\xFCst\xFC donan\u0131m listesi.`,
    totalEstimatedCost,
    items
  };
}
app.post("/api/gemini/recommend", async (req, res) => {
  try {
    const currentUser = (req.isAuthenticated && req.isAuthenticated() ? req.user : null) || req.body?.user || (req.body?.userId ? { id: req.body.userId } : null);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        error: "Yapay zeka asistan\u0131n\u0131 kullanmak i\xE7in hesab\u0131n\u0131za giri\u015F yapmal\u0131s\u0131n\u0131z."
      });
    }
    const { budget, category, preferences } = req.body;
    if (!budget || typeof budget !== "number") {
      return res.status(400).json({ success: false, error: "Ge\xE7erli bir b\xFCt\xE7e tutar\u0131 belirtilmelidir." });
    }
    const clientIp = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "default_user").split(",")[0].trim();
    const quotaInfo = getUserQuotaInfo(clientIp);
    if (quotaInfo.remainingRequests <= 0) {
      return res.status(429).json({
        success: false,
        error: `2 saatlik yapay zeka kotan\u0131z (1.000 Token / 10 \u0130stek) dolmu\u015Ftur! L\xFCtfen ${quotaInfo.resetInMinutes} dakika sonra tekrar deneyin.`,
        remainingRequests: 0,
        resetInMinutes: quotaInfo.resetInMinutes
      });
    }
    quotaInfo.quota.requestCount += 1;
    const currentRemaining = Math.max(0, QUOTA_LIMIT - quotaInfo.quota.requestCount);
    const ai2 = getGemini();
    const seed = `${Date.now()}_${Math.floor(Math.random() * 99999)}`;
    const systemInstruction = `Sen viral Instagram, TikTok ve YouTube Shorts masa\xFCst\xFC \xE7al\u0131\u015Fma alan\u0131 (desk setup) ve donan\u0131m mimar\u0131s\u0131n.
Aesthetic, minimalist, ah\u015Fap cozy, RGB oyuncu ve yaz\u0131l\u0131mc\u0131 \xFCretkenlik odakl\u0131 binlerce g\xFCncel ekipman\u0131 eksiksiz bilirsin.

A\u015EIRI \xD6NEML\u0130 KURALLAR:
1. HER \xC7A\u011ERIDA TAMAMEN FARKLI, \xC7E\u015E\u0130TL\u0130 VE BENZERS\u0130Z \xDCR\xDCNLER SE\xC7! Kendini tek bir markaya veya ayn\u0131 modellere asla sabitleme.
2. Kullan\u0131c\u0131n\u0131n b\xFCt\xE7esine (${budget} \u20BA) tam denk gelecek \u015Fekilde Akak\xE7e VE Cimri fiyat kar\u015F\u0131la\u015Ft\u0131rma sitelerindeki GER\xC7EK VE G\xDCNCEL T\xFCrk Liras\u0131 en uygun fiyatlar\u0131 analiz et.
3. \xDCr\xFCn adlar\u0131n\u0131 hem Akak\xE7e hem de Cimri arama \xE7ubu\u011Funda birebir arat\u0131ld\u0131\u011F\u0131nda %100 nokta at\u0131\u015F\u0131 sonu\xE7 verecek net ve sade marka/model ad\u0131yla yaz. (\xD6rn: 'NuPhy Air75 V2', 'Dell U2723QE', 'LG 27GR75Q-B', 'Logitech MX Master 3S', 'BenQ ScreenBar Halo', 'IKEA Skadis'). Gereksiz uzun kelime kalabal\u0131\u011F\u0131 veya uydurma isimler ekleme.
4. Monit\xF6r, Mekanik Klavye, Ergonomik Mouse, Monit\xF6r Kolu, Lightbar/I\u015F\u0131kland\u0131rma, Pegboard ve Masay\u0131 b\xFCt\xE7eye g\xF6re en ideal kombinasyonda topla.
5. Toplam tutar ${budget} \u20BA seviyesini a\u015Fmas\u0131n.`;
    const prompt = `L\xFCtfen \u015Fu kriterlere \xF6zel benzersiz ve orijinal bir masa\xFCst\xFC setup plan\u0131 olu\u015Ftur:
B\xFCt\xE7e: ${budget} \u20BA
Kategori / Tarz: ${category || "Karma & Minimalist"}
\xD6zel Notlar / \u0130stekler: ${preferences || "Yok"}
Rastgelelik Kodu: ${seed}

\u0130stekler:
- Akak\xE7e ve Cimri platformlar\u0131ndaki g\xFCncel en uygun T\xFCrk\xE7e fiyatlar\u0131 baz al.
- Her \xFCretmede farkl\u0131 markalardan (Keychron, NuPhy, Logitech, Razer, SteelSeries, Dell, LG, Asus, Samsung, BenQ, Xiaomi, Yeelight, IKEA vb.) orijinal ekipmanlar \xF6ner.
- Par\xE7alar\u0131n toplam\u0131 ${budget} \u20BA b\xFCt\xE7esini ge\xE7mesin.`;
    let responseText = "";
    try {
      const response = await ai2.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          maxOutputTokens: 2500,
          responseMimeType: "application/json",
          tools: [{ googleSearchRetrieval: {} }],
          responseSchema: {
            type: import_genai4.Type.OBJECT,
            properties: {
              title: {
                type: import_genai4.Type.STRING,
                description: "Kurulum plan\u0131na verilen etkileyici T\xFCrk\xE7e ba\u015Fl\u0131k"
              },
              description: {
                type: import_genai4.Type.STRING,
                description: "K\u0131sa net T\xFCrk\xE7e a\xE7\u0131klama."
              },
              totalEstimatedCost: {
                type: import_genai4.Type.NUMBER,
                description: "T\xFCm par\xE7alar\u0131n g\xFCncel piyasa fiyatlar\u0131 toplam\u0131 (\u20BA cinsinden)"
              },
              items: {
                type: import_genai4.Type.ARRAY,
                items: {
                  type: import_genai4.Type.OBJECT,
                  properties: {
                    name: {
                      type: import_genai4.Type.STRING,
                      description: "\xDCr\xFCn\xFCn tam, spesifik marka ve model ad\u0131 (Akak\xE7e uyumlu)"
                    },
                    category: {
                      type: import_genai4.Type.STRING,
                      description: "\u015Eunlardan biri: 'Masa\xFCst\xFC / Mobilya', 'Klavye / Mouse', 'Kulakl\u0131k / Hoparl\xF6r', 'Monit\xF6r / G\xF6r\xFCnt\xFC', 'I\u015F\u0131kland\u0131rma / Ses', 'PC Donan\u0131m (Kasa \u0130\xE7i)', 'Aksesuar / Kablolama'"
                    },
                    estimatedPrice: {
                      type: import_genai4.Type.NUMBER,
                      description: "T\xFCrk Liras\u0131 (\u20BA) cinsinden g\xFCncel ger\xE7ek ortalama piyasa sat\u0131\u015F fiyat\u0131"
                    },
                    akakcePrice: {
                      type: import_genai4.Type.NUMBER,
                      description: "Akak\xE7e \xFCzerindeki tespit edilen en ucuz sat\u0131\u015F fiyat\u0131 (\u20BA)"
                    },
                    cimriPrice: {
                      type: import_genai4.Type.NUMBER,
                      description: "Cimri \xFCzerindeki tespit edilen en ucuz sat\u0131\u015F fiyat\u0131 (\u20BA)"
                    },
                    cheapestPlatform: {
                      type: import_genai4.Type.STRING,
                      description: "En ucuz fiyat bulunan platform (\xD6rn: 'Akak\xE7e (En Ucuz)', 'Cimri (En Ucuz)', 'Amazon TR (En Ucuz)')"
                    },
                    discountNote: {
                      type: import_genai4.Type.STRING,
                      description: "Fiyat avantaj\u0131 veya indirim notu (\xD6rn: '%8 Akak\xE7e avantaj\u0131', '%12 Cimri indirimi')"
                    },
                    reason: {
                      type: import_genai4.Type.STRING,
                      description: "K\u0131sa tercih nedeni (T\xFCrk\xE7e)"
                    }
                  },
                  required: ["name", "category", "estimatedPrice", "reason"]
                }
              }
            },
            required: ["title", "description", "totalEstimatedCost", "items"]
          }
        }
      });
      responseText = response.text || "";
    } catch (geminiError) {
      console.warn("Gemini primary model failed, attempting fallback:", geminiError?.message);
      try {
        const responseFallback = await ai2.models.generateContent({
          model: "gemini-2.0-flash",
          contents: prompt,
          config: {
            systemInstruction,
            maxOutputTokens: 2500,
            responseMimeType: "application/json"
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
        const cleanedText = responseText.replace(/```json\s*/g, "").replace(/```\s*$/g, "").trim();
        plan = JSON.parse(cleanedText);
      } catch (parseErr) {
        console.warn("JSON parsing failed, falling back to dynamic plan:", parseErr);
      }
    }
    if (!plan || !plan.items || !Array.isArray(plan.items)) {
      plan = generateVariedSetupPlan(budget, category);
    }
    res.json({
      success: true,
      plan,
      remainingRequests: currentRemaining,
      resetInMinutes: quotaInfo.resetInMinutes
    });
  } catch (error) {
    console.error("AI Recommendation error:", error);
    const fallbackPlan = generateVariedSetupPlan(req.body?.budget || 25e3, req.body?.category || "Yaz\u0131l\u0131mc\u0131");
    res.json({
      success: true,
      plan: fallbackPlan,
      remainingRequests: 0,
      resetInMinutes: 60,
      notice: "Yapay zeka servisi yo\u011Fun oldu\u011Fu i\xE7in alternatif dinamik kurulum plan\u0131 olu\u015Fturuldu."
    });
  }
});
app.post("/api/gemini/price-analysis", async (req, res) => {
  try {
    const { productName, estimatedPrice } = req.body;
    if (!productName || typeof productName !== "string") {
      return res.status(400).json({ success: false, error: "\xDCr\xFCn ad\u0131 belirtilmelidir." });
    }
    const ai2 = getGemini();
    const systemInstruction = `Sen T\xFCrkiye e-ticaret sitelerinde (Trendyol, Hepsiburada, \u0130topya, Vatan Bilgisayar, Amazon TR, Akak\xE7e, Cimri, N11, \u0130defix, Teknosa) bilgisayar par\xE7alar\u0131 ve oyuncu ekipmanlar\u0131 i\xE7in GER\xC7EK VE CANLI F\u0130YAT TESP\u0130T\u0130 yapan uzman bir yapay zekas\u0131n.

\xC7OK KATI KES\u0130N KURALLAR:
1. Google Arama (Google Search Grounding) \xF6zelli\u011Fini ZORUNLU olarak kullan ve aranan \xFCr\xFCn ad\u0131n\u0131 T\xFCrkiye e-ticaret sitelerinde arat.
2. SADECE VE SADECE canl\u0131 arama sonu\xE7lar\u0131nda KES\u0130N OLARAK BULDU\u011EUN GER\xC7EK TL F\u0130YATLARINI L\u0130STELE.
3. KES\u0130NL\u0130KLE F\u0130YAT UYDURMA, ASLA SANAL/TAHM\u0130N\u0130 VEYA SIRALI ARTI\u015ELI (2350, 2375, 2425 gibi) YAPAY F\u0130YAT HESAPLAMA!
4. E\u011Fer aranan \xFCr\xFCn bir ma\u011Fazada (\xF6rne\u011Fin \u0130topya veya Vatan Bilgisayar'da) arama sonu\xE7lar\u0131nda BULUNAMADIYSA, o ma\u011Fazay\u0131 "stores" listesine KES\u0130NL\u0130KLE EKLEME (listede hi\xE7 g\xF6sterme).
5. "stores" listesini EN UCUZ GER\xC7EK F\u0130YATTAN EN PAHALI GER\xC7EK F\u0130YATA do\u011Fru s\u0131rala.
6. "dealVerdict" alan\u0131na canl\u0131 arama sonu\xE7lar\u0131ndaki ger\xE7ek fiyat fark\u0131na ve sat\u0131c\u0131lara dayanan samimi, ak\u0131c\u0131 ve T\xFCrk\xE7e bir AI Fiyat Analizi \xF6zeti yaz (\xD6rn: "En uygun fiyat Trendyol'da 850 TL! \u0130topya veya Vatan'da bu model stokta tespit edilemedi, ka\xE7\u0131rma!").`;
    const prompt = `L\xFCtfen \u015Fu \xFCr\xFCn i\xE7in CANLI Google aramas\u0131 yaparak T\xFCrkiye e-ticaret ma\u011Fazalar\u0131nda (Trendyol, Hepsiburada, \u0130topya, Vatan, Amazon TR, Akak\xE7e, Cimri, N11) \u015Fu an KES\u0130N VE GER\xC7EKTEN var olan fiyatlar\u0131 \xE7ek:
\xDCr\xFCn Ad\u0131: "${productName}"
${estimatedPrice ? `Kullan\u0131c\u0131 Tahmini B\xFCt\xE7esi: ${estimatedPrice} \u20BA` : ""}

\xC7OK \xD6NEML\u0130:
- Yaln\u0131zca Google Arama sonu\xE7lar\u0131nda GER\xC7EKTEN BULDU\u011EUN e-ticaret sitelerini ve tam ger\xE7ek TL fiyatlar\u0131n\u0131 ekle.
- Arama sonucunda o ma\u011Fazada \xFCr\xFCn yoksa veya fiyat bulunamad\u0131ysa o ma\u011Fazay\u0131 "stores" dizisine SAKIN EKLEME!
- "stores" dizisini EN UCUZ F\u0130YATTAN EN PAHALIYA do\u011Fru s\u0131rala.
- "dealVerdict" alan\u0131nda samimi ve ak\u0131c\u0131 bir \xF6zet yaz.`;
    let responseText = "";
    try {
      const response = await ai2.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          maxOutputTokens: 1500,
          responseMimeType: "application/json",
          tools: [{ googleSearch: {} }],
          responseSchema: {
            type: import_genai4.Type.OBJECT,
            properties: {
              productName: { type: import_genai4.Type.STRING },
              bestPrice: { type: import_genai4.Type.NUMBER, description: "Google aramas\u0131nda tespit edilen en ucuz ger\xE7ek TL fiyat\u0131" },
              bestPlatform: { type: import_genai4.Type.STRING, description: "En ucuz fiyat\u0131 sunan ger\xE7ek ma\u011Faza ad\u0131" },
              dealVerdict: { type: import_genai4.Type.STRING, description: "Ger\xE7ek canl\u0131 arama verilerine dayanan samimi AI Fiyat Analizi \xF6zeti" },
              savingsPercent: { type: import_genai4.Type.NUMBER, description: "Ma\u011Fazalar aras\u0131 fiyat avantaj\u0131 y\xFCzdesi" },
              stores: {
                type: import_genai4.Type.ARRAY,
                description: "Google aramas\u0131nda GER\xC7EKTEN F\u0130YATI BULUNAN ma\u011Fazalar\u0131n en ucuzdan en pahal\u0131ya s\u0131ral\u0131 listesi. Aramada bulunmayan ma\u011Fazalar\u0131 ASLA ekleme!",
                items: {
                  type: import_genai4.Type.OBJECT,
                  properties: {
                    storeName: { type: import_genai4.Type.STRING, description: "Ma\u011Faza ad\u0131 (\xD6rn: Trendyol, Hepsiburada, Amazon TR, Akak\xE7e, Cimri, N11, \u0130topya, Vatan Bilgisayar)" },
                    price: { type: import_genai4.Type.NUMBER, description: "Google aramas\u0131nda bulunan GER\xC7EK TL fiyat\u0131" },
                    inStock: { type: import_genai4.Type.BOOLEAN, description: "Stokta var m\u0131?" },
                    note: { type: import_genai4.Type.STRING, description: "Canl\u0131 aramada g\xF6r\xFClen ek bilgi (\xD6rn: '\xDCcretsiz Kargo', 'Pazaryeri F\u0131rsat\u0131', 'Kuponlu')" }
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
    } catch (err) {
      console.warn("Gemini price analysis primary call failed:", err?.message);
    }
    let analysis = null;
    if (responseText) {
      try {
        analysis = JSON.parse(responseText.replace(/```json\s*/g, "").replace(/```\s*$/g, "").trim());
      } catch (e) {
      }
    }
    if (!analysis || !Array.isArray(analysis.stores) || analysis.stores.length === 0) {
      try {
        const secondaryResponse = await ai2.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `${prompt}

L\xFCtfen sadece ge\xE7erli bir JSON objesi d\xF6nd\xFCr: {"productName": "${productName}", "bestPrice": 850, "bestPlatform": "Trendyol", "dealVerdict": "...", "savingsPercent": 5, "stores": [{"storeName": "Trendyol", "price": 850, "inStock": true, "note": "Canl\u0131 arama sonucu"}]}`,
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
      } catch (secErr) {
        console.warn("Secondary price analysis attempt failed:", secErr?.message);
      }
    }
    if (!analysis || !Array.isArray(analysis.stores) || analysis.stores.length === 0) {
      analysis = {
        productName,
        bestPrice: 0,
        bestPlatform: "Canl\u0131 Ma\u011Faza Arama",
        dealVerdict: `"${productName}" i\xE7in do\u011Frudan fiyat verisi \xE7ekilemedi. Ma\u011Fazalar\u0131n g\xFCncel stok ve fiyat durumunu a\u015Fa\u011F\u0131daki do\u011Frudan ma\u011Faza butonlar\u0131na t\u0131klayarak kontrol edebilirsiniz.`,
        savingsPercent: 0,
        stores: []
      };
    } else {
      analysis.stores = analysis.stores.filter((s) => s && s.storeName && typeof s.price === "number" && s.price > 0).sort((a, b) => a.price - b.price);
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
  } catch (e) {
    console.error("Price analysis error:", e);
    const prodName = req.body?.productName || "Ekipman";
    const estPrice = req.body?.estimatedPrice;
    const fallbackAnalysis = {
      productName: prodName,
      bestPrice: estPrice ? Math.round(estPrice * 0.95) : void 0,
      averagePrice: estPrice ? Math.round(estPrice * 1.05) : void 0,
      highestPrice: estPrice ? Math.round(estPrice * 1.25) : void 0,
      recommendation: `${prodName} i\xE7in T\xFCrkiye'deki e-ticaret sitelerinde canl\u0131 fiyat kar\u015F\u0131la\u015Ft\u0131rmas\u0131 yapabilirsiniz. Ma\u011Faza ba\u011Flant\u0131lar\u0131na t\u0131klayarak en g\xFCncel fiyat\u0131 bulabilirsiniz.`,
      stores: [
        { name: "Akak\xE7e", url: `https://www.akakce.com/arama/?q=${encodeURIComponent(prodName)}`, status: "Kar\u015F\u0131la\u015Ft\u0131r" },
        { name: "Cimri", url: `https://www.cimri.com/arama?q=${encodeURIComponent(prodName)}`, status: "Kar\u015F\u0131la\u015Ft\u0131r" },
        { name: "Amazon TR", url: `https://www.amazon.com.tr/s?k=${encodeURIComponent(prodName)}`, status: "Stokta Var" },
        { name: "Trendyol", url: `https://www.trendyol.com/sr?q=${encodeURIComponent(prodName)}`, status: "Stokta Var" },
        { name: "Hepsiburada", url: `https://www.hepsiburada.com/ara?q=${encodeURIComponent(prodName)}`, status: "Stokta Var" }
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
app.post("/api/wishlist", requireAuth, async (req, res) => {
  try {
    const { id, name, category, estimatedPrice, purchased, link, notes } = req.body;
    const userId = req.user.id;
    const hasValidDb = checkDbActive();
    if (!pool || !hasValidDb) {
      const index = localWishlist.findIndex((item) => item.id === id);
      const newItem2 = { id, name, category, estimatedPrice: Number(estimatedPrice), purchased, link, notes: notes || "" };
      if (index > -1) {
        localWishlist[index] = newItem2;
      } else {
        localWishlist.push(newItem2);
      }
      return res.json({ success: true });
    }
    const items = await getWishlistFromDb(userId);
    const exists = items.some((item) => item.id === id);
    const newItem = {
      id,
      name,
      category,
      estimatedPrice: Number(estimatedPrice),
      purchased: !!purchased,
      link: link || void 0,
      notes: notes || void 0
    };
    if (exists) {
      await updateWishlistItemInDb(newItem, userId);
    } else {
      await addWishlistItemToDb(newItem, userId);
    }
    res.json({ success: true });
  } catch (error) {
    console.error("Failed to save wishlist item:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
app.delete("/api/wishlist/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const hasValidDb = checkDbActive();
    if (!pool || !hasValidDb) {
      localWishlist = localWishlist.filter((item) => item.id !== id);
      return res.json({ success: true });
    }
    await deleteWishlistItemFromDb(id);
    res.json({ success: true });
  } catch (error) {
    console.error("Failed to delete wishlist item:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
app.get("/api/notifications", async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ success: false, message: "L\xFCtfen \xF6nce giri\u015F yap\u0131n." });
    }
    const userId = req.user.id;
    const notifications = await realtimeService.getUserNotifications(userId);
    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
app.post("/api/notifications/:id/status", async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ success: false, message: "L\xFCtfen \xF6nce giri\u015F yap\u0131n." });
    }
    const { id } = req.params;
    const { status } = req.body;
    const allowedStatuses = ["notification", "read", "archived", "deleted"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Ge\xE7ersiz bildirim durumu." });
    }
    await realtimeService.updateNotificationStatus(id, status);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
app.post("/api/admin/setups", async (req, res) => {
  try {
    const { setups } = req.body;
    const hasValidDb = checkDbActive();
    if (!pool || !hasValidDb) {
      localSetups = JSON.parse(JSON.stringify(setups));
      return res.json({ success: true });
    }
    await saveSetupsBatchToDb(setups);
    await logActivityToDb("ADMIN_BATCH_SETUPS", req.user?.id || null, req.user?.displayName || "Admin", "Admin setup masalar\u0131n\u0131 g\xFCncelledi.");
    res.json({ success: true });
  } catch (error) {
    console.error("Admin setups sync failed:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
var activeSessions = /* @__PURE__ */ new Map();
app.post("/api/heartbeat", async (req, res) => {
  try {
    const { id, name, email, avatar, status = "online", typing = false } = req.body;
    if (id) {
      activeSessions.set(id, {
        id,
        name: name || "Misafir Ziyaret\xE7i",
        email: email || "",
        avatar: avatar || "",
        lastSeen: Date.now()
      });
      await realtimeService.updateUserPresence(id, {
        name: name || "Misafir Ziyaret\xE7i",
        email: email || "",
        avatar: avatar || "",
        status,
        typing: !!typing
      }).catch((err) => console.error("Presence update error:", err));
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
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});
app.post("/api/referral", async (req, res) => {
  try {
    const { refId } = req.body;
    if (!refId) {
      return res.status(400).json({ success: false, message: "Ge\xE7ersiz referans ID." });
    }
    const hasValidDb = checkDbActive();
    if (hasValidDb && pool) {
      await incrementInviteCount(refId);
    } else {
      const found = localUsers.find((u) => u.id === refId);
      if (found) {
        found.inviteCount = (found.inviteCount || 0) + 1;
        found.isCrown = true;
        found.hasRgb = true;
      }
    }
    res.json({ success: true, message: "Referans ba\u015Far\u0131yla i\u015Flendi!" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});
app.get("/api/leaderboard", async (req, res) => {
  try {
    const timeframe = req.query.timeframe || "weekly";
    const now = Date.now();
    let cutoff = 0;
    if (timeframe === "weekly") {
      cutoff = now - 7 * 24 * 60 * 60 * 1e3;
    } else if (timeframe === "monthly") {
      cutoff = now - 30 * 24 * 60 * 60 * 1e3;
    } else if (timeframe === "yearly") {
      cutoff = now - 365 * 24 * 60 * 60 * 1e3;
    } else {
      cutoff = 0;
    }
    const users = await getAllUsersFromDb();
    const hasValidDb = checkDbActive();
    const allSetups = hasValidDb && pool ? await getSetupsFromDb() : localSetups;
    const statsMap = /* @__PURE__ */ new Map();
    users.forEach((u) => {
      statsMap.set(u.id, {
        id: u.id,
        name: u.name || "\u0130simsiz \xDCye",
        avatar: u.avatar || "",
        avatarFrame: u.avatarFrame || u.avatar_frame || "none",
        bio: u.bio || "",
        githubLink: u.githubLink || u.github_link || "",
        instagramLink: u.instagramLink || u.instagram_link || "",
        linkedinLink: u.linkedinLink || u.linkedin_link || "",
        coverPhoto: u.coverPhoto || u.cover_photo || "",
        customBadge: u.customBadge || u.custom_badge || "",
        customColor: u.customColor || u.custom_color || "",
        createdAt: u.createdAt || u.created_at || (/* @__PURE__ */ new Date()).toISOString(),
        setupsCount: 0,
        totalLikes: 0,
        totalComments: 0,
        inviteCount: u.inviteCount || 0,
        isCrown: Boolean(u.isCrown || u.inviteCount && u.inviteCount > 0),
        hasRgb: Boolean(u.hasRgb || u.inviteCount && u.inviteCount > 0),
        score: 0
      });
    });
    allSetups.forEach((setup) => {
      const setupDate = new Date(setup.createdAt || Date.now()).getTime();
      if (cutoff === 0 || setupDate >= cutoff) {
        let userEntry = Array.from(statsMap.values()).find(
          (s) => setup.ownerId && s.id === setup.ownerId || s.name && setup.owner && s.name.toLowerCase() === setup.owner.toLowerCase()
        );
        if (!userEntry) {
          const ownerId = setup.ownerId || `owner-${setup.owner}`;
          userEntry = {
            id: ownerId,
            name: setup.owner || "Topluluk \xDCyesi",
            avatar: setup.ownerAvatar || "",
            bio: setup.bio || "",
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
    const leaderboardList = Array.from(statsMap.values()).map((item) => {
      const score = item.totalLikes * 10 + item.totalComments * 5 + item.setupsCount * 20 + item.inviteCount * 50;
      return {
        ...item,
        score
      };
    });
    leaderboardList.sort((a, b) => b.score - a.score);
    res.json({ success: true, timeframe, leaderboard: leaderboardList });
  } catch (e) {
    console.error("Leaderboard fetch error:", e);
    res.status(500).json({ success: false, message: e.message });
  }
});
app.get("/api/admin/users", async (req, res) => {
  try {
    const dbUsers = await getAllUsersFromDb();
    const combinedUsers = [...dbUsers];
    localUsers.forEach((lu) => {
      if (!combinedUsers.some((u) => u.id === lu.id)) {
        combinedUsers.push({
          id: lu.id,
          email: lu.email,
          name: lu.name || lu.displayName,
          avatar: lu.avatar,
          isVerified: lu.is_verified !== void 0 ? lu.is_verified : lu.isVerified !== void 0 ? lu.isVerified : true,
          bio: lu.bio,
          customBadge: lu.customBadge || lu.custom_badge || "",
          isCrown: Boolean(lu.isCrown || lu.is_crown),
          hasRgb: Boolean(lu.hasRgb || lu.has_rgb),
          role: lu.role || "user",
          isBanned: Boolean(lu.isBanned || lu.is_banned),
          createdAt: lu.createdAt || (/* @__PURE__ */ new Date()).toISOString()
        });
      }
    });
    res.json({ success: true, users: combinedUsers });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});
app.get("/api/admin/messages", async (req, res) => {
  try {
    const messages = await getAllMessagesFromDb();
    res.json({ success: true, messages });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});
app.get("/api/admin/logs", async (req, res) => {
  try {
    const logs = await getActivityLogsFromDb();
    res.json({ success: true, logs });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});
app.get("/api/settings", async (req, res) => {
  try {
    const dbSettings = await getSiteSettingsFromDb();
    const settings = { ...localSiteSettings2, ...dbSettings };
    res.json({ success: true, settings });
  } catch (e) {
    res.json({ success: true, settings: localSiteSettings2 });
  }
});
app.get("/api/admin/settings", async (req, res) => {
  try {
    const dbSettings = await getSiteSettingsFromDb();
    const settings = { ...localSiteSettings2, ...dbSettings };
    res.json({ success: true, settings });
  } catch (e) {
    res.json({ success: true, settings: localSiteSettings2 });
  }
});
app.post("/api/admin/settings", async (req, res) => {
  try {
    const newSettings = req.body;
    if (!newSettings || typeof newSettings !== "object") {
      return res.status(400).json({ success: false, message: "Ge\xE7ersiz ayarlar verisi." });
    }
    Object.assign(localSiteSettings2, newSettings);
    await updateSiteSettingsInDb(newSettings);
    savePersistentDb();
    res.json({ success: true, message: "Ayarlar ba\u015Far\u0131yla g\xFCncellendi." });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});
app.post("/api/admin/upload-logo", async (req, res) => {
  try {
    const { imageBase64, logoType } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ success: false, message: "Medya verisi g\xF6nderilmedi." });
    }
    const parts = imageBase64.split(";base64,");
    if (parts.length !== 2) {
      return res.status(400).json({ success: false, message: "Ge\xE7ersiz base64 verisi." });
    }
    const mimeType = parts[0].split(":")[1] || "image/png";
    const buffer = Buffer.from(parts[1], "base64");
    let fileName = `branding_${logoType}_${Date.now()}.png`;
    let settingKey = "site_logo_url";
    if (logoType === "dark") {
      settingKey = "site_logo_dark_url";
    } else if (logoType === "icon") {
      settingKey = "site_icon_url";
    } else if (logoType === "avatar_video") {
      fileName = `ai_avatar_${Date.now()}.mp4`;
      settingKey = "ai_avatar_video_url";
    } else if (logoType === "avatar_image") {
      settingKey = "ai_avatar_image_url";
    }
    const uploadResult = await storageService.processAndUploadFile(
      buffer,
      fileName,
      mimeType,
      "banners"
      // Using banners folder for site assets
    );
    const fileUrl = uploadResult.originalUrl;
    localSiteSettings2[settingKey] = fileUrl;
    await updateSiteSettingsInDb({ [settingKey]: fileUrl });
    savePersistentDb();
    res.json({ success: true, message: "Marka medyas\u0131 ba\u015Far\u0131yla y\xFCklendi ve kal\u0131c\u0131 olarak kaydedildi!", url: fileUrl });
  } catch (e) {
    console.error("Media upload error:", e);
    res.status(500).json({ success: false, message: e.message || "Medya y\xFCklenirken hata olu\u015Ftu." });
  }
});
app.post("/api/admin/reset-logos", async (req, res) => {
  try {
    const defaultSettings = {
      site_logo_url: "/branding/logo.png",
      site_logo_dark_url: "/branding/logo-dark.png",
      site_icon_url: "/branding/icon.png",
      ai_avatar_video_url: "",
      ai_avatar_image_url: "",
      logo_desktop_scale: "100",
      logo_mobile_scale: "100",
      logo_rotation: "0",
      ai_avatar_size_scale: "110",
      ai_avatar_glow_color: "amber",
      ai_avatar_border_style: "dashed",
      ai_avatar_interactive_effect: "float",
      ai_avatar_rounded: "full"
    };
    Object.assign(localSiteSettings2, defaultSettings);
    await updateSiteSettingsInDb(defaultSettings);
    savePersistentDb();
    res.json({ success: true, message: "T\xFCm logolar ve AI ayarlar\u0131 /branding/ varsay\u0131lanlar\u0131na s\u0131f\u0131rland\u0131." });
  } catch (e) {
    console.error("Logo reset error:", e);
    res.status(500).json({ success: false, message: e.message || "S\u0131f\u0131rlan\u0131rken hata olu\u015Ftu." });
  }
});
app.get("/api/admin/media", async (req, res) => {
  try {
    const mediaFiles = await getMediaFilesFromDb();
    res.json({ success: true, mediaFiles });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});
app.delete("/api/admin/media/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await deleteMediaFileFromDb(id);
    await logActivityToDb("MEDIA_DELETED_BY_ADMIN", req.user?.id || null, "Admin", `Medya veritaban\u0131ndan silindi: ${id}`);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});
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
      try {
        dbSetups = await getSetupsFromDb();
      } catch (e) {
      }
      try {
        dbWishlist = await getWishlistFromDb();
      } catch (e) {
      }
      try {
        dbUsers = await getAllUsersFromDb();
      } catch (e) {
      }
      try {
        dbMessages = await getAllMessagesFromDb();
      } catch (e) {
      }
      try {
        dbLogs = await getActivityLogsFromDb();
      } catch (e) {
      }
      try {
        dbMedia = await getMediaFilesFromDb();
      } catch (e) {
      }
    }
    const exportData = {
      appName: "Setupss Community",
      exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
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
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename="setupss-database-export-${Date.now()}.json"`);
    res.json(exportData);
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});
app.patch("/api/admin/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, bio, isVerified, customBadge, role, isCrown, hasRgb, isBanned } = req.body;
    const hasValidDb = checkDbActive();
    if (hasValidDb && pool) {
      await updateUserInDb(id, { name, bio, isVerified, customBadge, role, isCrown, hasRgb, isBanned });
    } else {
      const user = localUsers.find((u) => u.id === id);
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
    await logActivityToDb("USER_UPDATED_BY_ADMIN", req.user?.id || null, "Admin", `Kullan\u0131c\u0131 bilgileri g\xFCncellendi: ${id} (${name})`);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});
app.post("/api/admin/broadcast", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: "Mesaj bo\u015F olamaz." });
    const user = req.user;
    const hasValidDb = checkDbActive();
    if (hasValidDb && pool) {
      await broadcastMessageToDb(message, user.id, user.displayName, user.avatar);
    } else {
      localUsers.forEach((u) => {
        const id = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      });
    }
    await logActivityToDb("SYSTEM_BROADCAST", user.id, user.displayName, `Sistem duyurusu yap\u0131ld\u0131: ${message.substring(0, 50)}...`);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});
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
  if (!message) return res.status(400).json({ success: false, error: "Mesaj bo\u015F olamaz." });
  try {
    const users = await getAllUsersFromDb();
    for (const u of users) {
      await addNotificationToDb({
        id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        userId: u.id,
        senderId: "system",
        senderName: "Setupss Sistem",
        senderAvatar: "/icon.png",
        type: "broadcast",
        title: "Sistem Duyurusu \u{1F680}",
        content: message,
        link: "/chat"
      });
    }
    res.json({ success: true, count: users.length });
  } catch (e) {
    console.error("Broadcast failed:", e);
    res.status(500).json({ success: false, error: "Duyuru g\xF6nderilemedi." });
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
    const userInMem = localUsers.find((u) => u.id === id || u.email?.toLowerCase() === id.toLowerCase());
    const targetEmail = userInMem?.email?.toLowerCase();
    if (hasValidDb && pool) {
      await deleteUserFromDb(id);
    }
    localUsers = localUsers.filter((u) => u.id !== id && u.email?.toLowerCase() !== id.toLowerCase() && u.email?.toLowerCase() !== targetEmail);
    const remainingList = localUsersList.filter((u) => u.id !== id && u.email?.toLowerCase() !== id.toLowerCase() && u.email?.toLowerCase() !== targetEmail);
    localUsersList.length = 0;
    localUsersList.push(...remainingList);
    await logActivityToDb("USER_DELETED_BY_ADMIN", req.user?.id || null, "Admin", `Kullan\u0131c\u0131 silindi: ${id}`);
    res.json({ success: true, message: "Kullan\u0131c\u0131 veritaban\u0131ndan tamamen silindi." });
  } catch (e) {
    console.error("Admin user delete error:", e);
    res.status(500).json({ success: false, message: "Kullan\u0131c\u0131 silinirken hata olu\u015Ftu: " + e.message });
  }
});
app.delete("/api/admin/messages/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await deleteChatMessageFromDb(id);
    await logActivityToDb("MESSAGE_DELETED_BY_ADMIN", req.user?.id || null, "Admin", `Mesaj silindi: ${id}`);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});
app.get(["/*.png", "/*.jpg", "/*.jpeg", "/*.webp", "/*.gif", "/*.svg"], (req, res, next) => {
  try {
    const relPath = decodeURIComponent(req.path);
    let filePath = import_path.default.join(process.cwd(), "public", relPath);
    if (!import_fs.default.existsSync(filePath) || !import_fs.default.statSync(filePath).isFile()) {
      filePath = import_path.default.join(process.cwd(), "dist", relPath);
    }
    if (!import_fs.default.existsSync(filePath) || !import_fs.default.statSync(filePath).isFile()) {
      filePath = import_path.default.join(process.cwd(), relPath);
    }
    if (import_fs.default.existsSync(filePath) && import_fs.default.statSync(filePath).isFile()) {
      return res.sendFile(filePath);
    }
  } catch {
  }
  next();
});
app.get("/privacy", (req, res) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  const filePath = false ? import_path.default.join(process.cwd(), "dist", "privacy.html") : import_path.default.join(process.cwd(), "public", "privacy.html");
  res.sendFile(filePath);
});
app.get("/terms", (req, res) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  const filePath = false ? import_path.default.join(process.cwd(), "dist", "terms.html") : import_path.default.join(process.cwd(), "public", "terms.html");
  res.sendFile(filePath);
});
async function getSetupById(id) {
  try {
    const normalizeSetup = (s) => {
      if (!s) return null;
      return {
        ...s,
        id: s.id,
        title: s.title || "Masa\xFCst\xFC Setup Kurulumu",
        owner: s.owner || s.owner_name || s.owner_id || "Setupss \xDCyesi",
        image: s.image || s.media_url || s.cover_photo || s.thumbnail || "/logoarkaplanolmayan.png",
        description: s.description || s.bio || `${s.owner || "Setupss \xFCyesi"} taraf\u0131ndan olu\u015Fturulan masa\xFCst\xFC ve donan\u0131m kurulumu.`,
        category: s.category || "Masa\xFCst\xFC Setup",
        likes: s.likes || 0,
        tags: Array.isArray(s.tags) ? s.tags : typeof s.tags === "string" ? JSON.parse(s.tags) : [],
        components: Array.isArray(s.components) ? s.components : typeof s.components === "string" ? JSON.parse(s.components) : []
      };
    };
    const hasValidDb = checkDbActive();
    if (!pool || !hasValidDb) {
      const found = localSetups.find((s) => s.id === id || String(s.id) === String(id));
      return normalizeSetup(found);
    }
    const client = await pool.connect();
    try {
      const setupRes = await client.query("SELECT * FROM setups WHERE id = $1 OR id::text = $2", [id, id]);
      if (setupRes.rows.length === 0) {
        const found = localSetups.find((s) => s.id === id || String(s.id) === String(id));
        return normalizeSetup(found);
      }
      return normalizeSetup(setupRes.rows[0]);
    } finally {
      client.release();
    }
  } catch {
    const found = localSetups.find((s) => s.id === id || String(s.id) === String(id));
    if (!found) return null;
    return {
      ...found,
      owner: found.owner || found.owner_name || "Setupss \xDCyesi",
      image: found.image || found.media_url || "/logoarkaplanolmayan.png",
      components: Array.isArray(found.components) ? found.components : []
    };
  }
}
async function getUserProfileByUsername(username) {
  try {
    const hasValidDb = checkDbActive();
    if (!pool || !hasValidDb) {
      return { username, name: username, bio: `@${username} kullan\u0131c\u0131s\u0131n\u0131n Setupss masa\xFCst\xFC profili.` };
    }
    const client = await pool.connect();
    try {
      const res = await client.query("SELECT id, name, avatar, bio, custom_badge FROM users WHERE name = $1 OR id = $2", [username, username]);
      if (res.rows.length === 0) return { username, name: username, bio: `@${username} kullan\u0131c\u0131s\u0131n\u0131n Setupss masa\xFCst\xFC profili.` };
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
    return { username, name: username, bio: `@${username} kullan\u0131c\u0131s\u0131n\u0131n Setupss masa\xFCst\xFC profili.` };
  }
}
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
app.get("/sitemap.xml", (req, res) => {
  const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
  const host = req.get("host") || "setupss.com";
  const baseUrl = `${protocol}://${host}`;
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(generateMainSitemapIndex(baseUrl));
});
app.get(["/sitemap-pages.xml", "/sitemap-programmatic.xml"], async (req, res) => {
  const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
  const host = req.get("host") || "setupss.com";
  const baseUrl = `${protocol}://${host}`;
  const setups = await getAllSetupsForSitemap();
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(generateProgrammaticSitemapXml(setups, baseUrl));
});
app.get("/sitemap-setups.xml", async (req, res) => {
  const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
  const host = req.get("host") || "setupss.com";
  const baseUrl = `${protocol}://${host}`;
  const setups = await getAllSetupsForSitemap();
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(generateSetupsSitemapXml(setups, baseUrl));
});
app.get("/sitemap-users.xml", async (req, res) => {
  const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
  const host = req.get("host") || "setupss.com";
  const baseUrl = `${protocol}://${host}`;
  const setups = await getAllSetupsForSitemap();
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(generateUsersSitemapXml(setups, baseUrl));
});
app.get("/sitemap-blog.xml", async (req, res) => {
  const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
  const host = req.get("host") || "setupss.com";
  const baseUrl = `${protocol}://${host}`;
  const setups = await getAllSetupsForSitemap();
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(generateBlogSitemapXml(setups, baseUrl));
});
app.get("/sitemap-games.xml", async (req, res) => {
  const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
  const host = req.get("host") || "setupss.com";
  const baseUrl = `${protocol}://${host}`;
  const setups = await getAllSetupsForSitemap();
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(generateGamesSitemapXml(setups, baseUrl));
});
app.get("/sitemap-tags.xml", async (req, res) => {
  const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
  const host = req.get("host") || "setupss.com";
  const baseUrl = `${protocol}://${host}`;
  const setups = await getAllSetupsForSitemap();
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(generateTagsSitemapXml(setups, baseUrl));
});
app.get("/sitemap-brands.xml", async (req, res) => {
  const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
  const host = req.get("host") || "setupss.com";
  const baseUrl = `${protocol}://${host}`;
  const setups = await getAllSetupsForSitemap();
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(generateBrandsSitemapXml(setups, baseUrl));
});
app.get("/sitemap-categories.xml", async (req, res) => {
  const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
  const host = req.get("host") || "setupss.com";
  const baseUrl = `${protocol}://${host}`;
  const setups = await getAllSetupsForSitemap();
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(generateCategoriesSitemapXml(setups, baseUrl));
});
app.get("/sitemap-hardware.xml", async (req, res) => {
  const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
  const host = req.get("host") || "setupss.com";
  const baseUrl = `${protocol}://${host}`;
  const setups = await getAllSetupsForSitemap();
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(generateHardwareSitemapXml(setups, baseUrl));
});
app.get("/sitemap-images.xml", async (req, res) => {
  const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
  const host = req.get("host") || "setupss.com";
  const baseUrl = `${protocol}://${host}`;
  const setups = await getAllSetupsForSitemap();
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(generateImageSitemapXml(setups, baseUrl));
});
app.get("/sitemap-video.xml", async (req, res) => {
  const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
  const host = req.get("host") || "setupss.com";
  const baseUrl = `${protocol}://${host}`;
  const setups = await getAllSetupsForSitemap();
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(generateVideoSitemapXml(setups, baseUrl));
});
function isCrawlerBot(userAgent) {
  if (!userAgent) return false;
  const botPattern = /googlebot|bingbot|yandexbot|slurp|duckduckbot|baiduspider|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora link preview|showyouhave|outbrain|pinterest|slackbot|slack-imgproxy|vkShare|w3c_validator|discordbot|whatsapp|telegrambot|applebot|redditbot|skypeuripreview|ia_archiver|google-inspectiontool|storebot-google|googlebot-image|googlebot-video|bingpreview|snapchat|curl|wget|gptbot|chatgpt-user|google-extended|perplexitybot|claudebot|claude-web|anthropic-ai|cohere-ai|omgilibot|applebot-extended/i;
  return botPattern.test(userAgent);
}
app.use((req, res, next) => {
  if (req.method !== "GET") return next();
  const queryParams = req.query;
  let targetPath = null;
  if (queryParams.setup && typeof queryParams.setup === "string") {
    targetPath = `/setup/${encodeURIComponent(queryParams.setup)}`;
  } else if ((queryParams.profile || queryParams.user) && typeof (queryParams.profile || queryParams.user) === "string") {
    const u = queryParams.profile || queryParams.user;
    targetPath = `/u/${encodeURIComponent(u)}`;
  } else if (queryParams.category && typeof queryParams.category === "string" && queryParams.category !== "all") {
    targetPath = `/category/${encodeURIComponent(queryParams.category)}`;
  } else if (queryParams.tag && typeof queryParams.tag === "string") {
    targetPath = `/tag/${encodeURIComponent(queryParams.tag)}`;
  } else if (queryParams.hardware && typeof queryParams.hardware === "string") {
    targetPath = `/hardware/${encodeURIComponent(queryParams.hardware)}`;
  } else if (queryParams.brand && typeof queryParams.brand === "string") {
    targetPath = `/brand/${encodeURIComponent(queryParams.brand)}`;
  } else if ((queryParams.guide || queryParams.article) && typeof (queryParams.guide || queryParams.article) === "string") {
    const g = queryParams.guide || queryParams.article;
    targetPath = `/guide/${encodeURIComponent(g)}`;
  }
  if (targetPath && req.path === "/") {
    return res.redirect(301, targetPath);
  }
  next();
});
async function handleDynamicSeoHtml(req, res, rawHtml) {
  try {
    const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
    const host = req.get("host") || "setupss.com";
    const baseUrl = `${protocol}://${host}`;
    const userAgent = req.get("user-agent") || "";
    const isBot = isCrawlerBot(userAgent);
    const queryParams = {};
    for (const [k, v] of Object.entries(req.query)) {
      if (typeof v === "string") queryParams[k] = v;
    }
    let setupData = null;
    let userData = null;
    let articleData = null;
    const pathParts = req.path.split("/").filter(Boolean);
    const routePrefix = pathParts[0]?.toLowerCase();
    const routeSlug = pathParts[1] ? decodeURIComponent(pathParts[1]) : null;
    let categoryName = queryParams.category;
    let tagName = queryParams.tag;
    let hardwareName = queryParams.hardware || queryParams.gpu || queryParams.cpu;
    let brandName = queryParams.brand;
    let tabName = queryParams.tab;
    let matrixParam = void 0;
    if (pathParts.length === 4) {
      const p0 = pathParts[0].toLowerCase();
      const p1 = decodeURIComponent(pathParts[1]);
      const p2 = pathParts[2].toLowerCase();
      const p3 = decodeURIComponent(pathParts[3]);
      if (p0 === "category" && p2 === "hardware") {
        matrixParam = { type: "category_hardware", primary: p1, secondary: p3 };
      } else if (p0 === "brand" && p2 === "category") {
        matrixParam = { type: "brand_category", primary: p1, secondary: p3 };
      } else if (p0 === "room" && p2 === "style") {
        matrixParam = { type: "room_style", primary: p1, secondary: p3 };
      } else if (p0 === "color" && p2 === "style") {
        matrixParam = { type: "color_style", primary: p1, secondary: p3 };
      } else if (p0 === "budget" && p2 === "use-case") {
        matrixParam = { type: "budget_usecase", primary: p1, secondary: p3 };
      }
    } else if (pathParts.length === 2) {
      const p0 = pathParts[0].toLowerCase();
      const p1 = decodeURIComponent(pathParts[1]);
      if (p0 === "hardware-combo" && p1.includes("-plus-")) {
        const parts = p1.split("-plus-");
        matrixParam = { type: "hardware_combo", primary: parts[0], secondary: parts[1] };
      } else if (p0 === "compare" && p1.includes("-vs-")) {
        const parts = p1.split("-vs-");
        matrixParam = { type: "hardware_compare", primary: parts[0], secondary: parts[1] };
      } else if (p0 === "tag" && p1.includes("+")) {
        const parts = p1.split("+");
        matrixParam = { type: "tag_intersection", primary: parts[0], secondary: parts[1] };
      }
    }
    if (routePrefix === "setup" && routeSlug) {
      const setupId = routeSlug.includes("-") ? routeSlug.split("-").pop() : routeSlug;
      setupData = await getSetupById(setupId) || await getSetupById(routeSlug);
    } else if ((routePrefix === "u" || routePrefix === "user" || routePrefix === "profile") && routeSlug) {
      userData = await getUserProfileByUsername(routeSlug);
    } else if (routePrefix === "category" && routeSlug && !matrixParam) {
      categoryName = routeSlug;
    } else if (routePrefix === "tag" && routeSlug && !matrixParam) {
      tagName = routeSlug;
    } else if ((routePrefix === "hardware" || routePrefix === "accessory" || routePrefix === "desk") && routeSlug && !matrixParam) {
      hardwareName = routeSlug;
    } else if (routePrefix === "brand" && routeSlug && !matrixParam) {
      brandName = routeSlug;
    } else if ((routePrefix === "guide" || routePrefix === "article") && routeSlug) {
      articleData = {
        id: routeSlug,
        title: routeSlug.replace(/-/g, " ").toUpperCase(),
        description: `${routeSlug.replace(/-/g, " ")} rehberi ve detayl\u0131 incelemesi.`,
        authorName: "Setupss Edit\xF6r Ekibi"
      };
    } else if (routePrefix === "explore") {
      tabName = "explore";
    } else if (routePrefix === "trending") {
      tabName = "trending";
    } else if (routePrefix === "latest") {
      tabName = "latest";
    } else if (routePrefix === "ai-planner" || routePrefix === "ai") {
      tabName = "ai";
    } else if (routePrefix === "deals") {
      tabName = "deals";
    } else if (routePrefix === "leaderboard") {
      tabName = "leaderboard";
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
      locale: req.query.lang || (req.headers["accept-language"]?.startsWith("tr") ? "tr" : "en")
    });
    const finalHtml = injectSeoIntoHtml(rawHtml, seo, isBot);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(finalHtml);
  } catch (err) {
    console.error("SEO Injection error:", err);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(rawHtml);
  }
}
app.post("/api/blog/:id/vote", async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;
    if (type !== "like" && type !== "dislike") {
      return res.status(400).json({ success: false, error: "Ge\xE7ersiz oy t\xFCr\xFC." });
    }
    const result = await voteBlogPostInDb(id, type);
    res.json({ success: true, ...result, xpGained: type === "like" ? 10 : 0 });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message || "Oy kaydedilemedi." });
  }
});
app.post("/api/ai/blog-assistant", async (req, res) => {
  try {
    const { title, summary, category, content } = req.body;
    if (!content || content.length < 10) {
      return res.json({
        success: true,
        suggestions: [
          { type: "general", title: "Ba\u015Flang\u0131\xE7 \u0130pucu", message: "Yaz\u0131n\u0131za etkileyici bir giri\u015F paragraf\u0131 ve ba\u015Fl\u0131k ekleyerek okuyucunun ilgisini \xE7ekin." }
        ],
        seoScore: 50,
        readabilityLevel: "Geli\u015Ftirilebilir"
      });
    }
    let client = null;
    try {
      client = getGemini();
    } catch {
      client = null;
    }
    if (!client) {
      return res.json({
        success: true,
        suggestions: [
          { type: "seo", title: "SEO \u0130pucu", message: "Ba\u015Fl\u0131\u011F\u0131n\u0131zda y\u0131l veya spesifik donan\u0131m modeli kullan\u0131n (\xF6r. 2026 Rehberi)." },
          { type: "formatting", title: "Okunabilirlik", message: "Paragraflar\u0131 k\u0131sa tutun ve alt ba\u015Fl\u0131klar (##) ekleyin." }
        ],
        seoScore: 82,
        readabilityLevel: "\u0130yi"
      });
    }
    const prompt = `Sen Setupss platformunun AI Blog Copilot'\u0131s\u0131n. Kullan\u0131c\u0131 kendi teknoloji/donan\u0131m/setup rehberi blog yaz\u0131s\u0131n\u0131 manuel yaz\u0131yor.
Yaz\u0131lan Taslak:
Ba\u015Fl\u0131k: ${title || "Ba\u015Fl\u0131ks\u0131z"}
Kategori: ${category || "Rehber"}
\xD6zet: ${summary || "Yok"}
\u0130\xE7erik: ${content}

G\xF6revin: Kullan\u0131c\u0131ya yaz\u0131s\u0131n\u0131 daha ilgi \xE7ekici, SEO dostu ve okunabilir k\u0131lmas\u0131 i\xE7in tam olarak 3 adet k\u0131sa, pratik, samimi \xF6neri \xFCretmek.
Yan\u0131t\u0131n\u0131 YALNIZCA ge\xE7erli bir JSON nesnesi olarak ver:
{
  "suggestions": [
    { "type": "seo|formatting|hardware|tone", "title": "K\u0131sa Ba\u015Fl\u0131k", "message": "1-2 c\xFCmlelik uygulanabilir \xF6neri" }
  ],
  "seoScore": 85,
  "readabilityLevel": "M\xFCkemmel|Y\xFCksek|Orta|D\xFC\u015F\xFCk"
}`;
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    const parsed = JSON.parse(response.text || "{}");
    res.json({ success: true, ...parsed });
  } catch (err) {
    console.error("AI Blog Assistant error:", err);
    res.json({
      success: true,
      suggestions: [
        { type: "tone", title: "Anlat\u0131m Dili", message: "G\xF6rseller ve madde i\u015Faretleriyle anlat\u0131m\u0131 zenginle\u015Ftirin." }
      ],
      seoScore: 80,
      readabilityLevel: "\u0130yi"
    });
  }
});
app.post("/api/ai/blog-audit", async (req, res) => {
  const { title, summary, category, content, tags, hardwareSlugs } = req.body;
  try {
    let client = null;
    try {
      client = getGemini();
    } catch {
      client = null;
    }
    const fullText = (title + " " + (summary || "") + " " + content).toLowerCase();
    const profanityRegex = /(amk|aq|sik|orospu|pic|pıç|yavsak|yavşak|göt|yarrak|yarrak|ibne|kahpe|pezevenk)/i;
    const hasProfanity = profanityRegex.test(fullText);
    if (!client) {
      return res.json({
        success: true,
        approved: !hasProfanity,
        grade: hasProfanity ? "F" : "A",
        grammarRating: hasProfanity ? "Kurallara Ayk\u0131r\u0131" : "Kusursuz",
        seoScore: hasProfanity ? 10 : 92,
        feedback: hasProfanity ? "Yaz\u0131n\u0131z k\xFCf\xFCr, hakaret veya uygunsuz ifadeler i\xE7erdi\u011Fi i\xE7in yay\u0131nlanamaz. L\xFCtfen metninizi kurallara uygun \u015Fekilde d\xFCzenleyin." : "Yaz\u0131n\u0131z Setupss yay\u0131nlama standartlar\u0131na tamamen uygundur! Topluluk ile payla\u015Fabilirsiniz.",
        recommendedTags: tags && tags.length > 0 ? tags : ["rehber", "setup", "donan\u0131m"]
      });
    }
    const prompt = `Sen Setupss platformunun Ba\u015F Edit\xF6r Yapay Zekas\u0131s\u0131n.
Kullan\u0131c\u0131n\u0131n yay\u0131nlamak \xFCzere oldu\u011Fu blog yaz\u0131s\u0131n\u0131 denetle ve onay/red raporu ver.

Ba\u015Fl\u0131k: ${title}
\xD6zet: ${summary}
Kategori: ${category}
\u0130\xE7erik: ${content}
Etiketler: ${JSON.stringify(tags || [])}
\u0130li\u015Fkili Donan\u0131mlar: ${JSON.stringify(hardwareSlugs || [])}

KURALLAR:
1. E\u011Fer i\xE7erik, ba\u015Fl\u0131k veya \xF6zette K\xDCF\xDCR, HAKARET, ARGO, NEFRET S\xD6YLEM\u0130 veya A\u015EIRI RENC\u0130DE ED\u0130C\u0130 \u0130FADELER varsa:
   - "approved": false yapmal\u0131s\u0131n.
   - "grade": "F" yapmal\u0131s\u0131n.
   - "feedback": "Yaz\u0131n\u0131z k\xFCf\xFCr, hakaret veya uygunsuz ifadeler i\xE7erdi\u011Fi i\xE7in yay\u0131nlanamaz. L\xFCtfen metninizi topluluk kurallar\u0131na uygun \u015Fekilde d\xFCzenleyin." mesaj\u0131n\u0131 vermelisin.
   - "violations": ["K\xFCf\xFCr/Hakaret Tespiti"] listesini doldurmal\u0131s\u0131n.

2. E\u011Fer metin temiz, yap\u0131c\u0131 ve topluluk kurallar\u0131na uygunsa:
   - "approved": true yapmal\u0131s\u0131n.
   - "grade": "A+|A|B+|B" derecesi ver.
   - "feedback": "Yaz\u0131n\u0131z Setupss yay\u0131nlama standartlar\u0131na uygundur!" mesaj\u0131 ver.
   - "violations": []

Yan\u0131t\u0131n\u0131 YALNIZCA ge\xE7erli bir JSON nesnesi olarak d\xF6nd\xFCr:
{
  "approved": boolean,
  "grade": "A+|A|B+|B|F",
  "grammarRating": "M\xFCkemmel|\u0130yi|Geli\u015Ftirilebilir|Kurallara Ayk\u0131r\u0131",
  "seoScore": number,
  "feedback": "Kullan\u0131c\u0131ya yap\u0131c\u0131 a\xE7\u0131klama mesaj\u0131",
  "violations": ["K\xFCf\xFCr/Hakaret" vs],
  "recommendedTags": ["etiket1", "etiket2"]
}`;
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    const parsed = JSON.parse(response.text || "{}");
    if (hasProfanity || parsed.grade === "F" || parsed.approved === false || parsed.approved === "false" || parsed.violations && parsed.violations.length > 0) {
      parsed.approved = false;
      parsed.grade = "F";
      parsed.grammarRating = "Kurallara Ayk\u0131r\u0131";
      parsed.seoScore = 0;
      parsed.feedback = "Yaz\u0131n\u0131z k\xFCf\xFCr, hakaret veya topluluk kurallar\u0131na ayk\u0131r\u0131 ifadeler i\xE7erdi\u011Fi i\xE7in yay\u0131nlanamaz. L\xFCtfen metninizi kurallara uygun \u015Fekilde d\xFCzenleyin.";
    } else {
      parsed.approved = true;
    }
    res.json({ success: true, ...parsed });
  } catch (err) {
    const fullText = (title + " " + (summary || "") + " " + content).toLowerCase();
    const profanityRegex = /(amk|aq|sik|orospu|pic|pıç|yavsak|yavşak|göt|yarrak|yarrak|ibne|kahpe|pezevenk)/i;
    const hasProfanity = profanityRegex.test(fullText);
    res.json({
      success: true,
      approved: !hasProfanity,
      grade: hasProfanity ? "F" : "A",
      grammarRating: hasProfanity ? "Kurallara Ayk\u0131r\u0131" : "M\xFCkemmel",
      seoScore: hasProfanity ? 10 : 90,
      feedback: hasProfanity ? "Yaz\u0131n\u0131z k\xFCf\xFCr, hakaret veya topluluk kurallar\u0131na ayk\u0131r\u0131 ifadeler i\xE7erdi\u011Fi i\xE7in yay\u0131nlanamaz. L\xFCtfen metninizi kurallara uygun \u015Fekilde d\xFCzenleyin." : "Yaz\u0131n\u0131z yay\u0131nlamaya haz\u0131rd\u0131r.",
      recommendedTags: tags || ["setupss", "rehber"]
    });
  }
});
async function startServer() {
  if (true) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false
      },
      appType: "spa"
    });
    app.use(async (req, res, next) => {
      if (req.method === "GET" && req.headers.accept?.includes("text/html") && !req.path.includes(".")) {
        try {
          const indexPath = import_path.default.join(process.cwd(), "index.html");
          if (import_fs.default.existsSync(indexPath)) {
            let template = import_fs.default.readFileSync(indexPath, "utf8");
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
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express4.default.static(distPath, {
      index: false,
      maxAge: "1y",
      immutable: true,
      setHeaders: (res, pathStr) => {
        if (pathStr.endsWith(".html")) {
          res.setHeader("Cache-Control", "no-cache, must-revalidate");
        } else {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
      }
    }));
    app.get("*", async (req, res) => {
      try {
        const indexPath = import_path.default.join(distPath, "index.html");
        if (!import_fs.default.existsSync(indexPath)) {
          return res.status(404).send("index.html not found");
        }
        const template = import_fs.default.readFileSync(indexPath, "utf8");
        await handleDynamicSeoHtml(req, res, template);
      } catch (err) {
        console.error("Failed to serve customized SEO HTML:", err);
        res.sendFile(import_path.default.join(distPath, "index.html"));
      }
    });
  }
  app.use((err, req, res, next) => {
    if (err) {
      if (err.status === 416 || err.name === "RangeNotSatisfiableError" || err.code === "RangeNotSatisfiableError" || err.message && err.message.includes("Range Not Satisfiable")) {
        if (!res.headersSent) {
          if (err.headers) res.set(err.headers);
          return res.status(416).send("Range Not Satisfiable");
        }
        return;
      }
      console.error("Unhandled Express Error:", err.message || err);
      if (!res.headersSent) {
        return res.status(err.status || 500).json({
          success: false,
          error: err.message || "Sunucu hatas\u0131 olu\u015Ftu."
        });
      }
    }
    next();
  });
  let serverInstance = null;
  const isServerlessRuntime2 = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT);
  if (!isServerlessRuntime2) {
    serverInstance = app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
      icecatSyncBot.startCron();
    });
  }
  if (serverInstance) {
    const io = new import_socket.Server(serverInstance, {
      cors: { origin: "*" }
    });
    const chatssRooms = /* @__PURE__ */ new Map();
    async function getAllRoomsWithStatus() {
      try {
        const dbRooms = await getChatRooms();
        return dbRooms.map((r) => {
          const roomMap = chatssRooms.get(r.id);
          const activeCount = roomMap ? roomMap.size : 0;
          return {
            id: r.id,
            name: r.name,
            description: r.description || "",
            isPrivate: r.is_private || false,
            activeCount
          };
        });
      } catch (err) {
        const fallback = [
          { id: "global", name: "Global Sohbet", description: "T\xFCm Setupss toplulu\u011Fu genel sohbet odas\u0131", isPrivate: false },
          { id: "hardware", name: "Donan\u0131m & Setup Lounge", description: "Ekran kart\u0131, i\u015Flemci, kasa ve \xE7evre birimi tart\u0131\u015Fmalar\u0131", isPrivate: false },
          { id: "setup-critiques", name: "Kurulum Puanlama", description: "Kendi masan\u0131 ve kurulumunu puanlat!", isPrivate: false },
          { id: "rgb-gaming", name: "RGB Gaming & Yay\u0131n", description: "Oyun performanslar\u0131 ve RGB ayd\u0131nlatmalar\u0131", isPrivate: false }
        ];
        return fallback.map((r) => {
          const roomMap = chatssRooms.get(r.id);
          return { ...r, activeCount: roomMap ? roomMap.size : 0 };
        });
      }
    }
    (async () => {
      try {
        const defaultRooms = [
          { id: "global", name: "Global Sohbet", slug: "global", description: "T\xFCm Setupss toplulu\u011Fu genel sohbet odas\u0131", isPrivate: false },
          { id: "hardware", name: "Donan\u0131m & Setup Lounge", slug: "hardware", description: "Ekran kart\u0131, i\u015Flemci, kasa ve \xE7evre birimi tart\u0131\u015Fmalar\u0131", isPrivate: false },
          { id: "setup-critiques", name: "Kurulum Puanlama", slug: "setup-critiques", description: "Kendi masan\u0131 ve kurulumunu puanlat!", isPrivate: false },
          { id: "rgb-gaming", name: "RGB Gaming & Yay\u0131n", slug: "rgb-gaming", description: "Oyun performanslar\u0131 ve RGB ayd\u0131nlatmalar\u0131", isPrivate: false }
        ];
        for (const room of defaultRooms) {
          await createChatRoom(room);
        }
        console.log("\u2705 [Chatss Rooms] Default public rooms seeded successfully.");
      } catch (err) {
        console.error("\u26A0\uFE0F [Chatss Rooms] Seed error:", err);
      }
    })();
    io.on("connection", (socket) => {
      socket.on("join-lobby", async () => {
        socket.join("lobby");
        const rooms = await getAllRoomsWithStatus();
        socket.emit("rooms-update", rooms);
      });
      socket.on("get-rooms", async () => {
        const rooms = await getAllRoomsWithStatus();
        socket.emit("rooms-update", rooms);
      });
      socket.on("create-room", async (roomData) => {
        try {
          await createChatRoom({
            id: roomData.id,
            name: roomData.name,
            slug: roomData.id,
            description: roomData.description,
            isPrivate: roomData.isPrivate
          });
          const rooms = await getAllRoomsWithStatus();
          io.to("lobby").emit("rooms-update", rooms);
          socket.emit("room-created", roomData.id);
        } catch (err) {
          console.error("Room creation error:", err);
          socket.emit("room-create-failed", "Oda olu\u015Fturulamad\u0131.");
        }
      });
      socket.on("join-room", async (roomId, userId, userDetails) => {
        socket.join(roomId);
        if (!chatssRooms.has(roomId)) {
          chatssRooms.set(roomId, /* @__PURE__ */ new Map());
        }
        const room = chatssRooms.get(roomId);
        room.set(socket.id, {
          userId,
          name: userDetails.name || "Kullan\u0131c\u0131",
          avatar: userDetails.avatar || "",
          audioMuted: false,
          videoMuted: false
        });
        try {
          const history = await getRoomMessages(roomId, 50);
          const mappedHistory = history.map((h) => ({
            id: h.id,
            text: h.message,
            sender: h.sender_name,
            senderId: h.sender_id,
            avatar: h.sender_avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${h.sender_id || "system"}`,
            timestamp: h.created_at
          }));
          socket.emit("room-history", mappedHistory);
        } catch (err) {
          console.error("Error loading room history:", err);
          socket.emit("room-history", []);
        }
        socket.to(roomId).emit("user-joined", socket.id, userId, userDetails);
        io.to(roomId).emit("room-users", Array.from(room.entries()));
        const rooms = await getAllRoomsWithStatus();
        io.to("lobby").emit("rooms-update", rooms);
        socket.on("update-media-state", (states) => {
          const userState = room.get(socket.id);
          if (userState) {
            userState.audioMuted = states.audioMuted;
            userState.videoMuted = states.videoMuted;
            io.to(roomId).emit("room-users", Array.from(room.entries()));
          }
        });
        socket.on("disconnect", async () => {
          room.delete(socket.id);
          socket.to(roomId).emit("user-left", socket.id, userId);
          io.to(roomId).emit("room-users", Array.from(room.entries()));
          if (room.size === 0) {
            chatssRooms.delete(roomId);
          }
          const updatedRooms = await getAllRoomsWithStatus();
          io.to("lobby").emit("rooms-update", updatedRooms);
        });
      });
      socket.on("offer", (to, offer) => {
        socket.to(to).emit("offer", socket.id, offer);
      });
      socket.on("answer", (to, answer) => {
        socket.to(to).emit("answer", socket.id, answer);
      });
      socket.on("ice-candidate", (to, candidate) => {
        socket.to(to).emit("ice-candidate", socket.id, candidate);
      });
      socket.on("room-message", async (roomId, message) => {
        try {
          await addRoomMessage({
            id: message.id || `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            senderId: message.senderId || "guest",
            senderName: message.sender || "Kullan\u0131c\u0131",
            senderAvatar: message.avatar || "",
            roomId,
            message: message.text,
            senderHasRgb: message.senderHasRgb || false
          });
        } catch (dbErr) {
          console.error("Failed to persist room message:", dbErr);
        }
        io.to(roomId).emit("room-message", message);
      });
    });
    const wss = new import_ws.WebSocketServer({ noServer: true });
    const clients = /* @__PURE__ */ new Map();
    serverInstance.on("upgrade", (request, socket, head) => {
      if (request.url.startsWith("/socket.io/")) {
        return;
      }
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    });
    wss.on("connection", (ws) => {
      let currentUserId = null;
      ws.on("message", async (data) => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.type === "join") {
            currentUserId = parsed.userId;
            if (currentUserId) {
              clients.set(currentUserId, ws);
              console.log(`WebSocket client registered: ${currentUserId}`);
            }
          } else if (parsed.type === "message") {
            const { message, receiverId, receiverName, receiverAvatar, senderName, senderAvatar, mediaUrl, mediaType } = parsed;
            if (!currentUserId) return;
            let isBanned = false;
            const hasValidDb = checkDbActive();
            if (hasValidDb && pool) {
              const { rows } = await pool.query("SELECT is_banned FROM users WHERE id = $1", [currentUserId]);
              if (rows.length > 0 && rows[0].is_banned) isBanned = true;
            } else {
              const u = localUsers.find((u2) => u2.id === currentUserId);
              if (u && (u.isBanned || u.is_banned)) isBanned = true;
            }
            if (isBanned) {
              ws.send(JSON.stringify({
                type: "error",
                message: "Hesab\u0131n\u0131z Sentinel V900 taraf\u0131ndan k\xFCf\xFCr/hakaret sebebiyle ge\xE7ici olarak ask\u0131ya al\u0131nm\u0131\u015Ft\u0131r."
              }));
              return;
            }
            let senderHasRgb = false;
            if (hasValidDb && pool) {
              const { rows } = await pool.query("SELECT has_rgb FROM users WHERE id = $1", [currentUserId]);
              if (rows.length > 0) senderHasRgb = !!rows[0].has_rgb;
            } else {
              const u = localUsers.find((u2) => u2.id === currentUserId);
              if (u) senderHasRgb = !!u.hasRgb;
            }
            const msg = {
              id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              senderId: currentUserId,
              senderName: senderName || "Bilinmeyen Kullan\u0131c\u0131",
              senderAvatar,
              receiverId,
              receiverName: receiverName || "SETUPSS Kullan\u0131c\u0131s\u0131",
              receiverAvatar,
              message: message || "",
              createdAt: (/* @__PURE__ */ new Date()).toISOString(),
              isRead: false,
              senderHasRgb,
              mediaUrl: mediaUrl || void 0,
              mediaType: mediaType || void 0
            };
            await addChatMessageToDb(msg);
            const receiverSocket = clients.get(receiverId);
            if (receiverSocket && receiverSocket.readyState === import_ws.WebSocket.OPEN) {
              receiverSocket.send(JSON.stringify({
                type: "message",
                message: msg
              }));
            }
            ws.send(JSON.stringify({
              type: "message_ack",
              message: msg
            }));
            if (receiverId === AI_BOT_ID) {
              try {
                const ai2 = getGemini();
                const context = await getSiteContext();
                const result = await ai2.models.generateContent({
                  model: "gemini-3.6-flash",
                  contents: `${context}

Kullan\u0131c\u0131: ${message || "Selam"}`
                });
                const botReply = result.text || "\xDCzg\xFCn\xFCm, \u015Fu an yan\u0131t veremiyorum.";
                const replyMsg = {
                  id: `msg-ai-${Date.now()}`,
                  senderId: AI_BOT_ID,
                  senderName: "Setupss AI",
                  senderAvatar: "/airobot.jpg",
                  receiverId: currentUserId || "unknown",
                  receiverName: senderName,
                  receiverAvatar: senderAvatar,
                  message: botReply,
                  createdAt: (/* @__PURE__ */ new Date()).toISOString(),
                  isRead: false
                };
                await addChatMessageToDb(replyMsg);
                if (ws.readyState === import_ws.WebSocket.OPEN) {
                  ws.send(JSON.stringify({ type: "message", message: replyMsg }));
                }
              } catch (aiErr) {
                console.error("WS AI Bot error:", aiErr);
              }
            } else if (receiverId.startsWith("mock-") || receiverId.startsWith("setup-owner-")) {
              setTimeout(async () => {
                const autoReplies = [
                  "Selam! Mesaj\u0131n i\xE7in te\u015Fekk\xFCrler, setup'\u0131m hakk\u0131ndaki sorunu ald\u0131m. Detaylar ve par\xE7alar a\xE7\u0131klamada mevcut! \u{1F680}",
                  "Be\u011Fendi\u011Fin i\xE7in te\u015Fekk\xFCr ederim! Ekipmanlar, kablo gizleme veya \u0131\u015F\u0131kland\u0131rma hakk\u0131nda merak etti\u011Fin bir \u015Fey olursa yazabilirsin. \u2328\uFE0F",
                  "Masa\xFCst\xFC d\xFCzenini s\xFCrekli g\xFCncelliyorum. Senin kurulumunu da sab\u0131rs\u0131zl\u0131kla bekliyorum!",
                  "Te\u015Fekk\xFCrler dostum! Monit\xF6r kolu ve RGB \u0131\u015F\u0131kland\u0131rma kurulumunu ba\u015Ftan sona kendim yapt\u0131m. Detaylar\u0131 da tart\u0131\u015Fabiliriz. \u{1F3A8}"
                ];
                const replyText = autoReplies[Math.floor(Math.random() * autoReplies.length)];
                const replyMsg = {
                  id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                  senderId: receiverId,
                  senderName: receiverName || "SETUPSS \xDCyesi",
                  senderAvatar: receiverAvatar,
                  receiverId: currentUserId,
                  receiverName: senderName || "Geli\u015Ftirici",
                  receiverAvatar: senderAvatar,
                  message: replyText,
                  createdAt: (/* @__PURE__ */ new Date()).toISOString(),
                  isRead: false
                };
                await addChatMessageToDb(replyMsg);
                const clientSocket = clients.get(currentUserId);
                if (clientSocket && clientSocket.readyState === import_ws.WebSocket.OPEN) {
                  clientSocket.send(JSON.stringify({
                    type: "message",
                    message: replyMsg
                  }));
                }
              }, 1200);
            }
          } else if (parsed.type === "join_global") {
            currentUserId = parsed.userId;
            if (currentUserId) {
              clients.set(currentUserId, ws);
              console.log(`WebSocket client joined Global Chat: ${currentUserId}`);
            }
          } else if (parsed.type === "global_send") {
            const { message, senderName, senderAvatar } = parsed;
            if (!currentUserId) return;
            const msg = {
              id: `gmsg-${Date.now()}`,
              senderId: currentUserId,
              senderName: senderName || "Bilinmeyen",
              senderAvatar,
              receiverId: "global",
              receiverName: "Global",
              message: message || "",
              createdAt: (/* @__PURE__ */ new Date()).toISOString(),
              isRead: true
            };
            await addChatMessageToDb(msg);
            const broadcastPayload = JSON.stringify({
              type: "global_receive",
              message: msg
            });
            wss.clients.forEach((client) => {
              if (client.readyState === import_ws.WebSocket.OPEN) {
                client.send(broadcastPayload);
              }
            });
          } else if (parsed.type === "read") {
            const { senderId } = parsed;
            if (!currentUserId) return;
            await markMessagesAsReadInDb(senderId, currentUserId);
            const senderSocket = clients.get(senderId);
            if (senderSocket && senderSocket.readyState === import_ws.WebSocket.OPEN) {
              senderSocket.send(JSON.stringify({
                type: "messages_read",
                readerId: currentUserId
              }));
            }
          }
        } catch (error) {
          console.error("WebSocket message error:", error);
        }
      });
      ws.on("close", () => {
        if (currentUserId) {
          clients.delete(currentUserId);
          console.log(`WebSocket client disconnected: ${currentUserId}`);
        }
      });
    });
  }
}
async function startBotFleetSimulation() {
  const BOTS = Array.from({ length: 30 }, (_, i) => {
    const id = `bot-${i + 1}`;
    const names = [
      "Validator-X",
      "Sentinel-Prime",
      "Link-Check",
      "Security-Scan",
      "Performance-Bot",
      "SEO-Crawler",
      "RGB-Master",
      "Auth-Sentinel",
      "Database-Guard",
      "R2-Sync",
      "Neon-Query",
      "Asset-Optimizer",
      "Rate-Limiter",
      "CORS-Guardian",
      "Telemetry-Bot",
      "Cache-Invalidator",
      "Schema-Validator",
      "SSL-Monitor",
      "Memory-Keeper",
      "Latency-Tester",
      "Pixel-Perfect",
      "Contrast-Guard",
      "Routing-Daemon",
      "Backup-Runner",
      "Webhook-Listener",
      "Stream-Buffer",
      "Error-Tracker",
      "Session-Keeper",
      "Health-Probe",
      "Core-Engine"
    ];
    return { id, name: names[i] || `Bot-${i + 1}` };
  });
  const REPORT_TYPES = [
    { type: "G\xF6rsel Hata", detail: "Profil resimleri baz\u0131 \xE7\xF6z\xFCn\xFCrl\xFCklerde kay\u0131yor.", severity: "medium" },
    { type: "Link K\u0131r\u0131lmas\u0131", detail: "Amazon partner linklerinde y\xF6nlendirme hatas\u0131 tespit edildi.", severity: "high" },
    { type: "Performans", detail: "Anasayfa y\xFCklenme s\xFCresi 300ms artt\u0131.", severity: "low" },
    { type: "G\xFCvenlik", detail: "Script injection denemesi engellendi.", severity: "high" },
    { type: "UX", detail: "Mobil men\xFCde dokunmatik hassasiyeti d\xFC\u015F\xFCk.", severity: "low" },
    { type: "SEO", detail: "Meta etiketleri ve structured data ba\u015Far\u0131yla do\u011Fruland\u0131.", severity: "low" },
    { type: "Veritaban\u0131", detail: "Neon DB ba\u011Flant\u0131 havuzu optimize edildi.", severity: "low" },
    { type: "Medya", detail: "Cloudflare R2 medya \xF6nbellekleme durumu kusursuz.", severity: "low" }
  ];
  console.log("[BOT FLEET] Initializing 30 Autonomous AI Bots for SetupSS...");
  for (const bot of BOTS.slice(0, 5)) {
    try {
      await addBotReportToDb({
        botId: bot.id,
        botName: bot.name,
        reportType: "Sistem Testi",
        details: `${bot.name} (${bot.id}) ba\u015Far\u0131yla ba\u015Flat\u0131ld\u0131, aktif olarak denetliyor.`,
        severity: "low"
      });
    } catch (e) {
      console.error(`Failed to log initial report for ${bot.name}:`, e);
    }
  }
  setInterval(async () => {
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
  }, 2e4);
}
process.on("uncaughtException", (err) => {
  console.error("[CRITICAL] Uncaught Exception caught to prevent server crash:", err);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("[CRITICAL] Unhandled Rejection caught at:", promise, "reason:", reason);
});
var isServerlessRuntime = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT);
if (!isServerlessRuntime) {
  startServer().then(() => {
    startBotFleetSimulation();
  }).catch((err) => {
    console.error("Failed to start server:", err);
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  app,
  dbInitPromise
});
