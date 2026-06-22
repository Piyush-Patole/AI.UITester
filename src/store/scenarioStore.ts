import { create } from 'zustand';
import type { TestScenario } from '../types/scenario';

interface ScenarioState {
  scenarios: TestScenario[];
  addScenario: (s: TestScenario) => void;
  removeScenario: (id: string) => void;
  updateScenario: (id: string, updates: Partial<TestScenario>) => void;
  clearAll: () => void;
}

export const useScenarioStore = create<ScenarioState>((set) => ({
  scenarios: [],
  addScenario: (s) =>
    set((state) => ({ scenarios: [...state.scenarios, s] })),
  removeScenario: (id) =>
    set((state) => ({ scenarios: state.scenarios.filter((s) => s.id !== id) })),
  updateScenario: (id, updates) =>
    set((state) => ({
      scenarios: state.scenarios.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    })),
  clearAll: () => set({ scenarios: [] }),
}));
