import { pythonGenerator, Order } from 'blockly/python';
import { sanitizeInlineText } from './helpers';

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
  // Sanitized so a line break typed (or imported) into the field cannot
  // escape the comment and become executable Python.
  return `# ${sanitizeInlineText(block.getFieldValue('TEXT'))}\n`;
};
