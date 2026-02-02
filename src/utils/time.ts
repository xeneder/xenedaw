// Time conversion utilities for DAW

/**
 * Convert bars to seconds based on BPM and time signature
 */
export function barsToSeconds(
  bars: number,
  bpm: number,
  timeSignature: [number, number]
): number {
  const beatsPerBar = timeSignature[0];
  const totalBeats = bars * beatsPerBar;
  const secondsPerBeat = 60 / bpm;
  return totalBeats * secondsPerBeat;
}

/**
 * Convert seconds to bars based on BPM and time signature
 */
export function secondsToBars(
  seconds: number,
  bpm: number,
  timeSignature: [number, number]
): number {
  const beatsPerBar = timeSignature[0];
  const secondsPerBeat = 60 / bpm;
  const totalBeats = seconds / secondsPerBeat;
  return totalBeats / beatsPerBar;
}

/**
 * Convert beats to seconds based on BPM
 */
export function beatsToSeconds(beats: number, bpm: number): number {
  const secondsPerBeat = 60 / bpm;
  return beats * secondsPerBeat;
}

/**
 * Convert seconds to beats based on BPM
 */
export function secondsToBeats(seconds: number, bpm: number): number {
  const secondsPerBeat = 60 / bpm;
  return seconds / secondsPerBeat;
}

/**
 * Format time in MM:SS.ms format
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
}

/**
 * Format bar position as "Bar:Beat"
 */
export function formatBarBeat(
  bars: number,
  timeSignature: [number, number]
): string {
  const bar = Math.floor(bars) + 1;
  const beat = Math.floor((bars % 1) * timeSignature[0]) + 1;
  return `${bar}:${beat}`;
}
