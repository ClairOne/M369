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
              <v-tab> Goals </v-tab>
              <v-tab> Sidebars </v-tab>
              <v-tab> Roadblocks </v-tab>
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
                  <v-spacer></v-spacer>
                  <span v-if="selectedAttendee">{{
                    selectedAttendee.DisplayName
                  }}</span>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                  <v-card class="mb-5" rounded>
                    <v-card-text>
                      <v-overlay
                        absolute="true"
                        :value="!selectedAttendee || !selectedAttendee.Email"
                      >
                        <h3>Select an attendee</h3>
                      </v-overlay>
                      <v-row>
                        <v-col cols="9">
                          <v-text-field
                            v-model="HighTitle"
                            label="High"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="3" class="text-center">
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
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
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
                </v-card-text>
              </v-card>
            </v-tab-item>
            <!-- /Highs -->
            <!-- Goals -->
            <v-tab-item>
              <v-card class="mx-auto">
                <v-toolbar color="#a72f39" dark dense>
                  <v-toolbar-title>Goals</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <span v-if="selectedAttendee">{{
                    selectedAttendee.DisplayName
                  }}</span>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                  <v-card class="mb-5" rounded>
                    <v-card-text>
                      <v-overlay
                        absolute="true"
                        :value="!selectedAttendee || !selectedAttendee.Email"
                      >
                        <h3>Select an attendee</h3>
                      </v-overlay>
                      <v-row>
                        <v-col cols="10">
                          <v-text-field
                            v-model="GoalTitle"
                            label="New Goal"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="2" class="text-center">
                          <v-btn
                            color="primary"
                            class="ma-2 white--text"
                            @click="addGoal()"
                            :disabled="!validNewGoal"
                          >
                            <v-icon> mdi-arrow-down-box </v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                  <v-row>
                    <v-col cols="12" md="6">
                      <h2>Previous</h2>
                      <v-simple-table v-if="attendeePreviousGoals.length > 0">
                        <thead>
                          <tr>
                            <th class="text-center" width="30%">Member</th>
                            <th class="text-left pa-0" width="70%">
                              Previous Goal
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <template>
                            <tr
                              v-for="(goal, index) in attendeePreviousGoals"
                              :key="index"
                            >
                              <td colspan="2" class="pa-0">
                                <v-simple-table dense>
                                  <tr>
                                    <td class="text-center" width="30%">
                                      <v-chip
                                        class="my-2"
                                        color="success"
                                        outlined
                                        >{{ goal.Member.Initials }}
                                      </v-chip>
                                    </td>
                                    <td class="text-left" width="70%">
                                      {{ goal.Title }}
                                      <v-spacer />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td width="20%"></td>
                                    <td class="text-left">
                                      <v-tooltip bottom>
                                        <template
                                          v-slot:activator="{ on, attrs }"
                                        >
                                          <v-chip
                                            v-bind="attrs"
                                            v-on="on"
                                            class="my-2"
                                            color="success"
                                            :outlined="
                                              !IsStatusMatch(
                                                goal.Status,
                                                'Complete'
                                              )
                                            "
                                            @click="
                                              setPreviousGoalStatus(
                                                goal,
                                                'Complete'
                                              )
                                            "
                                          >
                                            <v-icon> mdi-check </v-icon>
                                          </v-chip>
                                        </template>
                                        <span
                                          v-if="
                                            IsStatusMatch(
                                              goal.Status,
                                              'Complete'
                                            )
                                          "
                                          >Completed</span
                                        >
                                        <span v-else>Mark Complete</span>
                                      </v-tooltip>
                                      <v-tooltip bottom>
                                        <template
                                          v-slot:activator="{ on, attrs }"
                                        >
                                          <v-chip
                                            v-bind="attrs"
                                            v-on="on"
                                            class="mx-4 my-2"
                                            color="warning"
                                            :outlined="
                                              !IsStatusMatch(
                                                goal.Status,
                                                'Ongoing,Carryover'
                                              )
                                            "
                                            @click="carryoverPreviousGoal(goal)"
                                          >
                                            <v-icon>
                                              mdi-application-export
                                            </v-icon>
                                          </v-chip>
                                        </template>
                                        <span
                                          v-if="
                                            IsStatusMatch(
                                              goal.Status,
                                              'Ongoing,Carryover'
                                            )
                                          "
                                          >Ongoing</span
                                        >
                                        <span v-else>Mark Ongoing</span>
                                      </v-tooltip>

                                      <v-tooltip bottom>
                                        <template
                                          v-slot:activator="{ on, attrs }"
                                        >
                                          <v-chip
                                            v-bind="attrs"
                                            v-on="on"
                                            class="my-2"
                                            color="error"
                                            :outlined="
                                              !IsStatusMatch(
                                                goal.Status,
                                                'Cancelled'
                                              )
                                            "
                                            @click="
                                              setPreviousGoalStatus(
                                                goal,
                                                'Cancelled'
                                              )
                                            "
                                          >
                                            <v-icon> mdi-cancel </v-icon>
                                          </v-chip>
                                        </template>
                                        <span
                                          v-if="
                                            IsStatusMatch(
                                              goal.Status,
                                              'Cancelled'
                                            )
                                          "
                                          >Cancelled</span
                                        >
                                        <span v-else>Mark Cancelled</span>
                                      </v-tooltip>
                                    </td>
                                  </tr>
                                </v-simple-table>
                              </td>
                            </tr>
                          </template>
                        </tbody>
                      </v-simple-table>
                    </v-col>
                    <v-col cols="12" md="6">
                      <h2>Current</h2>
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
                          <tr
                            v-for="(goal, index) in attendeeGoals"
                            :key="index"
                          >
                            <td class="text-center">
                              <v-chip class="ma-2" color="success" outlined
                                >{{ goal.Member.Initials }}
                              </v-chip>
                            </td>
                            <td class="text-center">
                              <v-icon
                                v-if="goal.Status === 'Carryover'"
                                color="warning"
                              >
                                mdi-application-import
                              </v-icon>
                              <v-icon v-else-if="goal.Status === 'New'">
                                mdi-new-box
                              </v-icon>
                              <v-icon v-else> mdi-question </v-icon>
                            </td>
                            <td class="text-left">
                              {{ goal.Title }}
                              <v-spacer />
                            </td>
                            <td class="text-center">
                              <v-chip
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
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <!-- /Goals -->
            <!-- Sidebars -->
            <v-tab-item>
              <v-card class="mx-auto">
                <v-toolbar color="#a72f39" dark dense>
                  <v-toolbar-title>Sidebars</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <span v-if="selectedAttendee">{{
                    selectedAttendee.DisplayName
                  }}</span>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                  <v-card class="mb-5" rounded>
                    <v-card-text>
                      <v-overlay
                        absolute="true"
                        :value="!selectedAttendee || !selectedAttendee.Email"
                      >
                        <h3>Select an attendee</h3>
                      </v-overlay>
                      <v-row>
                        <v-col cols="5">
                          <v-select
                            v-model="SidebarRequestedOf"
                            :items="Meeting.Attendees"
                            label="Requested Of"
                            item-text="DisplayName"
                            item-value="Email"
                            return-object
                            single-line
                          ></v-select>
                        </v-col>
                        <v-col cols="5">
                          <v-text-field
                            v-model="SidebarReason"
                            label="Reason"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="2" class="text-center">
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
                    </v-card-text>
                  </v-card>
                  <v-row>
                    <v-col cols="12" md="6">
                      <h2>Previous</h2>
                      <v-simple-table>
                        <thead>
                          <tr>
                            <th class="text-center" width="20%">By</th>
                            <th class="text-center" width="20%">Of</th>
                            <th width="60%">Reason</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(sidebar, index) in attendeePreviousSidebars"
                            :key="index"
                          >
                            <td colspan="3" class="pa-0">
                              <v-simple-table
                                dense
                                id="attendeePreviousSidebars-index"
                              >
                                <tr>
                                  <td class="text-center" width="20%">
                                    <v-chip
                                      class="my-2"
                                      color="success"
                                      outlined
                                      >{{ sidebar.RequestedBy.Initials }}
                                    </v-chip>
                                  </td>
                                  <td class="text-center" width="20%">
                                    <v-chip
                                      class="my-2"
                                      color="success"
                                      outlined
                                      >{{ sidebar.RequestedOf.Initials }}
                                    </v-chip>
                                  </td>
                                  <td class="text-left" width="60%">
                                    {{ sidebar.Reason }}
                                  </td>
                                </tr>
                                <tr>
                                  <td colspan="2"></td>
                                  <td class="text-left">
                                    <v-tooltip bottom>
                                      <template
                                        v-slot:activator="{ on, attrs }"
                                      >
                                        <v-chip
                                          v-bind="attrs"
                                          v-on="on"
                                          class="ma-2"
                                          color="success"
                                          :outlined="
                                            !IsStatusMatch(
                                              sidebar.Status,
                                              'Complete'
                                            )
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
                                        v-if="
                                          IsStatusMatch(
                                            sidebar.Status,
                                            'Complete'
                                          )
                                        "
                                        >Completed</span
                                      >
                                      <span v-else>Mark Complete</span>
                                    </v-tooltip>

                                    <v-tooltip bottom>
                                      <template
                                        v-slot:activator="{ on, attrs }"
                                      >
                                        <v-chip
                                          v-bind="attrs"
                                          v-on="on"
                                          class="mx-4 my-2"
                                          color="warning"
                                          :outlined="
                                            !IsStatusMatch(
                                              sidebar.Status,
                                              'Ongoing,Carryover'
                                            )
                                          "
                                          @click="
                                            carryoverPreviousSidebar(sidebar)
                                          "
                                        >
                                          <v-icon>
                                            mdi-application-export
                                          </v-icon>
                                        </v-chip>
                                      </template>
                                      <span
                                        v-if="
                                          IsStatusMatch(
                                            sidebar.Status,
                                            'Ongoing,Carryover'
                                          )
                                        "
                                        >Ongoing</span
                                      >
                                      <span v-else>Mark Ongoing</span>
                                    </v-tooltip>

                                    <v-tooltip bottom>
                                      <template
                                        v-slot:activator="{ on, attrs }"
                                      >
                                        <v-chip
                                          v-bind="attrs"
                                          v-on="on"
                                          class="ma-2"
                                          color="error"
                                          :outlined="
                                            !IsStatusMatch(
                                              sidebar.Status,
                                              'Cancelled'
                                            )
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
                                          IsStatusMatch(
                                            sidebar.Status,
                                            'Cancelled'
                                          )
                                        "
                                        >Cancelled</span
                                      >
                                      <span v-else>Mark Cancelled</span>
                                    </v-tooltip>
                                  </td>
                                </tr>
                              </v-simple-table>
                            </td>
                          </tr>
                        </tbody>
                      </v-simple-table>
                    </v-col>
                    <v-col cols="12" md="6">
                      <h2>Current</h2>
                      <v-simple-table>
                        <thead>
                          <tr>
                            <th class="text-left" width="20%">By</th>
                            <th class="text-left" width="20%">Of</th>
                            <th width="60%">Reason</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(sidebar, index) in attendeeSidebars"
                            :key="index"
                          >
                            <td colspan="3" class="pa-0">
                              <v-simple-table dense>
                                <td class="text-center" width="20%">
                                  <v-chip class="my-2" color="success" outlined
                                    >{{ sidebar.RequestedBy.Initials }}
                                  </v-chip>
                                </td>
                                <td class="text-center" width="20%">
                                  <v-chip class="my-2" color="success" outlined
                                    >{{ sidebar.RequestedOf.Initials }}
                                  </v-chip>
                                </td>
                                <td class="text-left" width="60%">
                                  {{ sidebar.Reason }}
                                </td>
                                <tr>
                                  <td class="text-center" colspan="2">
                                    <v-icon
                                      v-if="sidebar.Status === 'New'"
                                      color="blue"
                                    >
                                      mdi-new-box
                                    </v-icon>
                                    <v-icon
                                      color="warning"
                                      v-else-if="sidebar.Status === 'Carryover'"
                                    >
                                      mdi-application-import
                                    </v-icon>
                                    <v-icon v-else> mdi-question </v-icon>
                                  </td>
                                  <td class="text-center">
                                    <v-chip
                                      class="ma-2"
                                      color="error"
                                      outlined
                                      @click="removeSidebar(sidebar)"
                                    >
                                      <v-icon> mdi-trash-can </v-icon>
                                    </v-chip>
                                  </td>
                                </tr>
                              </v-simple-table>
                            </td>
                          </tr>
                        </tbody>
                      </v-simple-table>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <!-- /Sidebars -->
            <!-- Roadblocks -->
            <v-tab-item>
              <v-card class="mx-auto">
                <v-toolbar color="#a72f39" dark dense>
                  <v-toolbar-title>Roadblocks</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <span v-if="selectedAttendee">{{
                    selectedAttendee.DisplayName
                  }}</span>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                  <v-card class="mb-5" rounded>
                    <v-card-text>
                      <v-overlay
                        absolute="true"
                        :value="!selectedAttendee || !selectedAttendee.Email"
                      >
                        <h3>Select an attendee</h3>
                      </v-overlay>
                      <v-row>
                    <v-col cols="10">
                      <v-text-field
                        v-model="RoadblockTitle"
                        label="Roadblock"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="2" class="text-center">
                      <v-btn
                        color="primary"
                        class="ma-2 white--text"
                        @click="addRoadblock()"
                        :disabled="!validNewRoadblock"
                      >
                        <v-icon> mdi-arrow-down-box </v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                    </v-card-text>
                  </v-card>
                    <v-simple-table>
                      <thead>
                        <tr>
                          <th class="text-center" width="10%">Member</th>
                          <th class="text-center" width="10%">Status</th>
                          <th class="text-left" width="50%">Roadblock</th>
                          <th class="text-center">actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(roadblock, index) in attendeeRoadblocks"
                          :key="index"
                        >
                          <td class="text-center">
                            <v-chip class="ma-2" color="success" outlined
                              >{{ roadblock.Member.Initials }}
                            </v-chip>
                          </td>
                          <td class="text-center">{{ roadblock.Status }}</td>
                          <td class="text-left">
                            {{ roadblock.Title }}
                            <v-spacer />
                          </td>
                          <td class="text-center">
                            <v-chip
                              class="ma-2"
                              color="error"
                              outlined
                              @click="removeRoadblock(roadblock)"
                            >
                              <v-icon> mdi-trash-can </v-icon>
                            </v-chip>
                          </td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <!-- /Roadblocks -->
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
      selectedTab: 2,
      selectedAttendeeIndex: {},

      HighTitle: '',
      GoalTitle: '',
      SidebarReason: '',
      SidebarRequestedOf: {},
      RoadblockTitle: '',
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
    attendeeRoadblocks() {
      // are there any Roadblocks in the Meeting, yet?
      if (!this.Meeting.Roadblocks || this.Meeting.Roadblocks.length === 0) {
        return []
      }
      // should we filter or return them all?
      if (!this.selectedAttendee || !this.selectedAttendee.Email) {
        // no Email, return them all
        return this.Meeting.Roadblocks
      }

      // use this.Roadblocks which is the full list
      let tmpRoadblocks = this.Meeting.Roadblocks

      tmpRoadblocks = tmpRoadblocks.filter((item) => {
        return item.Member.Email == this.selectedAttendee.Email
      })
      return tmpRoadblocks
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
    validNewRoadblock() {
      // use a negative trap approach for simplicity (@TODO: convert to using form validation)
      if (!this.selectedAttendee || !this.selectedAttendee.Email) {
        return false
      }
      if (!this.RoadblockTitle.length > 0) {
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
      if (!Status) {
        return false
      }
      // this won't work if we add Incomplete since Complete would also match
      if (Match.includes(Status)) {
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
        SourceType: 'bagMeeting',
        Source: MeetingID,
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
    carryoverPreviousGoal: function (pGoal) {
      const GroupID = this.$route.params.groupid
      const MeetingID = this.$route.params.id
      const Status = 'Carryover'
      const Goal = { ...pGoal }

      // set the previous goal status to 'Carryover'
      this.$store.dispatch('bagMeetings/SetPreviousGoalStatus', {
        GroupID,
        MeetingID,
        Goal,
        Status,
      })

      Goal.Status = 'Carryover'
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
      if (Goal.Status === 'Carryover') {
        const Status = ''
        // set the previous goal status to ''
        this.$store.dispatch('bagMeetings/SetPreviousGoalStatus', {
          GroupID,
          MeetingID,
          Goal,
          Status,
        })
      }
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
    carryoverPreviousSidebar: function (pSidebar) {
      const GroupID = this.$route.params.groupid
      const MeetingID = this.$route.params.id
      const Status = 'Carryover'
      const Sidebar = { ...pSidebar }

      // set the previous Sidebar status to 'Carryover'
      this.$store.dispatch('bagMeetings/SetPreviousSidebarStatus', {
        GroupID,
        MeetingID,
        Sidebar,
        Status,
      })

      Sidebar.Status = 'Carryover'
      // add the sidebar to Sidebars
      this.$store.dispatch('bagMeetings/AddSidebar', {
        GroupID,
        MeetingID,
        Sidebar,
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
    addRoadblock: function () {
      if (!this.validNewRoadblock) {
        return
      }
      const GroupID = this.$route.params.groupid
      const MeetingID = this.$route.params.id
      const Attendee = this.selectedAttendee
      // build the Roadblock
      const Roadblock = {
        Member: Attendee,
        Title: this.RoadblockTitle,
        SourceType: 'bagMeeting',
        Source: MeetingID,
      }
      this.$store.dispatch('bagMeetings/AddRoadblock', {
        GroupID,
        MeetingID,
        Roadblock,
      })
      // reset the form
      this.RoadblockTitle = ''
    },
    removeRoadblock: function (roadblock) {
      const GroupID = this.$route.params.groupid
      const MeetingID = this.$route.params.id
      const Roadblock = roadblock

      this.$store.dispatch('bagMeetings/RemoveRoadblock', {
        GroupID,
        MeetingID,
        Roadblock,
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