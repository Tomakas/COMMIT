---- layouts/default.vue
<template>
  <!-- ------- -->
  <!-- App Bar -->
  <!-- ------- -->
  <v-app-bar app>
    <v-app-bar-nav-icon v-if="Haburger" @click="drawer = !drawer"></v-app-bar-nav-icon>
    <v-btn prepend-icon="mdi-arrow-up-box" @click="NavInAppBar = !NavInAppBar">
      {{ NavInAppBar ? "Horní" : "Boční" }}</v-btn>
    <v-btn prepend-icon="mdi-eye-outline" @click="NavWithIcon = !NavWithIcon">
      {{ NavWithIcon ? "TEXT" : "BEZ" }}</v-btn>
    <v-btn prepend-icon="mdi-close" @click="Haburger = !Haburger">
      {{ Haburger ? "ANO" : "NE" }}</v-btn>
    <v-app-bar-title>Elementary POS Office</v-app-bar-title>
    <template v-slot:append>
      <template v-if="NavInAppBar">
        <v-btn to="/dashboard" prepend-icon="mdi-view-dashboard">{{ NavWithIcon ? 'Dashboard' : '' }}</v-btn>
        <v-btn to="/sales" prepend-icon="mdi-chart-bar">{{ NavWithIcon ? 'Sales' : '' }}</v-btn>
        <v-btn to="/items" prepend-icon="mdi-chart-bar">{{ NavWithIcon ? 'Items' : '' }}</v-btn>
        <v-btn to="/warehouse" prepend-icon="mdi-chart-bar">{{ NavWithIcon ? 'Warehouse' : '' }}</v-btn>
        <v-btn to="/cashregister" prepend-icon="mdi-chart-bar">{{ NavWithIcon ? 'Cash Register' : '' }}</v-btn>
        <v-btn to="/addressbook" prepend-icon="mdi-chart-bar">{{ NavWithIcon ? 'Address Book' : '' }}</v-btn>
        <v-btn to="/settings" prepend-icon="mdi-chart-bar">{{ NavWithIcon ? 'Settings' : '' }}</v-btn>
      </template>
      <v-avatar color="info"><v-icon icon="mdi-account-circle"></v-icon></v-avatar>
    </template>

  </v-app-bar>
  <!-- ----------------- -->
  <!-- navigation-drawer -->
  <!-- ----------------- -->
  <v-navigation-drawer :rail="!NavWithIcon" temporary="Haburger" v-model="drawer" app>
    <v-list>
      <v-list-item to="/dashboard" link prepend-icon="mdi-view-dashboard" title="Dashboard" </v-list-item>
        <v-list-item to="/sales" link prepend-icon="mdi-chart-bar" title="Sales"></v-list-item>
        <v-list-item to="/items" link prepend-icon="mdi-package-variant-closed" title="Items"></v-list-item>
        <v-list-item to="/warehouse" link prepend-icon="mdi-warehouse" title="Warehouse"></v-list-item>
        <v-list-item to="/cashregister" link prepend-icon="mdi-cash-register" title="Cash Register"></v-list-item>
        <v-list-item to="/addressbook" link prepend-icon="prepend-icon" title="Adress Book"></v-list-item>
        <v-list-item to="/settings" link prepend-icon="mdi-cog-outline" title="Setting"></v-list-item>

    </v-list>
  </v-navigation-drawer>

  <v-main>
    <router-view />
  </v-main>

  <AppFooter />
</template>

<script setup>
import { ref } from "vue";

const drawer = ref(false);
const NavInAppBar = ref(true) // Stav pro ovládání viditelnosti draweru
const NavWithIcon = ref(true);
const Haburger = ref(true); // Stav pro ovládání viditelnosti ikon v navigaci
// Stav pro ovládání viditelnosti ikon v navigaci
</script>
