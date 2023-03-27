import { call } from "redux-saga/effects";

import * as Utils from "./utils";

export function standardAction<T extends Utils.StdOut, A>(
  saga: Utils.Saga<T, A>,
  io: T
) {
  return function* withCatch(action: A & Utils.StandardAction) {
    const { stdout } = io;

    try {
      yield call(saga, io, action);
    } catch (err) {
      yield call(stdout, `${saga.name}`, err);
    }
  };
}
