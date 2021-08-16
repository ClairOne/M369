<template>
  <v-container>
    <v-toolbar color="#602034" rounded class="mb-2 white--text">
      <v-toolbar-title>P.R.I.M.E.R. Goal Planning</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn-toggle v-model="toggle_exclusive">
        <v-btn v-for="(item, index) in primerLinks" :key="index">
          <NuxtLink :to="item.link"
            ><v-icon>{{ item.Icon }}</v-icon></NuxtLink
          >
        </v-btn>
      </v-btn-toggle>
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
          Icon: 'mdi-alpha-p-circle-outline',
        },
        {
          title: 'R - REFINE YOUR DESIRED OUTCOMES',
          link: '/goals/refine',
          Icon: 'mdi-alpha-r-circle-outline',
        },
        {
          title: "I - IDENTIFY THE ACTIONS YOU'LL NEED TO TAKE",
          link: '/goals/identify',
          Icon: 'mdi-alpha-i-circle-outline',
        },
        {
          title: 'M - MODIFY YOUR ENVIRONMENT TO COMPLEMENT YOUR GOALS',
          link: '/goals/modify',
          Icon: 'mdi-alpha-m-circle-outline',
        },
        {
          title: 'E - EVALUATE YOUR PROGRESS',
          link: '/goals/evaluate',
          Icon: 'mdi-alpha-e-circle-outline',
        },
        {
          title: 'R - REVISIT YOUR GOALS',
          link: '/goals/revisit',
          Icon: 'mdi-alpha-p-circle-outline',
        },
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