import type { GroqMessage } from '../api/groqClient';
import type { TestScenario } from '../types/scenario';

export function buildTestGenerationPrompt(scenario: TestScenario): GroqMessage[] {
  return [
    {
      role: 'system',
      content: `You are an expert QA automation engineer specializing in Playwright (TypeScript).
Generate complete, production-ready test plans from scenario descriptions.
Always respond with ONLY a valid JSON object matching this exact schema — no markdown, no explanation:

{
  "test_id": "string (e.g. TC-001)",
  "test_name": "string",
  "test_type": "functional | accessibility | visual | performance",
  "browser": "chromium | firefox | webkit",
  "severity": "Critical | High | Medium | Low",
  "estimated_status": "Pass | Fail | Flaky | Unknown",
  "steps": [
    {
      "step_number": 1,
      "action": "navigate | click | fill | assert | wait | hover | screenshot",
      "target": "CSS selector or URL",
      "value": "optional input value or expected text",
      "locator_strategy": "data-testid | aria-label | id | text | css | xpath",
      "fallback_locator": "alternative selector if primary fails",
      "description": "human-readable step description"
    }
  ],
  "assertions": [
    {
      "type": "visibility | text | url | attribute | count",
      "selector": "string",
      "expected_value": "string"
    }
  ],
  "playwright_code": "complete Playwright TypeScript test block as a string",
  "confidence_score": 0.85,
  "notes": "any caveats or special handling needed"
}

Selector priority: prefer data-testid > aria-label > id > name > text > CSS class > XPath (last resort).
Never use auto-generated dynamic class names or index-based selectors.`
    },
    {
      role: 'user',
      content: `Generate a test plan for this scenario:

Target URL: ${scenario.url || 'Not specified'}
Test Type: ${scenario.test_type}
Browser: ${scenario.browser}
Description: ${scenario.description}
${scenario.credentials ? `Credentials: username="${scenario.credentials.username}" (password masked)` : ''}
${scenario.har_context ? `HAR Context (flows extracted):\n${scenario.har_context}` : ''}
${scenario.recording_steps ? `Recorded Steps:\n${JSON.stringify(scenario.recording_steps, null, 2)}` : ''}`
    }
  ];
}
