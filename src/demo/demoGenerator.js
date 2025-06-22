//======================================================================
//          FLEXIBILNÍ GENERÁTOR DEMO DAT
//======================================================================
// Načítá zdrojová data a generuje prodejní data na základě
// konfigurovatelných parametrů, jako je časové období a počet účtenek.
//----------------------------------------------------------------------

// --- KONSTANTY A NASTAVENÍ ---
const LOCAL_STORAGE_KEY = 'demoSalesData';

// Změněno podle zadání - jazykově nezávislé
const PAYMENT_TYPES = ['Card', 'Cash', 'Bank', 'Other'];

// Ostatní konstanty
const CASH_REGISTERS = ['PCX002', 'EXT004'];
const NOTES_CS = ['Spěchá', 'Dárek', 'Platba předem', 'Vyzvedne kurýr', ''];
const NOTES_EN = ['Urgent', 'Gift', 'Pre-paid', 'Courier pickup', ''];

// --- POMOCNÉ FUNKCE ---

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function calculateVAT(totalWithVat, vatRate) {
    const priceWithoutVat = totalWithVat / (1 + vatRate / 100);
    const vatAmount = totalWithVat - priceWithoutVat;
    return {
        priceWithoutVat: parseFloat(priceWithoutVat.toFixed(2)),
        vatAmount: parseFloat(vatAmount.toFixed(2)),
    };
}

/**
 * Hlavní funkce pro generování prodejních dat.
 * @param {object} [config={}] - Konfigurační objekt.
 * @param {'cs'|'en'} [config.locale='cs'] - Jazyk pro zdrojová data.
 * @param {Date} [config.startDate=new Date(new Date().getFullYear() - 1, 0, 1)] - Počáteční datum.
 * @param {Date} [config.endDate=new Date()] - Koncové datum (včetně aktuálního času).
 * @param {boolean} [config.includeWeekends=false] - Zda generovat prodeje i o víkendech.
 * @param {number} [config.avgReceiptsPerDay=20] - Průměrný počet účtenek za den.
 * @param {number} [config.maxItemsPerReceipt=5] - Max položek na účtence.
 * @returns {Promise<Array<Object>>} Pole s vygenerovanými záznamy o prodeji.
 */
async function generateSalesData(config = {}) {
    // Nastavení výchozích hodnot pro konfiguraci
    const {
        locale = 'cs',
        startDate = new Date(new Date().getFullYear() - 1, 0, 1), // 1. ledna loňského roku
        endDate = new Date(), // Aktuální datum a čas
        includeWeekends = false,
        avgReceiptsPerDay = 20,
        maxItemsPerReceipt = 5
    } = config;

    console.log(`Generuji data od ${startDate.toLocaleDateString()} do ${endDate.toLocaleString()}`);

    const sourceData = await import(`./DemoSourceData-${locale}.json`);
    const users = sourceData.directory.filter(c => c.category === 'User');
    const customers = sourceData.directory.filter(c => c.category === 'Customer');
    const saleableProducts = sourceData.products.filter(p => p.forSale === true);
    const notes = locale === 'cs' ? NOTES_CS : NOTES_EN;

    const sales = [];
    let receiptCounter = 1;
    
    // Nová hlavní smyčka: iterujeme den po dni od počátečního do koncového data
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        
        // Zjištění dne v týdnu (0 = neděle, 6 = sobota)
        const dayOfWeek = d.getDay();
        if (!includeWeekends && (dayOfWeek === 0 || dayOfWeek === 6)) {
            continue; // Přeskočíme víkend, pokud je nastaveno
        }

        // Pro každý den vygenerujeme mírně náhodný počet účtenek kolem průměru
        const receiptsForThisDay = getRandomInt(avgReceiptsPerDay * 0.7, avgReceiptsPerDay * 1.3);

        for (let i = 0; i < receiptsForThisDay; i++) {
            const receiptId = `DOKLAD-${d.getFullYear()}-${String(receiptCounter++).padStart(5, '0')}`;
            
            // Vytvoříme nové datum, abychom nemodifikovali 'd' ze smyčky
            const receiptDate = new Date(d);

            // Nastavíme náhodný čas pro daný den
            // Pokud je to dnešní den, omezíme hodiny do aktuální hodiny
            const maxHour = (d.toDateString() === new Date().toDateString()) ? new Date().getHours() : 22;
            receiptDate.setHours(getRandomInt(8, maxHour));
            receiptDate.setMinutes(getRandomInt(0, 59));
            receiptDate.setSeconds(getRandomInt(0, 59));

            // Generování společných dat pro účtenku
            const paymentType = getRandomElement(PAYMENT_TYPES);
            const cashRegister = getRandomElement(CASH_REGISTERS);
            const user = getRandomElement(users);
            const buyer = Math.random() < 0.8 ? getRandomElement(customers) : null;
            const itemsOnReceipt = getRandomInt(1, maxItemsPerReceipt);

            for (let j = 0; j < itemsOnReceipt; j++) {
                const product = getRandomElement(saleableProducts);
                const quantity = getRandomInt(1, 3);
                const pricePerItem = parseFloat(product.price);
                const vatRate = parseInt(product.tax, 10);
                
                const totalPrice = quantity * pricePerItem;
                const { priceWithoutVat, vatAmount } = calculateVAT(totalPrice, vatRate);

                const saleRecord = {
                    'Datum a čas': receiptDate.toISOString(),
                    'Číslo dokladu': receiptId,
                    'Položka': product.itemName,
                    'Počet': quantity,
                    'Cena za položku': pricePerItem,
                    'Cena': totalPrice,
                    'DPH': `${vatRate}%`,
                    'Cena bez DPH': priceWithoutVat,
                    'Hodnota DPH': vatAmount,
                    'Druh platby': paymentType,
                    'Pokladna': cashRegister,
                    'Kupující': buyer ? `${buyer.firstName} ${buyer.lastName}` : 'Anonymous',
                    'Interní': Math.random() < 0.1,
                    'Poznámka': getRandomElement(notes),
                    'Uživatel': `${user.firstName} ${user.lastName}`,
                };
                sales.push(saleRecord);
            }
        }
    }

    return sales.sort((a, b) => new Date(b['Datum a čas']) - new Date(a['Datum a čas']));
}


// --- VEŘEJNÉ EXPORTOVANÉ FUNKCE ---

/**
 * Vygeneruje a uloží demo data na základě konfiguračního objektu.
 * @param {object} [config={}] - Konfigurační objekt.
 */
export async function generateAndStoreDemoData(config = {}) {
    console.log(`Spouštím generování demo dat...`);
    const data = await generateSalesData(config);
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        console.log(`Úspěšně vygenerováno a uloženo ${data.length} prodejních záznamů.`);
    } catch (error) {
        console.error('Chyba při ukládání dat do Local Storage:', error);
    }
}

/**
 * Načte a vrátí demo data z Local Storage.
 * @returns {Array<Object> | null} Pole s daty nebo null.
 */
export function getDemoData() {
    try {
        const data = localStorage.getItem(LOCAL_STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Chyba při načítání dat z Local Storage:', error);
        return null;
    }
}

/**
 * Zkontroluje, zda existují demo data. Pokud ne, vygeneruje je na základě poskytnuté konfigurace.
 * @param {object} [config={}] - Konfigurační objekt pro generování.
 */
export function ensureDemoDataExists(config = {}) {
    if (!getDemoData()) {
        console.log('Demo data nenalezena, generuji novou sadu s výchozím nastavením.');
        generateAndStoreDemoData(config);
    } else {
        console.log('Demo data již existují.');
    }
}