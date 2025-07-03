// src/stores/app.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

const todayStart = new Date();
todayStart.setHours(0, 0, 0, 0);

const todayEnd = new Date();
todayEnd.setHours(23, 59, 59, 999);

export const useAppStore = defineStore('app', () => {
  const token = ref(null);
  const user = ref(null);
  const navInAppBar = ref(false);
  const navWithText = ref(true);
  const theme = ref('system');
  const appLocale = ref('cs');
  const dateRangeFrom = ref(todayStart.toISOString());
  const dateRangeTo = ref(todayEnd.toISOString());

  const getReceiptsFrom = ref(null);
  const getReceiptsTo = ref(null);

  const currentPage = ref(1);
  const itemsPerPage = ref(10);
  const totalItems = ref(0);     // Už existuje, bude se plnit z getReceiptsSum.total
  const totalReceipts = ref(0);     // Už existuje, bude se plnit z getReceiptsSum.total
  const totalSum = ref('0,00 Kč');  // NOVÁ PROMĚNNÁ pro celkovou sumu

  const isAuthenticated = computed(() => !!token.value);
  const userName = computed(() => user.value?.username || 'Uživatel');
  const userRole = computed(() => user.value?.role);

  function setLoginData(apiData, formUsername) {
    token.value = apiData.apiKey;
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
    token.value = null;
    user.value = null;
  }

  return {
    token,
    user,
    navInAppBar,
    navWithText,
    theme,
    appLocale,
    dateRangeFrom,
    dateRangeTo,
    getReceiptsFrom,
    getReceiptsTo,
    currentPage,
    itemsPerPage,
    totalItems,
    totalReceipts,
    totalSum,
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
      'navWithText',
      'dateRangeFrom',
      'dateRangeTo',
      'getReceiptsFrom',
      'getReceiptsTo',
      'itemsPerPage',
    ],
  },
});