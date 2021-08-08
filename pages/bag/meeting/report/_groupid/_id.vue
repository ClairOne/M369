<template>
  <v-container fluid>
    <v-card>
      <v-toolbar color="#602034" rounded class="mb-2 white--text" dense>
        <v-spacer />
        <v-toolbar-title>Meeting Notes</v-toolbar-title>
        <v-spacer />
      </v-toolbar>
      <v-card-text>
        <v-row class="pa-3">
          <v-container fluid>
            <v-row class="pa-3">
              <v-col cols="12" md="4">
                <h3>Group</h3>
                <p @click="viewGroup(Group.id)">{{ Group.Title }}</p>
                <h3>Facilitator</h3>
                <p v-if="Meeting.Facilitator">
                  {{ Meeting.Facilitator.DisplayName }}
                </p>
              </v-col>
              <v-col cols="12" md="4">
                <h3>Meeting</h3>
                <p>{{ Meeting.MeetingDate }}</p>
                <h3>Status</h3>
                <p>{{ meetingStatus }}</p>
              </v-col>
              <v-col cols="12" md="4">
                <h3>Started</h3>
                <p>{{ Meeting.StartedAt }}</p>
                <h3>Ended</h3>
                <p>{{ Meeting.ClosedAt }}</p>
              </v-col>
            </v-row>
          </v-container>
        </v-row>
        <v-row
          v-for="attendee in Meeting.Attendees"
          :key="attendee.Email"
          class="pa-5 pb"
        >
          <v-container fluid>
            <v-toolbar color="secondary" class="white--text" dense rounded>
              <v-toolbar-title>{{ attendee.DisplayName }}</v-toolbar-title>
            </v-toolbar>
          </v-container>
          <v-container fluid>
            <v-toolbar color="accent" class="white--text" dense rounded>
              <v-toolbar-title>Highs &amp; Lows</v-toolbar-title>
            </v-toolbar>
            <v-simple-table dense>
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

          <v-container fluid>
            <v-toolbar color="accent" class="white--text" dense rounded>
              <v-toolbar-title>Goals</v-toolbar-title>
            </v-toolbar>
            <v-simple-table dense>
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

          <v-container fluid>
            <v-toolbar color="accent" class="white--text" dense rounded>
              <v-toolbar-title>Sidebars</v-toolbar-title>
            </v-toolbar>
            <v-simple-table
              dense
              v-if="attendeeSidebars(attendee.Email).length > 0"
            >
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
            <v-container v-else>None</v-container>
          </v-container>

          <v-container fluid>
            <v-toolbar color="accent" class="white--text" dense rounded>
              <v-toolbar-title>Roadblocks</v-toolbar-title>
            </v-toolbar>
            <v-simple-table
              dense
              v-if="attendeeRoadblocks(attendee.Email).length > 0"
            >
              <thead>
                <tr>
                  <th class="text-left">Roadblock</th>
                </tr>
              </thead>

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
          </v-container>
        </v-row>
      </v-card-text>
    </v-card>
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
      // should we filter or return them all?
      if (!AttendeeEmail) {
        // no Email, return them all
        return this.Highs
      }
      // if there are no Meeting.Highs then return an empty array
      if (!this.Highs) {
        return []
      }
      // use this.Meeting.Highs which is the full list
      let tmpHighs = this.Highs

      tmpHighs = tmpHighs.filter((item) => {
        return item.Member.Email == AttendeeEmail
      })
      return tmpHighs
    },
    attendeeGoals(AttendeeEmail) {
      // should we filter or return them all?
      if (!AttendeeEmail) {
        // no Email, return them all
        return this.Goals
      }
      // if there are no Meeting.Goals then return an empty array
      if (!this.Goals) {
        return []
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
      // if there are no Meeting.Sidebars then return an empty array
      if (!this.Sidebars) {
        return []
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