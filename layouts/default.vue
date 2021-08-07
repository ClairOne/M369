<template>
  <v-app>
    <v-navigation-drawer
      v-if="CurrentUser"
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      bottom
      app
    >
      <v-list>
        <v-list-item @click.stop="miniVariant = !miniVariant">
          <v-list-item-action>
            <v-icon
              >mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon
            >
          </v-list-item-action>
        </v-list-item>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      class="no-print"
      color="black"
      :clipped-left="clipped"
      fixed
      app
      dense
      dark
    >
      <v-app-bar-nav-icon
        v-if="CurrentUser"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <M369Logo size="56" />
      <v-spacer />
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <USERMENU />
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <Nuxt />
      </v-container>
    </v-main>

    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

import USERMENU from '../components/menus/index.vue'
export default {
  components: {
    USERMENU,
  },
  data() {
    return {
      clipped: true,
      drawer: false,
      fixed: true,
      items: [
        {
          icon: 'mdi-home',
          title: 'Dashboard',
          to: '/',
        },
        {
          icon: 'mdi-car-turbocharger',
          title: 'Accountability',
          to: '/bag',
        },
        {
          icon: 'mdi-wrench',
          title: 'FTN',
          to: '/ftn',
        },
        {
          icon: 'mdi-point-of-sale',
          title: 'Zero To One',
          to: '/zto',
        },
      ],
      miniVariant: false,
      title: 'M369',
    }
  },
  computed: {
    ...mapState({
      CurrentUser: (state) => state.user.CurrentUser,
    }),
  },
}
</script>
<style scoped>
@media print {
  .no-print,
  .no-print * {
    display: none !important;
  }
}
</style>