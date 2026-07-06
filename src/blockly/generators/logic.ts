import { pythonGenerator, Order } from 'blockly/python';

pythonGenerator.forBlock['python_logic_op'] = function (block, generator) {
  const isAnd = block.getFieldValue('OP') === 'AND';
  const order = isAnd ? Order.LOGICAL_AND : Order.LOGICAL_OR;
  const a = generator.valueToCode(block, 'A', order) || 'False';
  const b = generator.valueToCode(block, 'B', order) || 'False';
  return [`${a} ${isAnd ? 'and' : 'or'} ${b}`, order];
};

pythonGenerator.forBlock['python_not'] = function (block, generator) {
  const a = generator.valueToCode(block, 'A', Order.LOGICAL_NOT) || 'False';
  return [`not ${a}`, Order.LOGICAL_NOT];
};
