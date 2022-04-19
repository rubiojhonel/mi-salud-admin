<template>
  <v-card>
    <v-card-title>Welcome</v-card-title>
    <v-card-subtitle>Please login to continue</v-card-subtitle>
    <v-form ref="loginForm" v-model="form.valid" @submit.prevent="login">
      <v-card-text>
        <v-text-field
          outlined
          label="Username"
          v-model="account.identifier"
          :rules="[$rules.required()]"
        ></v-text-field>
        <v-text-field
          outlined
          label="Password"
          v-model="account.password"
          :rules="[$rules.required()]"
          type="password"
        ></v-text-field>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn type="submit" color="primary" :loading="form.loading" :disabled="form.loading">Login</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
export default {
  data () {
    return {
      form: {
        valid: false,
        loading: false
      },
      account: {
        identifier: undefined,
        password: undefined
      }
    }
  },
  methods: {
    async login () {
      // Validate
      if (!this.$refs.loginForm.validate()) {
        return false
      }

      this.form.loading = true
      const login = await this.$store.dispatch('login', this.account)

      if (!login.error) {
        const { ref } = this.$route.query
        this.$router.push({ path: ref || `/${login.user.role.type}` })
      }

      this.form.loading = false
    }
  }
}
</script>

<style>

</style>