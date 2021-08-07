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
        <v-toolbar-title>New Accountability Group</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form ref="newGroupForm" v-model="valid">
          <v-card>
            <v-card-title>Group Info ({{ valid }})</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="Group.Title"
                    :rules="rulesTitle"
                    :counter="50"
                    label="Title"
                    hint="Give your group a unique name."
                    required
                    outlined
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-textarea
                    v-model="Group.Description"
                    :rules="rulesDescription"
                    :counter="100"
                    label="Description"
                    hint="(Optional)"
                    height="142"
                    outlined
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn :disabled="!valid" color="primary" @click="save()">
                Save
              </v-btn>
              <v-btn text @click="cancel()"> Cancel </v-btn>
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
  data: () => ({
    dialog: false,
    valid: false,
    Title: '',
    Description: '',
    Icon: 'mdi-account-group-outline',
    Facilitators: [],
    Members: [],
    rulesTitle: [
      (v) => !!v || 'Title is required',
      (v) => (v && v.length <= 50) || 'Max 50 characters.',
    ],
    rulesDescription: [(v) => (v && v.length <= 200) || 'Max 200 characters.'],
  }),
  props: ['btnColor', 'btnTextColor', 'btnSize'],
  computed: {
    ...mapState({
      CurrentUser: (state) => state.user.CurrentUser,
    }),
    Group() {
      let tmpG = {}
      tmpG.Title = this.Title
      tmpG.Description = this.Description
      tmpG.Icon = this.Icon
      tmpG.Facilitators = this.Facilitators
      tmpG.Members = this.Members
      tmpG.Owner = this.Owner
      return tmpG
    },
    Owner() {
      const tmpV = '/users/' + this.CurrentUser.uid
      return tmpV
    },
  },
  methods: {
    async save() {
      // validate everything
      if (!this.valid) {
        alert('All the info is required.')
        return false
      }
      // create the objects
      let Group = this.Group

      // dispatch to save the record to FS
      this.$store.dispatch('bagGroups/bagGroupsAdd', { Group })

      // shot down the form
      this.reset()
      this.dialog = false
    },
    cancel() {
      this.reset()
    },
    reset() {
      // reset the form
      this.$refs.newGroupForm.reset()
    },
  },
}
</script>