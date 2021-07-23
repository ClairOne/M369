<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-avatar :color="btnColor" :size="btnSize" v-bind="attrs" v-on="on">
        <span><v-icon :color="btnTextColor">mdi-plus</v-icon></span>
      </v-avatar>
    </template>
    <v-card>
      <v-toolbar color="#602034" rounded class="mb-2 white--text">
        <v-toolbar-title>New Member for {{ group.Title }}</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form ref="newMember" v-model="valid" lazy-validation>
          <v-card>
            <v-card-title>Member Info ({{ valid }})</v-card-title>
            <v-card-text>
              <v-row>
                <v-spacer />
                <v-col cols="12" sm="4">
                  <v-text-field
                    v-model="FirstName"
                    :rules="rulesFirstName"
                    :counter="20"
                    label="First Name"
                    outlined
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="LastName"
                    :rules="rulesLastName"
                    :counter="50"
                    label="Last Name"
                    outlined
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="Initials"
                    :rules="rulesInitials"
                    :counter="2"
                    label="Initials"
                    outlined
                    required
                  ></v-text-field>
                </v-col>
                <v-spacer />
                <v-col cols="12" sm="4">
                  <v-text-field
                    v-model="Email"
                    :rules="rulesEmail"
                    :counter="50"
                    label="Email"
                    outlined
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="DisplayName"
                    :rules="rulesDisplayName"
                    :counter="10"
                    label="Display Name"
                    outlined
                    required
                  ></v-text-field>
                  <v-radio-group v-model="Membership" mandatory>
                    <template v-slot:label>
                      <div>Membership Type</div>
                    </template>
                    <v-radio value="Member">
                      <template v-slot:label>
                        <div>Group Member</div>
                      </template>
                    </v-radio>
                    <v-radio value="Facilitator">
                      <template v-slot:label>
                        <div>Facilitator</div>
                      </template>
                    </v-radio>
                    <v-radio value="Both">
                      <template v-slot:label>
                        <div>Both</div>
                      </template>
                    </v-radio>
                  </v-radio-group>
                </v-col>
                <v-spacer />
              </v-row>
            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn text @click="cancel()"> Cancel </v-btn>
              <v-btn :disabled="!valid" color="primary" @click="save()">
                Save
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  data() {
    return {
      dialog: false,
      valid: false,
      FirstName: '',
      LastName: '',
      DisplayName: '',
      Initials: '',
      Email: '',
      Membership: '',
      rulesFirstName: [
        (v) => !!v || 'First name is required',
        (v) => (v && v.length <= 20) || 'Max 20 characters.',
      ],
      rulesLastName: [
        (v) => !!v || 'Last name is required',
        (v) => (v && v.length <= 50) || 'Max 50 characters.',
      ],
      rulesDisplayName: [
        (v) => !!v || 'Display name is required',
        (v) => (v && v.length <= 10) || 'Max 10 characters.',
      ],
      rulesInitials: [
        (v) => !!v || 'Initials are required',
        (v) => (v && v.length <= 2) || 'Max 2 characters.',
      ],
      rulesEmail: [
        (v) => !!v || 'Email is required',
        (v) => (v && v.length <= 50) || 'Max 50 characters.',
        (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
    }
  },
  props: ['group', 'btnColor', 'btnTextColor', 'btnSize'],
  computed: {},
  methods: {
    async save() {
      // validate everything
      if (!this.valid) {
        alert('Invalid member info.')
        return false
      }
      // build the member
      let Member = {
        FirstName: this.FirstName,
        LastName: this.LastName,
        DisplayName: this.DisplayName,
        Initials: this.Initials,
        Email: this.Email,
      }
      let GroupID = this.group.id

      if (this.Membership === 'Member' || this.Membership === 'Both') {
        this.$store.dispatch('bagGroups/bagGroupMemberAdd', {
          GroupID,
          Member,
        })
      }
      if (this.Membership === 'Facilitator' || this.Membership === 'Both') {
        // add member to Group.Facilitators
        this.$store.dispatch('bagGroups/bagGroupMemberAdd', {
          GroupID,
          Member,
          isFacilitator: true, // isFacilitator flag
        })
      }

      // reset the form
      this.$refs.newMember.reset()
      // close the dialog
      this.dialog = false
    },
    cancel() {
      // reset the form
      this.$refs.newMember.reset()
      // close the dialog
      this.dialog = false
      return
    },
  },
}
</script>