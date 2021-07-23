<template>
  <v-container>
    <v-toolbar color="#602034" rounded class="mb-2 white--text">
      <v-spacer />
      <v-toolbar-title>{{ Group.Title }}</v-toolbar-title>
      <v-spacer />
    </v-toolbar>

    <v-sheet class="mx-auto pa-2" rounded elevation="3">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-card class="mt-6">
              <v-toolbar color="#01937c" class="white--text" dense>
                <v-icon color="white" class="mr-2"
                  >mdi-information-outline</v-icon
                >
                <v-toolbar-title>About</v-toolbar-title>
                <v-spacer></v-spacer>
                <EDITGROUPINFO
                  v-bind:Group="Group"
                  btnColor="white"
                  btnTextColor="#01937c"
                  btnSize="24"
                />
              </v-toolbar>
              <v-card-text>{{ Group.Description }}</v-card-text>
            </v-card>

            <v-card class="mt-6">
              <v-toolbar color="#01937c" class="white--text" dense>
                <v-icon color="white" class="mr-2"
                  >mdi-account-circle-outline</v-icon
                >
                <v-toolbar-title>Facilitators</v-toolbar-title>
                <v-spacer></v-spacer>
                <NEWMEMBER
                  :Group="Group"
                  :GroupID="GroupID"
                  btnColor="white"
                  btnTextColor="#01937c"
                  btnSize="24"
                />
              </v-toolbar>

              <v-card-text>
                <v-simple-table>
                  <tbody>
                    <tr
                      v-for="facilitator in Group.Facilitators"
                      :key="facilitator.id"
                    >
                      <td class="text-left">
                        <v-chip small color="success">{{
                          facilitator.Initials
                        }}</v-chip>
                      </td>
                      <td class="text-left">
                        {{ facilitator.DisplayName }}
                      </td>
                      <td class="text-right">
                        <!--
                        <EDITFACILITATOR
                          :Group="Group"
                          :Member="facilitator"
                          btnColor="white"
                          btnTextColor="info"
                          btnSize="24"
                        />
-->
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="8">
            <v-card class="mt-6">
              <v-toolbar color="#01937c" class="white--text" dense>
                <v-icon color="white" class="mr-2"
                  >mdi-account-group-outline</v-icon
                >
                <v-toolbar-title>Members</v-toolbar-title>
                <v-spacer></v-spacer>
                <NEWMEMBER
                  :Group="Group"
                  :GroupID="GroupID"
                  btnColor="white"
                  btnTextColor="#01937c"
                  btnSize="24"
                />
              </v-toolbar>
              <v-card-text>
                <v-simple-table>
                  <thead>
                    <tr>
                      <th class="text-center" width="10%">Initials</th>
                      <th class="text-left" width="30%">Display Name</th>
                      <th class="text-left" width="40%">Email</th>
                      <th class="text-right" width="20%"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="Member in Members" :key="Member.id">
                      <td class="text-center">
                        <v-chip small color="success">{{
                          Member.Initials
                        }}</v-chip>
                      </td>
                      <td class="text-left">
                        {{ Member.DisplayName }}
                      </td>
                      <td class="text-left">
                        {{ Member.Email }}
                      </td>
                      <td class="text-right">
                        <!--
                        <EDITMEMBER
                          :Group="Group"
                          :Member="Member"
                          btnColor="white"
                          btnTextColor="info"
                          btnSize="24"
                        />
-->
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-card-text>
            </v-card>
            <v-card class="mt-6">
              <v-toolbar color="#01937c" class="white--text" dense>
                <v-icon color="white" class="mr-2">mdi-forum-outline</v-icon>
                <v-toolbar-title>Open Meetings</v-toolbar-title>
                <v-spacer />
                <NEWMEETING
                  :Group="Group"
                  btnColor="white"
                  btnTextColor="#01937c"
                  btnSize="24"
                />
              </v-toolbar>
              <v-card-text>
                <v-simple-table>
                  <thead>
                    <tr>
                      <th class="text-left">Date/Time</th>
                      <th class="text-left">Facilitator</th>
                      <th class="text-center">Attendees</th>
                      <th class="text-right">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr v-for="meeting in Meetings" :key="meeting.id">
                      <td class="text-left">
                        {{ meeting.MeetingDate }}
                      </td>
                      <td class="text-left">
                        {{ meeting.Facilitator.DisplayName }}
                      </td>
                      <td class="text-center">
                        <span
                          v-if="
                            meeting.Attendees && meeting.Attendees.length > 0
                          "
                        >
                          {{ meeting.Attendees.length }}
                        </span>
                        <span v-else>0</span>
                      </td>
                      <td class="text-right">
                        <v-icon color="info" @click="viewMeeting(meeting.id)"
                          >mdi-arrow-right-circle</v-icon
                        >
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-sheet>
  </v-container>
</template>

<script>
/*
 @POSTRELEASE: Filter the meetings based on open status with a link to the complete meeting history
 */
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import EDITGROUPINFO from '../../../components/bag/group/editGroupInfo.vue'
import NEWMEETING from '../../../components/bag/group/newMeeting.vue'
import NEWMEMBER from '../../../components/bag/group/newMember.vue'
//import EDITMEMBER from '../../../components/bag/group/editMember.vue'
//import EDITFACILITATOR from '../../../components/bag/group/editFacilitator.vue'

export default {
  components: {
    EDITGROUPINFO,
    NEWMEETING,
    NEWMEMBER,
    //    EDITMEMBER,
    //    EDITFACILITATOR,
  },
  transition: 'fade',
  data() {
    return {
      error: null,
      GroupID: null,
    }
  },
  computed: {
    ...mapState({
      Group: (state) => state.bagGroups.Group,
      Meetings: (state) => state.bagMeetings.Meetings,
      Members: (state) => state.bagMembers.Members,
    }),
  },
  methods: {
    viewMeeting: function (meetingID) {
      // redirect the UI to the meeting
      this.$router.push('/bag/meet/' + this.$route.params.id + '/' + meetingID)
    },
  },
  mounted() {
    // in case we aren't connected yet
    //this.$store.dispatch('bagGroups/connect', false)
    let GroupID = this.$route.params.id
    this.GroupID = GroupID
    this.$store.dispatch('bagGroups/loadGroupListener', GroupID)
    this.$store.dispatch('bagMeetings/connect', GroupID)
    this.$store.dispatch('bagMembers/connect', GroupID)
  },
}
</script>