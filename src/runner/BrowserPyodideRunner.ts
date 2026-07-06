import type { RunnerInterface, RunOptions } from './RunnerInterface';
import type { RunResult } from './RunResult';
import { normalizeError } from './errorNormalization';

interface PendingRun {
  resolve: (result: RunResult) => void;
  stdout: string;
  stderr: string;
  onStdout?: (chunk: string) => void;
  onStderr?: (chunk: string) => void;
  startedAt: number;
  timeoutHandle?: ReturnType<typeof setTimeout>;
  settled: boolean;
  stopped: boolean;
}

/**
 * Runs Python in the browser via Pyodide inside a Web Worker, so execution
 * (including accidental infinite loops) never freezes the UI thread.
 *
 * Stop/timeout are implemented by terminating and recreating the worker: Pyodide
 * has no reliable cooperative interrupt without SharedArrayBuffer + cross-origin
 * isolation headers, which an MVP with no backend server can't guarantee. Worker
 * termination is blunt but always works.
 */
export class BrowserPyodideRunner implements RunnerInterface {
  private worker: Worker | null = null;
  private readyPromise: Promise<void> | null = null;
  private resolveReady: (() => void) | null = null;
  private rejectReady: ((err: Error) => void) | null = null;
  private nextRunId = 1;
  private pending = new Map<number, PendingRun>();
  private activeRunId: number | null = null;

  async init(): Promise<void> {
    if (!this.worker) this.spawnWorker();
    return this.readyPromise!;
  }

  private spawnWorker(): void {
    this.worker = new Worker(new URL('./pyodideWorker.ts', import.meta.url), { type: 'module' });
    this.readyPromise = new Promise((resolve, reject) => {
      this.resolveReady = resolve;
      this.rejectReady = reject;
    });
    this.worker.onmessage = (event: MessageEvent) => this.handleMessage(event.data);
    this.worker.onerror = (event: ErrorEvent) => {
      this.rejectReady?.(new Error(event.message));
      this.failAllPending(`Worker error: ${event.message}`);
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handleMessage(data: any): void {
    switch (data.type) {
      case 'ready':
        this.resolveReady?.();
        break;
      case 'fatal':
        this.rejectReady?.(new Error(data.message));
        this.failAllPending(data.message);
        break;
      case 'stdout': {
        const pending = this.pending.get(data.id);
        if (pending) {
          pending.stdout += data.chunk;
          pending.onStdout?.(data.chunk);
        }
        break;
      }
      case 'stderr': {
        const pending = this.pending.get(data.id);
        if (pending) {
          pending.stderr += data.chunk;
          pending.onStderr?.(data.chunk);
        }
        break;
      }
      case 'result': {
        const pending = this.pending.get(data.id);
        if (!pending || pending.settled) break;
        this.settle(data.id, pending, {
          success: data.ok,
          stdout: pending.stdout,
          stderr: pending.stderr,
          error: data.ok ? undefined : normalizeError(data.traceback),
          timedOut: false,
          stopped: false,
          durationMs: Date.now() - pending.startedAt,
        });
        break;
      }
      default:
        break;
    }
  }

  private settle(id: number, pending: PendingRun, result: RunResult): void {
    pending.settled = true;
    if (pending.timeoutHandle) clearTimeout(pending.timeoutHandle);
    this.pending.delete(id);
    if (this.activeRunId === id) this.activeRunId = null;
    pending.resolve(result);
  }

  private failAllPending(message: string): void {
    for (const [id, pending] of this.pending) {
      if (pending.settled) continue;
      this.settle(id, pending, {
        success: false,
        stdout: pending.stdout,
        stderr: pending.stderr,
        error: normalizeError(`RunnerError: ${message}`),
        timedOut: false,
        stopped: pending.stopped,
        durationMs: Date.now() - pending.startedAt,
      });
    }
  }

  async run(code: string, options: RunOptions = {}): Promise<RunResult> {
    await this.init();
    const id = this.nextRunId++;
    this.activeRunId = id;

    return new Promise<RunResult>((resolve) => {
      const pending: PendingRun = {
        resolve,
        stdout: '',
        stderr: '',
        onStdout: options.onStdout,
        onStderr: options.onStderr,
        startedAt: Date.now(),
        settled: false,
        stopped: false,
      };
      this.pending.set(id, pending);

      if (options.timeoutMs) {
        pending.timeoutHandle = setTimeout(() => {
          if (pending.settled) return;
          this.terminateAndRespawn();
          this.settle(id, pending, {
            success: false,
            stdout: pending.stdout,
            stderr: pending.stderr,
            timedOut: true,
            stopped: false,
            durationMs: Date.now() - pending.startedAt,
          });
        }, options.timeoutMs);
      }

      this.worker!.postMessage({ type: 'run', id, code });
    });
  }

  /** Forcibly abort whatever is currently running. */
  stop(): void {
    if (this.activeRunId === null) return;
    const id = this.activeRunId;
    const pending = this.pending.get(id);
    if (!pending || pending.settled) return;
    pending.stopped = true;
    this.terminateAndRespawn();
    this.settle(id, pending, {
      success: false,
      stdout: pending.stdout,
      stderr: pending.stderr,
      timedOut: false,
      stopped: true,
      durationMs: Date.now() - pending.startedAt,
    });
  }

  /** Tear down and recreate the interpreter, e.g. after a stop/timeout or on user request. */
  async reset(): Promise<void> {
    this.terminateAndRespawn();
    await this.init();
  }

  private terminateAndRespawn(): void {
    this.worker?.terminate();
    this.worker = null;
    this.spawnWorker();
  }

  dispose(): void {
    this.worker?.terminate();
    this.worker = null;
    this.readyPromise = null;
    this.pending.clear();
  }
}
