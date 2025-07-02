/**
 * Struktura dat pro položku (Item) z API.
 * @returns {object} Objekt s výchozími hodnotami a očekávanými typy polí.
 */
export const ItemModel = () => ({
  itemId: '',
  text: '',
  taxId: '',
  price: 0,
  sku: '',
  categoryId: '',
  priceStr: '0,00',
  purchasePriceStr: '0,00',
  note: null,
  stockType: 'simple',
  modifiers: [],
  lowQuantityStr: '0,00',
  supplier: '',
  onSale: false,
  loyaltySettings: {
    gainPoints: null,
    usePoints: null,
    discount: null,
    gainPointsStr: null,
    usePointsStr: null,
    discountStr: null
  },
  barcodes: [],
  mcodeStr: '',
  mcode: 0,
  mcolor: 0,
  // Přidáme další potřebné vlastnosti, které byly vidět v props 'headers' v items.vue
  itemType: '', // např. "Product", "Service" - pokud API vrací
  category: '', // Jméno kategorie z API
  purchasePrice: 0, // Číselná hodnota pro formátování
  stockLevel: 0, // Úroveň skladu
  unit: '', // Jednotka (ks, kg, l)
  lowStockThreshold: 0, // Minimální skladová úroveň
  forSale: true, // Boolean hodnota pro "Na prodej"
  tax: 0, // Procentuální sazba daně
  allergens: [], // Pole alergenů
  pointsGained: 0, // Získané body
  pointsForDiscount: 0, // Body pro slevu
  loyaltyDiscount: 0, // Sleva za věrnost
});

/**
 * Definuje hlavičky tabulky pro položky. Klíče odpovídají polím z API.
 */
export const ItemHeaders = [
  { title: 'Item Name', key: 'text', required: true, mobileMain: 'left', visible: true },
  { title: 'Sale Price', key: 'price', align: 'end', required: true, mobileMain: 'right', visible: true },
  { title: 'M-Code', key: 'mcodeStr', required: false, mobileListLeft: true, visible: true },
  { title: 'SKU', key: 'sku', required: false, mobileListLeft: true, visible: true },
  { title: 'Type', key: 'itemType', required: false, mobileListLeft: true, visible: true }, // Tato vlastnost se v API nevyskytuje přímo, bude potřeba ji mapovat
  { title: 'Category', key: 'category', required: false, mobileListLeft: true, visible: true }, // Tato vlastnost se v API nevyskytuje přímo, bude potřeba ji mapovat
  { title: 'Purchase Price', key: 'purchasePrice', align: 'end', required: false, mobileListLeft: true, visible: true },
  { title: 'In Stock', key: 'stockLevel', align: 'end', required: true, mobileListLeft: true, visible: true }, // Tato vlastnost se v API nevyskytuje přímo, bude potřeba ji mapovat
  { title: 'Unit', key: 'unit', align: 'start', required: false, mobileListLeft: true, visible: false }, // Tato vlastnost se v API nevyskytuje přímo, bude potřeba ji mapovat
  { title: 'Min. Stock', key: 'lowStockThreshold', align: 'end', required: false, mobileListLeft: true, visible: false }, // Tato vlastnost se v API nevyskytuje přímo, bude potřeba ji mapovat
  { title: 'Supplier', key: 'supplier', minWidth: '180px', required: false, mobileListLeft: true, visible: true },
  { title: 'For Sale', key: 'onSale', align: 'center', required: false, mobileListLeft: true, visible: false },
  { title: 'Tax (%)', key: 'tax', align: 'end', required: false, mobileListLeft: false, visible: false }, // Tato vlastnost se v API nevyskytuje přímo, bude potřeba ji mapovat
  { title: 'Allergens', key: 'allergens', required: false, mobileListLeft: true, visible: false }, // Tato vlastnost se v API nevyskytuje přímo, bude potřeba ji mapovat
  { title: 'Points Gained', key: 'loyaltySettings.gainPoints', align: 'end', required: false, mobileListLeft: true, visible: false },
  { title: 'Points For Discount', key: 'loyaltySettings.usePoints', align: 'end', required: false, mobileListLeft: true, visible: false },
  { title: 'Loyalty Discount', key: 'loyaltySettings.discount', align: 'end', required: false, mobileListLeft: true, visible: false },
  { title: 'Note', key: 'note', required: false, visible: false },
];
