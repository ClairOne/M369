<template>
  <v-container>
    <v-toolbar color="#602034" rounded class="mb-2 white--text">
      <v-toolbar-title>{{ GroupCount }} BAG Groups</v-toolbar-title>
      <v-spacer></v-spacer>
      <NEWGROUP btnColor="white" btnTextColor="#01937c" btnSize="24" />
    </v-toolbar>
    <v-container fluid>
      <v-simple-table>
        <thead>
          <tr>
            <th class="text-left">Icon</th>
            <th class="text-left">Group</th>
            <th class="text-left">Member</th>
            <th class="text-left">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="group in Groups"
            :key="group.id"
            @click="viewGroup(group.id)"
          >
            <td class="text-left">
              <v-icon>{{ group.Icon }}</v-icon>
            </td>
            <td class="text-left">
              {{ group.Title }}
            </td>
            <td class="text-left">
              <span v-if="group.Members">{{ group.Members.length }}</span>
              <span v-else>0</span>
            </td>
            <td class="text-left">
              {{ group.Description }}
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-container>
  </v-container>
</template>
  </v-container>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import NEWGROUP from '../../components/bag/group/newGroup.vue'

export default {
  components: {
    NEWGROUP,
  },
  transition: 'fade',
  data() {
    return {
      dialog: false,
    }
  },
  computed: {
    ...mapState({
      Groups: (state) => state.bagGroups.Groups,
    }),
    GroupCount() {
      return this.Groups.length
    },
  },
  methods: {
    viewGroup: function (groupID) {
      // redirect the UI to the group
      //this.$router.push('/bag/group/' + groupID)
    },
  },
  mounted() {
    this.$store.dispatch('bagGroups/groupsConnect', false)
  },
}
</script>