# redux-saga-catch

A saga utility to reduce flow control boilerplate.

# Install

`$ npm install redux-saga-catch`

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
