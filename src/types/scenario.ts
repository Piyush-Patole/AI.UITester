export type TestType = 'functional' | 'accessibility' | 'visual' | 'performance';
export type BrowserTarget = 'chromium' | 'firefox' | 'webkit';

export interface RecordingStep {
  type: string;
  target?: string;
  value?: string;
  url?: string;
}

export interface TestScenario {
  id: string;
  description: string;
  test_type: TestType;
  browser: BrowserTarget;
  url?: string;
  credentials?: { username: string; password: string };
  har_context?: string;
  recording_steps?: RecordingStep[];
}
