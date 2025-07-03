/**
 * Struktura dat pro účtenku (Receipt) z API.
 * @returns {object} Objekt s výchozími hodnotami a očekávanými typy polí.
 */
export const ReceiptModel = () => ({
  receiptId: '',          // Unikátní UUID účtenky z API. Příklad: "626e22f7-b914-4029-a21a-214260d5ff6a"
  dateTime: new Date().toISOString(), // Datum a čas vystavení. Příklad: "2025-06-30T11:17:02.464"
  receiptNumber: '',      // Lidé čitelný identifikátor/číslo dokladu. Příklad: "X3CT-1419"
  total: '0,00 Kč',       // Celková částka účtenky s měnou, již naformátovaná z API. Příklad: "220,00 Kč"
  user: '',               // Jméno uživatele, který účtenku vystavil. Příklad: "Honza33"
  paymentType: '',        // Typ platby. Příklad: "CASH", "CARD", "BANK"
  customer: null,         // Objekt zákazníka (obvykle null nebo objekt).
  customerShortName: '',  // Zkrácené jméno zákazníka. Příklad: "", "Jan S."
  note: null,             // Poznámka k účtence (null nebo text).
  code1: '',              // První část kódu pokladny. Příklad: "X3CT"
  code2: '',              // Druhá část kódu pokladny. Příklad: "3Z40"
  cashRegister: '',       // Název pokladny. Příklad: "EPOS-X3CT"
  validity: '',           // Stav platnosti účtenky. Příklad: "valid", "unnumbered"
  printNum: 0,            // Počet vytisknutých kopií. Příklad: 0, 1
  shiftCode: '',          // Kód směny. Příklad: "S-X3CT-0032"
  billName: null,         // Název faktury (null nebo text).
  negative: false,        // Indikuje, zda je účtenka záporná (vrácení).
});

/**
 * Definuje hlavičky tabulky pro účtenky. Klíče odpovídají polím z API,
 */
export const ReceiptHeaders = [
  { title: 'table.headers.receiptId', key: 'receiptId', required: true, mobileListLeft: true, visible: false, sortable: false },
  { title: 'table.headers.dateTime', key: 'dateTime', required: true, mobileMain: 'left', mobileListLeft: true, visible: true, sortable: false },
  { title: 'table.headers.receiptNumber', key: 'receiptNumber', required: true, mobileListLeft: true, visible: true, sortable: false },
  { title: 'table.headers.total', key: 'total', align: 'end', required: true, mobileMain: 'right', visible: true, sortable: false },
  { title: 'table.headers.user', key: 'user', required: false, mobileListLeft: true, visible: true, sortable: false },
  { title: 'table.headers.paymentType', key: 'paymentType', align: 'start', required: false, mobileListLeft: false, visible: true, sortable: false },
  { title: 'table.headers.customer', key: 'customerShortName', required: false, mobileListLeft: true, visible: true, sortable: false },
  { title: 'table.headers.note', key: 'note', required: false, mobileListLeft: true, visible: false, sortable: false },
  { title: 'table.headers.code1', key: 'code1', required: false, mobileListLeft: true, visible: false, sortable: false },
  { title: 'table.headers.code2', key: 'code2', required: false, mobileListLeft: true, visible: false, sortable: false },
  { title: 'table.headers.cashRegister', key: 'cashRegister', required: false, mobileListLeft: true, visible: true, sortable: false },
  { title: 'table.headers.validity', key: 'validity', required: false, mobileListLeft: true, visible: false, sortable: false },
  { title: 'table.headers.printNumber', key: 'printNum', required: false, mobileListLeft: true, visible: false, sortable: false },
  { title: 'table.headers.shiftCode', key: 'shiftCode', required: false, mobileListLeft: true, visible: true, sortable: false },
  { title: 'table.headers.billName', key: 'billName', required: false, mobileListLeft: true, visible: false, sortable: false },
  { title: 'table.headers.negative', key: 'negative', required: false, mobileListLeft: true, visible: false, sortable: false },
];