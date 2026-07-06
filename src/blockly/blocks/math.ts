import * as Blockly from 'blockly/core';

Blockly.common.defineBlocksWithJsonArray([
  {
    type: 'python_math_op',
    message0: '%1 %2 %3',
    args0: [
      { type: 'input_value', name: 'A', check: 'Number' },
      {
        type: 'field_dropdown',
        name: 'OP',
        options: [
          ['+', 'ADD'],
          ['-', 'MINUS'],
          ['×', 'MULTIPLY'],
          ['÷', 'DIVIDE'],
          ['//', 'FLOOR_DIVIDE'],
          ['%', 'MODULO'],
          ['**', 'POWER'],
        ],
      },
      { type: 'input_value', name: 'B', check: 'Number' },
    ],
    inputsInline: true,
    output: 'Number',
    colour: 230,
    tooltip: 'Do arithmetic on two numbers.',
    helpUrl: '',
  },
  {
    type: 'python_compare',
    message0: '%1 %2 %3',
    args0: [
      { type: 'input_value', name: 'A' },
      {
        type: 'field_dropdown',
        name: 'OP',
        options: [
          ['=', 'EQ'],
          ['≠', 'NEQ'],
          ['<', 'LT'],
          ['≤', 'LTE'],
          ['>', 'GT'],
          ['≥', 'GTE'],
        ],
      },
      { type: 'input_value', name: 'B' },
    ],
    inputsInline: true,
    output: 'Boolean',
    colour: 210,
    tooltip: 'Compare two values.',
    helpUrl: '',
  },
]);
