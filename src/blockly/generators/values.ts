import { pythonGenerator, Order } from 'blockly/python';
import { safeNumber } from './helpers';

pythonGenerator.forBlock['python_string'] = function (block) {
  // quote_ handles escaping (including newlines) — the value always stays inside the string literal.
  return [pythonGenerator.quote_(String(block.getFieldValue('TEXT') ?? '')), Order.ATOMIC];
};

pythonGenerator.forBlock['python_number'] = function (block) {
  return [safeNumber(block.getFieldValue('NUM')), Order.ATOMIC];
};

pythonGenerator.forBlock['python_boolean'] = function (block) {
  return [block.getFieldValue('BOOL') === 'TRUE' ? 'True' : 'False', Order.ATOMIC];
};
