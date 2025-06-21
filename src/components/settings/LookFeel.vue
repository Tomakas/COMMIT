<template>
  <v-card-text class="text-left">
    <p class="text-subtitle-1 font-weight-medium mb-2">Mode</p>
    <v-btn-toggle v-model="mode" color="primary" mandatory rounded="lg">
      <v-btn value="light" icon="mdi-weather-sunny" size="x-large"></v-btn>
      <v-btn value="dark" icon="mdi-weather-night" size="x-large"></v-btn>
      <v-btn value="system" icon="mdi-laptop" size="x-large"></v-btn>
    </v-btn-toggle>

    <v-divider class="my-6"></v-divider>

    <p class="text-subtitle-1 font-weight-medium mb-2">Navigation Menu</p>
    <v-btn-toggle v-model="navMenuLayout" color="primary" mandatory rounded="lg">
      <v-btn value="left" icon="mdi-dock-left" size="x-large"></v-btn>
      <v-btn value="top" icon="mdi-dock-top" size="x-large"></v-btn>
    </v-btn-toggle>

    <v-divider class="my-6"></v-divider>

    <p class="text-subtitle-1 font-weight-medium mb-2">Menu Text</p>
    <v-btn-toggle v-model="menuStyle" color="primary" mandatory rounded="lg">
      <v-btn value="full" icon="mdi-format-list-text" size="x-large"></v-btn>
      <v-btn value="condensed" icon="mdi-dots-grid" size="x-large"></v-btn>
    </v-btn-toggle>
    <v-divider class="my-6"></v-divider>
    <p class="text-subtitle-1 font-weight-medium mb-2">{{ $t('settings.language') }}</p>
    <v-btn-toggle v-model="locale" color="primary" mandatory rounded="lg">
      <v-btn value="cs" size="x-large">Čeština</v-btn>
      <v-btn value="en" size="x-large">English</v-btn>
    </v-btn-toggle>
  </v-card-text>
</template>

<script setup>
import { computed } from 'vue';
import { useAppStore } from '@/stores/app';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

const appStore = useAppStore();

const { t } = useI18n();

const mode = computed({
  get: () => appStore.theme,
  set: (value) => {
    appStore.theme = value;
  }
});

const navMenuLayout = computed({
  get: () => appStore.navInAppBar ? 'top' : 'left',
  set: (value) => {
    appStore.navInAppBar = value === 'top';
  }
});

const menuStyle = computed({
  get: () => appStore.navWithText ? 'full' : 'condensed',
  set: (value) => {
    appStore.navWithText = value === 'full';
  }
});

const locale = computed({
  get: () => appStore.locale,
  set: (value) => {
    appStore.locale = value;
  }
});
</script>
