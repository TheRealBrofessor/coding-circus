import { pythonGenerator, Order } from 'blockly/python';

function requireRandom(generator: unknown): void {
  (generator as { definitions_: Record<string, string> }).definitions_['import_random'] = 'import random';
}

pythonGenerator.forBlock['python_random_int'] = function (block, generator) {
  requireRandom(generator);
  const a = generator.valueToCode(block, 'A', Order.NONE) || '1';
  const b = generator.valueToCode(block, 'B', Order.NONE) || '10';
  return [`random.randint(int(${a}), int(${b}))`, Order.ATOMIC];
};

pythonGenerator.forBlock['python_random_choice'] = function (block, generator) {
  requireRandom(generator);
  const listValue = generator.valueToCode(block, 'LIST', Order.NONE) || "['heads', 'tails']";
  return [`random.choice(${listValue})`, Order.ATOMIC];
};
