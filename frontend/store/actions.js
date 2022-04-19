import defaultState from './state'

export default {
  // Global Notification
  notification ({ commit }, message) {
    commit('notification', message)
  },
  // Login
  async login ({ state, commit, dispatch }, { identifier, password }) {
    const auth = await state.db.login(identifier, password)

    if (auth.error) {
      dispatch('notification', 'Username and/or password is incorrect.')
      return auth
    }

    if (auth.user && auth.user.blocked) {
      dispatch('notification', 'Your account is blocked.')
      return auth
    }

    commit('user', auth.user)
    commit('token', auth.jwt)

    return auth
  },
  // Logout
  async logout ({ state, commit, dispatch }) {
    Object.entries(defaultState).forEach(([key, value]) => {
      commit(key, value)
    })

    state.db.setToken(undefined)
    dispatch('notification', 'You have just logged out.')
    return true
  }
}
