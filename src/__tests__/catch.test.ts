import { AnyAction } from 'redux'
import { call, CallEffect } from 'redux-saga/effects'

import { deferredAction, standardAction } from '../index'

describe('standardAction()', () => {
  const IO = { stdout: jest.fn() }

  it('yields to the passed generator', () => {
    function* aSaga(io: typeof IO, action: { type: string }) {
      yield call(io.stdout, action.type)
    }

    const iterator = standardAction(aSaga, IO)({ type: 'AN_ACTION' })

    expect(iterator.next().value).toEqual(
      call(aSaga, IO, { type: 'AN_ACTION' })
    )
  })

  it('catches if the delegate saga throws', () => {
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

describe('deferredAction()', () => {
  const IO = {
    echo: <T>(msg: T) => msg,
    sayNum: (num: number) => num,
    sayStr: (str: string) => str,
    stdout: jest.fn(),
  }

  it('yields to the passed generator', () => {
    const action = {
      type: 'AN_ACTION',
      meta: {
        deferred: {
          success: jest.fn(),
          failure: jest.fn(),
        },
      },
    }

    function* aSaga(io: typeof IO, _action: AnyAction) {
      yield call(io.sayNum, 123)
      yield call(io.sayStr, 'hello')
    }

    // This generator is *not* "aSaga", but instead the wrapper saga
    const iterator = deferredAction(aSaga, IO)(action)

    expect(iterator.next().value).toEqual(call(aSaga, IO, action))

    expect(iterator.next('yielded').value).toEqual(
      call(action.meta.deferred.success, 'yielded')
    )
  })

  it('catches if the delegate saga throws', () => {
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
    function* aSaga(_io: typeof IO, _action: AnyAction) {
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

  it('passes the rest of meta', () => {
    const action = {
      type: 'AN_ACTION',
      meta: {
        foobat: 'hey',
        deferred: {
          success: jest.fn(),
          failure: jest.fn(),
        },
      },
    }

    function* aSaga(
      io: typeof IO,
      _action: AnyAction
    ): Generator<CallEffect<unknown>> {
      const result = yield call(io.echo, 'A message')

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return result
    }

    const iterator = deferredAction(aSaga, IO)(action)

    expect(iterator.next().value).toEqual(call(aSaga, IO, action))

    expect(iterator.next('A message').value).toEqual(
      call(action.meta.deferred.success, 'A message')
    )
  })
})
