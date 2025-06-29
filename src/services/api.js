// src/services/api.js

// DŮLEŽITÉ: Importujeme apiClient jako pojmenovaný export
import { apiClient } from '@/plugins/axios';

/**
 * Získá seznam účtenek z API.
 *
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
  // Deklarujeme endpoint mimo try blok, aby byl dostupný i v catch bloku
  const endpoint = '/receipt/get-receipts';

  try {
    // Odeslání POST požadavku s parametry v těle
    // apiClient už má nastavenou baseURL, takže stačí relativní cesta
    const response = await apiClient.post(endpoint, params);

    // Vracíme data z odpovědi. Axios obvykle vrací odpověď v `response.data`.
    return response.data;
  } catch (error) {
    // Nyní je `endpoint` definován a dostupný i zde
    console.error(`Chyba při volání ${endpoint}:`, error);
    throw error; // Přeposíláme chybu dál
  }
};

// Zde budou exportovány další funkce pro jiné API endpointy
// export const getItems = async (itemId) => { ... };
// export const createCustomer = async (customerData) => { ... };
