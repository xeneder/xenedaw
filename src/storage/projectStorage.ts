import { getDB } from './db';
import type { Project } from '@/types';

export async function saveProject(project: Project): Promise<void> {
  const db = await getDB();

  const projectData = {
    id: project.id,
    name: project.name,
    data: project,
    updatedAt: Date.now(),
    createdAt: project.createdAt instanceof Date ? project.createdAt.getTime() : Date.now(),
  };

  await db.put('projects', projectData);
}

export async function loadProject(id: string): Promise<Project | null> {
  const db = await getDB();
  const projectData = await db.get('projects', id);

  if (!projectData) {
    return null;
  }

  return projectData.data;
}

export async function getAllProjects(): Promise<Array<{ id: string; name: string; updatedAt: Date }>> {
  const db = await getDB();
  const projects = await db.getAllFromIndex('projects', 'by-updated');

  return projects
    .map((p) => ({
      id: p.id,
      name: p.name,
      updatedAt: new Date(p.updatedAt),
    }))
    .reverse(); // Most recent first
}

export async function deleteProject(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('projects', id);
}

export async function searchProjects(query: string): Promise<Array<{ id: string; name: string; updatedAt: Date }>> {
  const allProjects = await getAllProjects();
  const lowerQuery = query.toLowerCase();

  return allProjects.filter((p) =>
    p.name.toLowerCase().includes(lowerQuery)
  );
}

export async function getRecentProjects(limit: number = 5): Promise<Array<{ id: string; name: string; updatedAt: Date }>> {
  const allProjects = await getAllProjects();
  return allProjects.slice(0, limit);
}

// Export project as JSON file
export function exportProjectToJSON(project: Project): string {
  return JSON.stringify(project, null, 2);
}

// Import project from JSON string
export function importProjectFromJSON(json: string): Project {
  const data = JSON.parse(json);

  // Convert date strings back to Date objects
  return {
    ...data,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
  };
}
