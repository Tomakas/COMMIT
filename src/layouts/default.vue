<template>
  <v-app-bar app>
    <v-app-bar-nav-icon v-if="!display.lgAndUp.value" @click.stop="mobileDrawerOpen = !mobileDrawerOpen"></v-app-bar-nav-icon>

    <v-app-bar-title>
      Elementary POS Office
    </v-app-bar-title>

    <template v-slot:append>
      <template v-if="display.lgAndUp.value && navInAppBar">
        <v-btn to="/dashboard" prepend-icon="mdi-view-dashboard">{{ navWithText ? $t('nav.dashboard') : '' }}</v-btn>
        <v-btn to="/sales" prepend-icon="mdi-cash-multiple">{{ navWithText ? $t('nav.sales') : '' }}</v-btn>
        <v-btn to="/items" prepend-icon="mdi-package-variant-closed">{{ navWithText ? $t('nav.items') : '' }}</v-btn>
        <v-btn to="/warehouse" prepend-icon="mdi-warehouse">{{ navWithText ? $t('nav.warehouse') : '' }}</v-btn>
        <v-btn to="/cashregister" prepend-icon="mdi-cash-register">{{ navWithText ? $t('nav.cashregister') : '' }}</v-btn>
        <v-btn to="/addressbook" prepend-icon="mdi-account-box-multiple">{{ navWithText ? $t('nav.addressbook') : '' }}</v-btn>
        <v-btn to="/export" prepend-icon="mdi-file-export">{{ navWithText ? $t('nav.export') : '' }}</v-btn>
      </template>
      <v-menu location="bottom end" transition="scale-transition">
        <template v-slot:activator="{ props }">
          <v-avatar color="info" class="ma-2" style="cursor: pointer;" v-bind="props">
            <v-icon icon="mdi-account-circle"></v-icon>
          </v-avatar>
        </template>

        <v-list>
          <v-list-item :to="'/'" :prepend-icon="'mdi-account-cog'" :title="$t('nav.profile')"></v-list-item>
          <v-list-item :to="'/'" :prepend-icon="'mdi-store'" :title="$t('nav.stores')"></v-list-item>
          <v-divider></v-divider>
          <v-list-item :to="'/settings'" :prepend-icon="'mdi-cog'" :title="$t('nav.settings')" />
          <v-list-item :to="'/support'" link :prepend-icon="'mdi-lifebuoy'" :title="$t('nav.support')" />
          <v-divider></v-divider>
          <v-list-item :to="'/'" :prepend-icon="'mdi-logout'" :title="$t('nav.logout')"></v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-app-bar>

  <v-navigation-drawer v-if="!display.lgAndUp.value || !navInAppBar" v-model="isDrawerOpen" :rail="display.lgAndUp.value && !navWithText"
    :temporary="!display.lgAndUp.value">
    <v-list>
      <v-list-item :to="'/dashboard'" link :prepend-icon="'mdi-view-dashboard'" :title="$t('nav.dashboard')" />
      <v-list-item :to="'/sales'" link :prepend-icon="'mdi-cash-multiple'" :title="$t('nav.sales')" />
      <v-list-item :to="'/items'" link :prepend-icon="'mdi-package-variant-closed'" :title="$t('nav.items')" />
      <v-list-item :to="'/warehouse'" link :prepend-icon="'mdi-warehouse'" :title="$t('nav.warehouse')" />
      <v-list-item :to="'/cashregister'" link :prepend-icon="'mdi-cash-register'" :title="$t('nav.cashregister')" />
      <v-list-item :to="'/addressbook'" link :prepend-icon="'mdi-account-box-multiple'" :title="$t('nav.addressbook')" />
      <v-list-item :to="'/export'" link :prepend-icon="'mdi-file-export'" :title="$t('nav.export')" />
    </v-list>
    <template v-slot:append>
      <v-list>
        <v-list-item :to="'/settings'" link :prepend-icon="'mdi-cog'" :title="$t('nav.settings')" />
        <v-list-item :to="'/support'" link :prepend-icon="'mdi-lifebuoy'" :title="$t('nav.support')" />
      </v-list>
    </template>
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
