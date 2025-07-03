<template>
  <div>
    <h1>Sales Overview</h1>
    <p v-if="loading">Loading receipts...</p>
    <p v-if="error" class="error-message">Error loading: {{ error.message }}</p>
    <div v-else>
      <ul>
        <li v-for="receipt in receipts" :key="receipt.id">
          Účtenka #{{ receipt.id }}: {{ receipt.amount }} {{ receipt.currency }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getReceipts } from '@/services/api'; // Importujeme naši funkci

const receipts = ref([]);
const loading = ref(false);
const error = ref(null);

const fetchReceipts = async () => {
  loading.value = true;
  error.value = null; // Vyresetujeme chybu před novým voláním

  // Příklad parametrů dotazu (tyto by se obvykle načítaly z formuláře, store atd.)
  const queryParams = {
    "custom": "[\"2024-05-04\",\"2024-05-04\"]",
    "customTime": "[null,null]",
    "day": "yesterday",
    "filter": {
      "customer": "",
      "device": "",
      "discount": "",
      "paymentType": "",
      "query": "",
      "totalFrom": "",
      "totalTo": "",
      "user": "",
      "valid": ""
    },
    "generateFilters": false,
    "limit": 50,
    "month": 1,
    "quarter": 1,
    "sortData": {
      "sortBy": "dateTime",
      "sortType": "desc"
    },
    "type": "year",
    "useServerTime": false,
    "week": "thisWeek",
    "year": 2025
  };

  try {
    // Voláme naši API funkci
    const data = await getReceipts(queryParams);
    receipts.value = data;
  } catch (err) {
    // Zpracujeme chybu, která se prohodila z api.js
    console.error("Chyba v komponentě při načítání účtenek:", err);
    error.value = err;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchReceipts();
});
</script>

<style scoped>
.error-message {
  color: red;
}
</style>