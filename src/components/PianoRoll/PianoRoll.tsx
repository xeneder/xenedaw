import { useUIStore } from '@/store';

export function PianoRoll() {
  const { pianoRollOpen, closePianoRoll, selectedPatternId } = useUIStore();

  if (!pianoRollOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-bg-elevated rounded-lg shadow-card-hover w-[90%] h-[80%] flex flex-col">
        {/* Header */}
        <div className="h-12 border-b border-border flex items-center justify-between px-4">
          <h2 className="font-medium">Piano Roll</h2>
          <button
            onClick={closePianoRoll}
            className="px-3 py-1.5 rounded hover:bg-bg-hover transition-base"
          >
            Close
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center text-text-secondary">
          Piano Roll UI - Coming Soon
          {selectedPatternId && (
            <div className="mt-2 text-xs">Pattern: {selectedPatternId}</div>
          )}
        </div>
      </div>
    </div>
  );
}
