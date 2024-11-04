import * as Utils from "./utils";
import { call as tCall } from "typed-redux-saga";
import { call, CallEffect } from "redux-saga/effects";

export function deferredAction<
  T extends Utils.StdOut,
  A extends Utils.DeferredAction
>(saga: Utils.Saga<T, A>, io: T) {
  return function* withCatch(action: A): Generator<CallEffect> {
    const { stdout } = io;

    try {
      const result = yield call(saga, io, action);

      yield call(action.meta.deferred.success, result);
    } catch (err) {
      yield call(stdout, `${saga.name}`, err);
      yield call(action.meta.deferred.failure, err);
    }
  };
}

export function typedDeferredAction<
  T extends Utils.StdOut,
  A extends Utils.DeferredAction
>(saga: Utils.Saga<T, A>, io: T) {
  return function* withCatch(action: A) {
    const { stdout } = io;

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = yield* tCall(saga, io, action);

      yield* tCall(action.meta.deferred.success, result);
    } catch (err) {
      yield* tCall(stdout, `${saga.name}`, err);
      yield* tCall(action.meta.deferred.failure, err);
    }
  };
}
