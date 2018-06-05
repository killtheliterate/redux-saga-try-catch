import { call } from 'redux-saga/effects'

// ---------------------------------------------------------------------------

import {
  deferredAction,
  standardAction
} from '../catch'

// ---------------------------------------------------------------------------

describe('Catch', () => {
  describe('Catch.standardAction()', () => {
    it('yields to the passed generator', () => {
      const io = { stdout: () => undefined }

      function* aSaga (io, action) {
        return yield call(io.stdout, action.type)
      }

      const iterator = standardAction(aSaga, io)({ type: 'AN_ACTION' })

      expect(iterator.next().value).toEqual(
        call(io.stdout, 'AN_ACTION')
      )
    })

    it('catches if the delegate saga throws', () => {
      const io = { stdout: () => undefined }

      function* aSaga (io, action) {
        throw new Error('oops')
      }

      const iterator = standardAction(aSaga, io)({ type: 'AN_ACTION' })

      expect(iterator.next().value).toEqual(
        call(io.stdout, 'aSaga', Error('oops'))
      )
    })
  })

  describe('Catch.deferredAction()', () => {
    it('yields to the passed generator', () => {
      const io = {
        stdout: () => undefined,
        echo: msg => msg
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

      function* aSaga (io, action) {
        const result = yield call(io.echo, 'A message')

        return result
      }

      const iterator = deferredAction(aSaga, io)(action)

      expect(iterator.next().value).toEqual(
        call(io.echo, 'A message')
      )

      expect(iterator.next('A message').value).toEqual(
        call(action.meta.deferred.success, 'A message')
      )
    })

    it('catches if the delegate saga throws', () => {
      const io = {
        stdout: () => undefined,
        echo: msg => msg
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

      function* aSaga (io, action) {
        throw new Error('welp...')
      }

      const iterator = deferredAction(aSaga, io)(action)

      expect(iterator.next().value).toEqual(
        call(io.stdout, 'aSaga', Error('welp...'))
      )

      expect(iterator.next().value).toEqual(
        call(action.meta.deferred.failure, Error('welp...'))
      )
    })
  })
})
