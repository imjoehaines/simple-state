import clone from 'lodash.clonedeep'
import deepFreeze from 'deep-freeze'

export default (initialState, modelConstructor) => {
  let listeners = []

  let state = deepFreeze(clone(initialState))

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
