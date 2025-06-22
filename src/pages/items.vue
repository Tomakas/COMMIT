<template>
  <v-container fluid>
    <v-card class="mx-auto" flat>
      <TablePanel v-model:activePanelId="activePanelId" v-model:searchText="searchText" :panels="tablePanels"
        :show-search="true" :show-filter="true" :show-settings="true" />

      <ReuseTable v-if="activePanel" :headers="activePanel.headers" :items="activePanel.items" :search="searchText" />
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import TablePanel from '@/components/table/tablePanel.vue';
import ReuseTable from '@/components/table/reuseTable.vue';

const searchText = ref('');

const tablePanels = ref([
  {
    id: 'items',
    name: 'Položky',
    // 1. KROK: Úprava hlaviček
    headers: [
      { title: 'Kód/SKU', key: 'sku', align: 'start', required: true, mobileListLeft: true },
      { title: 'Název položky', key: 'name', align: 'start', minWidth: '250px', required: true, mobileMain: 'left' },
      { title: 'Kategorie', key: 'category', required: false, mobileListLeft: true },
      { title: 'Cena', key: 'price', align: 'end', required: true, mobileMain: 'right' },
      { title: 'Daň', key: 'tax', align: 'end', required: false, mobileListLeft: false }, // PŘIDÁNO
      { title: 'Skladem', key: 'stock', align: 'end', required: true, mobileListLeft: true }, // Změna na pravou stranu pro lepší balanc
      { title: 'Status', key: 'status', align: 'center', required: false, mobileListLeft: true }, // Změna na pravou stranu pro lepší balanc
    ],
    // 2. KROK: Úprava generování dat
    items: Array.from({ length: 78 }, (_, i) => {
      const categories = ['Elektronika', 'Domácnost', 'Oblečení', 'Potraviny', 'Nářadí'];
      const taxRates = ['21 %', '15 %', '10 %']; // PŘIDÁNO
      return {
        sku: `SKU-${(2025000 + i).toString()}`,
        name: `Produkt ${String.fromCharCode(65 + (i % 26))}${i}`,
        category: categories[i % categories.length],
        price: `${(Math.random() * 2000 + 50).toFixed(2).replace('.', ',')} Kč`,
        tax: taxRates[i % taxRates.length], // PŘIDÁNO
        stock: Math.floor(Math.random() * 100),
        status: i % 10 === 0 ? 'Neaktivní' : 'Aktivní',
      }
    }),
  },
]);

// ID aktivního panelu - nastaví se na ID jediného panelu v poli
const activePanelId = ref(tablePanels.value[0]?.id);

// Vypočítaná vlastnost, která vrací konfiguraci aktivního panelu
const activePanel = computed(() => {
  return tablePanels.value.find(p => p.id === activePanelId.value);
});
</script>
