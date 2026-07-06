import { describe, expect, it } from 'vitest';
import { codeFor } from '../blockly/testUtils';
import { EXAMPLES } from './index';

describe('starter examples', () => {
  it('covers the advertised concepts', () => {
    const ids = EXAMPLES.map((e) => e.id);
    for (const required of ['hello-world', 'variables', 'if-else', 'repeat-loop', 'input', 'lists', 'random']) {
      expect(ids).toContain(required);
    }
  });

  it.each(EXAMPLES.map((e) => [e.label, e] as const))('"%s" loads and generates Python', (_label, example) => {
    const code = codeFor(example.state);
    expect(code.trim().length).toBeGreaterThan(0);
    expect(code).not.toMatch(/NaN|undefined|Infinity/);
  });

  it('every example has a unique id and a usable project name', () => {
    const ids = new Set(EXAMPLES.map((e) => e.id));
    expect(ids.size).toBe(EXAMPLES.length);
    for (const example of EXAMPLES) {
      expect(example.projectName.trim().length).toBeGreaterThan(0);
    }
  });
});
