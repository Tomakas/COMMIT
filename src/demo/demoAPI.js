/**
 * Modul pro simulaci API vrstvy pro načítání demo dat.
 * Načítá data dynamicky z JSON souborů podle zadaného jazyka (locale).
 */

/**
 * Pomocná interní funkce pro načtení konkrétního datového klíče z JSON souboru pro daný jazyk.
 * @param {string} locale - Jazyk ('cs', 'en', atd.).
 * @param {string} dataKey - Klíč v JSON souboru, který chceme načíst ('products', 'directory', 'categories').
 * @returns {Promise<Array>} Pole s požadovanými daty nebo prázdné pole v případě chyby.
 */
async function loadDataForLocale(locale, dataKey) {
  try {
    // Zajistí správnou velikost písmen pro název souboru (cs -> Cs, en -> En)
    const capitalizedLocale = locale.charAt(0).toUpperCase() + locale.slice(1);
    const sourceModule = await import(`./demoData${capitalizedLocale}.json`);

    // Některé bundlery mohou vkládat JSON pod klíč 'default'
    const sourceData = sourceModule.default || sourceModule;

    // Vrátí data pod daným klíčem, nebo prázdné pole, pokud klíč neexistuje
    return sourceData[dataKey] || [];
  } catch (error) {
    console.error(`Chyba při načítání datového klíče '${dataKey}' pro jazyk '${locale}':`, error);
    return []; // V případě jakékoliv chyby vrátíme prázdné pole
  }
}

/**
 * Získá seznam všech produktů.
 * @param {string} locale - Jazyk, pro který se mají data načíst.
 * @returns {Promise<Array>} Pole produktů.
 */
export const getProducts = async (locale) => {
  console.log(`API: Načítám produkty pro jazyk: ${locale}`);
  return await loadDataForLocale(locale, 'products');
};

/**
 * Získá seznam všech kontaktů z adresáře.
 * @param {string} locale - Jazyk, pro který se mají data načíst.
 * @returns {Promise<Array>} Pole kontaktů.
 */
export const getDirectory = async (locale) => {
  console.log(`API: Načítám adresář pro jazyk: ${locale}`);
  return await loadDataForLocale(locale, 'directory');
};

/**
 * Získá seznam všech kategorií.
 * @param {string} locale - Jazyk, pro který se mají data načíst.
 * @returns {Promise<Array>} Pole kategorií.
 */
export const getCategories = async (locale) => {
  console.log(`API: Načítám kategorie pro jazyk: ${locale}`);
  return await loadDataForLocale(locale, 'categories');
};
