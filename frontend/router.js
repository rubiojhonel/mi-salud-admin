import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'

// Layouts
import FullScreen from '@/views/layouts/FullScreen.vue'
import AppShell from '@/views/layouts/AppShell.vue'

// Screens
import Login from '@/views/Login.vue'
import Error403 from '@/views/403.vue'
import Error404 from '@/views/404.vue'
import Agencies from '@/views/Admin/Agencies.vue'
import Teams from '@/views/Admin/Teams.vue'
import Team from '@/views/Admin/Team.vue'

Vue.use(VueRouter)

// Authentication Middleware
const verifyUser = (role) => (to, from, next) => {
  const { token, user } = store.state

  // Check if user is authenticated.
  if (!token) {
    return next({ path: `/login?ref=${to.path}` })
  }

  // Check if user is authorized.
  if (role !== user.role.type) {
    return next({ path: '/forbidden', replace: true })
  }

  return next()
}

// Route Configutarion
export default new VueRouter({
  mode: 'history',
  routes: [
    // Admin Routes
    {
      path: '/system-admin',
      component: AppShell,
      beforeEnter: verifyUser('admin'),
      children: [
        {
          path: '',
          redirect: 'agencies'
        },
        {
          name: 'Agencies',
          path: 'agencies',
          component: Agencies
        },
        {
          name: 'Teams',
          path: ':agencyId',
          component: Teams
        },
        {
          name: 'Team',
          path: ':agencyId/:teamId',
          component: Team
        }
      ]
    },
    // Agency Admin Routes
    {
      path: '/agency',
      component: AppShell,
      beforeEnter: verifyUser('agency'),
      children: [
        {
          path: '',
          redirect: (to, from, next) => {
            return `/agency/${store.state.user.profile.isManagerOf}`
          }
        },
        {
          name: 'Teams ',
          path: ':agencyId',
          component: Teams
        },
        {
          name: 'Team ',
          path: ':agencyId/:teamId',
          component: Team
        }
      ]
    },
    // Generic Routes
    {
      path: '/',
      component: FullScreen,
      redirect: '/login',
      children: [
        {
          alias: '',
          path: 'login',
          component: Login,
          beforeEnter: (to, from, next) => {
            const { token, user } = store.state
            
            if (token) {
              return next(`/${user.role.type}`)
            }

            return next()
          }
        },
        {
          path: 'forbidden',
          component: Error403
        },
        {
          path: '*',
          component: Error404
        }
      ]
    }
  ]
})
