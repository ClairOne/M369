<template>
  <v-container fluid>
    <template>
      <v-row>
        <v-toolbar color="secondary" rounded class="mb-2" dense dark>
          <v-app-bar-nav-icon
            @click="bottomSheet = !bottomSheet"
          ></v-app-bar-nav-icon>
          <v-spacer />
          <v-toolbar-title>
            Meeting: <span v-if="IsRunning">Running</span></v-toolbar-title
          >
          <v-spacer></v-spacer>
        </v-toolbar>
      </v-row>
      <v-row>
        <v-col cols="12" md="3">
          <v-container>
            <v-tabs v-model="selectedTab" grow vertical>
              <v-tab> Lows &amp; Highs </v-tab>
              <v-tab> Previous Items </v-tab>
              <v-tab> Goals </v-tab>
              <v-tab> Sidebars </v-tab>
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
                  <v-toolbar-title
                    >Highs &amp; Lows:
                    <span v-if="selectedAttendee">{{
                      selectedAttendee.DisplayName
                    }}</span></v-toolbar-title
                  >
                </v-toolbar>
                <v-card-text>
                  <v-row class="pl-5 pr-5">
                    <v-text-field
                      v-model="HighTitle"
                      label="High"
                      required
                    ></v-text-field>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="success"
                      class="ma-2 white--text"
                      @click="addHigh(true)"
                      :disabled="!validNewHigh"
                    >
                      <v-icon> mdi-arrow-up-box </v-icon>
                    </v-btn>
                    <v-btn
                      color="error"
                      class="ma-2 white--text"
                      @click="addHigh(false)"
                      :disabled="!validNewHigh"
                    >
                      <v-icon> mdi-arrow-down-box </v-icon>
                    </v-btn>
                  </v-row>
                  <template>
                    <v-simple-table>
                      <thead>
                        <tr>
                          <th class="text-center" width="10%">Member</th>
                          <th class="text-center" width="10%">H/L</th>
                          <th class="text-left" width="50%">Description</th>
                          <th class="text-center">actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(high, index) in attendeeHighs" :key="index">
                          <td class="text-center">
                            <v-chip class="ma-2" color="success" outlined
                              >{{ high.Member.Initials }}
                            </v-chip>
                          </td>
                          <td class="text-center">
                            <v-chip
                              v-if="high.IsHigh"
                              class="ma-2"
                              color="success"
                              outlined
                            >
                              <v-icon> mdi-arrow-up-box </v-icon>
                            </v-chip>

                            <v-chip v-else class="ma-2" color="error" outlined>
                              <v-icon> mdi-arrow-down-box </v-icon>
                            </v-chip>
                          </td>
                          <td class="text-left">
                            {{ high.Title }}
                            <v-spacer />
                          </td>
                          <td class="text-center">
                            <v-chip
                              class="ma-2"
                              color="error"
                              outlined
                              @click="removeHigh(high)"
                            >
                              <v-icon> mdi-trash-can </v-icon>
                            </v-chip>
                          </td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                  </template>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <!-- /Highs -->
            <!-- Previous -->
            <v-tab-item>
              <v-card class="mx-auto">
                <v-toolbar color="#a72f39" dark dense>
                  <v-toolbar-title
                    >Previous Goals:
                    <span v-if="selectedAttendee">{{
                      selectedAttendee.DisplayName
                    }}</span></v-toolbar-title
                  >
                </v-toolbar>
                <v-card-text>
                  <template>
                    <v-simple-table>
                      <thead>
                        <tr>
                          <th class="text-center" width="10%">Member</th>
                          <th class="text-center" width="10%">Status</th>
                          <th class="text-left">Goal</th>
                          <th class="text-center" width="30%">actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(goal, index) in attendeePreviousGoals"
                          :key="index"
                        >
                          <td class="text-center">
                            <v-chip class="ma-2" color="success" outlined
                              >{{ goal.Member.Initials }}
                            </v-chip>
                          </td>
                          <td class="text-center">{{ goal.Status }}</td>
                          <td class="text-left">
                            {{ goal.Title }}
                            <v-spacer />
                          </td>
                          <td class="text-center">
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on, attrs }">
                                <v-chip
                                  v-bind="attrs"
                                  v-on="on"
                                  class="ma-2"
                                  color="success"
                                  :outlined="
                                    !IsStatusMatch(goal.Status, 'Complete')
                                  "
                                  @click="
                                    setPreviousGoalStatus(goal, 'Complete')
                                  "
                                >
                                  <v-icon> mdi-check </v-icon>
                                </v-chip>
                              </template>
                              <span
                                v-if="IsStatusMatch(goal.Status, 'Complete')"
                                >Completed</span
                              >
                              <span v-else>Mark Complete</span>
                            </v-tooltip>

                            <v-tooltip bottom>
                              <template v-slot:activator="{ on, attrs }">
                                <v-chip
                                  v-bind="attrs"
                                  v-on="on"
                                  class="ma-2"
                                  color="error"
                                  :outlined="
                                    !IsStatusMatch(goal.Status, 'Ongoing')
                                  "
                                  @click="
                                    setPreviousGoalStatus(goal, 'Ongoing')
                                  "
                                >
                                  <v-icon> mdi-contain-start </v-icon>
                                </v-chip>
                              </template>
                              <span v-if="IsStatusMatch(goal.Status, 'Ongoing')"
                                >Ongoing</span
                              >
                              <span v-else>Mark Ongoing</span>
                            </v-tooltip>

                            <v-tooltip bottom>
                              <template v-slot:activator="{ on, attrs }">
                                <v-chip
                                  v-bind="attrs"
                                  v-on="on"
                                  class="ma-2"
                                  color="error"
                                  :outlined="
                                    !IsStatusMatch(goal.Status, 'Cancelled')
                                  "
                                  @click="
                                    setPreviousGoalStatus(goal, 'Cancelled')
                                  "
                                >
                                  <v-icon> mdi-cancel </v-icon>
                                </v-chip>
                              </template>
                              <span
                                v-if="IsStatusMatch(goal.Status, 'Cancelled')"
                                >Cancelled</span
                              >
                              <span v-else>Mark Cancelled</span>
                            </v-tooltip>
                          </td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                  </template>
                </v-card-text>
              </v-card>
              <v-card class="mx-auto">
                <v-toolbar color="#a72f39" dark dense>
                  <v-toolbar-title
                    >Previous Sidebars:
                    <span v-if="selectedAttendee">{{
                      selectedAttendee.DisplayName
                    }}</span></v-toolbar-title
                  >
                </v-toolbar>
                <v-card-text>
                  <template>
                    <v-simple-table>
                      <thead>
                        <tr>
                          <th class="text-center" width="10%">RequestedBy</th>
                          <th class="text-center" width="10%">RequestedOf</th>
                          <th class="text-center" width="10%">Status</th>
                          <th class="text-left">Reason</th>
                          <th class="text-center" width="30%">actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(sidebar, index) in attendeePreviousSidebars"
                          :key="index"
                        >
                          <td class="text-center">
                            <v-chip class="ma-2" color="success" outlined
                              >{{ sidebar.RequestedBy.Initials }}
                            </v-chip>
                          </td>
                          <td class="text-center">
                            <v-chip class="ma-2" color="success" outlined
                              >{{ sidebar.RequestedOf.Initials }}
                            </v-chip>
                          </td>
                          <td class="text-center">{{ sidebar.Status }}</td>
                          <td class="text-left">
                            {{ sidebar.Reason }}
                            <v-spacer />
                          </td>
                          <td class="text-center">
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on, attrs }">
                                <v-chip
                                  v-bind="attrs"
                                  v-on="on"
                                  class="ma-2"
                                  color="success"
                                  :outlined="
                                    !IsStatusMatch(sidebar.Status, 'Complete')
                                  "
                                  @click="
                                    setPreviousSidebarStatus(
                                      sidebar,
                                      'Complete'
                                    )
                                  "
                                >
                                  <v-icon> mdi-check </v-icon>
                                </v-chip>
                              </template>
                              <span
                                v-if="IsStatusMatch(sidebar.Status, 'Complete')"
                                >Completed</span
                              >
                              <span v-else>Mark Complete</span>
                            </v-tooltip>

                            <v-tooltip bottom>
                              <template v-slot:activator="{ on, attrs }">
                                <v-chip
                                  v-bind="attrs"
                                  v-on="on"
                                  class="ma-2"
                                  color="error"
                                  :outlined="
                                    !IsStatusMatch(sidebar.Status, 'Ongoing')
                                  "
                                  @click="
                                    setPreviousSidebarStatus(sidebar, 'Ongoing')
                                  "
                                >
                                  <v-icon> mdi-contain-start </v-icon>
                                </v-chip>
                              </template>
                              <span
                                v-if="IsStatusMatch(sidebar.Status, 'Ongoing')"
                                >Ongoing</span
                              >
                              <span v-else>Mark Ongoing</span>
                            </v-tooltip>

                            <v-tooltip bottom>
                              <template v-slot:activator="{ on, attrs }">
                                <v-chip
                                  v-bind="attrs"
                                  v-on="on"
                                  class="ma-2"
                                  color="error"
                                  :outlined="
                                    !IsStatusMatch(sidebar.Status, 'Cancelled')
                                  "
                                  @click="
                                    setPreviousSidebarStatus(
                                      sidebar,
                                      'Cancelled'
                                    )
                                  "
                                >
                                  <v-icon> mdi-cancel </v-icon>
                                </v-chip>
                              </template>
                              <span
                                v-if="
                                  IsStatusMatch(sidebar.Status, 'Cancelled')
                                "
                                >Cancelled</span
                              >
                              <span v-else>Mark Cancelled</span>
                            </v-tooltip>
                          </td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                  </template>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <!-- /Previous -->
            <!-- Goals -->
            <v-tab-item>
              <v-card class="mx-auto">
                <v-toolbar color="#a72f39" dark dense>
                  <v-toolbar-title
                    >Goals:
                    <span v-if="selectedAttendee">{{
                      selectedAttendee.DisplayName
                    }}</span></v-toolbar-title
                  >
                </v-toolbar>
                <v-card-text>
                  <v-row class="pl-5 pr-5">
                    <v-text-field
                      v-model="GoalTitle"
                      label="Goal"
                      required
                    ></v-text-field>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary"
                      class="ma-2 white--text"
                      @click="addGoal()"
                      :disabled="!validNewGoal"
                    >
                      <v-icon> mdi-arrow-down-box </v-icon>
                    </v-btn>
                  </v-row>

                  <template>
                    <v-simple-table>
                      <thead>
                        <tr>
                          <th class="text-center" width="10%">Member</th>
                          <th class="text-center" width="10%">Status</th>
                          <th class="text-left" width="50%">Goal</th>
                          <th class="text-center">actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(goal, index) in attendeeGoals" :key="index">
                          <td class="text-center">
                            <v-chip class="ma-2" color="success" outlined
                              >{{ goal.Member.Initials }}
                            </v-chip>
                          </td>
                          <td class="text-center">{{ goal.Status }}</td>
                          <td class="text-left">
                            {{ goal.Title }}
                            <v-spacer />
                          </td>
                          <td class="text-center">
                            <v-chip
                              v-if="goal.Status == 'New'"
                              class="ma-2"
                              color="error"
                              outlined
                              @click="removeGoal(goal)"
                            >
                              <v-icon> mdi-trash-can </v-icon>
                            </v-chip>
                          </td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                  </template>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <!-- /Goals -->
            <!-- Sidebars -->
            <v-tab-item>
              <v-card class="mx-auto">
                <v-toolbar color="#a72f39" dark dense>
                  <v-toolbar-title
                    >Sidebars:
                    <span v-if="selectedAttendee">{{
                      selectedAttendee.DisplayName
                    }}</span></v-toolbar-title
                  >
                </v-toolbar>
                <v-card-text>
                  <v-row>
                    <v-col>
                      <v-select
                        v-model="SidebarRequestedOf"
                        :items="Meeting.Attendees"
                        item-text="DisplayName"
                        item-value="Email"
                        label="Requested Of"
                        return-object
                        single-line
                      ></v-select>
                    </v-col>
                    <v-col>
                      <v-text-field
                        v-model="SidebarReason"
                        label="Reason"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-btn
                        color="primary"
                        class="ma-2 white--text"
                        @click="addSidebar()"
                        :disabled="!validNewSidebar"
                      >
                        <v-icon> mdi-arrow-down-box </v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>

                  <template>
                    <v-simple-table>
                      <thead>
                        <tr>
                          <th class="text-center" width="10%">RequestedBy</th>
                          <th class="text-center" width="10%">RequestedOf</th>
                          <th class="text-center" width="10%">Status</th>
                          <th class="text-left" width="50%">Reason</th>
                          <th class="text-center">actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(sidebar, index) in attendeeSidebars"
                          :key="index"
                        >
                          <td class="text-center">
                            <v-chip class="ma-2" color="success" outlined
                              >{{ sidebar.RequestedBy.Initials }}
                            </v-chip>
                          </td>
                          <td class="text-center">
                            <v-chip class="ma-2" color="success" outlined
                              >{{ sidebar.RequestedOf.Initials }}
                            </v-chip>
                          </td>
                          <td class="text-center">{{ sidebar.Status }}</td>
                          <td class="text-left">
                            {{ sidebar.Reason }}
                            <v-spacer />
                          </td>
                          <td class="text-center">
                            <v-chip
                              v-if="sidebar.Status == 'New'"
                              class="ma-2"
                              color="error"
                              outlined
                              @click="removeSidebar(sidebar)"
                            >
                              <v-icon> mdi-trash-can </v-icon>
                            </v-chip>
                          </td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                  </template>
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
                <p>{{ Meeting.StartedAt }}</p>
                <h3>Closed</h3>
                <p>{{ Meeting.ClosedAt }}</p>
              </v-col>

              <v-col cols="12" md="3">
                <h3>Facilitator</h3>
                <span v-if="Meeting.Facilitator">{{
                  Meeting.Facilitator.DisplayName
                }}</span>
              </v-col>

              <v-col cols="12" md="3">
                <v-btn
                  :disabled="!IsRunning"
                  color="success"
                  @click="closeMeeting()"
                  dense
                >
                  Close Meeting
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

      HighTitle: '',
      GoalTitle: '',
      SidebarReason: '',
      SidebarRequestedOf: {},
    }
  },
  computed: {
    ...mapState({
      Group: (state) => state.bagGroups.Group,
      Meeting: (state) => state.bagMeetings.Meeting,
    }),
    selectedAttendee: function () {
      // changes the currentMember based on which item in the list is selected.
      if (this.selectedAttendeeIndex == null) {
        return {}
      }
      if (!this.Meeting) {
        return {}
      }
      if (!this.Meeting.Attendees) {
        return {}
      }
      return this.Meeting.Attendees[this.selectedAttendeeIndex]
    },
    /*
    Return a list of highs filtered based on the selected member
    if no member is selected return the full list of highs
    */
    attendeeHighs() {
      // are there any Highs in the Meeting, yet?
      if (!this.Meeting.Highs || this.Meeting.Highs.length === 0) {
        return []
      }
      // should we filter or return them all?
      if (!this.selectedAttendee || !this.selectedAttendee.Email) {
        // no Email, return them all
        return this.Meeting.Highs
      }
      // use this.Meeting.Highs which is the full list
      let tmpHighs = this.Meeting.Highs

      tmpHighs = tmpHighs.filter((item) => {
        return item.Member.Email == this.selectedAttendee.Email
      })
      return tmpHighs
    },
    attendeePreviousGoals() {
      // are there any PreviousGoals in the Meeting?
      if (
        !this.Meeting ||
        !this.Meeting.PreviousGoals ||
        this.Meeting.PreviousGoals.length === 0
      ) {
        return []
      }
      // should we filter or return them all?
      if (!this.selectedAttendee || !this.selectedAttendee.Email) {
        // no Email, return them all
        return this.Meeting.PreviousGoals
      }

      // use this.Goals which is the full list
      let tmpGoals = this.Meeting.PreviousGoals

      tmpGoals = tmpGoals.filter((item) => {
        return item.Member.Email == this.selectedAttendee.Email
      })
      return tmpGoals
    },
    attendeeGoals() {
      // are there any Goals in the Meeting, yet?
      if (!this.Meeting.Goals || this.Meeting.Goals.length === 0) {
        return []
      }
      // should we filter or return them all?
      if (!this.selectedAttendee || !this.selectedAttendee.Email) {
        // no Email, return them all
        return this.Meeting.Goals
      }

      // use this.Goals which is the full list
      let tmpGoals = this.Meeting.Goals

      tmpGoals = tmpGoals.filter((item) => {
        return item.Member.Email == this.selectedAttendee.Email
      })
      return tmpGoals
    },
    attendeePreviousSidebars() {
      // are there any PreviousSidebars in the Meeting?
      if (
        !this.Meeting.PreviousSidebars ||
        this.Meeting.PreviousSidebars.length === 0
      ) {
        return []
      }
      // should we filter or return them all?
      if (!this.selectedAttendee || !this.selectedAttendee.Email) {
        // no Email, return them all
        return this.Meeting.PreviousSidebars
      }

      // use this.PreviousSidebars which is the full list
      let tmpSidebars = this.Meeting.PreviousSidebars

      tmpSidebars = tmpSidebars.filter((item) => {
        return (
          item.RequestedBy.Email == this.selectedAttendee.Email ||
          item.RequestedOf.Email == this.selectedAttendee.Email
        )
      })
      return tmpSidebars
    },
    attendeeSidebars() {
      // are there any Sidebars in the Meeting, yet?
      if (!this.Meeting.Sidebars || this.Meeting.Sidebars.length === 0) {
        return []
      }
      // should we filter or return them all?
      if (!this.selectedAttendee || !this.selectedAttendee.Email) {
        // no Email, return them all
        return this.Meeting.Sidebars
      }

      // use this.Sidebars which is the full list
      let tmpSidebars = this.Meeting.Sidebars

      tmpSidebars = tmpSidebars.filter((item) => {
        return (
          item.RequestedBy.Email == this.selectedAttendee.Email ||
          item.RequestedOf.Email == this.selectedAttendee.Email
        )
      })
      return tmpSidebars
    },
    validNewHigh() {
      // use a negative trap approach for simplicity (@TODO: convert to using form validation)
      if (!this.selectedAttendee || !this.selectedAttendee.Email) {
        return false
      }
      if (!this.HighTitle.length > 0) {
        return false
      }
      return true
    },
    validNewGoal() {
      // use a negative trap approach for simplicity (@TODO: convert to using form validation)
      if (!this.selectedAttendee || !this.selectedAttendee.Email) {
        return false
      }
      if (!this.GoalTitle.length > 0) {
        return false
      }
      return true
    },
    validNewSidebar() {
      // use a negative trap approach for simplicity (@TODO: convert to using form validation)
      // reason is required
      if (!this.SidebarReason.length > 0) {
        return false
      }
      // RequestedBy is the selectedAttendee
      if (!this.selectedAttendee || !this.selectedAttendee.Email) {
        return false
      }
      // RequestedOf is the selectBox
      if (!this.SidebarRequestedOf || !this.SidebarRequestedOf.Email) {
        return false
      }
      return true
    },
    IsRunning() {
      // has it loaded?
      if (!this.Meeting || !this.Meeting.id) {
        console.log('Meeting not loaded.')
        return false
      }
      const GroupID = this.$route.params.groupid
      const MeetingID = this.$route.params.id
      // is it started?
      if (!this.Meeting.StartedAt) {
        console.log(
          'Meeting is not started.(redirect to start)' + this.Meeting.StartedAt
        )
        this.$router.push('/bag/meeting/start/' + GroupID + '/' + MeetingID)
      }
      // is it closed?
      if (this.Meeting.ClosedAt) {
        console.log(
          'Meeting is closed.(redirect to report)' + this.Meeting.ClosedAt
        )
        this.$router.push('/bag/meeting/report/' + GroupID + '/' + MeetingID)
      }

      if (this.Meeting.StartedAt && !this.Meeting.ClosedAt) {
        console.log('Meeting is running.')
        return true
      }
    },
  },
  methods: {
    IsStatusMatch: function (Status, Match) {
      if (Status === Match) {
        return true
      }
      return false
    },
    IsComplete: function (Status) {
      if (Status === 'Complete') {
        return true
      }
      return false
    },
    IsOngoing: function (Status) {
      if (Status === 'Ongoing') {
        return true
      }
      return false
    },
    IsCancelled: function (Status) {
      if (Status === 'Cancelled') {
        return true
      }
      return false
    },

    addHigh: function (IsHigh) {
      if (!this.validNewHigh) {
        return
      }
      const GroupID = this.$route.params.groupid
      const MeetingID = this.$route.params.id
      const Attendee = this.selectedAttendee
      // build the high
      const High = {
        IsHigh: IsHigh,
        Member: Attendee,
        Title: this.HighTitle,
      }
      this.$store.dispatch('bagMeetings/AddHigh', {
        GroupID,
        MeetingID,
        High,
      })
      // reset the form
      this.HighTitle = ''
    },
    removeHigh: function (high) {
      const GroupID = this.$route.params.groupid
      const MeetingID = this.$route.params.id
      const High = high

      this.$store.dispatch('bagMeetings/RemoveHigh', {
        GroupID,
        MeetingID,
        High,
      })
    },
    /*
    INCOMPLETE
    */
    addGoalFromPrevious: function (Goal) {
      console.log('addGoalFromPrevious(Goal):')
      console.log(Goal)
      const GroupID = this.$route.params.groupid
      const MeetingID = this.$route.params.id

      // set the previous goal status to 'Ongoing'
      this.$store.dispatch('bagMeetings/SetPreviousGoalStatus', {
        GroupID,
        MeetingID,
        Goal,
        Status,
      })

      // add the goal to Goals
      this.$store.dispatch('bagMeetings/AddGoal', {
        GroupID,
        MeetingID,
        Goal,
      })
    },
    addGoal: function () {
      if (!this.validNewGoal) {
        return
      }
      const GroupID = this.$route.params.groupid
      const MeetingID = this.$route.params.id
      const Attendee = this.selectedAttendee
      // build the goal
      const Goal = {
        Member: Attendee,
        Title: this.GoalTitle,
        Status: 'New',
        SourceType: 'bagMeeting',
        Source: MeetingID,
      }
      this.$store.dispatch('bagMeetings/AddGoal', {
        GroupID,
        MeetingID,
        Goal,
      })
      // reset the form
      this.GoalTitle = ''
    },
    removeGoal: function (Goal) {
      const GroupID = this.$route.params.groupid
      const MeetingID = this.$route.params.id
      this.$store.dispatch('bagMeetings/RemoveGoal', {
        GroupID,
        MeetingID,
        Goal,
      })
    },
    setPreviousGoalStatus: function (Goal, Status) {
      // is the status actually changing?
      if (Goal.Status === Status) {
        return
      }
      const GroupID = this.$route.params.groupid
      const MeetingID = this.$route.params.id
      this.$store.dispatch('bagMeetings/SetPreviousGoalStatus', {
        GroupID,
        MeetingID,
        Goal,
        Status,
      })
    },
    addSidebar: function () {
      console.log('this.route:')
      console.log(this.$route.name)

      if (!this.validNewSidebar) {
        return
      }
      const GroupID = this.$route.params.groupid
      const MeetingID = this.$route.params.id
      const Reason = this.SidebarReason
      const RequestedBy = this.selectedAttendee
      const RequestedOf = this.SidebarRequestedOf
      const Source = this.$route.name
      const SourceType = 'page'

      const Sidebar = {
        Reason: Reason,
        RequestedBy: RequestedBy,
        RequestedOf: RequestedOf,
        Status: 'New',
        SourceType: SourceType,
        Source: Source,
      }
      this.$store.dispatch('bagMeetings/AddSidebar', {
        GroupID,
        MeetingID,
        Sidebar,
      })
      this.SidebarReason = ''
      this.SidebarRequestedOf = {}
    },
    removeSidebar: function (Sidebar) {
      const GroupID = this.$route.params.groupid
      const MeetingID = this.$route.params.id
      this.$store.dispatch('bagMeetings/RemoveSidebar', {
        GroupID,
        MeetingID,
        Sidebar,
      })
    },
    setPreviousSidebarStatus: function (Sidebar, Status) {
      // is the status actually changing?
      if (Sidebar.Status === Status) {
        return
      }
      const GroupID = this.$route.params.groupid
      const MeetingID = this.$route.params.id
      this.$store.dispatch('bagMeetings/SetPreviousSidebarStatus', {
        GroupID,
        MeetingID,
        Sidebar,
        Status,
      })
    },
    viewGroup: function (groupID) {
      // redirect the UI to the group
      this.$router.push('/bag/group/' + groupID)
    },
    closeMeeting: function () {
      const GroupID = this.$route.params.groupid
      const MeetingID = this.$route.params.id
      // redirect the UI
      this.$router.push('/bag/meeting/close/' + GroupID + '/' + MeetingID)
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