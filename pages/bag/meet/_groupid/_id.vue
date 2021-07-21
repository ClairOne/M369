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
            <MEETINGREPORT
              v-bind:Group="Group"
              v-bind:Meeting="Meeting"
              btnColor="white"
              btnTextColor="#01937c"
              btnSize="24"
            />
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
        </v-card>
        <v-card class="mx-auto" dense>
          <v-toolbar color="#602034" rounded class="mb-2 white--text" dense>
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
        <v-tabs
          v-model="selectedTab"
          background-color="#506a91"
          icons-and-text
          grow
          dark
        >
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
        <v-tabs-items v-model="selectedTab">
          <!-- Lows & Highs -->
          <v-tab-item>
            <v-container>
              <v-card dense flat class="mx-auto">
                <v-toolbar color="#a72f39" dark dense>
                  <v-toolbar-title>Highs &amp; Lows </v-toolbar-title>
                </v-toolbar>
                <v-container>
                  <v-row class="pl-5 pr-5">
                    <v-text-field
                      v-model="currentHigh"
                      label="High"
                      required
                    ></v-text-field>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="success"
                      class="ma-2 white--text"
                      @click="addHigh(true)"
                    >
                      <v-icon> mdi-arrow-up-box </v-icon>
                    </v-btn>
                    <v-btn
                      color="error"
                      class="ma-2 white--text"
                      @click="addHigh(false)"
                    >
                      <v-icon> mdi-arrow-down-box </v-icon>
                    </v-btn>
                  </v-row>
                </v-container>
              </v-card>

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
                          >{{ high.MemberInitials }}
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
            </v-container>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import MEETINGREPORT from '../../../../components/bag/meeting/report.vue'

export default {
  components: {
    MEETINGREPORT,
  },
  data() {
    return {
      goals: [
        {
          id: 51,
          Title: 'Goal #1',
          IsHigh: true,
          Member: { id: 8, Initials: 'DP' },
        },
        {
          id: 52,
          Title: 'Goal #2',
          IsHigh: true,
          Member: { id: 7, Initials: 'CA' },
        },
        {
          id: 53,
          Title: 'Goal #3',
          IsHigh: false,
          Member: { id: 2, Initials: 'OB' },
        },
      ],
      sidebars: [
        {
          id: 41,
          Reason: 'SB reason',
          IsHigh: false,
          RequestedBy: { id: 2, Initials: 'OB' },
          RequestedOf: { id: 8, Initials: 'DP' },
        },
        {
          id: 42,
          Reason: 'SB reason',
          IsHigh: false,
          RequestedBy: { id: 7, Initials: 'CA' },
          RequestedOf: { id: 8, Initials: 'DP' },
        },
        {
          id: 43,
          Reason: 'SB reason',
          IsHigh: false,
          RequestedBy: { id: 2, Initials: 'OB' },
          RequestedOf: { id: 7, Initials: 'CA' },
        },
      ],
      selectedTab: [],
      selectedAttendeeIndex: {},

      currentHigh: [],
      currentGoal: [],
      currentSidebar: [],
    }
  },
  computed: {
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
    ...mapState({
      Group: (state) => state.bagGroups.Group,
      Meeting: (state) => state.bagMeetings.Meeting,
    }),

    /*
    Return a list of highs filtered based on the selected member
    if no member is selected return the full list of highs
*/
    attendeeHighs() {
      // should we filter or return them all?
      if (!this.selectedAttendee || !this.selectedAttendee.Email) {
        // no Email, return them all
        return this.Meeting.Highs
      }

      // use this.Meeting.Highs which is the full list
      let tmpHighs = this.Meeting.Highs

      tmpHighs = tmpHighs.filter((item) => {
        return item.MemberEmail == this.selectedAttendee.Email
      })
      return tmpHighs
    },

    filteredGoals() {
      return []
      // should we filter or return them all?
      if (!this.currentMember || !this.currentMember.id) {
        return this.goals
      }

      // use this.Highs which is the full list
      let tmpGoals = this.goals

      tmpGoals = tmpGoals.filter((item) => {
        return item.Member.id == this.currentMember.id
      })
      return tmpGoals
    },
    filteredSidebars() {
      return []
      // should we filter or return them all?
      if (!this.currentMember || !this.currentMember.id) {
        return this.sidebars
      }

      // use this.Highs which is the full list
      let tmpSidebars = this.sidebars

      tmpSidebars = tmpSidebars.filter((item) => {
        return (
          item.RequestedBy.id == this.currentMember.id ||
          item.RequestedOf.id == this.currentMember.id
        )
      })
      return tmpSidebars
    },
  },
  methods: {
    addHigh: function (IsHigh) {
      //console.log('<!-- method:addHigh:' + IsHigh)
    },
    viewGroup: function (groupID) {
      // redirect the UI to the group
      this.$router.push('/bag/group/' + groupID)
    },
  },
  async mounted() {
    const GroupID = this.$route.params.groupid
    const MeetingID = this.$route.params.id
    // listen to the Group document
    this.$store.dispatch('bagGroups/loadGroupListener', GroupID)
    // listen to the Meeting document
    this.$store.dispatch('bagMeetings/loadMeetingListener', {
      GroupID,
      MeetingID,
    })
  },
  async fetch({ store }) {},
}
</script>