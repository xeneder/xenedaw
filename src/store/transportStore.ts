import { create } from 'zustand';

interface TransportStore {
  isPlaying: boolean;
  isPaused: boolean;
  isRecording: boolean;
  currentTime: number; // in seconds
  currentBar: number;
  bpm: number;
  timeSignature: [number, number];
  loop: {
    enabled: boolean;
    start: number; // in bars
    end: number; // in bars
  };
  metronomeEnabled: boolean;

  // Actions
  play: () => void;
  pause: () => void;
  stop: () => void;
  togglePlay: () => void;
  setBPM: (bpm: number) => void;
  setTimeSignature: (signature: [number, number]) => void;
  setCurrentTime: (time: number) => void;
  setCurrentBar: (bar: number) => void;
  toggleLoop: () => void;
  setLoopStart: (start: number) => void;
  setLoopEnd: (end: number) => void;
  toggleMetronome: () => void;
}

export const useTransportStore = create<TransportStore>((set) => ({
  isPlaying: false,
  isPaused: false,
  isRecording: false,
  currentTime: 0,
  currentBar: 0,
  bpm: 120,
  timeSignature: [4, 4],
  loop: {
    enabled: false,
    start: 0,
    end: 4,
  },
  metronomeEnabled: false,

  play: () =>
    set({
      isPlaying: true,
      isPaused: false,
    }),

  pause: () =>
    set({
      isPlaying: false,
      isPaused: true,
    }),

  stop: () =>
    set({
      isPlaying: false,
      isPaused: false,
      currentTime: 0,
      currentBar: 0,
    }),

  togglePlay: () =>
    set((state) => ({
      isPlaying: !state.isPlaying,
      isPaused: state.isPlaying ? true : false,
    })),

  setBPM: (bpm) => set({ bpm }),

  setTimeSignature: (signature) => set({ timeSignature: signature }),

  setCurrentTime: (time) => set({ currentTime: time }),

  setCurrentBar: (bar) => set({ currentBar: bar }),

  toggleLoop: () =>
    set((state) => ({
      loop: { ...state.loop, enabled: !state.loop.enabled },
    })),

  setLoopStart: (start) =>
    set((state) => ({
      loop: { ...state.loop, start },
    })),

  setLoopEnd: (end) =>
    set((state) => ({
      loop: { ...state.loop, end },
    })),

  toggleMetronome: () =>
    set((state) => ({
      metronomeEnabled: !state.metronomeEnabled,
    })),
}));
