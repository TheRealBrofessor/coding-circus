import * as Blockly from 'blockly/core';

const HUE = 210;

Blockly.common.defineBlocksWithJsonArray([
  {
    type: 'python_logic_op',
    message0: '%1 %2 %3',
    args0: [
      { type: 'input_value', name: 'A', check: 'Boolean' },
      {
        type: 'field_dropdown',
        name: 'OP',
        options: [
          ['and', 'AND'],
          ['or', 'OR'],
        ],
      },
      { type: 'input_value', name: 'B', check: 'Boolean' },
    ],
    inputsInline: true,
    output: 'Boolean',
    colour: HUE,
    tooltip: 'Combine two true/false values.',
    helpUrl: '',
  },
  {
    type: 'python_not',
    message0: 'not %1',
    args0: [{ type: 'input_value', name: 'A', check: 'Boolean' }],
    inputsInline: true,
    output: 'Boolean',
    colour: HUE,
    tooltip: 'Flip a true/false value.',
    helpUrl: '',
  },
]);
