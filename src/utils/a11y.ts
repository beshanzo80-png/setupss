/**
 * SETUPS S AI OPERATING SYSTEM (SAIOS v1.0)
 * Accessibility (WCAG 2.1 AA Engine) (Phase 11)
 *
 * Provides WCAG 2.1 AA compliance utilities: screen reader live region announcements,
 * color contrast validation, keyboard focus management, and aria landmark helpers.
 */

/**
 * Screen Reader Live Region Announcer
 * Dynamically announces status updates to screen readers via aria-live regions
 */
export function announceToScreenReader(message: string, politeness: 'polite' | 'assertive' = 'polite'): void {
  if (typeof document === 'undefined') return;

  let announcer = document.getElementById('a11y-screen-reader-announcer');
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'a11y-screen-reader-announcer';
    announcer.setAttribute('aria-live', politeness);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.position = 'absolute';
    announcer.style.width = '1px';
    announcer.style.height = '1px';
    announcer.style.margin = '-1px';
    announcer.style.padding = '0';
    announcer.style.overflow = 'hidden';
    announcer.style.clip = 'rect(0, 0, 0, 0)';
    announcer.style.whiteSpace = 'nowrap';
    announcer.style.border = '0';
    document.body.appendChild(announcer);
  }

  announcer.setAttribute('aria-live', politeness);
  announcer.textContent = '';
  setTimeout(() => {
    if (announcer) announcer.textContent = message;
  }, 50);
}

/**
 * Calculate Relative Luminance of an RGB Color (WCAG 2.1 Spec)
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
  const [sR, sG, sB] = [r, g, b].map(v => {
    const val = v / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sR + 0.7152 * sG + 0.0722 * sB;
}

/**
 * Calculate Contrast Ratio Between Two RGB Colors (WCAG 2.1 Spec)
 */
export function calculateContrastRatio(
  rgb1: [number, number, number],
  rgb2: [number, number, number]
): number {
  const lum1 = getRelativeLuminance(...rgb1);
  const lum2 = getRelativeLuminance(...rgb2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Validate Contrast Ratio for WCAG AA Standards (4.5:1 Normal Text, 3:1 Large Text)
 */
export function isWcagAaCompliant(
  contrastRatio: number,
  isLargeText: boolean = false
): boolean {
  const requiredRatio = isLargeText ? 3.0 : 4.5;
  return contrastRatio >= requiredRatio;
}

/**
 * Trap Keyboard Focus Inside a Modal Container
 */
export function trapKeyboardFocus(modalContainer: HTMLElement): () => void {
  const focusableElements = modalContainer.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (focusableElements.length === 0) return () => {};

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  firstElement.focus();

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };

  modalContainer.addEventListener('keydown', handleKeyDown);
  return () => {
    modalContainer.removeEventListener('keydown', handleKeyDown);
  };
}
