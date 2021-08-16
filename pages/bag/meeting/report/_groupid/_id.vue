<template>
  <v-container fluid>
    <h1>{{ Group.Title }} Meeting Notes: {{ Meeting.MeetingDate }}</h1>

    <v-row class="my-5">
      <v-col cols="6">
        <h2>Facilitator</h2>
        <p v-if="Meeting.Facilitator">
          {{ Meeting.Facilitator.DisplayName }}
        </p>
        <h2>Attendees</h2>
        <v-simple-table>
          <thead>
            <tr>
              <th class="text-left" width="20%">Name</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(attendee, index) in Meeting.Attendees" :key="index">
              <td class="text-left">{{ attendee.DisplayName }}</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>
      <v-col cols="6">
        <h2>Meeting</h2>
        <p>{{ Meeting.MeetingDateTime }}</p>
        <h2>Group Info</h2>
        <h3 @click="viewGroup(Group.id)">{{ Group.Title }}</h3>
        <p>{{ Group.Description }}</p>
      </v-col>
    </v-row>

    <template v-for="attendee in Meeting.Attendees">
      <v-card :key="'attendeeC' + attendee.Email" class="my-5 pb">
        <v-toolbar color="secondary" rounded class="mb-2 white--text" dense>
          <v-toolbar-title>{{ attendee.DisplayName }}</v-toolbar-title>
        </v-toolbar>
      </v-card>
      <v-sheet :key="'attendeeS' + attendee.Email" class="pa-2">
        <v-row>
          <v-col cols="6">
            <v-card class="mb-2">
              <v-card-subtitle>
                <v-toolbar-title class="text-center"
                  >Highs &amp; Lows</v-toolbar-title
                >
              </v-card-subtitle>
              <v-card-text>
                <v-simple-table
                  dense
                  v-if="attendeeHighs(attendee.Email).length > 0"
                >
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
                <v-container v-else>None</v-container>
              </v-card-text>
            </v-card>
            <v-card class="mb-2">
              <v-card-subtitle>
                <v-toolbar-title class="text-center"
                  >Roadblocks</v-toolbar-title
                >
              </v-card-subtitle>
              <v-card-text>
                <v-simple-table
                  dense
                  v-if="attendeeRoadblocks(attendee.Email).length > 0"
                >
                  <tbody>
                    <tr
                      v-for="(roadblock, index) in attendeeRoadblocks(
                        attendee.Email
                      )"
                      :key="index"
                    >
                      <td class="text-left">
                        {{ roadblock.Title }}
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
                <v-container v-else>None</v-container>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card class="mb-2">
              <v-card-subtitle>
                <v-toolbar-title class="text-center">Sidebars</v-toolbar-title>
              </v-card-subtitle>
              <v-card-text>
                <v-simple-table
                  dense
                  v-if="attendeeSidebars(attendee.Email).length > 0"
                >
                  <thead>
                    <tr>
                      <th class="text-left" width="80%">Current</th>
                      <th class="text-right" width="20%">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    <template>
                      <tr
                        v-for="(sidebar, index) in attendeeSidebars(
                          attendee.Email
                        )"
                        :key="index"
                      >
                        <td colspan="2">
                          <v-simple-table dense>
                            <tr>
                              <td class="text-left" width="80%">
                                {{ sidebar.RequestedBy.DisplayName }} ->
                                {{ sidebar.RequestedOf.DisplayName }}
                              </td>
                              <td class="text-right py-1" width="20%">
                                {{ sidebar.Status }}
                              </td>
                            </tr>
                            <tr>
                              <td class="text-left py-1" colspan="2">
                                {{ sidebar.Reason }}
                              </td>
                            </tr>
                          </v-simple-table>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </v-simple-table>
                <v-container v-else>No Current Sidebars</v-container>
                <v-simple-table
                  dense
                  v-if="attendeePreviousSidebars(attendee.Email).length > 0"
                >
                  <thead>
                    <tr>
                      <th class="text-left" width="80%">Previous</th>
                      <th class="text-right" width="20%">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr
                      v-for="(sidebar, index) in attendeePreviousSidebars(
                        attendee.Email
                      )"
                      :key="index"
                    >
                      <td colspan="2">
                        <v-simple-table dense>
                          <tr>
                            <td class="text-left" width="80%">
                              {{ sidebar.RequestedBy.DisplayName }} ->
                              {{ sidebar.RequestedOf.DisplayName }}
                            </td>
                            <td class="text-right py-1" width="20%">
                              {{ sidebar.Status }}
                            </td>
                          </tr>
                          <tr>
                            <td class="text-left py-1" colspan="2">
                              {{ sidebar.Reason }}
                            </td>
                          </tr>
                        </v-simple-table>
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
                <v-container v-else>No Previous Sidebars</v-container>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-card class="mb-2">
              <v-card-subtitle>
                <v-toolbar-title class="text-center">Goals</v-toolbar-title>
              </v-card-subtitle>
              <v-card-text>
                <v-row>
                  <v-col cols="6">
                    <v-toolbar-title class="text-center"
                      >Previous</v-toolbar-title
                    >
                    <v-simple-table
                      dense
                      v-if="attendeePreviousGoals(attendee.Email).length > 0"
                    >
                      <thead>
                        <tr>
                          <th class="text-left" width="20%">Status</th>
                          <th class="text-left">Title</th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr
                          v-for="(goal, index) in attendeePreviousGoals(
                            attendee.Email
                          )"
                          :key="index"
                        >
                          <td class="text-left">{{ goal.Status }}</td>
                          <td class="text-left">{{ goal.Title }}</td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                    <v-container v-else>None</v-container>
                  </v-col>
                  <v-col cols="6">
                    <v-toolbar-title class="text-center"
                      >Current</v-toolbar-title
                    >
                    <v-simple-table
                      dense
                      v-if="attendeeGoals(attendee.Email).length > 0"
                    >
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
                    <v-container v-else>None</v-container>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-sheet>
    </template>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  layout: 'blog',
  components: {},
  data() {
    return {
      Debug: false,
    }
  },
  computed: {
    ...mapState({
      Group: (state) => state.bagGroups.Group,
      Meeting: (state) => state.bagMeetings.Meeting,
      Highs: (state) => state.bagMeetings.Meeting.Highs,
      Goals: (state) => state.bagMeetings.Meeting.Goals,
      Sidebars: (state) => state.bagMeetings.Meeting.Sidebars,
      Roadblocks: (state) => state.bagMeetings.Meeting.Roadblocks,
    }),
    meetingStatus() {
      // has it loaded?
      if (!this.Meeting || !this.Meeting.id) {
        return 'Loading...'
      }
      const GroupID = this.$route.params.groupid
      const MeetingID = this.$route.params.id
      // is it closed?
      if (this.Meeting.ClosedAt) {
        return 'Closed'
      }

      // is it started?
      if (this.Meeting.StartedAt) {
        return 'Running'
      }

      // it isn't running or started so it's scheduled
      if (!this.Meeting.StartedAt && !this.Meeting.ClosedAt) {
        return 'Scheduled'
      }
    },
  },
  methods: {
    viewGroup: function (groupID) {
      // redirect the UI to the group
      this.$router.push('/bag/group/' + groupID)
    },
    attendeeHighs(AttendeeEmail) {
      // if there are no Meeting.Highs then return an empty array
      if (!this.Highs) {
        return []
      }
      // should we filter or return them all?
      if (!AttendeeEmail) {
        // no Email, return them all
        return this.Highs
      }
      // use this.Meeting.Highs which is the full list
      let tmpHighs = this.Highs

      tmpHighs = tmpHighs.filter((item) => {
        return item.Member.Email == AttendeeEmail
      })
      return tmpHighs
    },
    attendeePreviousHighs(AttendeeEmail) {
      // if there are no Meeting.PreviousHighs then return an empty array
      if (!this.Meeting.PreviousHighs) {
        return []
      }
      // should we filter or return them all?
      if (!AttendeeEmail) {
        // no Email, return them all
        return this.Meeting.PreviousHighs
      }
      // use this.Meeting.PreviousHighs which is the full list
      let tmpHighs = this.Meeting.PreviousHighs

      tmpHighs = tmpHighs.filter((item) => {
        return item.Member.Email == AttendeeEmail
      })
      return tmpHighs
    },

    attendeeGoals(AttendeeEmail) {
      // if there are no Meeting.Goals then return an empty array
      if (!this.Goals) {
        return []
      }
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
    attendeePreviousGoals(AttendeeEmail) {
      // if there are no Meeting.PreviousGoals then return an empty array
      if (!this.Meeting.PreviousGoals) {
        return []
      }
      // should we filter or return them all?
      if (!AttendeeEmail) {
        // no Email, return them all
        return this.Meeting.PreviousGoals
      }
      // use this.Goals which is the full list
      let tmpGoals = this.Meeting.PreviousGoals

      tmpGoals = tmpGoals.filter((item) => {
        return item.Member.Email == AttendeeEmail
      })
      return tmpGoals
    },
    attendeeSidebars(AttendeeEmail) {
      // if there are no Meeting.Sidebars then return an empty array
      if (!this.Sidebars) {
        return []
      }
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
    attendeePreviousSidebars(AttendeeEmail) {
      // if there are no Meeting.Sidebars then return an empty array
      if (!this.Meeting.PreviousSidebars) {
        return []
      }
      // should we filter or return them all?
      if (!AttendeeEmail) {
        // no Email, return them all
        return this.Meeting.PreviousSidebars
      }

      // use this.Meeting.PreviousSidebars which is the full list
      let tmpSidebars = this.Meeting.PreviousSidebars

      tmpSidebars = tmpSidebars.filter((item) => {
        return (
          item.RequestedBy.Email == AttendeeEmail ||
          item.RequestedOf.Email == AttendeeEmail
        )
      })
      return tmpSidebars
    },
    attendeeRoadblocks(AttendeeEmail) {
      // should we filter or return them all?
      if (!AttendeeEmail) {
        // no Email, return them all
        return this.Roadblocks
      }
      // if there are no Meeting.Roadblocks then return an empty array
      if (!this.Roadblocks) {
        return []
      }
      // use this.Meeting.Roadblocks which is the full list
      let tmpRoadblocks = this.Roadblocks

      tmpRoadblocks = tmpRoadblocks.filter((item) => {
        return item.Member.Email == AttendeeEmail
      })
      return tmpRoadblocks
    },
  },
  async mounted() {
    const GroupID = this.$route.params.groupid
    const MeetingID = this.$route.params.id
    // listen to the Group document
    this.$store.dispatch('bagGroups/listenGroup', GroupID)
    // listen to the Meeting document
    this.$store.dispatch('bagMeetings/listenMeeting', {
      GroupID,
      MeetingID,
    })
  },
  async fetch({ store }) {},
}
</script>
<style>
@media print {
  .pb {
    page-break-before: always;
  }
  .noprint {
    visibility: hidden;
  }
}
</style>