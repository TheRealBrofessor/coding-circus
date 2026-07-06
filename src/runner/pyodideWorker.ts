/// <reference lib="webworker" />

// Loaded from a CDN at runtime so the app ships no multi-megabyte wasm bundle.
// See ARCHITECTURE.md for the tradeoffs and the self-hosting alternative.
const PYODIDE_VERSION = '0.26.4';
const PYODIDE_BASE = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

interface RunMessage {
  type: 'run';
  id: number;
  code: string;
}
interface ResetMessage {
  type: 'reset';
  id: number;
}
type IncomingMessage = RunMessage | ResetMessage;

// Defines a Python-side helper so every run compiles the user's program under a
// fixed filename ("<program>") and captures the traceback instead of raising
// out of the worker. Globals are a fresh dict per call, so runs never leak
// variables into one another even though the interpreter itself is reused.
const DRIVER_SRC = `
import traceback as __cc_traceback

def __coding_circus_run(user_code):
    try:
        compiled = compile(user_code, "<program>", "exec")
        exec(compiled, {"__name__": "__main__"})
        return {"ok": True, "traceback": ""}
    except BaseException:
        return {"ok": False, "traceback": __cc_traceback.format_exc()}
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pyodide: any;
let readyPromise: Promise<void> | null = null;
let currentRunId: number | null = null;

function ensureReady(): Promise<void> {
  if (!readyPromise) {
    readyPromise = (async () => {
      const { loadPyodide } = await import(/* @vite-ignore */ `${PYODIDE_BASE}pyodide.mjs`);
      pyodide = await loadPyodide({ indexURL: PYODIDE_BASE });
      pyodide.setStdout({
        batched: (s: string) => {
          if (currentRunId !== null) postMessage({ type: 'stdout', id: currentRunId, chunk: s + '\n' });
        },
      });
      pyodide.setStderr({
        batched: (s: string) => {
          if (currentRunId !== null) postMessage({ type: 'stderr', id: currentRunId, chunk: s + '\n' });
        },
      });
      await pyodide.runPythonAsync(DRIVER_SRC);
      postMessage({ type: 'ready' });
    })();
  }
  return readyPromise;
}

ensureReady().catch((err: unknown) => {
  postMessage({ type: 'fatal', message: err instanceof Error ? err.message : String(err) });
});

self.onmessage = async (event: MessageEvent<IncomingMessage>) => {
  const msg = event.data;

  if (msg.type === 'reset') {
    pyodide = undefined;
    readyPromise = null;
    try {
      await ensureReady();
      postMessage({ type: 'resetDone', id: msg.id });
    } catch (err) {
      postMessage({ type: 'fatal', message: err instanceof Error ? err.message : String(err) });
    }
    return;
  }

  if (msg.type === 'run') {
    currentRunId = msg.id;
    try {
      await ensureReady();
      const run = pyodide.globals.get('__coding_circus_run');
      let ok = true;
      let tb = '';
      try {
        const resultProxy = await run(msg.code);
        const result = resultProxy.toJs({ dict_converter: Object.fromEntries });
        resultProxy.destroy();
        ok = result.ok as boolean;
        tb = result.traceback as string;
      } finally {
        run.destroy();
      }
      postMessage({ type: 'result', id: msg.id, ok, traceback: tb });
    } catch (err) {
      postMessage({
        type: 'result',
        id: msg.id,
        ok: false,
        traceback: err instanceof Error ? `${err.name}: ${err.message}` : String(err),
      });
    } finally {
      currentRunId = null;
    }
  }
};
