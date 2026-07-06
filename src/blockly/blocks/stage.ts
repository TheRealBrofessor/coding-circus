import * as Blockly from 'blockly/core';

const HUE = 180;

// Stage blocks generate plain print() calls — the Stage panel mirrors printed
// output, and an empty printed line clears it (see ARCHITECTURE.md). Exported
// programs therefore stay 100% standard Python.
Blockly.common.defineBlocksWithJsonArray([
  {
    type: 'python_say',
    message0: 'show %1 on stage',
    args0: [{ type: 'input_value', name: 'VALUE' }],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: HUE,
    tooltip: 'Show a message big on the stage (it also prints to the console).',
    helpUrl: '',
  },
  {
    type: 'python_clear_stage',
    message0: 'clear the stage',
    previousStatement: null,
    nextStatement: null,
    colour: HUE,
    tooltip: 'Clear the stage display (prints an empty line).',
    helpUrl: '',
  },
]);
