import type * as Blockly from 'blockly/core';

/** The complete set of blocks available to learners. Only our own python_* blocks are exposed. */
export const toolbox: Blockly.utils.toolbox.ToolboxInfo = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Values',
      colour: '160',
      contents: [
        { kind: 'block', type: 'python_string' },
        { kind: 'block', type: 'python_number' },
        { kind: 'block', type: 'python_boolean' },
      ],
    },
    {
      kind: 'category',
      name: 'Variables',
      colour: '330',
      contents: [
        {
          kind: 'block',
          type: 'python_var_set',
          inputs: { VALUE: { shadow: { type: 'python_string', fields: { TEXT: '' } } } },
        },
        { kind: 'block', type: 'python_var_get' },
      ],
    },
    {
      kind: 'category',
      name: 'Input / Output',
      colour: '20',
      contents: [
        { kind: 'block', type: 'python_input_text' },
        { kind: 'block', type: 'python_input_number' },
        {
          kind: 'block',
          type: 'python_print',
          inputs: { VALUE: { shadow: { type: 'python_string', fields: { TEXT: 'Hello, world!' } } } },
        },
      ],
    },
    {
      kind: 'category',
      name: 'Text',
      colour: '160',
      contents: [
        { kind: 'block', type: 'python_join' },
        { kind: 'block', type: 'python_comment' },
      ],
    },
    {
      kind: 'category',
      name: 'Math',
      colour: '230',
      contents: [
        {
          kind: 'block',
          type: 'python_math_op',
          inputs: {
            A: { shadow: { type: 'python_number', fields: { NUM: 1 } } },
            B: { shadow: { type: 'python_number', fields: { NUM: 1 } } },
          },
        },
        { kind: 'block', type: 'python_compare' },
      ],
    },
    {
      kind: 'category',
      name: 'Logic',
      colour: '210',
      contents: [
        { kind: 'block', type: 'python_logic_op' },
        { kind: 'block', type: 'python_not' },
      ],
    },
    {
      kind: 'category',
      name: 'Randomness',
      colour: '35',
      contents: [
        {
          kind: 'block',
          type: 'python_random_int',
          inputs: {
            A: { shadow: { type: 'python_number', fields: { NUM: 1 } } },
            B: { shadow: { type: 'python_number', fields: { NUM: 10 } } },
          },
        },
        {
          kind: 'block',
          type: 'python_random_choice',
          inputs: {
            LIST: {
              shadow: {
                type: 'python_list_create',
                inputs: {
                  A: { shadow: { type: 'python_string', fields: { TEXT: 'heads' } } },
                  B: { shadow: { type: 'python_string', fields: { TEXT: 'tails' } } },
                },
              },
            },
          },
        },
      ],
    },
    {
      kind: 'category',
      name: 'Lists',
      colour: '260',
      contents: [
        {
          kind: 'block',
          type: 'python_list_create',
          inputs: {
            A: { shadow: { type: 'python_string', fields: { TEXT: 'apple' } } },
            B: { shadow: { type: 'python_string', fields: { TEXT: 'banana' } } },
            C: { shadow: { type: 'python_string', fields: { TEXT: 'cherry' } } },
          },
        },
        {
          kind: 'block',
          type: 'python_list_append',
          inputs: {
            ITEM: { shadow: { type: 'python_string', fields: { TEXT: 'new item' } } },
          },
        },
        {
          kind: 'block',
          type: 'python_list_get',
          inputs: { INDEX: { shadow: { type: 'python_number', fields: { NUM: 0 } } } },
        },
        { kind: 'block', type: 'python_list_length' },
      ],
    },
    {
      kind: 'category',
      name: 'Control',
      colour: '120',
      contents: [
        { kind: 'block', type: 'python_if' },
        { kind: 'block', type: 'python_if_else' },
        {
          kind: 'block',
          type: 'python_repeat',
          inputs: { TIMES: { shadow: { type: 'python_number', fields: { NUM: 10 } } } },
        },
        { kind: 'block', type: 'python_while' },
        { kind: 'block', type: 'python_for_each' },
        {
          kind: 'block',
          type: 'python_wait',
          inputs: { SECONDS: { shadow: { type: 'python_number', fields: { NUM: 0.5 } } } },
        },
      ],
    },
    {
      kind: 'category',
      name: 'Functions',
      colour: '290',
      contents: [
        { kind: 'block', type: 'python_function_def' },
        { kind: 'block', type: 'python_function_call' },
        {
          kind: 'block',
          type: 'python_return',
          inputs: { VALUE: { shadow: { type: 'python_string', fields: { TEXT: 'result' } } } },
        },
      ],
    },
  ],
};
