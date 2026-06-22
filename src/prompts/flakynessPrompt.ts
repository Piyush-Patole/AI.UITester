import type { GroqMessage } from '../api/groqClient';

export function buildFlakinessPrompt(testName: string, runHistory: string[]): GroqMessage[] {
  return [
    {
      role: 'system',
      content: `You are a CI reliability engineer. Classify tests as flaky or stable based on run history.
Respond ONLY with:
{ "test_name": "string", "classification": "Flaky | Stable", "flakiness_score": 0.0, "reason": "string" }
Flaky = more than 30% inconsistent failures with no pattern. Score 0.0=stable, 1.0=extremely flaky.`
    },
    {
      role: 'user',
      content: `Test: ${testName}
Last ${runHistory.length} runs (most recent first): ${runHistory.join(', ')}`
    }
  ];
}
