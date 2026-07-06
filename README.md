# 🎪 Coding Circus

A Scratch-style, block-based Python learning tool. Drag blocks, watch readable
Python appear in real time, run it entirely in the browser, and see the
result — no backend server required.

**Core loop:** drag blocks → generated Python updates live → click Run →
Python executes via [Pyodide](https://pyodide.org/) in a Web Worker → output
shows in the Console and the themed Stage panel → errors are caught and
explained in plain language → save, load, or export the project.

## Highlights

- **40+ custom Python-focused Blockly blocks** across twelve categories —
  values, variables, text, math, logic, control flow (incl. break/continue,
  repeat-until, counted loops), input, lists, random, functions, debugging
  helpers, and stage output. Full inventory with generated Python per block:
  [BLOCKS.md](BLOCKS.md).
- **Deterministic, beginner-readable Python** — with hardened generators:
  corrupt project data degrades to safe output (`pass`, `0`, sanitized
  comments) instead of crashes or invalid syntax.
- **Starter examples** — Hello World, Variables, If/Else, Repeat Loop, Input,
  Lists, and Random, loadable from the toolbar's Examples menu.
- **Landing + live demo** — a first-visit hero with a "Start Coding" CTA and
  an opt-in demo where the app builds, runs, and saves a real program in
  front of you using the actual editor.
- **Pluggable runner abstraction** — `BrowserPyodideRunner` is the first
  implementation of `RunnerInterface`; `LocalPythonRunner` and
  `DockerSandboxRunner` are documented future targets (see
  [ARCHITECTURE.md](ARCHITECTURE.md)).
- **Beginner-friendly error messages** — tracebacks are normalized into plain
  language with an "advanced" toggle for the raw traceback.
- **Safe project persistence** — save/load via `localStorage`, export to
  `.py` or a portable `.json` project file, import it back. Malformed or
  corrupt project files are rejected with clear messages, never crashes.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL.

> **Runtime note:** Python execution uses Pyodide, fetched from the jsDelivr
> CDN the first time you press Run. Everything else is fully local.
>
> **Known limitation:** the `ask …` (input) blocks generate correct
> `input()` Python, but the browser runner has no keyboard stdin — export
> your program as `.py` and run it with desktop Python to use them.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check (`tsc -b`) and build for production |
| `npm run typecheck` | Type-check only |
| `npm test` | Run the Vitest suite (block generation + persistence safety) |
| `npm run lint` | Run Oxlint |
| `npm run preview` | Preview the production build locally |

## Deployment (GitHub Pages)

The app is a static site. `.github/workflows/deploy-pages.yml` builds with
`--base=/coding-circus/` and deploys `dist/` to GitHub Pages on every push to
`main`.

One-time setup: **Settings → Pages → Source: "GitHub Actions"**. On GitHub
Free, Pages requires the repository to be public.

To host anywhere else, run `npm run build` (add `-- --base=/your-path/` if
serving from a subpath) and upload `dist/`.

## Project structure

```
src/
  blockly/      Custom block definitions, Python generators (+ safety helpers), toolbox
  runner/       RunnerInterface, BrowserPyodideRunner, Pyodide worker
  project/      Save/load/export with untrusted-data validation
  examples/     Starter projects (workspace JSON)
  demo/         The live block-building demo script + player
  components/   React UI: landing, editor, code/console/stage panels, toolbar
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for the deeper technical rationale
behind the block system, runner abstraction, persistence posture, and
deployment; [BLOCKS.md](BLOCKS.md) for the block-by-block inventory.

## Tech stack

Vite, React 19, TypeScript, [Blockly](https://developers.google.com/blockly),
[Pyodide](https://pyodide.org/), Vitest.
