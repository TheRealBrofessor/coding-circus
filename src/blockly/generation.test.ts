import { describe, expect, it } from 'vitest';
import { codeFor } from './testUtils';

function statementProgram(block: object): object {
  return { blocks: { languageVersion: 0, blocks: [block] } };
}

describe('Python generation for common programs', () => {
  it('hello world', () => {
    const code = codeFor(
      statementProgram({
        type: 'python_print',
        inputs: { VALUE: { block: { type: 'python_string', fields: { TEXT: 'Hello, world!' } } } },
      }),
    );
    expect(code).toBe("print('Hello, world!')\n");
  });

  it('variables: set then print with name', () => {
    const code = codeFor({
      variables: [{ name: 'score', id: 'score-id' }],
      blocks: {
        languageVersion: 0,
        blocks: [
          {
            type: 'python_var_set',
            fields: { VAR: { id: 'score-id' } },
            inputs: { VALUE: { block: { type: 'python_number', fields: { NUM: 10 } } } },
            next: { block: { type: 'python_print_var', fields: { VAR: { id: 'score-id' } } } },
          },
        ],
      },
    });
    expect(code).toContain('score = 10');
    expect(code).toContain("print('score', '=', score)");
  });

  it('if/else with a comparison', () => {
    const code = codeFor(
      statementProgram({
        type: 'python_if_else',
        inputs: {
          CONDITION: {
            block: {
              type: 'python_compare',
              fields: { OP: 'GT' },
              inputs: {
                A: { block: { type: 'python_number', fields: { NUM: 5 } } },
                B: { block: { type: 'python_number', fields: { NUM: 3 } } },
              },
            },
          },
          DO: {
            block: {
              type: 'python_print',
              inputs: { VALUE: { block: { type: 'python_string', fields: { TEXT: 'big' } } } },
            },
          },
          ELSE: {
            block: {
              type: 'python_print',
              inputs: { VALUE: { block: { type: 'python_string', fields: { TEXT: 'small' } } } },
            },
          },
        },
      }),
    );
    expect(code).toBe("if 5 > 3:\n  print('big')\nelse:\n  print('small')\n");
  });

  it('repeat loop with wait hoists the time import once', () => {
    const code = codeFor(
      statementProgram({
        type: 'python_repeat',
        inputs: {
          TIMES: { block: { type: 'python_number', fields: { NUM: 3 } } },
          DO: {
            block: {
              type: 'python_wait',
              inputs: { SECONDS: { block: { type: 'python_number', fields: { NUM: 0.5 } } } },
              next: {
                block: {
                  type: 'python_wait',
                  inputs: { SECONDS: { block: { type: 'python_number', fields: { NUM: 0.5 } } } },
                },
              },
            },
          },
        },
      }),
    );
    expect(code.match(/import time/g)).toHaveLength(1);
    expect(code).toContain('for count in range(3):');
    expect(code).toContain('time.sleep(0.5)');
  });

  it('empty statement branches generate pass', () => {
    const code = codeFor(
      statementProgram({
        type: 'python_if',
        inputs: { CONDITION: { block: { type: 'python_boolean', fields: { BOOL: 'TRUE' } } } },
      }),
    );
    expect(code).toBe('if True:\n  pass\n');
  });

  it('lists: create, append, get, length, for-each', () => {
    const code = codeFor({
      variables: [
        { name: 'items', id: 'items-id' },
        { name: 'thing', id: 'thing-id' },
      ],
      blocks: {
        languageVersion: 0,
        blocks: [
          {
            type: 'python_var_set',
            fields: { VAR: { id: 'items-id' } },
            inputs: {
              VALUE: {
                block: {
                  type: 'python_list_create',
                  inputs: {
                    ITEM0: { block: { type: 'python_number', fields: { NUM: 1 } } },
                    ITEM1: { block: { type: 'python_number', fields: { NUM: 2 } } },
                  },
                },
              },
            },
            next: {
              block: {
                type: 'python_list_append',
                inputs: {
                  ITEM: { block: { type: 'python_number', fields: { NUM: 3 } } },
                  LIST: { block: { type: 'python_var_get', fields: { VAR: { id: 'items-id' } } } },
                },
                next: {
                  block: {
                    type: 'python_for_each',
                    fields: { VAR: { id: 'thing-id' } },
                    inputs: {
                      LIST: { block: { type: 'python_var_get', fields: { VAR: { id: 'items-id' } } } },
                    },
                  },
                },
              },
            },
          },
        ],
      },
    });
    expect(code).toContain('items = [1, 2]');
    expect(code).toContain('items.append(3)');
    expect(code).toContain('for thing in items:');
    expect(code).toContain('pass');
  });

  it('random blocks hoist a single import', () => {
    const code = codeFor(
      statementProgram({
        type: 'python_print',
        inputs: {
          VALUE: {
            block: {
              type: 'python_random_int',
              inputs: {
                FROM: { block: { type: 'python_number', fields: { NUM: 1 } } },
                TO: { block: { type: 'python_number', fields: { NUM: 10 } } },
              },
            },
          },
        },
      }),
    );
    expect(code.match(/import random/g)).toHaveLength(1);
    expect(code).toContain('print(random.randint(1, 10))');
  });

  it('functions: define, call, return, and name legalization', () => {
    const code = codeFor({
      blocks: {
        languageVersion: 0,
        blocks: [
          {
            type: 'python_def',
            fields: { NAME: 'My Cool Function!' },
            inputs: {
              DO: {
                block: {
                  type: 'python_return',
                  inputs: { VALUE: { block: { type: 'python_number', fields: { NUM: 7 } } } },
                },
              },
            },
          },
          {
            type: 'python_call',
            fields: { NAME: 'My Cool Function!' },
            x: 0,
            y: 200,
          },
        ],
      },
    });
    expect(code).toContain('def My_Cool_Function():');
    expect(code).toContain('return 7');
    expect(code).toContain('My_Cool_Function()');
  });

  it('count-with produces an inclusive range', () => {
    const code = codeFor({
      variables: [{ name: 'i', id: 'i-id' }],
      blocks: {
        languageVersion: 0,
        blocks: [
          {
            type: 'python_count_with',
            fields: { VAR: { id: 'i-id' } },
            inputs: {
              FROM: { block: { type: 'python_number', fields: { NUM: 1 } } },
              TO: { block: { type: 'python_number', fields: { NUM: 10 } } },
            },
          },
        ],
      },
    });
    expect(code).toContain('for i in range(1, 10 + 1):');
  });

  it('comment text cannot inject extra Python lines', () => {
    const code = codeFor(
      statementProgram({
        type: 'python_comment',
        fields: { TEXT: "note\nprint('injected')" },
      }),
    );
    expect(code).toBe("# note print('injected')\n");
  });

  it('ask blocks generate standard input() calls', () => {
    const code = codeFor({
      variables: [{ name: 'n', id: 'n-id' }],
      blocks: {
        languageVersion: 0,
        blocks: [
          {
            type: 'python_var_set',
            fields: { VAR: { id: 'n-id' } },
            inputs: {
              VALUE: {
                block: {
                  type: 'python_ask_number',
                  inputs: { QUESTION: { block: { type: 'python_string', fields: { TEXT: 'Pick:' } } } },
                },
              },
            },
          },
        ],
      },
    });
    expect(code).toContain("float(input('Pick:'))");
  });

  it('generated code never contains JS artifacts', () => {
    const code = codeFor(
      statementProgram({
        type: 'python_print',
        inputs: {
          VALUE: {
            block: {
              type: 'python_math_op',
              fields: { OP: 'DIVIDE' },
            },
          },
        },
      }),
    );
    expect(code).not.toMatch(/NaN|undefined|Infinity|null/);
    expect(code).toContain('print(0 / 0)');
  });
});
