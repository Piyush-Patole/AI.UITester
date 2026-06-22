import { useResultStore } from '../store/resultStore';
import { useGroqAnalysis } from './useGroqAnalysis';
import type { TestScenario } from '../types/scenario';

export function useBatchProcessor() {
  const { analyzeScenario } = useGroqAnalysis();
  const { setProcessing, setProgress, addLog, addResult } = useResultStore();

  const processBatch = async (scenarios: TestScenario[], onComplete?: () => void) => {
    if (scenarios.length === 0) return;
    
    setProcessing(true);
    setProgress(0, scenarios.length);
    addLog(`Starting batch analysis for ${scenarios.length} scenarios...`);

    for (let i = 0; i < scenarios.length; i++) {
      const scenario = scenarios[i];
      setProgress(i + 1, scenarios.length);
      addLog(`Analyzing scenario ${i + 1} of ${scenarios.length}: "${scenario.description.substring(0, 50)}..."`);
      
      try {
        const result = await analyzeScenario(scenario);
        addResult(result);
        addLog(`Completed scenario ${i + 1}`);
        
        // Wait 2 seconds between requests to avoid bursting the Groq API rate limits
        if (i < scenarios.length - 1) {
          await new Promise(r => setTimeout(r, 2000));
        }
      } catch (error) {
        console.error(error);
        addLog(`Failed scenario ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        addResult({
          test_id: `ERR-${Date.now()}`,
          test_name: scenario.description.substring(0, 30) + '...',
          test_type: scenario.test_type,
          browser: scenario.browser,
          severity: 'Critical',
          estimated_status: 'Unknown',
          steps: [],
          assertions: [],
          playwright_code: '',
          confidence_score: 0,
          processing_status: 'error',
          notes: error instanceof Error ? error.message : 'Analysis failed',
        });
      }
    }

    setProcessing(false);
    addLog('Batch processing complete.');
    onComplete?.();
  };

  return { processBatch };
}
