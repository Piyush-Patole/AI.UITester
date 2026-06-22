/**
 * run-crawler.ts
 * CLI Entry point for running the autonomous crawler engine under Node.js.
 * Execute with: npx tsx scripts/run-crawler.ts <target-url> [depth]
 */
import { CrawlOrchestrator } from '../src/services/crawler/CrawlOrchestrator';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const targetUrl = process.argv[2];
  const depthArg = process.argv[3];
  
  if (!targetUrl) {
    console.error('\x1b[31mError: Target URL is required.\x1b[0m');
    console.log('Usage: npx tsx scripts/run-crawler.ts <target-url> [max-depth]');
    console.log('Example: npx tsx scripts/run-crawler.ts https://example.com 3');
    process.exit(1);
  }

  const maxDepth = depthArg ? parseInt(depthArg, 10) : 2;
  
  console.log(`\x1b[36mInitializing Autonomous Crawler Engine for: ${targetUrl}\x1b[0m`);
  console.log(`Max Depth Configured: ${maxDepth}\n`);

  const orchestrator = new CrawlOrchestrator();
  
  try {
    const report = await orchestrator.startCrawl(targetUrl, {
      maxDepth,
      onStepProgress: (step, name, description) => {
        console.log(`\n\x1b[33m[Step ${step}/8] ${name}\x1b[0m - ${description}`);
      },
      onLog: (msg) => {
        console.log(`  \x1b[90m→ ${msg}\x1b[0m`);
      },
      onSitemapUpdated: (nodes) => {
        console.log(`  \x1b[32m✔ Route Sitemap updated: ${nodes.length} pages mapped.\x1b[0m`);
      }
    });

    const outputPath = path.resolve(process.cwd(), 'crawl-report.json');
    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf8');

    console.log('\n\x1b[32m✔ Autonomous Crawl completed successfully!\x1b[0m');
    console.log(`Report written to: \x1b[35m${outputPath}\x1b[0m`);
    
    // Print Summary
    console.log('\n==========================================');
    console.log('            Crawl execution summary       ');
    console.log('==========================================');
    console.log(`Pages Crawled:        ${report.crawlSummary.pagesCrawled}`);
    console.log(`States Explored:      ${report.crawlSummary.statesExplored}`);
    console.log(`Accessibility Issues: ${report.accessibility.length}`);
    console.log(`Visual Regressions:   ${report.visualIssues.length}`);
    console.log(`Broken Links:         ${report.brokenLinks.length}`);
    console.log(`Classified Defects:   ${report.defects.length}`);
    console.log('==========================================\n');
    
  } catch (err) {
    console.error('\n\x1b[31m✘ Crawl execution failed:\x1b[0m', err);
    process.exit(1);
  }
}

main();
