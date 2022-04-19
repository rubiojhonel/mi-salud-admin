<template>
  <v-app>
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-img src="@/favicon.png" width="192" class="mx-auto mb-2"></v-img>
            <router-view></router-view>
          </v-col>
        </v-row>
      </v-container>
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
  computed: {
    showNotification: {
      get () { return !!this.$store.state.notification },
      set () { this.$store.dispatch('notification', undefined) }
    }
  }
}
</script>

<style>

</style>