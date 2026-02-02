// Audio constants

export const SAMPLE_RATE = 44100;

export const DEFAULT_BPM = 120;
export const MIN_BPM = 40;
export const MAX_BPM = 300;

export const DEFAULT_TIME_SIGNATURE: [number, number] = [4, 4];

export const SUPPORTED_TIME_SIGNATURES: Array<[number, number]> = [
  [3, 4],
  [4, 4],
  [5, 4],
  [6, 8],
  [7, 8],
];

export const DEFAULT_MASTER_VOLUME = 0.8;
export const DEFAULT_TRACK_VOLUME = 0.8;

// Grid divisions for piano roll and timeline
export const GRID_DIVISIONS = ['1/4', '1/8', '1/16', '1/32'] as const;
export type GridDivision = (typeof GRID_DIVISIONS)[number];

// MIDI note range
export const MIN_MIDI_NOTE = 0; // C-1
export const MAX_MIDI_NOTE = 127; // G9
export const MIDDLE_C = 60; // C4

// Default ADSR envelope
export const DEFAULT_ENVELOPE = {
  attack: 0.005,
  decay: 0.1,
  sustain: 0.3,
  release: 1,
};

// Maximum limits
export const MAX_TRACKS = 32;
export const MAX_PATTERNS_PER_TRACK = 100;
export const MAX_NOTES_PER_PATTERN = 1000;
export const MAX_PROJECT_LENGTH_BARS = 500;
