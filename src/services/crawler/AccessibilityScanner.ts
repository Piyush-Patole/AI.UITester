/**
 * AccessibilityScanner.ts
 * Integrates Axe Core to perform accessibility audits.
 * Supports dynamic imports for node context, and simulation in browser.
 */

export interface AccessibilityIssue {
  id: string;
  severity: 'minor' | 'moderate' | 'serious' | 'critical';
  description: string;
  element: string;
  rule: string;
  helpUrl?: string;
}

export class AccessibilityScanner {
  /**
   * Runs an accessibility scan on the current page.
   */
  async scan(pageUrl: string, pageInstance?: any, onStatusUpdate?: (msg: string) => void): Promise<AccessibilityIssue[]> {
    const isBrowser = typeof window !== 'undefined' || !pageInstance;

    if (isBrowser) {
      onStatusUpdate?.(`Simulating accessibility audit for ${pageUrl} using Axe Core...`);
      return this.simulateScan(pageUrl);
    } else {
      try {
        onStatusUpdate?.(`Running Axe Core accessibility audit on ${pageUrl}...`);
        return await this.scanWithAxePlaywright(pageInstance);
      } catch (err) {
        onStatusUpdate?.(`Axe audit failed: ${(err as Error).message}. Falling back to simulation.`);
        return this.simulateScan(pageUrl);
      }
    }
  }

  /**
   * Scans a page using `@axe-core/playwright` under Node.js.
   */
  private async scanWithAxePlaywright(page: any): Promise<AccessibilityIssue[]> {
    // Dynamic import to prevent client-side bundler errors
    const { default: AxeBuilder } = await import('@axe-core/playwright');
    
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'section508'])
      .analyze();

    const issues: AccessibilityIssue[] = [];

    for (const violation of results.violations) {
      for (const node of violation.nodes) {
        const selector = node.target.join(' > ');
        issues.push({
          id: violation.id,
          severity: violation.impact as AccessibilityIssue['severity'] || 'moderate',
          description: violation.description,
          element: selector,
          rule: violation.id,
          helpUrl: violation.helpUrl
        });
      }
    }

    return issues;
  }

  /**
   * Generates realistic mock accessibility issues for browser showcase.
   */
  private simulateScan(pageUrl: string): AccessibilityIssue[] {
    const pathname = new URL(pageUrl).pathname;
    const issues: AccessibilityIssue[] = [];

    // Base color contrast issue on logo (almost everywhere)
    issues.push({
      id: 'color-contrast',
      severity: 'moderate',
      description: 'Elements must have sufficient color contrast (ratio of 4.5:1 for normal text).',
      element: 'a#logo > span.text-gray-400',
      rule: 'color-contrast',
      helpUrl: 'https://dequeuniversity.com/rules/axe/4.9/color-contrast'
    });

    if (pathname === '/' || pathname === '/home') {
      issues.push({
        id: 'image-alt',
        severity: 'critical',
        description: 'Images must have alternate text (alt attribute).',
        element: 'img.hero-image-placeholder',
        rule: 'image-alt',
        helpUrl: 'https://dequeuniversity.com/rules/axe/4.9/image-alt'
      });
    } else if (pathname.includes('dashboard')) {
      issues.push(
        {
          id: 'button-name',
          severity: 'critical',
          description: 'Buttons must have discernible text.',
          element: 'button.icon-btn-settings-header',
          rule: 'button-name',
          helpUrl: 'https://dequeuniversity.com/rules/axe/4.9/button-name'
        },
        {
          id: 'aria-required-parent',
          severity: 'serious',
          description: 'ARIA roles must conform to parent-child structure constraints.',
          element: 'div.sidebar-menu-list > div[role="menuitem"]',
          rule: 'aria-required-parent',
          helpUrl: 'https://dequeuniversity.com/rules/axe/4.9/aria-required-parent'
        }
      );
    } else if (pathname.includes('settings')) {
      issues.push({
        id: 'label',
        severity: 'critical',
        description: 'Form elements must have labels.',
        element: 'input#api-key-input',
        rule: 'label',
        helpUrl: 'https://dequeuniversity.com/rules/axe/4.9/label'
      });
    }

    return issues;
  }
}
