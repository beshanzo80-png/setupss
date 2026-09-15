import React from 'react';
import { motion } from 'motion/react';
import { Compass, Cpu, MessageSquare, Trophy, ListTodo } from 'lucide-react';

interface TabItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

interface MobileWaveNavBarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onToggleChat?: () => void;
  chatUnreadCount?: number;
}

export const MobileWaveNavBar: React.FC<MobileWaveNavBarProps> = ({
  activeTab,
  onTabChange,
  onToggleChat,
  chatUnreadCount = 0
}) => {
  const tabs: TabItem[] = [
    { id: 'explore', label: 'Keşfet', icon: Compass },
    { id: 'hardware-graph', label: 'Donanım', icon: Cpu },
    { id: 'chatss', label: 'Sohbet', icon: MessageSquare, badge: chatUnreadCount },
    { id: 'leaderboard', label: 'Sıralama', icon: Trophy },
    { id: 'wishlist', label: 'AI Bütçe', icon: ListTodo },
  ];

  // Match current active tab to navbar index
  const getActiveIndex = () => {
    if (activeTab === 'explore') return 0;
    if (activeTab === 'hardware' || activeTab === 'hardware-graph') return 1;
    if (activeTab === 'chat' || activeTab === 'chatss' || activeTab === 'global-chat') return 2;
    if (activeTab === 'leaderboard') return 3;
    if (activeTab === 'wishlist' || activeTab === 'ai-planner') return 4;
    return 0;
  };

  const activeIndex = getActiveIndex();

  return (
    <div className="fixed bottom-3 left-3 right-3 z-50 md:hidden pointer-events-auto select-none">
      <div className="relative bg-white text-vibrant-dark rounded-3xl border-3 border-vibrant-dark shadow-[4px_4px_0px_0px_rgba(45,52,54,1)] px-1.5 h-16 flex items-center justify-between">
        
        {/* Animated Active Backdrop Indicator Pill */}
        <motion.div
          className="absolute top-1.5 bottom-1.5 left-1.5 rounded-2xl bg-vibrant-yellow border-2 border-vibrant-dark shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] pointer-events-none"
          initial={false}
          style={{ width: 'calc((100% - 12px) / 5)' }}
          animate={{ x: `${activeIndex * 100}%` }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        />

        {/* Tab Buttons */}
        {tabs.map((tab, idx) => {
          const Icon = tab.icon;
          const isActive = idx === activeIndex;

          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'chatss' && onToggleChat) {
                  onToggleChat();
                }
                onTabChange(tab.id);
              }}
              className="relative z-10 flex-1 flex flex-col items-center justify-center h-full focus:outline-none transition-all active:scale-95 cursor-pointer"
            >
              <div className={`relative flex items-center justify-center transition-all duration-200 ${isActive ? 'text-vibrant-dark scale-110' : 'text-slate-500 hover:text-vibrant-dark'}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.8]' : 'stroke-[1.8]'}`} />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full border border-vibrant-dark animate-pulse">
                    {tab.badge}
                  </span>
                ) : null}
              </div>

              <span className={`text-[9px] mt-0.5 tracking-tight truncate max-w-[62px] transition-colors duration-200 ${
                isActive ? 'font-black text-vibrant-dark' : 'font-extrabold text-slate-600'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
