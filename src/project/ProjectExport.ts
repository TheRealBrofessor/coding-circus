import type { ProjectFile } from './types';

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
  download(`${name || 'project'}.py`, code, 'text/x-python');
}

export function exportProjectJson(project: ProjectFile): void {
  download(`${project.name || 'project'}.json`, JSON.stringify(project, null, 2), 'application/json');
}

export async function readProjectJsonFile(file: File): Promise<ProjectFile> {
  const text = await file.text();
  const parsed = JSON.parse(text) as ProjectFile;
  if (parsed.formatVersion !== 1 || !parsed.workspaceJson) {
    throw new Error('This file is not a valid Coding Circus project.');
  }
  return parsed;
}
