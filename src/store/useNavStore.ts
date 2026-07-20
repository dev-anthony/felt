import { create } from 'zustand';

type NavContext = 'landing' | 'dashboard';

interface NavState {
  context: NavContext;
  setContext: (context: NavContext) => void;
  /**
   * Shared auth-modal state. The AuthDialog is rendered once inside Navigation,
   * so any other component (e.g. the landing hero's Get Started button) opens it
   * through here instead of needing its own dialog or prop drilling.
   */
  authOpen: boolean;
  setAuthOpen: (open: boolean) => void;
}

export const useNavStore = create<NavState>((set) => ({
  context: 'landing', // Defaults safely to landing view
  setContext: (context) => set({ context }),
  authOpen: false,
  setAuthOpen: (authOpen) => set({ authOpen }),
}));