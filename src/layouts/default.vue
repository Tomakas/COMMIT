---- layouts/default.vue
<template>
  <!-- ------- -->
  <!-- App Bar -->
  <!-- ------- -->
  <v-app-bar app>
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    <v-app-bar-title>Elementary POS Office</v-app-bar-title>
    <template v-slot:append>
      <v-btn to="/dashboard" prepend-icon="mdi-view-dashboard" text>Dashboard</v-btn>
      <v-btn to="/sales" prepend-icon="mdi-chart-bar" text>Sales</v-btn>
      <v-btn to="/items" prepend-icon="mdi-chart-bar" text>Items</v-btn>
      <v-avatar color="info">
        <v-icon icon="mdi-account-circle"></v-icon>
      </v-avatar>
    </template>
  </v-app-bar>
  <!-- ----------------- -->
  <!-- navigation-drawer -->
  <!-- ----------------- -->
  <v-navigation-drawer v-model="drawer" app>
    <v-list>
      <v-list-item to="/dashboard" link prepend-icon="mdi-view-dashboard" title="Dashboard"> </v-list-item>
      <v-list-item to="/sales" link prepend-icon="mdi-chart-bar" title="Sales"> </v-list-item>
      <v-list-item to="/items" link prepend-icon="mdi-chart-bar" title="Items"> </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-main>
    <router-view />
  </v-main>

  <AppFooter />
</template>

<script setup>
import { ref } from "vue";

const drawer = ref(false); // Stav pro ovládání viditelnosti draweru
</script>
