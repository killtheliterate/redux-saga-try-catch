import { AnyAction } from 'redux'
import { call as tCall } from 'typed-redux-saga'
import { call } from 'redux-saga/effects'

import {
  typedStandardAction as standardAction,
  typedDeferredAction as deferredAction,
} from '../index'

describe('typedStandardAction()', () => {
  it('yields to the passed generator', () => {
    const IO = { stdout: jest.fn() }

    function* aSaga(io: typeof IO, action: AnyAction) {
      yield call(io.stdout, action.type)
    }

    const iterator = standardAction(aSaga, IO)({ type: 'AN_ACTION' })

    expect(iterator.next().value).toEqual(
      call(aSaga, IO, { type: 'AN_ACTION' })
    )
  })

  it('catches if the delegate saga throws', () => {
    const IO = { stdout: jest.fn() }

    // eslint-disable-next-line require-yield
    function* aSaga(_io: typeof IO, _action: AnyAction) {
      throw new Error('oops')
    }

    const iterator = standardAction(aSaga, IO)({ type: 'AN_ACTION' })

    const { done: doneA, value: valueA } = iterator.next()

    expect(doneA).toEqual(false)

    expect(valueA).toEqual(call(aSaga, IO, { type: 'AN_ACTION' }))

    const { value: valueB } = iterator.throw(Error('oops'))

    expect(valueB).toEqual(call(IO.stdout, 'aSaga', Error('oops')))
  })
})

describe('typedDeferredAction()', () => {
  it('yields to the passed generator', () => {
    const IO = {
      echo: <T>(msg: T) => msg,
      sayNum: (num: number) => num,
      stdout: jest.fn(),
    }

    const action = {
      type: 'AN_ACTION',
      meta: {
        deferred: {
          success: jest.fn(),
          failure: jest.fn(),
        },
      },
    }

    function* aSaga(io: typeof IO, _action: typeof action) {
      const aNumber = yield* tCall(io.sayNum, 1)

      return aNumber
    }

    const iterator = deferredAction(aSaga, IO)(action)

    expect(iterator.next().value).toEqual(call(aSaga, IO, action))

    expect(iterator.next('A message').value).toEqual(
      call(action.meta.deferred.success, 'A message')
    )
  })

  it('catches if the delegate saga throws', () => {
    const IO = {
      stdout: jest.fn(),
      echo: (msg: unknown) => msg,
    }

    const action = {
      type: 'AN_ACTION',
      meta: {
        deferred: {
          success: jest.fn(),
          failure: jest.fn(),
        },
      },
    }

    // eslint-disable-next-line require-yield
    function* aSaga(_io: typeof IO, _action: typeof action) {
      throw new Error('welp...')
    }

    const iterator = deferredAction(aSaga, IO)(action)

    expect(iterator.next().value).toEqual(call(aSaga, IO, action))

    expect(iterator.throw(Error('welp...')).value).toEqual(
      call(IO.stdout, 'aSaga', Error('welp...'))
    )

    expect(iterator.next().value).toEqual(
      call(action.meta.deferred.failure, Error('welp...'))
    )
  })
})
