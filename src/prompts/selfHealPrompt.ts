import type { GroqMessage } from '../api/groqClient';

export function buildSelfHealPrompt(brokenLocator: string, htmlContext: string): GroqMessage[] {
  return [
    {
      role: 'system',
      content: `You are a test automation locator specialist. 
Given a broken CSS/XPath selector and HTML context, suggest a stable replacement.
Respond ONLY with this JSON:

{
  "original_locator": "string",
  "suggested_locator": "string",
  "locator_type": "css | xpath | aria | text",
  "stability_reason": "why this locator is more stable",
  "confidence": 0.9
}

Rules: prefer data-testid > aria-label > id > name. Never use nth-child or auto-generated class names.`
    },
    {
      role: 'user',
      content: `Broken selector: ${brokenLocator}
HTML context (relevant section):
${htmlContext.substring(0, 2000)}`
    }
  ];
}
