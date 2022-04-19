<template>
  <v-container :class="{ 'fill-height': loading }">
    <v-row align="center" justify="center" v-if="loading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-row>
    <v-row v-else>
      <v-col
        cols="12" md="8" lg="8"
        order="2" order-md="1" order-lg="1"
      >
        <v-list two-line>

          <v-subheader>Admins</v-subheader>
          <v-list-item v-for="manager in agency.managers" :key="`m${manager.id}`" @click="() => null">
            <v-list-item-avatar color="primary lighten-1">
              <span class="white--text">{{manager.lastname[0]}}</span>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{manager.lastname}}, {{manager.firstname}}</v-list-item-title>
              <v-list-item-subtitle>Contact Number: <code>{{manager.contactNumber}}</code></v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action v-if="role.type === 'admin'">
              <v-dialog width="500" v-model="manager.removeDialog">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon outlined color="red" v-bind="attrs" v-on="on">
                    <v-icon small color="red">fas fa-user-minus</v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>Are you sure?</v-card-title>
                  <v-card-text>You are about to remove <strong>{{manager.firstname}}</strong> as a manager.</v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-btn color="primary" @click="removeManager(manager)" :loading="manager.loading" :disabled="manager.loading">Continue</v-btn>
                    <v-btn @click="manager.removeDialog = false">Cancel</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-list-item-action>
          </v-list-item>

          <v-subheader>Teams</v-subheader>
          <v-list-item v-for="team in agency.teams" :key="`t${team.id}`" :to="`${agencyId}/${team.id}`">
            <v-list-item-avatar color="primary lighten-1">
              <span class="white--text">{{team.name[0]}}</span>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{team.name}}</v-list-item-title>
              <v-list-item-subtitle>Team Code: <code>{{team.code}}</code></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

        </v-list>
      </v-col>
      <v-col
        cols="12" md="4" lg="4"
        order="1" order-md="2" order-lg="2"
      >
        <v-card class="mb-4">
          <v-form ref="agencyForm" v-model="form.valid" @submit.prevent="updateAgency">
            <v-card-title>Agency Information</v-card-title>
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
              <v-btn color="primary" type="submit" :loading="form.loading" :disabled="form.loading">Update</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>

        <v-card class="mb-4">
          <v-card-text>
            <h1 class="display-4">{{agency.teams.length}}</h1>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <span class="subtitle-2">Total Teams</span>
          </v-card-actions>
        </v-card>

        <!-- Assign Manager -->
        <v-dialog v-model="managerForm.dialog" width="500" v-if="role.type === 'admin'">
          <template v-slot:activator="{ on, attrs }">
            <v-btn block class="mb-2" color="primary" v-bind="attrs" v-on="on">Assign Manager</v-btn>
          </template>

          <v-card>
            <v-card-title>Assign Manager</v-card-title>
            <v-form ref="managerForm" v-model="managerForm.valid" @submit.prevent="assignManager">
              <v-card-text>
                <v-autocomplete
                  outlined
                  label="User"
                  v-model="managerForm.newManager"
                  :loading="managerForm.fetchingUsers"
                  :disabled="managerForm.fetchingUsers"
                  :items="managerForm.users.filter(u => !u.profile.isManagerOf)"
                  :item-text="({ profile }) => `${profile.lastname}, ${profile.firstname}`"
                  :item-value="({ profile }) => profile.id"
                  :rules="[$rules.required()]"
                ></v-autocomplete>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn type="submit" color="primary" :loading="managerForm.loading" :disabled="managerForm.loading">Assign</v-btn>
                <v-btn @click="managerForm.dialog = false">Cancel</v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>

        <!-- Create Team -->
        <v-dialog v-model="createTeam.dialog" width="500">
          <template v-slot:activator="{ on, attrs }">
            <v-btn block color="primary" v-bind="attrs" v-on="on">Create Team</v-btn>
          </template>

          <v-card>
            <v-card-title>Create Team</v-card-title>
            <v-form ref="createTeam" v-model="createTeam.valid" @submit.prevent="createNewTeam">
              <v-card-text>
                <v-text-field
                  outlined
                  label="Team Name"
                  v-model="createTeam.name"
                  :rules="[$rules.required()]"
                ></v-text-field>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn type="submit" color="primary" :loading="createTeam.loading" :disabled="createTeam.loading">Create</v-btn>
                <v-btn @click="createTeam.dialog = false">Cancel</v-btn>
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
      role: this.$store.state.user.role,
      agencyId: this.$route.params.agencyId,
      loading: true,
      agency: undefined,
      form: {
        valid: false,
        loading: false
      },
      managerForm: {
        dialog: false,
        valid: false,
        loading: false,
        fetchingUsers: false,
        newManager: undefined,
        users: []
      },
      createTeam: {
        dialog: false,
        valid: false,
        loading: false,
        name: undefined
      }
    }
  },
  watch: {
    'managerForm.dialog' (isOpen) {
      if (isOpen && this.managerForm.users.length === 0) {
        this.managerForm.fetchingUsers = true
        this.$store.state.db.get('users').then(users => {
          this.managerForm.users = users
          this.managerForm.fetchingUsers = false
        })
      }
    }
  },
  methods: {
    async getTeams () {
      const { db } = this.$store.state
      let agency = await db.get('agencies', this.agencyId)

      agency.managers = agency.managers.map(manager => ({
        ...manager,
        loading: false,
        removeDialog: false
      }))

      this.agency = agency
      this.loading = false
    },
    async updateAgency () {
      if (!this.$refs.agencyForm.validate()) {
        return false
      }

      this.form.loading = true
      const { db } = this.$store.state
      const update = await db.update('agencies', this.agencyId, {
        name: this.agency.name,
        address: this.agency.address
      })

      if (!update.error) {
        this.$store.dispatch('notification', 'Agency information has been updated.')
        await this.getTeams()
      } else {
        this.$store.dispatch('notification', update.error.message)
      }

      this.form.loading = false
    },
    async assignManager () {
      if (!this.$refs.managerForm.validate()) {
        return false
      }

      this.managerForm.loading = true
      const { db } = this.$store.state
      const assign = await db.update('profiles', this.managerForm.newManager, {
        isManagerOf: this.agencyId
      })

      const roles = await db.get('users-permissions/roles')
      const user = this.managerForm.users.find(u => u.profile.id === this.managerForm.newManager)
      await db.update('users', user.id, {
        role: roles.roles.find(r => r.type === 'agency').id
      })

      if (!assign.error) {
        this.managerForm.dialog = false
        this.$store.dispatch('notification', 'User has been assigned as manager.')
        await this.getTeams()
      } else {
        this.$store.dispatch('notification', assign.error.message)
      }

      this.managerForm.loading = false
    },
    async removeManager (manager) {
      manager.loading = true

      const { db } = this.$store.state
      const remove = await db.update('profiles', manager.id, {
        isManagerOf: null
      })

      if (!remove.error) {
        manager.dialog = false
        this.$store.dispatch('notification', 'Manager has been removed.')
        await this.getTeams()
      } else {
        this.$store.dispatch('notification', 'An error occured. Please try again.')
      }

      manager.loading = false
    },
    async createNewTeam () {
      if (!this.$refs.createTeam.validate()) {
        return false
      }

      if (!!this.agency.teams.find(t => t.name === this.createTeam.name)) {
        return this.$store.dispatch('notification', 'Agency already exist.')
      }

      this.createTeam.loading = true
      const { db } = this.$store.state
      const create = await db.create('teams', {
        name: this.createTeam.name,
        agency: this.agencyId
      })

      if (!create.error) {
        this.$store.dispatch('notification', 'Team has been created.')
        this.createTeam.dialog = false
        await this.getTeams()
      } else {
        this.$store.dispatch('notification', create.error.message)
      }

      this.createTeam.loading = false
    }
  },
  created () {
    const { role, profile } = this.$store.state.user

    if (role.type !== 'admin' && profile.isManagerOf != this.agencyId) {
      console.log('role.type:', role.type)
      console.log('profile.isManagerOf:', profile.isManagerOf)
      console.log('this.agencyId:', this.agencyId)
      console.log('CONDITION:', role.type !== 'admin' && profile.isManagerOf != this.agencyId)
      return this.$router.push({ path: '/forbidden' })
    }

    this.getTeams()
  }
}
</script>

<style>

</style>