import type { RunResult } from './RunResult';

export interface RunOptions {
  /** Milliseconds before the run is aborted as timed out. Omit for no timeout. */
  timeoutMs?: number;
  /** Called incrementally as the program writes to stdout. */
  onStdout?: (chunk: string) => void;
  /** Called incrementally as the program writes to stderr. */
  onStderr?: (chunk: string) => void;
}

/**
 * Contract every execution backend must satisfy. BrowserPyodideRunner is the
 * first implementation; LocalPythonRunner and DockerSandboxRunner (see
 * ARCHITECTURE.md) are future implementations of this same interface.
 */
export interface RunnerInterface {
  /** Prepare the backend (e.g. load the Python runtime). Safe to call once, up front. */
  init(): Promise<void>;
  /** Run a program to completion (or until it errors, times out, or is stopped). */
  run(code: string, options?: RunOptions): Promise<RunResult>;
  /** Forcibly stop a run in progress. */
  stop(): void;
  /** Tear down and recreate the backend, clearing any leftover interpreter state. */
  reset(): Promise<void>;
  /** Release resources (worker threads, etc). */
  dispose(): void;
}
