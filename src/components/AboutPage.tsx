interface AboutPageProps {
  onClose: () => void;
}

export function AboutPage({ onClose }: AboutPageProps) {
  return (
    <div className="about-page" role="dialog" aria-modal="true" aria-labelledby="about-title">
      <div className="about-card">
        <div className="about-header">
          <div>
            <p className="about-kicker">About</p>
            <h1 id="about-title">Coding Circus</h1>
          </div>
          <button className="btn about-close" onClick={onClose} aria-label="Close About page">
            Close
          </button>
        </div>

        <section className="about-section">
          <h2>What it is</h2>
          <p>
            Coding Circus is a serious visual Python coding tool built to make Python easier to learn without hiding
            real code. Users create programs with structured blocks, see the Python generated from those blocks, run
            the code, debug mistakes, and export real Python files.
          </p>
        </section>

        <section className="about-section">
          <h2>Origin</h2>
          <p>
            The name comes from Python&apos;s own origin. Python was named after Monty Python&apos;s Flying Circus, and
            Coding Circus pays homage to both Python and the “Flying Circus” reference behind the language&apos;s name.
          </p>
        </section>

        <section className="about-section">
          <h2>Vision</h2>
          <p>
            The vision is to make Coding Circus a widely adopted visual coding interface for Python: easier than
            starting with raw syntax, more serious than a toy block language, and directly connected to real Python
            development.
          </p>
          <p>
            Coding Circus should stay current with modern Python releases and eventually be available inside VS Code,
            coding platforms, classrooms, bootcamps, and self-taught learning environments.
          </p>
        </section>

        <section className="about-section about-grid">
          <div>
            <h2>Core loop</h2>
            <ul>
              <li>Build with structured blocks.</li>
              <li>See generated Python instantly.</li>
              <li>Run code in the browser.</li>
              <li>Debug mistakes with readable errors.</li>
              <li>Export real Python files.</li>
            </ul>
          </div>
          <div>
            <h2>Tier 1 direction</h2>
            <ul>
              <li>29 focused beginner Python blocks.</li>
              <li>Local save, load, import, and export.</li>
              <li>Static site first.</li>
              <li>Backend-ready path for accounts and project sharing.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
