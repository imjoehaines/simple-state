import anObject from './package.json'
import createStore from './src/create-store'

export default (suite, benchmark) => {
  suite('createStore', () => {
    benchmark('with some initial state and a model, in production mode', () => {
      const oldEnv = process.env.NODE_ENV

      process.env.NODE_ENV = 'production'

      const model = setState => ({
        increment () {
          setState(state => ({ ...state, amount: state.amount + 1 }))
        },

        decrement () {
          setState(state => ({ ...state, amount: state.amount - 1 }))
        },

        noop () {
          setState(state => state)
        }
      })

      createStore(anObject, model)

      process.env.NODE_ENV = oldEnv
    })

    benchmark('with some initial state and a model, in development mode', () => {
      const oldEnv = process.env.NODE_ENV

      process.env.NODE_ENV = 'development'

      const model = setState => ({
        increment () {
          setState(state => ({ ...state, amount: state.amount + 1 }))
        },

        decrement () {
          setState(state => ({ ...state, amount: state.amount - 1 }))
        },

        noop () {
          setState(state => state)
        }
      })

      createStore(anObject, model)

      process.env.NODE_ENV = oldEnv
    })
  })
}
