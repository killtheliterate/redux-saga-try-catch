import * as Utils from './utils'
import { call as tCall } from 'typed-redux-saga'
import { call, CallEffect } from 'redux-saga/effects'
import { isNotEmpty } from './is-not-empty'

export function deferredAction<T extends Utils.StdOut, A>(
  saga: Utils.Saga<T, A>,
  io: T
) {
  return function* withCatch(
    action: A & Utils.DeferredAction
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Generator<CallEffect<any>, void, unknown> {
    const { stdout } = io

    const {
      meta: { deferred, ...restMeta },
      ...rest
    } = action

    let payload = { ...rest }

    if (isNotEmpty(restMeta)) {
      payload = {
        ...rest,
        meta: restMeta,
      }
    }

    try {
      const result = yield call(saga, io, payload as A)

      yield call(deferred.success, result)
    } catch (err) {
      yield call(stdout, `${saga.name}`, err)
      yield call(deferred.failure, err)
    }
  }
}

export function typedDeferredAction<
  T extends Utils.StdOut,
  A extends Utils.DeferredAction
>(generator: Utils.TypedSaga<T, A>, io: T) {
  return function* withCatch(action: A) {
    const { stdout } = io

    try {
      const result = yield* tCall(generator, io, action)

      yield* tCall(action.meta.deferred.success, result)
    } catch (err) {
      yield* tCall(stdout, `${generator.name}`, err)

      yield* tCall(action.meta.deferred.failure, err)
    }
  }
}
