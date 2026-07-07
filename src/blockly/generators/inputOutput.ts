import { pythonGenerator, Order } from 'blockly/python';

pythonGenerator.forBlock['python_input_text'] = function (block) {
  const prompt = pythonGenerator.quote_(block.getFieldValue('PROMPT'));
  return [`input(${prompt})`, Order.ATOMIC];
};

pythonGenerator.forBlock['python_input_number'] = function (block) {
  const prompt = pythonGenerator.quote_(block.getFieldValue('PROMPT'));
  return [`float(input(${prompt}))`, Order.ATOMIC];
};
