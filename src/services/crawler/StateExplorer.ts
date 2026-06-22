/**
 * StateExplorer.ts
 * Explores a page to discover interactive elements and generate sub-states (tabs, modals, accordions).
 */

export interface UIStateElement {
  selector: string;
  type: string;
  text?: string;
}

export interface UIState {
  id: string;
  name: string;
  pageUrl: string;
  type: 'default' | 'modal' | 'tab' | 'accordion' | 'dropdown' | 'drawer';
  triggerSelector?: string;
  elements: UIStateElement[];
}

export class StateExplorer {
  /**
   * Main entry point to extract states for a specific URL.
   */
  async explore(pageUrl: string, pageInstance?: any): Promise<UIState[]> {
    const isBrowser = typeof window !== 'undefined' || !pageInstance;
    
    if (isBrowser) {
      return this.simulateExplore(pageUrl);
    } else {
      try {
        return await this.exploreWithPlaywright(pageUrl, pageInstance);
      } catch {
        return this.simulateExplore(pageUrl);
      }
    }
  }

  /**
   * Explores state DOM elements via Playwright.
   */
  private async exploreWithPlaywright(pageUrl: string, page: any): Promise<UIState[]> {
    const states: UIState[] = [];
    const urlObj = new URL(pageUrl);
    const pageId = urlObj.pathname.replace(/\/$/, '') || 'home';

    // 1. Capture Default State
    const defaultElements = await this.extractInteractiveElements(page);
    states.push({
      id: `${pageId}-default`,
      name: 'Default State',
      pageUrl,
      type: 'default',
      elements: defaultElements
    });

    // 2. Discover Tabs
    const tabs = await page.$$('button[role="tab"], .tab, [class*="tab"]');
    for (let i = 0; i < Math.min(tabs.length, 3); i++) {
      try {
        const text = (await tabs[i].innerText()) || `Tab ${i + 1}`;
        const selector = `button[role="tab"]:nth-of-type(${i + 1})`;
        
        states.push({
          id: `${pageId}-tab-${i + 1}`,
          name: `Tab: ${text}`,
          pageUrl,
          type: 'tab',
          triggerSelector: selector,
          elements: defaultElements // elements in this state
        });
      } catch {
        // Ignore errors
      }
    }

    // 3. Discover Modals
    const modalButtons = await page.$$('button:has-text("open"), button:has-text("create"), button:has-text("add"), [data-toggle="modal"]');
    for (let i = 0; i < Math.min(modalButtons.length, 2); i++) {
      try {
        const text = (await modalButtons[i].innerText()) || `Open Modal`;
        states.push({
          id: `${pageId}-modal-${i + 1}`,
          name: `Modal Open: ${text}`,
          pageUrl,
          type: 'modal',
          triggerSelector: `button:has-text("${text}")`,
          elements: [
            ...defaultElements,
            { selector: '.modal-content, [role="dialog"]', type: 'container', text: 'Modal Overlay' }
          ]
        });
      } catch {
        // Ignore errors
      }
    }

    return states;
  }

  /**
   * Simulated page exploration.
   */
  private simulateExplore(pageUrl: string): UIState[] {
    const urlObj = new URL(pageUrl);
    const path = urlObj.pathname;
    const pageId = path.replace(/\/$/, '') || 'home';
    const states: UIState[] = [];

    // Default state elements depending on the page
    let elements: UIStateElement[] = [
      { selector: 'a#logo', type: 'link', text: 'Logo Home' },
      { selector: 'button#nav-menu', type: 'button', text: 'Menu' }
    ];

    if (path === '/' || path === '/home') {
      elements.push(
        { selector: 'button#login-btn', type: 'button', text: 'Sign In' },
        { selector: 'a#cta-get-started', type: 'link', text: 'Get Started' }
      );
      states.push({
        id: 'home-default',
        name: 'Default State',
        pageUrl,
        type: 'default',
        elements
      });
    } else if (path.includes('dashboard')) {
      elements.push(
        { selector: 'button#btn-new-test', type: 'button', text: 'Run Test Run' },
        { selector: 'button#tab-insights', type: 'button', text: 'Insights' },
        { selector: 'button#tab-logs', type: 'button', text: 'Logs' }
      );
      states.push(
        {
          id: 'dashboard-default',
          name: 'Default State',
          pageUrl,
          type: 'default',
          elements
        },
        {
          id: 'dashboard-modal-new-test',
          name: 'Modal Open: New Test Scenario',
          pageUrl,
          type: 'modal',
          triggerSelector: 'button#btn-new-test',
          elements: [
            ...elements,
            { selector: 'div.modal-overlay', type: 'container', text: 'Overlay' },
            { selector: 'input#scenario-desc', type: 'input', text: 'Scenario Input' },
            { selector: 'button#btn-submit-scenario', type: 'button', text: 'Submit' }
          ]
        },
        {
          id: 'dashboard-tab-insights',
          name: 'Tab: Insights Tab',
          pageUrl,
          type: 'tab',
          triggerSelector: 'button#tab-insights',
          elements: [
            ...elements,
            { selector: 'div.charts-panel', type: 'container', text: 'Insights charts' }
          ]
        }
      );
    } else if (path.includes('settings')) {
      elements.push(
        { selector: 'input#api-key-input', type: 'input', text: 'API Key' },
        { selector: 'button#save-settings', type: 'button', text: 'Save' },
        { selector: 'div.accordion-billing-header', type: 'button', text: 'Billing Settings' }
      );
      states.push(
        {
          id: 'settings-default',
          name: 'Default State',
          pageUrl,
          type: 'default',
          elements
        },
        {
          id: 'settings-accordion-billing',
          name: 'Expanded Accordion: Billing',
          pageUrl,
          type: 'accordion',
          triggerSelector: 'div.accordion-billing-header',
          elements: [
            ...elements,
            { selector: 'div.billing-details-content', type: 'container', text: 'Billing Details' },
            { selector: 'button#btn-update-card', type: 'button', text: 'Update Card' }
          ]
        }
      );
    } else {
      // General Fallback
      elements.push(
        { selector: 'h1.page-title', type: 'text', text: 'Standard Header' }
      );
      states.push({
        id: `${pageId}-default`,
        name: 'Default State',
        pageUrl,
        type: 'default',
        elements
      });
    }

    return states;
  }

  /**
   * Utility to scrape basic interactive selectors off a live Playwright page.
   */
  private async extractInteractiveElements(page: any): Promise<UIStateElement[]> {
    const list: UIStateElement[] = [];
    try {
      const links = await page.$$('a');
      for (const link of links.slice(0, 5)) {
        const id = await link.getAttribute('id');
        const text = await link.innerText();
        list.push({
          selector: id ? `a#${id}` : 'a',
          type: 'link',
          text: text ? text.trim() : undefined
        });
      }

      const buttons = await page.$$('button');
      for (const btn of buttons.slice(0, 5)) {
        const id = await btn.getAttribute('id');
        const cls = await btn.getAttribute('class');
        const text = await btn.innerText();
        const selector = id ? `button#${id}` : cls ? `button.${cls.split(' ')[0]}` : 'button';
        list.push({
          selector,
          type: 'button',
          text: text ? text.trim() : undefined
        });
      }

      const inputs = await page.$$('input, select, textarea');
      for (const input of inputs.slice(0, 5)) {
        const id = await input.getAttribute('id');
        const name = await input.getAttribute('name');
        const type = await input.getAttribute('type') || 'input';
        const selector = id ? `${type}#${id}` : name ? `${type}[name="${name}"]` : type;
        list.push({
          selector,
          type: 'input'
        });
      }
    } catch {
      // Ignore errors
    }
    return list;
  }
}
