<!--
@LEFTOFF: working on the facilitator assignment
-->
<template>
  <v-container>
    <v-card>
      <v-toolbar color="#602034" rounded class="mb-2 white--text">
        <v-toolbar-title>Select Facilitator</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-simple-table>
          <thead>
            <tr>
              <th class="text-left" width="20%"></th>
              <th class="text-left" width="40%">Facilitator</th>
              <th class="text-left" width="40%">Email</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(facilitator, index) in Facilitators">
              <tr :key="index" @click="assignFacilitator(facilitator)">
                <td class="text-center">
                  <v-icon
                    v-if="
                      Meeting.Facilitator &&
                      Meeting.Facilitator.Email == facilitator.Email
                    "
                  >
                    mdi-check
                  </v-icon>
                </td>
                <td class="text-left">
                  {{ facilitator.FirstName }}&nbsp;{{ facilitator.LastName }}
                </td>
                <td class="text-left">
                  {{ facilitator.Email }}
                </td>
              </tr>
            </template>
          </tbody>
        </v-simple-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  data() {
    return {}
  },
  props: ['btnColor', 'btnTextColor', 'btnSize'],
  computed: {
    ...mapState({
      Group: (state) => state.bagGroups.Group,
      Meeting: (state) => state.bagMeetings.Meeting,
      Facilitators: (state) => state.bagFacilitators.Facilitators,
    }),
  },
  methods: {
    assignFacilitator: function (facilitator) {
      // if the meeting doesn't have a Facilitator
      // or the Facilitator is different than the one passed in
      if (
        !this.Meeting.Facilitator ||
        (this.Meeting.Facilitator &&
          facilitator.Email != this.Meeting.Facilitator.Email)
      ) {
        const GroupID = this.Group.id
        const MeetingID = this.Meeting.id
        const Facilitator = facilitator
        this.$store.dispatch('bagMeetings/AssignFacilitator', {
          GroupID,
          MeetingID,
          Facilitator,
        })
      }
    },
  },
  mounted() {},
  beforeUpdate() {},
  updated() {},
}
</script>