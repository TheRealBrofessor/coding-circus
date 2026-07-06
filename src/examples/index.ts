/**
 * Starter projects, stored as Blockly workspace-serialization JSON — the same
 * format saved projects use, so loading an example is exactly like loading a
 * project. Each one is small, runs in the browser (except "Ask & Answer",
 * which teaches input() and explains itself), and demonstrates one concept.
 */

export interface ExampleProject {
  id: string;
  label: string;
  projectName: string;
  state: object;
}

function program(blocks: object[], variables?: { name: string; id: string }[]): object {
  return {
    ...(variables ? { variables } : {}),
    blocks: { languageVersion: 0, blocks },
  };
}

const str = (text: string) => ({ type: 'python_string', fields: { TEXT: text } });
const num = (value: number) => ({ type: 'python_number', fields: { NUM: value } });
const print = (value: object, next?: object) => ({
  type: 'python_print',
  inputs: { VALUE: { block: value } },
  ...(next ? { next: { block: next } } : {}),
});

export const EXAMPLES: ExampleProject[] = [
  {
    id: 'hello-world',
    label: 'Hello World',
    projectName: 'example-hello-world',
    state: program([
      {
        ...print(str('Hello, world!'), print(str('Welcome to Coding Circus 🎪'))),
        x: 40,
        y: 40,
      },
    ]),
  },
  {
    id: 'variables',
    label: 'Variables',
    projectName: 'example-variables',
    state: program(
      [
        {
          type: 'python_var_set',
          x: 40,
          y: 40,
          fields: { VAR: { id: 'score-id' } },
          inputs: { VALUE: { block: num(10) } },
          next: {
            block: {
              type: 'python_var_set',
              fields: { VAR: { id: 'score-id' } },
              inputs: {
                VALUE: {
                  block: {
                    type: 'python_math_op',
                    fields: { OP: 'ADD' },
                    inputs: {
                      A: { block: { type: 'python_var_get', fields: { VAR: { id: 'score-id' } } } },
                      B: { block: num(5) },
                    },
                  },
                },
              },
              next: { block: { type: 'python_print_var', fields: { VAR: { id: 'score-id' } } } },
            },
          },
        },
      ],
      [{ name: 'score', id: 'score-id' }],
    ),
  },
  {
    id: 'if-else',
    label: 'If / Else',
    projectName: 'example-if-else',
    state: program(
      [
        {
          type: 'python_var_set',
          x: 40,
          y: 40,
          fields: { VAR: { id: 'coin-id' } },
          inputs: {
            VALUE: {
              block: {
                type: 'python_random_int',
                inputs: { FROM: { block: num(0) }, TO: { block: num(1) } },
              },
            },
          },
          next: {
            block: {
              type: 'python_if_else',
              inputs: {
                CONDITION: {
                  block: {
                    type: 'python_compare',
                    fields: { OP: 'EQ' },
                    inputs: {
                      A: { block: { type: 'python_var_get', fields: { VAR: { id: 'coin-id' } } } },
                      B: { block: num(0) },
                    },
                  },
                },
                DO: { block: print(str('Heads!')) },
                ELSE: { block: print(str('Tails!')) },
              },
            },
          },
        },
      ],
      [{ name: 'coin', id: 'coin-id' }],
    ),
  },
  {
    id: 'repeat-loop',
    label: 'Repeat Loop',
    projectName: 'example-repeat-loop',
    state: program([
      {
        type: 'python_repeat',
        x: 40,
        y: 40,
        inputs: {
          TIMES: { block: num(5) },
          DO: {
            block: {
              ...print(str('Around the ring we go! 🎠')),
              next: {
                block: {
                  type: 'python_wait',
                  inputs: { SECONDS: { block: num(0.3) } },
                },
              },
            },
          },
        },
      },
    ]),
  },
  {
    id: 'input',
    label: 'Ask & Answer (input)',
    projectName: 'example-input',
    state: program(
      [
        {
          type: 'python_comment',
          x: 40,
          y: 40,
          fields: { TEXT: 'input() needs a keyboard: export this as .py and run it with Python!' },
          next: {
            block: {
              type: 'python_var_set',
              fields: { VAR: { id: 'name-id' } },
              inputs: {
                VALUE: {
                  block: {
                    type: 'python_ask_text',
                    inputs: { QUESTION: { block: str('What is your name? ') } },
                  },
                },
              },
              next: {
                block: print({
                  type: 'python_join',
                  inputs: {
                    A: { block: str('Hello, ') },
                    B: { block: { type: 'python_var_get', fields: { VAR: { id: 'name-id' } } } },
                  },
                }),
              },
            },
          },
        },
      ],
      [{ name: 'name', id: 'name-id' }],
    ),
  },
  {
    id: 'lists',
    label: 'Lists',
    projectName: 'example-lists',
    state: program(
      [
        {
          type: 'python_var_set',
          x: 40,
          y: 40,
          fields: { VAR: { id: 'acts-id' } },
          inputs: {
            VALUE: {
              block: {
                type: 'python_list_create',
                inputs: {
                  ITEM0: { block: str('juggler') },
                  ITEM1: { block: str('acrobat') },
                  ITEM2: { block: str('clown') },
                },
              },
            },
          },
          next: {
            block: {
              type: 'python_list_append',
              inputs: {
                ITEM: { block: str('lion tamer') },
                LIST: { block: { type: 'python_var_get', fields: { VAR: { id: 'acts-id' } } } },
              },
              next: {
                block: {
                  type: 'python_for_each',
                  fields: { VAR: { id: 'act-id' } },
                  inputs: {
                    LIST: { block: { type: 'python_var_get', fields: { VAR: { id: 'acts-id' } } } },
                    DO: {
                      block: print({ type: 'python_var_get', fields: { VAR: { id: 'act-id' } } }),
                    },
                  },
                },
              },
            },
          },
        },
      ],
      [
        { name: 'acts', id: 'acts-id' },
        { name: 'act', id: 'act-id' },
      ],
    ),
  },
  {
    id: 'random',
    label: 'Random',
    projectName: 'example-random',
    state: program(
      [
        {
          type: 'python_var_set',
          x: 40,
          y: 40,
          fields: { VAR: { id: 'dice-id' } },
          inputs: {
            VALUE: {
              block: {
                type: 'python_random_int',
                inputs: { FROM: { block: num(1) }, TO: { block: num(6) } },
              },
            },
          },
          next: {
            block: {
              type: 'python_print_var',
              fields: { VAR: { id: 'dice-id' } },
              next: {
                block: {
                  type: 'python_say',
                  inputs: {
                    VALUE: {
                      block: {
                        type: 'python_random_choice',
                        inputs: {
                          LIST: {
                            block: {
                              type: 'python_list_create',
                              inputs: {
                                ITEM0: { block: str('🎪') },
                                ITEM1: { block: str('🤹') },
                                ITEM2: { block: str('🎠') },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ],
      [{ name: 'dice', id: 'dice-id' }],
    ),
  },
];
