import type { PythonGenerator } from 'blockly/python';

/**
 * Shared safety helpers for the Python generators.
 *
 * Corrupt or hand-edited project JSON can put arbitrary values into dropdown
 * fields, number fields, and text fields. Nothing that comes out of a field is
 * trusted to be well-formed here — every generator routes field values through
 * one of these helpers so the worst possible outcome is blander Python, never
 * a generator crash or a Python syntax error.
 */

/**
 * Looks up a dropdown operator in a table, falling back to a known-good key
 * when the stored value is missing or unrecognized (e.g. corrupt import).
 */
export function pickOperator<T>(table: Record<string, T>, key: unknown, fallbackKey: string): T {
  if (typeof key === 'string' && key in table) return table[key];
  return table[fallbackKey];
}

/**
 * Converts a number-field value to a Python-safe numeric literal.
 * NaN/Infinity (possible via corrupt JSON) become "0" instead of invalid Python.
 */
export function safeNumber(raw: unknown): string {
  const n = Number(raw);
  if (!Number.isFinite(n)) return '0';
  return String(n);
}

/**
 * Strips line breaks and control characters from single-line text destined for
 * comments or other non-quoted contexts, so a crafted field value cannot
 * inject extra Python lines into the generated program.
 */
export function sanitizeInlineText(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  return (
    raw
      .replace(/[\r\n\u2028\u2029]+/g, ' ')
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '')
  );
}

const PYTHON_KEYWORDS = new Set([
  'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue',
  'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import',
  'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while',
  'with', 'yield', 'print', 'input', 'len', 'range', 'type',
]);

/**
 * Turns free-form text (e.g. a typed function name) into a legal, collision-safe
 * Python identifier. Falls back to the given default when nothing usable remains.
 */
export function legalizePythonName(raw: unknown, fallback: string): string {
  const cleaned = (typeof raw === 'string' ? raw : '')
    .trim()
    .replace(/[^A-Za-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '');
  let name = cleaned || fallback;
  if (/^[0-9]/.test(name)) name = `_${name}`;
  if (PYTHON_KEYWORDS.has(name)) name = `${name}_`;
  return name;
}

/**
 * Registers a top-of-file definition (like an import) exactly once.
 *
 * This is the single sanctioned crossing into Blockly's protected
 * `definitions_` map — TypeScript marks it protected, but it is the documented
 * mechanism the stock generators themselves use for hoisted imports, and
 * funnelling every use through this helper keeps the unsafe cast in one place.
 */
export function addDefinition(generator: PythonGenerator, key: string, code: string): void {
  (generator as unknown as { definitions_: Record<string, string> }).definitions_[key] = code;
}

/**
 * Reserves a variable name that will not collide with any user variable.
 *
 * Wraps Blockly's internal `nameDB_` (initialised by `pythonGenerator.init`);
 * if it is somehow absent, the base name is returned unchanged, which is still
 * valid Python — just with a small collision risk instead of a crash.
 */
export function distinctName(generator: PythonGenerator, base: string): string {
  const nameDB = (
    generator as unknown as {
      nameDB_?: { getDistinctName(name: string, type: string): string };
    }
  ).nameDB_;
  return nameDB ? nameDB.getDistinctName(base, 'VARIABLE') : base;
}
