<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup>
import { watch, onMounted, onUnmounted } from 'vue';
import { useTheme } from 'vuetify';
import { useAppStore } from '@/stores/app';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { ensureDemoDataExists } from '@/demo/demoGenerator.js';


const vuetifyTheme = useTheme();
const appStore = useAppStore();
const { theme: themeMode, appLocale } = storeToRefs(appStore);
const { locale: i18nLocale } = useI18n();

const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');

const applyTheme = () => {
  if (themeMode.value === 'system') {
    vuetifyTheme.global.name.value = darkThemeMq.matches ? 'dark' : 'light';
  } else {
    vuetifyTheme.global.name.value = themeMode.value;
  }
};

const handleSystemThemeChange = (e) => {
  if (themeMode.value === 'system') {
    vuetifyTheme.global.name.value = e.matches ? 'dark' : 'light';
  }
};

watch(themeMode, applyTheme);

onUnmounted(() => {
  darkThemeMq.removeEventListener('change', handleSystemThemeChange);
});

watch(appLocale, (newLocale) => {
  i18nLocale.value = newLocale;
});

onMounted(() => {
  i18nLocale.value = appLocale.value;

  applyTheme();
  darkThemeMq.addEventListener('change', handleSystemThemeChange);
});
</script>
