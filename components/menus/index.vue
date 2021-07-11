<template>
  <div>
    <v-menu rounded="b-lg" offset-y>
      <template v-slot:activator="{ attrs, on }">
        <v-avatar color="primary" size="36" v-bind="attrs" v-on="on">
          <span class="white--text text-h5"
            ><v-icon color="white">mdi-account</v-icon></span
          >
        </v-avatar>
      </template>

      <v-list>
        <v-list-item v-for="(item, index) in items" :key="index">
          <v-list-item-title
            ><NuxtLink :to="item.link">{{
              item.title
            }}</NuxtLink></v-list-item-title
          >
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>
<script>
export default {
  data: () => ({
    items: [
      { title: 'My Profile', link: '/user/profile' },
      { title: 'Logout', link: '/logout' },
    ],
  }),
}
</script>