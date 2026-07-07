import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();
const EXPECTED_BLOCK_COUNT = 29;

function read(filePath) {
  return fs.readFileSync(path.join(ROOT, filePath), 'utf8');
}

function unique(values) {
  return [...new Set(values)].sort();
}

function extractAll(regex, text) {
  const out = [];
  for (const match of text.matchAll(regex)) out.push(match[1]);
  return out;
}

function readCategoryFiles(dir) {
  const fullDir = path.join(ROOT, dir);
  return fs
    .readdirSync(fullDir)
    .filter((file) => file.endsWith('.ts') && file !== 'index.ts')
    .map((file) => read(path.join(dir, file)))
    .join('\n');
}

const toolboxText = read('src/blockly/toolbox.ts');
const blockDefinitionText = readCategoryFiles('src/blockly/blocks');
const generatorText = readCategoryFiles('src/blockly/generators');

const exposedBlocks = unique(extractAll(/kind:\s*'block',\s*\n\s*type:\s*'(python_[^']+)'/g, toolboxText));
const definedBlocks = unique(extractAll(/type:\s*'(python_[^']+)'/g, blockDefinitionText));
const generatedBlocks = unique(extractAll(/forBlock\[['"](python_[^'"]+)['"]\]/g, generatorText));

const missingDefinitions = exposedBlocks.filter((type) => !definedBlocks.includes(type));
const missingGenerators = exposedBlocks.filter((type) => !generatedBlocks.includes(type));
const unexposedDefinitions = definedBlocks.filter((type) => !exposedBlocks.includes(type));
const unexposedGenerators = generatedBlocks.filter((type) => !exposedBlocks.includes(type));

let failed = false;

if (exposedBlocks.length !== EXPECTED_BLOCK_COUNT) {
  failed = true;
  console.error(`Expected ${EXPECTED_BLOCK_COUNT} exposed blocks, found ${exposedBlocks.length}.`);
}

if (missingDefinitions.length) {
  failed = true;
  console.error(`Missing block definitions: ${missingDefinitions.join(', ')}`);
}

if (missingGenerators.length) {
  failed = true;
  console.error(`Missing Python generators: ${missingGenerators.join(', ')}`);
}

if (unexposedDefinitions.length) {
  failed = true;
  console.error(`Defined but not exposed in toolbox: ${unexposedDefinitions.join(', ')}`);
}

if (unexposedGenerators.length) {
  failed = true;
  console.error(`Generated but not exposed in toolbox: ${unexposedGenerators.join(', ')}`);
}

console.log(`Block audit: ${exposedBlocks.length} exposed blocks.`);
console.log(exposedBlocks.map((type, index) => `${String(index + 1).padStart(2, '0')}. ${type}`).join('\n'));

if (failed) process.exit(1);
