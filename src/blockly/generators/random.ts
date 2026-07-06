import { pythonGenerator, Order } from 'blockly/python';
import { addDefinition } from './helpers';

pythonGenerator.forBlock['python_random_int'] = function (block, generator) {
  addDefinition(generator, 'import_random', 'import random');
  const from = generator.valueToCode(block, 'FROM', Order.NONE) || '0';
  const to = generator.valueToCode(block, 'TO', Order.NONE) || '0';
  return [`random.randint(${from}, ${to})`, Order.FUNCTION_CALL];
};

pythonGenerator.forBlock['python_random_float'] = function (_block, generator) {
  addDefinition(generator, 'import_random', 'import random');
  return ['random.random()', Order.FUNCTION_CALL];
};

pythonGenerator.forBlock['python_random_choice'] = function (block, generator) {
  addDefinition(generator, 'import_random', 'import random');
  const list = generator.valueToCode(block, 'LIST', Order.NONE) || '[]';
  return [`random.choice(${list})`, Order.FUNCTION_CALL];
};
