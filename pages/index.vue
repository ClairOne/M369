<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card class="logo py-4 d-flex justify-center">
        <M369Logo size="128" />
      </v-card>
      <v-card>
        <v-card-title class="headline"> Welcome to M369! </v-card-title>
        <v-card-text>
          <p>Defining, Growing, and Scaling just got easier.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" nuxt to="/inspire"> Continue </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
