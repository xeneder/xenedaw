import { create } from 'zustand';

interface UIStore {
  // Selection
  selectedTrackId: string | null;
  selectedPatternId: string | null;

  // Views
  pianoRollOpen: boolean;
  mixerVisible: boolean;

  // Timeline
  zoom: number; // 0.1 - 2.0
  scrollPosition: number; // pixels
  snapToGrid: boolean;
  gridDivision: '1/4' | '1/8' | '1/16' | '1/32';

  // Theme
  theme: 'light' | 'dark';

  // Actions
  setSelectedTrack: (id: string | null) => void;
  setSelectedPattern: (id: string | null) => void;
  togglePianoRoll: () => void;
  openPianoRoll: (patternId: string) => void;
  closePianoRoll: () => void;
  toggleMixer: () => void;
  setZoom: (zoom: number) => void;
  setScrollPosition: (position: number) => void;
  toggleSnapToGrid: () => void;
  setGridDivision: (division: '1/4' | '1/8' | '1/16' | '1/32') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  selectedTrackId: null,
  selectedPatternId: null,
  pianoRollOpen: false,
  mixerVisible: false,
  zoom: 1.0,
  scrollPosition: 0,
  snapToGrid: true,
  gridDivision: '1/16',
  theme: 'dark',

  setSelectedTrack: (id) => set({ selectedTrackId: id }),

  setSelectedPattern: (id) => set({ selectedPatternId: id }),

  togglePianoRoll: () =>
    set((state) => ({ pianoRollOpen: !state.pianoRollOpen })),

  openPianoRoll: (patternId) =>
    set({
      pianoRollOpen: true,
      selectedPatternId: patternId,
    }),

  closePianoRoll: () =>
    set({
      pianoRollOpen: false,
      selectedPatternId: null,
    }),

  toggleMixer: () => set((state) => ({ mixerVisible: !state.mixerVisible })),

  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(2.0, zoom)) }),

  setScrollPosition: (position) => set({ scrollPosition: position }),

  toggleSnapToGrid: () => set((state) => ({ snapToGrid: !state.snapToGrid })),

  setGridDivision: (division) => set({ gridDivision: division }),

  setTheme: (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    set({ theme });
  },

  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      return { theme: newTheme };
    }),
}));
