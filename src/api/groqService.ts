import { callGroq } from './groqClient';
import { buildTestGenerationPrompt } from '../prompts/testGenerationPrompt';
import { buildRCAPrompt } from '../prompts/rcaAnalysisPrompt';
import { buildSelfHealPrompt } from '../prompts/selfHealPrompt';
import { buildFlakinessPrompt } from '../prompts/flakynessPrompt';
import { buildTestDataPrompt } from '../prompts/testDataPrompt';
import { buildAccessibilityPrompt } from '../prompts/accessibilityPrompt';
import type {
  TestScenario,
} from '../types/scenario';
import type {
  GeneratedTestPlan, RCAResult,
  SelfHealResult, FlakinessResult
} from '../types/result';

const DEFAULT_MODEL = 'llama-3.3-70b-versatile';

export class GroqService {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model = DEFAULT_MODEL) {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generateTestPlan(scenario: TestScenario): Promise<GeneratedTestPlan> {
    const messages = buildTestGenerationPrompt(scenario);
    const raw = await callGroq(this.apiKey, {
      model: this.model,
      messages,
      temperature: 0.1,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    });
    return this.safeParse<GeneratedTestPlan>(raw, 'generateTestPlan');
  }

  async analyzeRCA(scenario: TestScenario, failureDescription: string): Promise<RCAResult> {
    const messages = buildRCAPrompt(scenario, failureDescription);
    const raw = await callGroq(this.apiKey, {
      model: this.model,
      messages,
      temperature: 0.2,
      max_tokens: 800,
      response_format: { type: 'json_object' },
    });
    return this.safeParse<RCAResult>(raw, 'analyzeRCA');
  }

  async suggestSelfHeal(brokenLocator: string, htmlContext: string): Promise<SelfHealResult> {
    const messages = buildSelfHealPrompt(brokenLocator, htmlContext);
    const raw = await callGroq(this.apiKey, {
      model: this.model,
      messages,
      temperature: 0.0,
      max_tokens: 200,
      response_format: { type: 'json_object' },
    });
    return this.safeParse<SelfHealResult>(raw, 'suggestSelfHeal');
  }

  async classifyFlakiness(testName: string, runHistory: string[]): Promise<FlakinessResult> {
    const messages = buildFlakinessPrompt(testName, runHistory);
    const raw = await callGroq(this.apiKey, {
      model: this.model,
      messages,
      temperature: 0.0,
      max_tokens: 200,
      response_format: { type: 'json_object' },
    });
    return this.safeParse<FlakinessResult>(raw, 'classifyFlakiness');
  }

  async generateTestData(formDescription: string): Promise<Record<string, string[]>> {
    const messages = buildTestDataPrompt(formDescription);
    const raw = await callGroq(this.apiKey, {
      model: this.model,
      messages,
      temperature: 0.4,
      max_tokens: 800,
      response_format: { type: 'json_object' },
    });
    return this.safeParse(raw, 'generateTestData');
  }

  async analyzeAccessibility(pageDescription: string): Promise<Record<string, unknown>> {
    const messages = buildAccessibilityPrompt(pageDescription);
    const raw = await callGroq(this.apiKey, {
      model: this.model,
      messages,
      temperature: 0.1,
      max_tokens: 1200,
      response_format: { type: 'json_object' },
    });
    return this.safeParse(raw, 'analyzeAccessibility');
  }

  private safeParse<T>(raw: string, caller: string): T {
    try {
      return JSON.parse(raw) as T;
    } catch {
      throw new Error(`${caller}: Groq returned invalid JSON — ${raw.substring(0, 200)}`);
    }
  }
}
