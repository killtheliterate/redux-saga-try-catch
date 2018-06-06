[![Build Status](https://travis-ci.org/killtheliterate/redux-saga-try-catch.svg?branch=master)](https://travis-ci.org/killtheliterate/redux-saga-try-catch)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![npm version](https://img.shields.io/npm/v/redux-saga-try-catch.svg)](https://www.npmjs.com/package/redux-saga-try-catch)

# redux-saga-catch

*includes TypeScript definitions*

A saga utility to reduce flow control boilerplate. See the [tests](https://github.com/killtheliterate/redux-saga-try-catch/blob/master/src/__tests__/catch.test.ts).

# Install

`$ npm install redux-saga-try-catch`

# Use

[FSA](https://github.com/redux-utilities/flux-standard-action)

```javascript
import Catch from 'redux-saga-try-catch'

const io = {
  log: console.log
}

function* aSaga() {
  throw new Error('oh no!')
}

const aSafeSaga = Catch.standardAction(aSaga, io)

aSafeSaga({ type: 'AN_ACTION' }) // logs the error
```

[FSA with meta](https://github.com/redux-utilities/flux-standard-action#meta)

```javascript
import Catch from 'redux-saga-try-catch'

const io = {
  log: console.log
}

function* aSaga() {
  throw new Error('oh no!')
}

const aSafeSaga = Catch.deferredAction(aSaga, io)

const action = { 
  type: 'AN_ACTION',
  meta: {
    deferred: { 
      success: console.log, // a success callback - could be `resolve`
      failure: console.err  // a failure callback - could be `reject`
    }
  }
}

aSafeSaga() // logs the error
```
