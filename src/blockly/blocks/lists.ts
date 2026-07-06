import * as Blockly from 'blockly/core';

const HUE = 260;

Blockly.common.defineBlocksWithJsonArray([
  {
    type: 'python_list_create',
    message0: 'list of %1 %2 %3',
    args0: [
      { type: 'input_value', name: 'ITEM0' },
      { type: 'input_value', name: 'ITEM1' },
      { type: 'input_value', name: 'ITEM2' },
    ],
    inputsInline: true,
    output: 'Array',
    colour: HUE,
    tooltip: 'Make a list with up to three starting items. Leave slots empty for a shorter list.',
    helpUrl: '',
  },
  {
    type: 'python_list_append',
    message0: 'add %1 to list %2',
    args0: [
      { type: 'input_value', name: 'ITEM' },
      { type: 'input_value', name: 'LIST', check: 'Array' },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: HUE,
    tooltip: 'Add an item to the end of a list.',
    helpUrl: '',
  },
  {
    type: 'python_list_get',
    message0: 'item at index %1 of %2',
    args0: [
      { type: 'input_value', name: 'INDEX', check: 'Number' },
      { type: 'input_value', name: 'LIST', check: 'Array' },
    ],
    inputsInline: true,
    output: null,
    colour: HUE,
    tooltip: 'Get one item from a list. Python counts from 0: index 0 is the first item.',
    helpUrl: '',
  },
  {
    type: 'python_list_length',
    message0: 'length of %1',
    args0: [{ type: 'input_value', name: 'LIST' }],
    inputsInline: true,
    output: 'Number',
    colour: HUE,
    tooltip: 'How many items a list (or characters a text) has.',
    helpUrl: '',
  },
  {
    type: 'python_for_each',
    message0: 'for each %1 in list %2',
    args0: [
      { type: 'field_variable', name: 'VAR', variable: 'item' },
      { type: 'input_value', name: 'LIST', check: 'Array' },
    ],
    message1: '%1',
    args1: [{ type: 'input_statement', name: 'DO' }],
    colour: HUE,
    previousStatement: null,
    nextStatement: null,
    tooltip: 'Run the enclosed blocks once for every item in the list.',
    helpUrl: '',
  },
]);
