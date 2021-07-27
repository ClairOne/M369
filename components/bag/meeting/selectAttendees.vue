<!--
@LEFTOFF: working on the attendee assignment
-->
<template>
  <v-container>
    <v-card>
      <v-toolbar color="#602034" rounded class="mb-2 white--text">
        <v-toolbar-title>Attendees</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-simple-table>
          <thead>
            <tr>
              <th class="text-left" width="20%"></th>
              <th class="text-left" width="40%">Attendee</th>
              <th class="text-left" width="40%">Email</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(member, index) in Members">
              <tr :key="index" @click="toggleAttendee(member)">
                <td class="text-center">
                  <v-icon v-if="IsAttending(member)"> mdi-check </v-icon>
                </td>
                <td class="text-left">
                  {{ member.FirstName }}&nbsp;{{ member.LastName }}
                </td>
                <td class="text-left">{{ member.Email }}</td>
              </tr>
            </template>
          </tbody>
        </v-simple-table>
        <h3>Group Members</h3>
        {{ Members }}
        <v-divider />
        <h3>Attendees</h3>
        {{ Meeting.Attendees }}
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
  },
  methods: {
    IsAttending: function (attendee) {
      if (!attendee || !attendee.Email) {
        return false
      }
      if (
        !this.Meeting ||
        !this.Meeting.Attendees ||
        this.Meeting.Attendees.length === 0
      ) {
        return false
      }
      // is the attendee in the Meetings.Attendees array?
      let tmpAttendee = this.Meeting.Attendees.find(
        (element) => element.Email === attendee.Email
      )
      if (tmpAttendee) {
        return true
      }
      return false
    },
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
  mounted() {},
  beforeUpdate() {},
  updated() {},
}
</script>