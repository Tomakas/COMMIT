// src/pages/sales.vue
<template>
  <v-container fluid>
    <v-card class="mx-auto" flat>
      <TablePanel v-model:activePanelId="activePanelId" v-model:searchText="searchText" :panels="tablePanels" :show-search="true" :show-filter="true"
        :show-settings="true" :show-sum="true" @open-settings="columnDialog = true" />
      <ReuseTable v-if="activePanel" :headers="activePanel.headers" :items="activePanel.items" :search="searchText" :loading="loading" />
    </v-card>
    <ColumnSettingsDialog v-if="activePanel" v-model:dialog="columnDialog" :headers="activePanel.headers" @update:headers="handleHeadersUpdate" />
  </v-container>
</template>

<script setup>
import { useCompTableData } from '@/composables/compTableData.js';
import api from '@/api/index.js';
import { formatDate, formatCurrency } from '@/utils/formatters.js';

const pageConfig = {
  panels: [
    {
      id: 'receipts',
      name: 'Receipts',
      headers: [
        { title: 'Da    te & Time', key: 'dateTime', required: true, mobileMain: 'left', mobileListLeft: true, visible: true },
        { title: 'Receipt ID', key: 'receiptId', required: true, mobileListLeft: true, visible: false }, // Přidáno: Skutečné ID účtenky (UUID)
        { title: 'Receipt Number', key: 'receiptNumber', required: true, mobileMain: 'left', mobileListLeft: true, visible: true }, // Změněn klíč na 'receiptNumber'
        { title: 'Total', key: 'total', align: 'end', required: true, mobileMain: 'right', visible: true }, // Změněn název a klíč na 'total'
        { title: 'Payment Type', key: 'paymentType', align: 'start', required: false, mobileListLeft: false, visible: true },
        { title: 'Customer', key: 'customer', required: false, mobileListLeft: true, visible: true }, // Nová hlavička pro plné jméno zákazníka
        { title: 'Customer Short Name', key: 'customerShortName', required: false, mobileListLeft: true, visible: false }, // Původní hlavička pro zkrácené jméno, nyní skrytá
        { title: 'Note', key: 'note', required: false, mobileListLeft: true, visible: false },
        { title: 'User', key: 'user', required: false, mobileListLeft: true, visible: true }, // Změněn klíč na 'user'
        { title: 'Code 1', key: 'code1', required: false, visible: false }, // Přidáno z API odpovědi
        { title: 'Code 2', key: 'code2', required: false, visible: false }, // Přidáno z API odpovědi
        { title: 'Cash Register', key: 'cashRegister', required: false, visible: false }, // Přidáno z API odpovědi
        { title: 'Validity', key: 'validity', required: false, visible: false }, // Přidáno z API odpovědi
        { title: 'Print Num', key: 'printNum', required: false, visible: false }, // Přidáno z API odpovědi
        { title: 'Shift Code', key: 'shiftCode', required: false, visible: false }, // Přidáno z API odpovědi
        { title: 'Bill Name', key: 'billName', required: false, visible: false }, // Přidáno z API odpovědi
        { title: 'Negative', key: 'negative', required: false, visible: false }, // Přidáno z API odpovědi
      ],
      items: [],
    },
    {
      id: 'products',
      name: 'Sold Items',
      headers: [
        { title: 'Date & Time', key: 'dateTime', required: false, mobileListLeft: true, visible: true },
        { title: 'Receipt ID', key: 'receiptId', required: false, mobileListLeft: true, visible: false }, // Používáme skutečné ID
        { title: 'Receipt Number', key: 'receiptNumber', required: false, mobileListLeft: true, visible: true }, // Používáme klíč z API
        { title: 'Product', key: 'item', align: 'start', required: true, mobileMain: 'left', visible: true }, // Zástupný symbol pro položku
        { title: 'Quantity', key: 'quantity', align: 'end', required: true, mobileListLeft: false, visible: true }, // Zástupný symbol pro množství
        { title: 'Price/Unit', key: 'pricePerItem', align: 'end', required: false, mobileListLeft: false, visible: true }, // Zástupný symbol pro cenu za jednotku
        { title: 'Total', key: 'total', align: 'end', required: true, mobileMain: 'right', visible: true }, // Změněn klíč na 'total'
        { title: 'Payment Type', key: 'paymentType', align: 'start', required: false, mobileListLeft: false, visible: false },
        { title: 'User', key: 'user', required: false, mobileListLeft: true, visible: false }, // Změněn klíč na 'user'
      ],
      items: [],
    }
  ],

  fetchData: async (locale) => {
    const receiptData = await api.getReceipts(); // Získá data z API

    if (!receiptData || receiptData.length === 0) {
      return { receipts: [], products: [] };
    }

    const priceLocale = locale === 'cs' ? 'cs-CZ' : 'en-GB';
    const currency = locale === 'cs' ? 'CZK' : 'GBP';

    // Zpracování dat pro panel 'receipts'
    const receiptsItems = receiptData
      .map(r => ({
        ...r, // Rozprostře všechny původní vlastnosti z API objektu
        dateTime: formatDate(r.dateTime, { includeSeconds: false }), // Formátuje datum a čas
        // Parsuje řetězec 'total' (např. "78,00 Kč") na číslo a poté formátuje jako měnu.
        total: formatCurrency(parseFloat(r.total.replace(',', '.').replace(/[^\d.-]/g, '')), { locale: priceLocale, currency }),
      }))
      .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

    // Zpracování dat pro panel 'products' (zatím založeno na datech na úrovni účtenek, zástupné symboly pro pole specifická pro položky)
    const productsItems = receiptData
      .map(sale => ({
        ...sale, // Rozprostře všechny původní vlastnosti z API objektu
        dateTime: formatDate(sale.dateTime, { includeSeconds: true }), // Formátuje datum a čas
        // Tyto jsou zástupné symboly, protože data na úrovni položek nejsou v aktuální struktu API odpovědi
        item: 'N/A',
        quantity: 'N/A',
        pricePerItem: 'N/A',
        // Použije celkovou částku účtenky jako 'total' pro 'produkt' a naformátuje ji.
        total: formatCurrency(parseFloat(sale.total.replace(',', '.').replace(/[^\d.-]/g, '')), { locale: priceLocale, currency }),
      }))
      .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

    return {
      receipts: receiptsItems,
      products: productsItems,
    };
  }
};

const {
  loading,
  searchText,
  columnDialog,
  tablePanels,
  activePanelId,
  activePanel,
  handleHeadersUpdate
} = useCompTableData(pageConfig);
</script>
