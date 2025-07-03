import { createI18n } from 'vue-i18n';
import cs from '@/locales/cs.json';
import en from '@/locales/en.json';

const i18n = createI18n({
  legacy: false, // Composition API
  fallbackLocale: 'en',
  messages: {
    cs,
    en,
  },
});

export default i18n;
