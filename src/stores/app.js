import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    // Zde je nyní centrální stav pro layout aplikace
    navInAppBar: false, // false = boční menu, true = horní menu
    navWithText: true, // true = plné menu (s textem), false = kondenzované (jen ikony)
    theme: 'system', // Přidáno pro správu tématu: 'light', 'dark', nebo 'system'
    locale: 'cs',
  }),
});
