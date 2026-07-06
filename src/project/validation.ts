import type { ProjectFile } from './types';

/** Current on-disk project format. Bump + add a migration in validateProjectFile when it changes. */
export const CURRENT_FORMAT_VERSION = 1;

export const MAX_PROJECT_NAME_LENGTH = 60;

/**
 * Normalizes a user-typed project name: trims, strips control characters,
 * and caps the length. Returns null when nothing usable remains.
 */
export function normalizeProjectName(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const cleaned = raw
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1f\x7f]/g, '')
    .trim()
    .slice(0, MAX_PROJECT_NAME_LENGTH)
    .trim();
  return cleaned.length > 0 ? cleaned : null;
}

/**
 * Converts a project name into a safe download filename base: removes path
 * separators and characters that are reserved on common filesystems, and
 * never returns an empty or dot-only result.
 */
export function sanitizeFilename(raw: unknown): string {
  const cleaned = (typeof raw === 'string' ? raw : '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1f\x7f]/g, '')
    .replace(/[/\\:*?"<>|]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^\.+|\.+$/g, '');
  return cleaned || 'project';
}

/**
 * Validates untrusted parsed JSON as a ProjectFile. Throws a beginner-readable
 * Error describing what is wrong rather than letting malformed data flow into
 * Blockly deserialization. This is the single place to add format migrations.
 */
export function validateProjectFile(parsed: unknown): ProjectFile {
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error('This file is not a Coding Circus project (expected a JSON object).');
  }
  const candidate = parsed as Record<string, unknown>;

  if (typeof candidate.formatVersion !== 'number') {
    throw new Error('This file is not a Coding Circus project (missing formatVersion).');
  }
  if (candidate.formatVersion > CURRENT_FORMAT_VERSION) {
    throw new Error(
      `This project was made with a newer version of Coding Circus (format ${candidate.formatVersion}). Please update the app.`,
    );
  }
  if (candidate.formatVersion < 1) {
    throw new Error('This file is not a valid Coding Circus project (unknown format version).');
  }

  if (typeof candidate.workspaceJson !== 'object' || candidate.workspaceJson === null) {
    throw new Error('This project file has no block data in it.');
  }

  const name = normalizeProjectName(candidate.name) ?? 'imported-project';
  const updatedAt = typeof candidate.updatedAt === 'string' ? candidate.updatedAt : new Date().toISOString();

  return {
    formatVersion: CURRENT_FORMAT_VERSION,
    name,
    updatedAt,
    workspaceJson: candidate.workspaceJson,
  };
}
