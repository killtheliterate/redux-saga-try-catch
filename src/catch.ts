import { SagaIterator } from 'redux-saga'
import { call } from 'redux-saga/effects'

// ---------------------------------------------------------------------------

export type Action<T> = {
  type: string
  error?: boolean
  payload?: T

  meta?: Pick<object, Exclude<keyof object, 'deferred'>>
}

export type DeferredAction<T> = {
  type: string
  error?: boolean
  payload?: T

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

// @TODO: Type function for creating an action partial???
//
// It'd probably be handy to have a type function that receives a type and
// reduces it to the type that'll be exposed elsewhere, i.e.:
//
// type Deferred = Catch.DeferredAction['meta']['deferred']
//
// type Fetch = {
//   type: 'FETCH'
//   meta: { deferred: Deferred }
//   payload: string
// }
//
// export function FETCH (payload: Fetch['payload'], deferred: Deferred): Fetch {
//   return {
//     type: 'FETCH',
//     meta: { deferred },
//     payload
//   }
// }
//
// type FetchWithShookPropsRemoved = ActionPartial<Fetch>
//
// ...where FetchWithShookPropsRemoved can be easily used by reducers and the
// like.

// ---------------------------------------------------------------------------

export function standardAction<T extends StdOut, A> (saga: Saga<T, Action<A>>, io: T) {
  return function* withCatch (action: Action<A>) {
    const { stdout } = io

    try {
      yield call(saga, io, action)
    } catch (err) {
      yield call(stdout, `${saga.name}`, err)
    }
  }
}

export function deferredAction<T extends StdOut, A> (saga: Saga<T, Action<A>>, io: T) {
  return function* withCatch (action: DeferredAction<A>) {
    const { stdout } = io
    const { meta: { deferred } } = action

    try {
      // Shaking out `meta`
      const { meta, ...rest } = action as any

      const result = yield call(saga, io, rest)

      yield call(deferred.success, result)
    } catch (err) {
      yield call(stdout, `${saga.name}`, err)
      yield call(deferred.failure, err)
    }
  }
}
