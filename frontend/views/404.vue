<template>
  <v-card>
    <v-card-title>Error 404</v-card-title>
    <v-card-subtitle>Page does not exist.</v-card-subtitle>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn color="primary" @click="$router.go(-1)">Go Back</v-btn>
      <v-spacer></v-spacer>
      <v-btn color="secondary" to="/">Go Home</v-btn>
      <v-btn color="secondary" to="/login">Login</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {

}
</script>

<style>

</style>