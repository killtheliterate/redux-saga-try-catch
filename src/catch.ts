import { SagaIterator } from 'redux-saga'
import { call } from 'redux-saga/effects'

// ---------------------------------------------------------------------------

export type StandardAction = {
  type: string
  error?: boolean
  payload?: any
  meta?: {[key: string]: any}
}

export type DeferredAction = {
  type: string
  meta: {[key: string]: any} & {
    deferred: {
      failure: (...args: any[]) => void
      success: (...args: any[]) => void
    }
  }

  error?: boolean
  payload?: any
}

export type StdOut = { stdout: (...args: string[]) => void }

export type Saga<T, A> = (io: T, action: A) => SagaIterator

// ---------------------------------------------------------------------------

export function standardAction<T extends StdOut, A> (saga: Saga<T, A>, io: T) {
  return function* withCatch (action: A & StandardAction) {
    const { stdout } = io

    try {
      yield call(saga, io, action)
    } catch (err) {
      yield call(stdout, `${saga.name}`, err)
    }
  }
}

export function deferredAction<T extends StdOut, A> (saga: Saga<T, A>, io: T) {
  return function* withCatch (action: A & DeferredAction) {
    const { stdout } = io
    const { meta: { deferred } } = action

    try {
      // Shaking out `meta`
      const { meta, ...rest } = action

      const result = yield call(saga, io, rest as A)

      yield call(deferred.success, result)
    } catch (err) {
      yield call(stdout, `${saga.name}`, err)
      yield call(deferred.failure, err)
    }
  }
}
