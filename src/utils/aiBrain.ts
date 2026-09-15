/**
 * SETUPSS SAIOS Collective Intelligence Brain (v2.0)
 * 
 * Unifies context, state, memory, and inferred user taste profiles
 * across all AI sub-systems (Military Audit, Budget Planner, Swipe Hub, and AI Chat).
 */

export interface BrainAuditResult {
  score: number;
  cores: number;
  memoryGb: number;
  storageMb: number;
  networkType: string;
  rtt: string;
  threatLevel: 'low' | 'medium' | 'high';
  timestamp: number;
}

export interface BrainPlannerSession {
  budget: number;
  category: string;
  preferences: string;
  planTitle?: string;
  totalEstimatedCost?: number;
  itemCount?: number;
  timestamp: number;
}

export interface TasteProfile {
  primaryCategory: string;
  rgbAffinity: number; // 0 to 1
  minimalistAffinity: number; // 0 to 1
  productivityAffinity: number; // 0 to 1
  cozyAffinity: number; // 0 to 1
  lastUpdated: number;
}

export interface SaiosBrainContext {
  lastAudit?: BrainAuditResult;
  lastPlanner?: BrainPlannerSession;
  recentViews: string[]; // List of setup IDs viewed
  savedSwipes: { setupId: string; title: string; liked: boolean; timestamp: number }[];
  tasteProfile?: TasteProfile;
  streakDays: number;
  lastStreakCheckIn?: string; // YYYY-MM-DD
}

const DEFAULT_CONTEXT: SaiosBrainContext = {
  recentViews: [],
  savedSwipes: [],
  streakDays: 0
};

/**
 * Get current global SAIOS AI context.
 */
export function getSharedBrainContext(): SaiosBrainContext {
  if (typeof window === 'undefined') return DEFAULT_CONTEXT;
  try {
    const raw = localStorage.getItem('saios_collective_brain');
    if (!raw) {
      return DEFAULT_CONTEXT;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse collective brain context:', e);
    return DEFAULT_CONTEXT;
  }
}

/**
 * Update partial keys in global SAIOS AI context and dispatch a reactive update event.
 */
export function updateSharedBrainContext(partial: Partial<SaiosBrainContext>): SaiosBrainContext {
  if (typeof window === 'undefined') return DEFAULT_CONTEXT;
  const current = getSharedBrainContext();
  const updated = { ...current, ...partial };
  
  // Re-calculate Taste Profile dynamically when swipes or planners update
  updated.tasteProfile = inferTasteProfile(updated);

  localStorage.setItem('saios_collective_brain', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('saios:brain_update', { detail: updated }));
  return updated;
}

/**
 * Dynamically infers aesthetic styles, power ratios, and software affinities
 * from user interactions and saves them as the unified "Taste Profile".
 */
function inferTasteProfile(context: SaiosBrainContext): TasteProfile {
  let rgb = 0.5;
  let minimalist = 0.5;
  let productivity = 0.5;
  let cozy = 0.5;

  // 1. Analyze planner sessions
  if (context.lastPlanner) {
    const cat = context.lastPlanner.category;
    if (cat.includes('RGB')) {
      rgb += 0.3;
      minimalist -= 0.1;
    }
    if (cat.includes('Minimalist')) {
      minimalist += 0.3;
      rgb -= 0.2;
    }
    if (cat.includes('Yazılımcı')) {
      productivity += 0.3;
    }
    if (cat.includes('Cozy')) {
      cozy += 0.3;
    }
  }

  // 2. Analyze swipes
  if (context.savedSwipes.length > 0) {
    context.savedSwipes.forEach(swipe => {
      const lowerTitle = swipe.title.toLowerCase();
      const weight = swipe.liked ? 0.15 : -0.15;
      
      if (lowerTitle.includes('rgb') || lowerTitle.includes('oyuncu') || lowerTitle.includes('gamer') || lowerTitle.includes('battle')) {
        rgb += weight;
      }
      if (lowerTitle.includes('minimal') || lowerTitle.includes('sade') || lowerTitle.includes('clean')) {
        minimalist += weight;
      }
      if (lowerTitle.includes('kod') || lowerTitle.includes('yazılım') || lowerTitle.includes('ofis') || lowerTitle.includes('developer')) {
        productivity += weight;
      }
      if (lowerTitle.includes('cozy') || lowerTitle.includes('ahşap') || lowerTitle.includes('sıcak') || lowerTitle.includes('retro')) {
        cozy += weight;
      }
    });
  }

  // Bound variables 0 to 1
  rgb = Math.max(0, Math.min(1, rgb));
  minimalist = Math.max(0, Math.min(1, minimalist));
  productivity = Math.max(0, Math.min(1, productivity));
  cozy = Math.max(0, Math.min(1, cozy));

  // Determine primary category
  const scores = [
    { name: 'RGB & Oyuncu Masa Düzeni', score: rgb },
    { name: 'Minimalist & İskandinav Tasarım', score: minimalist },
    { name: '💻 Yazılımcı & Üretkenlik Odaklı', score: productivity },
    { name: 'Cozy & Ahşap Warm Düzen', score: cozy }
  ];
  scores.sort((a, b) => b.score - a.score);

  return {
    primaryCategory: scores[0].name,
    rgbAffinity: rgb,
    minimalistAffinity: minimalist,
    productivityAffinity: productivity,
    cozyAffinity: cozy,
    lastUpdated: Date.now()
  };
}

/**
 * Register a setup view for "Continue Working / Recently Viewed" feed.
 */
export function trackSetupView(setupId: string) {
  const context = getSharedBrainContext();
  const filtered = context.recentViews.filter(id => id !== setupId);
  updateSharedBrainContext({
    recentViews: [setupId, ...filtered].slice(0, 8)
  });
}
