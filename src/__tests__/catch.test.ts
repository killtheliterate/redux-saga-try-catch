import { AnyAction } from 'redux'
import { call } from 'redux-saga/effects'

// ---------------------------------------------------------------------------

import { deferredAction, standardAction } from '../catch'

// ---------------------------------------------------------------------------

describe('Catch.standardAction()', () => {
  it('yields to the passed generator', () => {
    const IO = { stdout: (..._args: any[]) => undefined }

    function* aSaga (io: typeof IO, action: AnyAction): IterableIterator<any> {
      return yield call(io.stdout, action.type)
    }

    const iterator: any = standardAction(aSaga, IO)({ type: 'AN_ACTION' })

    expect(iterator.next().value).toEqual(
      call(IO.stdout, 'AN_ACTION')
    )
  })

  it('catches if the delegate saga throws', () => {
    const IO = { stdout: (..._args: any[]) => undefined }

    function* aSaga (_io: typeof IO, _action: AnyAction): any {
      throw new Error('oops')
    }

    const iterator: any = standardAction(aSaga, IO)({ type: 'AN_ACTION' })

    expect(iterator.next().value).toEqual(
      call(IO.stdout, 'aSaga', Error('oops'))
    )
  })
})

describe('Catch.deferredAction()', () => {
  it('yields to the passed generator', () => {
    const IO = {
      stdout: () => undefined,
      echo: (msg: any) => msg
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

    function* aSaga (io: typeof IO, _action: AnyAction): any {
      const result = yield call(io.echo, 'A message')

      return result
    }

    const iterator: any = deferredAction(aSaga, IO)(action)

    expect(iterator.next().value).toEqual(
      call(IO.echo, 'A message')
    )

    expect(iterator.next('A message').value).toEqual(
      call(action.meta.deferred.success, 'A message')
    )
  })

  it('catches if the delegate saga throws', () => {
    const IO = {
      stdout: (..._args: any[]) => undefined,
      echo: (msg: any) => msg
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

    function* aSaga (_io: typeof IO, _action: AnyAction): any {
      throw new Error('welp...')
    }

    const iterator: any = deferredAction(aSaga, IO)(action)

    expect(iterator.next().value).toEqual(
      call(IO.stdout, 'aSaga', Error('welp...'))
    )

    expect(iterator.next().value).toEqual(
      call(action.meta.deferred.failure, Error('welp...'))
    )
  })
})
