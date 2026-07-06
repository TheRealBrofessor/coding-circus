/** Serialized project: the Blockly workspace state plus a bit of metadata. */
export interface ProjectFile {
  formatVersion: 1;
  name: string;
  updatedAt: string;
  workspaceJson: unknown;
}
