import createStore from './create-store'

const { test, expect } = global

const id = _ => _

test('it returns a getState function', () => {
  const store = createStore({}, id)

  expect(store.getState).toBeInstanceOf(Function)
})

test('it returns a function for each type from the model', () => {
  const store = createStore({ amount: 1 }, setState => ({
    increment () {
      setState(state => ({ ...state, amount: state.amount + 1 }))
    }
  }))

  expect(store.increment).toBeInstanceOf(Function)
})

test('getState returns a state object', () => {
  const store = createStore({ no: 'state', here: 'at all' }, id)

  expect(store.getState()).toMatchObject({ no: 'state', here: 'at all' })
})

test('it exports all of the model functions as actions', () => {
  const store = createStore({ amount: 1 }, setState => ({
    increment () {
      setState(state => ({ ...state, amount: state.amount + 1 }))
    }
  }))

  store.increment()

  expect(store.getState()).toMatchObject({ amount: 2 })
})

test('it returns a listen function', () => {
  const store = createStore({}, id)

  expect(store.listen).toBeInstanceOf(Function)
})

test('changes to the store can be listened for', done => {
  const store = createStore({ amount: 1 }, setState => ({
    increment () {
      setState(state => ({ ...state, amount: state.amount + 1 }))
    }
  }))

  store.listen(() => {
    expect(store.getState()).toMatchObject({ amount: 2 })

    done()
  })

  store.increment()
})

test('changes to the store can be listened for by multiple listeners', done => {
  const MAX_COUNT = 10

  const store = createStore({ amount: 1 }, setState => ({
    increment () {
      setState(state => ({ ...state, amount: state.amount + 1 }))
    }
  }))

  let count = 1

  store.listen(() => {
    // listeners are run in the order they are added so this will happen
    // before the next 2 listeners run
    count += 1

    expect(store.getState()).toMatchObject({ amount: count })
  })

  store.listen(() => {
    expect(store.getState()).toMatchObject({ amount: count })
  })

  store.listen(() => {
    expect(store.getState()).toMatchObject({ amount: count })

    if (count === MAX_COUNT) {
      done()
    }
  })

  for (let i = 1; i < MAX_COUNT; i++) {
    store.increment()
  }
})

test('changes to state by model does not mutate initialState', () => {
  const initialState = { amount: 1 }

  const store = createStore(initialState, setState => ({
    increment () {
      setState(state => ({ ...state, amount: state.amount + 1 }))
    }
  }))

  store.increment()

  expect(store.getState()).toMatchObject({ amount: 2 })

  expect(initialState).toMatchObject({ amount: 1 })
})
