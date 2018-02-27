export default (initialState, modelConstructor) => {
  let listeners = []

  let state = initialState

  if (process.env.NODE_ENV !== 'production') {
    const clone = require('lodash.clonedeep')
    const deepFreeze = require('deep-freeze')

    state = deepFreeze(clone(initialState))
  }

  const model = modelConstructor(fn => { state = fn(state) })

  const types = Object.keys(model).reduce((types, type) => ({
    ...types,
    [type]: payload => {
      model[type](payload)

      listeners.forEach(listener => listener())
    }
  }), {})

  return {
    ...types,
    getState: () => state,
    listen: listener => listeners.push(listener)
  }
}
