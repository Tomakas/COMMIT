// src/api/realAPI.js
import apiClient from '@/plugins/axios';

/**
 * Získá všechny položky z reálného API.
 * @param {string} locale - Jazyk pro lokalizaci dat.
 * @returns {Promise<Array>} Pole s položkami.
 */
export async function getItems(locale) {
  try {
    console.log(`API [REAL]: Volám API pro položky (locale: ${locale})...`);
    // Sem přijde reálné volání, až ho budete mít
    const response = await apiClient.get('/v1/items', { params: { lang: locale } });
    return response.data;
  } catch (error) {
    console.error('Chyba při načítání reálných dat položek:', error);
    // V případě chyby je lepší vyhodit chybu, aby ji mohla zpracovat volající funkce
    throw error;
  }
}

/**
 * Získá všechny kontakty z adresáře z reálného API.
 * @param {string} locale - Jazyk pro lokalizaci dat.
 * @returns {Promise<Array>} Pole s kontakty.
 */
export async function getDirectory(locale) {
  try {
    console.log(`API [REAL]: Volám API pro adresář (locale: ${locale})...`);
    const response = await apiClient.get('/v1/directory', { params: { lang: locale } });
    return response.data;
  } catch (error) {
    console.error('Chyba při načítání reálných dat adresáře:', error);
    throw error;
  }
}

/**
 * Získá data o účtenkách/prodejích z reálného API.
 * @param {object} queryParams - Objekt s parametry pro dotaz API (např. filtry, limit, sortData).
 * @returns {Promise<Array>} Pole se záznamy o účtenkách.
 */
export async function getReceipts(queryParams = {}) { // Změna názvu funkce
  try {
    console.log('API [REAL]: Volám API pro účtenky s parametry:', queryParams); // Upravený log
    const response = await apiClient.post('/v1/sales', queryParams);
    return response.data.list;
  } catch (error) {
    console.error('Chyba při načítání reálných dat o účtenkách:', error); // Upravená chybová zpráva
    throw error;
  }
}
