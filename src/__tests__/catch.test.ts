import { AnyAction } from 'redux'
import { call } from 'typed-redux-saga'

// ---------------------------------------------------------------------------

import {
  deferredAction,
  standardAction,
} from '../catch'

// ---------------------------------------------------------------------------

describe.only('Catch.standardAction()', () => {
  it('yields to the passed generator', () => {
    const IO = { stdout: () => undefined }


    function* aSaga (io: typeof IO, action: AnyAction) {
      console.log('call', call)
      yield call(io.stdout, action.type)

      // return yield* call(io.stdout, action.type)
    }

    const iterator = standardAction(aSaga, IO)({ type: 'AN_ACTION' })

    expect(iterator.next().value).toEqual(
      call(aSaga, IO, { type: 'AN_ACTION' })
    )
  })

  it('catches if the delegate saga throws', () => {
    const IO = { stdout: () => undefined }

    function* aSaga (_io: typeof IO, _action: AnyAction) {
      throw new Error('oops')
    }

    const iterator = standardAction(aSaga, IO)({ type: 'AN_ACTION' })
    const { done: doneA, value: valueA } = iterator.next()

    expect(doneA).toEqual(false)

    expect(valueA).toEqual(
      call(aSaga, IO, { type: 'AN_ACTION' })
    )

    const { value: valueB } = iterator.throw(Error('oops'))

    expect(valueB).toEqual(
      call(IO.stdout, 'aSaga', Error('oops'))
    )
  })
})

describe('Catch.deferredAction()', () => {
  it('yields to the passed generator', () => {
    const IO = {
      stdout: () => undefined,
      echo: (msg: string) => msg
    }

    const action = {
      type: 'AN_ACTION',
      meta: {
        deferred: {
          success: jest.fn(),
          failure: jest.fn()
        }
      }
    }

    function* aSaga (io: typeof IO, _action: AnyAction) {
      const result = yield* call(io.echo, 'A message')

      return result
    }

    const iterator = deferredAction(aSaga, IO)(action)

    expect(iterator.next().value).toEqual(
      call(aSaga, IO, { type: 'AN_ACTION' })
    )

    expect(iterator.next('A message').value).toEqual(
      call(action.meta.deferred.success, 'A message')
    )
  })

  it('catches if the delegate saga throws', () => {
    const IO = {
      stdout: () => undefined,
      echo: (msg: string) => msg
    }

    const action = {
      type: 'AN_ACTION',
      meta: {
        deferred: {
          success: jest.fn(),
          failure: jest.fn()
        }
      }
    }

    function* aSaga (_io: typeof IO, _action: AnyAction) {
      throw new Error('welp...')
    }

    const iterator = deferredAction(aSaga, IO)(action)

    expect(iterator.next().value).toEqual(
      call(aSaga, IO, { type: 'AN_ACTION' })
    )

    expect(iterator.throw(Error('welp...')).value).toEqual(
      call(IO.stdout, 'aSaga', Error('welp...'))
    )

    expect(iterator.next().value).toEqual(
      call(action.meta.deferred.failure, Error('welp...'))
    )
  })

  it('passes the rest of meta', () => {
    const IO = {
      stdout: () => undefined,
      echo: (msg: string) => msg
    }

    const action = {
      type: 'AN_ACTION',
      meta: {
        foobat: 'hey',
        deferred: {
          success: jest.fn(),
          failure: jest.fn()
        }
      }
    }

    function* aSaga (io: typeof IO, _action: AnyAction) {
      const result = yield* call(io.echo, 'A message')

      return result
    }

    const iterator = deferredAction(aSaga, IO)(action)

    expect(iterator.next().value).toEqual(
      call(
        aSaga,
        IO,
        {
          type: 'AN_ACTION',
          meta:  { foobat: 'hey' }
        }
      )
    )

    expect(iterator.next('A message').value).toEqual(
      call(action.meta.deferred.success, 'A message')
    )
  })
})
