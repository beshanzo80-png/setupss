import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { safeJsonResponse } from '../lib/api';
import { Zap } from 'lucide-react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  iconOnly = false,
  size = 'md'
}) => {
  const [logoSettings, setLogoSettings] = useState({
    lightLogo: '/logoarkaplanolmayan.png',
    darkLogo: '/logoarkaplanolmayan.png',
    iconLogo: '/branding/icon.png',
    logo_desktop_scale: '100',
    logo_mobile_scale: '100',
    logo_rotation: '0'
  });

  const [hasLightError, setHasLightError] = useState(false);
  const [hasDarkError, setHasDarkError] = useState(false);
  const [hasIconError, setHasIconError] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [instanceId] = useState(() => Math.random().toString(36).substring(2, 9));

  useEffect(() => {
    // Check initial state
    setIsDarkTheme(document.documentElement.classList.contains('dark'));

    // Observe changes to the document element class list for 100% accurate dark mode detection
    const observer = new MutationObserver(() => {
      setIsDarkTheme(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => safeJsonResponse(res))
      .then(data => {
        if (data.success && data.settings) {
          const s = data.settings;
          setLogoSettings({
            lightLogo: s.site_logo_url || '/logoarkaplanolmayan.png',
            darkLogo: s.site_logo_dark_url || '/logoarkaplanolmayan.png',
            iconLogo: s.site_icon_url || '/branding/icon.png',
            logo_desktop_scale: s.logo_desktop_scale || '100',
            logo_mobile_scale: s.logo_mobile_scale || '100',
            logo_rotation: s.logo_rotation || '0'
          });
        }
      })
      .catch(() => {});
  }, []);

  const heightClasses = {
    xs: 'h-5 text-sm',
    sm: 'h-7 text-base',
    md: 'h-9 sm:h-10 text-lg sm:text-xl',
    lg: 'h-12 sm:h-14 text-2xl sm:text-3xl',
    xl: 'h-14 sm:h-18 text-3xl sm:text-4xl',
    '2xl': 'h-24 sm:h-28 md:h-32 text-4xl sm:text-5xl',
    '3xl': 'h-32 sm:h-40 md:h-44 text-5xl sm:text-6xl',
    '4xl': 'h-40 sm:h-52 md:h-60 text-6xl sm:text-7xl'
  };

  const currentHeight = heightClasses[size] || heightClasses['md'];

  const dScale = parseFloat(logoSettings.logo_desktop_scale) / 100;
  const mScale = parseFloat(logoSettings.logo_mobile_scale) / 100;
  const rotDeg = parseFloat(logoSettings.logo_rotation) || 0;

  const wrapperClass = `logo-wrapper-${instanceId}`;

  // Use elegant CSS variables to dynamically scale the actual height of the image without layout clipping or overlapping
  const inlineStyles = `
    .${wrapperClass} {
      --logo-scale: ${mScale};
      --logo-rotation: ${rotDeg}deg;
      display: inline-flex;
      align-items: center;
      height: 100%;
      transform: rotate(var(--logo-rotation));
      transform-origin: left center;
      transition: transform 0.2s ease-out;
    }
    .${wrapperClass} img {
      height: calc(100% * var(--logo-scale)) !important;
      width: auto !important;
      max-height: none !important;
      transition: height 0.2s ease-out;
    }
    @media (min-width: 640px) {
      .${wrapperClass} {
        --logo-scale: ${dScale};
      }
    }
  `;

  if (iconOnly) {
    return (
      <div 
        id="setupss-logo-container" 
        className={`inline-flex items-center justify-center ${currentHeight.split(' ')[0]} ${className}`}
      >
        <style dangerouslySetInnerHTML={{ __html: inlineStyles }} />
        <div className={`${wrapperClass} flex items-center justify-center`}>
          {logoSettings.iconLogo && !hasIconError ? (
            <motion.img
              whileHover={{ y: -6, scale: 1.08 }}
              whileTap={{ y: -2, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
              src={logoSettings.iconLogo}
              alt="SETUPSS Icon"
              onError={() => setHasIconError(true)}
              className="h-full w-auto object-contain select-none cursor-pointer drop-shadow-[2px_4px_10px_rgba(45,52,54,0.18)]"
            />
          ) : (
            <motion.div
              whileHover={{ y: -4, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5 bg-vibrant-yellow border-2 border-vibrant-dark rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-vibrant-dark cursor-pointer flex items-center justify-center h-full aspect-square"
            >
              <Zap className="w-full h-full fill-current" />
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      id="setupss-logo-container" 
      className={`inline-flex items-center shrink-0 ${currentHeight.split(' ')[0]} ${className}`}
    >
      <style dangerouslySetInnerHTML={{ __html: inlineStyles }} />
      <div className={`${wrapperClass} inline-flex items-center`}>
        <motion.div
          whileHover={{ y: -4, scale: 1.03 }}
          whileTap={{ y: -1, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 350, damping: 22 }}
          className="h-full inline-flex items-center cursor-pointer select-none"
        >
          {isDarkTheme ? (
            /* Dark Mode Logo */
            <div className="h-full inline-flex items-center">
              {logoSettings.darkLogo && !hasDarkError ? (
                <img
                  src={logoSettings.darkLogo}
                  alt="SETUPSS"
                  onError={() => setHasDarkError(true)}
                  className="h-full w-auto max-w-none object-contain select-none cursor-pointer drop-shadow-[0_4px_12px_rgba(250,204,21,0.25)]"
                />
              ) : null}
            </div>
          ) : (
            /* Light Mode Logo */
            <div className="h-full inline-flex items-center">
              {logoSettings.lightLogo && !hasLightError ? (
                <img
                  src={logoSettings.lightLogo}
                  alt="SETUPSS"
                  onError={() => setHasLightError(true)}
                  className="h-full w-auto max-w-none object-contain select-none cursor-pointer drop-shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
                />
              ) : null}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
