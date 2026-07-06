# Coding Circus — Architecture

## Product loop (MVP scope)

1. User drags blocks in Blockly.
2. Blocks generate readable Python (deterministic, via `blockly/python`'s generator with our own `python_*` block definitions).
3. Generated Python is shown live in a side panel (`CodePanel`).
4. User clicks Run.
5. Python executes via a `RunnerInterface` implementation.
6. Output streams to the Console and is mirrored to the Stage.
7. Errors are caught, normalized into a beginner-friendly message, with a raw-traceback toggle for advanced users.
8. Projects can be saved/loaded (localStorage) and exported (`.py` and `.json`).

The MVP intentionally does not depend on a backend server — everything (Blockly, the generator, and the Python runtime) runs client-side.

## Block engine

Blockly (`blockly` npm package, core only — `blockly/core`) is the block engine. We do not use Blockly's stock toolbox; instead we define our own namespaced `python_*` blocks so the toolbox only ever shows Python-relevant primitives across twelve categories (Values, Variables, Text, Math, Logic, Control, Input, Lists, Random, Functions, Debug, Stage — see [BLOCKS.md](BLOCKS.md) for the full inventory). Block JSON definitions live in `src/blockly/blocks/*.ts`, one file per category, registered via `src/blockly/blocks/index.ts`.

Code generation reuses Blockly's maintained `pythonGenerator` (from `blockly/python`) rather than a hand-rolled generator, registering a `forBlock[type]` function per custom block type (`src/blockly/generators/*.ts`). This gets us correct operator-precedence parenthesization, indentation, and variable-name legalization for free, while every block we expose is still fully custom. `generatePython()` (`src/blockly/setup.ts`) is the single entry point the UI calls.

### Generator safety rules

Field values are treated as untrusted (corrupt or hand-edited project JSON can contain anything), and `src/blockly/generators/helpers.ts` is the enforcement point:

- Dropdown operators go through `pickOperator` (unknown values fall back to a safe default instead of crashing).
- Number fields go through `safeNumber` (NaN/Infinity become `0`, never invalid Python).
- Comment text goes through `sanitizeInlineText` (line breaks collapse to spaces, so a field value cannot inject extra Python lines).
- Typed function names go through `legalizePythonName` (legal identifier, keyword-safe).
- Blockly's protected `definitions_` (hoisted imports) and `nameDB_` (collision-free loop variables) are only touched via `addDefinition`/`distinctName`, keeping the unsafe casts in one commented place.
- Empty statement branches always generate `pass`.

### Design decisions worth knowing

- **Input blocks** generate standard `input(...)` Python, but the in-browser runner has no interactive stdin: making `input()` block synchronously inside a worker requires `SharedArrayBuffer` + cross-origin isolation headers, which static hosting (GitHub Pages) cannot provide. The runner instead normalizes the resulting `EOFError`/`OSError` into a friendly "export and run with desktop Python" hint. `LocalPythonRunner` (below) would support input natively.
- **Stage blocks** compile to plain `print()` calls. The Stage panel mirrors the latest printed line, and an empty printed line clears it. This keeps exported programs 100% standard Python with no Coding Circus runtime library.
- **Functions have no parameters.** Parameterized functions need Blockly mutators (dynamic block shapes); the beginner set trades that away for simplicity. Define/call blocks are matched by typed name.
- **List indexing is Python-native (0-based)** — the point of the tool is learning real Python, so `lst[0]` is shown as-is rather than Scratch-style 1-based indexing.

If Blockly ever needs to be replaced, the replacement only needs to (a) render a workspace, (b) fire a change event the UI can listen to, and (c) let `generatePython`-equivalent code walk it — nothing else in the app depends on Blockly internals directly except `BlockEditor.tsx` and the `blockly/` directory.

## Runner abstraction

```
RunnerInterface
  init(): Promise<void>
  run(code, options): Promise<RunResult>
  stop(): void
  reset(): Promise<void>
  dispose(): void
```

`RunResult` carries `success`, `stdout`, `stderr`, `error?: NormalizedError`, `timedOut`, `stopped`, `durationMs`. `NormalizedError` carries a beginner-friendly `message`/`hint` plus the untouched `rawTraceback` for the advanced toggle (see `src/runner/errorNormalization.ts`).

### BrowserPyodideRunner (implemented, first backend)

- Runs Pyodide inside a dedicated Web Worker (`src/runner/pyodideWorker.ts`) so a runaway or slow Python program never freezes the page.
- Pyodide itself is loaded from the jsdelivr CDN (`pyodide.mjs` + wasm assets) at runtime via dynamic `import()` inside the worker, rather than bundled — keeps the app's own bundle small. This is a **network dependency for v1** (the CDN, not a backend server we operate); self-hosting the Pyodide assets under `public/` is a documented future improvement if fully offline use is required.
- stdout/stderr are captured via `pyodide.setStdout`/`setStderr` batched callbacks and streamed back to the main thread per line.
- Each `run()` compiles the user's program under a fixed filename (`<program>`) inside a fresh globals dict, so successive runs never leak variables into each other even though the same interpreter instance is reused between runs (fast — no reload).
- **Timeout / stop**: Pyodide has no reliable way to interrupt a tight WASM loop from the outside without `SharedArrayBuffer` + cross-origin-isolation headers (`COOP`/`COEP`), which an MVP with no backend can't guarantee it'll get from static hosting. Instead, `stop()` and timeout both terminate the worker outright and immediately spawn + re-initialize a replacement — blunt, but 100% reliable, and the cost (a few seconds to reload Pyodide) only hits the stop/timeout/reset paths, not normal runs.
- **Error normalization**: raw `traceback.format_exc()` output is parsed to pull the exception type, message, and line number, then matched against a small dictionary of beginner-friendly explanations for the exceptions new programmers hit most (`NameError`, `TypeError`, `IndexError`, etc.). The raw traceback is always preserved and shown behind an "advanced" toggle.

## Future runner targets (documented, not required for MVP)

These share the same `RunnerInterface`/`RunResult` contract, so the UI (`App.tsx`, `Toolbar`, `ConsolePanel`) does not need to change to support them — only the object constructed in `App.tsx` (`new BrowserPyodideRunner()`) changes, or becomes user-selectable.

### LocalPythonRunner (future — desktop/local Linux)

- Intended for a desktop build (e.g. Electron/Tauri wrapper) or a local dev mode where a real `python3` binary is available.
- Would spawn `python3` as a child process per run (likely via a small local IPC/HTTP bridge from the renderer, or Node's `child_process` if running in an Electron main process), piping stdout/stderr back incrementally.
- True `stop()` becomes trivial and reliable: send `SIGTERM`/`SIGKILL` to the child process.
- Timeout becomes trivial: kill the process after N seconds.
- Security note: this only makes sense where the "backend" is the user's own machine (no untrusted multi-tenant execution) — this is *not* suitable for a hosted/shared deployment, which is what `DockerSandboxRunner` is for.

### DockerSandboxRunner (future — hosted/classroom/cloud)

- Intended for a hosted deployment where many untrusted users' code needs to run in isolation.
- Each `run()` would ship the generated code to a backend API, which executes it inside a locked-down, resource-limited, network-disabled Docker (or gVisor/Firecracker) container and streams stdout/stderr back (e.g. over a WebSocket or SSE), matching the same chunked-callback shape `RunOptions.onStdout`/`onStderr` already expects.
- This is the runner that would require a real backend server; it's explicitly out of scope for the MVP, whose whole point is proving the core loop with zero backend.
- `stop()` maps to killing/removing the container; `timeout` maps to the container's own resource/wall-clock limits plus a server-side watchdog.

## Project persistence

- **Save/Load**: the Blockly workspace is serialized with `Blockly.serialization.workspaces.save(workspace)` (plain JSON, not XML) and stored in `localStorage`, keyed by project name, with an index key tracking known project names (`src/project/ProjectStorage.ts`).
- **Export**: `Export .py` downloads the currently generated Python source. `Export project` downloads a `.json` file (`{ formatVersion, name, updatedAt, workspaceJson }`) that fully round-trips through `Import project`.
- **Untrusted-data posture** (`src/project/validation.ts`): every read path assumes the data may be corrupt. Imported files are shape-validated (with a distinct "made with a newer version" message for future `formatVersion`s — the migration hook lives in `validateProjectFile`), stored entries that fail parsing load as `null` instead of throwing, the name index self-heals, download filenames are sanitized, and workspace deserialization failures surface a console message over a cleared workspace instead of crashing. Name collisions on import are renamed `"(imported)"`.
- Projects are local-only (no accounts, no sync) — consistent with "no backend server."

## Static site & deployment

- The app is a fully client-side Vite build (`npm run build` → `dist/`), hostable on any static file server. The only runtime network dependency is the Pyodide CDN fetch on first Run (disclosed on the landing screen).
- First visit shows a landing hero (`Landing.tsx`) with a "Start Coding" CTA and an opt-in self-building demo (`LiveDemo.tsx` + `src/demo/`); starter projects live in `src/examples/` as workspace JSON and load through the same guarded path as saved projects.
- GitHub Pages: `.github/workflows/deploy-pages.yml` builds with `--base=/coding-circus/` and deploys via `actions/deploy-pages`. Blockly's media path is `BASE_URL`-relative so the editor works from a subpath. Pages must be enabled with source "GitHub Actions" (public repo required on GitHub Free).
