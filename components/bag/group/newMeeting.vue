<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-avatar :color="btnColor" :size="btnSize" v-bind="attrs" v-on="on">
        <span><v-icon :color="btnTextColor">mdi-plus</v-icon></span>
      </v-avatar>
    </template>
    <v-card>
      <v-toolbar color="#602034" rounded class="mb-2 white--text">
        <v-toolbar-title
          >Start BAG Meeting for {{ group.Title }}</v-toolbar-title
        >
      </v-toolbar>
      <v-card-text>
        <v-form ref="newMeeting" v-model="valid">
          <v-card>
            <v-card-title>New Meeting ({{ valid }})</v-card-title>
            <v-card-text>
              <v-row>
                <v-spacer />

                <v-col cols="12" sm="5">
                  <v-dialog
                    ref="dialogDate"
                    v-model="modalDatePicker"
                    :return-value.sync="MeetingDate"
                    persistent
                    width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="MeetingDate"
                        label="Meeting Date"
                        prepend-icon="mdi-calendar"
                        :rules="rulesMeetingDate"
                        readonly
                        required
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-if="modalDatePicker"
                      v-model="MeetingDate"
                      full-width
                    >
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        color="primary"
                        @click="modalDatePicker = false"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.dialogDate.save(MeetingDate)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-dialog>
                  <v-dialog
                    ref="dialogTime"
                    v-model="modalTimePicker"
                    :return-value.sync="MeetingTime"
                    persistent
                    width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="MeetingTime"
                        label="Meeting Time"
                        prepend-icon="mdi-clock-time-four-outline"
                        :rules="rulesMeetingTime"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-if="modalTimePicker"
                      v-model="MeetingTime"
                      scrollable
                      format="24hr"
                      full-width
                    >
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        color="primary"
                        @click="modalTimePicker = false"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.dialogTime.save(MeetingTime)"
                      >
                        OK
                      </v-btn>
                    </v-time-picker>
                  </v-dialog>
                </v-col>
                <v-spacer />
                <v-col cols="12" sm="5">
                  <v-select
                    v-model="Facilitator"
                    :items="group.Facilitators"
                    item-text="DisplayName"
                    item-value="id"
                    return-object
                    :rules="rulesFacilitator"
                    label="Facilitator"
                    outlined
                  ></v-select>
                  <v-select
                    v-model="Attendees"
                    :items="group.Members"
                    item-text="DisplayName"
                    item-value="id"
                    return-object
                    :rules="rulesAttendees"
                    chips
                    label="Attendees"
                    multiple
                    outlined
                  ></v-select>
                </v-col>
                <v-spacer />
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn @click="reset()" color="warning">Reset</v-btn>
              <v-btn :disabled="!valid" color="primary" @click="save()">
                Save
              </v-btn>
              <v-btn text @click="dialog = false"> Cancel </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  data() {
    return {
      dialog: false,
      valid: false,
      modalDatePicker: false,
      modalTimePicker: false,
      MeetingDate: '',
      MeetingTime: '',
      Facilitator: {},
      Attendees: [],
      rulesMeetingDate: [(v) => !!v || 'Choose a date for the meeting.'],
      rulesMeetingTime: [(v) => !!v || 'Choose a time for the meeting.'],
      rulesFacilitator: [
        (v) => (v && !!v.DisplayName) || 'Select a Facilitator',
      ],
      rulesAttendees: [(v) => v.length > 0 || 'Select at least 1 Attendee'],
    }
  },
  props: ['group', 'btnColor', 'btnTextColor', 'btnSize'],
  computed: {
    ...mapGetters(['CurrentUser']),
    MeetingDateTime() {
      // at some point we'll need to accommodate for time zone stuff
      // so I'm throwing this in here to stub in where that might go
      if (!this.MeetingDate) {
        return false
      }
      if (!this.MeetingTime) {
        return false
      }
      return this.MeetingDate + ' ' + this.MeetingTime
    },
    Meeting() {
      let tmpM = {}
      tmpM.MeetingDate = this.MeetingDate
      tmpM.MeetingTime = this.MeetingTime
      tmpM.MeetingDateTime = this.MeetingDateTime
      tmpM.Facilitator = this.Facilitator
      tmpM.Attendees = this.Attendees
      return tmpM
    },
  },
  methods: {
    async save() {
      // validate everything
      if (!this.valid) {
        alert('All the info is required.')
        return false
      }
      // create the record
      let GroupID = this.group.id
      let Meeting = this.Meeting

      console.log(Meeting)
      this.$store.dispatch('bagGroups/bagGroupMeetingAdd', {
        GroupID,
        Meeting,
      })

      this.reset()
      this.dialog = false
    },
    cancel() {
      // reset the form
      this.$refs.newMeeting.reset()
      // close the dialog
      this.dialog = false
      return
    },
    reset() {
      this.$refs.newMeeting.reset()
      return
    },
  },
}
</script>