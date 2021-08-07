<template>
  <v-container fluid>
    <template>
      <v-row>
        <v-toolbar color="secondary" rounded class="mb-2" dense dark>
          <v-app-bar-nav-icon
            @click="bottomSheet = !bottomSheet"
          ></v-app-bar-nav-icon>
          <v-spacer />
          <v-toolbar-title> Meeting {{ selectedTab }}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
      </v-row>
      <v-row>
        <v-col cols="12" md="3">
          <v-container>
            <v-tabs v-model="selectedTab" grow vertical>
              <v-tab class="text-left">
                Facilitator
                <v-icon v-if="validFacilitator">mdi-check</v-icon>
              </v-tab>
              <v-tab>
                Attendees
                <v-icon v-if="validAttendees">mdi-check</v-icon>
              </v-tab>
              <v-tab>
                Goals
                <v-icon v-if="validGoals">mdi-check</v-icon>
              </v-tab>
              <v-tab>
                Sidebars
                <v-icon v-if="validSidebars">mdi-check</v-icon>
              </v-tab>
            </v-tabs>
          </v-container>
          <v-card class="mx-auto" dense>
            <v-toolbar color="#a72f39" rounded class="mb-2 white--text" dense>
              <v-spacer />
              <v-toolbar-title>Attendees</v-toolbar-title>
              <v-spacer />
            </v-toolbar>
            <v-card-text>
              <v-list>
                <v-list-item-group
                  v-model="selectedAttendeeIndex"
                  active-class="border"
                  color="primary"
                >
                  <v-list-item
                    v-for="attendee in Meeting.Attendees"
                    :key="attendee.Email"
                    dense
                  >
                    <v-chip color="success" outlined>{{
                      attendee.Initials
                    }}</v-chip>
                    <v-spacer />
                    {{ attendee.DisplayName }}
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="9">
          <v-tabs-items v-model="selectedTab">
            <!-- Facilitator -->
            <v-tab-item>
              <v-card class="mx-auto">
                <v-toolbar color="#a72f39" dark dense>
                  <v-toolbar-title>Facilitator</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <FACILITATORSELECTOR />
                </v-card-text>
              </v-card>
            </v-tab-item>
            <!-- /Facilitator -->
            <!-- Attendees -->
            <v-tab-item>
              <v-card class="mx-auto">
                <v-toolbar color="#a72f39" dark dense>
                  <v-toolbar-title>Attendees</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <ATTENDEERSELECTOR />
                </v-card-text>
              </v-card>
            </v-tab-item>
            <!-- /Attendees -->
            <!-- Goals -->
            <v-tab-item>
              <v-card class="mx-auto">
                <v-toolbar color="#a72f39" dark dense>
                  <v-toolbar-title>Goals</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <v-container
                    v-for="(attendee, index) in Meeting.Attendees"
                    :key="index"
                  >
                    <v-toolbar rounded dense color="secondary" dark>{{
                      attendee.DisplayName
                    }}</v-toolbar>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-container>
                          <v-card rounded dense>
                            <v-card-title
                              >Current Goals
                              <v-spacer />
                              <v-btn
                                color="success"
                                @click="setPreviousGoals(attendee)"
                              >
                                Add to Meeting</v-btn
                              >
                            </v-card-title>
                            <v-card-text>
                              <v-simple-table>
                                <thead>
                                  <tr>
                                    <th class="text-left" width="20%">
                                      Status
                                    </th>
                                    <th class="text-left" width="80%">Goal</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr
                                    v-for="(goal, index) in memberCurrentGoals(
                                      attendee
                                    )"
                                    :key="index"
                                  >
                                    <td class="text-left">
                                      {{ goal.Status }}
                                    </td>
                                    <td class="text-left">
                                      {{ goal.Title }}
                                    </td>
                                  </tr>
                                </tbody>
                              </v-simple-table>
                            </v-card-text>
                          </v-card>
                        </v-container>
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-container>
                          <v-card rounded dense>
                            <v-card-title>Meeting Previous Goals </v-card-title>
                            <v-card-text>
                              <v-simple-table>
                                <thead>
                                  <tr>
                                    <th class="text-left" width="20%">
                                      Status
                                    </th>
                                    <th class="text-left" width="80%">Goal</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr
                                    v-for="(
                                      goal, index
                                    ) in attendeePreviousGoals(attendee)"
                                    :key="index"
                                  >
                                    <td class="text-left">
                                      {{ goal.Status }}
                                    </td>
                                    <td class="text-left">
                                      {{ goal.Title }}
                                    </td>
                                  </tr>
                                </tbody>
                              </v-simple-table>
                            </v-card-text>
                          </v-card>
                        </v-container>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <!-- /Goals -->
            <!-- Sidebars -->
            <v-tab-item>
              <v-card class="mx-auto">
                <v-toolbar color="#a72f39" dark dense>
                  <v-toolbar-title>Sidebars</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <v-container
                    v-for="(attendee, index) in Meeting.Attendees"
                    :key="index"
                  >
                    <v-toolbar rounded dense color="secondary" dark>{{
                      attendee.DisplayName
                    }}</v-toolbar>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-container>
                          <v-card rounded dense>
                            <v-card-title
                              >Current Sidebars
                              <v-spacer />
                              <v-btn
                                color="success"
                                @click="setPreviousSidebars(attendee)"
                                >Add to Meeting</v-btn
                              >
                            </v-card-title>
                            <v-card-text>
                              <v-simple-table>
                                <thead>
                                  <tr>
                                    <th class="text-left" width="30%">
                                      RequestedBy
                                    </th>
                                    <th class="text-left" width="30%">
                                      RequestedOf
                                    </th>
                                    <th class="text-left" width="40%">
                                      Reason
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr
                                    v-for="(
                                      sidebar, index
                                    ) in attendeeCurrentSidebars(attendee)"
                                    :key="index"
                                  >
                                    <td class="text-left">
                                      <span v-if="sidebar.RequestedBy">
                                        {{ sidebar.RequestedBy.DisplayName }}
                                      </span>
                                    </td>
                                    <td class="text-left">
                                      <span v-if="sidebar.RequestedOf">
                                        {{ sidebar.RequestedOf.DisplayName }}
                                      </span>
                                    </td>
                                    <td class="text-left">
                                      {{ sidebar.Reason }}
                                    </td>
                                  </tr>
                                </tbody>
                              </v-simple-table>
                            </v-card-text>
                          </v-card>
                        </v-container>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-container>
                          <v-card rounded dense>
                            <v-card-title>Meeting Sidebars </v-card-title>
                            <v-card-text>
                              <v-simple-table>
                                <thead>
                                  <tr>
                                    <th class="text-left" width="30%">
                                      RequestedBy
                                    </th>
                                    <th class="text-left" width="30%">
                                      RequestedOf
                                    </th>
                                    <th class="text-left" width="40%">
                                      Reason
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr
                                    v-for="(
                                      sidebar, index
                                    ) in attendeePreviousSidebars(attendee)"
                                    :key="index"
                                  >
                                    <td class="text-left">
                                      <span v-if="sidebar.RequestedBy">
                                        {{ sidebar.RequestedBy.DisplayName }}
                                      </span>
                                    </td>
                                    <td class="text-left">
                                      <span v-if="sidebar.RequestedOf">
                                        {{ sidebar.RequestedOf.DisplayName }}
                                      </span>
                                    </td>
                                    <td colspan="2" class="text-left">
                                      {{ sidebar.Reason }}
                                    </td>
                                  </tr>
                                </tbody>
                              </v-simple-table>
                            </v-card-text>
                          </v-card>
                        </v-container>
                      </v-col>
                    </v-row>
                  </v-container>
                  <template> </template>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <!-- /Sidebars -->
          </v-tabs-items>
        </v-col>
      </v-row>
    </template>

    <template>
      <v-bottom-sheet v-model="bottomSheet">
        <v-card>
          <v-card-title>Meeting Info</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="3">
                <h3>Group</h3>
                <p @click="viewGroup(Group.id)">{{ Group.Title }}</p>
                <h3>Scheduled</h3>
                <p>{{ Meeting.MeetingDateTime }}</p>
              </v-col>

              <v-col cols="12" md="3">
                <h3>Started</h3>
                <p v-if="Meeting.StartedAt">{{ Meeting.StartedAt }}</p>
                <p v-else>Not Started</p>
                <h3>Closed</h3>
                <p v-if="Meeting.ClosedAt">{{ Meeting.ClosedAt }}</p>
                <p v-else>Open</p>
              </v-col>

              <v-col cols="12" md="3">
                <h3>Facilitator</h3>
                <span v-if="Meeting.Facilitator">{{
                  Meeting.Facilitator.DisplayName
                }}</span>
              </v-col>

              <v-col cols="12" md="3">
                <v-btn
                  @click="startMeeting()"
                  :disabled="!IsStarted && !IsReadyToStart()"
                  color="success"
                  >Start</v-btn
                >
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-bottom-sheet>
    </template>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import FACILITATORSELECTOR from '../../../../../components/bag/meeting/selectFacilitator.vue'
import ATTENDEERSELECTOR from '../../../../../components/bag/meeting/selectAttendees.vue'
export default {
  components: {
    FACILITATORSELECTOR,
    ATTENDEERSELECTOR,
  },
  data() {
    return {
      bottomSheet: false,
      selectedTab: 0,
      selectedAttendeeIndex: {},
    }
  },
  computed: {
    ...mapState({
      Group: (state) => state.bagGroups.Group,
      Meeting: (state) => state.bagMeetings.Meeting,
      Members: (state) => state.bagMembers.Members,
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
    /*
        This servers 2 purposes:
        1: Enable/Disable the Start Meeting button in the bottom-sheet
        2: Redirect to the appropriate screen
            based on the StartedAt and ClosedAt values of the Meeting
    */
    IsStarted() {
      // If the meeting isn't loaded yet, it isn't started...
      if (!this.Meeting) {
        return false
      }
      const GroupID = this.$route.params.groupid
      const MeetingID = this.$route.params.id
      // has it been closed?
      if (this.Meeting.ClosedAt) {
        console.log('IsStarted: Meeting has been closed')
        // Meeting.ClosedAt IS set, redirect
        this.$router.push('/bag/meeting/report/' + GroupID + '/' + MeetingID)
      }
      // has it been started?
      if (this.Meeting.StartedAt) {
        console.log('IsStarted: Meeting has been started')
        this.$router.push('/bag/meeting/run/' + GroupID + '/' + MeetingID)
      }
      // It's loaded, not closed, and not started, so...
      return false
    },
  },
  methods: {
    viewGroup: function (groupID) {
      // redirect the UI to the group
      this.$router.push('/bag/group/' + groupID)
    },
    /*
        Sets the StartedAt timestamp for the Meeting
    */
    startMeeting: function () {
      const tmpDate = new Date()
      const tmpCreatedAt = `${tmpDate.getFullYear()}-${
        tmpDate.getMonth() + 1
      }-${tmpDate.getDate()} ${tmpDate.getHours()}:${(
        '0' + tmpDate.getMinutes()
      ).slice(-2)}`
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
    /*
        ===== HIGHS =====
        this is a placeholder for future use
    */
    attendeeMeetingHighs: function () {},
    attendeeCurrentHighs: function () {},
    setMeetingHighs: function () {},
    /*
        ===== GOALS =====
    */
    /*
        Filter the Meeting.Goals for a specific Attendee
    */
    attendeePreviousGoals: function (attendee) {
      if (!attendee || !attendee.Email) {
        return []
      }
      // are there any Goals in the Meeting, yet?
      if (
        !this.Meeting.PreviousGoals ||
        this.Meeting.PreviousGoals.length === 0
      ) {
        return []
      }
      // use this.Meeting.Goals which is the full list
      let tmpGoals = this.Meeting.PreviousGoals

      tmpGoals = tmpGoals.filter((item) => {
        return item.Member.Email == attendee.Email
      })
      return tmpGoals
    },
    /*
        Get the Member.CurrentGoals for an Attendee
    */
    memberCurrentGoals: function (attendee) {
      // input good?
      if (!attendee || !attendee.Email) {
        return []
      }
      // match the Member from the attendee.Email
      const Member = this.getMemberByEmail(attendee.Email)
      // return empty set if Member not found
      if (!Member) {
        return []
      }
      // are there any CurrentGoals for Member?
      if (!Member.CurrentGoals || Member.CurrentGoals.length === 0) {
        return []
      }
      return Member.CurrentGoals
    },
    /*
        Merge the attendees Member.CurrentGoals into Meeting.PreviousGoals
    */
    setPreviousGoals(attendee) {
      let GroupID = this.$route.params.groupid
      let MeetingID = this.$route.params.id
      // get the Group.Member.CurrentGoals for the attendee
      let Goals = this.memberCurrentGoals(attendee)
      this.$store.dispatch('bagMeetings/addPreviousGoals', {
        GroupID,
        MeetingID,
        Goals,
      })
    },
    /*
        ===== SIDEBARS =====
    */
    /*
        Filter the Meeting.Sidebars for a specific Attendee
    */
    attendeePreviousSidebars: function (attendee) {
      if (!attendee || !attendee.Email) {
        return []
      }
      // are there any Sidebars in the Meeting, yet?
      if (
        !this.Meeting.PreviousSidebars ||
        this.Meeting.PreviousSidebars.length === 0
      ) {
        return []
      }
      // use this.Meeting.Sidebars which is the full list
      let tmpSidebars = this.Meeting.PreviousSidebars

      tmpSidebars = tmpSidebars.filter((item) => {
        return (
          item.RequestedBy.Email == attendee.Email ||
          item.RequestedOf.Email == attendee.Email
        )
      })
      return tmpSidebars
    },
    /*
        Get the Member.CurrentSidebars for an Attendee
    */
    attendeeCurrentSidebars: function (attendee) {
      // input good?
      if (!attendee || !attendee.Email) {
        return []
      }
      // match the Member from the attendee.Email
      const Member = this.getMemberByEmail(attendee.Email)
      // return empty set if Member not found
      if (!Member) {
        return []
      }
      // are there any CurrentSidebars for Member?
      if (!Member.CurrentSidebars || Member.CurrentSidebars.length === 0) {
        return []
      }
      return Member.CurrentSidebars
    },
    /*
        Merge the attendees Member.CurrentSidebars into Meeting.PreviousSidebars
    */
    setPreviousSidebars: function (attendee) {
      let GroupID = this.$route.params.groupid
      let MeetingID = this.$route.params.id
      // get the Group.Member.CurrentSidebars for the attendee
      let Sidebars = this.attendeeCurrentSidebars(attendee)
      // update the meeting
      this.$store.dispatch('bagMeetings/AddPreviousSidebars', {
        GroupID,
        MeetingID,
        Sidebars,
      })
    },

    /*
        takes an email address and returns the corresponding bagGroups.Member
    */
    getMemberByEmail: function (email) {
      if (!email) {
        return {}
      }
      // get the Member from Members
      let Members = this.Members
      // did we find some members?
      if (!Members) {
        console.log('No group members')
        return {}
      }
      let Member = this.Members.find((element) => element.Email === email)
      // did we find the Member match?
      if (!Member) {
        return {}
      }
      return Member
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