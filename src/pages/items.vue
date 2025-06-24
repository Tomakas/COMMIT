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
import TablePanel from '@/components/table/tablePanel.vue';
import ReuseTable from '@/components/table/reuseTable.vue';
import { getProducts } from '@/demo/demoApi.js';
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
    items: [], // Inicializujeme jako prázdné pole, naplní se po načtení
  },
]);

const activePanelId = ref(tablePanels.value[0]?.id);

const activePanel = computed(() => {
  return tablePanels.value.find(p => p.id === activePanelId.value);
});

// --- Data Loading ---
const loadItems = async () => {
  loading.value = true;
  const data = await getProducts(appLocale.value);

  // Přeformátování dat pro zobrazení v tabulce
  const formattedData = data.map(item => ({
    ...item,
    forSale: item.forSale ? 'Ano' : 'Ne',
    allergens: Array.isArray(item.allergens) ? item.allergens.join(', ') : (item.allergens || ''),
    price: item.price !== null ? item.price.toLocaleString('cs-CZ', { style: 'currency', currency: 'CZK' }) : 'N/A',
    purchasePrice: item.purchasePrice !== null ? item.purchasePrice.toLocaleString('cs-CZ', { style: 'currency', currency: 'CZK' }) : 'N/A',
  }));

  const panel = tablePanels.value.find(p => p.id === 'items');
  if (panel) {
    panel.items = formattedData;
  }
  loading.value = false;
};

// --- Lifecycle Hooks ---
onMounted(loadItems);
watch(appLocale, loadItems);

</script>
