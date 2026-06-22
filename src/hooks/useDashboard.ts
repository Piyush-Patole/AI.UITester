import { useMemo } from 'react';
import type { TestResult } from '../types/result';

export function useDashboard(results: TestResult[]) {
  const stats = useMemo(() => {
    const total = results.length;
    const passed = results.filter(r => r.estimated_status === 'Pass').length;
    const failed = results.filter(r => r.estimated_status === 'Fail').length;
    const flaky = results.filter(r => r.estimated_status === 'Flaky').length;
    const unknown = results.filter(r => r.estimated_status === 'Unknown').length;

    const critical = results.filter(r => r.severity === 'Critical').length;
    const high = results.filter(r => r.severity === 'High').length;
    const medium = results.filter(r => r.severity === 'Medium').length;
    const low = results.filter(r => r.severity === 'Low').length;

    const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

    const statusData = [
      { name: 'Pass', value: passed, fill: '#34C759' }, // iOS Green
      { name: 'Fail', value: failed, fill: '#FF3B30' }, // iOS Red
      { name: 'Flaky', value: flaky, fill: '#FFCC00' }, // iOS Yellow
      { name: 'Unknown', value: unknown, fill: '#8E8E93' }, // iOS Gray
    ].filter(d => d.value > 0);

    const severityData = [
      { name: 'Critical', value: critical, fill: '#FF3B30' },
      { name: 'High', value: high, fill: '#FF9500' },
      { name: 'Medium', value: medium, fill: '#FFCC00' },
      { name: 'Low', value: low, fill: '#34C759' },
    ];

    const topFailures = results
      .filter(r => r.estimated_status === 'Fail' && r.rca)
      .sort((a, b) => (b.confidence_score || 0) - (a.confidence_score || 0))
      .slice(0, 5);

    return {
      total,
      passed,
      failed,
      flaky,
      passRate,
      statusData,
      severityData,
      topFailures,
    };
  }, [results]);

  return stats;
}
