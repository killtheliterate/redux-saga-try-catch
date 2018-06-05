<b>WIP</b>

# redux-saga-catch

A saga utility to reduce flow control boilerplate

# Install

`$ npm install redux-saga-catch`

# Use

```es
import Catch from' redux-saga-catch

function* aSaga() {
  yield 'cool'
}

const aSafeSaga = Catch.standardAction(aSaga)

aSafeSaga()
```
