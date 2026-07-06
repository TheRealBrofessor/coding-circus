import * as Blockly from 'blockly/core';

const HUE = 290;

// Simple name-matched functions (no parameters). Full parameter support needs
// Blockly mutators, which is out of scope for the beginner block set — see
// ARCHITECTURE.md.
Blockly.common.defineBlocksWithJsonArray([
  {
    type: 'python_def',
    message0: 'define function %1',
    args0: [{ type: 'field_input', name: 'NAME', text: 'my_function' }],
    message1: '%1',
    args1: [{ type: 'input_statement', name: 'DO' }],
    colour: HUE,
    tooltip: 'Create a reusable function. Give it a name, then call it by that name.',
    helpUrl: '',
  },
  {
    type: 'python_call',
    message0: 'call function %1',
    args0: [{ type: 'field_input', name: 'NAME', text: 'my_function' }],
    previousStatement: null,
    nextStatement: null,
    colour: HUE,
    tooltip: 'Run a function you defined. The name must match the definition.',
    helpUrl: '',
  },
  {
    type: 'python_call_value',
    message0: 'result of calling %1',
    args0: [{ type: 'field_input', name: 'NAME', text: 'my_function' }],
    output: null,
    colour: HUE,
    tooltip: "Run a function and use the value it returns.",
    helpUrl: '',
  },
  {
    type: 'python_return',
    message0: 'return %1',
    args0: [{ type: 'input_value', name: 'VALUE' }],
    inputsInline: true,
    previousStatement: null,
    colour: HUE,
    tooltip: 'Give a value back from inside a function. Only works inside "define function".',
    helpUrl: '',
  },
]);
