import type { NormalizedError } from './RunResult';

const PROGRAM_FILENAME = '<program>';

/** Beginner-friendly explanations for the exception types learners hit most often. */
const HINTS: Record<string, string> = {
  NameError:
    "You used a name (probably a variable) that hasn't been created yet. Check for a missing 'set' block, or a typo in the name.",
  SyntaxError:
    'The generated Python is not valid. This usually means blocks are connected in a way that breaks the code shape.',
  IndentationError:
    'A block of code is indented incorrectly. This usually points to a bug in code generation rather than something you did.',
  TypeError:
    "You combined two values that don't work together this way (e.g. adding text and a number). Check the value blocks you plugged in.",
  ValueError: 'A value was the right type but not a valid value for this operation.',
  ZeroDivisionError: "You divided a number by zero, which Python doesn't allow.",
  IndexError: "You tried to access a position in a list that doesn't exist.",
  KeyError: "You tried to look up a key that doesn't exist.",
  AttributeError: "You tried to use a feature that this value doesn't have.",
  RecursionError: 'Your program called itself too many times without stopping. Check your loop or repeat conditions.',
  KeyboardInterrupt: 'The program was stopped before it finished.',
};

function extractExceptionType(traceback: string): string {
  const lines = traceback.trim().split('\n');
  const lastLine = lines[lines.length - 1] ?? '';
  const match = lastLine.match(/^([A-Za-z_][A-Za-z0-9_.]*)\s*:/);
  return match ? match[1] : 'Error';
}

function extractMessage(traceback: string): string {
  const lines = traceback.trim().split('\n');
  const lastLine = lines[lines.length - 1] ?? '';
  const match = lastLine.match(/^[A-Za-z_][A-Za-z0-9_.]*:\s*(.*)$/);
  return match ? match[1] : lastLine;
}

function extractLine(traceback: string): number | undefined {
  const pattern = new RegExp(`File "${PROGRAM_FILENAME}", line (\\d+)`, 'g');
  let lastMatch: RegExpExecArray | null = null;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(traceback)) !== null) {
    lastMatch = match;
  }
  return lastMatch ? Number(lastMatch[1]) : undefined;
}

/** Turn a raw Python traceback (from code compiled under PROGRAM_FILENAME) into a NormalizedError. */
export function normalizeError(rawTraceback: string): NormalizedError {
  const type = extractExceptionType(rawTraceback);
  const detail = extractMessage(rawTraceback);
  const line = extractLine(rawTraceback);
  const hint = HINTS[type];
  const lineSuffix = line ? ` (line ${line})` : '';
  const message = detail ? `${type}: ${detail}${lineSuffix}` : `${type}${lineSuffix}`;

  return {
    type,
    message,
    line,
    hint,
    rawTraceback,
  };
}

export { PROGRAM_FILENAME };
