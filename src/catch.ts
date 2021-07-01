import { call } from 'typed-redux-saga/macro'
import { isEmpty } from 'lodash'

// ---------------------------------------------------------------------------

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
      failure: (...args: unknown[]) => void
      success: (...args: unknown[]) => void
    }
  }
}

type StdOut = { stdout: (...args: unknown[]) => void }

// ---------------------------------------------------------------------------

export function standardAction<
  IO extends StdOut,
  Action extends StandardAction,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Saga extends (io: IO, action: Action) => any
> (
  fn: Saga,
  io: IO
) {
  return function* withCatch (action: Action) {
    type SagaArgs = Parameters<Saga>

    const { stdout } = io

    const args: unknown = [io, action]

    try {
      yield* call(
        fn,
        ...args as SagaArgs
      )
    } catch (err) {
      yield* call(stdout, `${fn.name}`, err)
    }
  }
}

export function deferredAction<
  IO extends StdOut,
  Action extends DeferredAction,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Saga extends (io: IO, action: Action) => any,
> (
  fn: Saga,
  io: IO
) {
  return function* withCatch (action: Action) {
    type SagaArgs = Parameters<Saga>

    const { stdout } = io
    const { meta: { deferred, ...restMeta }, ...rest } = action

    let restAction = { ...rest }

    if (isNotEmpty(restMeta)) {
      restAction = {
        ...rest,
        meta: restMeta 
      }
    }

    const args: unknown = [io, restAction]

    try {
      const result = yield* call(
        fn,
        ...args as SagaArgs
      )

      yield* call(deferred.success, result)
    } catch (err) {
      yield* call(stdout, `${fn.name}`, err)
      yield* call(deferred.failure, err)
    }
  }
}

function isNotEmpty<T> (value: T): value is NonNullable<T> {
  return !isEmpty(value)
}
