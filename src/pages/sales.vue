<template>
  <v-container fluid>
    <v-card class="mx-auto" flat>
      <TablePanel v-model:activePanelId="activeTabId" v-model:searchText="searchText" :panels="tablePanels" :show-search="true" :show-filter="true"
        :show-settings="true" :show-sum="true" />

      <ReuseTable v-if="activePanel" :headers="activePanel.headers" :items="activePanel.items" :search="searchText" :loading="loading" />
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { getDemoData } from '@/demo/demoGenerator.js';
import { useAppStore } from '@/stores/app';
import { storeToRefs } from 'pinia';

const searchText = ref('');
const loading = ref(false);
const appStore = useAppStore();
const { appLocale } = storeToRefs(appStore);

const tablePanels = ref([
  {
    id: 'receipts',
    name: 'Created receipts',
    headers: [
      { title: 'Date & Time', key: 'dateTime', required: true, mobileMain: 'left', mobileListLeft: true },
      { title: 'Receipt Number', key: 'receiptId', required: true, mobileListLeft: true },
      { title: 'Amount', key: 'amount', align: 'end', required: true, mobileMain: 'right' },
      { title: 'Payment Type', key: 'paymentType', align: 'start', required: false, mobileListLeft: false },
      { title: 'Customer', key: 'customerName', required: false, mobileListLeft: true },
      { title: 'Note', key: 'note', required: false },
      { title: 'User', key: 'userName', required: false },
    ],
    items: [],
  },
  {
    id: 'products',
    name: 'Sold items',
    headers: [
      { title: 'Date & Time', key: 'dateTime', required: true, mobileListLeft: true },
      { title: 'Receipt Number', key: 'receiptId', required: true, mobileListLeft: true },
      { title: 'Product', key: 'item', align: 'start', required: true, mobileMain: 'left' },
      { title: 'Quantity', key: 'quantity', align: 'end', required: true, mobileListLeft: false },
      { title: 'Price/Unit', key: 'pricePerItem', align: 'end', required: false, mobileListLeft: false },
      { title: 'Total', key: 'totalPrice', align: 'end', required: true, mobileMain: 'right' },
      { title: 'Payment Type', key: 'paymentType', align: 'start', required: false, mobileListLeft: false },
      { title: 'User', key: 'userName', required: false },
    ],
    items: [],
  }
]);

const activeTabId = ref(tablePanels.value[0]?.id);

const activePanel = computed(() => {
  return tablePanels.value.find(p => p.id === activeTabId.value);
});

const formatCustomDate = (dateString, includeSeconds = false) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  const pad = (num) => String(num).padStart(2, '0');

  const date = `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${String(d.getFullYear()).slice(-2)}`;
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const seconds = includeSeconds ? `:${pad(d.getSeconds())}` : '';

  return `${date} ${time}${seconds}`;
}

const loadSalesData = () => {
  loading.value = true;
  const salesData = getDemoData() || [];
  if (salesData.length === 0) {
    tablePanels.value.forEach(p => p.items = []);
    loading.value = false;
    return;
  }

  const priceLocale = appLocale.value === 'cs' ? 'cs-CZ' : 'en-GB';
  const currency = appLocale.value === 'cs' ? 'CZK' : 'GBP';

  const receiptsMap = new Map();
  salesData.forEach(sale => {
    if (!receiptsMap.has(sale.receiptId)) {
      receiptsMap.set(sale.receiptId, { ...sale, amount: 0 });
    }
    receiptsMap.get(sale.receiptId).amount += sale.totalPrice;
  });
  const receiptsItems = Array.from(receiptsMap.values()).map(r => ({
    ...r,
    dateTime: formatCustomDate(r.dateTime),
    amount: r.amount.toLocaleString(priceLocale, { style: 'currency', currency: currency }),
  })).sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

  const productsItems = salesData.map(sale => ({
    ...sale,
    dateTime: formatCustomDate(sale.dateTime, true),
    pricePerItem: sale.pricePerItem.toLocaleString(priceLocale, { style: 'currency', currency: currency }),
    totalPrice: sale.totalPrice.toLocaleString(priceLocale, { style: 'currency', currency: currency }),
  })).sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

  const receiptsPanel = tablePanels.value.find(p => p.id === 'receipts');
  if (receiptsPanel) receiptsPanel.items = receiptsItems;
  const productsPanel = tablePanels.value.find(p => p.id === 'products');
  if (productsPanel) productsPanel.items = productsItems;

  loading.value = false;
};

onMounted(loadSalesData);
watch(appLocale, loadSalesData);
</script>
