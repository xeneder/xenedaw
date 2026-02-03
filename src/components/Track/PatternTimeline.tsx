import { MouseEvent } from 'react';
import { useTrackStore, useUIStore } from '@/store';
import type { Track, Pattern } from '@/types';

interface PatternTimelineProps {
  track: Track;
}

const BEAT_WIDTH = 24; // Width of one beat in pixels

export function PatternTimeline({ track }: PatternTimelineProps) {
  const { addPattern, removePattern, updatePattern } = useTrackStore();
  const { openPianoRoll } = useUIStore();

  const handleDoubleClick = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickedBeat = Math.floor(x / BEAT_WIDTH);

    // Create a new pattern at the clicked position
    const newPattern = addPattern(track.id, clickedBeat, 4);
    if (newPattern) {
      openPianoRoll(newPattern.id);
    }
  };

  const handlePatternClick = (patternId: string, e: MouseEvent) => {
    e.stopPropagation();
    openPianoRoll(patternId);
  };

  const handlePatternDelete = (patternId: string, e: MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this pattern?')) {
      removePattern(track.id, patternId);
    }
  };

  // Calculate timeline width (show at least 32 beats)
  const maxBeat = track.patterns.reduce(
    (max, p) => Math.max(max, p.startTime + p.duration),
    32
  );
  const timelineWidth = maxBeat * BEAT_WIDTH;

  return (
    <div
      className="mt-3 h-16 bg-bg rounded border border-border overflow-x-auto relative cursor-pointer"
      onDoubleClick={handleDoubleClick}
    >
      {/* Grid lines */}
      <div className="absolute inset-0 flex" style={{ width: `${timelineWidth}px` }}>
        {Array.from({ length: Math.ceil(maxBeat / 4) }).map((_, barIndex) => (
          <div
            key={barIndex}
            className="border-r border-border-hover"
            style={{ width: `${BEAT_WIDTH * 4}px` }}
          >
            {/* Beat markers */}
            {Array.from({ length: 4 }).map((_, beatIndex) => (
              <div
                key={beatIndex}
                className="absolute h-full"
                style={{
                  left: `${beatIndex * BEAT_WIDTH}px`,
                  width: `${BEAT_WIDTH}px`,
                  borderRight: beatIndex < 3 ? '1px solid var(--color-border)' : 'none',
                  opacity: 0.3,
                }}
              />
            ))}
            {/* Bar number */}
            <span className="absolute top-1 left-1 text-[10px] text-text-muted">
              {barIndex + 1}
            </span>
          </div>
        ))}
      </div>

      {/* Patterns */}
      <div className="relative h-full" style={{ width: `${timelineWidth}px` }}>
        {track.patterns.map((pattern) => (
          <div
            key={pattern.id}
            className="absolute top-2 bottom-2 rounded cursor-pointer transition-base group"
            style={{
              left: `${pattern.startTime * BEAT_WIDTH}px`,
              width: `${pattern.duration * BEAT_WIDTH}px`,
              backgroundColor: pattern.color || track.color,
              opacity: 0.8,
            }}
            onClick={(e) => handlePatternClick(pattern.id, e)}
            title={`${pattern.name} - Double-click to edit`}
          >
            {/* Pattern content */}
            <div className="h-full px-2 py-1 flex items-center justify-between">
              <span className="text-xs text-text-inverse truncate font-medium">
                {pattern.name}
              </span>

              {/* Delete button (visible on hover) */}
              <button
                onClick={(e) => handlePatternDelete(pattern.id, e)}
                className="opacity-0 group-hover:opacity-100 text-text-inverse hover:text-error transition-base text-xs"
              >
                ×
              </button>
            </div>

            {/* Note preview (simplified) */}
            {pattern.notes.length > 0 && (
              <div className="absolute bottom-1 left-1 right-1 h-1 bg-text-inverse/20 rounded" />
            )}
          </div>
        ))}
      </div>

      {/* Instructions */}
      {track.patterns.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-xs text-text-muted">
            Double-click to create a pattern
          </span>
        </div>
      )}
    </div>
  );
}
