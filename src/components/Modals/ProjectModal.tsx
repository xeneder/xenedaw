import { useState, useEffect } from 'react';
import { X, Save, FolderOpen, Download } from 'lucide-react';
import { useProjectStore, useTrackStore } from '@/store';
import { saveProject, loadProject, getAllProjects, deleteProject } from '@/storage';
import { nanoid } from 'nanoid';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'save' | 'load';
}

export function ProjectModal({ isOpen, onClose, mode }: ProjectModalProps) {
  const { project, setProject, updateProject } = useProjectStore();
  const { tracks, setTracks } = useTrackStore();

  const [projects, setProjects] = useState<Array<{ id: string; name: string; updatedAt: Date }>>([]);
  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && mode === 'load') {
      loadProjectsList();
    }
    if (isOpen && mode === 'save' && project) {
      setProjectName(project.name);
    }
  }, [isOpen, mode, project]);

  const loadProjectsList = async () => {
    setLoading(true);
    try {
      const allProjects = await getAllProjects();
      setProjects(allProjects);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!projectName.trim()) {
      alert('Please enter a project name');
      return;
    }

    setLoading(true);
    try {
      const projectToSave = project || {
        id: nanoid(),
        name: projectName,
        bpm: 120,
        timeSignature: [4, 4] as [number, number],
        tracks: [],
        masterVolume: 0.8,
        masterEffects: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        version: '0.1.0',
      };

      const updatedProject = {
        ...projectToSave,
        name: projectName,
        tracks,
        updatedAt: new Date(),
      };

      await saveProject(updatedProject);
      setProject(updatedProject);
      alert('Project saved successfully!');
      onClose();
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  const handleLoad = async (projectId: string) => {
    setLoading(true);
    try {
      const loadedProject = await loadProject(projectId);
      if (loadedProject) {
        setProject(loadedProject);
        setTracks(loadedProject.tracks);
        alert('Project loaded successfully!');
        onClose();
      } else {
        alert('Project not found');
      }
    } catch (error) {
      console.error('Failed to load project:', error);
      alert('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    setLoading(true);
    try {
      await deleteProject(projectId);
      loadProjectsList();
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('Failed to delete project');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-bg-elevated rounded-lg shadow-card-hover w-[600px] max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="h-12 border-b border-border flex items-center justify-between px-4">
          <h2 className="font-medium flex items-center gap-2">
            {mode === 'save' ? (
              <>
                <Save size={20} /> Save Project
              </>
            ) : (
              <>
                <FolderOpen size={20} /> Load Project
              </>
            )}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-bg-hover transition-base"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {mode === 'save' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Project Name</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3 py-2 bg-bg border border-border rounded focus:border-accent outline-none"
                  placeholder="Enter project name..."
                  autoFocus
                />
              </div>

              <button
                onClick={handleSave}
                disabled={loading || !projectName.trim()}
                className="w-full px-4 py-2 bg-accent text-text-inverse rounded hover:bg-accent-dark transition-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Project'}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {loading ? (
                <div className="text-center text-text-secondary py-8">Loading projects...</div>
              ) : projects.length === 0 ? (
                <div className="text-center text-text-secondary py-8">
                  No saved projects found
                </div>
              ) : (
                projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="flex items-center justify-between p-3 bg-bg hover:bg-bg-hover rounded border border-border transition-base"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{proj.name}</div>
                      <div className="text-xs text-text-secondary">
                        Last modified: {proj.updatedAt.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleLoad(proj.id)}
                        className="px-3 py-1 bg-accent text-text-inverse rounded hover:bg-accent-dark transition-base text-sm"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => handleDelete(proj.id)}
                        className="px-3 py-1 bg-error text-text-inverse rounded hover:bg-error/80 transition-base text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
