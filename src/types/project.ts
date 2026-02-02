import type { Track } from './track';
import type { Effect } from './effect';

export interface Project {
  id: string;
  name: string;
  bpm: number;
  timeSignature: [number, number];
  tracks: Track[];
  masterVolume: number;
  masterEffects: Effect[];
  createdAt: Date;
  updatedAt: Date;
  version: string;
}

export interface Transport {
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
}
