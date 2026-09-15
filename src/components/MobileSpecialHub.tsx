import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SafeImage } from './SafeImage';
import { 
  Smartphone, 
  Sparkles, 
  Cpu, 
  Rotate3d, 
  Camera, 
  Flame, 
  Sliders, 
  Check, 
  X, 
  Heart, 
  Info, 
  Zap, 
  Eye, 
  Gauge, 
  Sun, 
  RefreshCw,
  Award,
  Undo,
  Bookmark,
  Star
} from 'lucide-react';
import { SetupPost } from '../types';
import { getSharedBrainContext, updateSharedBrainContext } from '../utils/aiBrain';

interface MobileSpecialHubProps {
  setups: SetupPost[];
  user: any;
  onLikeSetup: (id: string) => void;
  onSelectSetup: (setup: SetupPost) => void;
}

export const MobileSpecialHub: React.FC<MobileSpecialHubProps> = ({ 
  setups = [], 
  user, 
  onLikeSetup, 
  onSelectSetup 
}) => {
  // Mobile check
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [forceMobileView, setForceMobileView] = useState(true); // Allow desktop users to play
  
  // Tinder Swipe Mode state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [swipedSetups, setSwipedSetups] = useState<{ [key: string]: 'like' | 'skip' }>({});
  const [swipeHistory, setSwipeHistory] = useState<number[]>([]);
  const [savedLaterSetups, setSavedLaterSetups] = useState<Record<string, boolean>>({});
  
  // Gyroscope simulation state
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [gyroActive, setGyroActive] = useState(false);

  // Performance budget state
  const [fps, setFps] = useState(60);
  const [isPerfOptimized, setIsPerfOptimized] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

  // Dynamic Ambient Lighting Sync state
  const [ambientIntensity, setAmbientIntensity] = useState<number>(85);
  const [syncThemeColor, setSyncThemeColor] = useState<string>('rgba(255, 107, 107, 0.4)');

  // EXIF camera extractor simulator state
  const [analyzingSetup, setAnalyzingSetup] = useState<SetupPost | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{
    camera: string;
    lens: string;
    iso: string;
    exposure: string;
    lightingType: string;
    setupStyle: string;
    efficiencyRating: string;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Detect mobile user agent
  useEffect(() => {
    const checkMobile = () => {
      const isMobile = /Mobi|Android|iPhone|iPad|Macintosh/i.test(navigator.userAgent) && window.innerWidth < 1024;
      setIsMobileDevice(isMobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Simulate battery api
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      });
    } else {
      setBatteryLevel(87); // Mock battery level
    }

    // Dynamic FPS fluctuating simulation (for premium engine look)
    const fpsInterval = setInterval(() => {
      setFps(prev => {
        const target = isPerfOptimized ? 60 : 58;
        const change = (Math.random() - 0.5) * 3;
        const next = Math.max(45, Math.min(60, Math.round(target + change)));
        return next;
      });
    }, 2000);

    return () => {
      window.removeEventListener('resize', checkMobile);
      clearInterval(fpsInterval);
    };
  }, [isPerfOptimized]);

  // Handle device orientation
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta !== null && e.gamma !== null) {
        setGyroActive(true);
        // Map tilt values to small angles
        setTilt({
          x: Math.max(-15, Math.min(15, e.gamma / 2)),
          y: Math.max(-15, Math.min(15, (e.beta - 45) / 2))
        });
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  // Simulate mouse movement tilt for desktop users
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!gyroActive) {
      const card = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - card.left - card.width / 2;
      const y = e.clientY - card.top - card.height / 2;
      setTilt({
        x: (x / card.width) * 12,
        y: (y / card.height) * 12
      });
    }
  };

  const handleMouseLeave = () => {
    if (!gyroActive) {
      setTilt({ x: 0, y: 0 });
    }
  };

  const activeSetup = setups[currentIndex] || null;

  // Dynamic compatibility match logic using SAIOS Collective Brain
  const getMatchData = (setup: SetupPost) => {
    const brain = getSharedBrainContext();
    const style = setup.title.toLowerCase() + ' ' + (setup.description || '').toLowerCase() + ' ' + (setup.category || '').toLowerCase();
    
    let score = 75; // Base minimum score
    let reason = "Bu kurulum sizin üretkenlik ve ergonomi standartlarınıza mükemmel seviyede uyum sağlıyor.";
    
    if (brain.tasteProfile) {
      const primary = brain.tasteProfile.primaryCategory;
      if (primary.includes('Minimalist') && (style.includes('minimal') || style.includes('sade') || style.includes('clean') || style.includes('ahşap'))) {
        score = 96;
        reason = "Minimalist tasarım tercihlerinize %96 uyumlu; dikkati dağıtmayan, son derece temiz ve kablosuz bir çalışma alanı.";
      } else if (primary.includes('RGB') && (style.includes('rgb') || style.includes('oyuncu') || style.includes('gamer') || style.includes('led'))) {
        score = 98;
        reason = "Esporcu zevkiniz ve dinamik RGB aydınlatma tercihlerinize %98 uyumlu, yüksek akıcılığa sahip bir battlestation.";
      } else if (primary.includes('Yazılımcı') && (style.includes('yazılım') || style.includes('kod') || style.includes('ofis') || style.includes('monitör') || style.includes('developer'))) {
        score = 95;
        reason = "Çoklu monitör düzeni ve mühendislik yerleşimlerinize %95 uyumlu; tam bir profesyonel üretkenlik istasyonu.";
      } else if (primary.includes('Cozy') && (style.includes('cozy') || style.includes('ahşap') || style.includes('warm') || style.includes('retro'))) {
        score = 94;
        reason = "Sıcak ahşap tonları, retro detaylar ve loş oda aydınlatması tercihlerinizle %94 oranında çakışan huzurlu düzen.";
      } else {
        score = 82;
        reason = "Genel ekipman uyumu ve şık masaüstü felsefesiyle SAIOS standartlarında dengeli bir yerleşim.";
      }
    } else {
      // General heuristic fallbacks before preference learning is triggered
      if (style.includes('rgb') || style.includes('gamer') || style.includes('oyuncu')) {
        score = 88;
        reason = "Dinamik LED aydınlatmaları ve oyuncu hatları ile enerjik bir oyun ve yayın alanı.";
      } else if (style.includes('minimal') || style.includes('clean') || style.includes('sade')) {
        score = 90;
        reason = "Kablosuz felsefesi ve temiz yerleşimiyle odaklanmayı kolaylaştıran minimal bir oda düzeni.";
      }
    }
    
    return { score, reason };
  };

  // Swipe handlers with Undo memory & AI Context learning
  const handleSwipe = (direction: 'left' | 'right' | 'super') => {
    if (!activeSetup) return;

    setSwipeDirection(direction === 'left' ? 'left' : 'right');
    
    // Save current index in swipe history to allow Undo action
    setSwipeHistory(prev => [...prev, currentIndex]);

    setTimeout(() => {
      setSwipedSetups(prev => ({
        ...prev,
        [activeSetup.id]: direction === 'left' ? 'skip' : 'like'
      }));

      // Persist the swipe in SAIOS collective brain to infer user taste preferences
      const context = getSharedBrainContext();
      const newSwipe = {
        setupId: activeSetup.id,
        title: activeSetup.title,
        liked: direction !== 'left',
        timestamp: Date.now()
      };
      const updatedSwipes = [newSwipe, ...(context.savedSwipes || [])].slice(0, 50);
      updateSharedBrainContext({ savedSwipes: updatedSwipes });

      if (direction === 'right') {
        onLikeSetup(activeSetup.id);
      } else if (direction === 'super') {
        onLikeSetup(activeSetup.id);
        // Dispatch double click impact on database likes
        setTimeout(() => {
          onLikeSetup(activeSetup.id);
        }, 100);
      }

      setSwipeDirection(null);
      setCurrentIndex(prev => (prev + 1) % setups.length);
      // Reset card visual analysis states
      setAnalysisResult(null);
    }, 300);
  };

  const handleUndo = () => {
    if (swipeHistory.length === 0) return;
    const previousIndex = swipeHistory[swipeHistory.length - 1];
    setSwipeHistory(prev => prev.slice(0, prev.length - 1));
    setCurrentIndex(previousIndex);
    setAnalysisResult(null);
  };

  const handleSaveLater = () => {
    if (!activeSetup) return;
    const isSaved = !!savedLaterSetups[activeSetup.id];
    setSavedLaterSetups(prev => ({
      ...prev,
      [activeSetup.id]: !isSaved
    }));
    
    // Bookmark the viewed item directly into planner wishlist context
    const context = getSharedBrainContext();
    const updatedViews = [activeSetup.id, ...(context.recentViews || [])].slice(0, 10);
    updateSharedBrainContext({ recentViews: updatedViews });
    
    alert(`"${activeSetup.title}" karşılaştırma paneline eklendi ve AI belleğine kaydedildi!`);
  };

  // EXIF / AI Visual Analyzer Algorithm
  const runCameraAnalyzer = (setup: SetupPost) => {
    setIsAnalyzing(true);
    setAnalyzingSetup(setup);
    
    // Asymmetric camera detection array
    const cameras = ["Sony α7 IV", "Fujifilm X-T5", "iPhone 15 Pro Max", "Canon EOS R6 Mark II", "Fujifilm X100V", "Sony RX100 VII"];
    const lenses = ["Sigma 24-70mm f/2.8 DG DN", "Fujinon XF 35mm f/1.4 R", "Anamorphic 24mm f/1.8 Cine", "Sony FE 50mm f/1.2 GM", "Apple UltraWide Lens 13mm"];
    const isos = ["ISO 100", "ISO 250", "ISO 400", "ISO 800", "ISO 1250"];
    const exposures = ["1/125s f/2.8", "1/60s f/1.4", "1/200s f/4.0", "1/50s f/1.8", "1/80s f/2.0"];
    const lightings = ["Doğal Gün Işığı + Sıcak LED Panel", "RGB Neon Backlight (Dinamik)", "Minimalist Monokrom Softbox", "Retro Amber Filament Ampul"];
    const styles = ["Sade Monokrom (İskandinav)", "Hacker/Developer Savaş İstasyonu", "Cozy Retro Ahşap Akustik", "Neon Cyberpunk RGB Stüdyosu"];
    
    // Hash based on setup ID to keep analysis deterministic but realistic
    const hash = setup.id.charCodeAt(setup.id.length - 1) || 0;
    
    setTimeout(() => {
      setAnalysisResult({
        camera: cameras[hash % cameras.length],
        lens: lenses[(hash + 1) % lenses.length],
        iso: isos[(hash + 2) % isos.length],
        exposure: exposures[(hash + 3) % exposures.length],
        lightingType: lightings[(hash + 4) % lightings.length],
        setupStyle: styles[(hash + 5) % styles.length],
        efficiencyRating: `${Math.round(85 + (hash % 15))}%`
      });
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Mobile Detection Header banner */}
      <div className="bg-gradient-to-r from-[#FF5252] via-[#E040FB] to-[#7C4DFF] text-white border-4 border-vibrant-dark  rounded-[2.5rem] p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(45,52,54,1)] relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-vibrant-yellow text-vibrant-dark font-black uppercase text-[8px] sm:text-[10px] tracking-[0.2em] px-4 py-1.5 rounded-bl-2xl border-l-2 border-b-2 border-vibrant-dark">
          MOBILE ENGINE v2.0
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-vibrant-dark font-black text-[10px] uppercase rounded-full border-2 border-vibrant-dark shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Smartphone className="w-3.5 h-3.5 text-vibrant-coral" />
              <span>{isMobileDevice ? 'MOBİL SENSÖRLER AKTİF' : 'MOBİL SİMÜLASYON MODU'}</span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white font-elegant-sans leading-none">
              Masaüstü Keşfi Şimdi <br />
              <span className="text-vibrant-yellow font-serif italic normal-case">Parmaklarının Ucunda</span>
            </h2>
            
            <p className="text-xs sm:text-sm text-zinc-100 font-medium max-w-2xl leading-relaxed">
              Mobil kullanıcılarımıza özel geliştirilen bu algoritmik merkezde, Tinder tarzı hızlı masa beğenme kaydırmaları yapabilir, jiroskop verileriyle RGB ışıklarını telefonunun eğimine göre değiştirebilir, ve yüklenen masaların kamera özelliklerini (EXIF) analiz edebilirsin!
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3 justify-center lg:items-end">
            {/* View toggle */}
            <div className="bg-slate-900/40 p-1.5 rounded-2xl border border-white/20 inline-flex items-center gap-1 self-start lg:self-end">
              <button 
                onClick={() => setForceMobileView(true)}
                className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wide transition-all ${forceMobileView ? 'bg-vibrant-yellow text-vibrant-dark' : 'text-white'}`}
              >
                Simülatör Açık
              </button>
              <button 
                onClick={() => setForceMobileView(false)}
                className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wide transition-all ${!forceMobileView ? 'bg-vibrant-yellow text-vibrant-dark' : 'text-white'}`}
              >
                Gerçek Cihaz
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Algorithm Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Tinder style swipe deck */}
        <div className="lg:col-span-6 bg-vibrant-bg  border-4 border-vibrant-dark  rounded-[2.5rem] p-6 shadow-[6px_6px_0px_0px_rgba(45,52,54,1)]  flex flex-col justify-between min-h-[500px]">
          <div>
            <div className="flex items-center justify-between border-b-2 border-slate-200/50  pb-3 mb-5 text-left">
              <div>
                <span className="text-[9px] text-vibrant-coral font-black uppercase tracking-widest block">Akıllı Kart Keşfi</span>
                <h3 className="text-sm font-black uppercase text-vibrant-dark  tracking-wider flex items-center gap-1">
                  <Flame className="w-4 h-4 text-vibrant-coral" /> Swiper Swipe & Match
                </h3>
              </div>
              <span className="text-[10px] bg-white  border-2 border-vibrant-dark  rounded-full px-3 py-1 font-black text-vibrant-dark ">
                {currentIndex + 1} / {setups.length}
              </span>
            </div>

            {/* Tinder deck stage */}
            <div className="relative h-[340px] w-full flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="popLayout">
                {activeSetup ? (
                  <motion.div
                    key={activeSetup.id}
                    className="absolute w-full max-w-[280px] sm:max-w-[320px] bg-white  border-3 border-vibrant-dark  rounded-[2rem] overflow-hidden shadow-[4px_4px_0px_0px_rgba(45,52,54,1)]  cursor-pointer"
                    initial={{ scale: 0.9, opacity: 0, y: 15 }}
                    animate={{ 
                      scale: 1, 
                      opacity: 1, 
                      y: 0,
                      rotate: swipeDirection === 'left' ? -12 : swipeDirection === 'right' ? 12 : tilt.x / 1.5,
                      x: swipeDirection === 'left' ? -350 : swipeDirection === 'right' ? 350 : tilt.y / 1.5,
                    }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => onSelectSetup(activeSetup)}
                    style={{
                      transformPerspective: 1000,
                    }}
                  >
                    {/* Setup card interior */}
                    <div className="relative h-44 w-full border-b-2 border-vibrant-dark">
                      <SafeImage 
                        src={activeSetup.image} 
                        alt={activeSetup.title} 
                        className="w-full h-full object-cover" 
                      />
                      {activeSetup.ownerHasRgb && (
                        <div className="absolute inset-0 border-4 border-transparent bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 rounded-t-[1.8rem] opacity-70 pointer-events-none mix-blend-screen animate-pulse" />
                      )}

                      {/* Floating status tag */}
                      <div className="absolute top-3 left-3 bg-vibrant-dark text-white text-[8px] font-black uppercase px-2 py-1 rounded-lg border border-vibrant-yellow">
                        @{activeSetup.owner}
                      </div>

                      <div className="absolute top-3 right-3 bg-vibrant-yellow text-vibrant-dark text-[8px] font-black uppercase px-2 py-1 rounded-lg border border-vibrant-dark shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        {activeSetup.category}
                      </div>
                    </div>

                    <div className="p-4 text-left space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-xs sm:text-sm text-vibrant-dark  uppercase font-elegant-sans truncate max-w-[80%]">
                          {activeSetup.title}
                        </h4>
                        <span className="text-[10px] font-black text-vibrant-coral">❤️ {activeSetup.likes}</span>
                      </div>
                      
                      <p className="text-[10px] font-medium text-slate-500  line-clamp-2 leading-relaxed">
                        {activeSetup.description || 'Bu masa sahibi henüz detaylı bir bütçe veya ekipman inceleme detayı girmemiş.'}
                      </p>

                      {/* SAIOS Collective Brain Match Score Integration */}
                      {(() => {
                        const { score, reason } = getMatchData(activeSetup);
                        return (
                          <div className="p-2.5 bg-amber-400/5  border-2 border-dashed border-vibrant-dark/20  rounded-xl space-y-1 text-[9px]">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 font-bold uppercase text-[7px]">SAIOS Uyum Katsayısı:</span>
                              <span className="text-vibrant-coral  font-black">%{score} MATCH</span>
                            </div>
                            <p className="text-slate-500  font-semibold leading-normal">
                              {reason}
                            </p>
                          </div>
                        );
                      })()}

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 ">
                        <span className="text-[9px] font-bold text-slate-400">{activeSetup.components?.length ? `${activeSetup.components.length} Bileşen` : 'Bileşen Yok'}</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            runCameraAnalyzer(activeSetup);
                          }}
                          className="px-2 py-1 bg-slate-100  border border-vibrant-dark/20 hover:bg-vibrant-yellow transition-all rounded-lg text-[8px] font-black uppercase"
                        >
                          📷 AI Mercek
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center p-6 bg-white  rounded-3xl border-2 border-dashed border-vibrant-dark max-w-[280px]">
                    <Zap className="w-8 h-8 text-vibrant-yellow mx-auto mb-2 animate-bounce" />
                    <p className="text-xs font-black text-vibrant-dark  uppercase">Tüm Masalar Keşfedildi!</p>
                    <button 
                      onClick={() => {
                        setCurrentIndex(0);
                        setSwipeHistory([]);
                      }}
                      className="mt-3 px-4 py-1.5 bg-vibrant-coral text-white font-black uppercase text-[10px] rounded-xl border-2 border-vibrant-dark shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                    >
                      Yeniden Başlat
                    </button>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Swipe Buttons Row */}
          {activeSetup && (
            <div className="flex justify-center items-center gap-3 pt-3 flex-wrap">
              {/* Undo Button */}
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={swipeHistory.length === 0}
                onClick={handleUndo}
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 border-vibrant-dark shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] cursor-pointer active:shadow-none shrink-0 ${
                  swipeHistory.length > 0 
                    ? 'bg-amber-300 text-vibrant-dark hover:bg-amber-400' 
                    : 'bg-gray-100 text-gray-400 border-gray-300 shadow-none cursor-not-allowed opacity-40'
                }`}
                title="Geri Al (Undo)"
              >
                <Undo className="w-4 h-4 stroke-[3]" />
              </motion.button>

              {/* Skip (Left) Button */}
              <motion.button 
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSwipe('left')}
                className="w-12 h-12 bg-white  border-3 border-vibrant-dark rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 hover:text-red-600 transition-all shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] active:shadow-none cursor-pointer shrink-0"
                title="Pas Geç (Skip)"
              >
                <X className="w-5 h-5 stroke-[3.5]" />
              </motion.button>

              {/* Super Like Button */}
              <motion.button 
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSwipe('super')}
                className="w-11 h-11 bg-blue-400 text-white border-2 border-vibrant-dark rounded-full flex items-center justify-center hover:bg-blue-500 transition-all shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] active:shadow-none cursor-pointer shrink-0"
                title="Süper Beğeni"
              >
                <Star className="w-4 h-4 fill-white stroke-[2.5]" />
              </motion.button>

              {/* Save For Later Button */}
              <motion.button 
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSaveLater}
                className={`w-11 h-11 border-2 border-vibrant-dark rounded-full flex items-center justify-center transition-all shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] active:shadow-none cursor-pointer shrink-0 ${
                  savedLaterSetups[activeSetup.id] 
                    ? 'bg-vibrant-teal text-white' 
                    : 'bg-white  text-gray-500 hover:bg-gray-50'
                }`}
                title="Sonra Karşılaştır (Save Later)"
              >
                <Bookmark className={`w-4 h-4 ${savedLaterSetups[activeSetup.id] ? 'fill-white' : ''} stroke-[2.5]`} />
              </motion.button>

              {/* Like (Right) Button */}
              <motion.button 
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSwipe('right')}
                className="w-12 h-12 bg-white  border-3 border-vibrant-dark rounded-full flex items-center justify-center text-teal-500 hover:bg-teal-50 hover:text-teal-600 transition-all shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] active:shadow-none cursor-pointer shrink-0"
                title="Beğen (Like)"
              >
                <Heart className="w-5 h-5 fill-teal-500 stroke-[3]" />
              </motion.button>
            </div>
          )}
        </div>

        {/* Right: Sensors & AI Photo Analysis Column */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          
          {/* AI EXIF Photo Analyzer Card */}
          <div className="bg-white  border-4 border-vibrant-dark  rounded-[2.5rem] p-5 shadow-[6px_6px_0px_0px_rgba(45,52,54,1)]  text-left relative flex-1 flex flex-col justify-between">
            <div className="absolute top-4 right-4 bg-purple-100  text-purple-900  font-black text-[8px] uppercase tracking-wider px-2 py-0.5 rounded border border-purple-400">
              ALGORİTMİK ÇÖZÜMLEME
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Camera className="w-5 h-5 text-[#FF5252]" />
                <h3 className="text-sm font-black uppercase text-vibrant-dark  tracking-wider">AI Görsel Ekipman Dedektörü</h3>
              </div>

              {!analyzingSetup ? (
                <div className="p-8 text-center bg-slate-50  rounded-2xl border-2 border-dashed border-slate-200  flex flex-col justify-center items-center h-[200px]">
                  <Camera className="w-8 h-8 text-slate-300 mb-2" />
                  <p className="text-xs font-black text-slate-400 uppercase">Herhangi bir masanın EXIF ve Kamera donanımını analiz etmek için sol taraftaki kartlarda bulunan "AI Mercek" butonuna basın.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-3 items-center p-3 bg-slate-50  rounded-xl border border-vibrant-dark/10">
                    <SafeImage src={analyzingSetup.image} className="w-12 h-12 rounded-lg object-cover border border-vibrant-dark shrink-0" />
                    <div>
                      <span className="text-[8px] text-vibrant-coral font-black uppercase">İncelenen Masa</span>
                      <h4 className="text-xs font-black text-vibrant-dark  uppercase truncate">{analyzingSetup.title}</h4>
                    </div>
                  </div>

                  {isAnalyzing ? (
                    <div className="py-12 text-center space-y-3">
                      <RefreshCw className="w-8 h-8 text-purple-500 animate-spin mx-auto" />
                      <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Görsel Parçalanıyor & EXIF Çekirdeği Okunuyor...</p>
                    </div>
                  ) : (
                    analysisResult && (
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-600 ">
                        <div className="p-2 bg-slate-50  rounded-lg border border-slate-100 ">
                          <span className="text-slate-400 block text-[8px] font-black uppercase">Kamera Gövdesi</span>
                          <span className="text-vibrant-dark  font-bold">{analysisResult.camera}</span>
                        </div>
                        <div className="p-2 bg-slate-50  rounded-lg border border-slate-100 ">
                          <span className="text-slate-400 block text-[8px] font-black uppercase">Lens / Odak</span>
                          <span className="text-vibrant-dark  font-bold">{analysisResult.lens}</span>
                        </div>
                        <div className="p-2 bg-slate-50  rounded-lg border border-slate-100 ">
                          <span className="text-slate-400 block text-[8px] font-black uppercase">Pozlama & ISO</span>
                          <span className="text-vibrant-dark  font-bold">{analysisResult.exposure} ({analysisResult.iso})</span>
                        </div>
                        <div className="p-2 bg-slate-50  rounded-lg border border-slate-100 ">
                          <span className="text-slate-400 block text-[8px] font-black uppercase">Işık Türü</span>
                          <span className="text-vibrant-dark  font-bold">{analysisResult.lightingType}</span>
                        </div>
                        <div className="p-2 bg-slate-50  rounded-lg border border-slate-100  col-span-2">
                          <span className="text-slate-400 block text-[8px] font-black uppercase">Aesthetic / Kurulum Tarzı</span>
                          <span className="text-[#FF5252] font-black">{analysisResult.setupStyle}</span>
                        </div>
                        <div className="p-2.5 bg-amber-50  rounded-lg border border-amber-300 col-span-2 flex items-center justify-between">
                          <div>
                            <span className="text-amber-800  block text-[8px] font-black uppercase">Küratör Verimlilik Puanı</span>
                            <span className="text-xs font-black text-amber-900 ">Bu masa ergonomi standartlarına tam uyuyor.</span>
                          </div>
                          <span className="text-lg font-black text-amber-600 font-serif">{analysisResult.efficiencyRating}</span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            <div className="bg-slate-50  p-2.5 rounded-xl border border-dashed border-vibrant-dark/20 text-center mt-3 text-[9px] font-bold text-slate-500">
              ⚡ Bu özellik yüklenen fotoğrafların parlaklık, RGB dağılımı ve EXIF kamera imzasını tarayan neural-mesh algoritmamızı simüle eder.
            </div>
          </div>

          {/* Performance Budget & Sensors Panel */}
          <div className="bg-white  border-4 border-vibrant-dark  rounded-[2.5rem] p-5 shadow-[6px_6px_0px_0px_rgba(45,52,54,1)]  text-left">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100  pb-2">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-vibrant-coral" />
                <h3 className="text-sm font-black uppercase text-vibrant-dark  tracking-wider">Mobil Donanım & Sensör Bütçesi</h3>
              </div>
              <span className="text-[10px] text-slate-400 font-black">60Hz TARGET</span>
            </div>

            <div className="space-y-4">
              {/* Gyro Sensor feedback */}
              <div className="flex items-center justify-between bg-slate-50  p-3 rounded-xl border border-vibrant-dark/10">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 font-black uppercase">3D Jiroskop & Eğim Açıları</span>
                  <p className="text-[10px] font-black text-vibrant-dark ">
                    X: <span className="text-vibrant-coral">{tilt.x.toFixed(1)}°</span> • Y: <span className="text-vibrant-coral">{tilt.y.toFixed(1)}°</span>
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-white  border border-vibrant-dark flex items-center justify-center relative overflow-hidden">
                  <motion.div 
                    className="w-3 h-3 rounded-full bg-vibrant-coral" 
                    animate={{ x: tilt.x * 1.5, y: tilt.y * 1.5 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  />
                  <div className="absolute inset-0 border border-slate-100 pointer-events-none" />
                </div>
              </div>

              {/* Dynamic light sync */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-400">
                  <span>Ortam Işığı Duyarlılığı (Lux)</span>
                  <span className="text-vibrant-dark ">{ambientIntensity} LUX</span>
                </div>
                <div className="flex items-center gap-3">
                  <Sun className="w-4 h-4 text-vibrant-yellow shrink-0" />
                  <input 
                    type="range" 
                    min="10" 
                    max="150" 
                    value={ambientIntensity} 
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setAmbientIntensity(val);
                      if (val < 50) {
                        setSyncThemeColor('rgba(124, 77, 255, 0.5)'); // Deep purple for low light
                      } else if (val < 100) {
                        setSyncThemeColor('rgba(255, 107, 107, 0.5)'); // Vibrant coral for normal light
                      } else {
                        setSyncThemeColor('rgba(255, 213, 79, 0.6)'); // Sunny amber for high light
                      }
                    }}
                    className="flex-1 accent-vibrant-coral h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Performance parameters */}
              <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs font-black">
                <div className="p-2.5 bg-slate-50  rounded-xl border-2 border-vibrant-dark/10">
                  <span className="text-slate-400 block text-[8px] uppercase tracking-wider mb-0.5">CPU Hızı (FPS)</span>
                  <span className={`${fps > 55 ? 'text-teal-500' : 'text-amber-500'}`}>{fps} FPS</span>
                </div>
                <div className="p-2.5 bg-slate-50  rounded-xl border-2 border-vibrant-dark/10">
                  <span className="text-slate-400 block text-[8px] uppercase tracking-wider mb-0.5">Pil Seviyesi</span>
                  <span className="text-vibrant-dark ">{batteryLevel}%</span>
                </div>
                <div className="p-2.5 bg-slate-50  rounded-xl border-2 border-vibrant-dark/10">
                  <span className="text-slate-400 block text-[8px] uppercase tracking-wider mb-0.5">Optimizasyon</span>
                  <button 
                    onClick={() => setIsPerfOptimized(prev => !prev)}
                    className={`text-[8px] uppercase px-1.5 py-0.5 rounded ${isPerfOptimized ? 'bg-teal-100 text-teal-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {isPerfOptimized ? 'ULTRA' : 'STİLİK'}
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
