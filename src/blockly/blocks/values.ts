import * as Blockly from 'blockly/core';

const HUE = 160;

Blockly.common.defineBlocksWithJsonArray([
  {
    type: 'python_string',
    message0: '%1',
    args0: [{ type: 'field_input', name: 'TEXT', text: 'hello' }],
    output: 'String',
    colour: HUE,
    tooltip: 'A piece of text.',
    helpUrl: '',
  },
  {
    type: 'python_number',
    message0: '%1',
    args0: [{ type: 'field_number', name: 'NUM', value: 0 }],
    output: 'Number',
    colour: 230,
    tooltip: 'A number.',
    helpUrl: '',
  },
  {
    type: 'python_boolean',
    message0: '%1',
    args0: [
      {
        type: 'field_dropdown',
        name: 'BOOL',
        options: [
          ['True', 'TRUE'],
          ['False', 'FALSE'],
        ],
      },
    ],
    output: 'Boolean',
    colour: 210,
    tooltip: 'True or False.',
    helpUrl: '',
  },
]);
