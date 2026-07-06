// Registers a forBlock[type] generator function for every custom block type,
// on Blockly's maintained Python generator instance. Kept modular per category
// so codegen for one kind of block can change without touching the others.
import './values';
import './variables';
import './text';
import './math';
import './logic';
import './control';

export { pythonGenerator } from 'blockly/python';
