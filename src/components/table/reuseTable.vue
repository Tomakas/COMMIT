<template>
  <v-data-table v-if="!display.mobile.value" :headers="visibleHeaders" :items="filteredItems" :loading="loading" class="elevation-0" v-model:page="page" v-model:items-per-page="itemsPerPage" hide-default-footer>
    <template v-slot:item.paymentType="{ value }">
      <v-chip :color="getPaymentChipColor(value)" size="small" variant="flat">{{ value }}</v-chip>
    </template>
    <template v-slot:item.printed="{ value }">{{ value ? 'Ano' : 'Ne' }}</template>

    <template #bottom>
      <div class="d-flex justify-space-between align-center px-4 py-2">
        <v-select v-model="itemsPerPage" :items="[10, 20, 40, 80]" :label="t('table.itemsPerPage')" density="compact" hide-details variant="outlined" style="max-width: 180px;"></v-select>
        <v-pagination v-model="page" :length="pageCount" :total-visible="5" density="compact"></v-pagination>
        <div class="text-caption" style="min-width: 80px; text-align: right;">
          {{ (page - 1) * itemsPerPage + 1 }}-{{ Math.min(page * itemsPerPage, filteredItems.length) }}
          z {{ filteredItems.length }}
        </div>
      </div>
    </template>
  </v-data-table>

  <div v-else>
    <v-list class="pa-0">
      <v-list-item v-for="(item, index) in paginatedMobileItems" :key="index" class="border-b">
        <v-row no-gutters>
          <v-col cols="8" class="text-h7 font-weight-bold">{{ item[mainLeftHeader.key] }}</v-col>
          <v-col cols="4" class="text-h7 text-right font-weight-bold">{{ item[mainRightHeader.key] }}</v-col>
          <v-col cols="8">
            <div v-for="h in visibleListLeftHeaders" :key="h.key" class="text-caption text-medium-emphasis">{{ h.title }}: {{ item[h.key] }}</div>
          </v-col>
          <v-col cols="4" class="d-flex flex-column align-end">
            <div v-for="h in visibleListRightHeaders" :key="h.key" class="text-caption text-medium-emphasis">
              <v-chip v-if="h.key === 'paymentType'" :color="getPaymentChipColor(item[h.key])" size="x-small" variant="flat" class="mt-1">{{ item[h.key] }}</v-chip>
              <span v-else>{{ item[h.key] }}</span>
            </div>
          </v-col>
        </v-row>
      </v-list-item>
    </v-list>

    <div class="d-flex justify-space-between align-center px-4 py-2 mt-2">
      <v-select v-model="itemsPerPage" :items="[10, 20, 40, 80]" :label="t('table.itemsPerPage')" density="compact" hide-details variant="outlined" style="max-width: 180px;"></v-select>
      <div class="d-flex align-center">
        <v-btn icon size="small" variant="text" @click="page--" :disabled="page === 1">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <div class="text-caption mx-2">
          {{ (page - 1) * itemsPerPage + 1 }}-{{ Math.min(page * itemsPerPage, filteredItems.length) }}
          z {{ filteredItems.length }}
        </div>
        <v-btn icon size="small" variant="text" @click="page++" :disabled="page * itemsPerPage >= filteredItems.length">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import {  ref,  defineProps,  computed} from 'vue';
import {  useDisplay} from 'vuetify';
import {  useI18n} from 'vue-i18n';

const props = defineProps({
  headers: {
    type: Array,
    required: true
  },
  items: {
    type: Array,
    required: true
  },
  search: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const page = ref(1);
const itemsPerPage = ref(10);
const display = useDisplay();
const {
  t
} = useI18n();
const visibleHeaders = computed(() => props.headers.filter(h => h.visible !== false));
const mainLeftHeader = computed(() => props.headers.find(h => h.mobileMain === 'left'));
const mainRightHeader = computed(() => props.headers.find(h => h.mobileMain === 'right'));
const visibleListLeftHeaders = computed(() => visibleHeaders.value.filter(h => h.mobileListLeft === true && !h.mobileMain));
const visibleListRightHeaders = computed(() => visibleHeaders.value.filter(h => h.mobileListLeft === false && !h.mobileMain));

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

const paginatedMobileItems = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredItems.value.slice(start, end);
});

const pageCount = computed(() => {
  if (itemsPerPage.value <= 0) return 0;
  return Math.ceil(filteredItems.value.length / itemsPerPage.value);
});

const getPaymentChipColor = (paymentType) => {
  if (paymentType === 'Platba kartou' || paymentType === 'Card') return 'blue-darken-1';
  if (paymentType === 'Platba hotově' || paymentType === 'Cash') return 'green-darken-1';
  return 'grey';
};
</script>