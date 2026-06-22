/**
 * CrawlGuards.ts
 * Implements safety boundaries to prevent the crawler from triggering destructive operations.
 */

// URL path patterns that are dangerous and should be avoided
export const UNSAFE_URL_PATTERNS = [
  /logout/i,
  /signout/i,
  /delete/i,
  /reset-password/i,
  /cancel-subscription/i,
  /billing-cancel/i,
  /deactivate/i,
  /purge/i,
  /terminate/i
];

// CSS selectors or element attributes that indicate dangerous UI actions
export const UNSAFE_SELECTORS = [
  'a[href*="logout"]',
  'a[href*="signout"]',
  'a[href*="delete"]',
  'button.danger',
  'button.destructive',
  '.btn-danger',
  '.btn-destructive',
  '[data-delete]',
  '[data-destructive]',
  'input[type="submit"][value*="Delete"]',
  'input[type="submit"][value*="Logout"]'
];

// Text content patterns that suggest dangerous actions
export const UNSAFE_TEXT_PATTERNS = [
  /\bdelete\b/i,
  /\blog\s*out\b/i,
  /\bsign\s*out\b/i,
  /\bcancel\b/i,
  /\bdeactivate\b/i,
  /\bremove\b/i,
  /\bpurge\b/i
];

/**
 * Checks if a given URL is safe to crawl.
 */
export function isSafeUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const pathAndQuery = urlObj.pathname + urlObj.search;
    
    for (const pattern of UNSAFE_URL_PATTERNS) {
      if (pattern.test(pathAndQuery)) {
        return false;
      }
    }
    return true;
  } catch {
    // If URL parsing fails, check the raw string
    for (const pattern of UNSAFE_URL_PATTERNS) {
      if (pattern.test(url)) {
        return false;
      }
    }
    return true;
  }
}

/**
 * Checks if an interactive element selector or its text is safe to interact with.
 */
export function isSafeSelector(selector: string, text?: string): boolean {
  // Check the selector matches
  const normalizedSelector = selector.toLowerCase();
  for (const unsafe of UNSAFE_SELECTORS) {
    if (normalizedSelector.includes(unsafe.toLowerCase())) {
      return false;
    }
  }

  // Check text content if provided
  if (text) {
    for (const pattern of UNSAFE_TEXT_PATTERNS) {
      if (pattern.test(text)) {
        return false;
      }
    }
  }

  return true;
}
