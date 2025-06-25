// src/api/index.js

import { useAppStore } from '@/stores/app';

// Importujeme nízkoúrovňové funkce pro načítání demo dat
import { getProducts as getDemoProducts, getDirectory as getDemoDirectory } from '@/demo/demoAPI.js';
import { getDemoData as getDemoSales } from '@/demo/demoGenerator.js';

/**
 * Získá všechny položky (produkty).
 * Interně se rozhodne, zda sáhnout pro demo data nebo volat reálné API.
 * @param {string} locale - Jazyk pro lokalizaci dat.
 * @returns {Promise<Array>} Pole s položkami.
 */
export async function getItems(locale) {
  const appStore = useAppStore();

  if (appStore.isDemoMode) {
    // Demo režim: Voláme funkci pro načtení demo produktů.
    return await getDemoProducts(locale);
  } else {
    // Reálný režim: Zde by bylo volání na skutečné API.
    // Např.: const response = await fetch('/api/v1/items'); return await response.json();
    console.log('API: Volám reálné API pro položky... (nyní vracím prázdná data)');
    return [];
  }
}

/**
 * Získá všechny kontakty z adresáře.
 * @param {string} locale - Jazyk pro lokalizaci dat.
 * @returns {Promise<Array>} Pole s kontakty.
 */
export async function getDirectory(locale) {
  const appStore = useAppStore();

  if (appStore.isDemoMode) {
    return await getDemoDirectory(locale);
  } else {
    console.log('API: Volám reálné API pro adresář... (nyní vracím prázdná data)');
    return [];
  }
}

/**
 * Získá data o prodejích (účtenky a prodané položky).
 * @returns {Promise<Array>} Pole se záznamy o prodejích.
 */
export async function getSales() {
  const appStore = useAppStore();

  if (appStore.isDemoMode) {
    // V demo režimu použijeme data z LocalStorage, která byla vygenerována při demo přihlášení.
    return getDemoSales() || [];
  } else {
    console.log('API: Volám reálné API pro prodeje... (nyní vracím prázdná data)');
    return [];
  }
}
