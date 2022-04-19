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

          <template v-if="team.leader">
            <v-subheader>Leader</v-subheader>
            <v-list-item @click="() => null">
              <v-list-item-avatar color="primary lighten-1">
                <span class="white--text">{{team.leader.lastname[0]}}</span>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{team.leader.lastname}}, {{team.leader.firstname}}</v-list-item-title>
                <v-list-item-subtitle>Contact Number: <code>{{team.leader.contactNumber}}</code></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>

          <v-subheader>Members</v-subheader>
          <v-list-item v-for="member in team.members" :key="`m${member.id}`" @click="() => null">
            <v-list-item-avatar color="primary lighten-1">
              <span class="white--text">{{member.lastname[0]}}</span>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{member.lastname}}, {{member.firstname}}</v-list-item-title>
              <v-list-item-subtitle>Contact Number: <code>{{member.contactNumber}}</code></v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action v-if="['admin', 'agency'].includes(role.type)">
              <v-dialog width="500" v-model="member.removeDialog">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon outlined color="red" v-bind="attrs" v-on="on">
                    <v-icon small color="red">fas fa-user-minus</v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>Are you sure?</v-card-title>
                  <v-card-text>You are about to remove <strong>{{member.firstname}}</strong> as a member.</v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-btn color="primary" @click="removeMember(member)" :loading="member.loading" :disabled="member.loading">Continue</v-btn>
                    <v-btn @click="member.removeDialog = false">Cancel</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-list-item-action>
          </v-list-item>

        </v-list>
      </v-col>
      <v-col
        cols="12" md="4" lg="4"
        order="1" order-md="2" order-lg="2"
      >
        <v-card class="mb-4">
          <v-form ref="teamForm" v-model="teamForm.valid" @submit.prevent="updateTeam">
            <v-card-title>Team Information</v-card-title>
            <v-card-text>
              <v-text-field
                outlined
                label="Team Name"
                v-model="team.name"
                :rules="[$rules.required()]"
              ></v-text-field>
              <v-text-field
                outlined
                label="Team Code"
                v-model="team.code"
                readonly
                hint="Team code cannot be updated."
              ></v-text-field>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn color="primary" type="submit" :loading="teamForm.loading" :disabled="teamForm.loading">Update</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>

        <v-card class="mb-4">
          <v-card-text>
            <h1 class="display-4">{{team.members.length}}</h1>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <span class="subtitle-2">Total Members</span>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      loading: true,
      agencyId: this.$route.params.agencyId,
      teamId: this.$route.params.teamId,
      role: this.$store.state.user.role,
      team: undefined,
      teamForm: {
        loading: false,
        valid: false
      }
    }
  },
  methods: {
    async getTeam () {
      const { db } = this.$store.state
      let team = await db.get('teams', this.teamId)

      team.members = team.members.map(member => ({
        ...member,
        loading: false,
        removeDialog: false
      }))

      this.team = team
      this.loading = false
    },
    async updateTeam () {
      if (!this.$refs.teamForm.validate()) {
        return false
      }

      this.teamForm.loading = true
      const { db } = this.$store.state
      const update = await db.update('teams', this.teamId, {
        name: this.team.name
      })

      if (!update.error) {
        this.$store.dispatch('notification', 'Team information has been updated.')
        await this.getTeam()
      } else {
        this.$store.dispatch('notification', update.error.message)
      }

      this.teamForm.loading = false
    },
    async removeMember (member) {
      member.loading = true

      const { db } = this.$store.state
      const remove = await db.update('profiles', member.id, {
        isMemberOf: null
      })

      if (!remove.error) {
        member.dialog = false
        this.$store.dispatch('notification', 'Member has been removed.')
        await this.getTeam()
      } else {
        this.$store.dispatch('notification', 'An error occured. Please try again.')
      }

      member.loading = false
    }
  },
  async created () {
    this.getTeam()

    window.db = this.$store.state.db
  }
}
</script>

<style>

</style>