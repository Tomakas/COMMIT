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
  { title: 'table.headers.mcode', key: 'mcode', required: false, mobileListLeft: true, visible: true, sortable: true },
  { title: 'table.headers.itemName', key: 'text', required: true, mobileMain: 'left', visible: true, sortable: true },
  { title: 'table.headers.salePrice', key: 'price', align: 'end', required: true, mobileMain: 'right', visible: true, sortable: true },
  { title: 'table.headers.tax', key: 'tax', align: 'end', required: false, mobileListLeft: false, visible: true, sortable: true, configurable: true },
  { title: 'table.headers.sku', key: 'sku', required: false, mobileListLeft: true, visible: true, sortable: true },
  { title: 'table.headers.type', key: 'itemType', required: false, mobileListLeft: true, visible: true, sortable: false },
  { title: 'table.headers.category', key: 'category', required: false, mobileListLeft: true, visible: true, sortable: true },
  { title: 'table.headers.purchasePrice', key: 'purchasePrice', align: 'end', required: false, mobileListLeft: true, visible: true, sortable: false },
  { title: 'table.headers.inStock', key: 'stockLevel', align: 'end', required: false, mobileListLeft: true, visible: false, sortable: false },
  { title: 'table.headers.unit', key: 'unit', align: 'start', required: false, mobileListLeft: true, visible: false, sortable: false, configurable: false },
  { title: 'table.headers.minStock', key: 'lowStockThreshold', align: 'end', required: false, mobileListLeft: true, visible: false, sortable: false, configurable: true },
  { title: 'table.headers.supplier', key: 'supplier', minWidth: '180px', required: false, mobileListLeft: true, visible: false, sortable: false, configurable: false },
  { title: 'table.headers.forSale', key: 'onSale', align: 'center', required: false, mobileListLeft: true, visible: false, sortable: false, configurable: true },
  { title: 'table.headers.allergens', key: 'allergens', required: false, mobileListLeft: true, visible: false, sortable: false, configurable: true },
  { title: 'table.headers.pointsGained', key: 'loyaltySettings.gainPoints', align: 'end', required: false, mobileListLeft: true, visible: false, sortable: false, configurable: true },
  { title: 'table.headers.pointsForDiscount', key: 'loyaltySettings.usePoints', align: 'end', required: false, mobileListLeft: true, visible: false, sortable: false, configurable: true },
  { title: 'table.headers.loyaltyDiscount', key: 'loyaltySettings.discount', align: 'end', required: false, mobileListLeft: true, visible: false, sortable: false, configurable: true },
  { title: 'table.headers.note', key: 'note', required: false, visible: false, sortable: false, configurable: true },
];