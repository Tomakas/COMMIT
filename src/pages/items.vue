<template>
  <v-container fluid>
    <v-card class="mx-auto" flat>
      <TablePanel v-model:activePanelId="activePanelId" v-model:searchText="searchText" :panels="tablePanels" :show-search="true" :show-filter="true"
        :show-settings="true" />

      <ReuseTable v-if="loading || (activePanel && activePanel.items.length > 0)" :headers="activePanel.headers" :items="activePanel.items"
        :search="searchText" :loading="loading" />

      <v-card-text v-if="!loading && activePanel && activePanel.items.length === 0" class="text-center text-medium-emphasis py-8">
        <p>Nejsou žádná data k dispozici.</p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { getProducts } from '@/demo/demoApi.js'; // Importujeme funkci z opraveného demoApi
import { useAppStore } from '@/stores/app';
import { storeToRefs } from 'pinia';

// --- State & Store ---
const searchText = ref('');
const loading = ref(true);
const appStore = useAppStore();
const { appLocale } = storeToRefs(appStore);

// --- Table Configuration ---
const tablePanels = ref([
  {
    id: 'items',
    name: 'Položky',
    headers: [
      { title: 'Název položky', key: 'itemName', align: 'start', minWidth: '220px', required: true, mobileMain: 'left' },
      { title: 'Prodejní cena', key: 'price', align: 'end', required: true, mobileMain: 'right' },
      { title: 'M-Code', key: 'mCode', required: false, mobileListLeft: true },
      { title: 'SKU', key: 'sku', required: false, mobileListLeft: true },
      { title: 'Typ', key: 'itemType', required: false, mobileListLeft: true },
      { title: 'Kategorie', key: 'category', required: false, mobileListLeft: true },
      { title: 'Nákupní cena', key: 'purchasePrice', align: 'end', required: false, mobileListLeft: false },
      { title: 'Skladem', key: 'stockLevel', align: 'end', required: true, mobileListLeft: false },
      { title: 'Jednotka', key: 'unit', align: 'start', required: false, mobileListLeft: false },
      { title: 'Min. sklad', key: 'lowStockThreshold', align: 'end', required: false },
      { title: 'Dodavatel', key: 'supplier', minWidth: '180px', required: false },
      { title: 'K prodeji', key: 'forSale', align: 'center', required: false },
      { title: 'Daň (%)', key: 'tax', align: 'end', required: false },
      { title: 'Alergeny', key: 'allergens', required: false },
      { title: 'Body Zisk', key: 'pointsGained', align: 'end', required: false },
      { title: 'Body Sleva', key: 'pointsForDiscount', align: 'end', required: false },
      { title: 'Věr. sleva', key: 'loyaltyDiscount', align: 'end', required: false },
      { title: 'Poznámka', key: 'note', required: false },
    ],
    items: [],
  },
]);

const activePanelId = ref(tablePanels.value[0]?.id);

const activePanel = computed(() => {
  return tablePanels.value.find(p => p.id === activePanelId.value);
});

// --- Data Loading ---
const loadItems = async () => {
  loading.value = true;
  try {
    // Jednoduché a čisté volání naší API vrstvy
    const data = await getProducts(appLocale.value);

    // Formátování pro zobrazení zůstává v komponentě
    const priceLocale = appLocale.value === 'cs' ? 'cs-CZ' : 'en-GB';
    const currency = appLocale.value === 'cs' ? 'CZK' : 'GBP';
    const forSaleText = {
      yes: appLocale.value === 'cs' ? 'Ano' : 'Yes',
      no: appLocale.value === 'cs' ? 'Ne' : 'No',
    };

    const formattedData = data.map(item => ({
      ...item,
      forSale: item.forSale ? forSaleText.yes : forSaleText.no,
      allergens: Array.isArray(item.allergens) ? item.allergens.join(', ') : (item.allergens || ''),
      price: item.price !== null ? item.price.toLocaleString(priceLocale, { style: 'currency', currency: currency }) : 'N/A',
      purchasePrice: item.purchasePrice !== null ? item.purchasePrice.toLocaleString(priceLocale, { style: 'currency', currency: currency }) : 'N/A',
    }));

    const panel = tablePanels.value.find(p => p.id === 'items');
    if (panel) {
      panel.items = formattedData;
    }
  } catch (error) {
    console.error("Chyba v komponentě Items při volání API:", error);
    const panel = tablePanels.value.find(p => p.id === 'items');
    if (panel) {
      panel.items = [];
    }
  } finally {
    loading.value = false;
  }
};

// --- Lifecycle Hooks ---
onMounted(loadItems);
watch(appLocale, loadItems);
</script>
