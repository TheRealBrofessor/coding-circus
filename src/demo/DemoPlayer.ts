import * as Blockly from 'blockly/core';
import type { DemoScript } from './liveDemoScript';

const SLIDE_DISTANCE = 360;
const TWEEN_MS = 550;
const PAUSE_MS = 220;

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/** Positions a block's SVG group directly, bypassing Blockly's move-event bookkeeping
 * (which throws when constructing a Move event for a block created via serialization
 * rather than a real drag). Used for the animated in-between frames only. */
function positionSvg(block: Blockly.BlockSvg, x: number, y: number): void {
  block.getSvgRoot().setAttribute('transform', `translate(${x}, ${y})`);
}

function tween(block: Blockly.BlockSvg, from: Blockly.utils.Coordinate, to: Blockly.utils.Coordinate): Promise<void> {
  return new Promise((resolve) => {
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / TWEEN_MS);
      const eased = easeOutCubic(t);
      const x = from.x + (to.x - from.x) * eased;
      const y = from.y + (to.y - from.y) * eased;
      if (t < 1) {
        positionSvg(block, x, y);
        requestAnimationFrame(step);
      } else {
        // Commit the final position through the real API once, so Blockly's internal
        // xy_ bookkeeping (used by connection lookups) matches what's on screen.
        try {
          block.moveTo(to);
        } catch {
          positionSvg(block, to.x, to.y);
        }
        resolve();
      }
    };
    requestAnimationFrame(step);
  });
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fireMoveEvent(block: Blockly.Block): void {
  try {
    Blockly.Events.fire(new Blockly.Events.BlockMove(block));
  } catch {
    // Constructing a Move event for a block that wasn't placed via a real drag can throw;
    // the workspace change listener will still pick up the connect()/serialization events.
  }
}

/**
 * Plays the given script against a real (visible) Blockly workspace: each block slides in
 * from the left, as if just dragged off the palette, then snaps into the growing program.
 * Returns once the whole program has been assembled.
 */
export async function playLiveDemo(
  workspace: Blockly.WorkspaceSvg,
  script: DemoScript,
  isCancelled: () => boolean,
): Promise<void> {
  const restX = 24;
  const restY = 18;

  workspace.clear();

  const container = Blockly.serialization.blocks.append(
    {
      type: script.container.type,
      x: restX - SLIDE_DISTANCE,
      y: restY,
      inputs: {
        [script.container.valueInputName]: {
          shadow: {
            type: script.container.shadow.type,
            fields: { [script.container.shadow.field]: script.container.shadow.value },
          },
        },
      },
    },
    workspace,
  ) as Blockly.BlockSvg;

  await tween(container, new Blockly.utils.Coordinate(restX - SLIDE_DISTANCE, restY), new Blockly.utils.Coordinate(restX, restY));
  fireMoveEvent(container);
  await wait(PAUSE_MS);

  if (isCancelled() || container.disposed) return;

  let cursorConnection = container.getInput(script.container.statementInputName)!.connection!;
  let row = 0;

  for (const step of script.steps) {
    if (isCancelled()) return;

    const targetX = restX + 30;
    const targetY = restY + 30 + row * 34;
    row += 1;

    const block = Blockly.serialization.blocks.append(
      {
        type: step.type,
        x: targetX - SLIDE_DISTANCE,
        y: targetY,
        inputs: {
          [step.valueInputName]: {
            shadow: { type: step.shadow.type, fields: { [step.shadow.field]: step.shadow.value } },
          },
        },
      },
      workspace,
    ) as Blockly.BlockSvg;

    await tween(
      block,
      new Blockly.utils.Coordinate(targetX - SLIDE_DISTANCE, targetY),
      new Blockly.utils.Coordinate(targetX, targetY),
    );

    if (isCancelled() || block.disposed || container.disposed) return;

    cursorConnection.connect(block.previousConnection!);
    fireMoveEvent(block);
    cursorConnection = block.nextConnection!;

    await wait(PAUSE_MS);
  }
}
