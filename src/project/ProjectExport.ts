import type { ProjectFile } from './types';
import { sanitizeFilename, validateProjectFile } from './validation';

const MAX_IMPORT_BYTES = 5 * 1024 * 1024;

function download(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportPython(name: string, code: string): void {
  download(`${sanitizeFilename(name)}.py`, code, 'text/x-python');
}

export function exportProjectJson(project: ProjectFile): void {
  download(`${sanitizeFilename(project.name)}.json`, JSON.stringify(project, null, 2), 'application/json');
}

/**
 * Reads and validates an imported project file. All failure modes (wrong file
 * type, oversized file, invalid JSON, wrong shape, future format versions)
 * throw an Error with a beginner-readable message.
 */
export async function readProjectJsonFile(file: File): Promise<ProjectFile> {
  if (file.size > MAX_IMPORT_BYTES) {
    throw new Error('That file is too large to be a Coding Circus project.');
  }
  const text = await file.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('That file is not valid JSON, so it cannot be a Coding Circus project.');
  }
  return validateProjectFile(parsed);
}
