import { beforeEach, describe, expect, it } from 'vitest';
import { deleteProject, listProjects, loadProject, saveProject } from './ProjectStorage';

const INDEX_KEY = 'coding-circus:project-index';
const PREFIX = 'coding-circus:project:';

describe('ProjectStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('round-trips a project through save and load', () => {
    const workspaceJson = { blocks: { languageVersion: 0, blocks: [] } };
    const saved = saveProject('  My Game ', workspaceJson);
    expect(saved.name).toBe('My Game');
    expect(listProjects()).toEqual(['My Game']);

    const loaded = loadProject('My Game');
    expect(loaded).not.toBeNull();
    expect(loaded!.workspaceJson).toEqual(workspaceJson);
    expect(loaded!.formatVersion).toBe(1);
  });

  it('rejects unusable names with a friendly error', () => {
    expect(() => saveProject('   ', {})).toThrowError(/name/i);
  });

  it('returns null for missing projects', () => {
    expect(loadProject('ghost')).toBeNull();
  });

  it('returns null instead of throwing for corrupt stored data', () => {
    localStorage.setItem(`${PREFIX}bad`, '{definitely not json');
    expect(loadProject('bad')).toBeNull();

    localStorage.setItem(`${PREFIX}wrong-shape`, JSON.stringify({ hello: 'world' }));
    expect(loadProject('wrong-shape')).toBeNull();
  });

  it('self-heals a corrupt index', () => {
    localStorage.setItem(INDEX_KEY, '"not an array"');
    expect(listProjects()).toEqual([]);

    localStorage.setItem(INDEX_KEY, JSON.stringify(['ok', 42, null, 'fine']));
    expect(listProjects()).toEqual(['ok', 'fine']);
  });

  it('deletes projects and updates the index', () => {
    saveProject('keep', {});
    saveProject('drop', {});
    deleteProject('drop');
    expect(listProjects()).toEqual(['keep']);
    expect(loadProject('drop')).toBeNull();
  });

  it('overwrites when saving under an existing name without duplicating the index entry', () => {
    saveProject('same', { v: 1 });
    saveProject('same', { v: 2 });
    expect(listProjects()).toEqual(['same']);
    expect(loadProject('same')!.workspaceJson).toEqual({ v: 2 });
  });
});
