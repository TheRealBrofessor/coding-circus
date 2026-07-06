/** A single normalized, beginner-friendly error derived from a Python exception. */
export interface NormalizedError {
  /** Exception class name, e.g. "NameError". */
  type: string;
  /** Short, plain-language explanation aimed at beginners. */
  message: string;
  /** Line number in the user's generated code, if it could be determined. */
  line?: number;
  /** Optional extra hint on how to fix the problem. */
  hint?: string;
  /** The original, unmodified Python traceback for the "advanced" toggle. */
  rawTraceback: string;
}

/** The outcome of running a piece of Python code through a Runner. */
export interface RunResult {
  success: boolean;
  stdout: string;
  stderr: string;
  error?: NormalizedError;
  timedOut: boolean;
  stopped: boolean;
  durationMs: number;
}
