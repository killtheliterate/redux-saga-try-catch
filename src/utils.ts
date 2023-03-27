import { SagaIterator } from "redux-saga";

export type StandardAction = {
  error?: boolean;
  meta?: Record<string, unknown>;
  payload?: unknown;
  type: string;
};

export type DeferredAction = {
  error?: boolean;
  payload?: unknown;
  type: string;

  meta: Record<string, unknown> & {
    deferred: {
      failure: (...args: unknown[]) => void;
      success: (...args: unknown[]) => void;
    };
  };
};

export type StdOut = { stdout: (...args: unknown[]) => void };

export type Saga<T, A> = (io: T, action: A) => SagaIterator;
