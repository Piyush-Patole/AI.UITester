/**
 * InteractionEngine.ts
 * Discovers and executes safe UI actions. Checks against CrawlGuards.
 */
import { isSafeSelector } from './CrawlGuards';

export interface InteractionPayload {
  action: 'click' | 'double_click' | 'hover' | 'focus' | 'type' | 'submit';
  selector: string;
  value?: string;
}

export class InteractionEngine {
  /**
   * Executes an interaction on a page.
   * Returns true if successful, false otherwise.
   */
  async interact(
    payload: InteractionPayload,
    pageInstance?: any,
    onStatusUpdate?: (msg: string) => void
  ): Promise<boolean> {
    const { action, selector, value } = payload;

    // Check safety guard
    if (!isSafeSelector(selector, value)) {
      onStatusUpdate?.(`Skipping unsafe interaction: ${action} on ${selector}`);
      return false;
    }

    const isBrowser = typeof window !== 'undefined' || !pageInstance;

    if (isBrowser) {
      onStatusUpdate?.(`Simulated interaction: ${action} on ${selector}` + (value ? ` with value "${value}"` : ''));
      await this.sleep(300);
      return true;
    } else {
      try {
        onStatusUpdate?.(`Executing Playwright: ${action} on ${selector}`);
        await this.executePlaywrightAction(pageInstance, action, selector, value);
        return true;
      } catch (err) {
        onStatusUpdate?.(`Playwright interaction failed: ${(err as Error).message}`);
        return false;
      }
    }
  }

  /**
   * Executes actual Playwright actions.
   */
  private async executePlaywrightAction(
    page: any,
    action: string,
    selector: string,
    value?: string
  ): Promise<void> {
    const element = page.locator(selector);
    
    // Ensure element is visible and stable
    await element.waitFor({ state: 'visible', timeout: 5000 });

    switch (action) {
      case 'click':
        await element.click({ timeout: 5000 });
        break;
      case 'double_click':
        await element.dblclick({ timeout: 5000 });
        break;
      case 'hover':
        await element.hover({ timeout: 5000 });
        break;
      case 'focus':
        await element.focus({ timeout: 5000 });
        break;
      case 'type':
        if (value !== undefined) {
          await element.fill(value, { timeout: 5000 });
        }
        break;
      case 'submit':
        // If it's a form, submit it, otherwise click the submit button
        const tagName = await element.evaluate((el: HTMLElement) => el.tagName.toLowerCase());
        if (tagName === 'form') {
          await element.evaluate((form: HTMLFormElement) => form.submit());
        } else {
          await element.click({ timeout: 5000 });
        }
        break;
      default:
        throw new Error(`Unsupported interaction action: ${action}`);
    }
  }

  private sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }
}
