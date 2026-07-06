import * as Blockly from 'blockly/core';

const HUE = 20;

Blockly.common.defineBlocksWithJsonArray([
  {
    type: 'python_ask_text',
    message0: 'ask %1 and get text',
    args0: [{ type: 'input_value', name: 'QUESTION', check: 'String' }],
    inputsInline: true,
    output: 'String',
    colour: HUE,
    tooltip: 'Ask a question and get the answer as text. (In the browser runner, export your program to use this.)',
    helpUrl: '',
  },
  {
    type: 'python_ask_number',
    message0: 'ask %1 and get a number',
    args0: [{ type: 'input_value', name: 'QUESTION', check: 'String' }],
    inputsInline: true,
    output: 'Number',
    colour: HUE,
    tooltip: 'Ask a question and get the answer as a number (decimals allowed).',
    helpUrl: '',
  },
  {
    type: 'python_ask_integer',
    message0: 'ask %1 and get a whole number',
    args0: [{ type: 'input_value', name: 'QUESTION', check: 'String' }],
    inputsInline: true,
    output: 'Number',
    colour: HUE,
    tooltip: 'Ask a question and get the answer as a whole number.',
    helpUrl: '',
  },
]);
