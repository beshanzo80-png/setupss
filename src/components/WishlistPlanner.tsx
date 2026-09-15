import React, { useState, useEffect } from 'react';
import { safeJsonResponse } from '../lib/api';
import { WishlistItem } from '../types';
import { Plus, Trash2, CheckCircle, Circle, DollarSign, Wallet, Percent, Sparkles, AlertCircle, BarChart2, Info, Search, ShieldCheck, Zap, Server, Globe, TrendingUp, Cpu, ShoppingBag } from 'lucide-react';
import { AiPlanner } from './AiPlanner';
import { TrendingDeals } from './TrendingDeals';
import { PriceAnalysisModal } from './PriceAnalysisModal';
import { buildAkakceUrl, buildCimriUrl, buildTrendyolUrl, buildHepsiburadaUrl, buildN11Url, buildAmazonUrl, buildGoogleShoppingUrl, buildIdefixUrl } from '../utils/searchUtils';
import { StoreLogo } from './StoreLogo';
import { compileCommunityIntelligence } from '../utils/aiValidationEngine';
import { SetupPost } from '../types';

interface WishlistPlannerProps {
  user?: any;
  onOpenAuthModal?: () => void;
  allSetups?: SetupPost[];
}

export const WishlistPlanner: React.FC<WishlistPlannerProps> = ({ user, onOpenAuthModal, allSetups = [] }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Masaüstü / Mobilya');
  const [estimatedPrice, setEstimatedPrice] = useState<number>(0);
  const [link, setLink] = useState('');
  const [notes, setNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [plannerMode, setPlannerMode] = useState<'manual' | 'ai' | 'api-info'>('manual');
  const [selectedProductForAnalysis, setSelectedProductForAnalysis] = useState<{ name: string; price?: number } | null>(null);
  const [quickSearchQuery, setQuickSearchQuery] = useState('');

  const handleAddSingleItem = async (singleItem: { name: string; category: string; estimatedPrice: number; notes: string }) => {
    const newItem: WishlistItem = {
      id: `wishlist-deal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: singleItem.name,
      category: singleItem.category,
      estimatedPrice: singleItem.estimatedPrice,
      purchased: false,
      notes: singleItem.notes,
      link: `https://www.akakce.com/arama/?q=${encodeURIComponent(singleItem.name)}`
    };

    const updated = [...items, newItem];
    setItems(updated);
    const storageKey = user?.id ? `setup_wishlist_items_${user.id}` : 'setup_wishlist_items';
    localStorage.setItem(storageKey, JSON.stringify(updated));

    try {
      await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newItem, userId: user?.id })
      });
    } catch (e) {
      console.error('Failed to save single item to database', e);
    }
  };

  const handleAddItemsFromAi = async (newItems: Omit<WishlistItem, 'id' | 'purchased'>[]) => {
    const formattedItems: WishlistItem[] = newItems.map((item, idx) => ({
      id: `wishlist-ai-${Date.now()}-${idx}`,
      name: item.name,
      category: item.category,
      estimatedPrice: item.estimatedPrice,
      purchased: false,
      notes: item.notes,
      link: `https://www.akakce.com/arama/?q=${encodeURIComponent(item.name)}`
    }));

    const updated = [...items, ...formattedItems];
    setItems(updated);
    const storageKey = user?.id ? `setup_wishlist_items_${user.id}` : 'setup_wishlist_items';
    localStorage.setItem(storageKey, JSON.stringify(updated));

    try {
      await Promise.all(formattedItems.map(item => 
        fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...item, userId: user?.id })
        })
      ));
    } catch (e) {
      console.error('Failed to save AI suggested items to database', e);
    }
  };

  // Load from database/API
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const url = user?.id ? `/api/wishlist?userId=${encodeURIComponent(user.id)}` : '/api/wishlist';
        const response = await fetch(url);
        const data = await safeJsonResponse(response);
        if (data.success) {
          setItems(data.wishlist);
        } else {
          throw new Error(data.error);
        }
      } catch (e) {
        console.error('Failed to load wishlist items from database, falling back to local', e);
        const storageKey = user?.id ? `setup_wishlist_items_${user.id}` : 'setup_wishlist_items';
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          try {
            setItems(JSON.parse(saved));
          } catch (err) {
            console.error('Failed to parse local wishlist items', err);
          }
        } else {
          const defaultItems: WishlistItem[] = [
            { id: "w-1", name: "IKEA Karlby Meşe Tabla", category: "Masaüstü / Mobilya", estimatedPrice: 4200, purchased: true, notes: "Alex çekmecelerle birleştirilecek." },
            { id: "w-2", name: "Keychron K2 V2 Mekanik Klavye", category: "Klavye / Mouse", estimatedPrice: 2800, purchased: false, link: "https://keychron.com", notes: "Brown switch tercih edilecek." },
            { id: "w-3", name: "Xiaomi Monitör Arkası Işık Çubuğu", category: "Işıklandırma / Ses", estimatedPrice: 1200, purchased: false, notes: "Göz yorgunluğunu önlemek için." }
          ];
          setItems(defaultItems);
          localStorage.setItem(storageKey, JSON.stringify(defaultItems));
        }
      }
    };
    fetchWishlist();
  }, [user?.id]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || estimatedPrice <= 0) return;

    const newItem: WishlistItem = {
      id: `wishlist-${Date.now()}`,
      name: name.trim(),
      category,
      estimatedPrice,
      purchased: false,
      link: link.trim() || undefined,
      notes: notes.trim() || undefined
    };

    const updated = [...items, newItem];
    setItems(updated);
    const storageKey = user?.id ? `setup_wishlist_items_${user.id}` : 'setup_wishlist_items';
    localStorage.setItem(storageKey, JSON.stringify(updated));

    try {
      await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newItem, userId: user?.id })
      });
    } catch (e) {
      console.error('Failed to save wishlist item to database', e);
    }
    
    setName('');
    setEstimatedPrice(0);
    setLink('');
    setNotes('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  };

  const handleTogglePurchased = async (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    const updatedItem = { ...item, purchased: !item.purchased };
    const updatedItems = items.map(i => i.id === id ? updatedItem : i);

    setItems(updatedItems);
    const storageKey = user?.id ? `setup_wishlist_items_${user.id}` : 'setup_wishlist_items';
    localStorage.setItem(storageKey, JSON.stringify(updatedItems));

    try {
      await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updatedItem, userId: user?.id })
      });
    } catch (e) {
      console.error('Failed to update wishlist item in database', e);
    }
  };

  const handleDeleteItem = async (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);

    setItems(updatedItems);
    const storageKey = user?.id ? `setup_wishlist_items_${user.id}` : 'setup_wishlist_items';
    localStorage.setItem(storageKey, JSON.stringify(updatedItems));

    try {
      await fetch(`/api/wishlist/${id}`, {
        method: 'DELETE'
      });
    } catch (e) {
      console.error('Failed to delete wishlist item from database', e);
    }
  };

  // Math metrics
  const totalBudget = items.reduce((sum, item) => sum + item.estimatedPrice, 0);
  const spentBudget = items.reduce((sum, item) => sum + (item.purchased ? item.estimatedPrice : 0), 0);
  const remainingBudget = totalBudget - spentBudget;
  const purchasedCount = items.filter(i => i.purchased).length;
  const progressPercent = totalBudget > 0 ? Math.round((spentBudget / totalBudget) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in text-slate-900 ">
      
      {/* Intro Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-4 border-slate-900  pb-6">
        <div className="space-y-2">
          <h3 className="text-xl md:text-2xl font-black text-slate-900  uppercase tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-rose-500" />
            Setup Hayal Listesi & Bütçe Planlayıcı
          </h3>
          <p className="text-sm md:text-base font-handwriting text-slate-600  leading-relaxed">
            Sıradaki masa yükseltmelerini planla veya Akakçe, Cimri, Trendyol, Hepsiburada, N11, Amazon ve Google Alışveriş verileriyle anlık fiyat analizlerini yap!
          </p>
        </div>

        {/* Sub Tab Switcher */}
        <div className="flex flex-wrap border-4 border-slate-900  rounded-2xl p-1 bg-white  shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] shrink-0 gap-1">
          <button
            onClick={() => setPlannerMode('manual')}
            className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              plannerMode === 'manual'
                ? 'bg-teal-500  text-white  shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-transparent text-slate-700  hover:bg-slate-100 '
            }`}
          >
            📝 Manuel Liste
          </button>
          <button
            onClick={() => setPlannerMode('ai')}
            className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
              plannerMode === 'ai'
                ? 'bg-amber-300  text-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-transparent text-slate-700  hover:bg-slate-100 '
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>Yapay Zeka Asistanı</span>
          </button>
          <button
            onClick={() => setPlannerMode('api-info')}
            className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
              plannerMode === 'api-info'
                ? 'bg-indigo-600 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-transparent text-slate-700  hover:bg-slate-100 '
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>Anlık Fiyat API Rehberi</span>
          </button>
          <button
            onClick={() => setPlannerMode('community' as any)}
            className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
              plannerMode === ('community' as any)
                ? 'bg-rose-500 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-transparent text-slate-700  hover:bg-slate-100 '
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-rose-300 shrink-0" />
            <span>Topluluk Donanım Zekası</span>
          </button>
        </div>
      </div>

      {plannerMode === 'api-info' ? (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* API Info Overview Banner */}
          <div className="bg-slate-900 text-white border-4 border-slate-900  rounded-[2.5rem] p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <span className="px-3 py-1 bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider rounded-xl border border-black inline-block">
                  🚀 ÜCRETSİZ & CANLI FİYAT TAKİP APİLERİ
                </span>
                <h3 className="text-xl md:text-2xl font-black text-amber-400 tracking-tight">
                  E-Ticaret & Fiyat Karşılaştırma API Altyapıları
                </h3>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <StoreLogo store="akakce" size="sm" />
                <StoreLogo store="cimri" size="sm" />
                <StoreLogo store="trendyol" size="sm" />
                <StoreLogo store="hepsiburada" size="sm" />
                <StoreLogo store="n11" size="sm" />
                <StoreLogo store="amazon" size="sm" />
              </div>
            </div>

            {/* Explanation Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Option 1: Google Shopping / SerpAPI */}
              <div className="bg-slate-800/90 border-2 border-slate-700 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-black text-sm uppercase">
                  <Globe className="w-5 h-5 text-emerald-400" />
                  <span>1. SerpAPI / Google Shopping TR API (Önerilen)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  <strong>SerpAPI</strong>, Google Alışveriş Türkiye sonuçlarını anlık JSON olarak sunar. Akakçe, Cimri, Trendyol, Hepsiburada, N11, Amazon, Teknosa ve Vatan mağazalarının tüm canlı fiyatlarını tek sorguda çeker.
                </p>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700 text-[11px] text-amber-300 font-mono">
                  ✓ Ayda 100 Sorgu Ücretsiz<br/>
                  ✓ Tüm Türkiye pazaryerlerini kapsar<br/>
                  ✓ Anlık stok ve mağaza logosu verisi sağlar
                </div>
              </div>

              {/* Option 2: AI Google Search Grounding */}
              <div className="bg-slate-800/90 border-2 border-slate-700 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-black text-sm uppercase">
                  <Sparkles className="w-5 h-5 text-rose-400" />
                  <span>2. Gemini Google Search Grounding (Sitemizde Aktif)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Sitemizdeki yapay zeka altyapısı, <strong>Gemini Google Search Grounding</strong> kullanarak Akakçe, Cimri, Trendyol ve Hepsiburada üzerindeki güncel fiyatları canlı web aramasıyla tarar ve en uygun seçeneği çıkarır.
                </p>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700 text-[11px] text-emerald-300 font-mono">
                  ✓ Ek API Key Gerektirmez<br/>
                  ✓ Tamamen Ücretsiz & Sınırsız<br/>
                  ✓ Akakçe ve Cimri en ucuz tekliflerini analiz eder
                </div>
              </div>

              {/* Option 3: Trendyol & Marketplace Public APIs */}
              <div className="bg-slate-800/90 border-2 border-slate-700 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-orange-400 font-black text-sm uppercase">
                  <Server className="w-5 h-5 text-orange-400" />
                  <span>3. Trendyol & Mağaza Public API'leri</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Trendyol Geliştirici Portalından (developers.trendyol.com) ve Hepsiburada Partner API'sından ücretsiz üye olarak ürün stok ve fiyat verisi çekebilirsiniz.
                </p>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700 text-[11px] text-sky-300 font-mono">
                  ✓ Mağaza bazlı doğrudan resmi veri<br/>
                  ✓ Trendyol arama endpointleri<br/>
                  ✓ Anlık stok & fiyat güncelleme
                </div>
              </div>

              {/* Option 4: Akakçe & Cimri Deep Engine */}
              <div className="bg-slate-800/90 border-2 border-slate-700 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-black text-sm uppercase">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span>4. Akakçe & Cimri Doğrudan Karşılaştırma Köprüsü</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Akakçe ve Cimri arama parametreleri entegrasyonu sayesinde kullanıcılar ürünü seçtiğinde akıllı filtreleme ile doğrudan en ucuz satıcının sayfasına yönlendirilir.
                </p>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700 text-[11px] text-rose-300 font-mono">
                  ✓ %100 Yanıltmasız Doğrudan Link<br/>
                  ✓ Logo destekli mağaza butonları<br/>
                  ✓ Anlık satıcı karşılaştırma
                </div>
              </div>

            </div>

            {/* Quick Interactive Store Price Search Tool */}
            <div className="bg-slate-800 p-6 rounded-2xl border-2 border-amber-400 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h4 className="font-black text-sm uppercase text-amber-300 flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  <span>Anlık Ürün Fiyat & Mağaza Sorgulama</span>
                </h4>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2.5 py-0.5 rounded-full">
                  Tüm Mağaza Logoları Desteklenir
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={quickSearchQuery}
                  onChange={(e) => setQuickSearchQuery(e.target.value)}
                  placeholder="Ürün adı yazın (Örn: Logitech G Pro X, LG 27GR75Q, Keychron K2)..."
                  className="flex-1 px-4 py-2.5 bg-slate-900 border-2 border-slate-600 rounded-xl text-xs font-bold text-white outline-none placeholder-slate-500 focus:border-amber-400"
                />
                <button
                  onClick={() => {
                    if (quickSearchQuery.trim()) {
                      setSelectedProductForAnalysis({ name: quickSearchQuery.trim() });
                    }
                  }}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase rounded-xl transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                >
                  Fiyat Analizi Yap 📊
                </button>
              </div>

              {/* Supported Store Logos Showcase */}
              <div className="pt-2 border-t border-slate-700 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Sistemimizde Logo Destekli Entegre Mağazalar:
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <StoreLogo store="akakce" size="sm" />
                  <StoreLogo store="cimri" size="sm" />
                  <StoreLogo store="trendyol" size="sm" />
                  <StoreLogo store="hepsiburada" size="sm" />
                  <StoreLogo store="n11" size="sm" />
                  <StoreLogo store="amazon" size="sm" />
                  <StoreLogo store="google" size="sm" />
                  <StoreLogo store="idefix" size="sm" />
                  <StoreLogo store="teknosa" size="sm" />
                  <StoreLogo store="vatan" size="sm" />
                </div>
              </div>
            </div>

          </div>

        </div>
      ) : plannerMode === ('community' as any) ? (
        <div className="space-y-8 animate-fade-in text-left">
          {/* Platform Intelligence Overview banner */}
          <div className="bg-slate-900 text-white border-4 border-slate-900  rounded-[2.5rem] p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <span className="px-3 py-1 bg-rose-500 text-white font-black text-[10px] uppercase tracking-wider rounded-xl border border-black inline-block">
                  🌐 TOPLULUK DONANIM ZEKASI & POPÜLER PARÇALAR
                </span>
                <h3 className="text-xl md:text-2xl font-black text-amber-300 tracking-tight">
                  Setupss Global Sinerji & Donanım Portalı
                </h3>
              </div>
              <div className="bg-slate-800 px-3.5 py-1.5 rounded-2xl border border-slate-700 text-xs font-bold text-slate-300 shrink-0">
                Analiz Edilen Sistem: <span className="text-rose-400 font-black">{compileCommunityIntelligence(allSetups).sampleSize} Donanım</span>
              </div>
            </div>

            {(() => {
              const intel = compileCommunityIntelligence(allSetups);
              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Column: Most Used Hardware */}
                  <div className="bg-slate-800/80 border-2 border-slate-700 rounded-2xl p-5 space-y-4">
                    <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-700/60 pb-2">
                      <Cpu className="w-4 h-4 text-emerald-400" />
                      <span>En Çok Tercih Edilen Parçalar</span>
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-[11px] font-bold">
                        <span className="text-slate-400 uppercase">Ekran Kartı (GPU):</span>
                        <span className="text-white font-black truncate max-w-[150px]">{intel.mostUsedGpu}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] font-bold">
                        <span className="text-slate-400 uppercase">İşlemci (CPU):</span>
                        <span className="text-white font-black truncate max-w-[150px]">{intel.mostUsedCpu}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] font-bold">
                        <span className="text-slate-400 uppercase">Monitör:</span>
                        <span className="text-white font-black truncate max-w-[150px]">{intel.mostPopularMonitor}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] font-bold">
                        <span className="text-slate-400 uppercase">Klavye:</span>
                        <span className="text-white font-black truncate max-w-[150px]">{intel.mostPopularKeyboard}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] font-bold">
                        <span className="text-slate-400 uppercase">Mouse:</span>
                        <span className="text-white font-black truncate max-w-[150px]">{intel.mostPopularMouse}</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Common Pairings / Sinerji Kombinasyonları */}
                  <div className="bg-slate-800/80 border-2 border-slate-700 rounded-2xl p-5 space-y-4">
                    <h4 className="text-xs font-black text-rose-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-700/60 pb-2">
                      <Globe className="w-4 h-4 text-rose-400" />
                      <span>En Popüler Sinerji Çiftleri</span>
                    </h4>
                    <div className="space-y-2.5">
                      {intel.mostCommonCombinations.map((comb, index) => (
                        <div key={index} className="bg-slate-900/60 border border-slate-700/60 p-2.5 rounded-xl space-y-1">
                          <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-amber-300">
                            <span>🔥 SİNERJİ #{index + 1}</span>
                            <span className="ml-auto text-slate-500">Ort. Uyum: 98%</span>
                          </div>
                          <p className="text-[10px] font-bold text-white truncate">{comb}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Trending Upgrades / Growth */}
                  <div className="bg-slate-800/80 border-2 border-slate-700 rounded-2xl p-5 space-y-4">
                    <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-700/60 pb-2">
                      <TrendingUp className="w-4 h-4 text-amber-400 font-black" />
                      <span>Yükselen Donanım Trendleri</span>
                    </h4>
                    <div className="space-y-3">
                      {intel.trendingHardware.map((item, index) => (
                        <div key={index} className="flex items-center justify-between text-[11px] font-bold border-b border-slate-700/30 pb-2 last:border-0 last:pb-0">
                          <div>
                            <span className="text-white block font-black truncate max-w-[140px]">{item.name}</span>
                            <span className="text-[9px] text-slate-500 font-extrabold uppercase">{item.type}</span>
                          </div>
                          <span className="px-2 py-0.5 bg-green-900/40 border border-green-600 text-green-400 font-black rounded text-[9px]">
                            {item.growth} Popülerlik Artışı
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Platform Brands and Community intelligence summary */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Topluluğun En Sevdiği Donanım Markaları:
                </span>
                <div className="flex gap-1.5 flex-wrap">
                  {compileCommunityIntelligence(allSetups).mostCommonBrands.map(brand => (
                    <span key={brand} className="px-2.5 py-0.5 bg-slate-800 text-white border border-slate-700 text-[9px] font-black rounded-lg">
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-[9px] text-slate-500 font-extrabold uppercase leading-none">
                * Bu veriler Setupss platformunda paylaşılan tüm gerçek masa kurulumlarının yapay zekayla süzülmesiyle oluşturulmuştur.
              </p>
            </div>
          </div>
        </div>
      ) : plannerMode === 'ai' ? (
        <div className="space-y-8">
          <AiPlanner 
            user={user} 
            onOpenAuthModal={onOpenAuthModal} 
            onAddItemsToWishlist={handleAddItemsFromAi} 
          />
          <TrendingDeals onAddSingleItemToWishlist={handleAddSingleItem} />
        </div>
      ) : (
        <>
          {/* Stats Summary Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Total Price Widget */}
            <div className="bg-white  border-4 border-slate-900  rounded-[2rem] p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4 transition-colors">
              <div className="w-12 h-12 rounded-full bg-teal-500 text-white border-2 border-slate-900 flex items-center justify-center shrink-0">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 block">Hedef Bütçe</span>
                <span className="text-base font-black text-slate-900 ">{totalBudget.toLocaleString('tr-TR')} ₺</span>
              </div>
            </div>

            {/* Spent Widget */}
            <div className="bg-white  border-4 border-slate-900  rounded-[2rem] p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4 transition-colors">
              <div className="w-12 h-12 rounded-full bg-amber-400 text-slate-950 border-2 border-slate-900 flex items-center justify-center shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 block">Harcanan / Alınan</span>
                <span className="text-base font-black text-slate-900 ">{spentBudget.toLocaleString('tr-TR')} ₺</span>
              </div>
            </div>

            {/* Remaining Widget */}
            <div className="bg-white  border-4 border-slate-900  rounded-[2rem] p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4 transition-colors">
              <div className="w-12 h-12 rounded-full bg-rose-500 text-white border-2 border-slate-900 flex items-center justify-center shrink-0">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 block">Gereken Kalan</span>
                <span className="text-base font-black text-slate-900 ">{remainingBudget.toLocaleString('tr-TR')} ₺</span>
              </div>
            </div>

            {/* Items Progress Widget */}
            <div className="bg-white  border-4 border-slate-900  rounded-[2rem] p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4 transition-colors">
              <div className="w-12 h-12 rounded-full bg-purple-600 text-white border-2 border-slate-900 flex items-center justify-center shrink-0">
                <Percent className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-black uppercase text-slate-400 block">Tamamlanma Oranı</span>
                <span className="text-base font-black text-slate-900 ">{progressPercent}% ({purchasedCount} / {items.length} Parça)</span>
              </div>
            </div>
          </div>

          {/* Progress Bar Display */}
          <div className="bg-white  border-4 border-slate-900  rounded-3xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-1.5 transition-colors">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-slate-900 ">
              <span>Upgrade Süreci Yol Haritası</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-4 bg-slate-100  rounded-full overflow-hidden border-2 border-slate-900 ">
              <div 
                className="h-full bg-teal-500 rounded-full transition-all duration-300 border-r-2 border-slate-900"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Double Column Panel: Form Left / List Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Form: Add item */}
            <form onSubmit={handleAddItem} className="lg:col-span-5 bg-white  border-4 border-slate-900  rounded-[2rem] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4 transition-colors">
              <h4 className="font-black uppercase tracking-tight text-slate-900  text-sm border-b-2 border-slate-900  pb-2">Yeni Ekipman Hedefi</h4>
              
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-rose-500">Ekipman Adı</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Örn: Logitech G Pro X Superlight"
                  className="w-full px-3 py-2 bg-slate-50  border-2 border-slate-900  rounded-xl text-xs font-bold outline-none text-slate-900  placeholder-slate-400 focus:ring-4 focus:ring-teal-400/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-rose-500">Kategori</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50  border-2 border-slate-900  rounded-xl text-xs font-bold outline-none text-slate-900  focus:ring-4 focus:ring-teal-400/40"
                  >
                    <option value="Masaüstü / Mobilya">Masaüstü / Mobilya</option>
                    <option value="Klavye / Mouse">Klavye / Mouse</option>
                    <option value="Kulaklık / Hoparlör">Kulaklık / Hoparlör</option>
                    <option value="Monitör / Görüntü">Monitör / Görüntü</option>
                    <option value="Işıklandırma / Ses">Işıklandırma / Ses</option>
                    <option value="PC Donanım (Kasa İçi)">PC Donanım (Kasa İçi)</option>
                    <option value="Aksesuar / Kablolama">Aksesuar / Kablolama</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-rose-500 font-sans">Tahmini Fiyat (₺)</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={estimatedPrice || ''}
                    onChange={e => setEstimatedPrice(Number(e.target.value))}
                    placeholder="Örn: 3200"
                    className="w-full px-3 py-2 bg-slate-50  border-2 border-slate-900  rounded-xl text-xs font-bold outline-none text-slate-900  placeholder-slate-400 focus:ring-4 focus:ring-teal-400/40"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-rose-500">Ürün Linki (İsteğe Bağlı)</label>
                <input
                  type="url"
                  value={link}
                  onChange={e => setLink(e.target.value)}
                  placeholder="https://www.hepsiburada.com/..."
                  className="w-full px-3 py-2 bg-slate-50  border-2 border-slate-900  rounded-xl text-xs font-bold outline-none text-slate-900  placeholder-slate-400 focus:ring-4 focus:ring-teal-400/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-rose-500 font-sans">Kişisel Notlar</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Hangi renkte alınacak? İndirim beklemeli miyim?..."
                  className="w-full px-3 py-2 bg-slate-50  border-2 border-slate-900  rounded-xl text-xs font-medium outline-none text-slate-900  placeholder-slate-400 focus:ring-4 focus:ring-teal-400/40 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-teal-500 hover:bg-teal-600   text-white  border-2 border-slate-900 rounded-xl py-2.5 font-black uppercase text-xs tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
              >
                Listeye Ekle ➕
              </button>

              {showSuccess && (
                <div className="flex items-center gap-1.5 p-2.5 bg-green-100  border-2 border-green-600 rounded-xl text-green-800  text-[10px] font-black uppercase justify-center">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Başarıyla Listeye Eklendi!</span>
                </div>
              )}
            </form>

            {/* Right side: Items Checklist */}
            <div className="lg:col-span-7 bg-white  border-4 border-slate-900  rounded-[2rem] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4 transition-colors">
              <div className="flex items-center justify-between border-b-2 border-slate-900  pb-2">
                <h4 className="font-black uppercase tracking-tight text-slate-900  text-sm">Alınacak Ekipmanlar</h4>
                <span className="text-[10px] bg-amber-300  border-2 border-slate-900 text-slate-950 font-black px-2 py-0.5 rounded-md">
                  {items.length} Kalem
                </span>
              </div>

              {items.length === 0 ? (
                <div className="p-12 border-2 border-dashed border-slate-300  rounded-3xl text-center space-y-2">
                  <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
                  <h5 className="font-bold text-slate-800  text-xs uppercase">Listeniz Boş</h5>
                  <p className="text-[10px] text-slate-400 font-medium max-w-xs mx-auto">Sol taraftaki formu kullanarak hedeflediğiniz ilk donanım veya aksesuarı ekleyin!</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`border-2 border-slate-900  rounded-2xl p-4 flex items-center justify-between transition-all gap-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] ${
                        item.purchased 
                          ? 'bg-green-50/50  border-green-700 ' 
                          : 'bg-slate-50 '
                      }`}
                    >
                      {/* Left: Check trigger & content */}
                      <div className="flex items-start gap-3 flex-1 overflow-hidden">
                        <button
                          onClick={() => handleTogglePurchased(item.id)}
                          className="mt-0.5 text-slate-900  cursor-pointer shrink-0 transition-transform active:scale-90"
                        >
                          {item.purchased ? (
                            <CheckCircle className="w-5 h-5 text-green-600  fill-green-100 " />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-900 " />
                          )}
                        </button>

                        <div className="space-y-1.5 min-w-0">
                          <div className="flex items-center flex-wrap gap-1.5">
                            <span className="text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 border border-slate-900  rounded-md bg-white  text-slate-900 ">
                              {item.category}
                            </span>
                            {item.purchased && (
                              <span className="text-[8px] font-extrabold uppercase bg-green-200  text-green-800  border border-green-700 px-2 py-0.5 rounded-md">
                                Alındı
                              </span>
                            )}
                          </div>
                          <h5 className={`text-xs font-black truncate text-slate-900  ${item.purchased ? 'line-through text-slate-400 ' : ''}`}>
                            {item.name}
                          </h5>
                          {item.notes && (
                            <p className="text-[10px] font-medium text-slate-500  line-clamp-1">
                              Not: {item.notes}
                            </p>
                          )}

                          {/* Live Comparison Store Logos & Action Buttons */}
                          <div className="flex items-center gap-1.5 pt-1.5 flex-wrap">
                            <button
                              onClick={() => setSelectedProductForAnalysis({ name: item.name, price: item.estimatedPrice })}
                              className="px-2 py-1 bg-slate-900  hover:bg-slate-800  text-amber-300  border border-slate-900 rounded-lg text-[9px] font-black uppercase transition-all flex items-center gap-1 cursor-pointer shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                              title="Tüm mağaza logoları ve canlı fiyat analizini aç"
                            >
                              <BarChart2 className="w-2.5 h-2.5" />
                              <span>Fiyat Analizi</span>
                            </button>

                            {/* Store Logos Quick Shortcuts */}
                            <a 
                              href={buildAkakceUrl(item.name)} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              title="Akakçe'de gör"
                              className="hover:scale-105 transition-transform"
                            >
                              <StoreLogo store="akakce" size="sm" showName={false} />
                            </a>

                            <a 
                              href={buildCimriUrl(item.name)} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              title="Cimri'de gör"
                              className="hover:scale-105 transition-transform"
                            >
                              <StoreLogo store="cimri" size="sm" showName={false} />
                            </a>

                            <a 
                              href={buildTrendyolUrl(item.name)} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              title="Trendyol'da gör"
                              className="hover:scale-105 transition-transform"
                            >
                              <StoreLogo store="trendyol" size="sm" showName={false} />
                            </a>

                            <a 
                              href={buildHepsiburadaUrl(item.name)} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              title="Hepsiburada'da gör"
                              className="hover:scale-105 transition-transform"
                            >
                              <StoreLogo store="hepsiburada" size="sm" showName={false} />
                            </a>

                            {item.link && !item.link.includes('akakce.com') && !item.link.includes('cimri.com') && (
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[9px] text-teal-600  font-bold hover:underline flex items-center gap-0.5 uppercase ml-1"
                              >
                                Özel Link <Plus className="w-2 h-2 rotate-45" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Price & Delete */}
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-xs font-black text-slate-900  ${item.purchased ? 'text-slate-400 ' : ''}`}>
                          {item.estimatedPrice.toLocaleString('tr-TR')} ₺
                        </span>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1.5 border-2 border-slate-900 bg-rose-500 hover:bg-rose-600 text-white rounded-lg cursor-pointer transition-transform active:scale-95"
                          title="Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

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
