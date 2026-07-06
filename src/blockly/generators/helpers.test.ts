import { describe, expect, it } from 'vitest';
import { legalizePythonName, pickOperator, safeNumber, sanitizeInlineText } from './helpers';

describe('pickOperator', () => {
  const table = { ADD: '+', MINUS: '-' };

  it('returns the mapped operator for a known key', () => {
    expect(pickOperator(table, 'MINUS', 'ADD')).toBe('-');
  });

  it('falls back for unknown, missing, or non-string keys', () => {
    expect(pickOperator(table, 'EVIL', 'ADD')).toBe('+');
    expect(pickOperator(table, undefined, 'ADD')).toBe('+');
    expect(pickOperator(table, 42, 'ADD')).toBe('+');
  });
});

describe('safeNumber', () => {
  it('passes through finite numbers', () => {
    expect(safeNumber(5)).toBe('5');
    expect(safeNumber(-3.25)).toBe('-3.25');
    expect(safeNumber('12')).toBe('12');
  });

  it('never emits invalid Python literals', () => {
    expect(safeNumber(NaN)).toBe('0');
    expect(safeNumber(Infinity)).toBe('0');
    expect(safeNumber(-Infinity)).toBe('0');
    expect(safeNumber('not a number')).toBe('0');
    expect(safeNumber(undefined)).toBe('0');
  });
});

describe('sanitizeInlineText', () => {
  it('collapses line breaks into spaces', () => {
    expect(sanitizeInlineText('a\nb\r\nc')).toBe('a b c');
  });

  it('strips control characters', () => {
    expect(sanitizeInlineText('a\x00b\x1fc')).toBe('abc');
  });

  it('handles non-string input', () => {
    expect(sanitizeInlineText(undefined)).toBe('');
    expect(sanitizeInlineText(42)).toBe('');
  });
});

describe('legalizePythonName', () => {
  it('turns free text into a legal identifier', () => {
    expect(legalizePythonName('My Cool Function!', 'fn')).toBe('My_Cool_Function');
  });

  it('prefixes names starting with a digit', () => {
    expect(legalizePythonName('2fast', 'fn')).toBe('_2fast');
  });

  it('avoids Python keywords and builtins', () => {
    expect(legalizePythonName('def', 'fn')).toBe('def_');
    expect(legalizePythonName('print', 'fn')).toBe('print_');
  });

  it('falls back when nothing usable remains', () => {
    expect(legalizePythonName('!!!', 'my_function')).toBe('my_function');
    expect(legalizePythonName(undefined, 'my_function')).toBe('my_function');
  });
});
