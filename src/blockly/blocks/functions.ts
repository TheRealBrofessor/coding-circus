import * as Blockly from 'blockly/core';

const HUE = 290;

Blockly.common.defineBlocksWithJsonArray([
  {
    type: 'python_function_def',
    message0: 'define function %1',
    args0: [{ type: 'field_input', name: 'NAME', text: 'my_function' }],
    message1: '%1',
    args1: [{ type: 'input_statement', name: 'DO' }],
    previousStatement: null,
    nextStatement: null,
    colour: HUE,
    tooltip: 'Create a function.',
    helpUrl: '',
  },
  {
    type: 'python_function_call',
    message0: 'call function %1',
    args0: [{ type: 'field_input', name: 'NAME', text: 'my_function' }],
    previousStatement: null,
    nextStatement: null,
    colour: HUE,
    tooltip: 'Run a function.',
    helpUrl: '',
  },
  {
    type: 'python_return',
    message0: 'return %1',
    args0: [{ type: 'input_value', name: 'VALUE' }],
    previousStatement: null,
    colour: HUE,
    tooltip: 'Return a value from a function.',
    helpUrl: '',
  },
]);
