import * as Utils from './utils'
import { call as tCall } from 'typed-redux-saga'
import { call } from 'redux-saga/effects'

export function standardAction<
  T extends Utils.StdOut,
  A extends Utils.StandardAction,
>(saga: Utils.Saga<T, A>, io: T) {
  return function* withCatch(action: A) {
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
  A extends Utils.StandardAction,
>(saga: Utils.Saga<T, A>, io: T) {
  return function* withCatch(action: A) {
    const { stdout } = io

    try {
      yield* tCall(saga, io, action)
    } catch (err) {
      yield* tCall(stdout, `${saga.name}`, err)
    }
  }
}
