<template>
  <v-data-table v-if="!display.mobile.value" :headers="headers" :items="items" :search="search" :loading="loading"
    :items-per-page-text="t('table.itemsPerPage')" class="elevation-0">
    <template v-slot:item.paymentType="{ value }">
      <v-chip :color="getPaymentChipColor(value)" size="small" variant="flat">
        {{ value }}
      </v-chip>
    </template>
    <template v-slot:item.printed="{ value }">
      {{ value ? 'Ano' : 'Ne' }}
    </template>
  </v-data-table>

  <v-list v-else lines="three">
    <v-list-item v-for="(item, index) in filteredItems" :key="index" class="border-b">
      <v-row no-gutters>
        <v-col cols="8" class="text-h6 font-weight-bold">{{ item[mainLeftHeader.key] }}</v-col>
        <v-col cols="4" class="text-h6 text-right font-weight-bold">{{ item[mainRightHeader.key] }}</v-col>

        <v-col cols="8">
          <div v-for="h in listLeftHeaders" :key="h.key" class="text-caption text-medium-emphasis">
            {{ h.title }}: {{ item[h.key] }}
          </div>
        </v-col>
        <v-col cols="4" class="d-flex flex-column align-end">
          <div v-for="h in listRightHeaders" :key="h.key" class="text-caption text-medium-emphasis">
            <v-chip v-if="h.key === 'paymentType'" :color="getPaymentChipColor(item[h.key])" size="x-small"
              variant="flat" class="mt-1">
              {{ item[h.key] }}
            </v-chip>
            <span v-else>{{ item[h.key] }}</span>
          </div>
        </v-col>
      </v-row>
    </v-list-item>
  </v-list>
</template>

<script setup>
import { defineProps, computed } from 'vue';
import { useDisplay } from 'vuetify';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  headers: { type: Array, required: true },
  items: { type: Array, required: true },
  search: { type: String, default: '' },
  loading: { type: Boolean, default: false }
});

const display = useDisplay();
const { t } = useI18n();

// --- Logika pro mobilní zobrazení ---
const mainLeftHeader = computed(() => props.headers.find(h => h.mobileMain === 'left'));
const mainRightHeader = computed(() => props.headers.find(h => h.mobileMain === 'right'));
const listLeftHeaders = computed(() => props.headers.filter(h => h.mobileListLeft === true && !h.mobileMain));
const listRightHeaders = computed(() => props.headers.filter(h => h.mobileListLeft === false && !h.mobileMain));

// Filtrace položek na základě vyhledávacího textu (pro mobilní zobrazení)
const filteredItems = computed(() => {
  if (!props.search) {
    return props.items;
  }
  return props.items.filter(item => {
    return Object.values(item).some(val =>
      String(val).toLowerCase().includes(props.search.toLowerCase())
    );
  });
});

const getPaymentChipColor = (paymentType) => {
  if (paymentType === 'Platba kartou') return 'blue-darken-1';
  if (paymentType === 'Platba hotově') return 'green-darken-1';
  return 'grey';
};
</script>
