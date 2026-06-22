/**
 * SiteDiscovery.ts
 * Discovers pages on the website using a BFS traversal model.
 * Supports both actual Playwright crawling (for Node CLI) and high-fidelity simulation (for browser UI).
 */
import { isSafeUrl } from './CrawlGuards';

export interface DiscoveryOptions {
  maxDepth: number;
  maxPages?: number;
  credentials?: { username?: string; password?: string };
  onPageDiscovered?: (url: string, depth: number) => void;
  onStatusUpdate?: (msg: string) => void;
}

export class SiteDiscovery {
  /**
   * Main entry point to discover pages.
   */
  async discover(baseUrl: string, options: DiscoveryOptions): Promise<string[]> {
    const maxDepth = options.maxDepth || 3;
    const maxPages = options.maxPages || 20;
    
    const isBrowser = typeof window !== 'undefined';
    
    if (isBrowser) {
      options.onStatusUpdate?.('Running in browser mode: Simulating page discovery...');
      return this.simulateDiscovery(baseUrl, maxDepth, maxPages, options);
    } else {
      options.onStatusUpdate?.('Running in Node mode: Launching browser via Playwright...');
      try {
        return await this.crawlWithPlaywright(baseUrl, maxDepth, maxPages, options);
      } catch (err) {
        options.onStatusUpdate?.(`Playwright crawl failed: ${(err as Error).message}. Falling back to simulation.`);
        return this.simulateDiscovery(baseUrl, maxDepth, maxPages, options);
      }
    }
  }

  /**
   * Simulated BFS crawler for browser demonstration.
   */
  private async simulateDiscovery(
    baseUrl: string,
    maxDepth: number,
    maxPages: number,
    options: DiscoveryOptions
  ): Promise<string[]> {
    const base = baseUrl.replace(/\/$/, '');
    


    const visited = new Set<string>();
    const queue: { url: string; depth: number }[] = [{ url: base + '/', depth: 0 }];
    
    visited.add(base + '/');
    options.onPageDiscovered?.(base + '/', 0);
    
    await this.sleep(300);

    while (queue.length > 0 && visited.size < maxPages) {
      const current = queue.shift()!;
      
      if (current.depth >= maxDepth) continue;

      options.onStatusUpdate?.(`Simulating search for links on: ${current.url}`);
      await this.sleep(400);

      // Randomly select 2-4 child pages that make sense
      const currentPath = new URL(current.url).pathname;
      let children: string[] = [];

      if (currentPath === '/') {
        children = ['/dashboard', '/about', '/help'];
      } else if (currentPath === '/dashboard') {
        children = ['/settings', '/profile', '/users', '/reports'];
      } else if (currentPath === '/users') {
        children = ['/users/new'];
      } else if (currentPath === '/reports') {
        children = ['/reports/monthly'];
      } else if (currentPath === '/settings') {
        children = ['/billing'];
      } else if (currentPath === '/billing') {
        children = ['/billing/invoice'];
      }

      for (const childPath of children) {
        const fullUrl = base + childPath;
        if (!visited.has(fullUrl) && isSafeUrl(fullUrl) && visited.size < maxPages) {
          visited.add(fullUrl);
          queue.push({ url: fullUrl, depth: current.depth + 1 });
          options.onPageDiscovered?.(fullUrl, current.depth + 1);
          await this.sleep(200);
        }
      }
    }

    options.onStatusUpdate?.(`Simulated discovery complete. Discovered ${visited.size} pages.`);
    return Array.from(visited);
  }

  /**
   * Real BFS crawler using Playwright.
   */
  private async crawlWithPlaywright(
    baseUrl: string,
    maxDepth: number,
    maxPages: number,
    options: DiscoveryOptions
  ): Promise<string[]> {
    // Dynamic import to prevent bundler compilation errors in browser environments
    const { chromium } = await import('playwright');
    
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    const baseOrigin = new URL(baseUrl).origin;
    const visited = new Set<string>();
    const queue: { url: string; depth: number }[] = [{ url: baseUrl, depth: 0 }];
    
    visited.add(baseUrl);
    options.onPageDiscovered?.(baseUrl, 0);

    // If credentials are provided, handle login first
    if (options.credentials?.username && options.credentials?.password) {
      options.onStatusUpdate?.(`Logging in as ${options.credentials.username}...`);
      await page.goto(baseUrl);
      
      // Look for standard login fields and sign in
      try {
        const userInputs = await page.$$('input[type="text"], input[type="email"], input[name*="user"], input[name*="email"]');
        const passInputs = await page.$$('input[type="password"]');
        const submitButtons = await page.$$('button[type="submit"], input[type="submit"], button:has-text("Log In"), button:has-text("Sign In")');

        if (userInputs.length > 0 && passInputs.length > 0) {
          await userInputs[0].fill(options.credentials.username);
          await passInputs[0].fill(options.credentials.password);
          if (submitButtons.length > 0) {
            await Promise.all([
              page.waitForNavigation({ timeout: 5000 }).catch(() => {}),
              submitButtons[0].click()
            ]);
          } else {
            await Promise.all([
              page.waitForNavigation({ timeout: 5000 }).catch(() => {}),
              page.keyboard.press('Enter')
            ]);
          }
          options.onStatusUpdate?.('Auth session initialized.');
        }
      } catch (loginErr) {
        options.onStatusUpdate?.(`Warning: Auth autofill failed - ${(loginErr as Error).message}`);
      }
    }

    while (queue.length > 0 && visited.size < maxPages) {
      const { url, depth } = queue.shift()!;
      
      if (depth >= maxDepth) continue;

      options.onStatusUpdate?.(`Navigating to: ${url} (Depth: ${depth})`);
      
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });
        
        // Extract all links
        const hrefs = await page.$$eval('a', (links) => 
          links.map(link => (link as HTMLAnchorElement).href)
        );

        for (const rawHref of hrefs) {
          try {
            if (!rawHref) continue;
            
            // Clean hash and normalize URL
            const urlObj = new URL(rawHref, url);
            urlObj.hash = ''; // remove hash
            const cleanUrl = urlObj.toString();

            // Check boundaries: same origin, not visited yet, matches safe patterns
            if (
              urlObj.origin === baseOrigin &&
              !visited.has(cleanUrl) &&
              isSafeUrl(cleanUrl) &&
              visited.size < maxPages
            ) {
              visited.add(cleanUrl);
              queue.push({ url: cleanUrl, depth: depth + 1 });
              options.onPageDiscovered?.(cleanUrl, depth + 1);
            }
          } catch {
            // Ignore invalid URLs
          }
        }
      } catch (err) {
        options.onStatusUpdate?.(`Error crawling ${url}: ${(err as Error).message}`);
      }
    }

    await browser.close();
    options.onStatusUpdate?.(`Crawl finished. Found ${visited.size} page(s).`);
    return Array.from(visited);
  }

  private sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }
}
