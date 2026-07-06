import { describe, expect, it } from 'vitest';
import * as Blockly from 'blockly/core';
import { pythonGenerator } from 'blockly/python';
import './setup';
import { toolbox } from './toolbox';

function collectToolboxBlockTypes(): string[] {
  const types: string[] = [];
  const walk = (items: unknown[]): void => {
    for (const item of items) {
      const entry = item as { kind?: string; type?: string; contents?: unknown[] };
      if (entry.kind === 'block' && entry.type) types.push(entry.type);
      if (Array.isArray(entry.contents)) walk(entry.contents);
    }
  };
  walk(toolbox.contents as unknown[]);
  return types;
}

const customBlockTypes = Object.keys(Blockly.Blocks).filter((type) => type.startsWith('python_'));

describe('block/generator coverage', () => {
  it('defines at least the full beginner block set', () => {
    expect(customBlockTypes.length).toBeGreaterThanOrEqual(30);
  });

  it('has a Python generator for every custom block definition', () => {
    for (const type of customBlockTypes) {
      expect(pythonGenerator.forBlock[type], `missing generator for ${type}`).toBeTypeOf('function');
    }
  });

  it('has a block definition for every custom Python generator', () => {
    const generatorTypes = Object.keys(pythonGenerator.forBlock).filter((type) => type.startsWith('python_'));
    for (const type of generatorTypes) {
      expect(Blockly.Blocks[type], `generator without block definition: ${type}`).toBeDefined();
    }
  });

  it('only references defined blocks from the toolbox', () => {
    for (const type of collectToolboxBlockTypes()) {
      expect(Blockly.Blocks[type], `toolbox references undefined block: ${type}`).toBeDefined();
    }
  });

  it('exposes every custom block in the toolbox', () => {
    const toolboxTypes = new Set(collectToolboxBlockTypes());
    for (const type of customBlockTypes) {
      expect(toolboxTypes.has(type), `block missing from toolbox: ${type}`).toBe(true);
    }
  });
});
