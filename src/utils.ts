import { SagaIterator } from 'redux-saga'

export type StandardAction = {
  error?: boolean
  meta?: Record<string, unknown>
  payload?: unknown
  type: string
}

export type DeferredAction = {
  error?: boolean
  payload?: unknown
  type: string

  meta: Record<string, unknown> & {
    deferred: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      failure: (..._args: any[]) => void

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      success: (..._args: any[]) => void
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StdOut = { stdout: (..._args: any[]) => void }

export type Saga<T, A> = (_io: T, _action: A) => SagaIterator
export type TypedSaga<T, A> = (_io: T, _action: A) => Generator
