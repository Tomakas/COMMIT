pages/items.vue
<template>
  <v-container fluid>
    <v-card class="mx-auto" flat>
      <TablePanel v-model:activePanelId="activePanelId" v-model:searchText="searchText" :panels="tablePanels" :show-search="true" :show-filter="true"
        :show-settings="true" @open-settings="columnDialog = true" />
      <ReuseTable v-if="activePanel" :headers="activePanel.headers" :items="activePanel.items" :search="searchText" :loading="loading"
        v-model:page="currentPage" v-model:items-per-page="itemsPerPage" :total-items="totalItems" v-model:sort-by="sortBy" v-model:sort-desc="sortDesc" :highlight-text="searchText" />
      <v-card-text v-if="!loading && activePanel && activePanel.items.length === 0" class="text-center text-medium-emphasis py-8">
        <p>{{ t('common.noDataAvailable') }}</p>
      </v-card-text>
    </v-card>
    <ColumnSettingsDialog v-if="activePanel" v-model:dialog="columnDialog" :headers="activePanel.headers" @update:headers="handleHeadersUpdate" table-id="items" />
  </v-container>
</template>

<script setup>
import { useCompTableData } from '@/composables/compTableData.js';
import { getItems } from '@/services/api.js';
import { formatCurrency } from '@/utils/formatters.js';

import { ItemHeaders, ItemModel } from '@/models/itemModel.js';

import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const pageConfig = {
  panels: [
    {
      id: 'items',
      name: 'Items',
      headers: ItemHeaders.map(header => ({ ...header, title: t(header.title) })),
      items: [],
    },
  ],

  fetchData: async (locale, page, limit, fetchParams) => {
    const offset = (page - 1) * limit; // Vypočítáme offset

    const sortByKey = fetchParams.sortBy[0]?.key === 'text' ? 'item' : fetchParams.sortBy[0]?.key;

    const itemsApiResponse = await getItems({
      query: fetchParams.query,
      categoryIdFilter: null,
      categoryRootFilter: false,
      sortData: {
        sortBy: sortByKey,
        sortType: fetchParams.sortBy[0]?.order,
      },
      onlyOnSale: true,
      limitAndOffset: {
        limit: limit,
        offset: offset,
      },
    });

    const itemsDataList = itemsApiResponse?.items || [];
    const totalItemsFromApi = itemsApiResponse?.totalItems || 0; // Získáváme totalItems z API odpovědi

    const priceLocale = locale === 'cs' ? 'cs-CZ' : 'en-GB';
    const currency = locale === 'cs' ? 'CZK' : 'GBP';

    // Pomocná mapa pro rychlejší lookup kategorií podle ID
    const categoryMap = new Map((itemsApiResponse?.categories || []).map(cat => [cat.categoryId, cat.name]));

    const formattedData = itemsDataList.map(item => {
      const newItem = ItemModel();
      return {
        ...newItem,
        ...item,
        text: item.text,
        price: formatCurrency(item.price, { locale: priceLocale, currency }),
        purchasePrice: formatCurrency(item.purchasePrice, { locale: priceLocale, currency }),
        onSale: item.onSale ? (locale === 'cs' ? 'Ano' : 'Yes') : (locale === 'cs' ? 'Ne' : 'No'),
        allergens: Array.isArray(item.allergens) ? item.allergens.join(', ') : (item.allergens || ''),
        itemType: item.itemType || 'Product',
        category: categoryMap.get(item.categoryId) || 'N/A', // Mapujeme categoryId na jméno
        stockLevel: item.stockLevel || 0,
        unit: item.unit || (locale === 'cs' ? 'ks' : 'pcs'),
        lowStockThreshold: item.lowStockThreshold || 0,
        tax: item.tax || 0,
        pointsGained: item.loyaltySettings?.gainPoints || 0,
        pointsForDiscount: item.loyaltySettings?.usePoints || 0,
        loyaltyDiscount: item.loyaltySettings?.discount || 0,
      };
    });

    // Zde je důležité vrátit totalCount, který bude použit v useCompTableData
    return {
      items: { items: formattedData, totalCount: totalItemsFromApi }
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
  totalItems,
  sortBy,
  sortDesc,
} = useCompTableData(pageConfig);
</script>