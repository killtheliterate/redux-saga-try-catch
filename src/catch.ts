import { SagaIterator } from 'redux-saga'
import { call } from 'redux-saga/effects'

// ---------------------------------------------------------------------------

export type Action = {
  type: string
  error?: boolean
  payload?: any

  meta?: Pick<object, Exclude<keyof object, 'deferred'>>
}

export type DeferredAction = {
  type: string
  error?: boolean
  payload?: any

  meta: {
    deferred: {
      failure: (...args: any[]) => void
      success: (...args: any[]) => void
    }
  }
}

export type StdOut = {
  stdout: (...args: string[]) => void
}

export type Saga<T, A> = (io: T, action: A) => SagaIterator

// ---------------------------------------------------------------------------

// @TODO: Figure out why inferred type for `withCatch` won't transpile
//
// `tsc` produces the correct type, but webpack and rollup both create an
// invalid import statement as part of the type signature.
export function standardAction<T extends StdOut> (saga: Saga<T & StdOut, Action>, io: T & StdOut) {
  return function* withCatch (action: Action): IterableIterator<any> {
    const { stdout } = io

    try {
      const { payload, type } = action

      // Using `yield*` as it requires less plumbing to test then `call`
      yield* saga(io, { payload, type })
    } catch (err) {
      yield call(stdout, `${saga.name}`, err)
    }
  }
}

export function deferredAction<T extends StdOut> (saga: Saga<T, Action>, io: T) {
  return function* withCatch (action: DeferredAction): IterableIterator<any> {
    const { stdout } = io
    const { meta: { deferred } } = action

    try {
      const { payload, type } = action

      const result = yield* saga(io, { payload, type })

      yield call(deferred.success, result)
    } catch (err) {
      yield call(stdout, `${saga.name}`, err)
      yield call(deferred.failure, err)
    }
  }
}
