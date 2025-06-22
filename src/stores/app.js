import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    navInAppBar: false,
    navWithText: true,
    theme: 'system', // 'light', 'dark', nebo 'system'
    appLocale: 'cs',
  }),
});
