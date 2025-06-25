// src/pages/items.vue
<template>
  <v-container fluid>
    <v-card class="mx-auto" flat>
      <TablePanel v-model:activePanelId="activePanelId" v-model:searchText="searchText" :panels="tablePanels" :show-search="true" :show-filter="true"
        :show-settings="true" @open-settings="columnDialog = true" />
      <ReuseTable v-if="activePanel" :headers="activePanel.headers" :items="activePanel.items" :search="searchText" :loading="loading" />
      <v-card-text v-if="!loading && activePanel && activePanel.items.length === 0" class="text-center text-medium-emphasis py-8">
        <p>No data available.</p>
      </v-card-text>
    </v-card>
    <ColumnSettingsDialog v-if="activePanel" v-model:dialog="columnDialog" :headers="activePanel.headers" @update:headers="handleHeadersUpdate" />
  </v-container>
</template>

<script setup>
import { useCompTableData } from '@/composables/compTableData.js';
import { getItems } from '@/api/index.js';
import { formatCurrency } from '@/utils/formatters.js';

const pageConfig = {
  panels: [
    {
      id: 'items',
      name: 'Items',
      headers: [
        { title: 'Item Name', key: 'itemName', required: true, mobileMain: 'left', visible: true },
        { title: 'Sale Price', key: 'price', align: 'end', required: true, mobileMain: 'right', visible: true },
        { title: 'M-Code', key: 'mCode', required: false, mobileListLeft: true, visible: true },
        { title: 'SKU', key: 'sku', required: false, mobileListLeft: true, visible: true },
        { title: 'Type', key: 'itemType', required: false, mobileListLeft: true, visible: true },
        { title: 'Category', key: 'category', required: false, mobileListLeft: true, visible: true },
        { title: 'Purchase Price', key: 'purchasePrice', align: 'end', required: false, mobileListLeft: true, visible: true },
        { title: 'In Stock', key: 'stockLevel', align: 'end', required: true, mobileListLeft: true, visible: true },
        { title: 'Unit', key: 'unit', align: 'start', required: false, mobileListLeft: true, visible: false },
        { title: 'Min. Stock', key: 'lowStockThreshold', align: 'end', required: false, mobileListLeft: true, visible: false },
        { title: 'Supplier', key: 'supplier', minWidth: '180px', required: false, mobileListLeft: true, visible: true },
        { title: 'For Sale', key: 'forSale', align: 'center', required: false, mobileListLeft: true, visible: false },
        { title: 'Tax (%)', key: 'tax', align: 'end', required: false, mobileListLeft: false, visible: false },
        { title: 'Allergens', key: 'allergens', required: false, mobileListLeft: true, visible: false },
        { title: 'Points Gained', key: 'pointsGained', align: 'end', required: false, mobileListLeft: true, isible: false },
        { title: 'Points For Discount', key: 'pointsForDiscount', align: 'end', required: false, mobileListLeft: true, visible: false },
        { title: 'Loyalty Discount', key: 'loyaltyDiscount', align: 'end', required: false, mobileListLeft: true, visible: false },
        { title: 'Note', key: 'note', required: false, visible: false },
      ],
      items: [],
    },
  ],

  fetchData: async (locale) => {
    const data = await getItems(locale);

    const priceLocale = locale === 'cs' ? 'cs-CZ' : 'en-GB';
    const currency = locale === 'cs' ? 'CZK' : 'GBP';

    const formattedData = data.map(item => ({
      ...item,
      forSale: item.forSale ? (locale === 'cs' ? 'Ano' : 'Yes') : (locale === 'cs' ? 'Ne' : 'No'),
      allergens: Array.isArray(item.allergens) ? item.allergens.join(', ') : (item.allergens || ''),
      price: formatCurrency(item.price, { locale: priceLocale, currency }),
      purchasePrice: formatCurrency(item.purchasePrice, { locale: priceLocale, currency }),
    }));
    return { items: formattedData };
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
