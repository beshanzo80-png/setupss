/**
 * SETUPS S Navigation Helper (SAIOS v1.0)
 * Modern SPA Navigation Manager supporting history state, clean URLs, deep linking & browser back/forward.
 */

import { ROUTES, parseRoute, RouteMatch } from './routes';
import { slugify } from './slug';

export interface NavigationOptions {
  replace?: boolean;
  preserveScroll?: boolean;
  state?: any;
}

/**
 * Programmatically navigate to a path or route helper.
 * Pushes state to window.history and dispatches a custom event for React components to sync seamlessly.
 */
export function navigateTo(path: string, options: NavigationOptions = {}) {
  if (typeof window === 'undefined') return;

  const currentPath = window.location.pathname + window.location.search;
  if (currentPath === path) return;

  if (options.replace) {
    window.history.replaceState(options.state || {}, '', path);
  } else {
    window.history.pushState(options.state || {}, '', path);
  }

  // Trigger custom event so reactive components update instantly without full refresh
  window.dispatchEvent(new CustomEvent('saios:navigate', { detail: { path, options } }));

  if (!options.preserveScroll) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/**
 * Get current route match from current browser window.
 */
export function getCurrentRoute(): RouteMatch {
  if (typeof window === 'undefined') {
    return { route: 'home', params: {}, tab: 'explore' };
  }
  const urlParams = new URLSearchParams(window.location.search);
  return parseRoute(window.location.pathname, urlParams);
}

/**
 * Check if current URL contains legacy query parameters (e.g. ?setup=123, ?profile=john)
 * and perform clean 301-equivalent client-side URL normalization.
 */
export function normalizeLegacyUrl(): string | null {
  if (typeof window === 'undefined') return null;

  const urlParams = new URLSearchParams(window.location.search);
  const path = window.location.pathname;

  let cleanPath: string | null = null;

  const setup = urlParams.get('setup');
  if (setup) {
    cleanPath = ROUTES.setup(setup);
  } else {
    const profile = urlParams.get('profile') || urlParams.get('user');
    if (profile) {
      cleanPath = ROUTES.user(profile);
    } else {
      const category = urlParams.get('category');
      if (category && category !== 'all') {
        cleanPath = ROUTES.category(category);
      } else {
        const tag = urlParams.get('tag');
        if (tag) {
          cleanPath = ROUTES.tag(tag);
        } else {
          const hardware = urlParams.get('hardware') || urlParams.get('gpu') || urlParams.get('cpu');
          if (hardware) {
            cleanPath = ROUTES.hardware(hardware);
          } else {
            const brand = urlParams.get('brand');
            if (brand) {
              cleanPath = ROUTES.brand(brand);
            } else {
              const tab = urlParams.get('tab');
              if (tab) {
                if (tab === 'ai' || tab === 'wishlist') cleanPath = ROUTES.AI_PLANNER;
                else if (tab === 'deals') cleanPath = ROUTES.DEALS;
                else if (tab === 'leaderboard') cleanPath = ROUTES.LEADERBOARD;
                else if (tab === 'explore') cleanPath = ROUTES.EXPLORE;
                else if (tab === 'auditor') cleanPath = '/auditor';
                else if (tab === 'mobile-hub') cleanPath = '/mobile-hub';
                else if (tab === 'streak') cleanPath = '/streak';
              }
            }
          }
        }
      }
    }
  }

  if (cleanPath && cleanPath !== path) {
    window.history.replaceState({}, '', cleanPath);
    return cleanPath;
  }

  return null;
}

/**
 * Custom React Hook listener setup for popstate & saios:navigate events.
 */
export function listenToNavigation(callback: (route: RouteMatch) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleNav = () => {
    callback(getCurrentRoute());
  };

  window.addEventListener('popstate', handleNav);
  window.addEventListener('saios:navigate', handleNav);

  return () => {
    window.removeEventListener('popstate', handleNav);
    window.removeEventListener('saios:navigate', handleNav);
  };
}
