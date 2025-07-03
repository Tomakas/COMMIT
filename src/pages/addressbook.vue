<template>
  <v-container fluid>
    <v-card class="mx-auto" flat>
      <TablePanel v-model:activePanelId="activePanelId" v-model:searchText="searchText" :panels="tablePanels" :show-search="true" :show-filter="true"
        :show-settings="true" @open-settings="columnDialog = true" />
      <ReuseTable v-if="activePanel" :headers="activePanel.headers" :items="activePanel.items" :search="searchText" :loading="loading"
        v-model:page="currentPage" v-model:items-per-page="itemsPerPage" :total-items="totalItems" />
      <v-card-text v-if="!loading && activePanel && activePanel.items.length === 0" class="text-center text-medium-emphasis py-8">
        <p>{{ t('addressbook.noContacts') }}</p>
      </v-card-text>
    </v-card>
    <ColumnSettingsDialog v-if="activePanel" v-model:dialog="columnDialog" :headers="activePanel.headers" @update:headers="handleHeadersUpdate" table-id="addressbook" />
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCompTableData } from '@/composables/compTableData.js';
import { getCustomers } from '@/services/api.js';
import { ContactHeaders, ContactModel } from '@/models/contactModel.js';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const pageConfig = {
  panels: [
    {
      id: 'customers',
      name: 'Customers',
      headers: ContactHeaders.map(header => ({ ...header, title: t(header.title) })),
      items: [],
    },
  ],

  fetchData: async (locale, page, limit, fetchParams) => {
    const offset = (page - 1) * limit;

    const customersApiResponse = await getCustomers({
      query: fetchParams.query,
      limit: limit,
      offset: offset,
      sortData: {
        sortBy: 'name',
        sortType: 'asc',
      },
    });

    const customersDataList = customersApiResponse?.subjects || [];
    const totalCustomersFromApi = customersApiResponse?.subjects.length || 0; // Assuming API returns all subjects and we count them

    const formattedData = customersDataList.map(customer => {
      const newContact = ContactModel();
      return {
        ...newContact,
        ...customer,
      };
    });

    return {
      customers: { items: formattedData, totalCount: totalCustomersFromApi }
    };
  }
};

const {
  loading,
  searchText,
  columnDialog,
  tablePanels,
  activePanelId,
  activePanel,
  handleHeadersUpdate,
  currentPage,
  itemsPerPage,
  totalItems,
} = useCompTableData(pageConfig);
</script>