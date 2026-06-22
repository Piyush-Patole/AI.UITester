import * as XLSX from 'xlsx';
import type { TestResult } from '../types/result';

export function useExport(results: TestResult[]) {

  function flattenResult(r: TestResult): Record<string, string | number> {
    return {
      'Test ID':          r.test_id,
      'Test Name':        r.test_name,
      'Type':             r.test_type,
      'Browser':          r.browser,
      'Status':           r.estimated_status,
      'Severity':         r.severity,
      'Issue':            r.rca?.issue_title ?? '',
      'RCA':              r.rca?.rca ?? '',
      'Reason':           r.rca?.reason ?? '',
      'Fix Suggestion':   r.rca?.fix_suggestion ?? '',
      'Failure Category': r.rca?.failure_category ?? '',
      'Is App Bug':       r.rca?.is_app_bug ? 'Yes' : 'No',
      'Confidence':       `${Math.round((r.confidence_score ?? 0) * 100)}%`,
      'Flakiness':        r.flakiness?.classification ?? '',
      'Flakiness Score':  r.flakiness?.flakiness_score ?? '',
      'Steps Count':      r.steps?.length ?? 0,
      'Original Locator': r.self_heal?.original_locator ?? '',
      'Healed Locator':   r.self_heal?.suggested_locator ?? '',
      'Notes':            r.notes ?? '',
    };
  }

  function downloadCSV() {
    if (results.length === 0) return;
    const rows = results.map(flattenResult);
    const headers = Object.keys(rows[0] ?? {});
    const csv = [
      headers.join(','),
      ...rows.map((row) =>
        headers
          .map((h) => `"${String(row[h] ?? '').replace(/"/g, '""')}"`)
          .join(',')
      ),
    ].join('\n');
    triggerDownload(
      new Blob(['\ufeff' + csv], { type: 'text/csv' }),
      'test_results.csv'
    );
  }

  function downloadXLSX() {
    if (results.length === 0) return;
    const rows = results.map(flattenResult);
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Test Results');
    XLSX.writeFile(wb, 'test_results.xlsx');
  }

  async function copyToClipboard() {
    if (results.length === 0) return;
    const rows = results.map(flattenResult);
    const headers = Object.keys(rows[0] ?? {});
    const tsv = [
      headers.join('\t'),
      ...rows.map((row) => headers.map(h => row[h]).join('\t'))
    ].join('\n');
    await navigator.clipboard.writeText(tsv);
  }

  function triggerDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return { downloadCSV, downloadXLSX, copyToClipboard };
}
