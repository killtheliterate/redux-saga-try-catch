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

export function standardAction<T extends StdOut, A> (saga: Saga<T, A>, io: T) {
  return function* withCatch (action: A & Action) {
    const { stdout } = io

    try {
      // Using `yield*` as it requires less plumbing to test then `call`
      yield* saga(io, action)
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
      const { meta, ...rest } = action as any

      // Using `yield*` as it requires less plumbing to test then `call`
      const result = yield* saga(io, rest)

      yield call(deferred.success, result)
    } catch (err) {
      yield call(stdout, `${saga.name}`, err)
      yield call(deferred.failure, err)
    }
  }
}
