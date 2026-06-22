import type { GroqMessage } from '../api/groqClient';

export function buildTestDataPrompt(formDescription: string): GroqMessage[] {
  return [
    {
      role: 'system',
      content: `You are a QA test data specialist. Generate realistic test data for form testing.
Respond ONLY with JSON:
{
  "valid_inputs": [ { "field": "value" } ],
  "invalid_inputs": [ { "field": "value", "expected_error": "string" } ],
  "edge_cases": [ { "field": "value", "description": "string" } ]
}`
    },
    {
      role: 'user',
      content: `Form description: ${formDescription}`
    }
  ];
}
