import * as Tone from 'tone';
import type { Instrument, WaveformSynth as WaveformSynthType } from '@/types';

export class WaveformSynthPlayer {
  private synth: Tone.PolySynth | Tone.Synth;
  private instrument: Instrument;

  constructor(instrument: Instrument) {
    this.instrument = instrument;

    if (instrument.type === 'synth') {
      const synthInstrument = instrument as WaveformSynthType;

      // Create a polyphonic synthesizer
      this.synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: {
          type: synthInstrument.waveform,
          detune: synthInstrument.detune,
        },
        envelope: {
          attack: synthInstrument.envelope.attack,
          decay: synthInstrument.envelope.decay,
          sustain: synthInstrument.envelope.sustain,
          release: synthInstrument.envelope.release,
        },
        volume: -6, // Slightly reduce volume to prevent clipping
      });

      // Add filter if specified
      if (synthInstrument.filter) {
        const filter = new Tone.Filter({
          type: synthInstrument.filter.type,
          frequency: synthInstrument.filter.frequency,
          Q: synthInstrument.filter.q,
        });
        this.synth.connect(filter);
      }
    } else {
      // Default fallback synth
      this.synth = new Tone.PolySynth(Tone.Synth);
    }
  }

  triggerAttackRelease(
    note: string | string[],
    duration: Tone.Unit.Time,
    time?: Tone.Unit.Time,
    velocity?: number
  ): void {
    this.synth.triggerAttackRelease(note, duration, time, velocity);
  }

  triggerAttack(
    note: string | string[],
    time?: Tone.Unit.Time,
    velocity?: number
  ): void {
    this.synth.triggerAttack(note, time, velocity);
  }

  triggerRelease(note: string | string[], time?: Tone.Unit.Time): void {
    this.synth.triggerRelease(note, time);
  }

  connect(destination: Tone.ToneAudioNode): void {
    this.synth.connect(destination);
  }

  disconnect(): void {
    this.synth.disconnect();
  }

  dispose(): void {
    this.synth.dispose();
  }

  updateInstrument(instrument: Instrument): void {
    this.instrument = instrument;

    if (instrument.type === 'synth') {
      const synthInstrument = instrument as WaveformSynthType;

      if (this.synth instanceof Tone.PolySynth) {
        // Update oscillator type
        this.synth.set({
          oscillator: {
            type: synthInstrument.waveform,
            detune: synthInstrument.detune,
          },
          envelope: {
            attack: synthInstrument.envelope.attack,
            decay: synthInstrument.envelope.decay,
            sustain: synthInstrument.envelope.sustain,
            release: synthInstrument.envelope.release,
          },
        });
      }
    }
  }
}
