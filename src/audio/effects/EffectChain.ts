import * as Tone from 'tone';
import type { Effect } from '@/types';
import { nanoid } from 'nanoid';

export class EffectChain {
  public input: Tone.Gain;
  public output: Tone.Gain;
  private effects: Map<string, Tone.ToneAudioNode> = new Map();
  private effectsOrder: string[] = [];

  constructor() {
    this.input = new Tone.Gain(1);
    this.output = new Tone.Gain(1);

    // Initially connect input directly to output
    this.input.connect(this.output);
  }

  addEffect(effect: Effect): void {
    const toneEffect = this.createToneEffect(effect);
    if (!toneEffect) return;

    this.effects.set(effect.id, toneEffect);
    this.effectsOrder.push(effect.id);
    this.reconnectChain();
  }

  removeEffect(effectId: string): void {
    const effect = this.effects.get(effectId);
    if (effect) {
      effect.dispose();
      this.effects.delete(effectId);
      this.effectsOrder = this.effectsOrder.filter(id => id !== effectId);
      this.reconnectChain();
    }
  }

  updateEffect(effect: Effect): void {
    const toneEffect = this.effects.get(effect.id);
    if (!toneEffect) return;

    this.updateToneEffect(toneEffect, effect);
  }

  reorderEffects(fromIndex: number, toIndex: number): void {
    const [removed] = this.effectsOrder.splice(fromIndex, 1);
    if (removed) {
      this.effectsOrder.splice(toIndex, 0, removed);
      this.reconnectChain();
    }
  }

  private reconnectChain(): void {
    // Disconnect all
    this.input.disconnect();
    this.effects.forEach(effect => effect.disconnect());

    // Reconnect in order
    if (this.effectsOrder.length === 0) {
      this.input.connect(this.output);
    } else {
      let previous: Tone.ToneAudioNode = this.input;

      for (const effectId of this.effectsOrder) {
        const effect = this.effects.get(effectId);
        if (effect) {
          previous.connect(effect);
          previous = effect;
        }
      }

      previous.connect(this.output);
    }
  }

  private createToneEffect(effect: Effect): Tone.ToneAudioNode | null {
    switch (effect.type) {
      case 'reverb':
        return new Tone.Reverb({
          decay: effect.params.decay,
          preDelay: effect.params.preDelay,
          wet: effect.params.wet,
        });

      case 'delay':
        return new Tone.FeedbackDelay({
          delayTime: effect.params.delayTime,
          feedback: effect.params.feedback,
          wet: effect.params.wet,
        });

      case 'distortion':
        return new Tone.Distortion({
          distortion: effect.params.amount,
          oversample: effect.params.oversample === 'none' ? 'none' :
                      effect.params.oversample === '2x' ? '2x' : '4x',
          wet: effect.params.wet,
        });

      case 'bitcrusher':
        return new Tone.BitCrusher({
          bits: effect.params.bits,
          wet: effect.params.wet,
        });

      case 'eq':
        // Create a 3-band EQ using multiple filters
        const eq = new Tone.EQ3({
          low: effect.params.lowShelf.gain,
          mid: effect.params.mid.gain,
          high: effect.params.highShelf.gain,
          lowFrequency: effect.params.lowShelf.frequency,
          highFrequency: effect.params.highShelf.frequency,
        });
        return eq;

      case 'chorus':
        return new Tone.Chorus({
          frequency: effect.params.frequency,
          depth: effect.params.depth,
          delayTime: effect.params.delayTime,
          wet: effect.params.wet,
        });

      case 'compressor':
        return new Tone.Compressor({
          threshold: effect.params.threshold,
          ratio: effect.params.ratio,
          attack: effect.params.attack,
          release: effect.params.release,
        });

      default:
        console.warn(`Unknown effect type: ${(effect as Effect).type}`);
        return null;
    }
  }

  private updateToneEffect(toneEffect: Tone.ToneAudioNode, effect: Effect): void {
    switch (effect.type) {
      case 'reverb':
        if (toneEffect instanceof Tone.Reverb) {
          toneEffect.decay = effect.params.decay;
          toneEffect.preDelay = effect.params.preDelay;
          toneEffect.wet.value = effect.params.wet;
        }
        break;

      case 'delay':
        if (toneEffect instanceof Tone.FeedbackDelay) {
          toneEffect.delayTime.value = effect.params.delayTime;
          toneEffect.feedback.value = effect.params.feedback;
          toneEffect.wet.value = effect.params.wet;
        }
        break;

      case 'distortion':
        if (toneEffect instanceof Tone.Distortion) {
          toneEffect.distortion = effect.params.amount;
          toneEffect.oversample = effect.params.oversample === 'none' ? 'none' :
                                  effect.params.oversample === '2x' ? '2x' : '4x';
          toneEffect.wet.value = effect.params.wet;
        }
        break;

      case 'bitcrusher':
        if (toneEffect instanceof Tone.BitCrusher) {
          toneEffect.bits = effect.params.bits;
          toneEffect.wet.value = effect.params.wet;
        }
        break;

      case 'eq':
        if (toneEffect instanceof Tone.EQ3) {
          toneEffect.low.value = effect.params.lowShelf.gain;
          toneEffect.mid.value = effect.params.mid.gain;
          toneEffect.high.value = effect.params.highShelf.gain;
          toneEffect.lowFrequency.value = effect.params.lowShelf.frequency;
          toneEffect.highFrequency.value = effect.params.highShelf.frequency;
        }
        break;

      case 'chorus':
        if (toneEffect instanceof Tone.Chorus) {
          toneEffect.frequency.value = effect.params.frequency;
          toneEffect.depth = effect.params.depth;
          toneEffect.delayTime = effect.params.delayTime;
          toneEffect.wet.value = effect.params.wet;
        }
        break;

      case 'compressor':
        if (toneEffect instanceof Tone.Compressor) {
          toneEffect.threshold.value = effect.params.threshold;
          toneEffect.ratio.value = effect.params.ratio;
          toneEffect.attack.value = effect.params.attack;
          toneEffect.release.value = effect.params.release;
        }
        break;
    }
  }

  dispose(): void {
    this.effects.forEach(effect => effect.dispose());
    this.effects.clear();
    this.effectsOrder = [];
    this.input.dispose();
    this.output.dispose();
  }
}
