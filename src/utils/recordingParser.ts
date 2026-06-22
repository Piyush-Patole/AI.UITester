import type { RecordingStep } from '../types/scenario';

export function parseRecordingJson(json: string): RecordingStep[] {
  try {
    const recording = JSON.parse(json);
    const steps = recording?.steps ?? [];
    return steps.map((s: any) => ({
      type: s.type,
      target: s.selectors?.[0]?.[0] ?? s.target,
      value: s.value,
      url: s.url,
    }));
  } catch (err) {
    throw new Error('Invalid Chrome DevTools Recording JSON format');
  }
}
