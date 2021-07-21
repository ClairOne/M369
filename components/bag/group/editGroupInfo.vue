<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-avatar :color="btnColor" :size="btnSize" v-bind="attrs" v-on="on">
        <span><v-icon :color="btnTextColor">mdi-lead-pencil</v-icon></span>
      </v-avatar>
    </template>
    <v-card>
      <v-toolbar color="#602034" rounded class="mb-2 white--text">
        <v-toolbar-title>Edit Group {{ Title }}</v-toolbar-title>
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
  data() {
    return {
      dialog: false,
      valid: false,
      Title: '',
      Description: '',
      Icon: 'mdi-account-group-outline',
      rulesTitle: [
        (v) => !!v || 'Title is required',
        (v) => v.length <= 50 || 'Max 50 characters.',
      ],
      rulesDescription: [(v) => v.length <= 200 || 'Max 200 characters.'],
    }
  },
  props: ['group', 'btnColor', 'btnTextColor', 'btnSize'],
  computed: {},
  methods: {
    async save() {
      // validate everything
      if (!this.valid) {
        alert('Invalid group info.')
        return false
      }
      // update the record via store
      let Group = {
        Title: this.Title,
        Description: this.Description,
      }
      let GroupID = this.group.id

      this.$store.dispatch('bagGroups/bagGroupsUpdate', { GroupID, Group })
      this.dialog = false
    },
    cancel() {
      this.dialog = false
      return
    },
  },
  created: function () {
    // assign it here so it's disconected from the store (prevents weird issues)
    this.Title = this.group.Title
    this.Description = this.group.Description
  },
}
</script>