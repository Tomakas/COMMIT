<template>
  <v-container fluid>
    <v-card class="mx-auto" flat>
      <TablePanel v-model:activePanelId="activeTabId" v-model:searchText="searchText" :panels="tablePanels"
        :show-search="true" :show-filter="true" :show-settings="true" :show-sum="true" />

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
    id: 'receipts',
    name: 'ÚČTENKY',
    headers: [
      { title: 'Datum a čas', key: 'dateTime', required: true, mobileMain: 'left', mobileListLeft: true },
      { title: 'Číslo účtenky', key: 'receiptNumber', required: true, mobileListLeft: true },
      { title: 'Částka', key: 'amount', align: 'end', required: true, mobileMain: 'right' },
      { title: 'Typ platby', key: 'paymentType', align: 'start', required: false, mobileListLeft: false },
      { title: 'Zákazník', key: 'customer', required: false, mobileListLeft: true },
      { title: 'Poznámka', key: 'note', required: false },
      { title: 'Vytištěno', key: 'printed', align: 'start', required: false },
      { title: 'Uživatel', key: 'user', required: false },
    ],
    items: [
      { dateTime: '10. 06. 25 14:20', receiptNumber: 'DXCT001', amount: '100,00 Kč', paymentType: 'Platba hotově', customer: 'N/A', note: 'N/A', printed: false, user: 'Petra33' },
      { dateTime: '10. 06. 25 14:14', receiptNumber: 'DXCT002', amount: '160,00 Kč', paymentType: 'Platba kartou', customer: 'N/A', note: 'N/A', printed: false, user: 'Petra33' },
      { dateTime: '10. 06. 25 12:00', receiptNumber: 'DXCT008', amount: '50,00 Kč', paymentType: 'Platba hotově', customer: 'Jan Novák', note: 'N/A', printed: true, user: 'Jan Kovac' },
      { dateTime: '10. 06. 25 11:55', receiptNumber: 'DXCT009', amount: '250,00 Kč', paymentType: 'Platba kartou', customer: 'Alice Smith', note: 'Vrácené zboží', printed: false, user: 'Petra33' },
      ...Array.from({ length: 17 }, (_, i) => ({ dateTime: `10. 06. 25 11:${44 - i}`, receiptNumber: `DXCT0${11 + i}`, amount: `${Math.floor(Math.random() * 500)},00 Kč`, paymentType: i % 2 === 0 ? 'Platba hotově' : 'Platba kartou', customer: 'N/A', note: 'N/A', printed: i % 3 === 0, user: 'Petra33' })),
    ],
  },
  {
    id: 'products',
    name: 'PRODUKTY',
    headers: [
      { title: 'Produkt', key: 'product', align: 'start', required: true, mobileMain: 'left' },
      { title: 'Kategorie', key: 'category', required: false, mobileListLeft: true },
      { title: 'Množství', key: 'quantity', align: 'end', required: false, mobileListLeft: true },
      { title: 'Cena/ks', key: 'pricePerUnit', align: 'end', required: false, mobileListLeft: true },
      { title: 'Daň', key: 'tax', align: 'end', required: false, mobileListLeft: false },
      { title: 'Celková cena', key: 'totalPrice', align: 'end', required: true, mobileMain: 'right' },
    ],
    items: Array.from({ length: 55 }, (_, i) => {
      const products = ['Chytré hodinky', 'Laptop Ultra', 'Tablet Air', 'Herní konzole'];
      const categories = ['Elektronika', 'Příslušenství', 'Audio/Video', 'Komponenty'];
      const taxRates = ['21 %', '15 %', '10 %'];

      const product = products[i % products.length];
      const quantity = Math.floor(Math.random() * 10) + 1;
      const pricePerUnit = Math.floor(Math.random() * 900) + 50;
      return {
        product: `${product} #${i + 1}`,
        category: categories[i % categories.length],
        quantity,
        pricePerUnit: `${pricePerUnit},00 Kč`,
        tax: taxRates[i % taxRates.length],
        totalPrice: `${quantity * pricePerUnit},00 Kč`
      };
    }),
  }
]);

const activeTabId = ref(tablePanels.value[0]?.id);

const activePanel = computed(() => {
  return tablePanels.value.find(p => p.id === activeTabId.value);
});
</script>
