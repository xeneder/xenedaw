import { create } from 'zustand';
import type { Project } from '@/types';

interface ProjectStore {
  project: Project | null;
  setProject: (project: Project) => void;
  updateProject: (updates: Partial<Project>) => void;
  resetProject: () => void;
  setBPM: (bpm: number) => void;
  setTimeSignature: (timeSignature: [number, number]) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  project: null,

  setProject: (project) => set({ project }),

  updateProject: (updates) =>
    set((state) => ({
      project: state.project
        ? { ...state.project, ...updates, updatedAt: new Date() }
        : null,
    })),

  resetProject: () => set({ project: null }),

  setBPM: (bpm) =>
    set((state) => ({
      project: state.project
        ? { ...state.project, bpm, updatedAt: new Date() }
        : null,
    })),

  setTimeSignature: (timeSignature) =>
    set((state) => ({
      project: state.project
        ? { ...state.project, timeSignature, updatedAt: new Date() }
        : null,
    })),
}));
