import * as Tone from 'tone';
import type { Track, Pattern, Note } from '@/types';
import { WaveformSynthPlayer } from './instruments/WaveformSynth';
import { EffectChain } from './effects/EffectChain';

export class AudioEngine {
  private static instance: AudioEngine | null = null;
  private initialized = false;
  private trackPlayers: Map<string, { synth: WaveformSynthPlayer; channel: Tone.Channel; effects: EffectChain }> = new Map();
  private scheduledParts: Map<string, Tone.Part> = new Map();

  private constructor() {
    // Private constructor for singleton
  }

  static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  async init(): Promise<void> {
    if (this.initialized) return;

    try {
      await Tone.start();
      console.log('Audio engine initialized');
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize audio engine:', error);
      throw error;
    }
  }

  // Transport controls
  play(): void {
    if (!this.initialized) {
      console.warn('Audio engine not initialized');
      return;
    }
    Tone.getTransport().start();
  }

  pause(): void {
    Tone.getTransport().pause();
  }

  stop(): void {
    Tone.getTransport().stop();
    Tone.getTransport().position = 0;
  }

  seek(time: number): void {
    Tone.getTransport().seconds = time;
  }

  setTempo(bpm: number): void {
    Tone.getTransport().bpm.value = bpm;
  }

  setTimeSignature(numerator: number, denominator: number): void {
    Tone.getTransport().timeSignature = [numerator, denominator];
  }

  setLoop(enabled: boolean, start: number = 0, end: number = 4): void {
    Tone.getTransport().loop = enabled;
    if (enabled) {
      Tone.getTransport().loopStart = `${start}:0:0`;
      Tone.getTransport().loopEnd = `${end}:0:0`;
    }
  }

  getCurrentTime(): number {
    return Tone.getTransport().seconds;
  }

  getCurrentBar(): number {
    const position = Tone.getTransport().position as string;
    const [bars] = position.split(':');
    return parseInt(bars, 10) || 0;
  }

  // Track management
  addTrack(track: Track): void {
    if (this.trackPlayers.has(track.id)) {
      return; // Track already exists
    }

    // Create synth for this track
    const synth = new WaveformSynthPlayer(track.instrument);

    // Create channel for volume and pan
    const channel = new Tone.Channel({
      volume: Tone.gainToDb(track.volume),
      pan: track.pan,
    }).toDestination();

    // Create effects chain
    const effects = new EffectChain();

    // Connect: synth -> effects -> channel -> destination
    synth.connect(effects.input);
    effects.output.connect(channel);

    this.trackPlayers.set(track.id, { synth, channel, effects });
  }

  removeTrack(trackId: string): void {
    const player = this.trackPlayers.get(trackId);
    if (player) {
      player.synth.dispose();
      player.channel.dispose();
      player.effects.dispose();
      this.trackPlayers.delete(trackId);
    }

    // Remove all scheduled parts for this track
    this.scheduledParts.forEach((part, patternId) => {
      if (patternId.startsWith(trackId)) {
        part.dispose();
        this.scheduledParts.delete(patternId);
      }
    });
  }

  updateTrackVolume(trackId: string, volume: number): void {
    const player = this.trackPlayers.get(trackId);
    if (player) {
      player.channel.volume.value = Tone.gainToDb(volume);
    }
  }

  updateTrackPan(trackId: string, pan: number): void {
    const player = this.trackPlayers.get(trackId);
    if (player) {
      player.channel.pan.value = pan;
    }
  }

  updateTrackMute(trackId: string, mute: boolean): void {
    const player = this.trackPlayers.get(trackId);
    if (player) {
      player.channel.mute = mute;
    }
  }

  updateTrackSolo(trackId: string, solo: boolean): void {
    const player = this.trackPlayers.get(trackId);
    if (player) {
      player.channel.solo = solo;
    }
  }

  // Pattern scheduling
  schedulePattern(pattern: Pattern, track: Track): void {
    const player = this.trackPlayers.get(track.id);
    if (!player) {
      console.warn(`No player found for track ${track.id}`);
      return;
    }

    // Remove existing pattern if it exists
    this.unschedulePattern(pattern.id);

    // Convert notes to Tone.js format
    const events = pattern.notes.map((note: Note) => ({
      time: `${pattern.startTime}:${note.time}:0`,
      note: Tone.Frequency(note.pitch, 'midi').toNote(),
      duration: `${note.duration}n`,
      velocity: note.velocity / 127,
    }));

    // Create and schedule a Tone.Part
    const part = new Tone.Part((time, event) => {
      player.synth.triggerAttackRelease(
        event.note,
        event.duration,
        time,
        event.velocity
      );
    }, events);

    part.loop = false;
    part.start(0);

    this.scheduledParts.set(pattern.id, part);
  }

  unschedulePattern(patternId: string): void {
    const part = this.scheduledParts.get(patternId);
    if (part) {
      part.dispose();
      this.scheduledParts.delete(patternId);
    }
  }

  // Schedule all patterns from all tracks
  scheduleAllPatterns(tracks: Track[]): void {
    // Clear all existing patterns
    this.scheduledParts.forEach((part) => part.dispose());
    this.scheduledParts.clear();

    // Schedule all patterns
    tracks.forEach((track) => {
      track.patterns.forEach((pattern) => {
        this.schedulePattern(pattern, track);
      });
    });
  }

  // Export audio
  async exportToWAV(duration: number): Promise<Blob> {
    // TODO: Implement offline rendering for export
    console.warn('Export to WAV not yet implemented');
    return new Blob([], { type: 'audio/wav' });
  }

  // Cleanup
  dispose(): void {
    this.scheduledParts.forEach((part) => part.dispose());
    this.scheduledParts.clear();

    this.trackPlayers.forEach((player) => {
      player.synth.dispose();
      player.channel.dispose();
      player.effects.dispose();
    });
    this.trackPlayers.clear();

    this.initialized = false;
  }
}

// Export singleton instance
export const audioEngine = AudioEngine.getInstance();
