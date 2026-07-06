import { pythonGenerator, Order } from 'blockly/python';

pythonGenerator.forBlock['python_list_create'] = function (block, generator) {
  const items = ['ITEM0', 'ITEM1', 'ITEM2']
    .map((name) => generator.valueToCode(block, name, Order.NONE))
    .filter((code) => code !== '');
  return [`[${items.join(', ')}]`, Order.ATOMIC];
};

pythonGenerator.forBlock['python_list_append'] = function (block, generator) {
  const list = generator.valueToCode(block, 'LIST', Order.MEMBER) || '[]';
  const item = generator.valueToCode(block, 'ITEM', Order.NONE) || 'None';
  return `${list}.append(${item})\n`;
};

pythonGenerator.forBlock['python_list_get'] = function (block, generator) {
  const list = generator.valueToCode(block, 'LIST', Order.MEMBER) || '[]';
  const index = generator.valueToCode(block, 'INDEX', Order.NONE) || '0';
  return [`${list}[${index}]`, Order.MEMBER];
};

pythonGenerator.forBlock['python_list_length'] = function (block, generator) {
  const list = generator.valueToCode(block, 'LIST', Order.NONE) || '[]';
  return [`len(${list})`, Order.FUNCTION_CALL];
};

pythonGenerator.forBlock['python_for_each'] = function (block, generator) {
  const loopVar = generator.getVariableName(block.getFieldValue('VAR'));
  const list = generator.valueToCode(block, 'LIST', Order.RELATIONAL) || '[]';
  const branch = generator.statementToCode(block, 'DO') || `${generator.INDENT}pass\n`;
  return `for ${loopVar} in ${list}:\n${branch}`;
};
