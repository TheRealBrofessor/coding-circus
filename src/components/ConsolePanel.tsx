import type { NormalizedError } from '../runner/RunResult';

export interface ConsoleLine {
  kind: 'stdout' | 'stderr' | 'system';
  text: string;
}

interface ConsolePanelProps {
  lines: ConsoleLine[];
  error: NormalizedError | null;
  showRawTraceback: boolean;
  onToggleRawTraceback: () => void;
}

export function ConsolePanel({ lines, error, showRawTraceback, onToggleRawTraceback }: ConsolePanelProps) {
  return (
    <div className="panel console-panel">
      <div className="panel-header">Console</div>
      <div className="console-panel-body">
        {lines.length === 0 && !error && <div className="console-placeholder">Click Run to see output here.</div>}
        {lines.map((line, i) => (
          <span key={i} className={`console-line console-line-${line.kind}`}>
            {line.text}
          </span>
        ))}
        {error && (
          <div className="console-error">
            <div className="console-error-message">⚠ {error.message}</div>
            {error.hint && <div className="console-error-hint">{error.hint}</div>}
            <label className="console-error-toggle">
              <input type="checkbox" checked={showRawTraceback} onChange={onToggleRawTraceback} />
              Show raw traceback (advanced)
            </label>
            {showRawTraceback && <pre className="console-raw-traceback">{error.rawTraceback}</pre>}
          </div>
        )}
      </div>
    </div>
  );
}
