import { create } from 'zustand';
import type { Track } from '@/types';
import { nanoid } from 'nanoid';
import { getTrackColorByIndex, DEFAULT_ENVELOPE, DEFAULT_TRACK_VOLUME } from '@/constants';

interface TrackStore {
  tracks: Track[];
  addTrack: (track?: Partial<Track>) => void;
  removeTrack: (id: string) => void;
  updateTrack: (id: string, updates: Partial<Track>) => void;
  reorderTracks: (from: number, to: number) => void;
  setTracks: (tracks: Track[]) => void;
  getTrackById: (id: string) => Track | undefined;
}

const createDefaultTrack = (index: number): Track => ({
  id: nanoid(),
  name: `Track ${index + 1}`,
  type: 'midi',
  instrument: {
    type: 'synth',
    waveform: 'sine',
    envelope: DEFAULT_ENVELOPE,
    detune: 0,
  },
  patterns: [],
  volume: DEFAULT_TRACK_VOLUME,
  pan: 0,
  mute: false,
  solo: false,
  effects: [],
  color: getTrackColorByIndex(index),
  automations: [],
});

export const useTrackStore = create<TrackStore>((set, get) => ({
  tracks: [],

  addTrack: (trackData) =>
    set((state) => {
      const newTrack = {
        ...createDefaultTrack(state.tracks.length),
        ...trackData,
      };
      return { tracks: [...state.tracks, newTrack] };
    }),

  removeTrack: (id) =>
    set((state) => ({
      tracks: state.tracks.filter((track) => track.id !== id),
    })),

  updateTrack: (id, updates) =>
    set((state) => ({
      tracks: state.tracks.map((track) =>
        track.id === id ? { ...track, ...updates } : track
      ),
    })),

  reorderTracks: (from, to) =>
    set((state) => {
      const tracks = [...state.tracks];
      const [removed] = tracks.splice(from, 1);
      if (removed) {
        tracks.splice(to, 0, removed);
      }
      return { tracks };
    }),

  setTracks: (tracks) => set({ tracks }),

  getTrackById: (id) => {
    return get().tracks.find((track) => track.id === id);
  },
}));
