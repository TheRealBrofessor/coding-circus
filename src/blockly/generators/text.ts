import { pythonGenerator, Order } from 'blockly/python';

pythonGenerator.forBlock['python_print'] = function (block, generator) {
  const value = generator.valueToCode(block, 'VALUE', Order.NONE) || "''";
  return `print(${value})\n`;
};

pythonGenerator.forBlock['python_join'] = function (block, generator) {
  const a = generator.valueToCode(block, 'A', Order.NONE) || "''";
  const b = generator.valueToCode(block, 'B', Order.NONE) || "''";
  return [`str(${a}) + str(${b})`, Order.ADDITIVE];
};

pythonGenerator.forBlock['python_comment'] = function (block) {
  return `# ${block.getFieldValue('TEXT')}\n`;
};
