import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SetupPost, SetupComment } from '../types';
import { X, Heart, Calendar, ArrowUpRight, MessageCircleCode, CheckCircle2, MessageSquare, Activity, ShieldCheck, Zap, TrendingDown, RefreshCw, BarChart2, DollarSign } from 'lucide-react';
import { validateBuild, getUpgradeAdvisor, getPriceIntelligence, getAlternatives } from '../utils/aiValidationEngine';

const isVideo = (url: string) => {
  if (!url) return false;
  if (url.startsWith('data:video/')) return true;
  const extensions = ['.mp4', '.webm', '.ogg', '.mov'];
  return extensions.some(ext => url.toLowerCase().includes(ext));
};

interface SetupDetailProps {
  setup: SetupPost;
  onClose: () => void;
  onLike: (id: string) => void;
  onAddComment: (id: string, comment: Omit<SetupComment, 'id' | 'createdAt'>) => void;
  user?: any;
  onAuthTrigger?: () => void;
  onStartChat?: (ownerName: string) => void;
}

export const SetupDetail: React.FC<SetupDetailProps> = ({
  setup,
  onClose,
  onLike,
  onAddComment,
  user,
  onAuthTrigger,
  onStartChat
}) => {
  const [commentContent, setCommentContent] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [aiTab, setAiTab] = useState<'compat' | 'bottleneck' | 'upgrade' | 'price'>('compat');

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAuthor = user ? (user.displayName || user.name || 'Üye') : '';
    if (!finalAuthor || !commentContent.trim()) return;

    onAddComment(setup.id, {
      author: finalAuthor,
      content: commentContent.trim()
    });

    setCommentContent('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Group components by categories for a cleaner structured view
  const groupedComponents = (setup.components || []).reduce((acc: Record<string, string[]>, comp) => {
    const key = comp.category || "Diğer Ekipmanlar";
    if (!acc[key]) acc[key] = [];
    acc[key].push(comp.name);
    return acc;
  }, {} as Record<string, string[]>);

  const formatDate = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return "Yakın zamanda";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-vibrant-dark/70 backdrop-blur-md flex items-start sm:items-center justify-center p-4 py-8 overflow-y-auto"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="bg-vibrant-bg  border-4 border-vibrant-dark  rounded-[2.5rem] w-full max-w-4xl max-h-[88vh] overflow-hidden shadow-[12px_12px_0px_0px_rgba(45,52,54,1)] relative flex flex-col rgb-modal-border my-auto shrink-0 transition-colors"
      >
        
        {/* Header */}
        <div className="bg-white  border-b-4 border-vibrant-dark  px-6 py-4 flex items-center justify-between z-20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-vibrant-dark  rounded-full overflow-hidden bg-vibrant-yellow flex-shrink-0">
              {setup.ownerAvatar ? (
                <img 
                  src={setup.ownerAvatar} 
                  alt={setup.owner} 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement; target.onerror = null;
                    target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-black text-vibrant-dark text-xs">{setup.owner.substring(0, 2).toUpperCase()}</div>
              )}
            </div>
            <div>
              <h3 className="font-black text-vibrant-dark  uppercase tracking-tight text-lg md:text-xl leading-none">{setup.title}</h3>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <p className="text-[11px] text-slate-500  font-bold">Paylaşan: {setup.owner} • {setup.bio}</p>
                {onStartChat && (
                  <button
                    onClick={() => onStartChat(setup.owner)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#4CD137] hover:bg-[#44bd32] text-vibrant-dark border-2 border-vibrant-dark text-[9px] font-black uppercase tracking-wider rounded-lg shadow-[1.5px_1.5px_0px_0px_rgba(45,52,54,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-2.5 h-2.5" />
                    Sohbet Et
                  </button>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border-2 border-vibrant-dark bg-[#FF6B6B] hover:bg-[#ff5252] text-white rounded-xl transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
          {/* Main Visual and Details Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Column: Image & Story */}
            <div className="space-y-6">
              <div className="border-4 border-vibrant-dark  rounded-3xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(45,52,54,1)] bg-white ">
                {isVideo(setup.image) ? (
                  <video
                    ref={(el) => {
                      if (el) {
                        el.muted = true;
                        el.defaultMuted = true;
                        el.play().catch(() => {});
                      }
                    }}
                    src={setup.image}
                    controls
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-auto max-h-[350px] object-cover"
                  />
                ) : (
                  <img
                    src={setup.image}
                    alt={`${setup.title} - ${setup.components && setup.components.length > 0 ? setup.components.map((c: any) => c.name).slice(0, 5).join(', ') : 'Masaüstü Oyuncu ve Çalışma Alanı'} | Setupss`}
                    className="w-full h-auto object-cover max-h-[350px]"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement; target.onerror = null;
                      target.src = 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                )}
              </div>

              {/* Story/Description */}
              <div className="bg-white  border-4 border-vibrant-dark  rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(45,52,54,1)] space-y-3">
                <h4 className="font-black uppercase text-xs tracking-wider text-vibrant-coral">Kurulumun Hikayesi</h4>
                <p className="text-xs text-slate-600  font-medium leading-relaxed">
                  {setup.description}
                </p>
                <div className="flex items-center gap-1.5 pt-2 border-t border-slate-150  text-[10px] text-slate-400  font-bold">
                  <Calendar className="w-3.5 h-3.5 text-vibrant-dark " />
                  <span>{formatDate(setup.createdAt)} tarihinde yayınlandı</span>
                </div>
              </div>

              {setup.videoUrl && (
                <div className="bg-white  border-4 border-vibrant-dark  rounded-3xl p-4 shadow-[4px_4px_0px_0px_rgba(45,52,54,1)] space-y-2">
                  <h4 className="font-black uppercase text-xs tracking-wider text-vibrant-coral flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                    Masaüstü Video İncelemesi / Turu
                  </h4>
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden border-2 border-vibrant-dark ">
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={setup.videoUrl}
                      title="Masaüstü Turu"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}

              {/* Tags list */}
              <div className="flex flex-wrap gap-1.5">
                {(setup.tags || []).map(tag => (
                  <span
                    key={tag}
                    className="bg-[#FFEAA7]  border-2 border-vibrant-dark  text-vibrant-dark  text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-xl shadow-[1.5px_1.5px_0px_0px_rgba(45,52,54,1)]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column: Spec sheet / Components list */}
            <div className="space-y-6">
              <div className="bg-white  border-4 border-vibrant-dark  rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(45,52,54,1)]">
                <div className="flex items-center justify-between border-b-2 border-vibrant-dark  pb-3 mb-4">
                  <h4 className="font-black uppercase text-sm tracking-tight text-vibrant-dark ">Donanım Listesi (Specs)</h4>
                  <span className="text-[10px] bg-vibrant-yellow  border-2 border-vibrant-dark  text-vibrant-dark  font-black px-2 py-0.5 rounded-md">
                    {setup.components.length} Parça
                  </span>
                </div>

                {/* Iterate through grouped spec categories */}
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {(Object.entries(groupedComponents) as [string, string[]][]).map(([cat, names]) => (
                    <div key={cat} className="space-y-1.5 bg-vibrant-bg/45  border-2 border-vibrant-dark/15  p-3 rounded-2xl">
                      <span className="text-[10px] font-black uppercase tracking-wider text-vibrant-coral block">{cat}</span>
                      <ul className="space-y-1">
                        {names.map((name, i) => (
                          <li key={i} className="text-xs text-vibrant-dark  font-bold flex items-start gap-1.5">
                            <span className="text-vibrant-dark/60 ">•</span>
                            <span>{name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Setupss AI Compatibility & Performance Audit (SAIOS v1.0) */}
              {(() => {
                const report = validateBuild(setup.components);
                const upgradeAdvisor = getUpgradeAdvisor(setup.components);
                
                return (
                  <div className="bg-white  border-4 border-vibrant-dark  rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(45,52,54,1)] space-y-4 text-left">
                    <div className="flex items-center justify-between border-b-2 border-vibrant-dark  pb-3">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-vibrant-yellow  border-2 border-vibrant-dark  rounded-xl text-xs">🤖</span>
                        <div>
                          <span className="text-xs font-black uppercase tracking-tight text-vibrant-dark  block">SAIOS v1.0 Akıllı Donanım Raporu</span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase block mt-0.5">Yapay Zeka Sinerji, Güç ve Fiyat Analizi</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-black text-vibrant-coral bg-[#FFEAA7] border-2 border-vibrant-dark px-2 py-0.5 rounded-lg shrink-0">PRO</span>
                    </div>

                    {/* Simple Sub-Tabs for different aspects of the AI audit */}
                    <div className="grid grid-cols-4 gap-1 border-2 border-vibrant-dark  bg-vibrant-bg  p-1 rounded-2xl">
                      {[
                        { id: 'compat', label: 'Uyum', icon: ShieldCheck },
                        { id: 'bottleneck', label: 'Darboğaz', icon: Activity },
                        { id: 'upgrade', label: 'Yükselt', icon: Zap },
                        { id: 'price', label: 'Fiyat', icon: DollarSign }
                      ].map(t => {
                        const IconComp = t.icon;
                        const isSel = aiTab === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setAiTab(t.id as any)}
                            className={`py-2 px-1 rounded-xl border-2 text-[9px] font-black uppercase flex flex-col items-center gap-1 transition-all cursor-pointer ${
                              isSel 
                                ? 'bg-vibrant-yellow text-vibrant-dark border-vibrant-dark shadow-[1px_1px_0px_0px_rgba(45,52,54,1)]' 
                                : 'bg-transparent text-slate-400  border-transparent hover:text-vibrant-dark '
                            }`}
                          >
                            <IconComp className="w-3.5 h-3.5" />
                            <span>{t.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Tab contents */}
                    <div className="space-y-3 pt-1">
                      {aiTab === 'compat' && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="border-2 border-vibrant-dark  rounded-xl p-2.5 bg-vibrant-bg  text-left">
                              <span className="text-[8px] text-slate-400 font-black uppercase block">Uyum Skoru</span>
                              <span className="text-2xl font-black text-vibrant-dark ">{report.compatibilityScore}%</span>
                              <div className="w-full bg-slate-200 h-2 border border-vibrant-dark rounded-full overflow-hidden mt-1.5">
                                <div className={`h-full ${report.compatibilityScore >= 90 ? 'bg-emerald-400' : 'bg-vibrant-yellow'}`} style={{ width: `${report.compatibilityScore}%` }} />
                              </div>
                            </div>
                            <div className="border-2 border-vibrant-dark  rounded-xl p-2.5 bg-vibrant-bg  text-left space-y-0.5">
                              <span className="text-[8px] text-slate-400 font-black uppercase block">Tepe Güç Tüketimi</span>
                              <span className="text-base font-black text-vibrant-dark ">{report.power.estimatedPeakTdp}W</span>
                              <span className="text-[8px] text-vibrant-coral font-bold block">Tavsiye: {report.power.recommendedPsuWattage}W PSU</span>
                            </div>
                          </div>

                          <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                            {report.items.map((item, index) => (
                              <div key={index} className="p-2 bg-vibrant-bg/40  border border-vibrant-dark/20  rounded-xl">
                                <div className="text-[9px] font-black uppercase flex items-center gap-1.5">
                                  <span>{item.status === 'error' ? '❌' : item.status === 'warning' ? '⚠' : '✅'}</span>
                                  <span className="text-vibrant-dark ">{item.title}</span>
                                </div>
                                <p className="text-[9px] font-bold text-slate-500 mt-0.5 leading-tight">{item.message}</p>
                              </div>
                            ))}
                            {report.items.length === 0 && (
                              <div className="text-center py-4 text-[10px] font-bold text-slate-400">
                                Tüm parçalar tam uyumlu! Sinerji mükemmel seviyede.
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {aiTab === 'bottleneck' && (
                        <div className="space-y-3 text-left">
                          <div className="border-2 border-vibrant-dark  rounded-xl p-3 bg-vibrant-bg  space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-[8px] text-slate-400 font-black uppercase">CPU/GPU Darboğaz Yüzdesi</span>
                              <span className="text-xs font-black text-vibrant-coral">{report.bottleneck.cpuBottleneckPct}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-2.5 border border-vibrant-dark rounded-full overflow-hidden">
                              <div className="h-full bg-vibrant-coral" style={{ width: `${report.bottleneck.cpuBottleneckPct}%` }} />
                            </div>
                            <p className="text-[9px] font-bold text-slate-500 pt-1 leading-snug">{report.bottleneck.description}</p>
                          </div>

                          <div className="p-2.5 bg-blue-50/50  border-2 border-blue-200  rounded-xl">
                            <span className="text-[9px] font-black uppercase text-blue-800  block">Çözünürlük Darboğaz Etkisi</span>
                            <span className="text-[10px] font-bold text-slate-600  mt-1 block">
                              1080p çözünürlükte CPU darboğazı {report.bottleneck.cpuBottleneckPct}%, 1440p'de %{Math.max(2, report.bottleneck.cpuBottleneckPct - 8)}, 4K çözünürlükte ise GPU limitasyonu ön plana çıkarak darboğaz %1 seviyesine iner.
                            </span>
                          </div>
                        </div>
                      )}

                      {aiTab === 'upgrade' && (
                        <div className="space-y-3 text-left">
                          {upgradeAdvisor.length > 0 ? (
                            <>
                              <div className="p-3 bg-[#FFEAA7]/30  border-2 border-[#FFEAA7]  rounded-xl space-y-1">
                                <span className="text-[8px] text-amber-800  font-black uppercase">Yapay Zeka Tavsiyesi</span>
                                <h5 className="text-xs font-black text-vibrant-dark  uppercase leading-none">
                                  {upgradeAdvisor[0].componentCategory} - {upgradeAdvisor[0].currentName}
                                </h5>
                                <p className="text-[9px] font-bold text-slate-600  leading-snug">
                                  Yapay Zeka bu bileşenin sistemdeki genel potansiyeli sınırladığını tespit etti. %{upgradeAdvisor[0].performanceGainPct} genel performans artışı için yükseltme önerilmektedir.
                                </p>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div className="border border-vibrant-dark/20  bg-vibrant-bg  p-2 rounded-xl">
                                  <span className="text-[8px] text-slate-400 font-bold uppercase block">Önerilen Upgrade</span>
                                  <span className="text-[10px] font-black text-vibrant-dark  block truncate">
                                    {upgradeAdvisor[0].recommendedUpgrade}
                                  </span>
                                </div>
                                <div className="border border-vibrant-dark/20  bg-vibrant-bg  p-2 rounded-xl">
                                  <span className="text-[8px] text-slate-400 font-bold uppercase block">Tahmini FPS Artışı</span>
                                  <span className="text-[10px] font-black text-green-600  block">
                                    +{upgradeAdvisor[0].fpsGainPct}%
                                  </span>
                                </div>
                              </div>
                            </>
                          ) : (
                            <p className="text-[10px] font-bold text-slate-400 italic">Analiz için yeterli parça bilgisi bulunamadı.</p>
                          )}
                        </div>
                      )}

                      {aiTab === 'price' && (() => {
                        const firstHw = setup.components.find(c => c.category.match(/cpu|gpu|işlemci|ekran/i)) || setup.components[0];
                        if (!firstHw) return <p className="text-[10px] font-bold text-slate-400">Ekipman bilgisi bulunamadı.</p>;
                        const pIntel = getPriceIntelligence(firstHw.name, firstHw.category);
                        return (
                          <div className="space-y-3 text-left">
                            <div className="border-2 border-vibrant-dark  rounded-xl p-2.5 bg-vibrant-bg  space-y-1">
                              <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                                <span className="uppercase tracking-wider">Masaüstü Odak Parçası:</span>
                                <span className="text-vibrant-dark  font-black truncate max-w-[120px]">{firstHw.name}</span>
                              </div>
                              <div className="flex justify-between items-center mt-1">
                                <span className="text-[9px] font-black text-slate-400 uppercase">Tahmini Akakçe/Cimri Fiyatı:</span>
                                <span className="text-xs font-black text-vibrant-dark ">₺{Math.round(pIntel.currentPrice * 34.2 * 1.25).toLocaleString('tr-TR')}</span>
                              </div>
                              <div className="flex justify-between items-center text-[9px] font-bold text-slate-500">
                                <span>Tarihsel En Düşük Fiyat:</span>
                                <span className="text-green-600 font-black">₺{Math.round(pIntel.historicalLow * 34.2 * 1.25).toLocaleString('tr-TR')}</span>
                              </div>
                              <div className="flex justify-between items-center text-[9px] font-bold text-slate-500">
                                <span>Piyasa Trendi:</span>
                                <span className={`font-black ${pIntel.trend === 'down' ? 'text-green-600' : pIntel.trend === 'up' ? 'text-vibrant-coral' : 'text-amber-500'}`}>
                                  {pIntel.trend === 'down' ? '📉 DÜŞÜŞTE' : pIntel.trend === 'up' ? '📈 ARTIŞTA' : '➡️ STABİL'}
                                </span>
                              </div>
                            </div>
                            <p className="text-[9px] font-bold text-slate-400 leading-snug italic">
                              💡 <strong>Öneri:</strong> {pIntel.advice}
                            </p>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                );
              })()}

              {/* Inside detail like button */}
              <div className="flex items-center justify-between bg-vibrant-yellow border-4 border-vibrant-dark rounded-3xl p-4 shadow-[4px_4px_0px_0px_rgba(45,52,54,1)]">
                <div>
                  <span className="text-[10px] font-black uppercase text-vibrant-dark/70 block">Bu Kurulumu Beğendiniz mi?</span>
                  <span className="text-xs text-vibrant-dark font-extrabold">{setup.owner || 'Kullanıcı'}'ın kurulumuna puan kazandırın!</span>
                </div>
                <button
                  onClick={() => {
                    if (!user) {
                      onAuthTrigger?.();
                      return;
                    }
                    onLike(setup.id);
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-vibrant-dark font-black uppercase text-xs transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] ${
                    setup.likedByUser
                      ? 'bg-[#FF6B6B] text-white'
                      : 'bg-white text-vibrant-dark hover:bg-vibrant-bg'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${setup.likedByUser ? 'fill-white' : ''}`} />
                  <span>{setup.likes}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Section: Discussion / Comments Forum */}
          <div className="border-t-4 border-vibrant-dark/15 pt-8 grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Left side: Comments Timeline */}
            <div className="md:col-span-7 space-y-4">
              <h4 className="font-black uppercase text-sm tracking-tight text-vibrant-dark flex items-center gap-1.5 mb-2">
                <MessageCircleCode className="w-5 h-5 text-vibrant-coral" />
                Tartışma Odası ({setup.comments.length} Yorum)
              </h4>

              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                {setup.comments.length === 0 ? (
                  <div className="p-8 border-2 border-dashed border-vibrant-dark/15 bg-white rounded-3xl text-center">
                    <p className="text-xs text-slate-400 font-semibold">Bu masa düzeni için henüz bir yorum yapılmamış. İlk yorumu sen yap!</p>
                  </div>
                ) : (
                  (setup.comments || []).map(comm => (
                    <div 
                      key={comm.id} 
                      className="bg-white border-2 border-vibrant-dark rounded-2xl p-4 shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 border border-vibrant-dark rounded-lg overflow-hidden bg-vibrant-bg flex-shrink-0">
                            {comm.authorAvatar ? (
                              <img src={comm.authorAvatar} alt={comm.author} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-black text-vibrant-dark text-[8px] uppercase">{comm.author.substring(0, 2)}</div>
                            )}
                          </div>
                          <span className="text-xs font-black uppercase tracking-tight text-[#4ECDC4]">{comm.author}</span>
                        </div>
                        <span className="text-[9px] font-mono font-bold text-slate-400">{formatDate(comm.createdAt)}</span>
                      </div>
                      <p className="text-xs font-semibold text-vibrant-dark leading-relaxed pl-8">
                        {comm.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right side: Add comment Form */}
            <div className="md:col-span-5">
              {!user ? (
                <div className="bg-white border-4 border-vibrant-dark rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(45,52,54,1)] text-center space-y-4">
                  <h4 className="font-black uppercase text-xs tracking-wider text-vibrant-dark">💬 Yorum Yaz</h4>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                    Yorum yazarak toplulukla etkileşime girmek ve sorularını sormak için giriş yapmalısın.
                  </p>
                  <button
                    type="button"
                    onClick={onAuthTrigger}
                    className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white border-2 border-vibrant-dark rounded-xl py-2 font-black uppercase text-xs tracking-wider shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
                  >
                    Giriş Yap / Üye Ol 🔑
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCommentSubmit} className="bg-white border-4 border-vibrant-dark rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(45,52,54,1)] space-y-4">
                  <h4 className="font-black uppercase text-xs tracking-wider text-vibrant-dark">Yorum Yaz</h4>
                  
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-wider text-vibrant-coral">Yorum Sahibi</label>
                    <div className="w-full px-3 py-2 bg-slate-100 border-2 border-vibrant-dark rounded-xl text-xs font-black text-vibrant-dark">
                      {user.displayName || user.name || "Üye"}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-wider text-vibrant-coral">Yorumunuz</label>
                    <textarea
                      required
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      placeholder="Monitör kolu hakkında ne düşünüyorsunuz? Kablo bağlarını nereden sipariş ettiniz?..."
                      rows={3}
                      className="w-full px-3 py-2 bg-vibrant-bg border-2 border-vibrant-dark rounded-xl text-xs font-medium outline-none placeholder-vibrant-dark/40 focus:ring-4 focus:ring-vibrant-teal/30 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#4ECDC4] hover:bg-[#3dbbb2] text-white border-2 border-vibrant-dark rounded-xl py-2 font-black uppercase text-xs tracking-wider shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
                  >
                    Gönder
                  </button>

                  {showSuccess && (
                    <div className="flex items-center gap-1.5 p-2.5 bg-green-50 border-2 border-green-500 rounded-xl text-green-700 text-[10px] font-black uppercase">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Yorumunuz Başarıyla Eklendi!</span>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
};
