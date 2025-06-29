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
import api from '@/api/API.js';
import { formatDate, formatCurrency } from '@/utils/formatters.js';

const pageConfig = {
  panels: [
    {
      id: 'receipts',
      name: 'Receipts',
      headers: [
        { title: 'Date & Time', key: 'dateTime', required: true, mobileMain: 'left', mobileListLeft: true, visible: true },
        { title: 'Receipt Number', key: 'receiptId', required: true, mobileListLeft: true, visible: true },
        { title: 'Amount', key: 'amount', align: 'end', required: true, mobileMain: 'right', visible: true },
        { title: 'Payment Type', key: 'paymentType', align: 'start', required: false, mobileListLeft: false, visible: true },
        { title: 'Customer', key: 'customerName', required: false, mobileListLeft: true, visible: true },
        { title: 'Note', key: 'note', required: false, mobileListLeft: true, visible: false },
        { title: 'User', key: 'userName', required: false, mobileListLeft: true, visible: true },
      ],
      items: [],
    },
    {
      id: 'products',
      name: 'Sold Items',
      headers: [
        { title: 'Date & Time', key: 'dateTime', required: false, mobileListLeft: true, visible: true },
        { title: 'Receipt Number', key: 'receiptId', required: false, mobileListLeft: true, visible: true },
        { title: 'Product', key: 'item', align: 'start', required: true, mobileMain: 'left', visible: true },
        { title: 'Quantity', key: 'quantity', align: 'end', required: true, mobileListLeft: false, visible: true },
        { title: 'Price/Unit', key: 'pricePerItem', align: 'end', required: false, mobileListLeft: false, visible: true },
        { title: 'Total', key: 'totalPrice', align: 'end', required: true, mobileMain: 'right', visible: true },
        { title: 'Payment Type', key: 'paymentType', align: 'start', required: false, mobileListLeft: false, visible: false },
        { title: 'User', key: 'userName', required: false, mobileListLeft: true, visible: false },
      ],
      items: [],
    }
  ],

  fetchData: async (locale) => {
    const salesData = await api.getReceipt();

    if (!salesData || salesData.length === 0) {
      return { receipts: [], products: [] };
    }

    const priceLocale = locale === 'cs' ? 'cs-CZ' : 'en-GB';
    const currency = locale === 'cs' ? 'CZK' : 'GBP';

    const receiptsMap = new Map();
    salesData.forEach(sale => {
      if (!receiptsMap.has(sale.receiptId)) {
        receiptsMap.set(sale.receiptId, { ...sale, amount: 0 });
      }
      receiptsMap.get(sale.receiptId).amount += sale.totalPrice;
    });

    const receiptsItems = Array.from(receiptsMap.values())
      .map(r => ({
        ...r,
        dateTime: formatDate(r.dateTime, { includeSeconds: false }),
        amount: formatCurrency(r.amount, { locale: priceLocale, currency }),
      }))
      .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

    const productsItems = salesData
      .map(sale => ({
        ...sale,
        dateTime: formatDate(sale.dateTime, { includeSeconds: true }),
        pricePerItem: formatCurrency(sale.pricePerItem, { locale: priceLocale, currency }),
        totalPrice: formatCurrency(sale.totalPrice, { locale: priceLocale, currency }),
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
