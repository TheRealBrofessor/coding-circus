import { describe, expect, it } from 'vitest';
import { normalizeProjectName, sanitizeFilename, validateProjectFile } from './validation';

describe('normalizeProjectName', () => {
  it('trims and returns usable names', () => {
    expect(normalizeProjectName('  My Game  ')).toBe('My Game');
  });

  it('strips control characters', () => {
    expect(normalizeProjectName('a\x00b\nc')).toBe('abc');
  });

  it('caps overly long names', () => {
    expect(normalizeProjectName('x'.repeat(200))!.length).toBe(60);
  });

  it('rejects unusable input', () => {
    expect(normalizeProjectName('')).toBeNull();
    expect(normalizeProjectName('   ')).toBeNull();
    expect(normalizeProjectName(42)).toBeNull();
  });
});

describe('sanitizeFilename', () => {
  it('replaces path separators and reserved characters', () => {
    expect(sanitizeFilename('a/b\\c:d*e?f"g<h>i|j')).toBe('a-b-c-d-e-f-g-h-i-j');
  });

  it('never returns an empty or dot-only name', () => {
    expect(sanitizeFilename('')).toBe('project');
    expect(sanitizeFilename('...')).toBe('project');
    expect(sanitizeFilename(undefined)).toBe('project');
  });
});

describe('validateProjectFile', () => {
  const valid = { formatVersion: 1, name: 'demo', updatedAt: '2026-01-01T00:00:00Z', workspaceJson: { blocks: {} } };

  it('accepts a well-formed project and round-trips it', () => {
    const project = validateProjectFile(JSON.parse(JSON.stringify(valid)));
    expect(project.name).toBe('demo');
    expect(project.formatVersion).toBe(1);
    expect(project.workspaceJson).toEqual({ blocks: {} });
  });

  it('defaults a missing or junk name instead of failing', () => {
    expect(validateProjectFile({ ...valid, name: undefined }).name).toBe('imported-project');
    expect(validateProjectFile({ ...valid, name: '   ' }).name).toBe('imported-project');
  });

  it.each([
    ['null', null],
    ['an array', []],
    ['a string', 'nope'],
    ['missing formatVersion', { workspaceJson: {} }],
    ['string formatVersion', { formatVersion: '1', workspaceJson: {} }],
    ['zero formatVersion', { formatVersion: 0, workspaceJson: {} }],
    ['missing workspaceJson', { formatVersion: 1 }],
    ['string workspaceJson', { formatVersion: 1, workspaceJson: 'blocks' }],
  ])('rejects %s', (_label, input) => {
    expect(() => validateProjectFile(input)).toThrowError();
  });

  it('rejects future format versions with an upgrade message', () => {
    expect(() => validateProjectFile({ formatVersion: 99, workspaceJson: {} })).toThrowError(/newer version/);
  });
});
