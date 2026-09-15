import React, { useState, useEffect } from 'react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  priority?: boolean;
  aspectRatio?: 'video' | 'square' | 'auto' | 'desk' | string;
}

export const SafeImage: React.FC<SafeImageProps> = ({ 
  src, 
  fallbackSrc = '/setupss_icon.svg?v=2026_v9', 
  priority = false,
  loading,
  decoding = 'async',
  aspectRatio = 'auto',
  className = '',
  ...props 
}) => {
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(undefined);
  const [hasFailed, setHasFailed] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!src) {
      setCurrentSrc(fallbackSrc);
      return;
    }

    // High performance optimization: route unsplash or regular images through optimization where possible
    let optimizedSrc = src;
    if (src.includes('unsplash.com') && !src.includes('format=')) {
      optimizedSrc = `${src}${src.includes('?') ? '&' : '?'}auto=format&fit=crop&q=80`;
    }
    
    setCurrentSrc(optimizedSrc);
    setHasFailed(false);
    setIsLoaded(false);
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (!hasFailed) {
      setHasFailed(true);
      setCurrentSrc(fallbackSrc);
    }
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  // Prevent CLS by mapping standard aspect ratio configurations
  let ratioClass = '';
  if (aspectRatio === 'video') ratioClass = 'aspect-video';
  else if (aspectRatio === 'square') ratioClass = 'aspect-square';
  else if (aspectRatio === 'desk') ratioClass = 'aspect-[4/3]';

  const computedLoading = loading || (priority ? 'eager' : 'lazy');
  const computedAlt = props.alt || 'Setupss Masaüstü Kurulum ve Ekipman Fotoğrafı';

  return (
    <div className={`relative overflow-hidden ${ratioClass} ${className}`}>
      {/* Background blur-up placeholder while loading */}
      {!isLoaded && !hasFailed && (
        <div className="absolute inset-0 bg-slate-100  animate-pulse z-10" />
      )}
      <img 
        loading={computedLoading}
        decoding={decoding}
        {...(priority ? { fetchpriority: 'high' } as any : {})}
        alt={computedAlt}
        itemProp="image"
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props} 
        src={currentSrc} 
        onLoad={handleLoad}
        onError={handleError} 
      />
    </div>
  );
};
