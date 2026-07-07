import { pythonGenerator, Order } from 'blockly/python';

function branchOrPass(branch: string): string {
  return branch || `${pythonGenerator.INDENT}pass\n`;
}

function safeFunctionName(rawName: string): string {
  const cleaned = rawName.trim().replace(/\W+/g, '_');
  const prefixed = /^\d/.test(cleaned) ? `fn_${cleaned}` : cleaned;
  return prefixed || 'my_function';
}

pythonGenerator.forBlock['python_function_def'] = function (block, generator) {
  const name = safeFunctionName(block.getFieldValue('NAME'));
  const branch = branchOrPass(generator.statementToCode(block, 'DO'));
  return `def ${name}():\n${branch}`;
};

pythonGenerator.forBlock['python_function_call'] = function (block) {
  const name = safeFunctionName(block.getFieldValue('NAME'));
  return `${name}()\n`;
};

pythonGenerator.forBlock['python_return'] = function (block, generator) {
  const value = generator.valueToCode(block, 'VALUE', Order.NONE) || 'None';
  return `return ${value}\n`;
};
