import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import state from './state'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

const vuexSession = new VuexPersistence({
  storage: window.localStorage
})

const plugins = [vuexSession.plugin]

export default new Vuex.Store({
  state, mutations, actions, plugins
})
