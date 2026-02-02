import { useState, useRef, useEffect, MouseEvent } from 'react';
import { useTrackStore, useUIStore } from '@/store';
import type { Note } from '@/types';
import { MIDDLE_C } from '@/constants';

const PIANO_KEYS = 88; // 88 keys (A0 to C8)
const KEY_HEIGHT = 16; // Height of each piano key in pixels
const BEAT_WIDTH = 96; // Width of one beat in pixels
const MIN_NOTE_WIDTH = 12; // Minimum width for a note

interface PianoRollEditorProps {
  trackId: string;
  patternId: string;
}

export function PianoRollEditor({ trackId, patternId }: PianoRollEditorProps) {
  const { tracks, addNote, removeNote, updateNote } = useTrackStore();
  const { gridDivision, snapToGrid } = useUIStore();

  const [selectedNotes, setSelectedNotes] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [tool, setTool] = useState<'select' | 'pencil' | 'eraser'>('pencil');

  const canvasRef = useRef<HTMLDivElement>(null);

  // Get the current track and pattern
  const track = tracks.find((t) => t.id === trackId);
  const pattern = track?.patterns.find((p) => p.id === patternId);

  if (!track || !pattern) {
    return <div className="text-text-secondary">Pattern not found</div>;
  }

  const gridSize = getBeatFromDivision(gridDivision);

  // Convert grid division to beat fraction
  function getBeatFromDivision(div: string): number {
    switch (div) {
      case '1/4': return 1;
      case '1/8': return 0.5;
      case '1/16': return 0.25;
      case '1/32': return 0.125;
      default: return 0.25;
    }
  }

  // Snap position to grid
  function snapPosition(value: number): number {
    if (!snapToGrid) return value;
    return Math.round(value / gridSize) * gridSize;
  }

  // Convert pixel position to MIDI note
  function pixelToNote(y: number): number {
    const noteIndex = Math.floor(y / KEY_HEIGHT);
    return 127 - noteIndex; // Invert (top = high notes, bottom = low notes)
  }

  // Convert pixel position to beat time
  function pixelToTime(x: number): number {
    return snapPosition(x / BEAT_WIDTH);
  }

  // Convert beat time to pixel position
  function timeToPixel(time: number): number {
    return time * BEAT_WIDTH;
  }

  // Convert MIDI note to pixel position
  function noteToPixel(note: number): number {
    return (127 - note) * KEY_HEIGHT;
  }

  // Handle mouse down on canvas
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedNote = pixelToNote(y);
    const clickedTime = pixelToTime(x);

    if (tool === 'pencil') {
      // Add a new note
      addNote(trackId, patternId, {
        pitch: clickedNote,
        time: clickedTime,
        duration: gridSize,
        velocity: 100,
      });
    } else if (tool === 'eraser') {
      // Find and remove note at this position
      const noteToRemove = pattern.notes.find(
        (note) =>
          note.pitch === clickedNote &&
          note.time <= clickedTime &&
          note.time + note.duration >= clickedTime
      );
      if (noteToRemove) {
        removeNote(trackId, patternId, noteToRemove.id);
      }
    } else if (tool === 'select') {
      // Select note
      const clickedNoteObj = pattern.notes.find(
        (note) =>
          note.pitch === clickedNote &&
          note.time <= clickedTime &&
          note.time + note.duration >= clickedTime
      );

      if (clickedNoteObj) {
        if (e.shiftKey) {
          setSelectedNotes((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(clickedNoteObj.id)) {
              newSet.delete(clickedNoteObj.id);
            } else {
              newSet.add(clickedNoteObj.id);
            }
            return newSet;
          });
        } else {
          setSelectedNotes(new Set([clickedNoteObj.id]));
        }
        setIsDragging(true);
        setDragStartPos({ x, y });
      } else {
        setSelectedNotes(new Set());
      }
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete selected notes
      if (e.key === 'Delete' || e.key === 'Backspace') {
        selectedNotes.forEach((noteId) => {
          removeNote(trackId, patternId, noteId);
        });
        setSelectedNotes(new Set());
      }

      // Tool shortcuts
      if (e.key === 'v' || e.key === 'V') setTool('select');
      if (e.key === 'b' || e.key === 'B') setTool('pencil');
      if (e.key === 'e' || e.key === 'E') setTool('eraser');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNotes, trackId, patternId, removeNote]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="h-10 bg-bg-elevated border-b border-border flex items-center gap-2 px-4">
        <div className="flex items-center gap-1 bg-bg rounded p-1">
          <button
            onClick={() => setTool('select')}
            className={`px-3 py-1 text-xs rounded transition-base ${
              tool === 'select' ? 'bg-accent text-text-inverse' : 'hover:bg-bg-hover'
            }`}
          >
            Select (V)
          </button>
          <button
            onClick={() => setTool('pencil')}
            className={`px-3 py-1 text-xs rounded transition-base ${
              tool === 'pencil' ? 'bg-accent text-text-inverse' : 'hover:bg-bg-hover'
            }`}
          >
            Pencil (B)
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`px-3 py-1 text-xs rounded transition-base ${
              tool === 'eraser' ? 'bg-accent text-text-inverse' : 'hover:bg-bg-hover'
            }`}
          >
            Eraser (E)
          </button>
        </div>

        <div className="w-px h-6 bg-border" />

        <div className="text-xs text-text-secondary">
          Grid: {gridDivision} | Snap: {snapToGrid ? 'On' : 'Off'}
        </div>
      </div>

      {/* Piano Roll Canvas */}
      <div className="flex-1 flex overflow-auto">
        {/* Piano Keys */}
        <div className="w-12 bg-bg-elevated border-r border-border flex-shrink-0">
          {Array.from({ length: PIANO_KEYS }).map((_, index) => {
            const noteNum = 127 - index;
            const noteName = getNoteNameFromMIDI(noteNum);
            const isBlackKey = noteName.includes('#');
            const isC = noteName.startsWith('C');

            return (
              <div
                key={index}
                className={`h-4 border-b border-border flex items-center justify-end px-1 text-[8px] font-mono ${
                  isBlackKey ? 'bg-bg text-text-muted' : 'bg-bg-elevated'
                } ${isC ? 'border-l-2 border-accent' : ''}`}
                style={{ height: `${KEY_HEIGHT}px` }}
              >
                {isC && noteName}
              </div>
            );
          })}
        </div>

        {/* Grid and Notes */}
        <div
          ref={canvasRef}
          className="flex-1 relative bg-bg cursor-crosshair"
          style={{ height: `${PIANO_KEYS * KEY_HEIGHT}px` }}
          onMouseDown={handleMouseDown}
        >
          {/* Grid lines */}
          <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
            {/* Horizontal lines (piano keys) */}
            {Array.from({ length: PIANO_KEYS }).map((_, index) => {
              const noteNum = 127 - index;
              const noteName = getNoteNameFromMIDI(noteNum);
              const isBlackKey = noteName.includes('#');

              return (
                <rect
                  key={`h-${index}`}
                  x="0"
                  y={index * KEY_HEIGHT}
                  width="100%"
                  height={KEY_HEIGHT}
                  fill={isBlackKey ? 'rgba(0,0,0,0.1)' : 'transparent'}
                  stroke="var(--color-border)"
                  strokeWidth="0.5"
                />
              );
            })}

            {/* Vertical lines (beats) */}
            {Array.from({ length: pattern.duration * 4 / gridSize }).map((_, index) => {
              const x = index * gridSize * BEAT_WIDTH;
              const isMeasureLine = index % (4 / gridSize) === 0;

              return (
                <line
                  key={`v-${index}`}
                  x1={x}
                  y1="0"
                  x2={x}
                  y2="100%"
                  stroke="var(--color-border)"
                  strokeWidth={isMeasureLine ? '1' : '0.5'}
                  opacity={isMeasureLine ? '0.4' : '0.2'}
                />
              );
            })}
          </svg>

          {/* Notes */}
          {pattern.notes.map((note) => {
            const isSelected = selectedNotes.has(note.id);

            return (
              <div
                key={note.id}
                className={`absolute border border-border rounded transition-base ${
                  isSelected ? 'bg-accent border-accent-dark' : 'bg-success hover:bg-success/80'
                }`}
                style={{
                  left: `${timeToPixel(note.time)}px`,
                  top: `${noteToPixel(note.pitch)}px`,
                  width: `${Math.max(timeToPixel(note.duration), MIN_NOTE_WIDTH)}px`,
                  height: `${KEY_HEIGHT - 2}px`,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Helper function to convert MIDI note number to note name
function getNoteNameFromMIDI(midiNote: number): string {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = Math.floor(midiNote / 12) - 1;
  const noteName = noteNames[midiNote % 12];
  return `${noteName}${octave}`;
}
