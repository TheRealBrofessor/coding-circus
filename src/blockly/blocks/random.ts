import * as Blockly from 'blockly/core';

const HUE = 40;

Blockly.common.defineBlocksWithJsonArray([
  {
    type: 'python_random_int',
    message0: 'random whole number from %1 to %2',
    args0: [
      { type: 'input_value', name: 'FROM', check: 'Number' },
      { type: 'input_value', name: 'TO', check: 'Number' },
    ],
    inputsInline: true,
    output: 'Number',
    colour: HUE,
    tooltip: 'Pick a random whole number between the two values (both included).',
    helpUrl: '',
  },
  {
    type: 'python_random_float',
    message0: 'random decimal from 0 to 1',
    output: 'Number',
    colour: HUE,
    tooltip: 'Pick a random decimal number between 0 and 1.',
    helpUrl: '',
  },
  {
    type: 'python_random_choice',
    message0: 'random item from list %1',
    args0: [{ type: 'input_value', name: 'LIST', check: 'Array' }],
    inputsInline: true,
    output: null,
    colour: HUE,
    tooltip: 'Pick one item from a list at random.',
    helpUrl: '',
  },
]);
