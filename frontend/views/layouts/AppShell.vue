<template>
  <v-app class="app-shell">
    <v-navigation-drawer app v-model="drawer">
      <template v-slot:prepend>
        <v-list-item two-line>
          <v-list-item-avatar>
            <img src="@/assets/logo.png">
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{profile.lastname}}, {{profile.firstname}}</v-list-item-title>
            <v-list-item-subtitle>Welcome to Mi Salud</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>

      <v-divider></v-divider>

      <v-list>
        <v-list-item
          v-for="navigation in navigations"
          :key="navigation.path"
          :to="navigation.path"
        >
          <v-list-item-avatar>
            <v-icon class="grey lighten-3">{{ navigation.icon }}</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ navigation.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app dark color="primary">
      <v-app-bar-nav-icon
        @click="drawer=true"
        v-if="this.$vuetify.breakpoint.mobile"
      ></v-app-bar-nav-icon>
      <v-toolbar-title>{{$route.name || 'Mi Salud'}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="logout">
        <v-icon>fas fa-sign-out-alt</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>

    <!-- Global Notification -->
    <v-snackbar app top right v-model="showNotification">
      {{ $store.state.notification }}
      <template v-slot:action="{ attrs }">
        <v-btn icon color="white" v-bind="attrs" @click="showNotification = false">
          <v-icon small>fa-times</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      drawer: !this.$vuetify.breakpoint.mobile
    }
  },
  computed: {
    showNotification: {
      get () { return !!this.$store.state.notification },
      set () { this.$store.dispatch('notification', undefined) }
    },
    profile () {
      return this.$store.state.user.profile
    },
    navigations () {
      const { role } = this.$store.state.user
      const navigations = {
        admin: [
          {
            name: 'Agencies',
            path: '/system-admin/agencies',
            icon: 'fas fa-address-card'
          },
          {
            name: 'Reports',
            path: '/system-admin/reports',
            icon: 'fas fa-chart-line'
          }
        ],
        agency: [
          {
            name: 'Teams',
            path: `/agency/${this.profile.isManagerOf}`,
            icon: 'fas fa-address-card'
          }
        ]
      }

      return navigations[role.type]
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('logout')
      this.$router.push({ path: '/' })
    }
  }
}
</script>

<style>
  .app-shell .container {
    max-width: 960px;
  }
</style>