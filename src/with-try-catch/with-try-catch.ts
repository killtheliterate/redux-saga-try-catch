import { Action as RAction } from 'redux'
import { SagaIterator } from 'redux-saga'
import { call } from 'redux-saga/effects'

// ---------------------------------------------------------------------------

export type DeferredAction = {
  error?: boolean
  payload?: any
  type: string
  meta: {
    deferred: {
      failure: (...args: any[]) => void
      success: (...args: any[]) => void
    }
  }
}

export interface Action {
  type: string
  error?: boolean
  meta?: Pick<object, Exclude<keyof object, 'deferred'>>
  payload?: any
}

type Saga= (io: IO, action: any) => SagaIterator

type SafeSaga<T> = {
  (saga: Saga, io: IO): (action: T) => SagaIterator
}

export type EffectMiddlewares = {
  [index: string]: (...args: any[]) => void

  // api: Api
  // http: HttpClient
  // log: {
  //   stdout: (...msgs: string[]) => void
  // }
}

export type StdOut = {
  stdout: (...args: any[]) => void
}

export type IO = EffectMiddlewares & StdOut

// ---------------------------------------------------------------------------

// @TODO: Type-safety
//
// Figure out how to guarantee things about what is dispatched to these sagas
// during runtime by creating a stronger type relationship. See
// `with-try-catch`. It can make assertion about what is passed to it, but
// there's no guarantee that the object related to
// `ExampleActions.DO_ANOTHER_THING` is actually a `DeferredAction`. There's
// just something missing here
//
// It might be something like typing out `takeEvery` impl

export const deferredAction: SafeSaga<DeferredAction> = (saga, io) => {
  return function* (action) {
    const { stdout } = io
    const { meta: { deferred } } = action

    try {
      const { payload, type } = action

      const result = yield call(saga, io, { payload, type })

      yield call(deferred.success, result)
    } catch (err) {
      yield call(stdout, `${saga.name}`, err)

      yield call(deferred.failure, err)
    }
  }
}

export const standardAction: SafeSaga<Action> = (saga, io) => {
  return function* (action) {
    const { stdout } = io

    try {
      const { payload, type } = action

      return yield call(saga, io, { payload, type })
    } catch (err) {
      yield call(stdout, `${saga.name}`, err)
    }
  }
}
