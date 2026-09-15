import React from 'react';

export type StoreName = 
  | 'akakce' 
  | 'cimri' 
  | 'trendyol' 
  | 'hepsiburada' 
  | 'n11' 
  | 'amazon' 
  | 'google' 
  | 'idefix' 
  | 'pttavm' 
  | 'teknosa' 
  | 'vatan';

interface StoreLogoProps {
  store: StoreName | string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

export const StoreLogo: React.FC<StoreLogoProps> = ({ 
  store, 
  className = '', 
  size = 'md',
  showName = true 
}) => {
  const storeStr = typeof store === 'string' 
    ? store 
    : (store && typeof store === 'object' && 'storeName' in store 
        ? String((store as any).storeName || '') 
        : String(store || ''));
  const normStore = storeStr.toLowerCase().trim();

  const sizeClasses = {
    sm: 'h-5 px-1.5 text-[10px]',
    md: 'h-7 px-2.5 text-xs',
    lg: 'h-9 px-3.5 text-sm'
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4.5 h-4.5',
    lg: 'w-6 h-6'
  };

  const borderShadowClasses = "border-2 border-slate-900  shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ";

  if (normStore.includes('akakçe') || normStore.includes('akakce')) {
    return (
      <div className={`inline-flex items-center gap-1.5 font-black rounded-lg ${borderShadowClasses} bg-red-600 text-white select-none ${sizeClasses[size]} ${className}`}>
        <svg className={iconSizes[size]} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {showName && <span>AKAKÇE</span>}
      </div>
    );
  }

  if (normStore.includes('cimri')) {
    return (
      <div className={`inline-flex items-center gap-1.5 font-black rounded-lg ${borderShadowClasses} bg-sky-500 text-white select-none ${sizeClasses[size]} ${className}`}>
        <svg className={iconSizes[size]} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        {showName && <span>CİMRİ</span>}
      </div>
    );
  }

  if (normStore.includes('trendyol')) {
    return (
      <div className={`inline-flex items-center gap-1.5 font-black rounded-lg ${borderShadowClasses} bg-orange-600 text-white select-none ${sizeClasses[size]} ${className}`}>
        <svg className={iconSizes[size]} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
        </svg>
        {showName && <span>TRENDYOL</span>}
      </div>
    );
  }

  if (normStore.includes('hepsiburada')) {
    return (
      <div className={`inline-flex items-center gap-1.5 font-black rounded-lg ${borderShadowClasses} bg-amber-500 text-slate-950 select-none ${sizeClasses[size]} ${className}`}>
        <span className="font-extrabold tracking-tighter text-amber-950">hb</span>
        {showName && <span>HEPSİBURADA</span>}
      </div>
    );
  }

  if (normStore.includes('n11')) {
    return (
      <div className={`inline-flex items-center gap-1.5 font-black rounded-lg ${borderShadowClasses} bg-rose-600 text-white select-none ${sizeClasses[size]} ${className}`}>
        <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-white"></div>
        {showName && <span>n11</span>}
      </div>
    );
  }

  if (normStore.includes('amazon')) {
    return (
      <div className={`inline-flex items-center gap-1.5 font-black rounded-lg ${borderShadowClasses} bg-slate-900  text-amber-400 select-none ${sizeClasses[size]} ${className}`}>
        <svg className={iconSizes[size]} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16c-3 3-9 4-13 1-1-1-3-3-3-3" stroke="currentColor" strokeLinecap="round"/>
          <path d="M18 14l3 2-2 3" stroke="currentColor" strokeLinecap="round"/>
        </svg>
        {showName && <span className="text-white">amazon.tr</span>}
      </div>
    );
  }

  if (normStore.includes('google')) {
    return (
      <div className={`inline-flex items-center gap-1.5 font-black rounded-lg ${borderShadowClasses} bg-white  text-slate-900 select-none ${sizeClasses[size]} ${className}`}>
        <svg className={iconSizes[size]} viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
        {showName && <span>Google Alışveriş</span>}
      </div>
    );
  }

  if (normStore.includes('idefix')) {
    return (
      <div className={`inline-flex items-center gap-1.5 font-black rounded-lg ${borderShadowClasses} bg-indigo-700 text-white select-none ${sizeClasses[size]} ${className}`}>
        <svg className={iconSizes[size]} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
        {showName && <span>IDEFIX</span>}
      </div>
    );
  }

  if (normStore.includes('teknosa')) {
    return (
      <div className={`inline-flex items-center gap-1.5 font-black rounded-lg ${borderShadowClasses} bg-amber-400 text-blue-950 select-none ${sizeClasses[size]} ${className}`}>
        <span className="font-black text-blue-900">⚡</span>
        {showName && <span>TEKNOSA</span>}
      </div>
    );
  }

  if (normStore.includes('vatan')) {
    return (
      <div className={`inline-flex items-center gap-1.5 font-black rounded-lg ${borderShadowClasses} bg-blue-700 text-white select-none ${sizeClasses[size]} ${className}`}>
        <span className="font-extrabold text-amber-300">V</span>
        {showName && <span>VATAN</span>}
      </div>
    );
  }

  if (normStore.includes('pttavm') || normStore.includes('ptt')) {
    return (
      <div className={`inline-flex items-center gap-1.5 font-black rounded-lg ${borderShadowClasses} bg-yellow-400 text-blue-900 select-none ${sizeClasses[size]} ${className}`}>
        <span>📬</span>
        {showName && <span>pttAVM</span>}
      </div>
    );
  }

  // Default Store Badge
  return (
    <div className={`inline-flex items-center gap-1.5 font-black rounded-lg ${borderShadowClasses} bg-emerald-500 text-white select-none ${sizeClasses[size]} ${className}`}>
      <span>🛍️</span>
      {showName && <span className="uppercase">{storeStr}</span>}
    </div>
  );
};
