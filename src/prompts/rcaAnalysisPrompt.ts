import type { GroqMessage } from '../api/groqClient';
import type { TestScenario } from '../types/scenario';

export function buildRCAPrompt(scenario: TestScenario, failure: string): GroqMessage[] {
  return [
    {
      role: 'system',
      content: `You are a senior QA triage engineer. Analyze test failures and provide root cause analysis.
Respond ONLY with this JSON schema:

{
  "issue_title": "short failure title (max 80 chars)",
  "rca": "detailed root cause analysis (2-4 sentences)",
  "reason": "why this failure occurred in business context (1-2 sentences)",
  "fix_suggestion": "specific actionable fix for the test or the app",
  "failure_category": "selector_issue | timing | auth | network | logic | visual | data | unknown",
  "confidence": 0.85,
  "is_app_bug": true,
  "severity": "Critical | High | Medium | Low"
}`
    },
    {
      role: 'user',
      content: `Test scenario: ${scenario.description}
Failure description: ${failure}
URL: ${scenario.url || 'unknown'}`
    }
  ];
}
