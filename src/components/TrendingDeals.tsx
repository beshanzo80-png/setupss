import React, { useState } from 'react';
import { Flame, ExternalLink, Plus, Check, Tag, Sparkles, TrendingUp, BarChart2 } from 'lucide-react';
import { PriceAnalysisModal } from './PriceAnalysisModal';
import { buildAkakceUrl, buildCimriUrl } from '../utils/searchUtils';

interface DealItem {
  id: string;
  name: string;
  category: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
  badge: string;
  description: string;
  akakceQuery: string;
}

interface TrendingDealsProps {
  onAddSingleItemToWishlist: (item: { name: string; category: string; estimatedPrice: number; notes: string }) => void;
}

export const TrendingDeals: React.FC<TrendingDealsProps> = ({ onAddSingleItemToWishlist }) => {
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [selectedProductForAnalysis, setSelectedProductForAnalysis] = useState<{ name: string; price?: number } | null>(null);

  const deals: DealItem[] = [
    {
      id: 'deal-1',
      name: 'Xiaomi Mi Computer Monitor Light Bar',
      category: 'Işıklandırma / Ses',
      originalPrice: 1650,
      discountedPrice: 1350,
      discountPercent: 18,
      badge: 'Instagram Trend 🔥',
      description: 'Monitör üstüne takılan, göz yormayan ve masaya harika atmosfer katan manyetik kumandalı ekran ışığı.',
      akakceQuery: 'Xiaomi Mi Computer Monitor Light Bar'
    },
    {
      id: 'deal-2',
      name: 'LG UltraGear 27GR75Q-B 27" 165Hz QHD IPS Monitör',
      category: 'Monitör / Görüntü',
      originalPrice: 8100,
      discountedPrice: 6850,
      discountPercent: 15,
      badge: 'Bütçe & Ekran F/P 🖥️',
      description: '2K QHD çözünürlük, 165Hz yenileme hızı ve %99 sRGB renk doğruluğu ile hem yazılım hem espor favorisi.',
      akakceQuery: 'LG 27GR75Q-B 27 165Hz QHD IPS'
    },
    {
      id: 'deal-3',
      name: 'Keychron K2 V2 Wireless Mekanik Klavye',
      category: 'Klavye / Mouse',
      originalPrice: 3350,
      discountedPrice: 2950,
      discountPercent: 12,
      badge: 'Setup Favorisi ⌨️',
      description: 'Mac ve Windows uyumlu, Bluetooth kablosuz bağlantılı, RGB backlight mekanik klavye.',
      akakceQuery: 'Keychron K2 V2 Mekanik Klavye'
    },
    {
      id: 'deal-4',
      name: 'North Bayou NB F80 Monitör Arm (Amortisörlü)',
      category: 'Aksesuar / Kablolama',
      originalPrice: 1220,
      discountedPrice: 980,
      discountPercent: 20,
      badge: 'Gözde Ergonomi 🦾',
      description: 'Masada ekstra alan açan, 360 derece dönebilen gazlı amortisörlü dayanıklı monitör kolu.',
      akakceQuery: 'North Bayou NB F80 Monitör Arm'
    },
    {
      id: 'deal-5',
      name: 'Logitech MX Master 3S Ergonomik Mouse',
      category: 'Klavye / Mouse',
      originalPrice: 4200,
      discountedPrice: 3750,
      discountPercent: 10,
      badge: 'Üretkenlik Kralı 👑',
      description: 'Sessiz tıklama, MagSpeed hızlı kaydırma tekerleği ve avuç içini yormayan efsanevi tasarım.',
      akakceQuery: 'Logitech MX Master 3S'
    },
    {
      id: 'deal-6',
      name: 'IKEA Skådis Ahşap Delikli Pano (Pegboard Set)',
      category: 'Aksesuar / Kablolama',
      originalPrice: 1050,
      discountedPrice: 890,
      discountPercent: 14,
      badge: 'Masa Düzenleyici 🪴',
      description: 'Kulaklık, kablo ve aksesuarları duvarda düzenli tutan en çok satan aesthetic masa parçası.',
      akakceQuery: 'IKEA Skadis Delikli Pano'
    },
    {
      id: 'deal-7',
      name: 'SteelSeries Arctis Nova 7 Wireless Kulaklık',
      category: 'Kulaklık / Hoparlör',
      originalPrice: 6200,
      discountedPrice: 5200,
      discountPercent: 16,
      badge: 'Kablosuz Ses 🎧',
      description: 'Çift eşzamanlı ses desteği (Bluetooth + 2.4GHz), 38 saat pil ömrü ve konforlu kafa bandı.',
      akakceQuery: 'SteelSeries Arctis Nova 7 Wireless'
    },
    {
      id: 'deal-8',
      name: 'Razer Gigantus V2 XXL Desk Mat (Sümen)',
      category: 'Aksesuar / Kablolama',
      originalPrice: 820,
      discountedPrice: 640,
      discountPercent: 22,
      badge: 'Masa Sümeni 🎨',
      description: 'Masayı baştan başa kaplayan yumuşak dokulu, kaymaz kauçuk tabanlı mikro dokuma masa matı.',
      akakceQuery: 'Razer Gigantus V2 XXL'
    }
  ];

  const handleAddDeal = (deal: DealItem) => {
    onAddSingleItemToWishlist({
      name: deal.name,
      category: deal.category,
      estimatedPrice: deal.discountedPrice,
      notes: `Bu hafta indirimdeki popüler ürün (%${deal.discountPercent} İndirim - ${deal.badge})`
    });
    setAddedIds(prev => ({ ...prev, [deal.id]: true }));
  };

  return (
    <div className="bg-white border-4 border-vibrant-dark rounded-[2.5rem] p-4 sm:p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(45,52,54,1)] space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-4 border-vibrant-dark pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-vibrant-yellow border-2 border-vibrant-dark text-vibrant-dark text-[10px] font-black uppercase tracking-wider rounded-xl shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] mb-1">
            <Flame className="w-3.5 h-3.5 text-vibrant-coral fill-vibrant-coral" />
            <span>FIRSAT & TREND TAKİBİ</span>
          </div>
          <h3 className="text-base sm:text-lg md:text-xl font-black text-vibrant-dark uppercase tracking-tight flex items-center gap-2">
            🔥 Bu Hafta İndirimde Olan Popüler Ürünler
          </h3>
          <p className="text-xs text-slate-600 font-medium">
            Instagram ve sosyal medyada en çok paylaşılan trend masaüstü ekipmanlarının Akakçe ve Cimri güncel fırsat fiyatları!
          </p>
        </div>

        <div className="bg-vibrant-bg border-2 border-vibrant-dark px-3 py-2 rounded-2xl flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <TrendingUp className="w-4 h-4 text-vibrant-coral" />
          <span className="text-[10px] font-black uppercase tracking-wider text-vibrant-dark">Canlı Akakçe & Cimri Fırsatları</span>
        </div>
      </div>

      {/* Grid of Deals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {deals.map(deal => {
          const isAdded = !!addedIds[deal.id];
          const akakceUrl = buildAkakceUrl(deal.akakceQuery);
          const cimriUrl = buildCimriUrl(deal.akakceQuery);

          return (
            <div
              key={deal.id}
              className="bg-vibrant-bg border-2 border-vibrant-dark rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all relative group overflow-hidden"
            >
              {/* Top Badges */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 bg-white border border-vibrant-dark rounded-md text-vibrant-dark truncate">
                  {deal.category}
                </span>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-[#FF6B6B] text-white border border-vibrant-dark rounded-md shrink-0 flex items-center gap-0.5">
                  <Tag className="w-2.5 h-2.5" />
                  %{deal.discountPercent} İndirim
                </span>
              </div>

              {/* Product Info */}
              <div className="space-y-1.5 my-1">
                <div className="text-[9.5px] font-extrabold text-vibrant-coral uppercase tracking-wide">
                  {deal.badge}
                </div>
                <h5 className="text-xs font-black text-vibrant-dark line-clamp-2 leading-tight">
                  {deal.name}
                </h5>
                <p className="text-[10px] text-slate-500 font-medium line-clamp-2 leading-snug">
                  {deal.description}
                </p>
              </div>

              {/* Price & Actions */}
              <div className="space-y-2 pt-2 border-t border-vibrant-dark/20 mt-auto">
                <div className="flex items-baseline justify-between">
                  <span className="text-[10px] text-slate-400 font-bold line-through">
                    {deal.originalPrice.toLocaleString('tr-TR')} ₺
                  </span>
                  <span className="text-sm font-black text-vibrant-dark">
                    {deal.discountedPrice.toLocaleString('tr-TR')} ₺
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => setSelectedProductForAnalysis({ name: deal.name, price: deal.discountedPrice })}
                    className="w-full py-1.5 bg-vibrant-dark hover:bg-slate-800 text-vibrant-yellow border border-vibrant-dark rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-[1px_1px_0px_0px_rgba(45,52,54,1)] cursor-pointer"
                    title="Tüm e-ticaret siteleri ve karşılaştırma platformlarında fiyat analizi yap"
                  >
                    <BarChart2 className="w-2.5 h-2.5" />
                    <span>Piyasa & Fiyat Analizi Et</span>
                  </button>

                  <div className="grid grid-cols-2 gap-1.5">
                    <a
                      href={akakceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1.5 bg-amber-100/70 hover:bg-amber-200 text-amber-950 border border-vibrant-dark rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-[1px_1px_0px_0px_rgba(45,52,54,1)] hover:shadow-none"
                      title="Akakçe'de en ucuz fiyatını gör"
                    >
                      <span>Akakçe</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>

                    <a
                      href={cimriUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1.5 bg-sky-100/80 hover:bg-sky-200 text-sky-950 border border-vibrant-dark rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-[1px_1px_0px_0px_rgba(45,52,54,1)] hover:shadow-none"
                      title="Cimri'de en ucuz fiyatını gör"
                    >
                      <span>Cimri</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>

                  <button
                    onClick={() => handleAddDeal(deal)}
                    disabled={isAdded}
                    className={`w-full py-1.5 border-2 border-vibrant-dark rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer shadow-[1.5px_1.5px_0px_0px_rgba(45,52,54,1)] hover:shadow-none hover:translate-y-[1px] ${
                      isAdded
                        ? 'bg-green-100 text-green-800 border-green-800 shadow-none'
                        : 'bg-[#4ECDC4] hover:bg-[#3dbbb2] text-white'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-2.5 h-2.5" />
                        <span>Listeme Eklendi</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-2.5 h-2.5" />
                        <span>İstek Listeme Ekle</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Price Analysis Modal */}
      {selectedProductForAnalysis && (
        <PriceAnalysisModal
          productName={selectedProductForAnalysis.name}
          estimatedPrice={selectedProductForAnalysis.price}
          onClose={() => setSelectedProductForAnalysis(null)}
        />
      )}
    </div>
  );
};
