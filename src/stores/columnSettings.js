import { defineStore } from 'pinia';

export const useColumnSettingsStore = defineStore('columnSettings', {
  state: () => ({
    columnConfigs: {},
  }),
  actions: {
    setHeaders(tableId, headers) {
      this.columnConfigs[tableId] = headers;
    },
    getHeaders(tableId) {
      return this.columnConfigs[tableId];
    },
    resetHeaders(tableId) {
      // This action will be used by the reset button
      // It will clear the persisted state for this tableId, forcing it to revert to default
      delete this.columnConfigs[tableId];
    },
  },
  persist: true,
});
