import { create } from 'zustand';
import type { Track, Pattern, Note } from '@/types';
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

  // Pattern management
  addPattern: (trackId: string, startTime: number, duration?: number) => Pattern | null;
  removePattern: (trackId: string, patternId: string) => void;
  updatePattern: (trackId: string, patternId: string, updates: Partial<Pattern>) => void;
  duplicatePattern: (trackId: string, patternId: string) => Pattern | null;

  // Note management
  addNote: (trackId: string, patternId: string, note: Omit<Note, 'id'>) => void;
  removeNote: (trackId: string, patternId: string, noteId: string) => void;
  updateNote: (trackId: string, patternId: string, noteId: string, updates: Partial<Note>) => void;
  removeNotes: (trackId: string, patternId: string, noteIds: string[]) => void;
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

  // Pattern management
  addPattern: (trackId, startTime, duration = 4) => {
    const track = get().tracks.find((t) => t.id === trackId);
    if (!track) return null;

    const pattern: Pattern = {
      id: nanoid(),
      trackId,
      name: `Pattern ${track.patterns.length + 1}`,
      startTime,
      duration,
      notes: [],
      color: track.color,
    };

    get().updateTrack(trackId, {
      patterns: [...track.patterns, pattern],
    });

    return pattern;
  },

  removePattern: (trackId, patternId) => {
    const track = get().tracks.find((t) => t.id === trackId);
    if (!track) return;

    get().updateTrack(trackId, {
      patterns: track.patterns.filter((p) => p.id !== patternId),
    });
  },

  updatePattern: (trackId, patternId, updates) => {
    const track = get().tracks.find((t) => t.id === trackId);
    if (!track) return;

    get().updateTrack(trackId, {
      patterns: track.patterns.map((p) =>
        p.id === patternId ? { ...p, ...updates } : p
      ),
    });
  },

  duplicatePattern: (trackId, patternId) => {
    const track = get().tracks.find((t) => t.id === trackId);
    if (!track) return null;

    const pattern = track.patterns.find((p) => p.id === patternId);
    if (!pattern) return null;

    const newPattern: Pattern = {
      ...pattern,
      id: nanoid(),
      name: `${pattern.name} (Copy)`,
      startTime: pattern.startTime + pattern.duration,
      notes: pattern.notes.map((note) => ({
        ...note,
        id: nanoid(),
      })),
    };

    get().updateTrack(trackId, {
      patterns: [...track.patterns, newPattern],
    });

    return newPattern;
  },

  // Note management
  addNote: (trackId, patternId, note) => {
    const track = get().tracks.find((t) => t.id === trackId);
    if (!track) return;

    const pattern = track.patterns.find((p) => p.id === patternId);
    if (!pattern) return;

    const newNote: Note = {
      id: nanoid(),
      ...note,
    };

    get().updatePattern(trackId, patternId, {
      notes: [...pattern.notes, newNote],
    });
  },

  removeNote: (trackId, patternId, noteId) => {
    const track = get().tracks.find((t) => t.id === trackId);
    if (!track) return;

    const pattern = track.patterns.find((p) => p.id === patternId);
    if (!pattern) return;

    get().updatePattern(trackId, patternId, {
      notes: pattern.notes.filter((n) => n.id !== noteId),
    });
  },

  updateNote: (trackId, patternId, noteId, updates) => {
    const track = get().tracks.find((t) => t.id === trackId);
    if (!track) return;

    const pattern = track.patterns.find((p) => p.id === patternId);
    if (!pattern) return;

    get().updatePattern(trackId, patternId, {
      notes: pattern.notes.map((n) =>
        n.id === noteId ? { ...n, ...updates } : n
      ),
    });
  },

  removeNotes: (trackId, patternId, noteIds) => {
    const track = get().tracks.find((t) => t.id === trackId);
    if (!track) return;

    const pattern = track.patterns.find((p) => p.id === patternId);
    if (!pattern) return;

    get().updatePattern(trackId, patternId, {
      notes: pattern.notes.filter((n) => !noteIds.includes(n.id)),
    });
  },
}));
