# CLAUDE.md

Guidance for AI assistants working in this repository.

## What this project is

**Coding Circus** — a Scratch-style, block-based Python learning tool. Learners drag
Blockly blocks, watch readable Python appear live, run it in the browser via Pyodide,
and see output in a Console and a themed "Stage" panel.

**Everything is client-side.** There is no backend server, no build-time codegen step,
and no test suite. The app is a static Vite build deployed to GitHub Pages at
`/coding-circus/`.

Read [`README.md`](README.md) for the product pitch and [`ARCHITECTURE.md`](ARCHITECTURE.md)
for the design rationale (runner abstraction, future execution backends, persistence).
Those two files are the source of truth for *why*; this file covers *how to work here*.

## Commands

| Command | What it does |
| --- | --- |
| `npm install` / `npm ci` | Install deps (`node_modules` is not checked in) |
| `npm run dev` | Vite dev server |
| `npm run build` | `tsc -b` type-check **then** `vite build` → `dist/` |
| `npm run lint` | Oxlint (not ESLint — see below) |
| `npm run audit:blocks` | Block-inventory consistency check (see caveat below) |
| `npm run preview` | Serve the production build locally |

CI (`.github/workflows/ci.yml`) runs, in order, on push/PR to `main`:
`npm ci` → `npm run build` → `npm run lint` → `npm run audit:blocks`.
There is no test runner configured — `npm run build` is the type-check gate.

`.github/workflows/pages.yml` builds and deploys `dist/` to GitHub Pages on every
push to `main`.

### ⚠️ Known-broken: `npm run audit:blocks` fails on `main`

As of the current `main`, `npm run audit:blocks` **exits non-zero and CI is red**. This
is a bug in the audit script, not in the toolbox:

```
Expected 29 exposed blocks, found 11.
```

`scripts/audit-blocks.mjs` extracts toolbox entries with a regex that requires `type:`
to sit on the line *after* `kind: 'block',`:

```js
/kind:\s*'block',\s*\n\s*type:\s*'(python_[^']+)'/g
```

Most toolbox entries are written on one line (`{ kind: 'block', type: 'python_string' },`),
so only the 11 multi-line entries match. The toolbox genuinely does expose all 29 blocks,
and every one has both a definition and a generator. Fixing the regex (rather than editing
`toolbox.ts` to satisfy it) is the correct repair. Don't be misled into thinking blocks
are missing.

`npm run build` and `npm run lint` both pass cleanly.

## Layout

```
src/
  blockly/
    blocks/       Block JSON definitions, one file per category
    generators/   Python codegen, one file per category (mirrors blocks/)
    toolbox.ts    The single list of blocks learners can actually see
    setup.ts      Locale + generatePython() — the only entry point the UI calls
  runner/
    RunnerInterface.ts     The contract every execution backend implements
    RunResult.ts           RunResult + NormalizedError types
    BrowserPyodideRunner.ts  Main-thread side: worker lifecycle, timeout, stop
    pyodideWorker.ts       Worker side: loads Pyodide from CDN, runs code
    errorNormalization.ts  Traceback → beginner-friendly message
  project/        localStorage save/load, .py and .json export/import
  demo/           liveDemoScript.ts (data) + DemoPlayer.ts (animation)
  components/     React UI (Toolbar, BlockEditor, Code/Console/Stage panels, …)
  App.tsx         All application state lives here
docs/             backend-plan.md (Supabase, not yet implemented), demo-examples.md
supabase/         schema.sql — planned backend, nothing in src/ uses it yet
scripts/          audit-blocks.mjs
public/blockly-media/  Blockly's own asset files, served locally
```

## The three-file rule for blocks

**Adding or changing a block means touching three places that must stay in sync:**

1. `src/blockly/blocks/<category>.ts` — the JSON definition, registered via
   `Blockly.common.defineBlocksWithJsonArray([...])`
2. `src/blockly/generators/<category>.ts` — `pythonGenerator.forBlock['python_x'] = …`
3. `src/blockly/toolbox.ts` — the toolbox entry that makes it visible

Both `blocks/index.ts` and `generators/index.ts` are plain lists of `import './<category>'`
side-effect imports; a new category file must be added to both. `audit:blocks` exists
specifically to catch a block that's defined but not exposed, or exposed without a
generator — plus it hard-codes `EXPECTED_BLOCK_COUNT`, which must be bumped when the
toolbox grows.

### Block conventions

- Every block type is namespaced `python_*`. Blockly's stock blocks are never used —
  only `blockly/core` is imported, so the toolbox shows Python-relevant primitives only.
- Each `blocks/<category>.ts` declares a `const HUE = <number>` at the top and uses
  `colour: HUE` on every block, matching the `colour:` on that toolbox category.
  (`math.ts` is the exception — it inlines `230`/`210` because its two blocks belong to
  visually different families. Follow the `HUE` pattern for new files.)
- Toolbox entries supply `shadow` blocks for value inputs wherever a sensible default
  exists, so a freshly dragged block already generates valid Python.

### Generator conventions

Generators register onto Blockly's maintained `pythonGenerator` from `blockly/python`
rather than a hand-rolled generator — that gives correct operator precedence,
indentation, and variable-name legalization for free.

- Value blocks return `[code, Order.X]`; statement blocks return a string ending in `\n`.
- Always pass a realistic `Order` to `valueToCode` and provide a fallback for an empty
  socket: `generator.valueToCode(block, 'A', Order.ADDITIVE) || '0'`.
- Variable names go through `generator.getVariableName(...)`; generated loop variables
  through `generator.nameDB_!.getDistinctName(...)`.
- Empty statement bodies must become `pass` — reuse the local `branchOrPass()` helper
  pattern from `control.ts` / `functions.ts`.
- Imports are emitted by writing into the generator's `definitions_` map; see
  `python_wait` in `generators/control.ts` for the `import time` example.

## The runner abstraction

`App.tsx` only ever talks to `RunnerInterface` (`init` / `run` / `stop` / `reset` /
`dispose`) and consumes a `RunResult`. `BrowserPyodideRunner` is the only implementation
today; `LocalPythonRunner` and `DockerSandboxRunner` are documented future targets in
`ARCHITECTURE.md`. **Keep UI code free of Pyodide-specific knowledge** — swapping the
runner should be a one-line change in `App.tsx`.

Things that are deliberate and shouldn't be "fixed" without reading `ARCHITECTURE.md`:

- **Pyodide is loaded from the jsdelivr CDN at runtime** via a dynamic `import()` inside
  the worker (`PYODIDE_VERSION` in `pyodideWorker.ts`), not bundled. This is an accepted
  network dependency; self-hosting under `public/` is a known future option.
- **`stop()` and timeout terminate the whole worker and respawn it.** Pyodide can't be
  cooperatively interrupted without `SharedArrayBuffer` + COOP/COEP headers, which static
  hosting can't guarantee. Blunt, but 100% reliable.
- **Each run compiles under the fixed filename `<program>`** in a fresh globals dict, so
  runs never leak variables into each other. `errorNormalization.ts` parses that exact
  filename out of tracebacks to recover a line number — the two must stay in agreement
  (`PROGRAM_FILENAME`).
- Errors are always normalized into a plain-language message plus a hint, with the raw
  traceback preserved behind the "advanced" toggle. New beginner-facing exception
  explanations go in the `HINTS` map.

## React / UI conventions

- **All state lives in `App.tsx`.** Components are presentational and receive callbacks
  as props; there is no state library, router, or context.
- `BlockEditor.tsx` is the only component that touches Blockly directly (plus
  `demo/DemoPlayer.ts`). It injects the workspace once on mount and hands it up via
  `onWorkspaceReady`; `App.tsx` keeps it in `workspaceRef`.
- The Blockly workspace is created exactly once per mount, so `BlockEditor`'s effect
  intentionally has an empty dep array with an `eslint-disable-next-line
  react-hooks/exhaustive-deps`. `LiveDemo.tsx` uses a `useLatest()` ref helper for the
  same reason. **Preserve these patterns** — re-adding deps would tear down and recreate
  the workspace.
- `LiveDemo` defers its first workspace read with `setTimeout(…, 0)` specifically to
  survive React StrictMode's double-mount in dev, which disposes the first workspace
  instance. Don't remove that deferral.
- Styling is plain CSS: global `src/index.css` + `src/App.css`, with per-component files
  (`StagePanel.css`, `LiveDemo.css`, `NewProjectDialog.css`) imported by their component
  — except `NewProjectDialog.css`, which `App.tsx` imports because the dialog is inlined
  there. No CSS modules, no Tailwind, no CSS-in-JS.
- Dialogs use `role="dialog" aria-modal="true"` with an `aria-labelledby` heading; keep
  that when adding new ones.

## Persistence

- Save/load uses `localStorage` via `src/project/ProjectStorage.ts`, keyed
  `coding-circus:project:<name>` plus a `coding-circus:project-index` array of names.
- The workspace is serialized with `Blockly.serialization.workspaces.save()` (JSON, not
  XML).
- Exported `.json` projects carry `formatVersion: 1`; `readProjectJsonFile()` rejects
  anything else. Bump and handle both versions if the shape ever changes.
- `sessionStorage['coding-circus:intro-seen']` gates the splash demo, and all
  storage access is wrapped in try/catch for private-browsing mode.

## Demos

Demo examples are data in `src/demo/liveDemoScript.ts` (`DEMO_EXAMPLES`); `DemoPlayer.ts`
animates them into the real workspace. The toolbar's demo selector is populated
automatically from `DEMO_EXAMPLES` — adding an entry is all that's needed. See
[`docs/demo-examples.md`](docs/demo-examples.md).

The current `DemoStatementStep` format only supports a statement block with exactly one
value input holding one shadow block. Richer demos (variables, conditionals, functions)
require extending both `DemoStatementStep` and `DemoPlayer.ts`.

`DemoPlayer` positions SVG groups directly during tweens and wraps `moveTo` /
`Blockly.Events.fire` in try/catch — Blockly throws when constructing move events for
blocks created via serialization rather than a real drag. Those try/catches are load-bearing.

## Backend status

`docs/backend-plan.md` and `supabase/schema.sql` describe a planned Supabase backend
(auth, cloud saves, public gallery, RLS policies). **Nothing in `src/` references Supabase
yet** — `@supabase/supabase-js` isn't even a dependency. `.env.example` documents the
future `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` variables. Treat the plan as a
design doc, not as implemented behavior, and keep localStorage working as the fallback
if you start Phase 1.

Never put a Supabase service-role key in the frontend, the repo, or the Pages build.

## Tooling notes

- **Linter is Oxlint**, configured in `.oxlintrc.json` with the `react`, `typescript`,
  and `oxc` plugins. `eslint-disable-next-line` comments in the source are honored by
  Oxlint; there is no ESLint install.
- TypeScript is strict-ish via `tsconfig.app.json`: `noUnusedLocals`,
  `noUnusedParameters`, `erasableSyntaxOnly`, `verbatimModuleSyntax`. Use
  `import type { … }` for type-only imports or the build fails.
- `vite.config.ts` sets `base: '/coding-circus/'` for Pages. Runtime asset paths must use
  `import.meta.env.BASE_URL` (as `BlockEditor` does for `blockly-media/`) — a hard-coded
  `/blockly-media/` breaks in production.
- The production bundle is ~950 kB (Blockly). The chunk-size warning in `npm run build`
  is expected, not a regression.

## Working in this repo

- Commit messages are short, imperative, sentence-case, one concern per commit
  (e.g. "Add demo example selector", "Move demo watermark left"). Match that style.
- Prefer small, focused commits over one large one.
- Before finishing: run `npm run build` and `npm run lint`. Run `npm run audit:blocks`
  too if you touched anything under `src/blockly/` — but expect the pre-existing failure
  described above unless you fixed the script.
- Don't add a test framework, backend, or state library without being asked; the
  zero-backend, no-test-suite shape is a deliberate MVP constraint.
