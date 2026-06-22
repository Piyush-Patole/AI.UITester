/**
 * ReportGenerator.ts
 * Generates the unified AI-readable crawl and test execution report.
 */
import type { UIState } from './StateExplorer';
import type { AccessibilityIssue } from './AccessibilityScanner';
import type { VisualIssue } from './VisualValidator';

export interface BrokenLink {
  url: string;
  parentUrl: string;
  statusCode: number;
}

export interface AIDefect {
  id: string;
  type: 'layout' | 'dom' | 'accessibility' | 'visual' | 'navigation' | 'security';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  issue: string;
  rootCause?: string;
  reproductionSteps?: string;
  fixSuggestion?: string;
  pageUrl: string;
}

export interface CrawlSummary {
  targetUrl: string;
  startTime: string;
  endTime: string;
  durationMs: number;
  pagesCrawled: number;
  statesExplored: number;
  defectsFound: number;
}

export interface CrawlReport {
  crawlSummary: CrawlSummary;
  pages: string[];
  states: UIState[];
  accessibility: AccessibilityIssue[];
  visualIssues: VisualIssue[];
  brokenLinks: BrokenLink[];
  defects: AIDefect[];
}

export class ReportGenerator {
  /**
   * Compiles crawl outputs into the final schema.
   */
  generate(
    targetUrl: string,
    startTime: Date,
    pages: string[],
    states: UIState[],
    accessibility: AccessibilityIssue[],
    visualIssues: VisualIssue[],
    brokenLinks: BrokenLink[],
    defects: AIDefect[]
  ): CrawlReport {
    const endTime = new Date();
    const durationMs = endTime.getTime() - startTime.getTime();
    
    return {
      crawlSummary: {
        targetUrl,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        durationMs,
        pagesCrawled: pages.length,
        statesExplored: states.length,
        defectsFound: defects.length
      },
      pages,
      states,
      accessibility,
      visualIssues,
      brokenLinks,
      defects
    };
  }

  /**
   * Translates raw issues (layout, DOM, accessibility) into AIDefects.
   */
  classifyRawFindings(
    accessibility: AccessibilityIssue[],
    visualIssues: VisualIssue[],
    brokenLinks: BrokenLink[],
    pages: string[]
  ): AIDefect[] {
    const defects: AIDefect[] = [];

    // Classify Accessibility violations
    accessibility.forEach((issue, idx) => {
      // Accessibility issues are usually High/Medium severity
      const severity = issue.severity === 'critical' ? 'Critical' : issue.severity === 'serious' ? 'High' : 'Medium';
      
      defects.push({
        id: `def-acc-${idx + 1}`,
        type: 'accessibility',
        severity,
        issue: `Accessibility Violation: ${issue.description}`,
        pageUrl: pages[0] || '/', // Assume main page or find match
        rootCause: `Element '${issue.element}' failed rule '${issue.rule}'.`,
        reproductionSteps: `1. Open page.\n2. Locate element: '${issue.element}'.\n3. Perform accessibility audit using Axe Core.`,
        fixSuggestion: `Refer to Axe guidelines: ${issue.helpUrl || 'https://dequeuniversity.com/rules/axe'}`
      });
    });

    // Classify Visual regressions
    visualIssues.forEach((issue, idx) => {
      defects.push({
        id: `def-vis-${idx + 1}`,
        type: 'visual',
        severity: issue.issueType === 'layout_shift' ? 'High' : 'Medium',
        issue: `Visual Regression: ${issue.description}`,
        pageUrl: issue.pageUrl,
        rootCause: `Viewport '${issue.viewport}' rendering mismatch on element '${issue.elementSelector}'. Difference ratio is ${issue.differencePercentage}%.`,
        reproductionSteps: `1. Navigate to: '${issue.pageUrl}'.\n2. Resize viewport to ${issue.viewport} size.\n3. Compare rendering against baseline snapshot.`,
        fixSuggestion: `Verify CSS layout rules for element '${issue.elementSelector}' under media queries matching '${issue.viewport}'.`
      });
    });

    // Classify Broken Links
    brokenLinks.forEach((link, idx) => {
      defects.push({
        id: `def-link-${idx + 1}`,
        type: 'navigation',
        severity: 'High',
        issue: `Broken Navigation Path: Link to '${link.url}' returned Status ${link.statusCode}.`,
        pageUrl: link.parentUrl,
        rootCause: `Server returned non-200 code (${link.statusCode}) when resolving target link.`,
        reproductionSteps: `1. Navigate to: '${link.parentUrl}'.\n2. Find anchor tag linking to: '${link.url}'.\n3. Click link.`,
        fixSuggestion: `Ensure route '${link.url}' is properly configured, or update href to a valid destination.`
      });
    });

    return defects;
  }
}
