import { create } from 'zustand';

interface SessionState {
  apiKey: string;
  model: string;
  targetUrl: string;
  username: string;
  password: string; // Held in memory only
  demoMode: boolean;
  setApiKey: (key: string) => void;
  setModel: (model: string) => void;
  setCredentials: (url: string, user: string, pass: string) => void;
  setDemoMode: (mode: boolean) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  apiKey: '',
  model: 'llama-3.3-70b-versatile',
  targetUrl: '',
  username: '',
  password: '',
  demoMode: false,
  setApiKey: (apiKey) => set({ apiKey }),
  setModel: (model) => set({ model }),
  setCredentials: (targetUrl, username, password) =>
    set({ targetUrl, username, password }),
  setDemoMode: (demoMode) => set({ demoMode }),
  clearSession: () =>
    set({ apiKey: '', targetUrl: '', username: '', password: '', demoMode: false }),
}));
