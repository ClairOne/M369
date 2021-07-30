<!--
@LEFTOFF: working on the attendee assignment
-->
<template>
  <v-container>
    <v-card>
      <v-toolbar color="#602034" rounded class="mb-2 white--text">
        <v-toolbar-title>Sidebars</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <template v-if="PreviousSidebars && PreviousSidebars.length > 0">
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
              <tr v-for="(sidebar, index) in PreviousSidebars" :key="index">
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
        <template v-else>
          <p>
            <strong>No previous sidebars to carry into this meeting.</strong>
          </p>
        </template>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  data() {
    return {}
  },
  props: ['btnColor', 'btnTextColor', 'btnSize'],
  computed: {
    ...mapState({
      Group: (state) => state.bagGroups.Group,
      Meeting: (state) => state.bagMeetings.Meeting,
      Members: (state) => state.bagMembers.Members,
    }),
    Sidebars: function () {
      return this.Meeting.Sidebars
    },
    PreviousSidebars: function () {
      // let's attempt to build an array of the Members.CurrentSidebars
      const tmpSidebars = []
      const tmpMembers = this.Members
      // load up the sidebars from each Members.CurrentSidebars (careful of duplicates due to RequestedBy & RequestedOf)
      // loop through each Members
      console.log(
        'PreviousSidebars: looping through members:' + tmpMembers.length
      )
      tmpMembers.forEach((member) => {
        console.log('Sidebars: checking member:' + member.DisplayName)
        // if the member has CurrentSidebars
        if (member.CurrentSidebars && member.CurrentSidebars.length > 0) {
          console.log(
            'PreviousSidebars: found ' + member.CurrentSidebars.length
          )
          // loop through Member.CurrentSidebars
          member.CurrentSidebars.forEach((sidebar) => {
            console.log('PreviousSidebars: sidebar')
            console.log(sidebar)

            // check to see if it's already in the array
            let tmpSidebar = tmpSidebars.find(
              (element) =>
                element.RequestedBy.id === sidebar.RequestedBy.id &&
                element.RequestedOf.id === sidebar.RequestedOf.id &&
                element.Reason === sidebar.Reason
            )

            console.log('PreviousSidebars: Is is already in tmpSidebars?')
            console.log('PreviousSidebars:sidebar')
            console.log(sidebar)
            console.log('PreviousSidebars:tmpSidebar')
            console.log(tmpSidebar)
            if (!tmpSidebar) {
              console.log('PreviousSidebars: Not in tmpSidebars. Add it.')
              // now add it
              tmpSidebars.push(sidebar)
            } else {
              console.log(
                'PreviousSidebars: Yes, already in tmpSidebars. Skip It.'
              )
            }
          })
        }
      })
      // we've built the array, let's pass it back
      return tmpSidebars
    },
  },
  methods: {
    /*
        Resets this.Sidebars to what is stored in the Meeting OR
        collectively in the Group.Members.CurrentSidebars for each member.
      */
    xkcd: function () {},
    toggleAttendee: function (attendee) {
      if (!attendee || !attendee.Email) {
        return
      }
      const GroupID = this.Group.id
      const MeetingID = this.Meeting.id
      const Attendee = attendee
      if (this.IsAttending(attendee)) {
        this.$store.dispatch('bagMeetings/RemoveAttendee', {
          GroupID,
          MeetingID,
          Attendee,
        })
      } else {
        this.$store.dispatch('bagMeetings/AddAttendee', {
          GroupID,
          MeetingID,
          Attendee,
        })
      }
    },
  },
  mounted() {
    /*
       if the current meeting doesn't have any sidebars then let's check the Members
       for any sidebars in bagGroups.Members.CurrentSidebars
    */
    //this.loadSidebars()
  },
  beforeUpdate() {},
  updated() {},
}
</script>