import { SagaIterator } from 'redux-saga'
import { call } from 'redux-saga/effects'

// ---------------------------------------------------------------------------

export interface Action {
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

export type Saga = (io: IO, action: Action) => SagaIterator

export type SafeSaga<T> = {
  (saga: Saga, io: IO): (action: T) => SagaIterator
}

export type EffectMiddlewares = {
  [index: string]: (...args: any[]) => void
}

export type StdOut = {
  stdout: (...args: any[]) => void
}

export type IO = EffectMiddlewares & StdOut

// ---------------------------------------------------------------------------

export const standardAction: SafeSaga<Action> = (saga, io) => {
  return function* withCatch (action) {
    const { stdout } = io

    try {
      const { payload, type } = action

      yield* saga(io, { payload, type })
    } catch (err) {
      yield call(stdout, `${saga.name}`, err)
    }
  }
}

export const deferredAction: SafeSaga<DeferredAction> = (saga, io) => {
  return function* withCatch (action) {
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
