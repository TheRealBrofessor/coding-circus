import { pythonGenerator, Order } from 'blockly/python';
import { addDefinition, distinctName } from './helpers';

function branchOrPass(branch: string): string {
  return branch || `${pythonGenerator.INDENT}pass\n`;
}

pythonGenerator.forBlock['python_if'] = function (block, generator) {
  const condition = generator.valueToCode(block, 'CONDITION', Order.NONE) || 'False';
  const branch = branchOrPass(generator.statementToCode(block, 'DO'));
  return `if ${condition}:\n${branch}`;
};

pythonGenerator.forBlock['python_if_else'] = function (block, generator) {
  const condition = generator.valueToCode(block, 'CONDITION', Order.NONE) || 'False';
  const doBranch = branchOrPass(generator.statementToCode(block, 'DO'));
  const elseBranch = branchOrPass(generator.statementToCode(block, 'ELSE'));
  return `if ${condition}:\n${doBranch}else:\n${elseBranch}`;
};

pythonGenerator.forBlock['python_repeat'] = function (block, generator) {
  const times = generator.valueToCode(block, 'TIMES', Order.NONE) || '0';
  const branch = branchOrPass(generator.statementToCode(block, 'DO'));
  const loopVar = distinctName(generator, 'count');
  return `for ${loopVar} in range(${times}):\n${branch}`;
};

pythonGenerator.forBlock['python_while'] = function (block, generator) {
  const condition = generator.valueToCode(block, 'CONDITION', Order.NONE) || 'False';
  const branch = branchOrPass(generator.statementToCode(block, 'DO'));
  return `while ${condition}:\n${branch}`;
};

pythonGenerator.forBlock['python_wait'] = function (block, generator) {
  addDefinition(generator, 'import_time', 'import time');
  const seconds = generator.valueToCode(block, 'SECONDS', Order.NONE) || '0';
  return `time.sleep(${seconds})\n`;
};

pythonGenerator.forBlock['python_repeat_until'] = function (block, generator) {
  const condition = generator.valueToCode(block, 'CONDITION', Order.LOGICAL_NOT) || 'True';
  const branch = branchOrPass(generator.statementToCode(block, 'DO'));
  return `while not ${condition}:\n${branch}`;
};

pythonGenerator.forBlock['python_count_with'] = function (block, generator) {
  const loopVar = generator.getVariableName(block.getFieldValue('VAR'));
  const from = generator.valueToCode(block, 'FROM', Order.NONE) || '0';
  const to = generator.valueToCode(block, 'TO', Order.ADDITIVE) || '0';
  const branch = branchOrPass(generator.statementToCode(block, 'DO'));
  return `for ${loopVar} in range(${from}, ${to} + 1):\n${branch}`;
};

pythonGenerator.forBlock['python_break'] = function () {
  return 'break\n';
};

pythonGenerator.forBlock['python_continue'] = function () {
  return 'continue\n';
};
