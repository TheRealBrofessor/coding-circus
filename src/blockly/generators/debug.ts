import { pythonGenerator, Order } from 'blockly/python';

pythonGenerator.forBlock['python_print_var'] = function (block, generator) {
  const varName = generator.getVariableName(block.getFieldValue('VAR'));
  // quote_ escapes the (already legalized) variable name for the label string.
  return `print(${pythonGenerator.quote_(varName)}, '=', ${varName})\n`;
};

pythonGenerator.forBlock['python_show_type'] = function (block, generator) {
  const value = generator.valueToCode(block, 'VALUE', Order.NONE) || 'None';
  return [`type(${value}).__name__`, Order.MEMBER];
};

pythonGenerator.forBlock['python_assert'] = function (block, generator) {
  const condition = generator.valueToCode(block, 'CONDITION', Order.NONE) || 'True';
  const message = pythonGenerator.quote_(String(block.getFieldValue('MESSAGE') ?? ''));
  return `assert ${condition}, ${message}\n`;
};
