/**
 * SETUPS S AI OPERATING SYSTEM (SAIOS v1.0)
 * Performance & Core Web Vitals Optimization Engine (Phase 8)
 *
 * Provides real-time metrics tracking for LCP, CLS, INP, and 
 * performance optimization utilities (debounce, image preloading, resource hints).
 */

export interface WebVitalsReport {
  lcp: number | null; // Target < 1800ms
  cls: number | null; // Target < 0.02
  inp: number | null; // Target < 100ms
  ttfb: number | null; // Target < 200ms
}

let metrics: WebVitalsReport = {
  lcp: null,
  cls: null,
  inp: null,
  ttfb: null
};

/**
 * Initialize Web Vitals performance observers
 */
export function initPerformanceMonitoring(): void {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return;
  }

  try {
    // 1. Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      metrics.lcp = lastEntry.startTime;
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    // 2. Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries() as any[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          metrics.cls = clsValue;
        }
      }
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });

    // 3. Interaction to Next Paint (INP) / First Input Delay (FID)
    const inpObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries() as any[]) {
        metrics.inp = entry.duration || entry.processingStart - entry.startTime;
      }
    });
    inpObserver.observe({ type: 'first-input', buffered: true });

  } catch (err) {
    // Gracefully handle browser API variances
  }
}

/**
 * Get current Core Web Vitals snapshot
 */
export function getPerformanceMetrics(): WebVitalsReport {
  return { ...metrics };
}

/**
 * Resource Preloader for Critical Assets (Hero Images, Fonts)
 */
export function preloadCriticalAsset(url: string, asType: 'image' | 'font' | 'script' | 'style'): void {
  if (typeof document === 'undefined') return;

  const existing = document.querySelector(`link[href="${url}"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;
  link.as = asType;
  if (asType === 'font') {
    link.crossOrigin = 'anonymous';
  }
  document.head.appendChild(link);
}

/**
 * Performant Debounce Helper to prevent high CPU / INP spikes during resize/scroll
 */
export function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timer: any = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
