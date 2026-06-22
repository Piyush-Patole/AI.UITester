import { create } from 'zustand';
import type { TestResult } from '../types/result';

interface ResultState {
  results: TestResult[];
  isProcessing: boolean;
  progress: { current: number; total: number };
  log: string[];
  addResult: (r: TestResult) => void;
  updateResult: (id: string, updates: Partial<TestResult>) => void;
  setProcessing: (v: boolean) => void;
  setProgress: (current: number, total: number) => void;
  addLog: (msg: string) => void;
  reset: () => void;
}

export const useResultStore = create<ResultState>((set) => ({
  results: [],
  isProcessing: false,
  progress: { current: 0, total: 0 },
  log: [],
  addResult: (r) =>
    set((state) => ({ results: [...state.results, r] })),
  updateResult: (id, updates) =>
    set((state) => ({
      results: state.results.map((r) =>
        r.test_id === id ? { ...r, ...updates } : r
      ),
    })),
  setProcessing: (isProcessing) => set({ isProcessing }),
  setProgress: (current, total) => set({ progress: { current, total } }),
  addLog: (msg) =>
    set((state) => ({
      log: [
        `${new Date().toLocaleTimeString()} → ${msg}`,
        ...state.log,
      ].slice(0, 100),
    })),
  reset: () =>
    set({
      results: [],
      isProcessing: false,
      progress: { current: 0, total: 0 },
      log: [],
    }),
}));
