import { pythonGenerator, Order } from 'blockly/python';

// input() generates standard, readable Python. Note: the in-browser Pyodide
// runner has no interactive stdin (see ARCHITECTURE.md), so these raise a
// beginner-friendly normalized error there; exported programs work normally
// when run with desktop Python.

pythonGenerator.forBlock['python_ask_text'] = function (block, generator) {
  const question = generator.valueToCode(block, 'QUESTION', Order.NONE) || "''";
  return [`input(${question})`, Order.FUNCTION_CALL];
};

pythonGenerator.forBlock['python_ask_number'] = function (block, generator) {
  const question = generator.valueToCode(block, 'QUESTION', Order.NONE) || "''";
  return [`float(input(${question}))`, Order.FUNCTION_CALL];
};

pythonGenerator.forBlock['python_ask_integer'] = function (block, generator) {
  const question = generator.valueToCode(block, 'QUESTION', Order.NONE) || "''";
  return [`int(input(${question}))`, Order.FUNCTION_CALL];
};
