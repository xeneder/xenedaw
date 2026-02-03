import { useEffect, useRef } from 'react';
import { audioEngine } from '@/audio/AudioEngine';
import { useTransportStore, useTrackStore } from '@/store';

export function useAudioEngine() {
  const { isPlaying, bpm, timeSignature, loop } = useTransportStore();
  const { tracks } = useTrackStore();
  const initialized = useRef(false);

  // Initialize audio engine
  useEffect(() => {
    if (!initialized.current) {
      audioEngine
        .init()
        .then(() => {
          console.log('Audio engine initialized');
          initialized.current = true;
        })
        .catch((error) => {
          console.error('Failed to initialize audio engine:', error);
        });
    }

    return () => {
      // Cleanup on unmount
      if (initialized.current) {
        audioEngine.dispose();
      }
    };
  }, []);

  // Update BPM
  useEffect(() => {
    if (initialized.current) {
      audioEngine.setTempo(bpm);
    }
  }, [bpm]);

  // Update time signature
  useEffect(() => {
    if (initialized.current) {
      audioEngine.setTimeSignature(timeSignature[0], timeSignature[1]);
    }
  }, [timeSignature]);

  // Update loop settings
  useEffect(() => {
    if (initialized.current) {
      audioEngine.setLoop(loop.enabled, loop.start, loop.end);
    }
  }, [loop]);

  // Sync tracks with audio engine
  useEffect(() => {
    if (!initialized.current) return;

    // Add/remove tracks
    tracks.forEach((track) => {
      audioEngine.addTrack(track);
    });

    // Schedule all patterns
    audioEngine.scheduleAllPatterns(tracks);
  }, [tracks]);

  // Update track parameters
  useEffect(() => {
    if (!initialized.current) return;

    tracks.forEach((track) => {
      audioEngine.updateTrackVolume(track.id, track.volume);
      audioEngine.updateTrackPan(track.id, track.pan);
      audioEngine.updateTrackMute(track.id, track.mute);
      audioEngine.updateTrackSolo(track.id, track.solo);
    });
  }, [tracks]);

  // Handle play/pause
  useEffect(() => {
    if (!initialized.current) return;

    if (isPlaying) {
      audioEngine.play();
    } else {
      audioEngine.pause();
    }
  }, [isPlaying]);

  return { audioEngine, initialized: initialized.current };
}
