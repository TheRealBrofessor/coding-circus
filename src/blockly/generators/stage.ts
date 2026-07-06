import { pythonGenerator, Order } from 'blockly/python';

// Stage blocks compile to plain print() calls: the Stage panel mirrors the
// latest printed line, and an empty line clears it. Exported programs remain
// standard Python with no Coding Circus runtime dependency.

pythonGenerator.forBlock['python_say'] = function (block, generator) {
  const value = generator.valueToCode(block, 'VALUE', Order.NONE) || "''";
  return `print(${value})\n`;
};

pythonGenerator.forBlock['python_clear_stage'] = function () {
  return 'print()\n';
};
