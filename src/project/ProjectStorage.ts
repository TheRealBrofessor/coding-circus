import type { ProjectFile } from './types';
import { CURRENT_FORMAT_VERSION, normalizeProjectName, validateProjectFile } from './validation';

const STORAGE_PREFIX = 'coding-circus:project:';
const INDEX_KEY = 'coding-circus:project-index';

// localStorage can be unavailable (privacy modes), full (quota), or contain
// corrupted entries (manual edits, older versions). Every function here treats
// it as unreliable: reads fall back to safe defaults, writes report failure
// via exceptions with beginner-readable messages.

function readIndex(): string[] {
  try {
    const raw = localStorage.getItem(INDEX_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === 'string');
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

/**
 * Saves a project under a normalized name. Throws a friendly Error when the
 * name is unusable or storage is unavailable/full.
 */
export function saveProject(name: string, workspaceJson: unknown): ProjectFile {
  const normalized = normalizeProjectName(name);
  if (!normalized) {
    throw new Error('Please give the project a name before saving.');
  }
  const project: ProjectFile = {
    formatVersion: CURRENT_FORMAT_VERSION,
    name: normalized,
    updatedAt: new Date().toISOString(),
    workspaceJson,
  };
  try {
    localStorage.setItem(STORAGE_PREFIX + normalized, JSON.stringify(project));
    const names = readIndex();
    if (!names.includes(normalized)) writeIndex([...names, normalized]);
  } catch {
    throw new Error('Could not save — browser storage is full or unavailable. Try exporting the project instead.');
  }
  return project;
}

/**
 * Loads a saved project, returning null when it is missing or its stored data
 * is corrupted (rather than throwing into the UI).
 */
export function loadProject(name: string): ProjectFile | null {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + name);
    if (!raw) return null;
    return validateProjectFile(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function deleteProject(name: string): void {
  try {
    localStorage.removeItem(STORAGE_PREFIX + name);
    writeIndex(readIndex().filter((n) => n !== name));
  } catch {
    // Deleting from unavailable storage is a no-op.
  }
}
