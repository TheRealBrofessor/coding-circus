import * as Blockly from 'blockly/core';

const HUE = 35;

Blockly.common.defineBlocksWithJsonArray([
  {
    type: 'python_random_int',
    message0: 'random integer from %1 to %2',
    args0: [
      { type: 'input_value', name: 'A', check: 'Number' },
      { type: 'input_value', name: 'B', check: 'Number' },
    ],
    inputsInline: true,
    output: 'Number',
    colour: HUE,
    tooltip: 'Pick a random whole number in a range.',
    helpUrl: '',
  },
  {
    type: 'python_random_choice',
    message0: 'random choice from %1',
    args0: [{ type: 'input_value', name: 'LIST' }],
    output: null,
    colour: HUE,
    tooltip: 'Pick one random item from a list.',
    helpUrl: '',
  },
]);
