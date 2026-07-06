import * as Blockly from 'blockly/core';

const HUE = 160;

Blockly.common.defineBlocksWithJsonArray([
  {
    type: 'python_print',
    message0: 'print %1',
    args0: [{ type: 'input_value', name: 'VALUE' }],
    previousStatement: null,
    nextStatement: null,
    colour: HUE,
    tooltip: 'Print a value to the console.',
    helpUrl: '',
  },
  {
    type: 'python_join',
    message0: 'join %1 %2',
    args0: [
      { type: 'input_value', name: 'A' },
      { type: 'input_value', name: 'B' },
    ],
    inputsInline: true,
    output: 'String',
    colour: HUE,
    tooltip: 'Join two pieces of text together.',
    helpUrl: '',
  },
  {
    type: 'python_comment',
    message0: '# %1',
    args0: [{ type: 'field_input', name: 'TEXT', text: 'note to self' }],
    previousStatement: null,
    nextStatement: null,
    colour: 65,
    tooltip: 'A comment. Has no effect when the program runs.',
    helpUrl: '',
  },
]);
