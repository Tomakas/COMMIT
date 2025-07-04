// src/services/api.js

import { apiClient } from '@/plugins/axios';

/**
 * @param {string} username - The user's username or email.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} The login response data from the API.
 * @throws {Error} If the API call fails.
 */
export const login = async (username, password) => {
  const endpoint = '/auth/login-with-password';
  try {
    const response = await apiClient.post(endpoint, {
      userName: username,
      password: password,
      fe: true,
    });
    return response.data;
  } catch (error) {
    console.error(`Chyba při volání ${endpoint}:`, error);
    throw error;
  }
};


/**
 * @param {object} params - Objekt obsahující parametry pro dotaz na účtenky.
 * @param {string} [params.custom] - Vlastní rozsah dat ve formátu JSON řetězce ["YYYY-MM-DD","YYYY-MM-DD"].
 * @param {string} [params.customTime] - Vlastní časový rozsah ve formátu JSON řetězce [null,null] nebo ["HH:MM","HH:MM"].
 * @param {string} [params.day] - Předdefinovaný denní rozsah (např. "yesterday", "today", "lastWeek", "thisWeek").
 * @param {object} [params.filter] - Objekt s filtry pro zákazníka, zařízení, slevy, typ platby atd.
 * @param {boolean} [params.generateFilters] - Zda generovat filtry.
 * @param {number} [params.limit] - Maximální počet vrácených účtenek na stránku.
 * @param {number} [params.month] - Číslo měsíce (1-12).
 * @param {number} [params.quarter] - Číslo čtvrtletí (1-4).
 * @param {object} [params.sortData] - Objekt pro řazení dat.
 * @param {string} [params.sortData.sortBy] - Klíč pro řazení (např. "dateTime").
 * @param {string} [params.sortData.sortType] - Typ řazení ("asc" nebo "desc").
 * @param {string} [params.type] - Typ časového rozsahu (např. "year", "month", "week", "day").
 * @param {boolean} [params.useServerTime] - Zda použít čas serveru.
 * @param {string} [params.week] - Předdefinovaný týdenní rozsah.
 * @param {number} [params.year] - Rok.
 * @returns {Promise<object>} Data z odpovědi API.
 * @throws {Error} Pokud dojde k chybě při volání API.
 */

export const getReceipts = async (params) => {
  const endpoint = '/receipt/get-receipts';
  try {
    const response = await apiClient.post(endpoint, params);
    return response.data;
  } catch (error) {
    console.error(`Chyba při volání ${endpoint}:`, error);
    throw error;
  }
};

export const getReceiptsSum = async (params) => {
  const endpoint = '/receipt/get-receipts-sum';
  try {
    const response = await apiClient.post(endpoint, params);
    return response.data; // Očekávám { sum: "...", total: "..." }
  } catch (error) {
    console.error(`Chyba při volání ${endpoint}:`, error);
    throw error;
  }
};

/**
 * @param {object} params - Objekt obsahující parametry pro dotaz na položky.
 * @param {string} [params.categoryIdFilter] - Filtr podle ID kategorie.
 * @param {boolean} [params.categoryRootFilter] - Zda filtrovat jen kořenové kategorie.
 * @param {object} [params.limitAndOffset] - Objekt pro paginaci.
 * @param {number} [params.limitAndOffset.limit] - Maximální počet vrácených položek.
 * @param {number} [params.limitAndOffset.offset] - Ofset pro paginaci.
 * @param {boolean} [params.onlyOnSale] - Zda vrátit pouze položky v prodeji.
 * @param {string} [params.query] - Vyhledávací dotaz.
 * @param {object} [params.sortData] - Objekt pro řazení dat.
 * @param {string} [params.sortData.sortBy] - Klíč pro řazení (např. "mcode").
 * @param {string} [params.sortData.sortType] - Typ řazení ("asc" nebo "desc").
 * @returns {Promise<object>} Data z odpovědi API.
 * @throws {Error} Pokud dojde k chybě při volání API.
 */
export const getItems = async (params) => {
  const endpoint = '/item/get-items';
  try {
    const response = await apiClient.post(endpoint, params);
    return response.data;
  } catch (error) {
    console.error(`Chyba při volání ${endpoint}:`, error);
    throw error;
  }
};

/**
 * @param {object} params - Parameters for fetching customers.
 * @param {string} [params.query] - Search query for customers.
 * @param {number} [params.limit] - Maximum number of customers to return.
 * @param {number} [params.offset] - Offset for pagination.
 * @param {object} [params.sortData] - Sorting parameters.
 * @param {string} [params.sortData.sortBy] - Key to sort by (e.g., "name").
 * @param {string} [params.sortData.sortType] - Sort type ("asc" or "desc").
 * @returns {Promise<object>} Customer data from the API.
 * @throws {Error} If the API call fails.
 */
export const getCustomers = async (params) => {
  const endpoint = '/subject/get-customers';
  try {
    const response = await apiClient.post(endpoint, params);
    return response.data;
  } catch (error) {
    console.error(`Chyba při volání ${endpoint}:`, error);
    throw error;
  }
};
// End of API service functions