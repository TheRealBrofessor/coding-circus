import * as Blockly from 'blockly/core';
import { pythonGenerator, Order } from 'blockly/python';

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
  const loopVar = generator.nameDB_!.getDistinctName('count', Blockly.Names.NameType.VARIABLE);
  return `for ${loopVar} in range(${times}):\n${branch}`;
};

pythonGenerator.forBlock['python_while'] = function (block, generator) {
  const condition = generator.valueToCode(block, 'CONDITION', Order.NONE) || 'False';
  const branch = branchOrPass(generator.statementToCode(block, 'DO'));
  return `while ${condition}:\n${branch}`;
};

pythonGenerator.forBlock['python_for_each'] = function (block, generator) {
  const varName = generator.getVariableName(block.getFieldValue('VAR'));
  const listValue = generator.valueToCode(block, 'LIST', Order.NONE) || '[]';
  const branch = branchOrPass(generator.statementToCode(block, 'DO'));
  return `for ${varName} in ${listValue}:\n${branch}`;
};

pythonGenerator.forBlock['python_wait'] = function (block, generator) {
  (generator as unknown as { definitions_: Record<string, string> }).definitions_['import_time'] = 'import time';
  const seconds = generator.valueToCode(block, 'SECONDS', Order.NONE) || '0';
  return `time.sleep(${seconds})\n`;
};
