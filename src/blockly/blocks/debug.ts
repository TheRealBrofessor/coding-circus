import * as Blockly from 'blockly/core';

const HUE = 65;

Blockly.common.defineBlocksWithJsonArray([
  {
    type: 'python_print_var',
    message0: 'print variable %1 with its name',
    args0: [{ type: 'field_variable', name: 'VAR', variable: 'item' }],
    previousStatement: null,
    nextStatement: null,
    colour: HUE,
    tooltip: 'Print a variable together with its name, like "score = 10". Handy for debugging.',
    helpUrl: '',
  },
  {
    type: 'python_show_type',
    message0: 'type of %1',
    args0: [{ type: 'input_value', name: 'VALUE' }],
    inputsInline: true,
    output: 'String',
    colour: HUE,
    tooltip: "Get a value's Python type name, like int, str, or list.",
    helpUrl: '',
  },
  {
    type: 'python_assert',
    message0: 'check that %1 or stop with %2',
    args0: [
      { type: 'input_value', name: 'CONDITION', check: 'Boolean' },
      { type: 'field_input', name: 'MESSAGE', text: 'something went wrong' },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: HUE,
    tooltip: 'Stop the program with a message if the condition is not true.',
    helpUrl: '',
  },
]);
