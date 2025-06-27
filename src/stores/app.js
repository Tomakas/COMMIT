// src/stores/app.js

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

const todayStart = new Date();
todayStart.setHours(0, 0, 0, 0);

const todayEnd = new Date();
todayEnd.setHours(23, 59, 59, 999);

export const useAppStore = defineStore('app', () => {
 // --- STAV (zůstává beze změny) ---
 const token = ref(null);
 const user = ref(null);
 const isDemoMode = ref(false);
 const navInAppBar = ref(false);
 const navWithText = ref(true);
 const theme = ref('system');
 const appLocale = ref('cs');
 const dateRangeFrom = ref(todayStart.toISOString());
 const dateRangeTo = ref(todayEnd.toISOString());

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
 token.value = null;
 user.value = null;
 isDemoMode.value = false;
 }

 return {
 token,
 user,
 isDemoMode,
 navInAppBar,
 navWithText,
 theme,
 appLocale,
 dateRangeFrom,
 dateRangeTo,
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
 'dateRangeTo'
 ],
 },
});
