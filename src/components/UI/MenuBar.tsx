import { useState } from 'react';
import { Sun, Moon, Save, FolderOpen, Plus } from 'lucide-react';
import { useUIStore, useProjectStore, useTrackStore } from '@/store';
import { ProjectModal } from '@/components/Modals/ProjectModal';
import { saveProject } from '@/storage';
import { nanoid } from 'nanoid';

export function MenuBar() {
  const { theme, toggleTheme } = useUIStore();
  const { project, setProject } = useProjectStore();
  const { setTracks, addTrack } = useTrackStore();

  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [projectModalMode, setProjectModalMode] = useState<'save' | 'load'>('save');

  const handleNewProject = () => {
    if (confirm('Create a new project? Any unsaved changes will be lost.')) {
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
      setTracks([]);
      // Add one initial track
      addTrack();
    }
  };

  const handleSave = async () => {
    if (!project) {
      setProjectModalMode('save');
      setProjectModalOpen(true);
      return;
    }

    try {
      await saveProject(project);
      alert('Project saved successfully!');
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('Failed to save project');
    }
  };

  const handleSaveAs = () => {
    setProjectModalMode('save');
    setProjectModalOpen(true);
  };

  const handleOpen = () => {
    setProjectModalMode('load');
    setProjectModalOpen(true);
  };

  return (
    <>
      <div className="h-10 bg-bg-elevated border-b border-border flex items-center px-4 justify-between">
        <div className="flex items-center gap-6">
          <div className="font-logo font-bold text-lg text-accent-logo">
            XeneDAW
          </div>
          <nav className="flex items-center gap-2">
            {/* File Menu */}
            <div className="relative group">
              <button className="px-2 py-1 hover:bg-bg-hover rounded transition-base text-sm">
                File
              </button>
              <div className="absolute left-0 top-full mt-1 bg-bg-elevated border border-border rounded shadow-card hidden group-hover:block min-w-[160px] z-50">
                <button
                  onClick={handleNewProject}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-bg-hover transition-base flex items-center gap-2"
                >
                  <Plus size={14} /> New Project
                </button>
                <button
                  onClick={handleOpen}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-bg-hover transition-base flex items-center gap-2"
                >
                  <FolderOpen size={14} /> Open...
                </button>
                <div className="h-px bg-border my-1" />
                <button
                  onClick={handleSave}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-bg-hover transition-base flex items-center gap-2"
                >
                  <Save size={14} /> Save
                </button>
                <button
                  onClick={handleSaveAs}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-bg-hover transition-base flex items-center gap-2"
                >
                  <Save size={14} /> Save As...
                </button>
              </div>
            </div>

            <button className="px-2 py-1 hover:bg-bg-hover rounded transition-base text-sm">
              Edit
            </button>
            <button className="px-2 py-1 hover:bg-bg-hover rounded transition-base text-sm">
              View
            </button>
            <button className="px-2 py-1 hover:bg-bg-hover rounded transition-base text-sm">
              Project
            </button>
            <button className="px-2 py-1 hover:bg-bg-hover rounded transition-base text-sm">
              Help
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded hover:bg-bg-hover transition-base"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>

      {/* Project Modal */}
      <ProjectModal
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        mode={projectModalMode}
      />
    </>
  );
}
