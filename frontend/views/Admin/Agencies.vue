<template>
  <v-container>
    <v-row>
      <v-col
        cols="12" md="8" lg="8"
        order="2" order-md="1" order-lg="1"
      >
        <v-list two-line>
          <v-list-item v-for="agency in agencies" :key="agency.id" :to="`/system-admin/${agency.id}`">
            <v-list-item-avatar color="primary lighten-1">
              <span class="white--text">{{agency.name[0]}}</span>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{agency.name}}</v-list-item-title>
              <v-list-item-subtitle>{{agency.address}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col
        cols="12" md="4" lg="4"
        order="1" order-md="2" order-lg="2"
      >
        <v-card class="mb-4">
          <v-card-text>
            <h1 class="display-4">{{agencies.length}}</h1>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <span class="subtitle-2">Total Agencies</span>
          </v-card-actions>
        </v-card>

        <!-- Create Agency -->
        <v-dialog v-model="form.dialog" width="500">
          <template v-slot:activator="{ on, attrs }">
            <v-btn block color="primary" v-bind="attrs" v-on="on">Create Agency</v-btn>
          </template>

          <v-card>
            <v-card-title>Create Agency</v-card-title>
            <v-form ref="agencyForm" v-model="form.valid" @submit.prevent="createAgency">
              <v-card-text>
                <v-text-field
                  outlined
                  label="Agency Name"
                  v-model="agency.name"
                  :rules="[$rules.required()]"
                ></v-text-field>
                <v-textarea
                  outlined
                  label="Address"
                  v-model="agency.address"
                  :rules="[$rules.required()]"
                ></v-textarea>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn type="submit" color="primary" :loading="form.loading" :disabled="form.loading">Submit</v-btn>
                <v-btn @click="form.dialog = false">Cancel</v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      agencies: [],
      form: {
        dialog: false,
        valid: false,
        loading: false
      },
      agency: {
        name: undefined,
        address: undefined
      }
    }
  },
  methods: {
    async getAgencies () {
      const { db } = this.$store.state
      this.agencies = await db.get('agencies')
      return this.agencies
    },
    async createAgency () {
      // Validate
      if (!this.$refs.agencyForm.validate()) {
        return false
      }

      if (!!this.agencies.find(a => a.name === this.agency.name)) {
        return this.$store.dispatch('notification', 'Agency already exist.')
      }

      this.form.loading = true
      const { db } = this.$store.state
      const create = await db.create('agencies', this.agency)

      if (!create.error) {
        await this.getAgencies()
      }

      console.log('CREATE:', create)

      this.form.dialog = false
      this.form.loading = false
    }
  },
  created () {
    this.getAgencies()
  }
}
</script>

<style>

</style>