export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  coverImage: string;
  authorName: string;
  authorAvatar?: string;
  readTimeMinutes: number;
  tags: string[];
  hardwareSlugs: string[];
  isPublished: boolean;
  likesCount?: number;
  dislikesCount?: number;
  createdAt: string;
  updatedAt: string;
}

export const SEED_BLOG_POSTS: BlogPost[] = [
  {
    id: "blog-1",
    title: "2026 En İyi Oyuncu Koltuğu Seçimi: Ergonomi, Kumaş vs Deri ve Bel Destek Rehberi",
    slug: "en-iyi-oyuncu-koltugu-secimi",
    summary: "Masa başında uzun saatler geçiren oyuncular ve yazılımcılar için doğru koltuk seçimi bel ve boyun sağlığı için hayati önem taşır. Herman Miller, Secretlab, Corsair ve f/p alternatiflerinin detaylı analizi.",
    category: "Ergonomi & Mobilya",
    coverImage: "https://images.unsplash.com/photo-1580481072645-022f9a6d1270?auto=format&fit=crop&w=1200&q=80",
    authorName: "Beşir Hanzo",
    authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80",
    readTimeMinutes: 7,
    tags: ["oyuncukoltuğu", "ergonomi", "hermanmiller", "setupkombinasyon", "mobilya"],
    hardwareSlugs: ["herman-miller-aeron", "yazi-masasi-bulut-lambasi"],
    isPublished: true,
    createdAt: "2026-02-10T10:00:00.000Z",
    updatedAt: "2026-02-10T10:00:00.000Z",
    content: `
# 2026 En İyi Oyuncu ve Çalışma Koltuğu Seçimi

Günde 8 saatten fazla masa başında çalışan veya oyun oynayan herkes için koltuk, sistemin ekran kartı ya da işlemcisi kadar önemlidir. Yanlış bir oturma pozisyonu kronik bel, boyun ve sırt ağrılarına yol açabilir.

## 1. Ergonomik Ofis Koltuğu mu, Oyuncu Koltuğu mu?

Son yıllarda "Gaming Chair" kategorisi popülerleşse de profesyonel ergonomistler genellikle **fileli ergonomik ofis koltuklarını** önerir.

* **Fileli (Mesh) Koltuklar:** Terletmez, omurganın doğal S kavisini destekler ve basıncı eşit dağıtır. (Örn: *Herman Miller Aeron*, *IKEA Markus*).
* **Oyuncu (Yarış Tipi) Koltuklar:** Yanal destek sağlar, dik duruşu zorunlu kılar ancak nefes almayan suni deri modeller sıcak havalarda rahatsızlık verebilir.

## 2. Kumaş mı Suni Deri mi?

* **Kumaş Kaplama:** Nefes alabilir, uzun ömürlüdür, soyulma yapmaz. Temizliği leke tutmaz kumaş teknolojileriyle kolaylaşmıştır.
* **PU / Suni Deri:** Şık durur ve sıvı dökülmelerine karşı dayanıklıdır ancak 1-2 yıl sonra aşınabilir.

## 3. Bel ve Boyun Desteği Nasıl Olmalı?

İdeal bir koltukta mutlaka **yükseklik ve derinlik ayarlı bel desteği (Lumbar Support)** bulunmalıdır. Sabit minderli koltuklar herkesin vücut yapısına uymayabilir.

### Öne Çıkan Tavsiyeler

1. **Üst Segment:** Herman Miller Aeron / Secretlab Titan EVO
2. **Fiyat/Performans:** IKEA Markus / Jarvfjallet
3. **Oyuncu Odaklı Kumaş:** Corsair T3 Rush / xDrive Altay
`
  },
  {
    id: "blog-2",
    title: "Mekanik Klavye Switch Rehberi: Red, Brown, Blue ve Custom Linear Karşılaştırması",
    slug: "mekanik-klavye-switch-rehberi",
    summary: "Mekanik klavye dünyasında doğru switch seçimi yazma hissiyatını, ses profilini ve oyun performansını baştan yaratır. Dokunsal (tactile), lineer (linear) ve sesli (clicky) switch farkları.",
    category: "Klavye & Mouse",
    coverImage: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1200&q=80",
    authorName: "Zeynep Tasarım",
    authorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&h=200&q=80",
    readTimeMinutes: 6,
    tags: ["mekanikklavye", "customkeyboard", "gmmkpro", "keychron", "switches"],
    hardwareSlugs: ["gmmk-pro-custom-mechanical-keyboard", "custom-mechanical-keyboard", "epomaker-ek68-pastel-custom"],
    isPublished: true,
    createdAt: "2026-02-12T14:30:00.000Z",
    updatedAt: "2026-02-12T14:30:00.000Z",
    content: `
# Mekanik Klavye Switch Rehberi

Custom mekanik klavyeler günümüzde bir tutku ve estetik öğesi haline geldi. Ancak işin kalbinde her zaman **switch (anahtar)** teknolojisi yatar.

## Switch Türleri ve Özellikleri

### 1. Lineer (Linear) Switchler (Kırmızı, Sarı, Siyah)
* **Hissiyat:** Pürüzsüz, takılmasız aşağı doğru kayma.
* **Kullanım:** FPS oyunları ve hızlı reaksiyon gerektiren durumlar için idealdir.
* **Örnekler:** Cherry MX Red, Gateron Oil King, Akko Yellow.

### 2. Dokunsal (Tactile) Switchler (Kahverengi, Kutsal Panda)
* **Hissiyat:** Tuşa basarken ortada hafif bir "tümsek" hissedilir.
* **Kullanım:** Yazılım geliştirenler ve daktilo hissiyatı sevenler için mükemmel denge.
* **Örnekler:** Cherry MX Brown, Boba U4T, Glorious Panda.

### 3. Klikli (Clicky) Switchler (Mavi, Yeşil)
* **Hissiyat:** Her basışta net bir daktilo sesi ve dokunsal geri bildirim.
* **Kullanım:** Tek başına çalışanlar için keyifli, açık ofislerde arkadaş kaybettirebilir!

## Modding ve Ses Profili (Thock vs Clack)

* **Lubing (Yağlama):** Krytox 205g0 ile switchleri yağlamak sürtünmeyi yok eder ve daha tok ("thocky") bir ses verir.
* **Gasket Mount:** Kasadaki esneklik tuş basış hissini yumuşatır (Örn: *GMMK Pro*, *Epomaker EK68*).
`
  },
  {
    id: "blog-3",
    title: "Masaüstü Kablo Yönetimi ve RGB Aydınlatma Rehberi: Temiz ve Modern Setup İpuçları",
    slug: "masaustu-kablo-yonetimi-ve-rgb-aydinlatma-rehberi",
    summary: "Karmaşık kablo yığınlarından kurtulup Pinterest ve Reddit battlestations kalitesinde temiz bir masaüstü görünümü elde etmenin 7 profesyonel adımı.",
    category: "Kablo Yönetimi & Işık",
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
# Masaüstü Kablo Yönetimi ve RGB Aydınlatma Rehberi

Harika bir bilgisayar kasası ve çift monitör alsanız bile, masanın arkasından sarkan kablolar tüm estetiği bozabilir. İşte kabloları tamamen gizleme ve ortam ışığını profesyonelleştirme rehberi.

## Kablo Gizleme Sanatı (Cable Management)

1. **Masa Altı Kablo Kanalları (Signum / J-Channel):**
   Masanın altına vidalanan veya yapıştırılan kablo tepsileri priz bloklarını ve adaptörleri saklamak için şarttır.
2. **Kablo Çorapları ve Cırt Cırt Kelepçeler:**
   Monitörden kasaya giden güç ve görüntü kablolarını tek bir spiral çorap içine toplayın.
3. **Kablosuz Çevre Birimleri:**
   Kablosuz klavye ve mouse kullanımı masa yüzeyini anında %50 daha ferah gösterir.

## Atmosferik RGB Aydınlatma İpuçları

* **Göz Yormayan Arka Işık (Bias Lighting):** Monitör arkasına yapıştırılan 4000K ılık beyaz LED şeritler göz yorgunluğunu azaltır.
* **Monitör Işık Çubukları (Screenbar):** *BenQ Screenbar Halo* veya Xiaomi Screenbar masaya doğrudan ışık verirken ekranda yansıma yapmaz.
* **Sıcak & Soğuk Dengesi:** Tüm RGB ışıkları tek bir renk paletinde (Turuncu/Sarı veya Buz Mavisi/Beyaz) sabitlemek premium bir hava katar.
`
  },
  {
    id: "blog-4",
    title: "Ergonomik Masaüstü Kurulum Rehberi: Boyun ve Sırt Ağrılarına Son Verin",
    slug: "ergonomic-desk-setup",
    summary: "Monitör yüksekliği, klavye açısı, ayak desteği ve oturma pozisyonunun vücut mekaniğine etkisi. Sağlıklı bir çalışma alanı için bilimsel öneriler.",
    category: "Ergonomi & Sağlık",
    coverImage: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=1200&q=80",
    authorName: "Beşir Hanzo",
    authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80",
    readTimeMinutes: 5,
    tags: ["ergonomi", "saglik", "monitorarm", "aeron", "masaduzeni"],
    hardwareSlugs: ["dell-ultrasharp-32-4k", "herman-miller-aeron"],
    isPublished: true,
    createdAt: "2026-02-18T11:00:00.000Z",
    updatedAt: "2026-02-18T11:00:00.000Z",
    content: `
# Ergonomik Masaüstü Kurulum Rehberi

Postür bozuklukları ve tekrarlayan gerilme yaralanmaları (RSI), bilgisayar başında çalışanların en büyük kabusudur. Doğru ergonomik düzenleme ile bu riskleri sıfırlayabilirsiniz.

## Altın Ergonomi Kuralları

1. **Monitör Üst Kenarı Göz Hizasında Olmalı:**
   Monitöre bakarken başınızı öne eğmemelisiniz. Monitör kolu (Monitor Arm) kullanarak yüksekliği göz hizanıza göre ayarlayın.
2. **90 Derece Dirsek Açısı:**
   Kollarınız masaya paralel durmalı, bilekleriniz klavye veya jel desteye yumuşakça yaslanmalıdır.
3. **Ayak Tabanları Yere Tam Basmalı:**
   Ayaklarınız havada kalıyorsa mutlaka bir ayak desteği (Footrest) kullanın.

## Önerilen Donanımlar

* **Monitör Kolu:** North Bayou F80 / Ergotron LX
* **Ergonomik Klavye:** Alice Layout / Split Ergonomic Keyboards
`
  }
];
