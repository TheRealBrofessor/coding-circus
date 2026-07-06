import type { ProjectFile } from './types';

const STORAGE_PREFIX = 'coding-circus:project:';
const INDEX_KEY = 'coding-circus:project-index';

function readIndex(): string[] {
  try {
    const raw = localStorage.getItem(INDEX_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeIndex(names: string[]): void {
  localStorage.setItem(INDEX_KEY, JSON.stringify(names));
}

export function listProjects(): string[] {
  return readIndex();
}

export function saveProject(name: string, workspaceJson: unknown): ProjectFile {
  const project: ProjectFile = {
    formatVersion: 1,
    name,
    updatedAt: new Date().toISOString(),
    workspaceJson,
  };
  localStorage.setItem(STORAGE_PREFIX + name, JSON.stringify(project));
  const names = readIndex();
  if (!names.includes(name)) writeIndex([...names, name]);
  return project;
}

export function loadProject(name: string): ProjectFile | null {
  const raw = localStorage.getItem(STORAGE_PREFIX + name);
  if (!raw) return null;
  return JSON.parse(raw) as ProjectFile;
}

export function deleteProject(name: string): void {
  localStorage.removeItem(STORAGE_PREFIX + name);
  writeIndex(readIndex().filter((n) => n !== name));
}
