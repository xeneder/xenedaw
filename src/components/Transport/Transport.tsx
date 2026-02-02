import { Play, Pause, Square, SkipBack, Repeat } from 'lucide-react';
import { useTransportStore } from '@/store';

export function Transport() {
  const {
    isPlaying,
    bpm,
    timeSignature,
    loop,
    play,
    pause,
    stop,
    setBPM,
    toggleLoop,
    currentBar,
  } = useTransportStore();

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  return (
    <div className="h-16 bg-bg-elevated border-b border-border flex items-center px-4 gap-4">
      {/* Transport Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={stop}
          className="p-2 rounded hover:bg-bg-hover transition-base"
          title="Stop"
        >
          <Square size={20} />
        </button>
        <button
          onClick={handlePlayPause}
          className="p-2 rounded bg-accent text-text-inverse hover:bg-accent-dark transition-base"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button
          onClick={() => stop()}
          className="p-2 rounded hover:bg-bg-hover transition-base"
          title="Return to Start"
        >
          <SkipBack size={20} />
        </button>
      </div>

      <div className="w-px h-8 bg-border" />

      {/* Current Position */}
      <div className="text-sm font-mono">
        <span className="text-text-secondary">Bar:</span>{' '}
        <span className="text-text font-bold">{currentBar + 1}</span>
      </div>

      <div className="w-px h-8 bg-border" />

      {/* BPM */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-text-secondary">BPM:</label>
        <input
          type="number"
          value={bpm}
          onChange={(e) => setBPM(Number(e.target.value))}
          min={40}
          max={300}
          className="w-16 px-2 py-1 bg-bg border border-border rounded text-sm font-mono focus:border-accent outline-none"
        />
      </div>

      {/* Time Signature */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-text-secondary">Time:</label>
        <div className="px-2 py-1 bg-bg border border-border rounded text-sm font-mono">
          {timeSignature[0]}/{timeSignature[1]}
        </div>
      </div>

      <div className="w-px h-8 bg-border" />

      {/* Loop */}
      <button
        onClick={toggleLoop}
        className={`p-2 rounded transition-base ${
          loop.enabled
            ? 'bg-accent text-text-inverse'
            : 'hover:bg-bg-hover'
        }`}
        title="Toggle Loop"
      >
        <Repeat size={20} />
      </button>
    </div>
  );
}
