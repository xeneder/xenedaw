export type Instrument =
  | GMInstrument
  | SamplerInstrument
  | SoundfontInstrument
  | WaveformSynth;

export interface GMInstrument {
  type: 'gm';
  program: number; // 0-127
}

export interface SamplerInstrument {
  type: 'sampler';
  samples: Record<
    number,
    {
      // MIDI note -> sample
      url: string;
      baseNote: number;
    }
  >;
  envelope: ADSREnvelope;
  loop: boolean;
}

export interface SoundfontInstrument {
  type: 'soundfont';
  soundfontId: string; // reference to IndexedDB
  preset: number;
}

export interface WaveformSynth {
  type: 'synth';
  waveform: 'sine' | 'square' | 'sawtooth' | 'triangle';
  envelope: ADSREnvelope;
  filter?: Filter;
  detune: number;
}

export interface ADSREnvelope {
  attack: number; // seconds
  decay: number; // seconds
  sustain: number; // 0-1
  release: number; // seconds
}

export interface Filter {
  type: 'lowpass' | 'highpass' | 'bandpass';
  frequency: number; // Hz
  q: number; // 0-10
}
