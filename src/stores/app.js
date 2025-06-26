import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export const useAppStore = defineStore('app', () => {

  // --- STAV (STATE) ---
  // Plugin se postará o jejich načtení z localStorage při startu.
  const token = ref(null);
  const user = ref(null);
  const isDemoMode = ref(false);
  const navInAppBar = ref(false);
  const navWithText = ref(true);
  const theme = ref('system');
  const appLocale = ref('cs');

  // --- GETTERY (GETTERS) ---
  const isAuthenticated = computed(() => !!token.value);
  const userName = computed(() => user.value?.username || 'Uživatel');
  const userRole = computed(() => user.value?.role);

  // --- AKCE (ACTIONS) ---
  const router = useRouter();

  function setLoginData(apiData, formUsername, demoMode = false) {
    // Pouze měníme stav v Pinia. Plugin se postará o uložení do localStorage.
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
    // Pouze resetujeme stav v Pinia. Plugin se postará o vymazání z localStorage.
    token.value = null;
    user.value = null;
    isDemoMode.value = false;

    router.replace({ path: '/login' });
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

  // --- KONFIGURACE PERZISTENCE ---
  persist: {
    // list of persistant parametrs
    paths: [
      'theme',      // Uložíme nastavení motivu.
      'appLocale',  // Uložíme preferovaný jazyk.
      'navInAppBar',// Uložíme nastavení menu.
      'navWithText' // Uložíme styl menu.

    ],
  },
});