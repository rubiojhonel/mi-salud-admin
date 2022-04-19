import Vue from 'vue'
import vuetify from '@/plugins/vuetify'
import customPlugins from '@/plugins/custom'
import store from '@/store'
import router from '@/router'
import App from '@/App.vue'

Vue.use(customPlugins)
Vue.config.productionTip = false
Vue.config.devtools = false

store.state.db.onRequestError = async error => {
  if (error.response && error.response.status === 401) {
    await store.dispatch('logout')
    store.dispatch('notification', 'Your session has expired.')
    this.$router.push({ path: '/login' })
  }
  store.dispatch('notification', error.message)
}

new Vue({
  el: '#app',
  render: create => create(App),
  vuetify, store, router
})
