<template>
  <v-container fluid>
    <template>
      <v-row>
        <v-toolbar color="secondary" rounded class="mb-2" dense dark>
          <v-app-bar-nav-icon
            @click="bottomSheet = !bottomSheet"
          ></v-app-bar-nav-icon>
          <v-spacer />
          <v-toolbar-title> Meeting: Closing </v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
      </v-row>
      <v-row>
        <v-col cols="12" md="3">
          <v-container>
            <v-tabs v-model="selectedTab" grow vertical>
              <v-tab>
                Lows &amp; Highs
                <v-icon>mdi-arrow-top-right-bottom-left-bold</v-icon>
              </v-tab>
              <v-tab>
                Goals
                <v-icon>mdi-bullseye-arrow</v-icon>
              </v-tab>
              <v-tab>
                Sidebars
                <v-icon>mdi-chat-plus-outline</v-icon>
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
            <!-- Highs -->
            <v-tab-item>
              <v-card class="mx-auto">
                <v-toolbar color="#a72f39" dark dense>
                  <v-toolbar-title>Highs &amp; Lows</v-toolbar-title>
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
                              >Meeting Highs
                              <v-spacer />
                              <v-btn
                                color="success"
                                @click="setCurrentHighs(attendee)"
                              >
                                Make Current</v-btn
                              >
                            </v-card-title>
                            <v-card-text>
                              <v-simple-table>
                                <thead>
                                  <tr>
                                    <th class="text-center" width="10%">H/L</th>
                                    <th class="text-left" width="50%">
                                      Description
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr
                                    v-for="(
                                      high, index
                                    ) in attendeeMeetingHighs(attendee)"
                                    :key="index"
                                  >
                                    <td class="text-center">
                                      <v-chip
                                        v-if="high.IsHigh"
                                        class="ma-2"
                                        color="success"
                                        outlined
                                      >
                                        <v-icon> mdi-arrow-up-box </v-icon>
                                      </v-chip>

                                      <v-chip
                                        v-else
                                        class="ma-2"
                                        color="error"
                                        outlined
                                      >
                                        <v-icon> mdi-arrow-down-box </v-icon>
                                      </v-chip>
                                    </td>
                                    <td class="text-left">
                                      {{ high.Title }}
                                      <v-spacer />
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
                            <v-card-title>Current Highs </v-card-title>
                            <v-card-text>
                              <v-simple-table>
                                <thead>
                                  <tr>
                                    <th class="text-center" width="10%">H/L</th>
                                    <th class="text-left" width="50%">
                                      Description
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr
                                    v-for="(
                                      high, index
                                    ) in attendeeCurrentHighs(attendee)"
                                    :key="index"
                                  >
                                    <td class="text-center">
                                      <v-chip
                                        v-if="high.IsHigh"
                                        class="ma-2"
                                        color="success"
                                        outlined
                                      >
                                        <v-icon> mdi-arrow-up-box </v-icon>
                                      </v-chip>

                                      <v-chip
                                        v-else
                                        class="ma-2"
                                        color="error"
                                        outlined
                                      >
                                        <v-icon> mdi-arrow-down-box </v-icon>
                                      </v-chip>
                                    </td>
                                    <td class="text-left">
                                      {{ high.Title }}
                                      <v-spacer />
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
            <!-- /Highs -->
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
                              >Meeting Goals
                              <v-spacer />
                              <v-btn
                                color="success"
                                @click="setCurrentGoals(attendee)"
                              >
                                Make Current</v-btn
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
                                    v-for="(
                                      goal, index
                                    ) in attendeeMeetingGoals(attendee)"
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
                            <v-card-title>Current Goals </v-card-title>
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
                                    ) in attendeeCurrentGoals(attendee)"
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
                  <template> </template>
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
                              >Meeting Sidebars
                              <v-spacer />
                              <v-btn
                                color="success"
                                @click="setCurrentSidebars(attendee)"
                              >
                                Make Current</v-btn
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
                                    ) in attendeeMeetingSidebars(attendee)"
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
                            <v-card-title>Current Sidebars </v-card-title>
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
                  color="warning"
                  @click="runMeeting()"
                  dense
                  :disabled="!IsRunning"
                >
                  Run Meeting
                </v-btn>
                <v-btn
                  :disabled="!IsRunning"
                  color="success"
                  @click="closeMeeting()"
                  dense
                >
                  End Meeting
                </v-btn>
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
export default {
  components: {},
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
    IsRunning() {
      // has it loaded? (We check for the Meeting.id because sometimes we have a Meeting, but only a partial one)
      if (!this.Meeting || !this.Meeting.id) {
        return false
      }

      // is it running? (StartedAt with no ClosedAt)
      if (this.Meeting.StartedAt && !this.Meeting.ClosedAt) {
        return true
      }
      // it's not running so we should redirect based on what state it IS in
      const GroupID = this.$route.params.groupid
      const MeetingID = this.$route.params.id
      // is it closed?
      if (this.Meeting.ClosedAt) {
        this.$router.push('/bag/meeting/report/' + GroupID + '/' + MeetingID)
      }

      // is it not started?
      if (!this.Meeting.StartedAt) {
        this.$router.push('/bag/meeting/start/' + GroupID + '/' + MeetingID)
      }
    },
  },
  methods: {
    viewGroup: function (groupID) {
      // redirect the UI to the group
      this.$router.push('/bag/group/' + groupID)
    },
    runMeeting: function () {
      const GroupID = this.$route.params.groupid
      const MeetingID = this.$route.params.id
      // redirect
      this.$router.push('/bag/meeting/run/' + GroupID + '/' + MeetingID)
    },
    closeMeeting: function () {
      const GroupID = this.$route.params.groupid
      const MeetingID = this.$route.params.id
      const Meeting = this.Meeting
      console.log('closeMeeting')
      console.log('GroupID:' + GroupID)
      console.log('MeetingID:' + MeetingID)
      console.log('Meeting:')
      console.log(Meeting)

      // update the Meeting record
      this.$store.dispatch('bagMeetings/Close', { GroupID, MeetingID })
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
    /*
        ===== HIGHS =====
    */
    /*
        Filter the Meeting.Highs for a specific Attendee
    */
    attendeeMeetingHighs: function (attendee) {
      if (!attendee || !attendee.Email) {
        return []
      }
      // are there any Highs in the Meeting, yet?
      if (!this.Meeting.Highs || this.Meeting.Highs.length === 0) {
        return []
      }
      // use this.Meeting.Highs which is the full list
      let tmpHighs = this.Meeting.Highs

      tmpHighs = tmpHighs.filter((item) => {
        return item.Member.Email == attendee.Email
      })
      return tmpHighs
    },
    /*
        Get the Member.CurrentHighs for an Attendee
    */
    attendeeCurrentHighs: function (attendee) {
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
      // are there any CurrentHighs for Member?
      if (!Member.CurrentHighs || Member.CurrentHighs.length === 0) {
        return []
      }
      return Member.CurrentHighs
    },
    /*
        Set the Member.CurrentHighs to attendeeMeetingHighs
    */
    setCurrentHighs: function (attendee) {
      const GroupID = this.$route.params.groupid
      // match the Member from the attendee.Email
      const Member = this.getMemberByEmail(attendee.Email)
      const MemberID = Member.id
      // get the meeting highs for the attendee
      const Highs = this.attendeeMeetingHighs(attendee)

      this.$store.dispatch('bagMembers/SetCurrentHighs', {
        GroupID,
        MemberID,
        Highs,
      })
    },

    /*
        ===== GOALS =====
    */
    /*
        Filter the Meeting.Goals for a specific Attendee
    */
    attendeeMeetingGoals: function (attendee) {
      if (!attendee || !attendee.Email) {
        return []
      }
      // are there any Goals in the Meeting, yet?
      if (!this.Meeting.Goals || this.Meeting.Goals.length === 0) {
        return []
      }
      // use this.Meeting.Goals which is the full list
      let tmpGoals = this.Meeting.Goals

      tmpGoals = tmpGoals.filter((item) => {
        return item.Member.Email == attendee.Email
      })
      return tmpGoals
    },
    /*
        Get the Member.CurrentGoals for an Attendee
    */
    attendeeCurrentGoals: function (attendee) {
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
        Set the Member.CurrentGoals to attendeeMeetingGoals
    */
    setCurrentGoals: function (attendee) {
      const GroupID = this.$route.params.groupid
      // match the Member from the attendee.Email
      const Member = this.getMemberByEmail(attendee.Email)
      const MemberID = Member.id
      // get the meeting goals for the attendee
      const Goals = this.attendeeMeetingGoals(attendee)

      this.$store.dispatch('bagMembers/SetCurrentGoals', {
        GroupID,
        MemberID,
        Goals,
      })
    },

    /*
        ===== SIDEBARS =====
    */
    /*
        Filter the Meeting.Sidebars for a specific Attendee
    */
    attendeeMeetingSidebars: function (attendee) {
      if (!attendee || !attendee.Email) {
        return []
      }
      // are there any Sidebars in the Meeting, yet?
      if (!this.Meeting.Sidebars || this.Meeting.Sidebars.length === 0) {
        return []
      }
      // use this.Meeting.Sidebars which is the full list
      let tmpSidebars = this.Meeting.Sidebars

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
        Set the Member.CurrentSidebars to attendeeMeetingSidebars
    */
    setCurrentSidebars: function (attendee) {
      const GroupID = this.$route.params.groupid
      // match the Member from the attendee.Email
      const Member = this.getMemberByEmail(attendee.Email)
      const MemberID = Member.id
      // get the meeting goals for the attendee
      const Sidebars = this.attendeeMeetingSidebars(attendee)

      this.$store.dispatch('bagMembers/SetCurrentSidebars', {
        GroupID,
        MemberID,
        Sidebars,
      })
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
  },
  async fetch() {},
}
</script>