import './Landing.css';

interface LandingProps {
  onStartCoding: () => void;
  onWatchDemo: () => void;
}

/**
 * First-visit hero. Static and fast: the real product (the editor) is one
 * click away, and the self-building demo is opt-in rather than forced.
 */
export function Landing({ onStartCoding, onWatchDemo }: LandingProps) {
  return (
    <div className="landing" role="dialog" aria-label="Welcome to Coding Circus">
      <div className="landing-card">
        <div className="landing-emoji" aria-hidden="true">
          🎪
        </div>
        <h1 className="landing-title">Coding Circus</h1>
        <p className="landing-tagline">
          Snap blocks together, watch real Python appear, and run it — right here in your browser.
        </p>
        <ul className="landing-features">
          <li>🧩 Drag blocks — no typing needed to start</li>
          <li>🐍 See the real Python code update live</li>
          <li>▶ Run it instantly, no installs, no account</li>
          <li>💾 Save, load, and export your programs</li>
        </ul>
        <div className="landing-actions">
          <button type="button" className="landing-btn landing-btn-primary" onClick={onStartCoding} autoFocus>
            ▶ Start Coding
          </button>
          <button type="button" className="landing-btn" onClick={onWatchDemo}>
            🎬 Watch it build a program
          </button>
        </div>
        <p className="landing-footnote">
          Python runs in your browser via{' '}
          <a href="https://pyodide.org/" target="_blank" rel="noreferrer">
            Pyodide
          </a>
          , loaded from a CDN on first run — everything else works offline-style with no server.
        </p>
      </div>
    </div>
  );
}
