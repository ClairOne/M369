<template>
  <v-container>
    <v-toolbar color="#602034" rounded class="mb-2 white--text">
      <v-toolbar-title
        >P.R.I.M.E.R. Goal Planning: <strong>Evaluate</strong></v-toolbar-title
      >
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-container fluid>
      <v-list>
        <v-list-item v-for="(item, index) in primerLinks" :key="index">
          <v-list-item-title
            ><NuxtLink :to="item.link">{{
              item.title
            }}</NuxtLink></v-list-item-title
          >
        </v-list-item>
      </v-list>
    </v-container>
  </v-container>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  components: {},
  transition: 'fade',
  data() {
    return {
      dialog: false,
      primerLinks: [
        {
          title: 'P - PINPOINT YOUR HIGHEST-PRIORITY AMBITIONS',
          link: '/goals/pinpoint',
        },
        { title: 'R - REFINE YOUR DESIRED OUTCOMES', link: '/goals/refine' },
        {
          title: "I - IDENTIFY THE ACTIONS YOU'LL NEED TO TAKE",
          link: '/goals/identify',
        },
        {
          title: 'M - MODIFY YOUR ENVIRONMENT TO COMPLEMENT YOUR GOALS',
          link: '/goals/modify',
        },
        { title: 'E - EVALUATE YOUR PROGRESS', link: '/goals/evaluate' },
        { title: 'R - REVISIT YOUR GOALS', link: '/goals/revisit' },
      ],
    }
  },
  computed: {
    ...mapState({}),
  },
  methods: {},
  mounted() {},
}
</script>