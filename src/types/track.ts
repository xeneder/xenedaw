import type { Instrument } from './instrument';
import type { Effect } from './effect';
import type { Pattern } from './pattern';
import type { Automation } from './automation';

export interface Track {
  id: string;
  name: string;
  type: 'midi' | 'audio';
  instrument: Instrument;
  patterns: Pattern[];
  volume: number; // 0-1
  pan: number; // -1 (left) to 1 (right)
  mute: boolean;
  solo: boolean;
  effects: Effect[];
  color: string;
  automations: Automation[];
}
