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
import { ref, computed, onMounted, watch } from 'vue';
import { getProducts } from '../demo/demoAPI.js';
import { useAppStore } from '@/stores/app';
import { storeToRefs } from 'pinia';
import ColumnSettingsDialog from '../components/table/ColumnSettingsDialog.vue';

const columnDialog = ref(false);
const searchText = ref('');
const loading = ref(true);
const appStore = useAppStore();
const { appLocale } = storeToRefs(appStore);

const tablePanels = ref([
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
      { title: 'Purchase Price', key: 'purchasePrice', align: 'end', required: false, mobileListLeft: false, visible: true },
      { title: 'In Stock', key: 'stockLevel', align: 'end', required: true, mobileListLeft: false, visible: true },
      { title: 'Unit', key: 'unit', align: 'start', required: false, mobileListLeft: false, visible: false },
      { title: 'Min. Stock', key: 'lowStockThreshold', align: 'end', required: false, visible: false },
      { title: 'Supplier', key: 'supplier', minWidth: '180px', required: false, visible: true },
      { title: 'For Sale', key: 'forSale', align: 'center', required: false, visible: false },
      { title: 'Tax (%)', key: 'tax', align: 'end', required: false, visible: false },
      { title: 'Allergens', key: 'allergens', required: false, visible: false },
      { title: 'Points Gained', key: 'pointsGained', align: 'end', required: false, visible: false },
      { title: 'Points For Discount', key: 'pointsForDiscount', align: 'end', required: false, visible: false },
      { title: 'Loyalty Discount', key: 'loyaltyDiscount', align: 'end', required: false, visible: false },
      { title: 'Note', key: 'note', required: false, visible: false },
    ],
    items: [],
  },
]);

const activePanelId = ref(tablePanels.value[0]?.id);

const activePanel = computed(() => {
  return tablePanels.value.find(p => p.id === activePanelId.value);
});

const handleHeadersUpdate = (newHeaders) => {
  if (activePanel.value) {
    activePanel.value.headers = newHeaders;
  }
};

const loadItems = async () => {
  loading.value = true;
  try {
    const data = await getProducts(appLocale.value);
    const priceLocale = appLocale.value === 'cs' ? 'cs-CZ' : 'en-GB';
    const currency = appLocale.value === 'cs' ? 'CZK' : 'GBP';
    const forSaleText = { yes: appLocale.value === 'cs' ? 'Ano' : 'Yes', no: appLocale.value === 'cs' ? 'Ne' : 'No' };
    const formattedData = data.map(item => ({ ...item, forSale: item.forSale ? forSaleText.yes : forSaleText.no, allergens: Array.isArray(item.allergens) ? item.allergens.join(', ') : (item.allergens || ''), price: item.price !== null ? item.price.toLocaleString(priceLocale, { style: 'currency', currency: currency }) : 'N/A', purchasePrice: item.purchasePrice !== null ? item.purchasePrice.toLocaleString(priceLocale, { style: 'currency', currency: currency }) : 'N/A', }));
    const panel = tablePanels.value.find(p => p.id === 'items');
    if (panel) { panel.items = formattedData; }
  } catch (error) {
    console.error("Error in Items component when calling API:", error);
    const panel = tablePanels.value.find(p => p.id === 'items');
    if (panel) { panel.items = []; }
  } finally {
    loading.value = false;
  }
};

onMounted(loadItems);
watch(appLocale, loadItems);
</script>
