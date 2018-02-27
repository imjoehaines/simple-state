import clone from 'lodash.clonedeep'

export default (initialState, modelConstructor) => {
  let listeners = []

  let state = clone(initialState)

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
    getState: () => clone(state),
    listen: listener => listeners.push(listener)
  }
}
