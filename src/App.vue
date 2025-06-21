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

const vuetifyTheme = useTheme();
const appStore = useAppStore();
const { theme: themeMode } = storeToRefs(appStore);

// Vytvoření media query pro detekci systémového tmavého módu
const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');

// Funkce, která aplikuje správné téma
const applyTheme = () => {
  if (themeMode.value === 'system') {
    // Pokud je nastaven systémový mód, použijeme hodnotu z media query
    vuetifyTheme.global.name.value = darkThemeMq.matches ? 'dark' : 'light';
  } else {
    // Jinak použijeme přímo hodnotu z nastavení (light/dark)
    vuetifyTheme.global.name.value = themeMode.value;
  }
};

// Handler pro případ, že se změní systémové nastavení
const handleSystemThemeChange = (e) => {
  if (themeMode.value === 'system') {
    vuetifyTheme.global.name.value = e.matches ? 'dark' : 'light';
  }
};

// Sledování změn v nastavení tématu z Pinia store
watch(themeMode, applyTheme);

// Při prvním načtení komponenty
onMounted(() => {
  applyTheme();
  // Začneme naslouchat změnám v systémovém nastavení
  darkThemeMq.addEventListener('change', handleSystemThemeChange);
});

// Při odmontování komponenty
onUnmounted(() => {
  // Přestaneme naslouchat, abychom předešli memory leakům
  darkThemeMq.removeEventListener('change', handleSystemThemeChange);
});
</script>
