/**
 * Modul pro simulaci API vrstvy pro načítání demo dat.
 * TOTO JE TESTOVACÍ VERZE PRO ODHALENÍ CHYBY.
 */

/**
 * Získá seznam všech produktů. Pro testovací účely vrací prázdné pole.
 */
export const getProducts = async (locale) => {
  console.log("API TEST: Vracím prázdná data pro produkty.");
  return [];
};

/**
 * Získá seznam všech kontaktů z adresáře.
 * MÍSTO NAČÍTÁNÍ ZE SOUBORU VRACÍ NAPEVNO ZAPSANA TESTOVACÍ DATA.
 * @returns {Promise<Array>} Pole kontaktů.
 */
export const getDirectory = async (locale) => {
  console.log("API TEST: Používám testovací verzi getDirectory. Nenačítám ze souboru!");

  const testData = [
    {
      "category": "Test Contact",
      "firstName": "John",
      "lastName": "Doe",
      "gender": "Male",
      "phone": "123-456-789",
      "email": "john.doe@test.com",
      "address": "123 Test Street, Test City"
    },
    {
      "category": "Test Contact",
      "firstName": "Jane",
      "lastName": "Doe",
      "gender": "Female",
      "phone": "987-654-321",
      "email": "jane.doe@test.com",
      "address": "456 Test Avenue, Testville"
    }
  ];

  // Vrátíme data s malým zpožděním, abychom simulovali asynchronní načítání.
  return new Promise(resolve => setTimeout(() => resolve(testData), 200));
};

/**
 * Získá seznam všech kategorií. Pro testovací účely vrací prázdné pole.
 */
export const getCategories = async (locale) => {
  console.log("API TEST: Vracím prázdná data pro kategorie.");
  return [];
};
