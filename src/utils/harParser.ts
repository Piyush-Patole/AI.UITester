export interface HarFlow {
  url: string;
  method: string;
  status: number;
  timing_ms: number;
  request_body?: string;
  response_preview?: string;
}

export function parseHarFile(harJson: string): HarFlow[] {
  try {
    const har = JSON.parse(harJson);
    const entries = har?.log?.entries ?? [];
    return entries
      .filter((e: any) => e.request?.url && !e.request.url.includes('analytics'))
      .map((e: any) => ({
        url: e.request.url,
        method: e.request.method,
        status: e.response.status,
        timing_ms: Math.round(e.time),
        request_body: e.request.postData?.text,
        response_preview: e.response.content?.text?.substring(0, 500),
      }));
  } catch (err) {
    throw new Error('Invalid HAR file format');
  }
}

export function harFlowsToScenarioContext(flows: HarFlow[]): string {
  return flows
    .slice(0, 30) // cap at 30 flows for token budget
    .map(
      (f) =>
        `${f.method} ${f.url} → ${f.status} (${f.timing_ms}ms)` +
        (f.request_body ? `\n  Body: ${f.request_body.substring(0, 200)}` : '')
    )
    .join('\n');
}
