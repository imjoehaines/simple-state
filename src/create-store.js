export default (initialState, modelConstructor) => {
  let listeners = []

  let state = initialState

  if (process.env.NODE_ENV !== 'production') {
    const clone = require('lodash.clonedeep')
    const deepFreeze = require('deep-freeze')

    state = deepFreeze(clone(initialState))
  }

  const model = modelConstructor(fn => { state = fn(state) })

  const actions = Object.keys(model).reduce((actions, action) => ({
    ...actions,
    [action]: payload => {
      model[action](payload)

      listeners.forEach(listener => listener())
    }
  }), {})

  return {
    ...actions,
    getState: () => state,
    listen: listener => listeners.push(listener)
  }
}
