export interface Pattern {
  id: string;
  trackId: string;
  name: string;
  startTime: number; // in bars
  duration: number; // in bars
  notes: Note[];
  color?: string; // inherited from track
}

export interface Note {
  id: string;
  pitch: number; // MIDI note (0-127)
  time: number; // position within pattern (in beats)
  duration: number; // duration in beats
  velocity: number; // 0-127
}
