# simple-state

Simple state management for JavaScript applications.

## Installation

```sh
$ yarn add @imjoehaines/simple-state
# OR
$ npm install @imjoehaines/simple-state
```

## Usage

```js
import createStore from 'simple-state'

const initialState = { amount: 1 }

const modelConstructor = setState => ({
  increment () {
    setState(state => ({ ...state, amount: state.amount + 1 }))
  }
})

const store = createStore(initialState, modelConstructor)

console.log(store.getState()) // { amount: 1 }

store.increment()

console.log(store.getState()) // { amount: 2 }
```

simple-state exports a single function, `createStore`, which takes some **initial state** and a **model constructor** as arguments.

### Initial state

The initial state of your application can be any plain JavaScript object. It's simply passed to your model when an action is called, so the structure doesn't matter to `simple-state`.

### Model constructor

A model constructor is a function that returns a model when called. It takes a `setState` function as an argument and uses that inside **actions** to make changes to state.

Model constructors look like this

```js
const modelConstructor = setState => ({
  increment () {
    setState(state => ({ ...state, amount: state.amount + 1 }))
  }
})

// OR

function modelConstructor (setState) {
  return {
    increment: function () {
      setState(state => ({ ...state, amount: state.amount + 1 }))
    }
  }
}
```

Each of the functions in the object that a model constructor returns will be available as functions on the `store` created by `createStore`. For example, in this case we would have a `store.increment` function as our model constructor includes this.

The `setState` function takes a callback which should return the updated state, based on the `state` argument it is provided.

### Actions

An action is the name given to any function inside a **model**.

```js
increment () {
  setState(state => ({ ...state, amount: state.amount + 1 }))
}
```

All actions will be available as functions on the `store`.

## Listeners

The store also provides a `listen` function which can be used to listen for any state changes caused by actions. It accepts a callback function, which takes no arguments and will be called whenever an action is.

Any number of listeners can be attached to a store.

```js
const store = createStore({ amount: 1 }, setState => ({
  increment () {
    setState(state => ({ ...state, amount: state.amount + 1 }))
  }
}))

store.listen(() => {
  console.log('listener one', store.getState())
})

store.listen(() => {
  console.log('listener two', store.getState())
})

store.listen(() => {
  console.log('listener three', store.getState())
})
```

Actions *can* be called from within a listener, but you should be careful not to create an infinite loop of action &rarr; listener &rarr; action.
