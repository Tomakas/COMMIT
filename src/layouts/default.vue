<template>
  <v-app-bar app>
    <v-app-bar-nav-icon v-if="!display.lgAndUp.value"
      @click.stop="mobileDrawerOpen = !mobileDrawerOpen"></v-app-bar-nav-icon>

    <v-app-bar-title>
      Elementary POS Office lgAndUp: {{ display.lgAndUp.value }}
    </v-app-bar-title>

    <template v-slot:append>
      <template v-if="display.lgAndUp.value && navInAppBar">
        <v-btn to="/dashboard" prepend-icon="mdi-view-dashboard">
          {{ navWithText ? 'Dashboard' : '' }}
        </v-btn>
        <v-btn to="/sales" prepend-icon="mdi-package-variant-closed">
          {{ navWithText ? 'Sales' : '' }}
        </v-btn>
        <v-btn to="/items" prepend-icon="mdi-package-variant-closed">
          {{ navWithText ? 'Items' : '' }}
        </v-btn>
        <v-btn to="/warehouse" prepend-icon="mdi-warehouse">
          {{ navWithText ? 'Warehouse' : '' }}
        </v-btn>
        <v-btn to="/cashregister" prepend-icon="mdi-cash-register">
          {{ navWithText ? 'Cash Register' : '' }}
        </v-btn>
        <v-btn to="/addressbook" prepend-icon="mdi-account-box-multiple">
          {{ navWithText ? 'Address Book' : '' }}
        </v-btn>
        <v-btn to="/settings" prepend-icon="mdi-cog">
          {{ navWithText ? 'Settings' : '' }}
        </v-btn>
      </template>
      <v-avatar color="info">
        <v-icon icon="mdi-account-circle"></v-icon>
      </v-avatar>
    </template>
  </v-app-bar>

  <v-navigation-drawer v-if="!display.lgAndUp.value || !navInAppBar" v-model="isDrawerOpen"
    :rail="display.lgAndUp.value && !navWithText" :temporary="!display.lgAndUp.value">
    <v-list>
      <v-list-item to="/dashboard" link prepend-icon="mdi-view-dashboard" title="Dashboard" />
      <v-list-item to="/sales" link prepend-icon="mdi-chart-bar" title="Sales" />
      <v-list-item to="/items" link prepend-icon="mdi-package-variant-closed" title="Items" />
      <v-list-item to="/warehouse" link prepend-icon="mdi-warehouse" title="Warehouse" />
      <v-list-item to="/cashregister" link prepend-icon="mdi-cash-register" title="Cash Register" />
      <v-list-item to="/addressbook" link prepend-icon="mdi-account-box-multiple" title="Address Book" />
      <v-list-item to="/settings" link prepend-icon="mdi-cog" title="Settings" />
    </v-list>
  </v-navigation-drawer>

  <v-main>
    <router-view />
  </v-main>

</template>

<script setup>
import { ref, computed } from 'vue';
import { useDisplay } from 'vuetify';
import { useAppStore } from '@/stores/app';
import { storeToRefs } from 'pinia';

// Získání reaktivních breakpointů
const display = useDisplay();

// Načtení stavu z Pinia
const appStore = useAppStore();
const { navInAppBar, navWithText } = storeToRefs(appStore);

// Stav pro mobilní menu
const mobileDrawerOpen = ref(false);

// Reaktivní řízení draweru
const isDrawerOpen = computed({
  get() {
    if (display.lgAndUp.value) {
      return !navInAppBar.value;
    } else {
      return mobileDrawerOpen.value;
    }
  },
  set(value) {
    if (!display.lgAndUp.value) {
      mobileDrawerOpen.value = value;
    }
  }
});
</script>
