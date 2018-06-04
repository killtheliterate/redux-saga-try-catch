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
      const io = { stdout: () => {} }
      function* aSaga (io, action) {
        console.log('a saga is happening')

        return yield call(io.stdout, action.type)
      }

      const iterator = standardAction(aSaga, io)({ type: 'AN_ACTION' })

      const yielded = iterator.next().value

      expect(yielded).toEqual(
        call(aSaga, io, { payload: undefined, type: 'AN_ACTION' })
        // call(io.stdout, 'AN_ACTION')
      )

      console.log('yielded', yielded)
    })

    it.skip('catches if the passed saga throws', () => {
      const io = { stdout: (msg) => { console.log(msg) } }
      function* aSaga (io, action) { throw new Error('sup') }

      const iterator = standardAction(aSaga, io)({ type: 'AN_ACTION' })

      expect(iterator.next().value).toEqual(
        call(aSaga, io, { payload: undefined, type: 'AN_ACTION' })
      )

    })
  })

  // describe('Catch.deferredAction()', () => {
  //   it('has a test', () => {
  //     expect(true).toEqual(true)
  //   })
  // })
})
