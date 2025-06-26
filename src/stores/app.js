import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
// import router from '@/router'; // ZMĚNA: Tento import kompletně odstraňte

export const useAppStore = defineStore('app', () => {
  // --- STAV (zůstává beze změny) ---
  const token = ref(null);
  const user = ref(null);
  const isDemoMode = ref(false);
  const navInAppBar = ref(false);
  const navWithText = ref(true);
  const theme = ref('system');
  const appLocale = ref('cs');

  // --- GETTERY (zůstávají beze změny) ---
  const isAuthenticated = computed(() => !!token.value);
  const userName = computed(() => user.value?.username || 'Uživatel');
  const userRole = computed(() => user.value?.role);

  // --- AKCE ---
  function setLoginData(apiData, formUsername, demoMode = false) {
    token.value = apiData.apiKey;
    isDemoMode.value = demoMode;
    user.value = {
      username: formUsername,
      userId: apiData.userId,
      companyId: apiData.companyId,
      adminUser: apiData.adminUser,
      role: apiData.role,
      rights: apiData.rights,
    };
  }

  function logout() {
    // ZMĚNA: Akce se nyní stará pouze o vyčištění stavu
    token.value = null;
    user.value = null;
    isDemoMode.value = false;
    // Přesměrování bylo odstraněno.
  }

  return {
    token,
    user,
    isDemoMode,
    navInAppBar,
    navWithText,
    theme,
    appLocale,
    isAuthenticated,
    userName,
    userRole,
    setLoginData,
    logout,
  };
}, {
  persist: {
    paths: [
      'theme',
      'appLocale',
      'navInAppBar',
      'navWithText'
    ],
  },
});
