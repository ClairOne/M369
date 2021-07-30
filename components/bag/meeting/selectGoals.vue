<!--
@LEFTOFF: working on the attendee assignment
-->
<template>
  <v-container>
    <v-card>
      <v-toolbar color="#602034" rounded class="mb-2 white--text">
        <v-toolbar-title>Goals</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <template v-if="PreviousGoals && PreviousGoals.length > 0">
          <v-simple-table>
            <thead>
              <tr>
                <th class="text-center" width="10%">Member</th>
                <th class="text-center" width="10%">Status</th>
                <th class="text-center" width="80%">Goal</th>
                <th class="text-center">actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(goal, index) in PreviousGoals" :key="index">
                <td class="text-center">
                  <v-chip class="ma-2" color="success" outlined
                    >{{ goal.Member.DisplayName }}
                  </v-chip>
                </td>
                <td class="text-center">
                  <v-chip class="ma-2" color="success" outlined
                    >{{ goal.Status }}
                  </v-chip>
                </td>
                <td class="text-center">{{ goal.Title }}</td>
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
        <template v-else>
          <p>
            <strong>No previous goals to carry into this meeting.</strong>
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
  },
  methods: {
    Goals: function () {
      return this.Meeting.Goals
    },
    PreviousGoals: function () {
      // let's attempt to build an array of the Members.CurrentGoals
      const tmpGoals = []
      const tmpMembers = this.Members
      // load up the goals from each Members.CurrentGoals (careful of duplicates )
      // loop through each Members
      console.log('PreviousGoals: looping through members:' + tmpMembers.length)
      tmpMembers.forEach((member) => {
        console.log('Goals: checking member:' + member.DisplayName)
        // if the member has CurrentGoals
        if (member.CurrentGoals && member.CurrentGoals.length > 0) {
          console.log('PreviousGoals: found ' + member.CurrentGoals.length)
          // loop through Member.CurrentGoals
          member.CurrentGoals.forEach((goal) => {
            console.log('PreviousGoals: goal')
            console.log(goal)

            // check to see if it's already in the array
            let tmpGoal = tmpGoals.find((element) => element.id === goal.id)

            console.log('PreviousGoals: Is is already in tmpGoals?')
            console.log('PreviousGoals:goal')
            console.log(goal)
            console.log('PreviousGoals:tmpGoal')
            console.log(tmpGoal)
            if (!tmpGoal) {
              console.log('PreviousGoals: Not in tmpGoals. Add it.')
              // now add it
              tmpGoals.push(goal)
            } else {
              console.log('PreviousGoals: Yes, already in tmpGoals. Skip It.')
            }
          })
        }
      })
      // we've built the array, let's pass it back
      return tmpGoals
    },
    removeGoal: function (goal) {
      alert('removeGoal: GoalID' + goal.id)
    },
  },
  mounted() {},
  beforeUpdate() {},
  updated() {},
}
</script>