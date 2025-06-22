<template>
  <v-card-text class="text-left">
    <p class="text-subtitle-1 font-weight-medium mb-2">Mode</p>
    <v-btn-toggle v-model="theme" color="primary" mandatory rounded="lg">
      <v-btn value="light" icon="mdi-weather-sunny" size="x-large"></v-btn>
      <v-btn value="dark" icon="mdi-weather-night" size="x-large"></v-btn>
      <v-btn value="system" icon="mdi-laptop" size="x-large"></v-btn>
    </v-btn-toggle>

    <v-divider class="my-6"></v-divider>

    <p class="text-subtitle-1 font-weight-medium mb-2">Navigation Menu</p>
    <v-btn-toggle v-model="navInAppBar" color="primary" mandatory rounded="lg">
      <v-btn :value="false" icon="mdi-dock-left" size="x-large"></v-btn>
      <v-btn :value="true" icon="mdi-dock-top" size="x-large"></v-btn>
    </v-btn-toggle>

    <v-divider class="my-6"></v-divider>

    <p class="text-subtitle-1 font-weight-medium mb-2">Menu Text</p>
    <v-btn-toggle v-model="navWithText" color="primary" mandatory rounded="lg">
      <v-btn :value="true" icon="mdi-format-list-text" size="x-large"></v-btn>
      <v-btn :value="false" icon="mdi-dots-grid" size="x-large"></v-btn>
    </v-btn-toggle>

    <v-divider class="my-6"></v-divider>

    <p class="text-subtitle-1 font-weight-medium mb-2">{{ $t('settings.language') }}</p>
    <v-select v-model="locale" :items="[{ title: 'Čeština', value: 'cs' }, { title: 'English', value: 'en' }]"
      variant="outlined"></v-select>
  </v-card-text>
</template>

<script setup>
import { watch } from 'vue';
import { useAppStore } from '@/stores/app';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

const appStore = useAppStore();
const { navInAppBar, navWithText, theme, locale: appLocale } = storeToRefs(appStore);

const { t, locale } = useI18n();

locale.value = appLocale.value;
watch(appLocale, (newLocale) => {
  locale.value = newLocale;
});

watch(locale, (newLocale) => {
  appLocale.value = newLocale;
})

</script>
