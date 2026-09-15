import React, { useState, useEffect } from 'react';
import { safeJsonResponse } from '../lib/api';
import { X, ExternalLink, Sparkles, Loader2, Search, ShoppingBag, TrendingDown, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { 
  buildAkakceUrl, 
  buildCimriUrl, 
  buildAmazonUrl, 
  buildTrendyolUrl, 
  buildHepsiburadaUrl, 
  buildN11Url, 
  buildIdefixUrl, 
  buildGoogleShoppingUrl, 
  buildTeknosaUrl, 
  buildVatanUrl, 
  getCleanSearchQuery 
} from '../utils/searchUtils';
import { StoreLogo } from './StoreLogo';

interface PriceAnalysisModalProps {
  productName: string;
  estimatedPrice?: number;
  onClose: () => void;
}

export const PriceAnalysisModal: React.FC<PriceAnalysisModalProps> = ({
  productName: initialProductName,
  estimatedPrice,
  onClose
}) => {
  const [currentProduct, setCurrentProduct] = useState(initialProductName);
  const [searchInput, setSearchInput] = useState(initialProductName);
  const [loading, setLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState<any>(null);

  const cleanQuery = getCleanSearchQuery(currentProduct);
  const akakceUrl = buildAkakceUrl(currentProduct);
  const cimriUrl = buildCimriUrl(currentProduct);
  const amazonUrl = buildAmazonUrl(currentProduct);
  const trendyolUrl = buildTrendyolUrl(currentProduct);
  const hepsiburadaUrl = buildHepsiburadaUrl(currentProduct);
  const n11Url = buildN11Url(currentProduct);
  const idefixUrl = buildIdefixUrl(currentProduct);
  const googleShoppingUrl = buildGoogleShoppingUrl(currentProduct);
  const teknosaUrl = buildTeknosaUrl(currentProduct);
  const vatanUrl = buildVatanUrl(currentProduct);

  const fetchPriceAnalysis = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/price-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName: query, estimatedPrice })
      });
      const data = await safeJsonResponse(res);
      if (data.success) {
        setAnalysisData(data.analysis);
      }
    } catch (err) {
      console.error('Failed to fetch price analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPriceAnalysis(initialProductName);
  }, [initialProductName]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setCurrentProduct(searchInput.trim());
      fetchPriceAnalysis(searchInput.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white  border-4 border-slate-900  rounded-[2.5rem] max-w-2xl w-full shadow-[10px_10px_0px_0px_rgba(45,52,54,1)]  relative max-h-[92vh] overflow-hidden flex flex-col my-auto shrink-0 transition-colors">
        
        {/* Scrollable Modal Content */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1 relative text-slate-900 ">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 bg-slate-100  hover:bg-red-100  text-slate-800  hover:text-red-600  border-2 border-slate-900  rounded-xl transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]  hover:shadow-none  z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="space-y-3 pr-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-300  border-2 border-slate-900 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-900">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Canlı Türkiye Fiyat Analizi & Karşılaştırma Hub'ı</span>
            </div>

            {/* Live Search Form */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Ekipman veya parça ara (Örn: RTX 4070, Logitech G Pro, Ryzen 7)..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50  border-2 border-slate-900  rounded-xl text-xs font-bold text-slate-900  outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-black text-xs uppercase tracking-wider rounded-xl border-2 border-slate-900  shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]  active:scale-95 transition-all flex items-center gap-1 cursor-pointer shrink-0"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Ara & Analiz Et</span>}
              </button>
            </form>

            <p className="text-xs text-slate-500  font-semibold flex items-center gap-1.5 flex-wrap">
              <span>Aranan Ürün: <strong className="text-slate-900  font-black">"{cleanQuery}"</strong></span>
            </p>
          </div>

          {/* Loading Indicator */}
          {loading ? (
            <div className="p-10 text-center space-y-4 bg-slate-50  border-2 border-dashed border-slate-300  rounded-2xl animate-pulse">
              <Loader2 className="w-10 h-10 animate-spin text-rose-500 mx-auto" />
              <div className="space-y-1">
                <h5 className="font-black text-slate-900  text-sm uppercase tracking-wider">
                  Türkiye E-Ticaret Mağazaları Taranıyor...
                </h5>
                <p className="text-xs text-slate-500  font-medium">
                  Gemini Google Search Grounding ile Trendyol, Hepsiburada, İtopya, Vatan, Amazon TR ve Akakçe verileri karşılaştırılıyor.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Sorted Store Prices (Cheapest to Most Expensive) */}
              {analysisData?.stores && analysisData.stores.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-black text-xs uppercase tracking-wider text-slate-900  flex items-center gap-1.5">
                      <TrendingDown className="w-4 h-4 text-emerald-600 " />
                      <span>Fiyat Sıralaması (En Ucuzdan En Pahalıya)</span>
                    </h5>
                    <span className="text-[10px] font-bold text-slate-500 ">
                      {analysisData.stores.length} Mağaza Tespit Edildi
                    </span>
                  </div>

                  <div className="space-y-2">
                    {analysisData.stores.map((store: any, idx: number) => {
                      const isCheapest = idx === 0;
                      return (
                        <div
                          key={idx}
                          className={`p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 transition-all ${
                            isCheapest
                              ? 'bg-emerald-50  border-emerald-600  shadow-[3px_3px_0px_0px_rgba(16,185,129,0.4)] '
                              : 'bg-white  border-slate-900  shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] '
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <StoreLogo store={store?.storeName || 'Mağaza'} size="md" />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-black text-sm text-slate-900 ">{String(store?.storeName || 'Mağaza')}</span>
                                {isCheapest && (
                                  <span className="px-2 py-0.5 bg-emerald-500 text-white font-black text-[9px] uppercase tracking-wider rounded-full flex items-center gap-1">
                                    <Sparkles className="w-2.5 h-2.5" /> En Ucuz Satıcı
                                  </span>
                                )}
                              </div>
                              {store?.note && (
                                <span className="text-[10px] font-bold text-slate-500  block">
                                  {String(store.note)}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className={`text-base font-black block ${isCheapest ? 'text-emerald-600 ' : 'text-slate-900 '}`}>
                              {(Number(store?.price) || 0).toLocaleString('tr-TR')} ₺
                            </span>
                            <span className="text-[10px] text-emerald-600  font-bold flex items-center gap-0.5 justify-end">
                              <CheckCircle2 className="w-3 h-3" /> Stokta Var
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* AI Price Analysis Summary Section */}
              <div className="bg-gradient-to-r from-amber-50 to-rose-50   border-3 border-slate-900  rounded-2xl p-4 space-y-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ">
                <div className="flex items-center justify-between">
                  <h5 className="font-black text-xs uppercase tracking-wider text-slate-900  flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-rose-500" />
                    <span>AI Fiyat Analizi</span>
                  </h5>
                  {analysisData?.bestPlatform && (
                    <StoreLogo store={analysisData.bestPlatform} size="sm" />
                  )}
                </div>

                <p className="text-xs text-slate-800  font-bold leading-relaxed bg-white/80  p-3 rounded-xl border border-slate-200 ">
                  {analysisData?.dealVerdict || `En uygun fiyat ${analysisData?.bestPlatform || 'Trendyol'}'da! Diğer e-ticaret mağazalarına göre avantajlı fiyat sunulmaktadır.`}
                </p>
              </div>

              {/* All E-Commerce Direct Store Buttons with Logos */}
              <div className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900  flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-rose-500" />
                    <span>Doğrudan Mağaza Aramaları</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800  bg-emerald-100  border border-emerald-600 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Canlı Yönlendirme
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <a href={trendyolUrl} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white  hover:bg-orange-50  border-2 border-slate-900  rounded-xl transition-all flex items-center justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]  active:shadow-none ">
                    <StoreLogo store="trendyol" size="sm" />
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 " />
                  </a>
                  <a href={hepsiburadaUrl} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white  hover:bg-amber-50  border-2 border-slate-900  rounded-xl transition-all flex items-center justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]  active:shadow-none ">
                    <StoreLogo store="hepsiburada" size="sm" />
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 " />
                  </a>
                  <a href={akakceUrl} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white  hover:bg-red-50  border-2 border-slate-900  rounded-xl transition-all flex items-center justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]  active:shadow-none ">
                    <StoreLogo store="akakce" size="sm" />
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 " />
                  </a>
                  <a href={cimriUrl} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white  hover:bg-sky-50  border-2 border-slate-900  rounded-xl transition-all flex items-center justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]  active:shadow-none ">
                    <StoreLogo store="cimri" size="sm" />
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 " />
                  </a>
                  <a href={amazonUrl} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white  hover:bg-slate-100  border-2 border-slate-900  rounded-xl transition-all flex items-center justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]  active:shadow-none ">
                    <StoreLogo store="amazon" size="sm" />
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 " />
                  </a>
                  <a href={googleShoppingUrl} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white  hover:bg-blue-50  border-2 border-slate-900  rounded-xl transition-all flex items-center justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]  active:shadow-none ">
                    <StoreLogo store="google" size="sm" />
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 " />
                  </a>
                </div>
              </div>
            </>
          )}

          {/* Modal Footer Actions */}
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-200 ">
            <a
              href={googleShoppingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-black text-indigo-600  hover:underline flex items-center gap-1 uppercase"
            >
              <span>Google Alışveriş'te Tüm Fiyatları Gör</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-900  hover:bg-slate-800  text-white  border-2 border-transparent  rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]  active:shadow-none "
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
