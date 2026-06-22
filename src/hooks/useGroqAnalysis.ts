import { GroqService } from '../api/groqService';
import { useSessionStore } from '../store/sessionStore';
import type { TestScenario } from '../types/scenario';
import type { TestResult } from '../types/result';

const generateMockTestResult = (scenario: TestScenario): TestResult => {
  const desc = scenario.description.toLowerCase();
  
  let test_name = 'User Login Flow';
  let estimated_status: 'Pass' | 'Fail' | 'Flaky' | 'Unknown' = 'Pass';
  let severity: 'Critical' | 'High' | 'Medium' | 'Low' = 'High';
  let steps = [
    { step_number: 1, action: 'navigate', target: 'https://demo.testapp.com/login', locator_strategy: 'url', description: 'Navigate to login portal' },
    { step_number: 2, action: 'type', target: 'input[name="username"]', value: 'demouser', locator_strategy: 'css', description: 'Enter username' },
    { step_number: 3, action: 'type', target: 'input[type="password"]', value: 'password123', locator_strategy: 'css', description: 'Enter password' },
    { step_number: 4, action: 'click', target: 'button[type="submit"]', locator_strategy: 'css', description: 'Click Login button' }
  ];
  let assertions = [
    { type: 'url_contains', selector: '', expected_value: '/dashboard' },
    { type: 'visible', selector: 'div.welcome-message', expected_value: 'true' }
  ];
  let playwright_code = `import { test, expect } from '@playwright/test';\n\ntest('User Login Flow', async ({ page }) => {\n  await page.goto('https://demo.testapp.com/login');\n  await page.fill('input[name="username"]', 'demouser');\n  await page.fill('input[type="password"]', 'password123');\n  await page.click('button[type="submit"]');\n  await expect(page).toHaveURL(/.*dashboard/);\n});`;
  let notes = 'Authenticates successfully with valid credentials.';

  if (desc.includes('fail') || desc.includes('invalid') || desc.includes('error')) {
    test_name = 'Login Failure Handling';
    estimated_status = 'Fail';
    severity = 'Medium';
    steps = [
      { step_number: 1, action: 'navigate', target: 'https://demo.testapp.com/login', locator_strategy: 'url', description: 'Navigate to login portal' },
      { step_number: 2, action: 'type', target: 'input[name="username"]', value: 'demouser', locator_strategy: 'css', description: 'Enter username' },
      { step_number: 3, action: 'type', target: 'input[type="password"]', value: 'wrongpassword', locator_strategy: 'css', description: 'Enter incorrect password' },
      { step_number: 4, action: 'click', target: 'button[type="submit"]', locator_strategy: 'css', description: 'Click Login button' }
    ];
    assertions = [
      { type: 'visible', selector: '.error-banner', expected_value: 'true' },
      { type: 'text_equals', selector: '.error-message', expected_value: 'Invalid credentials' }
    ];
    playwright_code = `import { test, expect } from '@playwright/test';\n\ntest('Login Failure Handling', async ({ page }) => {\n  await page.goto('https://demo.testapp.com/login');\n  await page.fill('input[name="username"]', 'demouser');\n  await page.fill('input[type="password"]', 'wrongpassword');\n  await page.click('button[type="submit"]');\n  await expect(page.locator('.error-message')).toHaveText('Invalid credentials');\n});`;
    notes = 'Login fails as expected, but locator .error-message was slow to render.';
  } else if (desc.includes('accessibility') || desc.includes('wcag') || desc.includes('compliance')) {
    test_name = 'WCAG Accessibility Scan';
    estimated_status = 'Flaky';
    severity = 'Low';
    steps = [
      { step_number: 1, action: 'navigate', target: 'https://demo.testapp.com/dashboard', locator_strategy: 'url', description: 'Navigate to dashboard' }
    ];
    assertions = [
      { type: 'wcag_compliance', selector: 'body', expected_value: 'pass' }
    ];
    playwright_code = `import { test, expect } from '@playwright/test';\nimport AxeBuilder from '@axe-core/playwright';\n\ntest('WCAG Accessibility Scan', async ({ page }) => {\n  await page.goto('https://demo.testapp.com/dashboard');\n  const results = await new AxeBuilder({ page }).analyze();\n  expect(results.violations).toEqual([]);\n});`;
    notes = 'Color contrast violation found on dashboard widgets, making the test flaky depending on themes.';
  } else if (desc.includes('landing') || desc.includes('main page')) {
    test_name = 'Main Landing Page Layout';
    estimated_status = 'Pass';
    severity = 'High';
    steps = [
      { step_number: 1, action: 'navigate', target: 'https://demo.testapp.com/', locator_strategy: 'url', description: 'Navigate to landing page' }
    ];
    assertions = [
      { type: 'visible', selector: 'h1.hero-title', expected_value: 'true' },
      { type: 'visible', selector: 'a#cta-button', expected_value: 'true' }
    ];
    playwright_code = `import { test, expect } from '@playwright/test';\n\ntest('Main Landing Page Layout', async ({ page }) => {\n  await page.goto('https://demo.testapp.com/');\n  await expect(page.locator('h1.hero-title')).toBeVisible();\n  await expect(page.locator('a#cta-button')).toBeVisible();\n});`;
    notes = 'Landing page layout renders successfully on all major viewports.';
  }

  const result: TestResult = {
    test_id: scenario.id || `MOCK-${Date.now()}`,
    test_name,
    test_type: scenario.test_type,
    browser: scenario.browser,
    severity,
    estimated_status,
    steps,
    assertions,
    playwright_code,
    confidence_score: 95,
    notes,
    processing_status: 'success'
  };

  if (estimated_status === 'Fail') {
    result.rca = {
      issue_title: 'Login Error Banner Locator Missing',
      rca: 'The test failed because the selector ".error-message" was not found on the page within the 5000ms timeout.',
      reason: 'The frontend app dynamic class generator loaded class ".err-msg-active-321" instead of the expected static ".error-message" element class.',
      fix_suggestion: 'Modify the locator selector in the test plan to target "[data-testid=\'error-text\']" or a static element attribute to ensure CSS class changes do not break the tests.',
      failure_category: 'selector_issue',
      confidence: 90,
      is_app_bug: false,
      severity: 'Medium'
    };
    result.self_heal = {
      original_locator: '.error-message',
      suggested_locator: 'text="Invalid credentials"',
      locator_type: 'text_selector',
      stability_reason: 'Text-based selector is more robust to dynamic Tailwind css class shifts.',
      confidence: 88
    };
  }

  if (estimated_status === 'Flaky') {
    result.flakiness = {
      test_name,
      classification: 'Flaky',
      flakiness_score: 65,
      reason: 'Axe-core scan results deviate depending on whether the dashboard dark theme or light theme loads during page navigation.'
    };
  }

  return result;
};

export function useGroqAnalysis() {
  const { apiKey, model, demoMode } = useSessionStore();

  const analyzeScenario = async (scenario: TestScenario): Promise<TestResult> => {
    if (demoMode || !apiKey) {
      // Return high-fidelity mock results for demo mode
      await new Promise(r => setTimeout(r, 800)); // Simulate networking
      return generateMockTestResult(scenario);
    }
    
    const service = new GroqService(apiKey, model);
    
    // 1. Generate Test Plan
    const testPlan = await service.generateTestPlan(scenario);
    
    // Default result structure
    let result: TestResult = {
      ...testPlan,
      processing_status: 'success',
    };

    // 2. Simulated additional analysis based on status or type
    if (result.estimated_status === 'Fail') {
      try {
        const failureDesc = result.notes || 'Simulated failure for RCA analysis';
        const rca = await service.analyzeRCA(scenario, failureDesc);
        result.rca = rca;
        
        // If it's a locator issue, simulate self-healing
        if (rca.failure_category === 'selector_issue' && result.steps.length > 0) {
          const brokenLocator = result.steps.find(s => s.action.includes('click') || s.action.includes('fill'))?.target || 'unknown';
          const htmlContext = '<div class="login-wrapper"><input name="username" class="dynamic-class-123" /></div>';
          const heal = await service.suggestSelfHeal(brokenLocator, htmlContext);
          result.self_heal = heal;
        }
      } catch (e) {
        console.error('RCA failed', e);
      }
    }
    
    if (result.estimated_status === 'Flaky') {
      try {
        const flakiness = await service.classifyFlakiness(result.test_name, ['Fail', 'Pass', 'Fail', 'Pass']);
        result.flakiness = flakiness;
      } catch (e) {
        console.error('Flakiness analysis failed', e);
      }
    }

    return result;
  };

  return { analyzeScenario };
}
