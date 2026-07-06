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
      name: 'Text',
      colour: '160',
      contents: [
        {
          kind: 'block',
          type: 'python_print',
          inputs: { VALUE: { shadow: { type: 'python_string', fields: { TEXT: 'Hello, world!' } } } },
        },
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
        { kind: 'block', type: 'python_repeat_until' },
        {
          kind: 'block',
          type: 'python_count_with',
          inputs: {
            FROM: { shadow: { type: 'python_number', fields: { NUM: 1 } } },
            TO: { shadow: { type: 'python_number', fields: { NUM: 10 } } },
          },
        },
        { kind: 'block', type: 'python_break' },
        { kind: 'block', type: 'python_continue' },
        {
          kind: 'block',
          type: 'python_wait',
          inputs: { SECONDS: { shadow: { type: 'python_number', fields: { NUM: 0.5 } } } },
        },
      ],
    },
    {
      kind: 'category',
      name: 'Input',
      colour: '20',
      contents: [
        {
          kind: 'block',
          type: 'python_ask_text',
          inputs: { QUESTION: { shadow: { type: 'python_string', fields: { TEXT: 'What is your name?' } } } },
        },
        {
          kind: 'block',
          type: 'python_ask_number',
          inputs: { QUESTION: { shadow: { type: 'python_string', fields: { TEXT: 'Pick a number:' } } } },
        },
        {
          kind: 'block',
          type: 'python_ask_integer',
          inputs: { QUESTION: { shadow: { type: 'python_string', fields: { TEXT: 'Pick a whole number:' } } } },
        },
      ],
    },
    {
      kind: 'category',
      name: 'Lists',
      colour: '260',
      contents: [
        { kind: 'block', type: 'python_list_create' },
        { kind: 'block', type: 'python_list_append' },
        {
          kind: 'block',
          type: 'python_list_get',
          inputs: { INDEX: { shadow: { type: 'python_number', fields: { NUM: 0 } } } },
        },
        { kind: 'block', type: 'python_list_length' },
        { kind: 'block', type: 'python_for_each' },
      ],
    },
    {
      kind: 'category',
      name: 'Random',
      colour: '40',
      contents: [
        {
          kind: 'block',
          type: 'python_random_int',
          inputs: {
            FROM: { shadow: { type: 'python_number', fields: { NUM: 1 } } },
            TO: { shadow: { type: 'python_number', fields: { NUM: 10 } } },
          },
        },
        { kind: 'block', type: 'python_random_float' },
        { kind: 'block', type: 'python_random_choice' },
      ],
    },
    {
      kind: 'category',
      name: 'Functions',
      colour: '290',
      contents: [
        { kind: 'block', type: 'python_def' },
        { kind: 'block', type: 'python_call' },
        { kind: 'block', type: 'python_call_value' },
        { kind: 'block', type: 'python_return' },
      ],
    },
    {
      kind: 'category',
      name: 'Debug',
      colour: '65',
      contents: [
        { kind: 'block', type: 'python_print_var' },
        { kind: 'block', type: 'python_show_type' },
        { kind: 'block', type: 'python_assert' },
        { kind: 'block', type: 'python_comment' },
      ],
    },
    {
      kind: 'category',
      name: 'Stage',
      colour: '180',
      contents: [
        {
          kind: 'block',
          type: 'python_say',
          inputs: { VALUE: { shadow: { type: 'python_string', fields: { TEXT: 'Ta-da!' } } } },
        },
        { kind: 'block', type: 'python_clear_stage' },
      ],
    },
  ],
};
