export type TestStatus = 'Pass' | 'Fail' | 'Flaky' | 'Unknown';
export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low';
export type ProcessingStatus = 'success' | 'error' | 'processing' | 'pending';

export interface TestStep {
  step_number: number;
  action: string;
  target: string;
  value?: string;
  locator_strategy: string;
  fallback_locator?: string;
  description: string;
}

export interface TestAssertion {
  type: string;
  selector: string;
  expected_value: string;
}

export interface GeneratedTestPlan {
  test_id: string;
  test_name: string;
  test_type: string;
  browser: string;
  severity: SeverityLevel;
  estimated_status: TestStatus;
  steps: TestStep[];
  assertions: TestAssertion[];
  playwright_code: string;
  confidence_score: number;
  notes?: string;
}

export interface RCAResult {
  issue_title: string;
  rca: string;
  reason: string;
  fix_suggestion: string;
  failure_category: string;
  confidence: number;
  is_app_bug: boolean;
  severity: SeverityLevel;
}

export interface SelfHealResult {
  original_locator: string;
  suggested_locator: string;
  locator_type: string;
  stability_reason: string;
  confidence: number;
}

export interface FlakinessResult {
  test_name: string;
  classification: 'Flaky' | 'Stable';
  flakiness_score: number;
  reason: string;
}

export interface TestResult extends GeneratedTestPlan {
  processing_status: ProcessingStatus;
  rca?: RCAResult;
  self_heal?: SelfHealResult;
  flakiness?: FlakinessResult;
}
