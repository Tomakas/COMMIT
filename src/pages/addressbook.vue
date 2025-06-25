<template>
  <v-container fluid>
    <v-card class="mx-auto" flat>
      <TablePanel v-model:activePanelId="activePanelId" v-model:searchText="searchText" :panels="tablePanels" :show-search="true" :show-filter="true"
        :show-settings="true" @open-settings="columnDialog = true" />
      <ReuseTable v-if="activePanel" :headers="activePanel.headers" :items="activePanel.items" :search="searchText" :loading="loading" />

      <v-card-text v-if="!loading && activePanel && activePanel.items.length === 0" class="text-center text-medium-emphasis py-8">
        <p>No contacts available in the address book.</p>
      </v-card-text>
    </v-card>

    <ColumnSettingsDialog v-if="activePanel" v-model:dialog="columnDialog" :headers="activePanel.headers" @update:headers="handleHeadersUpdate" />
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { getDirectory } from '../demo/demoAPI.js';
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
    id: 'addressbook',
    name: 'Address Book',
    headers: [
      { title: 'Name', key: 'fullName', required: true, mobileMain: 'left', visible: true },
      { title: 'Category', key: 'category', required: true, mobileListLeft: true, mobileMain: 'right', visible: true },
      { title: 'E-mail', key: 'email', minWidth: '220px', required: false, mobileListLeft: true, visible: true },
      { title: 'Phone', key: 'phone', minWidth: '160px', required: false, mobileListLeft: true, visible: true },
      { title: 'Address', key: 'address', minWidth: '350px', required: false, mobileListLeft: false, visible: true },
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

const loadDirectory = async () => {
  loading.value = true;
  try {
    const data = await getDirectory(appLocale.value);
    const formattedData = data.map(contact => ({ ...contact, fullName: `${contact.firstName} ${contact.lastName}`, }));
    const panel = tablePanels.value.find(p => p.id === 'addressbook');
    if (panel) { panel.items = formattedData; }
  } catch (error) {
    console.error("Error in Addressbook component when calling API:", error);
    const panel = tablePanels.value.find(p => p.id === 'addressbook');
    if (panel) { panel.items = []; }
  } finally {
    loading.value = false;
  }
};

onMounted(loadDirectory);
watch(appLocale, loadDirectory);
</script>
