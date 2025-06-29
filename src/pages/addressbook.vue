// src/pages/addressbook.vue
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
import { useCompTableData } from '@/composables/compTableData.js';
import api from '@/services/api.js';

const pageConfig = {
  panels: [
    {
      id: 'addressbook',
      name: 'Address Book',
      headers: [
        { title: 'Name', key: 'fullName', required: true, mobileMain: 'left', visible: true },
        { title: 'Category', key: 'category', required: true, mobileListLeft: true, mobileMain: 'right', visible: true },
        { title: 'E-mail', key: 'email', minWidth: '220px', required: false, mobileListLeft: true, visible: true },
        { title: 'Phone', key: 'phone', minWidth: '160px', required: false, mobileListLeft: true, visible: true },
        { title: 'Address', key: 'address', minWidth: '350px', required: false, mobileListLeft: true, visible: true },
      ],
      items: [],
    },
  ],

  fetchData: async (locale) => {
    const data = await api.getDirectory(locale);
    const formattedData = data.map(contact => ({
      ...contact,
      fullName: `${contact.firstName} ${contact.lastName}`,
    }));
    return { addressbook: formattedData };
  }
};

const {
  loading,
  searchText,
  columnDialog,
  tablePanels,
  activePanelId,
  activePanel,
  handleHeadersUpdate
} = useCompTableData(pageConfig);
</script>
