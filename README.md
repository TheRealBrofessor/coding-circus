# 🎪 Coding Circus

A Scratch-style, block-based Python learning tool. Drag blocks, watch readable
Python appear in real time, run it entirely in the browser, and see the
result — no backend server required.

**Core loop:** drag blocks → generated Python updates live → click Run →
Python executes via [Pyodide](https://pyodide.org/) in a Web Worker → output
shows in the Console and the themed Stage panel → errors are caught and
explained in plain language → save, load, or export the project.

## Highlights

- **Custom Python-focused Blockly blocks** — print, variables, math, logic,
  control flow, and a `wait` block for timing/animation — each with a
  deterministic, readable Python generator (see [`src/blockly/`](src/blockly)).
- **Pluggable runner abstraction** — `BrowserPyodideRunner` is the first
  implementation of `RunnerInterface`; `LocalPythonRunner` and
  `DockerSandboxRunner` are documented future targets (see
  [`ARCHITECTURE.md`](ARCHITECTURE.md)).
- **Beginner-friendly error messages** — tracebacks are normalized into plain
  language with an "advanced" toggle for the raw traceback.
- **Project persistence** — save/load via `localStorage`, export to `.py` or
  a portable `.json` project file, import it back.
- **Live demo splash screen** — on first load, the app demonstrates itself:
  real blocks drag in from the real palette, assemble a working program,
  run it, and save it, before handing control to you.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL. `npm run build` produces a static
production build (`dist/`) — the whole app is client-side, so it can be
hosted anywhere that serves static files.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check (`tsc -b`) and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint |

## Project structure

```
src/
  blockly/      Custom block definitions, Python generators, toolbox
  runner/       RunnerInterface, BrowserPyodideRunner, Pyodide worker
  project/      Save/load/export (localStorage + file-based)
  demo/         The live block-building demo script + player
  components/   React UI: editor, code/console/stage panels, toolbar
```

See [`ARCHITECTURE.md`](ARCHITECTURE.md) for the deeper technical rationale
behind the runner abstraction and future backend-execution targets.

## Tech stack

Vite, React 19, TypeScript, [Blockly](https://developers.google.com/blockly),
[Pyodide](https://pyodide.org/).
