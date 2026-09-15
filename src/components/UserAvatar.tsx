import React from 'react';
import { SafeImage } from './SafeImage';
import { Crown, Sparkles, Flame, Zap, Heart, Star, CloudLightning, ShieldAlert, Cpu } from 'lucide-react';

interface UserAvatarProps {
  src?: string;
  name?: string;
  frame?: string;
  isCrown?: boolean;
  hasRgb?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  name = 'User',
  frame = 'none',
  isCrown = false,
  hasRgb = false,
  size = 'md',
  className = ''
}) => {
  const getInitials = (n: string) => {
    if (!n) return 'ME';
    const parts = n.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  // Size classes matching neobrutalist Setupss UI sizes
  const sizeMap = {
    xs: { container: 'w-8 h-8 rounded-xl', font: 'text-[9px]', border: 'border', frameOffset: 'p-[1px]', badgeSize: 'w-3 h-3', iconSize: 'w-2 h-2' },
    sm: { container: 'w-10 h-10 rounded-xl', font: 'text-xs', border: 'border-2', frameOffset: 'p-[2px]', badgeSize: 'w-4 h-4', iconSize: 'w-2.5 h-2.5' },
    md: { container: 'w-14 h-14 rounded-2xl', font: 'text-base', border: 'border-2', frameOffset: 'p-[2.5px]', badgeSize: 'w-5.5 h-5.5', iconSize: 'w-3.5 h-3.5' },
    lg: { container: 'w-20 h-20 rounded-3xl', font: 'text-2xl', border: 'border-3', frameOffset: 'p-[3.5px]', badgeSize: 'w-7 h-7', iconSize: 'w-4.5 h-4.5' },
    xl: { container: 'w-24 h-24 rounded-[1.8rem]', font: 'text-3xl', border: 'border-4', frameOffset: 'p-[4px]', badgeSize: 'w-8 h-8', iconSize: 'w-5 h-5' },
    '2xl': { container: 'w-32 h-32 rounded-[2.2rem]', font: 'text-4xl', border: 'border-4', frameOffset: 'p-[5px]', badgeSize: 'w-10 h-10', iconSize: 'w-6.5 h-6.5' }
  };

  const activeSize = sizeMap[size] || sizeMap.md;
  const currentFrame = frame ? frame.toLowerCase() : 'none';

  // Base setup
  let frameBorderClass = 'border-2 border-vibrant-dark bg-white';
  let frameBackgroundClass = 'bg-slate-100';
  let frameEffectEl: React.ReactNode = null;
  let frameBadgeEl: React.ReactNode = null;
  let overlayDecorationsEl: React.ReactNode = null;

  if (currentFrame === 'cyberpunk') {
    frameBorderClass = 'border-2 border-fuchsia-500 bg-slate-950 ring-2 ring-cyan-400 shadow-[0_0_15px_rgba(240,0,255,0.7)] animate-[avatar-pulse-glow_2s_infinite]';
    frameBackgroundClass = 'bg-slate-950';
    frameEffectEl = (
      <>
        {/* Futuristic Grid & Tech Scanlines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.08)_1px,transparent_1px)] bg-[size:8px_8px] pointer-events-none rounded-inherit" />
        <div className="absolute left-0 right-0 h-0.5 bg-cyan-400 opacity-60 animate-[avatar-scanline_2.5s_linear_infinite] pointer-events-none" />
        <span className="absolute -inset-1 border border-cyan-400 rounded-inherit opacity-40 animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />
      </>
    );
    frameBadgeEl = (
      <div className={`absolute -bottom-1 -right-1 bg-cyan-400 text-slate-950 text-[7px] sm:text-[8px] font-black uppercase px-1 rounded border border-slate-950 scale-90 shadow-md flex items-center gap-0.5 z-10 animate-pulse`}>
        <Cpu className="w-2 h-2 animate-spin" style={{ animationDuration: '4s' }} />
        <span>CYBER</span>
      </div>
    );
  } 
  
  else if (currentFrame === 'royal') {
    frameBorderClass = 'border-2 border-amber-400 bg-slate-950 ring-2 ring-amber-300 ring-offset-1 ring-offset-slate-950 shadow-[0_0_15px_rgba(251,191,36,0.6)]';
    frameBackgroundClass = 'bg-gradient-to-tr from-amber-950 to-amber-900';
    frameEffectEl = (
      <>
        {/* Rotating Magic Gold Light Aura */}
        <div className="absolute -inset-1.5 bg-[conic-gradient(from_0deg,transparent_20%,#fbbf24_50%,transparent_80%)] opacity-70 animate-[avatar-spin-slow_6s_linear_infinite] rounded-inherit pointer-events-none" />
        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full rotate-45 animate-[avatar-shimmer_3.5s_infinite] pointer-events-none" />
      </>
    );
    frameBadgeEl = (
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] animate-bounce-subtle z-10" title="Soylu Çerçeve">
        <Crown className="w-5 h-5 fill-amber-300 text-amber-500 stroke-[2]" />
      </div>
    );
  } 
  
  else if (currentFrame === 'rgb') {
    frameBorderClass = 'border-2 border-transparent bg-slate-950 shadow-[0_0_20px_rgba(168,85,247,0.7)] animate-[avatar-hue-rotate_4s_linear_infinite]';
    frameBackgroundClass = 'bg-slate-950';
    frameEffectEl = (
      <>
        {/* Rainbow glowing ring */}
        <div className="absolute -inset-[3px] bg-gradient-to-tr from-rose-500 via-emerald-500 to-indigo-500 rounded-inherit animate-[avatar-spin-slow_3s_linear_infinite] -z-10" />
        <div className="absolute -inset-[3px] bg-gradient-to-tr from-rose-500 via-emerald-500 to-indigo-500 rounded-inherit blur-[6px] opacity-75 animate-[avatar-spin-slow_3s_linear_infinite] -z-10" />
        {/* Inside laser dust */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-purple-500/15 animate-pulse" />
      </>
    );
    frameBadgeEl = (
      <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 text-white text-[7px] font-black uppercase px-1 py-0.5 rounded border border-vibrant-dark scale-90 shadow-md flex items-center gap-0.5 z-10">
        <Sparkles className="w-1.5 h-1.5 animate-spin" />
        <span>NITRO</span>
      </div>
    );
  } 
  
  else if (currentFrame === 'pixel') {
    frameBorderClass = 'border-3 border-rose-500 bg-slate-950 shadow-[4px_4px_0px_rgba(0,0,0,0.4)] ring-2 ring-rose-400';
    frameBackgroundClass = 'bg-rose-950/20';
    frameEffectEl = (
      <div className="absolute inset-0 overflow-hidden rounded-inherit pointer-events-none">
        {/* Floating 8-Bit Hearts */}
        <span className="absolute text-[8px] animate-[avatar-sakura-float_3.5s_infinite] left-1 bottom-1 text-rose-500">❤️</span>
        <span className="absolute text-[6px] animate-[avatar-sakura-float_4.5s_infinite] right-2 bottom-2 text-pink-400" style={{ animationDelay: '1.5s' }}>❤️</span>
      </div>
    );
    frameBadgeEl = (
      <div className="absolute -bottom-1.5 -right-1.5 bg-rose-600 text-white p-1 rounded-lg border-2 border-vibrant-dark scale-90 z-10 shadow-md animate-bounce-subtle">
        <Heart className="w-3.5 h-3.5 fill-rose-300 text-rose-100" />
      </div>
    );
  } 
  
  else if (currentFrame === 'flame') {
    frameBorderClass = 'border-2 border-orange-500 bg-slate-950 shadow-[0_0_18px_rgba(249,115,22,0.8)] ring-2 ring-red-500';
    frameBackgroundClass = 'bg-slate-950';
    frameEffectEl = (
      <div className="absolute inset-0 overflow-hidden rounded-inherit pointer-events-none">
        {/* Rising Fire Sparks/Embers */}
        <div className="absolute -bottom-1 left-2 w-1.5 h-1.5 bg-amber-400 rounded-full blur-[0.5px] opacity-75 animate-[avatar-sakura-float_3s_infinite]" style={{ transform: 'translateY(0)', animationName: 'avatar-flame-flicker' }} />
        <div className="absolute -bottom-2 right-3 w-1 h-1 bg-red-500 rounded-full blur-[0.5px] opacity-75 animate-[avatar-sakura-float_4s_infinite]" style={{ transform: 'translateY(0)', animationDelay: '1s', animationName: 'avatar-flame-flicker' }} />
        <div className="absolute -bottom-1 left-1/2 w-1.5 h-1.5 bg-orange-500 rounded-full blur-[0.5px] opacity-75 animate-[avatar-sakura-float_3.5s_infinite]" style={{ transform: 'translateY(0)', animationDelay: '2s', animationName: 'avatar-flame-flicker' }} />
      </div>
    );
    frameBadgeEl = (
      <div className="absolute -bottom-1.5 -right-1.5 bg-orange-500 text-white p-1 rounded-full border-2 border-vibrant-dark scale-90 z-10 shadow-md">
        <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-200 animate-pulse" />
      </div>
    );
  }

  else if (currentFrame === 'sakura') {
    frameBorderClass = 'border-2 border-pink-400 bg-slate-950 shadow-[0_0_15px_rgba(244,143,177,0.7)] ring-2 ring-pink-200';
    frameBackgroundClass = 'bg-pink-950/20';
    frameEffectEl = (
      <div className="absolute inset-0 overflow-hidden rounded-inherit pointer-events-none">
        {/* Soft Pink Falling Petals */}
        <span className="absolute text-[8px] animate-[avatar-sakura-float_5s_linear_infinite] left-1 top-0">🌸</span>
        <span className="absolute text-[6px] animate-[avatar-sakura-float_6s_linear_infinite] right-2 top-1" style={{ animationDelay: '2s' }}>🌸</span>
        <span className="absolute text-[7px] animate-[avatar-sakura-float_4s_linear_infinite] left-1/2 top-0" style={{ animationDelay: '3.5s' }}>🌸</span>
      </div>
    );
    frameBadgeEl = (
      <div className="absolute -top-2 -right-2 bg-pink-100 text-pink-600 p-1 rounded-full border border-pink-400 scale-95 z-10 shadow-sm animate-pulse">
        <span className="text-[9px] font-black leading-none block">🌸</span>
      </div>
    );
  }

  else if (currentFrame === 'cosmic') {
    frameBorderClass = 'border-2 border-indigo-400 bg-slate-950 ring-2 ring-purple-400 shadow-[0_0_18px_rgba(139,92,246,0.8)]';
    frameBackgroundClass = 'bg-slate-950';
    frameEffectEl = (
      <>
        {/* Rotating Nebula Dust background */}
        <div className="absolute -inset-1 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.35)_0%,transparent_70%)] rounded-inherit pointer-events-none" />
        {/* Twinkling Cosmic Stars */}
        <div className="absolute top-1 left-2 w-1 h-1 bg-white rounded-full animate-[avatar-sparkle-twinkle_1.5s_infinite]" />
        <div className="absolute bottom-2 right-1.5 w-1 h-1 bg-yellow-100 rounded-full animate-[avatar-sparkle-twinkle_2.5s_infinite]" style={{ animationDelay: '0.8s' }} />
        <div className="absolute top-1/2 right-1 w-1 h-1 bg-cyan-200 rounded-full animate-[avatar-sparkle-twinkle_2s_infinite]" style={{ animationDelay: '1.4s' }} />
      </>
    );
    frameBadgeEl = (
      <div className="absolute -bottom-1.5 -right-1.5 bg-indigo-600 text-white p-1 rounded-full border-2 border-vibrant-dark scale-90 z-10 shadow-md">
        <Star className="w-3.5 h-3.5 fill-yellow-200 text-yellow-300 animate-[avatar-sparkle-twinkle_3s_infinite]" />
      </div>
    );
  }

  else if (currentFrame === 'lightning') {
    frameBorderClass = 'border-2 border-violet-500 bg-slate-950 ring-2 ring-cyan-300 shadow-[0_0_15px_rgba(124,58,237,0.8)]';
    frameBackgroundClass = 'bg-slate-950';
    frameEffectEl = (
      <>
        {/* Electric Charges Swirling */}
        <div className="absolute inset-0 border border-cyan-400/30 rounded-inherit pointer-events-none" />
        {/* Lightning strikes flashing overlay */}
        <div className="absolute inset-0 bg-violet-400/20 opacity-0 animate-[avatar-lightning-strike_5s_infinite] pointer-events-none rounded-inherit" />
      </>
    );
    frameBadgeEl = (
      <div className="absolute -bottom-1.5 -right-1.5 bg-violet-600 text-white p-1 rounded-lg border-2 border-vibrant-dark scale-90 z-10 shadow-md">
        <Zap className="w-3.5 h-3.5 fill-cyan-200 text-cyan-300 animate-[avatar-sparkle-twinkle_1s_infinite]" />
      </div>
    );
  }

  else if (currentFrame === 'diamond') {
    frameBorderClass = 'border-2 border-slate-200 bg-slate-950 ring-2 ring-cyan-200 shadow-[0_0_18px_rgba(186,230,253,0.7)]';
    frameBackgroundClass = 'bg-gradient-to-tr from-cyan-950 to-slate-900';
    frameEffectEl = (
      <>
        {/* Diamond Cut Shimmers */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-100/40 to-transparent -translate-x-full rotate-45 animate-[avatar-shimmer_2.8s_infinite] pointer-events-none" />
        {/* Sparkling reflections */}
        <div className="absolute top-1 right-2 text-cyan-200 animate-pulse scale-90"><Sparkles className="w-2 h-2 fill-current" /></div>
        <div className="absolute bottom-2 left-1 text-white animate-pulse" style={{ animationDelay: '1s' }}><Sparkles className="w-2.5 h-2.5 fill-current" /></div>
      </>
    );
    frameBadgeEl = (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] z-10" title="Elmas Zengin">
        <Crown className="w-5 h-5 fill-cyan-100 text-cyan-300 stroke-[2.5]" />
      </div>
    );
  }

  else if (currentFrame === 'minimal') {
    frameBorderClass = 'border-2 border-vibrant-dark bg-white shadow-[3px_3px_0px_0px_rgba(45,52,54,1)]';
    frameBackgroundClass = 'bg-[#FFF8E1]';
  } 
  
  else {
    // None / Fallback to isCrown or hasRgb Custom Badges
    if (isCrown) {
      frameBorderClass = 'border-2 border-amber-400 bg-white ring-2 ring-amber-300 ring-offset-1 shadow-md';
      frameBadgeEl = (
        <div className="absolute -top-1.5 -right-1.5 bg-amber-400 text-amber-950 rounded-full p-0.5 border border-vibrant-dark shadow-md z-10 animate-bounce-subtle" title="Kral Tacı">
          <Crown className="w-3.5 h-3.5 fill-current" />
        </div>
      );
    } else if (hasRgb) {
      frameBorderClass = 'border-2 border-[#4ECDC4] bg-white ring-2 ring-[#FF6B6B] ring-offset-1 shadow-md';
      frameEffectEl = (
        <span className="absolute -inset-0.5 rounded-inherit bg-gradient-to-tr from-[#FF6B6B] to-[#4ECDC4] opacity-20 animate-pulse pointer-events-none" />
      );
    }
  }

  return (
    <div className={`relative shrink-0 select-none ${activeSize.container} ${className}`}>
      
      {/* Dynamic CSS Keyframe Injector */}
      <style>{`
        @keyframes avatar-spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes avatar-hue-rotate {
          from { filter: hue-rotate(0deg); }
          to { filter: hue-rotate(360deg); }
        }
        @keyframes avatar-pulse-glow {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 4px rgba(240,0,255,0.5)); }
          50% { transform: scale(1.02); filter: drop-shadow(0 0 10px rgba(0,240,255,0.8)); }
        }
        @keyframes avatar-sakura-float {
          0% { transform: translate(0, -10px) rotate(0deg); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translate(20px, 40px) rotate(180deg); opacity: 0; }
        }
        @keyframes avatar-flame-flicker {
          0%, 100% { transform: scaleY(1) scaleX(1) translateY(0); opacity: 0.7; }
          50% { transform: scaleY(1.25) scaleX(0.9) translateY(-6px); opacity: 1; filter: drop-shadow(0 0 4px #f97316); }
        }
        @keyframes avatar-sparkle-twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes avatar-lightning-strike {
          0%, 92%, 94%, 96%, 100% { opacity: 0; }
          93%, 95%, 98% { opacity: 1; filter: drop-shadow(0 0 10px #a29bfe) brightness(1.3); }
        }
        @keyframes avatar-scanline {
          0% { top: -10%; }
          100% { top: 110%; }
        }
        @keyframes avatar-shimmer {
          0% { transform: translateX(-150%) rotate(45deg); }
          100% { transform: translateX(150%) rotate(45deg); }
        }
      `}</style>
      
      {/* Outer Glow & Background Container */}
      <div className={`w-full h-full rounded-inherit overflow-hidden flex items-center justify-center relative transition-all duration-300 ${frameBorderClass}`}>
        
        {/* Frame Glow and Spin Effects */}
        {frameEffectEl}

        {/* Real Avatar Image / Initials */}
        {src ? (
          <SafeImage
            src={src}
            alt={name}
            className="w-full h-full object-cover rounded-inherit pointer-events-none z-0"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className={`w-full h-full ${frameBackgroundClass} flex items-center justify-center font-black rounded-inherit text-vibrant-dark select-none z-0`}>
            <span className={`${activeSize.font} tracking-tight`}>{getInitials(name)}</span>
          </div>
        )}
      </div>

      {/* Frame Badge Decoration */}
      {frameBadgeEl}
    </div>
  );
};
