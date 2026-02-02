// Musical scales and keys

export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;
export type Note = (typeof NOTES)[number];

export const SCALE_TYPES = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  harmonicMinor: [0, 2, 3, 5, 7, 8, 11],
  melodicMinor: [0, 2, 3, 5, 7, 9, 11],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  locrian: [0, 1, 3, 5, 6, 8, 10],
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  pentatonicMajor: [0, 2, 4, 7, 9],
  pentatonicMinor: [0, 3, 5, 7, 10],
  blues: [0, 3, 5, 6, 7, 10],
  wholeTone: [0, 2, 4, 6, 8, 10],
} as const;

export type ScaleType = keyof typeof SCALE_TYPES;

export interface Scale {
  root: Note;
  type: ScaleType;
}

export const getScaleNotes = (root: Note, type: ScaleType): number[] => {
  const rootIndex = NOTES.indexOf(root);
  const intervals = SCALE_TYPES[type];
  return intervals.map((interval) => (rootIndex + interval) % 12);
};

export const isNoteInScale = (note: number, scale: Scale): boolean => {
  const scaleNotes = getScaleNotes(scale.root, scale.type);
  return scaleNotes.includes(note % 12);
};

export const getNoteName = (midiNote: number): string => {
  const octave = Math.floor(midiNote / 12) - 1;
  const noteName = NOTES[midiNote % 12];
  return `${noteName}${octave}`;
};

export const getMidiNoteFromName = (noteName: string): number => {
  const match = noteName.match(/^([A-G]#?)(-?\d+)$/);
  if (!match) return 60; // Default to middle C

  const [, note, octaveStr] = match;
  const octave = parseInt(octaveStr, 10);
  const noteIndex = NOTES.indexOf(note as Note);

  if (noteIndex === -1) return 60;

  return (octave + 1) * 12 + noteIndex;
};
