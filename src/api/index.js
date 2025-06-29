// src/api/index.js
import { useAppStore } from '@/stores/app';
import * as real from './realAPI';
import * as demo from './demoAPI';

/**
 * Dynamický přepínač API volání.
 * Každá funkce se interně podívá na stav `isDemoMode` v Pinia store
 * a zavolá odpovídající implementaci (reálnou nebo demo).
 */

const getItems = (locale) => {
  const appStore = useAppStore();
  return appStore.isDemoMode ? demo.getItems(locale) : real.getItems(locale);
};

const getDirectory = (locale) => {
  const appStore = useAppStore();
  return appStore.isDemoMode ? demo.getDirectory(locale) : real.getDirectory(locale);
};

const getReceipts = (queryParams) => { // Přijímáme queryParams
  const appStore = useAppStore();
  return appStore.isDemoMode ? demo.getSales() : real.getReceipts(queryParams); // Voláme real.getReceipts s queryParams
};

// Exportujeme jeden objekt, který obsahuje všechny naše API funkce.
// Komponenty budou volat např. `api.getItems()`.
const api = {
  getItems,
  getDirectory,
  getReceipts,
};

export default api;
