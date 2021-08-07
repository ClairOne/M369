<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-avatar :color="btnColor" :size="btnSize" v-bind="attrs" v-on="on">
        <span
          ><v-icon :color="btnTextColor">mdi-file-chart-outline</v-icon></span
        >
      </v-avatar>
    </template>
    <v-card>
      <v-toolbar color="#602034" rounded class="mb-2 white--text">
        <v-toolbar-title>Meeting Notes</v-toolbar-title>
        <v-spacer />
        <v-icon color="white" @click="dialog = false"
          >mdi-close-circle-outline</v-icon
        >
      </v-toolbar>
      <v-card-text>
        <v-expansion-panels v-if="Debug">
          <v-expansion-panel>
            <v-expansion-panel-header> Group </v-expansion-panel-header>
            <v-expansion-panel-content>
              {{ Group }}
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header> Meeting </v-expansion-panel-header>
            <v-expansion-panel-content>
              {{ Meeting }}
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header> Goals </v-expansion-panel-header>
            <v-expansion-panel-content>
              {{ Goals }}
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header> Sidebars </v-expansion-panel-header>
            <v-expansion-panel-content>
              {{ Sidebars }}
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-row class="pa-3">
          <v-container>
            <v-row class="pa-3">
              <v-toolbar-title>{{ Group.Title }}</v-toolbar-title>
            </v-row>
            <v-row class="pa-3">
              Date:&nbsp;<strong>{{ Meeting.MeetingDate }}</strong>
            </v-row>
            <v-row class="pa-3">
              Facilitator:&nbsp;
              <strong v-if="Meeting.Facilitator">{{
                Meeting.Facilitator.DisplayName
              }}</strong>
            </v-row>
          </v-container>
        </v-row>
        <v-row
          v-for="attendee in Meeting.Attendees"
          :key="attendee.Email"
          class="pa-5"
        >
          <v-container>
            <v-toolbar color="secondary" class="white--text" dense rounded>
              <v-toolbar-title>{{ attendee.DisplayName }}</v-toolbar-title>
            </v-toolbar>
          </v-container>
          <v-container>
            <v-toolbar color="accent" class="white--text" dense rounded>
              <v-toolbar-title>Highs &amp; Lows</v-toolbar-title>
            </v-toolbar>
            <v-simple-table>
              <thead>
                <tr>
                  <th class="text-left" width="20%">Status</th>
                  <th class="text-left">Title</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="(high, index) in attendeeHighs(attendee.Email)"
                  :key="index"
                >
                  <td class="text-left">
                    <span v-if="high.IsHigh">High</span>
                    <span v-else>Low</span>
                  </td>
                  <td class="text-left">{{ high.Title }}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-container>

          <v-container>
            <v-toolbar color="accent" class="white--text" dense rounded>
              <v-toolbar-title>Goals</v-toolbar-title>
            </v-toolbar>
            <v-simple-table>
              <thead>
                <tr>
                  <th class="text-left" width="20%">Status</th>
                  <th class="text-left">Title</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="(goal, index) in attendeeGoals(attendee.Email)"
                  :key="index"
                >
                  <td class="text-left">{{ goal.Status }}</td>
                  <td class="text-left">{{ goal.Title }}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-container>

          <v-container>
            <v-toolbar color="accent" class="white--text" dense rounded>
              <v-toolbar-title>Sidebars</v-toolbar-title>
            </v-toolbar>
            <v-simple-table>
              <thead>
                <tr>
                  <th class="text-left" width="20%">Requested By</th>
                  <th class="text-left" width="20%">Requested Of</th>
                  <th class="text-left">Reson</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="(sidebar, index) in attendeeSidebars(attendee.Email)"
                  :key="index"
                >
                  <td class="text-left">
                    {{ sidebar.RequestedBy.DisplayName }}
                  </td>
                  <td class="text-left">
                    {{ sidebar.RequestedOf.DisplayName }}
                  </td>
                  <td class="text-left">{{ sidebar.Reason }}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-container>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialog = false"> Close </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  data: () => ({
    dialog: false,
    Debug: false,
  }),
  props: [
    'Group',
    'Meeting',
    'Goals',
    'Sidebars',
    'btnColor',
    'btnTextColor',
    'btnSize',
  ],
  computed: {},
  methods: {
    attendeeHighs(AttendeeEmail) {
      // should we filter or return them all?
      if (!AttendeeEmail) {
        // no Email, return them all
        return this.Meeting.Highs
      }
      // if there are no Meeting.Highs then return an empty array
      if (!this.Meeting.Highs) {
        return []
      }
      // use this.Meeting.Highs which is the full list
      let tmpHighs = this.Meeting.Highs

      tmpHighs = tmpHighs.filter((item) => {
        return item.MemberEmail == AttendeeEmail
      })
      return tmpHighs
    },
    attendeeGoals(AttendeeEmail) {
      // should we filter or return them all?
      if (!AttendeeEmail) {
        // no Email, return them all
        return this.Goals
      }
      // use this.Goals which is the full list
      let tmpGoals = this.Goals

      tmpGoals = tmpGoals.filter((item) => {
        return item.Member.Email == AttendeeEmail
      })
      return tmpGoals
    },
    attendeeSidebars(AttendeeEmail) {
      // should we filter or return them all?
      if (!AttendeeEmail) {
        // no Email, return them all
        return this.Sidebars
      }

      // use this.Sidebars which is the full list
      let tmpSidebars = this.Sidebars

      tmpSidebars = tmpSidebars.filter((item) => {
        return (
          item.RequestedBy.Email == AttendeeEmail ||
          item.RequestedOf.Email == AttendeeEmail
        )
      })
      return tmpSidebars
    },
  },
}
</script>