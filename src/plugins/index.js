/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '@/stores'
import router from '@/router'
import i18n from './i18n'
import axiosPlugin from './axios'

import { useAppStore } from '@/stores/app';
import { watch } from 'vue';

export function registerPlugins(app) {
  app
    .use(vuetify)
    .use(pinia)
    .use(router)
    .use(i18n)
    .use(axiosPlugin);

  // Set the locale from the app store after Pinia and i18n are installed
  const appStore = useAppStore();
  watch(() => appStore.appLocale, (newLocale) => {
    i18n.global.locale.value = newLocale;
  }, { immediate: true });
}
