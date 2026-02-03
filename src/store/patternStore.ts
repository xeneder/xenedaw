import { create } from 'zustand';
import type { Pattern, Note } from '@/types';
import { nanoid } from 'nanoid';

interface PatternStore {
  addPattern: (trackId: string, startTime: number, duration?: number) => Pattern;
  removePattern: (trackId: string, patternId: string) => void;
  updatePattern: (trackId: string, patternId: string, updates: Partial<Pattern>) => void;
  duplicatePattern: (trackId: string, patternId: string) => Pattern | null;

  // Note management
  addNote: (patternId: string, note: Omit<Note, 'id'>) => Note;
  removeNote: (patternId: string, noteId: string) => void;
  updateNote: (patternId: string, noteId: string, updates: Partial<Note>) => void;
  removeNotes: (patternId: string, noteIds: string[]) => void;

  // Pattern operations
  splitPattern: (trackId: string, patternId: string, time: number) => void;
}

export const usePatternStore = create<PatternStore>(() => ({
  addPattern: (trackId: string, startTime: number, duration: number = 4): Pattern => {
    const pattern: Pattern = {
      id: nanoid(),
      trackId,
      name: `Pattern ${Date.now()}`,
      startTime,
      duration,
      notes: [],
    };
    return pattern;
  },

  removePattern: (trackId: string, patternId: string) => {
    // This should be handled by track store
    console.log('Remove pattern:', trackId, patternId);
  },

  updatePattern: (trackId: string, patternId: string, updates: Partial<Pattern>) => {
    console.log('Update pattern:', trackId, patternId, updates);
  },

  duplicatePattern: (trackId: string, patternId: string): Pattern | null => {
    console.log('Duplicate pattern:', trackId, patternId);
    return null;
  },

  addNote: (patternId: string, note: Omit<Note, 'id'>): Note => {
    const newNote: Note = {
      id: nanoid(),
      ...note,
    };
    return newNote;
  },

  removeNote: (patternId: string, noteId: string) => {
    console.log('Remove note:', patternId, noteId);
  },

  updateNote: (patternId: string, noteId: string, updates: Partial<Note>) => {
    console.log('Update note:', patternId, noteId, updates);
  },

  removeNotes: (patternId: string, noteIds: string[]) => {
    console.log('Remove notes:', patternId, noteIds);
  },

  splitPattern: (trackId: string, patternId: string, time: number) => {
    console.log('Split pattern:', trackId, patternId, time);
  },
}));
