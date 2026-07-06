import { pythonGenerator, Order } from 'blockly/python';

pythonGenerator.forBlock['python_var_set'] = function (block, generator) {
  const varName = generator.getVariableName(block.getFieldValue('VAR'));
  const value = generator.valueToCode(block, 'VALUE', Order.NONE) || 'None';
  return `${varName} = ${value}\n`;
};

pythonGenerator.forBlock['python_var_get'] = function (block, generator) {
  const varName = generator.getVariableName(block.getFieldValue('VAR'));
  return [varName, Order.ATOMIC];
};
