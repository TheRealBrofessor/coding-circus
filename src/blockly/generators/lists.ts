import { pythonGenerator, Order } from 'blockly/python';

pythonGenerator.forBlock['python_list_create'] = function (block, generator) {
  const items = ['A', 'B', 'C']
    .map((name) => generator.valueToCode(block, name, Order.NONE))
    .filter((value): value is string => Boolean(value));
  return [`[${items.join(', ')}]`, Order.ATOMIC];
};

pythonGenerator.forBlock['python_list_append'] = function (block, generator) {
  const item = generator.valueToCode(block, 'ITEM', Order.NONE) || 'None';
  const listValue = generator.valueToCode(block, 'LIST', Order.NONE) || '[]';
  return `${listValue}.append(${item})\n`;
};

pythonGenerator.forBlock['python_list_get'] = function (block, generator) {
  const index = generator.valueToCode(block, 'INDEX', Order.NONE) || '0';
  const listValue = generator.valueToCode(block, 'LIST', Order.NONE) || '[]';
  return [`${listValue}[int(${index})]`, Order.ATOMIC];
};

pythonGenerator.forBlock['python_list_length'] = function (block, generator) {
  const listValue = generator.valueToCode(block, 'LIST', Order.NONE) || '[]';
  return [`len(${listValue})`, Order.ATOMIC];
};
