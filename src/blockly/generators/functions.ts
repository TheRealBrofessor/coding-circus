import { pythonGenerator, Order } from 'blockly/python';
import { legalizePythonName } from './helpers';

// Function names are typed free-form and legalized into safe Python
// identifiers, so "My Cool Function!" defines (and calls) my_cool_function-
// style names instead of producing invalid syntax.

pythonGenerator.forBlock['python_def'] = function (block, generator) {
  const name = legalizePythonName(block.getFieldValue('NAME'), 'my_function');
  const body = generator.statementToCode(block, 'DO') || `${generator.INDENT}pass\n`;
  return `def ${name}():\n${body}`;
};

pythonGenerator.forBlock['python_call'] = function (block) {
  const name = legalizePythonName(block.getFieldValue('NAME'), 'my_function');
  return `${name}()\n`;
};

pythonGenerator.forBlock['python_call_value'] = function (block) {
  const name = legalizePythonName(block.getFieldValue('NAME'), 'my_function');
  return [`${name}()`, Order.FUNCTION_CALL];
};

pythonGenerator.forBlock['python_return'] = function (block, generator) {
  const value = generator.valueToCode(block, 'VALUE', Order.NONE);
  return value ? `return ${value}\n` : 'return\n';
};
