// src/pages/sales.vue
<template>
  <v-container fluid>
    <v-card class="mx-auto" flat>
      <TablePanel v-model:activePanelId="activePanelId" v-model:searchText="searchText" :panels="tablePanels" :show-search="true" :show-filter="true"
        :show-settings="true" :show-sum="true" @open-settings="columnDialog = true" @open-filter="filterDialog = true" />
      <v-toolbar v-if="activePanelId === 'receipts' && !loading" flat class="px-4 py-2">
        <v-spacer></v-spacer>
        <span class="text-subtitle-1 mr-4">
          {{ $t('sales.totalSales') }}: <span class="font-weight-bold">{{ totalSum }}</span>
        </span>
        <span class="text-subtitle-1">
          {{ $t('sales.totalReceipts') }}: <span class="font-weight-bold">{{ totalReceipts }}</span>
        </span>
      </v-toolbar>
      <ReuseTable v-if="activePanel" :headers="activePanel.headers" :items="activePanel.items" :search="searchText" :loading="loading"
        v-model:page="currentPage" v-model:items-per-page="itemsPerPage" :total-items="totalReceipts" />
    </v-card>
    <ColumnSettingsDialog v-if="activePanel" v-model:dialog="columnDialog" :headers="activePanel.headers" @update:headers="handleHeadersUpdate" />

    <FilterTableDialog v-model:dialog="filterDialog" @apply-filters="applyDateRangeFilter" />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCompTableData } from '@/composables/compTableData.js';
import { getReceipts, getReceiptsSum } from '@/services/api.js'; // getReceiptsSum je potřeba zde pro pageConfig
import { formatDate } from '@/utils/formatters.js';

import { ReceiptHeaders, ReceiptModel } from '@/models/receiptModel.js';
import { useAppStore } from '@/stores/app';
import { storeToRefs } from 'pinia';

import FilterTableDialog from '@/components/table/FilterTableDialog.vue';

const appStore = useAppStore();
const { getReceiptsFrom, getReceiptsTo } = storeToRefs(appStore);

const filterDialog = ref(false);

const pageConfig = {
  panels: [
    {
      id: 'receipts',
      name: 'Receipts',
      headers: ReceiptHeaders,
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

  // fetchData nyní dostává page, limit a commonFilterParams
  fetchData: async (locale, page, limit, commonFilterParams) => {
    // Sloučíme společné parametry s těmi pro paginaci
    const queryParams = {
      ...commonFilterParams,
      "limit": limit,
      "page": page - 1, // API paginace je často od 0, Vuetify pagination od 1
    };

    const salesApiResponse = await getReceipts(queryParams);

    const salesDataList = salesApiResponse?.list || [];

    if (!salesDataList || salesDataList.length === 0) {
      // Vracíme jen položky, totalCount se získá z get-receipts-sum
      return { receipts: { items: [], totalCount: 0 }, products: { items: [], totalCount: 0 } };
    }

    const receiptsItems = salesDataList
      .map(r => {
        const newReceipt = ReceiptModel();
        return {
          ...newReceipt,
          ...r,
          dateTime: formatDate(r.dateTime, { includeSeconds: false }),
        };
      });

    const productsItems = [];

    // Důležité: Zde již nevracíme totalCountFromApi pro receipts,
    // protože ho spravuje fetchSumData.
    return {
      receipts: { items: receiptsItems, totalCount: 0 }, // Nastaveno na 0, protože se plní z totalReceipts store
      products: { items: productsItems, totalCount: 0 },
    };
  },

  fetchSumData: async (locale, commonFilterParams) => {
    const sumQueryParams = { ...commonFilterParams };
    delete sumQueryParams.limit; // Zajistí, že limit nebude odeslán
    delete sumQueryParams.page;  // Zajistí, že page nebude odeslán

    const sumApiResponse = await getReceiptsSum(sumQueryParams);
    return {
      sum: sumApiResponse.sum || '0,00 Kč',
      total: sumApiResponse.total || '0', // API vrací total jako string
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
  handleHeadersUpdate,
  loadData,
  currentPage,
  itemsPerPage,
  totalReceipts,
  totalSum,
} = useCompTableData(pageConfig);


const applyDateRangeFilter = () => {
  currentPage.value = 1;
  loadData();
  console.log('Filtrování dat pro rozsah:', getReceiptsFrom.value, 'až', getReceiptsTo.value);
};

onMounted(() => {
  if (!getReceiptsFrom.value || !getReceiptsTo.value) {
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    getReceiptsFrom.value = formattedToday;
    getReceiptsTo.value = formattedToday;
  }
});
</script>
