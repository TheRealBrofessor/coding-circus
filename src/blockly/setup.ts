import * as BlocklyCore from 'blockly/core';
import * as En from 'blockly/msg/en';
import './blocks';
import './generators';
import { pythonGenerator } from 'blockly/python';
import type * as Blockly from 'blockly/core';

BlocklyCore.setLocale(En as unknown as { [key: string]: string });

/** Generate deterministic, readable Python from the current block workspace. */
export function generatePython(workspace: Blockly.Workspace): string {
  const code = pythonGenerator.workspaceToCode(workspace);
  return code.trim().length > 0 ? code : '# Drag blocks in from the left to build a program.\n';
}
