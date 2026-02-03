import { useUIStore, useTrackStore } from '@/store';
import { PianoRollEditor } from './PianoRollEditor';
import { X } from 'lucide-react';

export function PianoRoll() {
  const { pianoRollOpen, closePianoRoll, selectedPatternId } = useUIStore();
  const { tracks } = useTrackStore();

  if (!pianoRollOpen || !selectedPatternId) return null;

  // Find the track that contains this pattern
  const track = tracks.find((t) =>
    t.patterns.some((p) => p.id === selectedPatternId)
  );

  const pattern = track?.patterns.find((p) => p.id === selectedPatternId);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-bg-elevated rounded-lg shadow-card-hover w-[90%] h-[80%] flex flex-col">
        {/* Header */}
        <div className="h-12 border-b border-border flex items-center justify-between px-4">
          <div>
            <h2 className="font-medium">{pattern?.name || 'Piano Roll'}</h2>
            <div className="text-xs text-text-secondary">
              {track?.name}
            </div>
          </div>
          <button
            onClick={closePianoRoll}
            className="p-2 rounded hover:bg-bg-hover transition-base"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        {track && pattern ? (
          <PianoRollEditor trackId={track.id} patternId={pattern.id} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-text-secondary">
            Pattern not found
          </div>
        )}
      </div>
    </div>
  );
}
