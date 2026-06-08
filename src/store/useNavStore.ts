import { create } from 'zustand';

type NavContext = 'landing' | 'dashboard';

interface NavState {
  context: NavContext;
  setContext: (context: NavContext) => void;
}

export const useNavStore = create<NavState>((set) => ({
  context: 'landing', // Defaults safely to landing view
  setContext: (context) => set({ context }),
}));