import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Trophy, ListTodo, ShieldCheck, Smartphone, Flame, ArrowRight, Globe, Cpu, BookOpen } from 'lucide-react';
import { ROUTES } from '../utils/routes';
import { navigateTo } from '../utils/navigation';

interface MenuItem {
  id: 'explore' | 'wishlist' | 'leaderboard' | 'global-chat' | 'hardware-graph' | 'chatss' | 'blog';
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  path: string;
}

interface ExpandableMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'explore' | 'wishlist' | 'leaderboard' | 'global-chat' | 'hardware-graph' | 'chatss' | 'blog';
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'explore',
    title: 'Keşfet Atölyesi',
    subtitle: 'Küratörlü oda düzenleri',
    icon: Compass,
    path: ROUTES.EXPLORE
  },
  {
    id: 'blog',
    title: 'Donanım & Blog Rehberi',
    subtitle: 'İncelemeler, ergonomi & rehberler',
    icon: BookOpen,
    path: '/blog'
  },
  {
    id: 'hardware-graph',
    title: 'Hardware Knowledge Graph',
    subtitle: 'RTX 5090, CPU & Ansiklopedi',
    icon: Cpu,
    path: '/hardware-graph'
  },
  {
    id: 'chatss',
    title: 'Setupss Chatss',
    subtitle: '2K Video & Sesli Odalar',
    icon: Globe,
    path: '/chatss'
  },
  {
    id: 'leaderboard',
    title: 'Liderlik Tablosu',
    subtitle: 'Seviye ve şampiyonlar',
    icon: Trophy,
    path: ROUTES.LEADERBOARD
  },
  {
    id: 'wishlist',
    title: 'Bütçe Planlayıcı',
    subtitle: 'Akıllı fiyat simülasyonu',
    icon: ListTodo,
    path: ROUTES.AI_PLANNER
  },
  {
    id: 'global-chat',
    title: 'Dünya Sohbeti',
    subtitle: 'Toplulukla gerçek zamanlı mesajlaş',
    icon: Globe,
    path: '/global-chat'
  }
];

export const ExpandableMenu: React.FC<ExpandableMenuProps> = ({ isOpen, onClose, activeTab }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }} // Spring-like natural fast transition
          className="absolute right-3 sm:right-8 top-[4.5rem] w-full max-w-[340px] bg-white  border-4 border-vibrant-dark  rounded-2xl p-3 z-50 shadow-[6px_6px_0px_0px_rgba(45,52,54,1)]  flex flex-col gap-2"
        >
          {/* Unfolding Menu Items with Stagger Animation */}
          {MENU_ITEMS.map((item, idx) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <motion.a
                href={item.path}
                key={item.id}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: idx * 0.04, // 40ms stagger delay
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 24 
                }}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo(item.path);
                  onClose();
                }}
                className={`h-12 w-full flex items-center justify-between px-3 rounded-xl border-2 transition-all duration-150 group cursor-pointer text-left no-underline ${
                  isActive
                    ? 'bg-vibrant-yellow text-vibrant-dark border-vibrant-dark shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] font-black'
                    : 'bg-white  text-slate-800  border-vibrant-dark  hover:bg-slate-50  hover:border-vibrant-dark  hover:translate-y-[-2px] hover:shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] '
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={`p-1 rounded-lg shrink-0 ${isActive ? 'bg-white/50 text-vibrant-dark' : 'text-slate-400 group-hover:text-vibrant-coral transition-colors'}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0 leading-tight">
                    <span className="text-xs font-bold truncate flex items-center gap-1">
                      {item.title}
                      {isActive && (
                        <span className="inline-block w-1.5 h-1.5 bg-vibrant-coral rounded-full" />
                      )}
                    </span>
                    <span className={`text-[9px] truncate ${isActive ? 'text-vibrant-dark/60 font-medium' : 'text-slate-400 font-medium'}`}>
                      {item.subtitle}
                    </span>
                  </div>
                </div>
                <ArrowRight className={`w-3.5 h-3.5 transition-transform duration-150 shrink-0 ${isActive ? 'text-vibrant-dark translate-x-0.5' : 'text-slate-300  group-hover:text-vibrant-coral group-hover:translate-x-1'}`} />
              </motion.a>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
