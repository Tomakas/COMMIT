/**
 * Formátuje datum a čas podle zadaných parametrů.
 * @param {string | Date} dateInput - Datum k formátování.
 * @param {object} options - Možnosti formátování.
 * @param {boolean} [options.includeSeconds=false] - Zda zahrnout do výstupu i sekundy.
 * @returns {string} Naformátované datum a čas, např. "25.06.25 10:30"
 */
export function formatDate(dateInput, { includeSeconds = false } = {}) {
  if (!dateInput) return '';
  const d = new Date(dateInput);

  // Kontrola, zda je datum platné
  if (isNaN(d.getTime())) {
    return '';
  }

  const pad = (num) => String(num).padStart(2, '0');

  const date = `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${String(d.getFullYear()).slice(-2)}`;
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const seconds = includeSeconds ? `:${pad(d.getSeconds())}` : '';

  return `${date} ${time}${seconds}`;
}


/**
 * Formátuje číselnou hodnotu jako měnu.
 * @param {number | null | undefined} amount - Částka k formátování.
 * @param {object} options - Možnosti formátování.
 * @param {string} options.locale - Jazykové nastavení pro formát (např. 'cs-CZ', 'en-GB').
 * @param {string} options.currency - Kód měny (např. 'CZK', 'GBP').
 * @returns {string} Naformátovaná částka s měnou, např. "1 250,50 Kč"
 */
export function formatCurrency(amount, { locale, currency }) {
  if (amount === null || amount === undefined || typeof amount !== 'number') {
    return 'N/A';
  }

  return amount.toLocaleString(locale, {
    style: 'currency',
    currency: currency,
  });
}
