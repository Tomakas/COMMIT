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
    <ColumnSettingsDialog v-if="activePanel" v-model:dialog="columnDialog" :headers="activePanel.headers" @update:headers="handleHeadersUpdate" table-id="sales" />

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

import { useI18n } from 'vue-i18n';

const appStore = useAppStore();
const { getReceiptsFrom, getReceiptsTo } = storeToRefs(appStore);

const filterDialog = ref(false);
const { t } = useI18n();

const pageConfig = {
  panels: [
    {
      id: 'receipts',
      name: 'Receipts',
      headers: ReceiptHeaders.map(header => ({ ...header, title: t(header.title) })),
      items: [],
    },
    {
      id: 'products',
      name: 'Sold Items',
      headers: [
        { title: t('table.headers.dateTime'), key: 'dateTime', required: false, mobileListLeft: true, visible: true },
        { title: t('table.headers.receiptId'), key: 'receiptId', required: false, mobileListLeft: true, visible: false },
        { title: t('table.headers.receiptNumber'), key: 'receiptNumber', required: false, mobileListLeft: true, visible: true },
        { title: t('table.headers.product'), key: 'item', align: 'start', required: true, mobileMain: 'left', visible: true },
        { title: t('table.headers.quantity'), key: 'quantity', align: 'end', required: true, mobileListLeft: false, visible: true },
        { title: t('table.headers.pricePerUnit'), key: 'pricePerItem', align: 'end', required: false, mobileListLeft: false, visible: true },
        { title: t('table.headers.total'), key: 'total', align: 'end', required: true, mobileMain: 'right', visible: true },
        { title: t('table.headers.paymentType'), key: 'paymentType', align: 'start', required: false, mobileListLeft: false, visible: false },
        { title: t('table.headers.user'), key: 'user', required: false, mobileListLeft: true, visible: false },
      ],
      items: [],
    }
  ],

  // fetchData nyní dostává page, limit a commonFilterParams
  fetchData: async (locale, page, limit, fetchParams) => {
    const filterParams = {
      custom: JSON.stringify([getReceiptsFrom.value, getReceiptsTo.value]),
      customTime: "[null,null]",
      generateFilters: true,
      filter: { "paymentType": "", "user": "", "device": "", "totalFrom": "", "totalTo": "", "query": fetchParams.query, "discount": "", "valid": "", "customer": "" },
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      quarter: Math.floor((new Date().getMonth() + 3) / 3),
      day: "today",
      week: "thisWeek",
      useServerTime: false,
      type: "custom",
    };

    const queryParams = {
      ...filterParams,
      limit: limit,
      page: page - 1,
    };

    const salesApiResponse = await getReceipts(queryParams);

    const salesDataList = salesApiResponse?.list || [];

    if (!salesDataList || salesDataList.length === 0) {
      return { receipts: { items: [], totalCount: 0 }, products: { items: [], totalCount: 0 } };
    }

    const receiptsItems = salesDataList.map(r => {
      const newReceipt = ReceiptModel();
      return {
        ...newReceipt,
        ...r,
        dateTime: formatDate(r.dateTime, { includeSeconds: false }),
      };
    });

    const productsItems = [];

    return {
      receipts: { items: receiptsItems, totalCount: salesApiResponse?.total || 0 },
      products: { items: productsItems, totalCount: 0 },
    };
  },

  fetchSumData: async (locale, fetchParams) => {
    const filterParams = {
      custom: JSON.stringify([getReceiptsFrom.value, getReceiptsTo.value]),
      customTime: "[null,null]",
      generateFilters: true,
      filter: { "paymentType": "", "user": "", "device": "", "totalFrom": "", "totalTo": "", "query": fetchParams.query, "discount": "", "valid": "", "customer": "" },
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      quarter: Math.floor((new Date().getMonth() + 3) / 3),
      day: "today",
      week: "thisWeek",
      useServerTime: false,
      type: "custom",
    };

    const sumApiResponse = await getReceiptsSum(filterParams);
    return {
      sum: sumApiResponse.sum || '0,00 Kč',
      total: sumApiResponse.total || '0',
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