import * as Utils from './utils'
import { call as tCall } from 'typed-redux-saga'
import { call } from 'redux-saga/effects'

export function standardAction<T extends Utils.StdOut, A>(
  saga: Utils.Saga<T, A>,
  io: T
) {
  return function* withCatch(action: A & Utils.StandardAction) {
    const { stdout } = io

    try {
      yield call(saga, io, action)
    } catch (err) {
      yield call(stdout, `${saga.name}`, err)
    }
  }
}

export function typedStandardAction<
  T extends Utils.StdOut,
  A extends Utils.StandardAction
>(generator: Utils.TypedSaga<T, A>, io: T) {
  return function* withCatch(action: A) {
    const { stdout } = io

    try {
      yield* tCall(generator, io, action)
    } catch (err) {
      yield* tCall(stdout, `${generator.name}`, err)
    }
  }
}
