// src/api/API.js
import apiClient from '@/plugins/axios';

/**
 * Získá všechny položky z reálného API.
 * @param {string} locale - Jazyk pro lokalizaci dat.
 * @returns {Promise<Array>} Pole s položkami.
 */
export async function getItems(locale) {
  try {
    console.log(`API: Volám API pro položky (locale: ${locale})...`);
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
 * Získá všechny kontakty z adresáře z API.
 * @param {string} locale - Jazyk pro lokalizaci dat.
 * @returns {Promise<Array>} Pole s kontakty.
 */
export async function getDirectory(locale) {
  try {
    console.log(`API: Volám API pro adresář (locale: ${locale})...`);
    const response = await apiClient.get('/v1/directory', { params: { lang: locale } });
    return response.data;
  } catch (error) {
    console.error('Chyba při načítání reálných dat adresáře:', error);
    throw error;
  }
}

/**
 * Získá data o prodejích z reálného API.
 * @returns {Promise<Array>} Pole se záznamy o prodejích.
 */
export async function getSales() {
  try {
    console.log('API: Volám API pro prodeje...');
    const response = await apiClient.get('/v1/sales');
    return response.data;
  } catch (error) {
    console.error('Chyba při načítání reálných dat o prodejích:', error);
    throw error;
  }
}
