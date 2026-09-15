import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import { SetupPost, SetupCategory } from '../types';
import { SafeImage } from './SafeImage';
import { getThumbnailUrl } from '../utils/mediaSeo';
import { Logo } from './Logo';
import { AiAvatar } from './AiAvatar';
import { Heart, MessageSquare, Search, SlidersHorizontal, Tag, Sparkles, Trash2, Bot, Video as VideoIcon, Zap, Play } from 'lucide-react';

const isVideo = (url: string) => {
  if (!url) return false;
  if (url.startsWith('data:video/')) return true;
  const extensions = ['.mp4', '.webm', '.ogg', '.mov'];
  return extensions.some(ext => url.toLowerCase().includes(ext));
};

interface SetupListProps {
  setups: SetupPost[];
  user?: any;
  onSelectSetup: (setup: SetupPost) => void;
  onLikeSetup: (id: string) => void;
  onDeleteSetup?: (id: string) => void;
  onOpenAddModal: () => void;
  onOpenAiChat?: () => void;
}

export const SetupList: React.FC<SetupListProps> = React.memo(({
  setups = [],
  user,
  onSelectSetup,
  onLikeSetup,
  onDeleteSetup,
  onOpenAddModal,
  onOpenAiChat
}) => {
  const [selectedCategory, setSelectedCategory] = useState<SetupCategory | 'Tümü'>('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'newest'>('popular');
  const [visibleCount, setVisibleCount] = useState(12);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const categories: (SetupCategory | 'Tümü')[] = [
    'Tümü',
    'Minimalist',
    'RGB & Oyuncu',
    'Yazılımcı Atölyesi',
    'Kreatif Stüdyo',
    'Cozy / Retro'
  ];

  const [stableOrder, setStableOrder] = useState<string[]>([]);

  // Calculate the sorted IDs whenever setups list (elements/IDs) or filter criteria changes
  const setupsIdKey = setups.map(s => s.id).join(',');
  useEffect(() => {
    const filtered = setups.filter(setup => {
      const matchesCategory = selectedCategory === 'Tümü' || setup.category === selectedCategory;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        (setup.title || "").toLowerCase().includes(query) ||
        (setup.owner || "").toLowerCase().includes(query) ||
        (setup.bio || "").toLowerCase().includes(query) ||
        (setup.description || "").toLowerCase().includes(query) ||
        (setup.tags || []).some(tag => tag.toLowerCase().includes(query)) ||
        (setup.components || []).some(comp => comp.name.toLowerCase().includes(query));
      
      return matchesCategory && matchesSearch;
    });

    filtered.sort((a, b) => {
      const aIsVideo = isVideo(a.image);
      const bIsVideo = isVideo(b.image);
      
      if (sortBy === 'popular') {
        if (aIsVideo && !bIsVideo) return -1;
        if (!aIsVideo && bIsVideo) return 1;
        return b.likes - a.likes;
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    setStableOrder(filtered.map(s => s.id));
  }, [setupsIdKey, selectedCategory, searchQuery, sortBy]);

  // Filter and search setups - mapped to the stable sort order
  const filteredSetups = useMemo(() => {
    return stableOrder
      .map(id => setups.find(s => s.id === id))
      .filter((s): s is SetupPost => !!s);
  }, [stableOrder, setups]);

  // Reset page when criteria changes
  useEffect(() => {
    setVisibleCount(12);
  }, [selectedCategory, searchQuery, sortBy]);

  // Load more setups when scrolling near bottom
  useEffect(() => {
    if (!loadMoreRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 12, filteredSetups.length));
        }
      },
      { threshold: 0.1, rootMargin: '300px' }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [filteredSetups.length]);

  const maxLikes = useMemo(() => {
    return Math.max(...filteredSetups.map(s => s.likes || 0), 0);
  }, [filteredSetups]);

  const getCategoryColor = useCallback((cat: SetupCategory) => {
    switch (cat) {
      case 'Minimalist': return 'bg-[#4ECDC4] text-white';
      case 'RGB & Oyuncu': return 'bg-[#FF6B6B] text-white';
      case 'Yazılımcı Atölyesi': return 'bg-vibrant-yellow text-vibrant-dark';
      case 'Kreatif Stüdyo': return 'bg-purple-500 text-white';
      case 'Cozy / Retro': return 'bg-orange-400 text-vibrant-dark';
      default: return 'bg-slate-200 text-slate-800';
    }
  }, []);

  const getThemeStyles = useCallback((theme?: SetupPost['cardTheme']) => {
    switch (theme) {
      case 'soft-blue': return { bg: 'bg-[#EBF5FF] ', text: 'text-blue-950 ', sub: 'text-blue-700/80 ', componentBg: 'bg-white ', componentText: 'text-blue-900 ' };
      case 'soft-purple': return { bg: 'bg-[#F8EFFF] ', text: 'text-purple-950 ', sub: 'text-purple-700/80 ', componentBg: 'bg-white ', componentText: 'text-purple-900 ' };
      case 'soft-green': return { bg: 'bg-[#EFFBF2] ', text: 'text-emerald-950 ', sub: 'text-emerald-700/80 ', componentBg: 'bg-white ', componentText: 'text-emerald-900 ' };
      case 'soft-yellow': return { bg: 'bg-[#FFFDEB] ', text: 'text-amber-950 ', sub: 'text-amber-800/80 ', componentBg: 'bg-white ', componentText: 'text-amber-900 ' };
      case 'soft-pink': return { bg: 'bg-[#FFF0F5] ', text: 'text-pink-950 ', sub: 'text-pink-700/80 ', componentBg: 'bg-white ', componentText: 'text-pink-900 ' };
      case 'dark':
      default: return { bg: 'bg-[#F4F5F8] ', text: 'text-vibrant-dark ', sub: 'text-slate-600 ', componentBg: 'bg-white ', componentText: 'text-slate-800 ' };
    }
  }, []);

  return (
    <div id="setup-feed-section" className="space-y-8 scroll-mt-24">
      {/* Search and Filters Section */}
      <div className="bg-white  border-4 border-vibrant-dark  rounded-[2.5rem] p-4 sm:p-6 shadow-[8px_8px_0px_0px_rgba(45,52,54,1)] space-y-5 transition-colors">
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 items-stretch lg:items-center justify-between">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-vibrant-dark " />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Setup başlığı, donanım, marka veya etiket ara..."
              className="w-full pl-11 sm:pl-12 pr-4 py-3 bg-vibrant-bg  border-3 sm:border-4 border-vibrant-dark  rounded-2xl text-xs sm:text-sm font-bold text-vibrant-dark  outline-none placeholder-vibrant-dark/65  focus:ring-4 focus:ring-[#4ECDC4]/40"
            />
          </div>

          {/* Sort By Controls */}
          <div className="flex items-center justify-between sm:justify-start gap-3 self-stretch sm:self-end lg:self-auto pt-1 sm:pt-0 border-t sm:border-t-0 border-vibrant-dark/10 ">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-vibrant-dark  shrink-0" />
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-vibrant-dark ">Sırala:</span>
            </div>
            <div className="flex bg-vibrant-bg  border-2 border-vibrant-dark  rounded-xl p-1 shrink-0">
              <button
                onClick={() => setSortBy('popular')}
                className={`px-3 py-1.5 text-[10px] sm:text-xs font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  sortBy === 'popular' ? 'bg-vibrant-dark  text-white ' : 'text-vibrant-dark  hover:text-vibrant-coral'
                }`}
              >
                Popüler
              </button>
              <button
                onClick={() => setSortBy('newest')}
                className={`px-3 py-1.5 text-[10px] sm:text-xs font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  sortBy === 'newest' ? 'bg-vibrant-dark  text-white ' : 'text-vibrant-dark  hover:text-vibrant-coral'
                }`}
              >
                En Yeni
              </button>
            </div>
          </div>
        </div>

        {/* Categories Horizontal Selector */}
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-vibrant-dark  block">Kategori Filtrele:</span>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-black uppercase tracking-wider rounded-xl border-2 border-vibrant-dark  transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-vibrant-yellow  text-vibrant-dark  shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] -translate-y-0.5'
                    : 'bg-white  text-vibrant-dark  hover:bg-vibrant-bg '
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 auto-rows-max md:auto-rows-[400px] grid-flow-dense">
        
        {/* Special AI Assistant Card */}
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          onClick={onOpenAiChat}
          className="col-span-1 md:col-span-2 row-span-1 bg-gradient-to-r from-[#FFF8E7] via-[#FFF3D6] to-[#FFE8B5]    border-4 border-vibrant-dark  rounded-[2.5rem] p-5 md:p-6 shadow-[8px_8px_0px_0px_rgba(45,52,54,1)] flex items-center gap-5 sm:gap-6 cursor-pointer group relative overflow-hidden h-[180px] md:h-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-200/30 to-vibrant-yellow/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="w-24 h-24 md:w-32 md:h-32 border-4 border-vibrant-dark rounded-[1.8rem] overflow-hidden flex items-center justify-center shrink-0 relative z-10 shadow-[4px_4px_0px_0px_rgba(45,52,54,1)] group-hover:rotate-3 transition-transform bg-slate-900">
            <AiAvatar size="full" disableHoverEffect={true} className="w-full h-full" />
          </div>

          <div className="space-y-1 md:space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-2.5 md:px-3 py-1 bg-vibrant-coral text-white text-[8px] md:text-[10px] font-black uppercase rounded-full border-2 border-vibrant-dark  shadow-[2px_2px_0px_0px_rgba(45,52,54,1)]">
              <Bot className="w-3 md:w-3.5 h-3 md:h-3.5" /> Site Rehberi Asistanı
            </div>
            <h3 className="text-lg md:text-2xl font-black text-vibrant-dark  uppercase tracking-tight group-hover:text-vibrant-coral transition-colors leading-tight">
              Setupss AI ile <br /> Sohbet Et
            </h3>
            <p className="text-[9px] md:text-xs font-bold text-slate-700  max-w-xs leading-snug hidden sm:block">
              "Neden sıralamada değilim?" veya "Bunu nasıl yaparım?" diye sor, siteyi senin için didik didik etsin!
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-[8px] md:text-[9px] font-black text-emerald-800  bg-emerald-100  px-2 py-0.5 rounded-md border border-emerald-300  uppercase tracking-wider">7/24 Canlı Asistan</span>
            </div>
          </div>

          <div className="absolute bottom-7 sm:bottom-8 right-5 sm:right-6 bg-vibrant-yellow  group-hover:bg-vibrant-coral text-vibrant-dark  group-hover:text-white border-2 border-vibrant-dark  p-2.5 sm:p-3 rounded-2xl shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] group-hover:scale-110 transition-all z-10">
            <Sparkles className="w-5 h-5 md:w-6 md:h-6 fill-current" />
          </div>
        </motion.div>

        {filteredSetups.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <div className="w-16 h-16 bg-white border-4 border-vibrant-dark rounded-full flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0px_0px_rgba(45,52,54,1)]">
              <Search className="w-8 h-8 text-vibrant-coral" />
            </div>
            <h3 className="text-xl font-black text-vibrant-dark uppercase">Aramanızla eşleşen setup bulunamadı</h3>
            <p className="text-xs font-bold text-slate-500 mt-2">Farklı bir anahtar kelime veya kategori deneyin.</p>
          </div>
        ) : (
          filteredSetups.slice(0, visibleCount).map((setup, index) => {
            const isVid = isVideo(setup.image);
            // Bento logic for desktop
            const isWide = isVid || (index > 0 && (index + 1) % 4 === 0);
            const isTall = !isVid && (index + 2) % 6 === 0;
            const theme = getThemeStyles(setup.cardTheme);
            const isTrending = maxLikes > 0 && setup.likes === maxLikes && setup.likes > 5;

            return (
              <motion.div
                key={setup.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                transition={{ 
                  duration: 0.4, 
                  delay: (index % 12) * 0.05,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className={`${theme.bg} border-4 rounded-[2.5rem] md:rounded-[2rem] overflow-hidden flex flex-col shadow-[6px_6px_0px_0px_rgba(45,52,54,1)] hover:shadow-[10px_10px_0px_0px_rgba(45,52,54,1)] transition-all duration-300 group/card ${
                  isWide ? 'md:col-span-2' : ''
                } ${isTall ? 'md:row-span-2' : ''} ${setup.ownerHasRgb ? 'rgb-modal-border' : 'border-vibrant-dark'}`}
              >
                <div className="flex flex-col h-full justify-between">
                  {/* Media Section */}
                  <div 
                    className={`relative overflow-hidden border-b-4 border-vibrant-dark cursor-pointer group shrink-0 ${
                      isTall ? 'h-[220px] md:h-full md:flex-1' : 'h-[185px] md:h-[195px]'
                    }`}
                    onClick={() => onSelectSetup(setup)}
                  >
                    {isVid ? (
                      <video
                        ref={(el) => {
                          if (el) {
                            el.muted = true;
                            el.defaultMuted = true;
                            el.play().catch(() => {});
                          }
                        }}
                        src={setup.image}
                        muted autoPlay loop playsInline
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <img
                        src={getThumbnailUrl(setup.image, 512)}
                        alt={setup.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement; target.onerror = null;
                          target.src = 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                    )}
                    
                    {isVid && (
                      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md border border-white/20 px-2 py-1 rounded-lg text-[8px] font-black text-white uppercase flex items-center gap-1.5 z-20">
                        <VideoIcon className="w-3 h-3 text-vibrant-coral" />
                        VİDEO
                      </div>
                    )}

                    {setup.videoUrl && (
                      <div className="absolute bottom-3 left-3 bg-[#FF4757] border-2 border-vibrant-dark px-2 py-1 rounded-lg text-[8px] font-black text-white uppercase flex items-center gap-1 z-20 shadow-[2px_2px_0px_0px_rgba(45,52,54,1)]">
                        <Play className="w-2.5 h-2.5 fill-current" />
                        VİDEO TURU
                      </div>
                    )}

                    {setup.isBotShare && (
                      <div className="absolute bottom-12 left-3 bg-[#FFD93D] border-2 border-vibrant-dark px-2 py-0.5 rounded-lg text-[8px] font-black text-vibrant-dark uppercase flex items-center gap-1 z-20 shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] animate-bounce">
                        <Bot className="w-2.5 h-2.5" />
                        AI BOT
                      </div>
                    )}

                    {isTrending && (
                      <div className="absolute top-3 left-3 z-30">
                        <div className="bg-vibrant-coral text-white px-3 py-1 rounded-lg border-2 border-vibrant-dark text-[10px] font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(45,52,54,1)] flex items-center gap-1.5 animate-pulse">
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          TRENDING
                        </div>
                      </div>
                    )}

                    <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30">
                      <span className={`text-[8px] md:text-[9px] px-3 py-1 font-black uppercase tracking-widest rounded-b-xl border-x-2 border-b-2 border-vibrant-dark shadow-[4px_4px_0px_0px_rgba(45,52,54,1)] ${getCategoryColor(setup.category)}`}>
                        {setup.category}
                      </span>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="p-3 sm:p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                    {/* Header Row: Author Info on Left + Action Buttons (Like / Comment) on Right */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className={`w-8 h-8 ${theme.componentBg} border-2 border-vibrant-dark rounded-lg flex items-center justify-center font-black ${theme.text} text-[10px] uppercase shrink-0 overflow-hidden shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] group-hover/card:rotate-3 transition-transform`}>
                          {setup.ownerAvatar ? (
                            <img src={setup.ownerAvatar} alt={setup.owner} className="w-full h-full object-cover" />
                          ) : (
                            (setup.owner || "U").substring(0, 2)
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <h5 className={`font-black text-xs sm:text-[10px] truncate ${setup.ownerHasRgb ? 'rgb-text' : theme.text}`}>{setup.owner}</h5>
                          <p className={`text-[9px] sm:text-[8px] ${theme.sub} font-bold truncate tracking-tight`}>{setup.bio || "Setup Tutkunu"}</p>
                        </div>
                      </div>

                      {/* Prominent Action Buttons right in header! */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={(e) => { e.stopPropagation(); onLikeSetup(setup.id); }}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border-2 border-vibrant-dark font-black uppercase text-[10px] tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] cursor-pointer ${
                            setup.likedByUser 
                              ? 'bg-vibrant-coral text-white' 
                              : 'bg-white text-vibrant-dark hover:bg-vibrant-bg'
                          }`}
                          title="Beğen"
                        >
                          <Heart className={`w-3.5 h-3.5 ${setup.likedByUser ? 'fill-white' : ''}`} />
                          <span>{setup.likes}</span>
                        </button>

                        <button
                          onClick={(e) => { e.stopPropagation(); onSelectSetup(setup); }}
                          className={`flex items-center gap-1 px-2.5 py-1 ${theme.componentBg} hover:opacity-80 ${theme.text} border-2 border-vibrant-dark rounded-xl font-black uppercase text-[10px] tracking-wider shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] cursor-pointer`}
                          title="İncele / Yorum Yap"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{setup.comments?.length || 0}</span>
                        </button>

                        {onDeleteSetup && (user?.id === setup.ownerId || ['setupss.support@gmail.com'].includes(user?.email)) && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onDeleteSetup(setup.id); }}
                            className="w-7 h-7 bg-red-100 hover:bg-red-200 text-red-600 border-2 border-vibrant-dark rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] transition-all cursor-pointer"
                            title="Sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Title and Description */}
                    <div className="space-y-0.5 cursor-pointer" onClick={() => onSelectSetup(setup)}>
                      <h4 className={`font-black ${theme.text} text-sm sm:text-base uppercase tracking-tighter leading-tight line-clamp-1 group-hover/card:text-vibrant-coral transition-colors`}>
                        {setup.title}
                      </h4>
                      <p className={`text-[10px] sm:text-[9px] ${theme.sub} font-bold leading-relaxed line-clamp-2`}>
                        {setup.description}
                      </p>
                    </div>

                    {/* Components tags */}
                    <div className="pt-0.5 flex flex-wrap gap-1">
                      {(setup.components || []).slice(0, 2).map((comp) => (
                        <span 
                          key={comp.id}
                          className={`${theme.componentBg} border border-vibrant-dark/10 ${theme.componentText} text-[8px] sm:text-[7px] font-black uppercase px-1.5 py-0.5 rounded-md`}
                        >
                          {comp.name.substring(0, 12)}{comp.name.length > 12 ? '..' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {visibleCount < filteredSetups.length && (
        <div ref={loadMoreRef} className="col-span-full py-8 flex justify-center">
          <div className="w-10 h-10 border-4 border-vibrant-dark border-t-vibrant-yellow rounded-full animate-spin shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] bg-white" />
        </div>
      )}

      {/* Share CTA Floating Card */}
      <div className="bg-[#FFEAA7] border-4 border-vibrant-dark rounded-[2.5rem] p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(45,52,54,1)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-xl md:text-2xl font-black text-vibrant-dark uppercase tracking-tight flex items-center justify-center md:justify-start gap-2">
            <Sparkles className="w-6 h-6 text-vibrant-coral" />
            Senin Workspace'in Nasıl?
          </h3>
          <p className="text-xs font-semibold text-vibrant-dark max-w-xl">
            Tasarımcı mısın, çılgın bir esporcu mu yoksa kablolardan arınmış minimalist bir yazılımcı mı? 
            Kendi masa kurulumunu, kullandığın klavye, mouse ve diğer aksesuarları ekleyerek topluluğumuzla paylaş!
          </p>
        </div>
        <button
          onClick={onOpenAddModal}
          className="bg-vibrant-coral hover:bg-[#ff5252] text-white border-4 border-vibrant-dark rounded-2xl px-6 py-3 font-black uppercase text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(45,52,54,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all cursor-pointer whitespace-nowrap"
        >
          Masanı Paylaşmaya Başla 🚀
        </button>
      </div>
    </div>
  );
});
