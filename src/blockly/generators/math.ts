import { pythonGenerator, Order } from 'blockly/python';

const ARITHMETIC_OPERATORS: Record<string, [string, Order]> = {
  ADD: ['+', Order.ADDITIVE],
  MINUS: ['-', Order.ADDITIVE],
  MULTIPLY: ['*', Order.MULTIPLICATIVE],
  DIVIDE: ['/', Order.MULTIPLICATIVE],
  FLOOR_DIVIDE: ['//', Order.MULTIPLICATIVE],
  MODULO: ['%', Order.MULTIPLICATIVE],
  POWER: ['**', Order.EXPONENTIATION],
};

const COMPARE_OPERATORS: Record<string, string> = {
  EQ: '==',
  NEQ: '!=',
  LT: '<',
  LTE: '<=',
  GT: '>',
  GTE: '>=',
};

pythonGenerator.forBlock['python_math_op'] = function (block, generator) {
  const [symbol, order] = ARITHMETIC_OPERATORS[block.getFieldValue('OP')];
  const a = generator.valueToCode(block, 'A', order) || '0';
  const b = generator.valueToCode(block, 'B', order) || '0';
  return [`${a} ${symbol} ${b}`, order];
};

pythonGenerator.forBlock['python_compare'] = function (block, generator) {
  const symbol = COMPARE_OPERATORS[block.getFieldValue('OP')];
  const a = generator.valueToCode(block, 'A', Order.RELATIONAL) || 'None';
  const b = generator.valueToCode(block, 'B', Order.RELATIONAL) || 'None';
  return [`${a} ${symbol} ${b}`, Order.RELATIONAL];
};
