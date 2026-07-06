import * as Blockly from 'blockly/core';
import { pythonGenerator } from 'blockly/python';
// Importing setup registers all custom blocks + generators and the locale.
import './setup';

/**
 * Test helper: loads serialized workspace state into a headless workspace and
 * returns the generated Python.
 */
export function codeFor(state: object): string {
  const workspace = new Blockly.Workspace();
  try {
    Blockly.serialization.workspaces.load(state as never, workspace);
    return pythonGenerator.workspaceToCode(workspace);
  } finally {
    workspace.dispose();
  }
}
