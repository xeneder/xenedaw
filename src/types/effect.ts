export type Effect =
  | ReverbEffect
  | DelayEffect
  | DistortionEffect
  | BitCrusherEffect
  | EQEffect
  | ChorusEffect
  | CompressorEffect;

export interface ReverbEffect {
  id: string;
  type: 'reverb';
  enabled: boolean;
  params: {
    decay: number; // 0.1-10s
    wet: number; // 0-1
    preDelay: number; // 0-0.1s
  };
}

export interface DelayEffect {
  id: string;
  type: 'delay';
  enabled: boolean;
  params: {
    delayTime: number; // 0-2s
    feedback: number; // 0-0.95
    wet: number; // 0-1
  };
}

export interface DistortionEffect {
  id: string;
  type: 'distortion';
  enabled: boolean;
  params: {
    amount: number; // 0-1
    oversample: 'none' | '2x' | '4x';
    wet: number; // 0-1
  };
}

export interface BitCrusherEffect {
  id: string;
  type: 'bitcrusher';
  enabled: boolean;
  params: {
    bits: number; // 1-16
    wet: number; // 0-1
  };
}

export interface EQEffect {
  id: string;
  type: 'eq';
  enabled: boolean;
  params: {
    lowCut: number; // Hz, 0 = off
    lowShelf: { frequency: number; gain: number }; // Hz, dB
    mid: { frequency: number; gain: number; q: number };
    highShelf: { frequency: number; gain: number };
    highCut: number; // Hz, 0 = off
  };
}

export interface ChorusEffect {
  id: string;
  type: 'chorus';
  enabled: boolean;
  params: {
    frequency: number; // 0.1-10 Hz
    depth: number; // 0-1
    delayTime: number; // 2-20 ms
    wet: number; // 0-1
  };
}

export interface CompressorEffect {
  id: string;
  type: 'compressor';
  enabled: boolean;
  params: {
    threshold: number; // -60 - 0 dB
    ratio: number; // 1-20
    attack: number; // 0-1s
    release: number; // 0-1s
  };
}
