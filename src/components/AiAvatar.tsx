import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { safeJsonResponse } from '../lib/api';
import { Bot, Sparkles, Zap } from 'lucide-react';

interface AiAvatarProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  onClick?: () => void;
  disableHoverEffect?: boolean;
}

export const AiAvatar: React.FC<AiAvatarProps> = ({
  className = '',
  size = 'md',
  onClick,
  disableHoverEffect = false
}) => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [hasVideoError, setHasVideoError] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(r => safeJsonResponse(r))
      .then(data => {
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      })
      .catch(() => {});
  }, []);

  const videoUrl = settings.ai_avatar_video_url || '';
  const imageUrl = settings.ai_avatar_image_url || '';
  const avatarSizeScale = settings.ai_avatar_size_scale || ''; // e.g. "90"
  const glowColor = settings.ai_avatar_glow_color || 'amber'; // amber, emerald, sky, rose, violet, none
  const borderStyle = settings.ai_avatar_border_style || 'dashed'; // solid, dashed, double, none
  const interactiveEffect = settings.ai_avatar_interactive_effect || 'float'; // float, bounce, spin, pulse, wobble, none

  // Get sizing class or custom style
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24 md:w-28 md:h-28',
    xl: 'w-32 h-32 md:w-36 md:h-36',
    '2xl': 'w-44 h-44 md:w-52 md:h-52',
    full: 'w-full h-full'
  };

  const defaultSizeClass = sizeMap[size] || sizeMap['md'];
  
  // Parse dynamic pixel size if specified (only if size is not 'full')
  const customStyle: React.CSSProperties = {};
  if (size !== 'full' && avatarSizeScale && parseInt(avatarSizeScale) > 0) {
    customStyle.width = `${avatarSizeScale}px`;
    customStyle.height = `${avatarSizeScale}px`;
  }

  // Border & Glow settings
  const glowColors: Record<string, string> = {
    amber: 'shadow-[0_0_15px_rgba(245,158,11,0.5)] border-amber-500 ',
    emerald: 'shadow-[0_0_15px_rgba(16,185,129,0.5)] border-emerald-500 ',
    sky: 'shadow-[0_0_15px_rgba(14,165,233,0.5)] border-sky-500 ',
    rose: 'shadow-[0_0_15px_rgba(244,63,94,0.5)] border-rose-500 ',
    violet: 'shadow-[0_0_15px_rgba(139,92,246,0.5)] border-violet-500 ',
    none: 'border-slate-300 '
  };

  const borderStyles: Record<string, string> = {
    solid: 'border-2',
    dashed: 'border-2 border-dashed',
    double: 'border-4 border-double',
    none: 'border-0'
  };

  const roundedClass = size === 'full' ? 'rounded-none' :
                       settings.ai_avatar_rounded === 'full' ? 'rounded-full' : 
                       settings.ai_avatar_rounded === 'none' ? 'rounded-none' : 
                       size === 'sm' ? 'rounded-xl' : 'rounded-3xl';

  const glowStyle = size === 'full' ? 'shadow-none' : (glowColors[glowColor] || glowColors['amber']);
  const bStyle = size === 'full' ? 'border-0' : (borderStyles[borderStyle] || borderStyles['dashed']);

  // Animation variants
  const getAnimationProps = () => {
    if (interactiveEffect === 'none') return {};
    
    switch (interactiveEffect) {
      case 'float':
        return {
          animate: { y: [0, -8, 0] },
          transition: { repeat: Infinity, duration: 3, ease: "easeInOut" } as any
        };
      case 'bounce':
        return {
          animate: { y: [0, -12, 0] },
          transition: { repeat: Infinity, duration: 1.5, ease: "easeOut" } as any
        };
      case 'pulse':
        return {
          animate: { scale: [1, 1.05, 1] },
          transition: { repeat: Infinity, duration: 2, ease: "easeInOut" } as any
        };
      case 'spin':
        return {
          animate: { rotate: 360 },
          transition: { repeat: Infinity, duration: 20, ease: "linear" } as any
        };
      case 'wobble':
        return {
          animate: { rotate: [0, -5, 5, -5, 5, 0], scale: [1, 1.02, 0.98, 1.02, 0.98, 1] },
          transition: { repeat: Infinity, duration: 4, ease: "easeInOut" } as any
        };
      default:
        return {};
    }
  };

  const animationProps = getAnimationProps();

  const handleMediaClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    }
  };

  // Render SVG Placeholder if no media is uploaded yet
  const renderPlaceholder = () => {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-white relative p-4 group rounded-[inherit]">
        <div className="absolute inset-0 bg-radial-gradient from-amber-500/10 to-transparent pointer-events-none rounded-[inherit]" />
        <motion.div 
          animate={{ scale: [1, 1.12, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" } as any}
          className="relative z-10"
        >
          <Bot className="w-10 h-10 text-amber-400 group-hover:text-amber-300 transition-colors" />
        </motion.div>
        
        {/* Sleek animated network nodes/waves inside the avatar */}
        <div className="absolute inset-x-2 bottom-3 flex items-center justify-center gap-0.5 h-6 z-10">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ height: [4, 20, 4] }}
              transition={{
                repeat: Infinity,
                duration: 1 + (i * 0.15),
                ease: "easeInOut"
              } as any}
              className="w-1 bg-gradient-to-t from-amber-500 to-yellow-300 rounded-full"
            />
          ))}
        </div>
        <div className="absolute top-2 right-2">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
        </div>
      </div>
    );
  };

  // Force GPU rendering and hardware mask to avoid subpixel rounding leak
  const finalStyle: React.CSSProperties = {
    ...customStyle,
    transform: 'translateZ(0)',
    WebkitMaskImage: '-webkit-radial-gradient(white, black)'
  };

  return (
    <motion.div
      id="setupss-ai-avatar"
      {...animationProps}
      whileHover={disableHoverEffect ? undefined : { scale: 1.06, rotate: interactiveEffect === 'wobble' ? 0 : 2 }}
      whileTap={disableHoverEffect ? undefined : { scale: 0.95 }}
      onClick={handleMediaClick}
      style={finalStyle}
      className={`relative cursor-pointer overflow-hidden ${defaultSizeClass} ${roundedClass} ${glowStyle} ${bStyle} bg-slate-900 border-vibrant-dark shrink-0 flex items-center justify-center select-none ${className}`}
    >
      {/* 1. If Video is present and working */}
      {videoUrl && !hasVideoError ? (
        <video
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setHasVideoError(true)}
          className="w-full h-full object-cover rounded-[inherit] scale-[1.01]"
        />
      ) : /* 2. If Image is present and working */
      imageUrl && !hasImageError ? (
        <img
          src={imageUrl}
          alt="AI Assistant Avatar"
          onError={() => setHasImageError(true)}
          className="w-full h-full object-cover rounded-[inherit] scale-[1.01]"
        />
      ) : (
        /* 3. Fallback Placeholder if both are empty */
        renderPlaceholder()
      )}
    </motion.div>
  );
};
