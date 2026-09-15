import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Zap, Sparkles, CheckCircle2 } from 'lucide-react';

interface GlobalLoadingScreenProps {
  isLoading: boolean;
  message?: string;
}

export const GlobalLoadingScreen: React.FC<GlobalLoadingScreenProps> = ({ isLoading, message }) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [progress, setProgress] = useState(15);

  const TIPS = [
    'Donanım Bilgi Grafiği ve fiyat akışları taranıyor...',
    'Setupss AI Copilot rehber motoru hazırlanıyor...',
    'Topluluk masaüstü kurulumları ve puanlar eşitleniyor...',
    'Neo-Brutalist yüksek performans bileşenleri yükleniyor...',
    'Tüm cihazlar için duyarlı arayüz optimizasyonu aktif!'
  ];

  useEffect(() => {
    if (!isLoading) return;

    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 1800);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return 92;
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 250);

    return () => {
      clearInterval(tipInterval);
      clearInterval(progressInterval);
    };
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#FFF8E1] text-[#2D3436] p-4 select-none overflow-hidden"
        >
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#2D3436_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Central Card */}
          <motion.div
            initial={{ scale: 0.9, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            className="relative z-10 w-full max-w-md bg-white border-4 border-[#2D3436] rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(45,52,54,1)] text-center flex flex-col items-center"
          >
            {/* Logo Badge Container with Pulsing Effect */}
            <div className="relative mb-6">
              <motion.div
                animate={{
                  scale: [1, 1.08, 1],
                  rotate: [0, 1, -1, 0]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-[#FFD93D] via-[#FFEAA7] to-[#81ECEC] border-3 border-[#2D3436] p-2 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(45,52,54,1)] overflow-hidden"
              >
                <img
                  src="/logoarkaplanolmayan.png?v=2026_new"
                  alt="SETUPSS Logo"
                  className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
                  onError={(e) => {
                    // Fallback to text logo if image fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </motion.div>

              {/* Orbiting Sparkle */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-2 -right-2 bg-[#FF6B6B] border-2 border-[#2D3436] p-1.5 rounded-full shadow-[2px_2px_0px_0px_rgba(45,52,54,1)]"
              >
                <Sparkles className="w-4 h-4 text-white" />
              </motion.div>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-black text-[#2D3436] tracking-tight mb-1 flex items-center justify-center gap-2">
              SETUPSS <span className="text-xs bg-[#FFD93D] px-2 py-0.5 rounded-md border border-[#2D3436] font-bold">2026</span>
            </h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
              Masaüstü & Hardware Atölyesi
            </p>

            {/* Custom Neo-Brutalist Progress Bar */}
            <div className="w-full mb-4">
              <div className="flex justify-between items-center text-xs font-black text-[#2D3436] mb-1.5 px-1">
                <span className="flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-[#FF6B6B] animate-spin" />
                  Sistem Yükleniyor
                </span>
                <span>{progress}%</span>
              </div>

              <div className="w-full h-4 bg-slate-100 rounded-xl border-2 border-[#2D3436] p-0.5 shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#FFD93D] via-[#4ECDC4] to-[#FF6B6B] rounded-lg border-r-2 border-[#2D3436]"
                  initial={{ width: '10%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Dynamic Loading Tip */}
            <div className="w-full bg-[#FFEAA7]/40 border-2 border-[#2D3436] rounded-2xl p-3 min-h-[50px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentTipIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs font-bold text-[#2D3436] leading-relaxed flex items-center justify-center gap-2"
                >
                  <Zap className="w-3.5 h-3.5 text-[#FF6B6B] shrink-0" />
                  {message || TIPS[currentTipIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Status Checklist Badges */}
            <div className="flex flex-wrap justify-center gap-2 mt-5 text-[10px] font-black text-slate-600">
              <span className="flex items-center gap-1 bg-emerald-100 border border-[#2D3436] px-2 py-0.5 rounded-md">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Mobil Uyum
              </span>
              <span className="flex items-center gap-1 bg-sky-100 border border-[#2D3436] px-2 py-0.5 rounded-md">
                <CheckCircle2 className="w-3 h-3 text-sky-600" /> AI Copilot
              </span>
              <span className="flex items-center gap-1 bg-amber-100 border border-[#2D3436] px-2 py-0.5 rounded-md">
                <CheckCircle2 className="w-3 h-3 text-amber-600" /> Açık Tema
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
