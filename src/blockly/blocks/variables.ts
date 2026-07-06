import * as Blockly from 'blockly/core';

const HUE = 330;

Blockly.common.defineBlocksWithJsonArray([
  {
    type: 'python_var_set',
    message0: 'set %1 to %2',
    args0: [
      { type: 'field_variable', name: 'VAR', variable: 'item' },
      { type: 'input_value', name: 'VALUE' },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: HUE,
    tooltip: 'Create or update a variable.',
    helpUrl: '',
  },
  {
    type: 'python_var_get',
    message0: '%1',
    args0: [{ type: 'field_variable', name: 'VAR', variable: 'item' }],
    output: null,
    colour: HUE,
    tooltip: "Get the value of a variable.",
    helpUrl: '',
  },
]);
