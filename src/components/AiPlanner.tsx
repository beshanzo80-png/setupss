import React, { useState, useEffect } from 'react';
import { Sparkles, ExternalLink, Check, Loader2, AlertCircle, ShieldAlert, Clock, Zap, BarChart2 } from 'lucide-react';
import { WishlistItem } from '../types';
import { PriceAnalysisModal } from './PriceAnalysisModal';
import { buildAkakceUrl, buildCimriUrl } from '../utils/searchUtils';

import { safeJsonResponse } from '../lib/api';

interface AiPlannerProps {
  user?: any;
  onOpenAuthModal?: () => void;
  onAddItemsToWishlist: (newItems: Omit<WishlistItem, 'id' | 'purchased'>[]) => void;
}

interface AiRecommendedItem {
  name: string;
  category: string;
  estimatedPrice: number;
  reason: string;
}

interface AiSetupPlan {
  title: string;
  description: string;
  totalEstimatedCost: number;
  items: AiRecommendedItem[];
}

export const AiPlanner: React.FC<AiPlannerProps> = ({ user, onOpenAuthModal, onAddItemsToWishlist }) => {
  const [budget, setBudget] = useState<number>(25000);
  const [category, setCategory] = useState<string>('Yazılımcı Atölyesi');
  const [preferences, setPreferences] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<AiSetupPlan | null>(null);
  const [imported, setImported] = useState<boolean>(false);
  const [selectedProductForAnalysis, setSelectedProductForAnalysis] = useState<{ name: string; price?: number } | null>(null);

  // Quota states
  const [remainingQuota, setRemainingQuota] = useState<number>(10);
  const [maxQuota, setMaxQuota] = useState<number>(10);
  const [resetInMinutes, setResetInMinutes] = useState<number>(120);

  const categories = [
    { value: 'Yazılımcı Atölyesi', label: '💻 Yazılımcı & Üretkenlik', color: 'bg-[#4ECDC4]' },
    { value: 'Minimalist', label: '🪴 Minimalist & Instagram Trend', color: 'bg-[#FFE6E6]' },
    { value: 'RGB & Oyuncu', label: '🎮 RGB & Espor / Oyuncu', color: 'bg-vibrant-yellow' },
    { value: 'Kreatif Stüdyo', label: '🎨 Kreatif & Monitör Odaklı', color: 'bg-[#FF6B6B]' },
    { value: 'Cozy / Retro', label: '☕ Cozy & Ahşap Warm Setup', color: 'bg-[#D4A373]' },
  ];

  const quickBudgets = [15000, 30000, 50000, 75000];

  const loadingMessages = [
    "🤖 Yapay zeka sistemi uyandırılıyor...",
    "💸 Hedef bütçeniz analiz ediliyor...",
    "🔍 Monitör, ekran, klavye ve ışıklandırma trendleri taranıyor...",
    "💻 Akakçe üzerinden nokta atışı en güncel fiyatlar hesaplanıyor...",
    "🔌 Kablolama, ekran barı ve ergonomik donanım uyumu taranıyor...",
    "✨ Viral Instagram trendlerine uygun bütçe dostu masa planı hazırlanıyor..."
  ];

  // Fetch AI user quota status
  const fetchQuotaStatus = async () => {
    try {
      const res = await fetch('/api/gemini/quota');
      const data = await safeJsonResponse(res);
      if (data.success) {
        setRemainingQuota(data.remainingRequests ?? 10);
        setMaxQuota(data.maxRequests ?? 10);
        setResetInMinutes(data.resetInMinutes ?? 120);
      }
    } catch (e) {
      console.error('Failed to fetch AI quota status:', e);
    }
  };

  useEffect(() => {
    fetchQuotaStatus();
  }, []);

  // Cycling loading messages
  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2200);
    } else {
      setLoadingMessageIndex(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      if (onOpenAuthModal) onOpenAuthModal();
      setError("Yapay zeka asistanını kullanabilmek için lütfen önce hesabınıza giriş yapın.");
      return;
    }

    if (budget <= 0) {
      setError("Lütfen geçerli bir bütçe tutarı girin.");
      return;
    }

    setLoading(true);
    setError(null);
    setPlan(null);
    setImported(false);

    try {
      const response = await fetch('/api/gemini/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          budget, 
          category, 
          preferences, 
          user, 
          userId: user?.id 
        }),
      });

      const data = await safeJsonResponse(response);
      if (data.remainingRequests !== undefined) {
        setRemainingQuota(data.remainingRequests);
      }
      if (data.resetInMinutes !== undefined) {
        setResetInMinutes(data.resetInMinutes);
      }

      if (data.success && data.plan) {
        setPlan(data.plan);
      } else {
        throw new Error(data.error || "Beklenmeyen bir hata oluştu.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Yapay zeka planı hazırlanırken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleImportToWishlist = () => {
    if (!plan) return;
    
    const formattedItems = plan.items.map(item => ({
      name: item.name,
      category: item.category,
      estimatedPrice: item.estimatedPrice,
      notes: `Yapay zeka tavsiyesi: ${item.reason}`
    }));

    onAddItemsToWishlist(formattedItems);
    setImported(true);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="ai-planner-section">
      
      {/* User Quota Information Banner */}
      <div className="bg-white border-4 border-vibrant-dark rounded-[2rem] p-5 shadow-[5px_5px_0px_0px_rgba(45,52,54,1)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-vibrant-yellow border-2 border-vibrant-dark rounded-xl shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] shrink-0">
            <Zap className="w-5 h-5 text-vibrant-dark fill-vibrant-dark" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-black text-vibrant-dark text-xs uppercase tracking-tight">
                📌 KULLANICI KOTA BİLGİLENDİRMESİ
              </span>
              <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-[#4ECDC4] text-white border border-vibrant-dark rounded-md">
                Bireysel İletişim Kotası
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Her kullanıcının yapay zeka kullanım kotası (<strong>1.000 Token / 10 İstek</strong>) tamamen bağımsızdır ve her <strong>2 saatte bir</strong> otomatik sıfırlanır.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 bg-vibrant-bg border-2 border-vibrant-dark px-4 py-2 rounded-2xl">
          <Clock className="w-4 h-4 text-vibrant-coral" />
          <div className="text-right">
            <div className="text-[10px] font-black uppercase text-slate-400">Kalan Kullanım</div>
            <div className="text-xs font-black text-vibrant-dark">
              {remainingQuota} / {maxQuota} İstek <span className="text-[10px] text-slate-500 font-bold">({resetInMinutes} dk sonra sıfırlanır)</span>
            </div>
          </div>
        </div>
      </div>

      {!user && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-4 border-vibrant-dark rounded-[2rem] p-6 shadow-[5px_5px_0px_0px_rgba(45,52,54,1)] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-vibrant-yellow border-2 border-vibrant-dark flex items-center justify-center text-2xl shrink-0 shadow-[2px_2px_0px_0px_rgba(45,52,54,1)]">
              🔒
            </div>
            <div className="space-y-1">
              <h4 className="font-black uppercase tracking-tight text-vibrant-dark text-sm">
                Yapay Zeka Asistanı Sadece Giriş Yapmış Üyelere Özeldir
              </h4>
              <p className="text-xs text-slate-600 font-medium">
                Kişiselleştirilmiş bütçe & masaüstü önerileri oluşturmak için ücretsiz giriş yapın veya kayıt olun.
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenAuthModal && onOpenAuthModal()}
            className="px-5 py-2.5 bg-vibrant-yellow hover:bg-[#ffcf10] text-vibrant-dark border-2 border-vibrant-dark rounded-xl font-black uppercase text-xs tracking-wider shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer shrink-0"
          >
            Giriş Yap / Ücretsiz Kayıt Ol 🚀
          </button>
        </div>
      )}

      {/* Main Grid: Form Left / AI Results Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Input Parameters Form */}
        <form onSubmit={handleGeneratePlan} className="lg:col-span-5 bg-white border-4 border-vibrant-dark rounded-[2rem] p-6 shadow-[6px_6px_0px_0px_rgba(45,52,54,1)] space-y-5">
          <div className="flex items-center justify-between border-b-2 border-vibrant-dark pb-2">
            <h4 className="font-black uppercase tracking-tight text-vibrant-dark text-sm">Planlama Parametreleri</h4>
            <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-vibrant-yellow border border-vibrant-dark rounded-lg">
              Token İyileştirmeli ⚡
            </span>
          </div>

          {/* Budget Input */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-vibrant-coral block">Maksimum Bütçen (₺)</label>
            <div className="relative">
              <input
                type="number"
                required
                min={1000}
                value={budget || ''}
                onChange={e => setBudget(Number(e.target.value))}
                placeholder="Örn: 25000"
                className="w-full pl-9 pr-4 py-2.5 bg-vibrant-bg border-2 border-vibrant-dark rounded-xl text-xs font-black outline-none placeholder-vibrant-dark/30 focus:ring-4 focus:ring-[#4ECDC4]/40"
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-vibrant-dark font-black text-xs">₺</span>
            </div>
            
            {/* Quick Budgets helper */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {quickBudgets.map(b => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBudget(b)}
                  className={`px-2.5 py-1 text-[9px] font-extrabold rounded-lg border-2 border-vibrant-dark transition-all cursor-pointer ${
                    budget === b 
                      ? 'bg-vibrant-yellow text-vibrant-dark shadow-[1.5px_1.5px_0px_0px_rgba(45,52,54,1)]' 
                      : 'bg-white hover:bg-vibrant-bg text-vibrant-dark/70'
                  }`}
                >
                  {b.toLocaleString('tr-TR')} ₺
                </button>
              ))}
            </div>
          </div>

          {/* Setup Category Visual Picker */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-vibrant-coral block">Kurulum Konsepti / Tarzın</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`p-2.5 rounded-xl border-2 border-vibrant-dark text-left text-[11px] font-black transition-all cursor-pointer ${
                    category === cat.value
                      ? `${cat.color} text-vibrant-dark shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] scale-[1.01]`
                      : 'bg-white hover:bg-vibrant-bg text-vibrant-dark/80'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Extra Wishes Textarea */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-vibrant-coral block">
              Özel Tercihler veya Sahip Olduğun Ekipmanlar (İsteğe Bağlı)
            </label>
            <textarea
              rows={3}
              value={preferences}
              onChange={e => setPreferences(e.target.value)}
              placeholder="Örn: 27 inç 144Hz monitör dahil olsun. Keychron klavye veya ekran barı tercih edilsin. Masam 120cm..."
              className="w-full px-3 py-2 bg-vibrant-bg border-2 border-vibrant-dark rounded-xl text-xs font-medium outline-none placeholder-vibrant-dark/30 focus:ring-4 focus:ring-[#4ECDC4]/40 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading || remainingQuota <= 0}
            className={`w-full bg-[#FFD93D] hover:bg-[#ffcf10] text-vibrant-dark border-2 border-vibrant-dark rounded-xl py-3 font-black uppercase text-xs tracking-wider shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer flex items-center justify-center gap-2 ${
              loading || remainingQuota <= 0 ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                <span>Plan Hazırlanıyor...</span>
              </>
            ) : remainingQuota <= 0 ? (
              <>
                <ShieldAlert className="w-4 h-4 text-vibrant-coral" />
                <span>Kota Doldu ({resetInMinutes} dk bekleyin)</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-vibrant-coral" />
                <span>Masaüstü Planı Oluştur ⚡</span>
              </>
            )}
          </button>
        </form>

        {/* Right side: AI Results Output */}
        <div className="lg:col-span-7 bg-white border-4 border-vibrant-dark rounded-[2rem] p-6 shadow-[6px_6px_0px_0px_rgba(45,52,54,1)] min-h-[480px] flex flex-col justify-between">
          
          {loading && (
            <div className="my-auto py-12 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-t-[#4ECDC4] border-r-[#FFD93D] border-vibrant-dark animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-lg">🤖</div>
              </div>
              <div className="space-y-2">
                <h5 className="font-black uppercase tracking-tight text-vibrant-dark text-sm animate-pulse">Yapay Zeka Çalışıyor</h5>
                <p className="text-xs text-slate-500 font-bold max-w-sm px-4 min-h-[40px] transition-all duration-300">
                  {loadingMessages[loadingMessageIndex]}
                </p>
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="my-auto py-12 p-6 border-4 border-dashed border-[#FF6B6B] rounded-3xl text-center space-y-4 max-w-md mx-auto">
              <AlertCircle className="w-12 h-12 text-[#FF6B6B] mx-auto" />
              <div className="space-y-1">
                <h5 className="font-black text-vibrant-dark text-sm uppercase">İşlem Başarısız</h5>
                <p className="text-xs text-slate-600 font-semibold">{error}</p>
              </div>
              <button
                onClick={handleGeneratePlan}
                className="px-4 py-2 bg-vibrant-bg hover:bg-slate-100 border-2 border-vibrant-dark rounded-xl text-xs font-bold"
              >
                Yeniden Dene 🔄
              </button>
            </div>
          )}

          {!loading && !error && !plan && (
            <div className="my-auto py-12 text-center space-y-4">
              <div className="text-5xl">📐🤖🛠️</div>
              <div className="space-y-1">
                <h5 className="font-black text-vibrant-dark text-xs uppercase">Yol Haritanızı Çizelim</h5>
                <p className="text-[11px] text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
                  Bütçenizi, konseptinizi ve isteklerinizi sol tarafa girip "Plan Oluştur" butonuna basarak yapay zekanın sizin için tasarlayacağı akıllı ekipman listesini görebilirsiniz.
                </p>
              </div>
            </div>
          )}

          {!loading && !error && plan && (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              
              {/* Header Details */}
              <div className="space-y-3 border-b-4 border-vibrant-dark pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-lg font-black text-vibrant-dark uppercase tracking-tight flex items-center gap-1.5">
                    ✨ {plan.title}
                  </h3>
                  <div className="bg-vibrant-coral text-white border-2 border-vibrant-dark font-black px-3 py-1 rounded-xl text-[11px] uppercase tracking-wider w-fit shrink-0">
                    Toplam: {plan.totalEstimatedCost.toLocaleString('tr-TR')} ₺
                  </div>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed bg-vibrant-bg border-2 border-vibrant-dark p-3 rounded-2xl">
                  {plan.description}
                </p>
              </div>

              {/* Items List */}
              <div className="space-y-3 my-4 max-h-[380px] overflow-y-auto pr-2">
                <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-500 bg-amber-50/80 border border-vibrant-dark/20 p-2 rounded-xl">
                  <span>🛍️ EN UYGUN FİYAT KARŞILAŞTIRMA (AKAKÇE & CİMRİ)</span>
                  <span className="text-[9px] text-vibrant-coral">En Düşük Fiyatı Seçin ⚡</span>
                </div>
                {plan.items.map((item, idx) => {
                  const akakceSearchUrl = buildAkakceUrl(item.name);
                  const cimriSearchUrl = buildCimriUrl(item.name);
                  return (
                    <div
                      key={idx}
                      className="border-2 border-vibrant-dark rounded-2xl p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 border border-vibrant-dark rounded bg-vibrant-yellow text-vibrant-dark">
                            {item.category}
                          </span>
                        </div>
                        <h5 className="text-xs font-black text-vibrant-dark truncate">
                          {item.name}
                        </h5>
                        <p className="text-[10px] text-slate-500 font-medium">
                          {item.reason}
                        </p>
                      </div>

                      <div className="flex flex-col items-start sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <span className="text-xs font-black text-vibrant-dark">
                          ~ {item.estimatedPrice.toLocaleString('tr-TR')} ₺
                        </span>
                        
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            onClick={() => setSelectedProductForAnalysis({ name: item.name, price: item.estimatedPrice })}
                            className="px-2.5 py-1 bg-vibrant-dark hover:bg-slate-800 text-vibrant-yellow border border-vibrant-dark rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1 shadow-[1px_1px_0px_0px_rgba(45,52,54,1)] cursor-pointer"
                            title="Tüm e-ticaret ve karşılaştırma sitelerinde en ucuz fiyatı analiz et"
                          >
                            <BarChart2 className="w-2.5 h-2.5" />
                            <span>Piyasa Analizi</span>
                          </button>

                          <a
                            href={akakceSearchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 bg-amber-100/70 hover:bg-amber-200 text-amber-950 border border-vibrant-dark rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1 shadow-[1px_1px_0px_0px_rgba(45,52,54,1)] hover:shadow-none"
                            title="Akakçe'de en ucuz fiyatı gör"
                          >
                            <span>Akakçe</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>

                          <a
                            href={cimriSearchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 bg-sky-100/80 hover:bg-sky-200 text-sky-950 border border-vibrant-dark rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1 shadow-[1px_1px_0px_0px_rgba(45,52,54,1)] hover:shadow-none"
                            title="Cimri'de en ucuz fiyatı gör"
                          >
                            <span>Cimri</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Import Action bar */}
              <div className="border-t-4 border-vibrant-dark pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto">
                <div className="text-[10px] font-bold text-slate-500 uppercase">
                  ⚡ Bu kurulumu beğendiniz mi? Tek tıkla listenize aktarabilirsiniz!
                </div>
                
                <button
                  onClick={handleImportToWishlist}
                  disabled={imported}
                  className={`px-4 py-2.5 border-2 border-vibrant-dark rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[2.5px_2.5px_0px_0px_rgba(45,52,54,1)] hover:shadow-none active:translate-x-[2px] active:translate-y-[2px] ${
                    imported 
                      ? 'bg-green-100 text-green-800 border-green-800 shadow-none translate-x-[2px] translate-y-[2px]' 
                      : 'bg-[#4ECDC4] hover:bg-[#3dbbb2] text-white'
                  }`}
                >
                  {imported ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Hayal Listesine Eklendi!</span>
                    </>
                  ) : (
                    <>
                      <span>Tümünü Hayal Listeme Ekle ➕</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

        </div>

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
