<template>
  <v-container>
    <v-container v-if="!Meeting">
      <v-col cols="12" sm="12">
        <v-alert dense outlined type="error"> Invalid Meeting </v-alert>
      </v-col>
      <v-col cols="12" sm="12">
        <NuxtLink :to="{ name: 'bag' }">
          <v-btn block color="error"> Return To My Groups </v-btn>
        </NuxtLink>
      </v-col>
    </v-container>
    <v-row v-else>
      <v-col cols="12" md="3">
        <v-card class="mx-auto" dense>
          <v-toolbar color="#602034" rounded class="mb-2 white--text" dense>
            <v-spacer />
            <v-toolbar-title>Meeting</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <h3>Group:</h3>
            <p @click="viewGroup(Group.id)">{{ Group.Title }}</p>
            <h3>Meeting Date:</h3>
            <p>{{ Meeting.MeetingDateTime }}</p>
            <h3>Facilitator:</h3>
            <p v-if="Meeting.Facilitator">
              {{ Meeting.Facilitator.DisplayName }}
            </p>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              @click="startMeeting()"
              :disabled="!IsStarted && !IsReadyToStart()"
              color="success"
            >
              Start
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
        <v-card class="mx-auto" dense>
          <v-toolbar color="#602034" rounded class="mb-2 white--text" dense>
            <v-spacer />
            <v-toolbar-title>Attendees</v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-card-text>
            <v-list>
              <v-list-item-group active-class="border" color="primary">
                <v-list-item
                  v-for="attendee in Meeting.Attendees"
                  :key="attendee.Email"
                  dense
                >
                  <v-list-item-icon>
                    <v-list-item-avatar
                      ><v-chip color="success" outlined>{{
                        attendee.Initials
                      }}</v-chip></v-list-item-avatar
                    >
                  </v-list-item-icon>
                  <v-list-item-title>{{
                    attendee.DisplayName
                  }}</v-list-item-title>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="9">
        <v-stepper alt-labels non-linear>
          <v-stepper-header>
            <v-stepper-step step="1" editable color="success">
              Facilitator
              <small v-if="validFacilitator">Completed</small>
              <small v-else>Required</small>
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="2" editable color="success">
              Attendees
              <small v-if="validAttendees">Completed</small>
              <small v-else>Required</small>
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="3" editable color="success">
              Goals
              <small v-if="validGoals">Completed</small>
              <small v-else>Required</small>
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="4" editable color="success">
              Sidebars
              <small v-if="validSidebars">Completed</small>
              <small v-else>Required</small>
            </v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <FACILITATORSELECTOR />
            </v-stepper-content>
            <v-stepper-content step="2">
              <ATTENDEERSELECTOR />
            </v-stepper-content>
            <v-stepper-content step="3"><GOALSELECTOR /></v-stepper-content>
            <v-stepper-content step="4"><SIDEBARSELECTOR /></v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import FACILITATORSELECTOR from '../../../../../components/bag/meeting/selectFacilitator.vue'
import ATTENDEERSELECTOR from '../../../../../components/bag/meeting/selectAttendees.vue'
import GOALSELECTOR from '../../../../../components/bag/meeting/selectGoals.vue'
import SIDEBARSELECTOR from '../../../../../components/bag/meeting/selectSidebars.vue'
export default {
  components: {
    FACILITATORSELECTOR,
    ATTENDEERSELECTOR,
    GOALSELECTOR,
    SIDEBARSELECTOR,
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      Group: (state) => state.bagGroups.Group,
      Meeting: (state) => state.bagMeetings.Meeting,
      Goals: (state) => state.bagGoals.Goals,
      Sidebars: (state) => state.bagSidebars.Sidebars,
    }),

    validFacilitator() {
      const Facilitator = this.Meeting.Facilitator
      if (Facilitator && Facilitator.DisplayName) {
        return true
      }
      return false
    },
    validAttendees() {
      const Attendees = this.Meeting.Attendees
      if (Attendees && Attendees.length > 0) {
        return true
      }
      return false
    },
    validGoals() {
      const PreviousGoals = this.Group.CurrentGoals
      const CurrentGoals = this.Meeting.Goals
      if (!PreviousGoals || PreviousGoals.length == 0) {
        return true
      }
      if (CurrentGoals && CurrentGoals.length > 0) {
        return true
      }
      return false
    },
    validSidebars() {
      const PreviousSidebars = this.Group.CurrentSidebars
      const CurrentSidebars = this.Meeting.Sidebars
      if (!PreviousSidebars || PreviousSidebars.length == 0) {
        return true
      }
      if (CurrentSidebars && CurrentSidebars.length > 0) {
        return true
      }
      return false
    },
    IsStarted() {
      // we use this to redirect at any time the underlying Meeting.StartedAt value is set
      if (!this.Meeting || !this.Meeting.StartedAt) {
        return false
      }
      const GroupID = this.$route.params.groupid
      const MeetingID = this.$route.params.id
      // Meeting.StartedAt IS set, redirect
      this.$router.push('/bag/meeting/' + GroupID + '/' + MeetingID)
    },
  },
  methods: {
    viewGroup: function (groupID) {
      // redirect the UI to the group
      this.$router.push('/bag/group/' + groupID)
    },
    startMeeting: function () {
      const GroupID = this.$route.params.groupid
      const MeetingID = this.$route.params.id
      const Meeting = this.Meeting
      console.log('startMeeting')
      console.log('GroupID:' + GroupID)
      console.log('MeetingID:' + MeetingID)
      console.log('Meeting:')
      console.log(Meeting)

      // update the Meeting record
      this.$store.dispatch('bagMeetings/Start', { GroupID, MeetingID })
    },
    IsReadyToStart: function () {
      if (!this.Meeting) {
        return false
      }
      // valid facilitator?
      if (!this.validFacilitator) {
        return false
      }
      if (!this.validAttendees) {
        return false
      }
      if (!this.validGoals) {
        return false
      }
      if (!this.validSidebars) {
        return false
      }
      return true
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
    // load the Members for this Group
    this.$store.dispatch('bagMembers/listenMembers', GroupID)
    // load the Goals for this Group
    this.$store.dispatch('bagGoals/listenGoals', GroupID)
    // load the Sidebars for this Group
    this.$store.dispatch('bagSidebars/listenSidebars', GroupID)
  },
  async fetch() {},
}
</script>