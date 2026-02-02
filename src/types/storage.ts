export interface SampleEntry {
  id: string;
  name: string;
  blob: Blob;
  duration: number; // seconds
  sampleRate: number;
  uploadedAt: Date;
}

export interface SoundfontEntry {
  id: string;
  name: string;
  blob: Blob; // SF2 file
  presets: string[]; // list of preset names
  uploadedAt: Date;
}

export interface ProjectMetadata {
  id: string;
  name: string;
  updatedAt: Date;
  createdAt: Date;
}
