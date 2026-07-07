import * as Blockly from 'blockly/core';

const HUE = 260;

Blockly.common.defineBlocksWithJsonArray([
  {
    type: 'python_list_create',
    message0: 'list %1 %2 %3',
    args0: [
      { type: 'input_value', name: 'A' },
      { type: 'input_value', name: 'B' },
      { type: 'input_value', name: 'C' },
    ],
    output: 'Array',
    colour: HUE,
    tooltip: 'Create a list with up to three items.',
    helpUrl: '',
  },
  {
    type: 'python_list_append',
    message0: 'append %1 to list %2',
    args0: [
      { type: 'input_value', name: 'ITEM' },
      { type: 'input_value', name: 'LIST' },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: HUE,
    tooltip: 'Add an item to the end of a list.',
    helpUrl: '',
  },
  {
    type: 'python_list_get',
    message0: 'item %1 of list %2',
    args0: [
      { type: 'input_value', name: 'INDEX', check: 'Number' },
      { type: 'input_value', name: 'LIST' },
    ],
    inputsInline: true,
    output: null,
    colour: HUE,
    tooltip: 'Get an item from a list by index. Python lists start at 0.',
    helpUrl: '',
  },
  {
    type: 'python_list_length',
    message0: 'length of list %1',
    args0: [{ type: 'input_value', name: 'LIST' }],
    output: 'Number',
    colour: HUE,
    tooltip: 'Count how many items are in a list.',
    helpUrl: '',
  },
]);
