import { useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useTrackStore, useProjectStore } from '@/store';
import { TrackComponent } from '@/components/Track/TrackComponent';
import { nanoid } from 'nanoid';

export function Timeline() {
  const { tracks, addTrack, setTracks } = useTrackStore();
  const { project, setProject } = useProjectStore();

  // Initialize with a default project and one track
  useEffect(() => {
    if (!project) {
      const newProject = {
        id: nanoid(),
        name: 'Untitled Project',
        bpm: 120,
        timeSignature: [4, 4] as [number, number],
        tracks: [],
        masterVolume: 0.8,
        masterEffects: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        version: '0.1.0',
      };
      setProject(newProject);
    }

    if (tracks.length === 0) {
      addTrack();
    }
  }, [project, tracks.length, setProject, addTrack]);

  return (
    <div className="h-full flex flex-col bg-bg">
      {/* Toolbar */}
      <div className="h-12 bg-bg-elevated border-b border-border flex items-center px-4 gap-4">
        <button
          onClick={() => addTrack()}
          className="flex items-center gap-2 px-3 py-1.5 bg-accent text-text-inverse rounded hover:bg-accent-dark transition-base text-sm"
        >
          <Plus size={16} />
          Add Track
        </button>

        <div className="text-sm text-text-secondary">
          {project?.name || 'Untitled Project'}
        </div>
      </div>

      {/* Tracks */}
      <div className="flex-1 overflow-y-auto">
        {tracks.length === 0 ? (
          <div className="flex items-center justify-center h-full text-text-secondary">
            No tracks yet. Click "Add Track" to get started.
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {tracks.map((track, index) => (
              <TrackComponent key={track.id} track={track} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
