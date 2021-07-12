<template>
  <v-container>
    <v-card>
      <v-card-title>CurrentUser</v-card-title>
      {{ CurrentUser }}
    </v-card>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  data() {
    return {}
  },

  computed: {
    ...mapState({
      CurrentUser: (state) => state.user.CurrentUser,
    }),
  },
}
</script>