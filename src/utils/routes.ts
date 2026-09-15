/**
 * SETUPS S Centralized Route Definitions & Helpers (SAIOS v1.0)
 * Handles clean URLs, route matching, and path generation for client & server.
 */

import { slugify } from './slug';

export const ROUTES = {
  HOME: '/',
  EXPLORE: '/explore',
  TRENDING: '/trending',
  LATEST: '/latest',
  DEALS: '/deals',
  LEADERBOARD: '/leaderboard',
  AI_PLANNER: '/ai-planner',
  ADMIN: '/admin',
  
  // Dynamic Route Builders
  setup: (slugOrId: string, title?: string) => {
    const clean = title ? `${slugify(title)}-${slugOrId}` : slugify(slugOrId) || slugOrId;
    return `/setup/${clean}`;
  },
  
  user: (username: string) => {
    return `/u/${encodeURIComponent(username)}`;
  },
  
  category: (slug: string) => {
    return `/category/${slugify(slug)}`;
  },
  
  tag: (tag: string) => {
    return `/tag/${slugify(tag)}`;
  },
  
  hardware: (hardware: string) => {
    return `/hardware/${slugify(hardware)}`;
  },

  gpu: (gpu: string) => {
    return `/gpu/${slugify(gpu)}`;
  },

  cpu: (cpu: string) => {
    return `/cpu/${slugify(cpu)}`;
  },

  game: (game: string) => {
    return `/game/${slugify(game)}`;
  },
  
  brand: (brand: string) => {
    return `/brand/${slugify(brand)}`;
  },
  
  room: (room: string) => {
    return `/room/${slugify(room)}`;
  },
  
  desk: (desk: string) => {
    return `/desk/${slugify(desk)}`;
  },
  
  accessory: (acc: string) => {
    return `/accessory/${slugify(acc)}`;
  },
  
  guide: (slug: string) => {
    return `/guide/${slugify(slug)}`;
  },

  blog: (slug: string) => {
    return `/blog/${slugify(slug)}`;
  },
  
  article: (slug: string) => {
    return `/article/${slugify(slug)}`;
  },
  
  collection: (slug: string) => {
    return `/collection/${slugify(slug)}`;
  }
};

export interface RouteMatch {
  route: string;
  params: Record<string, string>;
  tab?: string;
  setupId?: string;
  username?: string;
  category?: string;
  tag?: string;
  hardware?: string;
  gpu?: string;
  cpu?: string;
  game?: string;
  blog?: string;
  brand?: string;
  room?: string;
  desk?: string;
  accessory?: string;
  guide?: string;
  article?: string;
  collection?: string;
}

/**
 * Parses any incoming URL path & query string into a structured route match object.
 * Supports legacy query parameters for 100% backward compatibility.
 */
export function parseRoute(pathname: string, searchParams: URLSearchParams | Record<string, string>): RouteMatch {
  const getQuery = (key: string): string | undefined => {
    if (searchParams instanceof URLSearchParams) {
      return searchParams.get(key) || undefined;
    }
    return searchParams[key];
  };

  // 1. Check Legacy Query Parameters (for backward compatibility)
  const legacySetup = getQuery('setup');
  if (legacySetup) {
    return {
      route: 'setup',
      params: { slug: legacySetup },
      setupId: legacySetup
    };
  }

  const legacyProfile = getQuery('profile') || getQuery('user');
  if (legacyProfile) {
    return {
      route: 'user',
      params: { username: legacyProfile },
      username: legacyProfile
    };
  }

  const legacyCategory = getQuery('category');
  if (legacyCategory && legacyCategory !== 'all') {
    return {
      route: 'category',
      params: { slug: legacyCategory },
      category: legacyCategory
    };
  }

  const legacyTag = getQuery('tag');
  if (legacyTag) {
    return {
      route: 'tag',
      params: { slug: legacyTag },
      tag: legacyTag
    };
  }

  const legacyHardware = getQuery('hardware') || getQuery('gpu') || getQuery('cpu');
  if (legacyHardware) {
    return {
      route: 'hardware',
      params: { slug: legacyHardware },
      hardware: legacyHardware
    };
  }

  const legacyBrand = getQuery('brand');
  if (legacyBrand) {
    return {
      route: 'brand',
      params: { slug: legacyBrand },
      brand: legacyBrand
    };
  }

  const legacyGuide = getQuery('guide') || getQuery('article');
  if (legacyGuide) {
    return {
      route: 'guide',
      params: { slug: legacyGuide },
      guide: legacyGuide
    };
  }

  const legacyTab = getQuery('tab');
  if (legacyTab) {
    let mappedTab = legacyTab;
    if (legacyTab === 'wishlist') mappedTab = 'ai';
    return {
      route: mappedTab,
      params: {},
      tab: mappedTab
    };
  }

  // 2. Clean Path Routing Matching
  const cleanPath = pathname.replace(/\/$/, '') || '/';
  const parts = cleanPath.split('/').filter(Boolean);

  if (parts.length === 0) {
    return { route: 'home', params: {}, tab: 'explore' };
  }

  // Handle matrix category/cat/hardware/hw
  if (parts[0] === 'category' && parts.length >= 4 && parts[2] === 'hardware') {
    return {
      route: 'category-hardware',
      params: { category: parts[1], hardware: parts[3] },
      category: parts[1],
      hardware: parts[3],
      tab: 'explore'
    };
  }

  const first = parts[0].toLowerCase();
  const second = parts[1] ? decodeURIComponent(parts[1]) : '';

  switch (first) {
    case 'explore':
      return { route: 'explore', params: {}, tab: 'explore' };
    case 'trending':
      return { route: 'trending', params: {}, tab: 'trending' };
    case 'latest':
      return { route: 'latest', params: {}, tab: 'latest' };
    case 'blog':
    case 'guide':
    case 'article':
      if (second) {
        return { route: 'blog-detail', params: { slug: second }, blog: second, tab: 'blog' };
      }
      return { route: 'blog-list', params: {}, tab: 'blog' };
    case 'ai-planner':
    case 'ai':
      return { route: 'ai-planner', params: {}, tab: 'wishlist' };
    case 'auditor':
      return { route: 'auditor', params: {}, tab: 'auditor' };
    case 'mobile-hub':
    case 'streak':
      return { route: 'explore', params: {}, tab: 'explore' };
    case 'deals':
      return { route: 'deals', params: {}, tab: 'deals' };
    case 'leaderboard':
      return { route: 'leaderboard', params: {}, tab: 'leaderboard' };
    case 'admin':
      return { route: 'admin', params: {}, tab: 'admin' };
    case 'global-chat':
      return { route: 'global-chat', params: {}, tab: 'global-chat' };
    case 'chatss':
      return { route: 'chatss', params: {}, tab: 'chatss' };
    case 'hardware-graph':
      return { route: 'hardware-graph', params: {}, tab: 'hardware-graph' };
    case 'feed':
      return { route: 'feed', params: {}, tab: 'feed' };
    case 'setup':
      if (second) {
        return { route: 'setup', params: { slug: second }, setupId: second, tab: 'explore' };
      }
      return { route: 'explore', params: {}, tab: 'explore' };
    case 'u':
    case 'user':
      if (second) {
        return { route: 'user', params: { username: second }, username: second };
      }
      return { route: 'leaderboard', params: {}, tab: 'leaderboard' };
    case 'category':
      if (second) {
        return { route: 'category', params: { slug: second }, category: second, tab: 'explore' };
      }
      return { route: 'explore', params: {}, tab: 'explore' };
    case 'tag':
      if (second) {
        return { route: 'tag', params: { slug: second }, tag: second, tab: 'explore' };
      }
      return { route: 'explore', params: {}, tab: 'explore' };
    case 'hardware':
      if (second) {
        return { route: 'hardware', params: { slug: second }, hardware: second, tab: 'hardware-graph' };
      }
      return { route: 'hardware-graph', params: {}, tab: 'hardware-graph' };
    case 'gpu':
      if (second) {
        return { route: 'hardware', params: { slug: second }, hardware: second, gpu: second, tab: 'hardware-graph' };
      }
      return { route: 'hardware-graph', params: {}, tab: 'hardware-graph' };
    case 'cpu':
      if (second) {
        return { route: 'hardware', params: { slug: second }, hardware: second, cpu: second, tab: 'hardware-graph' };
      }
      return { route: 'hardware-graph', params: {}, tab: 'hardware-graph' };
    case 'game':
      if (second) {
        return { route: 'game', params: { slug: second }, game: second, tab: 'explore' };
      }
      return { route: 'explore', params: {}, tab: 'explore' };
    case 'brand':
      if (second) {
        return { route: 'brand', params: { slug: second }, brand: second, tab: 'explore' };
      }
      return { route: 'explore', params: {}, tab: 'explore' };
    case 'room':
      if (second) {
        return { route: 'room', params: { slug: second }, room: second, tab: 'explore' };
      }
      return { route: 'explore', params: {}, tab: 'explore' };
    case 'desk':
      if (second) {
        return { route: 'desk', params: { slug: second }, desk: second, tab: 'explore' };
      }
      return { route: 'explore', params: {}, tab: 'explore' };
    case 'accessory':
      if (second) {
        return { route: 'accessory', params: { slug: second }, accessory: second, tab: 'explore' };
      }
      return { route: 'explore', params: {}, tab: 'explore' };
    case 'collection':
      if (second) {
        return { route: 'collection', params: { slug: second }, collection: second, tab: 'explore' };
      }
      return { route: 'explore', params: {}, tab: 'explore' };
    default:
      return { route: 'home', params: {}, tab: 'explore' };
  }
}
