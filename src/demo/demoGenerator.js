//======================================================================
//          FLEXIBILNÍ GENERÁTOR DEMO DAT
//======================================================================
// Načítá zdrojová data a generuje prodejní data na základě
// konfigurovatelných parametrů, jako je časové období a počet účtenek.
//----------------------------------------------------------------------

// --- KONSTANTY A NASTAVENÍ ---
const LOCAL_STORAGE_KEY = 'demoSalesData';
const PAYMENT_TYPES = ['Card', 'Cash', 'Bank', 'Other'];
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
 * @returns {Promise<Array<Object>>} Pole s vygenerovanými záznamy o prodeji.
 */
async function generateSalesData(config = {}) {
    const {
        locale = 'cs',
        startDate = new Date(new Date().getFullYear() - 1, 0, 1),
        endDate = new Date(),
        includeWeekends = false,
        avgReceiptsPerDay = 10,
        maxItemsPerReceipt = 2
    } = config;

    console.log(`Generuji data od ${startDate.toLocaleDateString()} do ${endDate.toLocaleString()}`);

    // ZMĚNA ZDE: Upravená cesta pro dynamický import, aby odpovídala např. 'demoDataCs.json'
    const capitalizedLocale = locale.charAt(0).toUpperCase() + locale.slice(1);
    const sourceData = await import(`./demoData${capitalizedLocale}.json`);

    const users = sourceData.directory.filter(c => c.category === 'User');
    const customers = sourceData.directory.filter(c => c.category === 'Customer');
    const saleableProducts = sourceData.products.filter(p => p.forSale === true);
    const notes = locale === 'cs' ? NOTES_CS : NOTES_EN;

    const sales = [];
    let receiptCounter = 1;

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dayOfWeek = d.getDay();
        if (!includeWeekends && (dayOfWeek === 0 || dayOfWeek === 6)) {
            continue;
        }
        const receiptsForThisDay = getRandomInt(avgReceiptsPerDay * 0.7, avgReceiptsPerDay * 1.3);
        for (let i = 0; i < receiptsForThisDay; i++) {
            const receiptId = `DOKLAD-${d.getFullYear()}-${String(receiptCounter++).padStart(5, '0')}`;
            const receiptDate = new Date(d);
            const maxHour = (d.toDateString() === new Date().toDateString()) ? new Date().getHours() : 22;
            receiptDate.setHours(getRandomInt(8, maxHour));
            receiptDate.setMinutes(getRandomInt(0, 59));
            receiptDate.setSeconds(getRandomInt(0, 59));
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
                    dateTime: receiptDate.toISOString(),
                    receiptId: receiptId,
                    item: product.itemName,
                    quantity: quantity,
                    pricePerItem: pricePerItem,
                    totalPrice: totalPrice,
                    vatRate: `${vatRate}%`,
                    priceWithoutVat: priceWithoutVat,
                    vatAmount: vatAmount,
                    paymentType: paymentType,
                    cashRegisterId: cashRegister,
                    customerName: buyer ? `${buyer.firstName} ${buyer.lastName}` : 'Anonymous',
                    isInternal: Math.random() < 0.1,
                    note: getRandomElement(notes),
                    userName: `${user.firstName} ${user.lastName}`,
                };
                sales.push(saleRecord);
            }
        }
    }
    return sales.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
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
