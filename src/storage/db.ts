import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { Project } from '@/types';

interface XeneDAWDB extends DBSchema {
  projects: {
    key: string;
    value: {
      id: string;
      name: string;
      data: Project;
      updatedAt: number;
      createdAt: number;
    };
    indexes: {
      'by-updated': number;
      'by-name': string;
    };
  };
  samples: {
    key: string;
    value: {
      id: string;
      name: string;
      blob: Blob;
      duration: number;
      sampleRate: number;
      uploadedAt: number;
    };
    indexes: { 'by-name': string };
  };
  soundfonts: {
    key: string;
    value: {
      id: string;
      name: string;
      blob: Blob;
      presets: string[];
      uploadedAt: number;
    };
    indexes: { 'by-name': string };
  };
}

const DB_NAME = 'xenedaw';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<XeneDAWDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<XeneDAWDB>> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<XeneDAWDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Projects store
      if (!db.objectStoreNames.contains('projects')) {
        const projectStore = db.createObjectStore('projects', { keyPath: 'id' });
        projectStore.createIndex('by-updated', 'updatedAt');
        projectStore.createIndex('by-name', 'name');
      }

      // Samples store
      if (!db.objectStoreNames.contains('samples')) {
        const sampleStore = db.createObjectStore('samples', { keyPath: 'id' });
        sampleStore.createIndex('by-name', 'name');
      }

      // Soundfonts store
      if (!db.objectStoreNames.contains('soundfonts')) {
        const soundfontStore = db.createObjectStore('soundfonts', { keyPath: 'id' });
        soundfontStore.createIndex('by-name', 'name');
      }
    },
  });

  return dbInstance;
}

// Close database connection
export async function closeDB(): Promise<void> {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}
