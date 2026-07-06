import { useEffect, useRef, useState } from 'react';
import './StagePanel.css';

interface StagePanelProps {
  text: string;
  isRunning: boolean;
}

interface Entry {
  id: number;
  text: string;
}

const BULB_COUNT = 36;

/** Evenly spaces bulbs around a rectangle's perimeter, going clockwise from top-left. */
const BULBS = Array.from({ length: BULB_COUNT }, (_, i) => {
  const t = i / BULB_COUNT;
  const segment = Math.floor(t * 4);
  const f = t * 4 - segment;
  let x = 0;
  let y = 0;
  if (segment === 0) { x = f * 100; y = 0; }
  else if (segment === 1) { x = 100; y = f * 100; }
  else if (segment === 2) { x = (1 - f) * 100; y = 100; }
  else { x = 0; y = (1 - f) * 100; }
  return { id: i, x, y, delay: (i / BULB_COUNT) * 2.4 };
});

/** A big, theatrical readout of the program's latest printed line, with a crossfade between lines. */
export function StagePanel({ text, isRunning }: StagePanelProps) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    if (!text) {
      setEntries([]);
      return;
    }
    nextId.current += 1;
    const id = nextId.current;
    setEntries((prev) => [...prev.slice(-1), { id, text }]);
  }, [text]);

  return (
    <div className="panel stage-panel">
      <div className="panel-header">Stage {isRunning && <span className="stage-live">● live</span>}</div>
      <div className="stage-panel-body">
        <div className="stage-backdrop" aria-hidden="true">
          <span className="stage-glow stage-glow-a" />
          <span className="stage-glow stage-glow-b" />
          <span className="stage-glow stage-glow-c" />
        </div>
        <div className="stage-marquee" aria-hidden="true">
          {BULBS.map((b) => (
            <span
              key={b.id}
              className="stage-bulb"
              style={{ left: `${b.x}%`, top: `${b.y}%`, animationDelay: `${b.delay}s` }}
            />
          ))}
        </div>
        <div className="stage-curtain stage-curtain-left" aria-hidden="true" />
        <div className="stage-curtain stage-curtain-right" aria-hidden="true" />
        <div className="stage-content">
          {entries.length === 0 ? (
            <div className="console-placeholder">The stage shows your program's latest output.</div>
          ) : (
            entries.map((entry, i) => (
              <div
                key={entry.id}
                className={i === entries.length - 1 ? 'stage-text stage-text-enter' : 'stage-text stage-text-exit'}
              >
                {entry.text}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
