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
        <v-form v-model="valid">
          <v-card>
            <v-card-title>Group Info ({{ valid }})</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="Title"
                    :rules="rulesTitle"
                    :counter="50"
                    label="Title"
                    hint="Give your group a unique name."
                    required
                    outlined
                  ></v-text-field>
                  <v-text-field
                    v-model="CurrentUser.email"
                    label="Owner"
                    hint="You can not change this."
                    outlined
                    disabled
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-textarea
                    v-model="Description"
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
              <v-btn color="warning" @click="reset()">Reset</v-btn>
              <v-btn :disabled="!valid" color="primary" @click="save()">
                Save
              </v-btn>
              <v-btn text @click="dialog = false"> Cancel </v-btn>
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
    rulesTitle: [
      (v) => !!v || 'Title is required',
      (v) => v.length <= 50 || 'Title has a max of 50 characters.',
    ],
    rulesDescription: [
      (v) => v.length <= 100 || 'Description has a max of 100 characters.',
    ],
  }),
  props: ['btnColor', 'btnTextColor', 'btnSize'],
  computed: {
    ...mapState({
      CurrentUser: (state) => state.user.CurrentUser,
    }),
  },
  methods: {
    async save() {
      let NewGroup = {
        Title: this.Title,
        Description: this.Description,
        Icon: this.Icon,
        Owner: '/users/' + this.CurrentUser.uid,
        Facilitators: [],
        Members: [],
      }
      let Owner = this.CurrentUser
      this.$store.dispatch('bagGroups/bagGroupsAdd', { NewGroup })
      this.dialog = false
      this.valid = false
      this.Title = ''
      this.Description = ''
    },
    cancel() {
      this.dialog = false
      this.valid = false
      this.Title = ''
      this.Description = ''
    },
    reset() {
      this.Title = ''
      this.Description = ''
    },
  },
}
</script>