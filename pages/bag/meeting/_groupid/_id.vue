<template>
  <v-container fluid>
    <h3>Loading the meeting...</h3>
    <p>This is the magic redirector based on the meeting Status</p>
    <p>{{ meetingStatus }}</p>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  components: {},
  data() {
    return {}
  },
  computed: {
    ...mapState({
      Group: (state) => state.bagGroups.Group,
      Meeting: (state) => state.bagMeetings.Meeting,
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
        //this.$router.push('/bag/meeting/report/' + GroupID + '/' + MeetingID)
      }

      // is it started?
      if (this.Meeting.StartedAt) {
        return 'Running'
        //this.$router.push('/bag/meeting/run/' + GroupID + '/' + MeetingID)
      }

      // it isn't running or started so it's scheduled
      if (!this.Meeting.StartedAt && !this.Meeting.ClosedAt) {
        return 'Scheduled'
        //this.$router.push('/bag/meeting/start/' + GroupID + '/' + MeetingID)
      }
    },
  },
  methods: {},
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