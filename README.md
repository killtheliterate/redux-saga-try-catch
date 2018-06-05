# redux-saga-catch

A saga utility to reduce flow control boilerplate

# Install

`$ npm install redux-saga-catch`

# Use

```javascript
import Catch from' redux-saga-catch

function* aSaga(/* etc... */) {
  yield 'cool'
}

const aSafeSaga = Catch.standardAction(aSaga)

aSafeSaga(/* etc... */)
```
