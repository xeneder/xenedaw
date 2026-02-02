import { Volume2, Trash2, Copy } from 'lucide-react';
import { useTrackStore, useUIStore } from '@/store';
import type { Track } from '@/types';

interface TrackComponentProps {
  track: Track;
  index: number;
}

export function TrackComponent({ track }: TrackComponentProps) {
  const { removeTrack, updateTrack } = useTrackStore();
  const { setSelectedTrack, selectedTrackId } = useUIStore();

  const isSelected = selectedTrackId === track.id;

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTrack(track.id, { volume: Number(e.target.value) });
  };

  const handlePanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTrack(track.id, { pan: Number(e.target.value) });
  };

  const handleMuteToggle = () => {
    updateTrack(track.id, { mute: !track.mute });
  };

  const handleSoloToggle = () => {
    updateTrack(track.id, { solo: !track.solo });
  };

  return (
    <div
      className={`
        bg-bg-elevated border border-border rounded-lg p-4 transition-base cursor-pointer
        ${isSelected ? 'border-accent shadow-card-hover' : 'hover:border-border-hover'}
      `}
      onClick={() => setSelectedTrack(track.id)}
    >
      {/* Track Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Color indicator */}
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: track.color }}
          />

          {/* Track name */}
          <input
            type="text"
            value={track.name}
            onChange={(e) => updateTrack(track.id, { name: e.target.value })}
            className="bg-transparent border-none outline-none font-medium text-base focus:text-accent"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Instrument type */}
          <span className="text-xs text-text-secondary px-2 py-1 bg-bg rounded">
            {track.instrument.type === 'synth' && 'Synth'}
            {track.instrument.type === 'gm' && 'GM Instrument'}
            {track.instrument.type === 'sampler' && 'Sampler'}
            {track.instrument.type === 'soundfont' && 'Soundfont'}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleMuteToggle();
            }}
            className={`px-2 py-1 text-xs rounded transition-base ${
              track.mute
                ? 'bg-warning text-text-inverse'
                : 'bg-bg hover:bg-bg-hover'
            }`}
          >
            M
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSoloToggle();
            }}
            className={`px-2 py-1 text-xs rounded transition-base ${
              track.solo
                ? 'bg-info text-text-inverse'
                : 'bg-bg hover:bg-bg-hover'
            }`}
          >
            S
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Duplicate track
            }}
            className="p-1.5 rounded hover:bg-bg-hover transition-base"
            title="Duplicate"
          >
            <Copy size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeTrack(track.id);
            }}
            className="p-1.5 rounded hover:bg-error hover:text-text-inverse transition-base"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Track Controls */}
      <div className="flex items-center gap-4">
        {/* Volume */}
        <div className="flex items-center gap-2 flex-1">
          <Volume2 size={16} className="text-text-secondary" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={track.volume}
            onChange={handleVolumeChange}
            onClick={(e) => e.stopPropagation()}
            className="flex-1"
          />
          <span className="text-xs text-text-secondary w-10 text-right">
            {Math.round(track.volume * 100)}%
          </span>
        </div>

        {/* Pan */}
        <div className="flex items-center gap-2 flex-1">
          <span className="text-xs text-text-secondary">Pan</span>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.01"
            value={track.pan}
            onChange={handlePanChange}
            onClick={(e) => e.stopPropagation()}
            className="flex-1"
          />
          <span className="text-xs text-text-secondary w-10 text-right">
            {track.pan < 0 ? 'L' : track.pan > 0 ? 'R' : 'C'}
            {track.pan !== 0 && Math.abs(Math.round(track.pan * 100))}
          </span>
        </div>
      </div>

      {/* Pattern Timeline (placeholder) */}
      <div className="mt-3 h-12 bg-bg rounded border border-border flex items-center px-2">
        <span className="text-xs text-text-muted">
          {track.patterns.length === 0
            ? 'No patterns yet. Double-click to add.'
            : `${track.patterns.length} pattern(s)`}
        </span>
      </div>
    </div>
  );
}
