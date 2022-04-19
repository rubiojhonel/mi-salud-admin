import state from './state'

const Mutations = {}

Object.keys(state).forEach(key => {
  Mutations[key] = (state, payload) => (state[key] = payload)
})

export default Mutations
