import { useEffect, useRef, useState, type RefObject } from 'react';
import * as Blockly from 'blockly/core';
import { playLiveDemo } from '../demo/DemoPlayer';
import { LIVE_DEMO_SCRIPT } from '../demo/liveDemoScript';
import './LiveDemo.css';

interface LiveDemoProps {
  /** The ref itself (not its current value) so we always read the workspace at effect-run
   * time, after BlockEditor's own mount effect has had a chance to populate it. */
  workspaceRef: RefObject<Blockly.WorkspaceSvg | null>;
  onReveal: () => void;
  onRunDemo: () => void;
  onSaveDemo: () => void;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Keeps a ref pointed at the latest value of a fast-changing callback, so a long-lived
 * effect (which only runs once) can still invoke the current version instead of whatever
 * was passed in on the very first render. */
function useLatest<T>(value: T): RefObject<T> {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref;
}

/**
 * The splash screen, and it's the real product: it drives the actual Blockly workspace,
 * dragging real blocks in from the palette one at a time to assemble a working program,
 * then reveals the app and runs + saves what it just built.
 */
export function LiveDemo({ workspaceRef, onReveal, onRunDemo, onSaveDemo }: LiveDemoProps) {
  const [building, setBuilding] = useState(true);
  const started = useRef(false);
  const cancelled = useRef(false);
  const revealed = useRef(false);

  const onRevealLatest = useLatest(onReveal);
  const onRunDemoLatest = useLatest(onRunDemo);
  const onSaveDemoLatest = useLatest(onSaveDemo);

  const reveal = () => {
    if (revealed.current) return;
    revealed.current = true;
    setBuilding(false);
    onRevealLatest.current();
  };

  const skip = () => {
    cancelled.current = true;
    reveal();
  };

  useEffect(() => {
    // Defer to a fresh task before touching the workspace: in dev, StrictMode mounts this
    // (and BlockEditor) once, cleans them up, then mounts again — disposing the first
    // Blockly workspace instance. Waiting a tick means we only ever read the workspace
    // ref after that churn has fully settled on its final, stable instance.
    let live = true;
    const timer = setTimeout(() => {
      if (!live || started.current) return;
      const workspace = workspaceRef.current;
      if (!workspace) return;
      started.current = true;
      cancelled.current = false;

      (async () => {
        await playLiveDemo(workspace, LIVE_DEMO_SCRIPT, () => cancelled.current);
        if (cancelled.current) return;
        reveal();
        await wait(300);
        if (cancelled.current) return;
        onRunDemoLatest.current();
        await wait(2600);
        if (cancelled.current) return;
        onSaveDemoLatest.current();
      })();
    }, 0);

    return () => {
      live = false;
      clearTimeout(timer);
      cancelled.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceRef]);

  return (
    <div className="live-demo" aria-hidden="true">
      <div className="live-demo-watermark">Owlsec4life</div>
      {building && <div className="live-demo-shield" />}
      <button type="button" className="live-demo-skip" aria-label="Skip demo" onClick={skip}>
        Skip demo ⏭
      </button>
    </div>
  );
}
