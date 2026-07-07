import * as Blockly from 'blockly/core';

const HUE = 20;

Blockly.common.defineBlocksWithJsonArray([
  {
    type: 'python_input_text',
    message0: 'ask text %1',
    args0: [{ type: 'field_input', name: 'PROMPT', text: 'What is your name?' }],
    output: 'String',
    colour: HUE,
    tooltip: 'Ask the user for text input.',
    helpUrl: '',
  },
  {
    type: 'python_input_number',
    message0: 'ask number %1',
    args0: [{ type: 'field_input', name: 'PROMPT', text: 'Enter a number:' }],
    output: 'Number',
    colour: HUE,
    tooltip: 'Ask the user for input and convert it to a number.',
    helpUrl: '',
  },
]);
