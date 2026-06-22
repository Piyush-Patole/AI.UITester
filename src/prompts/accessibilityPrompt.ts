import type { GroqMessage } from '../api/groqClient';

export function buildAccessibilityPrompt(pageDescription: string): GroqMessage[] {
  return [
    {
      role: 'system',
      content: `You are a WCAG 2.1 accessibility specialist. 
Analyze a page description and predict likely accessibility issues.
Respond ONLY with:
{
  "issues": [
    {
      "wcag_criterion": "e.g. 1.1.1",
      "level": "A | AA | AAA",
      "element": "affected element description",
      "issue": "description of the problem",
      "fix": "recommended fix",
      "severity": "Critical | Serious | Moderate | Minor"
    }
  ],
  "overall_score": 0-100,
  "summary": "1-2 sentence summary"
}`
    },
    {
      role: 'user',
      content: `Page / component description: ${pageDescription}`
    }
  ];
}
