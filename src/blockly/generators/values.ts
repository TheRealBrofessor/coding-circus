import { pythonGenerator, Order } from 'blockly/python';

pythonGenerator.forBlock['python_string'] = function (block) {
  return [pythonGenerator.quote_(block.getFieldValue('TEXT')), Order.ATOMIC];
};

pythonGenerator.forBlock['python_number'] = function (block) {
  return [String(Number(block.getFieldValue('NUM'))), Order.ATOMIC];
};

pythonGenerator.forBlock['python_boolean'] = function (block) {
  return [block.getFieldValue('BOOL') === 'TRUE' ? 'True' : 'False', Order.ATOMIC];
};
