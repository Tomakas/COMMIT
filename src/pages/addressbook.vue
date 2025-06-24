<template>
  <v-container fluid>
    <v-card class="mx-auto" flat>

      <TablePanel v-model:activePanelId="activePanelId" v-model:searchText="searchText" :panels="tablePanels" :show-search="true" :show-filter="true"
        :show-settings="true" />

      <ReuseTable v-if="loading || (activePanel && activePanel.items.length > 0)" :headers="activePanel.headers" :items="activePanel.items"
        :search="searchText" :loading="loading" />

      <v-card-text v-if="!loading && activePanel && activePanel.items.length === 0" class="text-center text-medium-emphasis py-8">
        <p>No contacts available in the address book.</p>
      </v-card-text>

    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { getDirectory } from '@/demo/demoApi.js';
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
    id: 'addressbook',
    name: 'Address Book',
    headers: [
      { title: 'Name', key: 'fullName', minWidth: '220px', required: true, mobileMain: 'left' },
      { title: 'Category', key: 'category', required: true, mobileListLeft: true, mobileMain: 'right' },
      { title: 'E-mail', key: 'email', minWidth: '220px', required: false, mobileListLeft: true },
      { title: 'Phone', key: 'phone', minWidth: '160px', required: true, mobileListLeft: true },
      { title: 'Address', key: 'address', minWidth: '350px', required: false, mobileListLeft: false },
    ],
    items: [],
  },
]);

const activePanelId = ref(tablePanels.value[0]?.id);

const activePanel = computed(() => {
  return tablePanels.value.find(p => p.id === activePanelId.value);
});

// --- Data Loading ---
const loadDirectory = async () => {
  loading.value = true;
  try {
    const data = await getDirectory(appLocale.value);

    const formattedData = data.map(contact => ({
      ...contact,
      fullName: `${contact.firstName} ${contact.lastName}`,
    }));

    const panel = tablePanels.value.find(p => p.id === 'addressbook');
    if (panel) {
      panel.items = formattedData;
    }
  } catch (error) {
    console.error("Error loading address book:", error);
    const panel = tablePanels.value.find(p => p.id === 'addressbook');
    if (panel) {
      panel.items = [];
    }
  } finally {
    loading.value = false;
  }
};

// --- Lifecycle Hooks ---
onMounted(loadDirectory);
watch(appLocale, loadDirectory);
</script>
