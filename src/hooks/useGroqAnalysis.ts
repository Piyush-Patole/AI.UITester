import { GroqService } from '../api/groqService';
import { useSessionStore } from '../store/sessionStore';
import type { TestScenario } from '../types/scenario';
import type { TestResult } from '../types/result';

export function useGroqAnalysis() {
  const { apiKey, model } = useSessionStore();

  const analyzeScenario = async (scenario: TestScenario): Promise<TestResult> => {
    if (!apiKey) throw new Error('API Key is missing');
    
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
