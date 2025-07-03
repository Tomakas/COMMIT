<template>
  <div v-if="!display.mobile.value">
    <v-data-table :headers="visibleHeaders" :items="items" :loading="loading" class="elevation-0" hide-default-footer no-data-text=" "
      :items-per-page="-1" v-model:sort-by="sortBy" :header-props="{ class: 'text-left' }">
      <template v-for="header in visibleHeaders" #[`item.${header.key}`]="{ item }">
        <span v-html="highlight(item[header.key])"></span>
      </template>
    </v-data-table>

    <!-- Custom footer s paginací -->
    <div class="d-flex justify-space-between align-center px-4 py-2 border-t">
      <v-select v-model="itemsPerPage" :items="[10, 20, 40, 80]" :label="t('table.itemsPerPage')" density="compact" hide-details variant="outlined"
        style="max-width: 180px;"></v-select>

      <div class="d-flex align-center">
        <v-btn icon size="small" variant="text" @click="page = Math.max(1, page - 1)" :disabled="page === 1">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>

        <div class="d-flex align-center mx-2">
          <v-btn v-for="pageNum in visiblePages" :key="pageNum" :variant="pageNum === page ? 'flat' : 'text'"
            :color="pageNum === page ? 'primary' : 'default'" size="small" class="mx-1" @click="page = pageNum" :disabled="pageNum === '...'"
            min-width="32">
            {{ pageNum }}
          </v-btn>
        </div>

        <v-btn icon size="small" variant="text" @click="page = Math.min(pageCount, page + 1)" :disabled="page >= pageCount">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>

      <div class="text-caption" style="min-width: 120px; text-align: right;">
        {{ startItem }}-{{ endItem }} z {{ totalItems }}
      </div>
    </div>
  </div>

  <div v-else>
    <v-list class="pa-0">
      <v-list-item v-for="item in paginatedMobileItems" :key="item.receiptId" class="border-b">
        <v-row no-gutters>
          <v-col cols="8" class="text-h7 font-weight-bold"><span v-html="highlight(item[mainLeftHeader.key])"></span></v-col>
          <v-col cols="4" class="text-h7 text-right font-weight-bold"><span v-html="highlight(item[mainRightHeader.key])"></span></v-col>
          <v-col cols="8">
            <div v-for="h in visibleListLeftHeaders" :key="h.key" class="text-caption text-medium-emphasis">{{ h.title }}: <span v-html="highlight(item[h.key])"></span></div>
          </v-col>
          <v-col cols="4" class="d-flex flex-column align-end">
            <div v-for="h in visibleListRightHeaders" :key="h.key" class="text-caption text-medium-emphasis">
              <span v-html="highlight(item[h.key])"></span>
            </div>
          </v-col>
        </v-row>
      </v-list-item>
    </v-list>

    <div class="d-flex justify-space-between align-center px-4 py-2 mt-2">
      <v-select v-model="itemsPerPage" :items="[10, 20, 40, 80]" :label="t('table.itemsPerPage')" density="compact" hide-details variant="outlined"
        style="max-width: 180px;"></v-select>
      <div class="d-flex align-center">
        <v-btn icon size="small" variant="text" @click="page--" :disabled="page === 1">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <div class="text-caption mx-2">
          {{ startItem }}-{{ endItem }} z {{ totalItems }}
        </div>
        <v-btn icon size="small" variant="text" @click="page++" :disabled="page >= pageCount">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useDisplay } from 'vuetify';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  headers: { type: Array, required: true },
  items: { type: Array, required: true },
  search: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  page: { type: Number, default: 1 },
  itemsPerPage: { type: Number, default: 10 },
  totalItems: { type: Number, default: 0 },
  sortBy: { type: Array, default: () => ([{ key: 'mcode', order: 'asc' }]) },
  sortDesc: { type: Boolean, default: false },
  highlightText: { type: String, default: '' },
});

const emit = defineEmits(['update:page', 'update:items-per-page', 'update:sortBy', 'update:sortDesc']);

const page = computed({
  get: () => props.page,
  set: (val) => {
    const safeVal = Math.max(1, Math.min(pageCount.value, val));
    emit('update:page', safeVal);
  },
});

const itemsPerPage = computed({
  get: () => props.itemsPerPage,
  set: (val) => {
    // Při změně počtu položek na stránku se vrátíme na první stránku
    emit('update:page', 1);
    emit('update:items-per-page', val);
  },
});

const sortBy = computed({
  get: () => props.sortBy,
  set: (val) => emit('update:sortBy', val),
});

const sortDesc = computed({
  get: () => props.sortDesc,
  set: (val) => emit('update:sortDesc', val),
});

const display = useDisplay();
const { t } = useI18n();

const visibleHeaders = computed(() => props.headers.filter(h => h.visible !== false).map(h => ({ ...h, title: t(h.title) })));
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
  return filteredItems.value;
});

const highlight = (text) => {
  if (!props.highlightText || !text) return text;
  const regex = new RegExp(props.highlightText, 'gi');
  return String(text).replace(regex, match => `<span class="highlight">${match}</span>`);
};

const pageCount = computed(() => {
  if (itemsPerPage.value <= 0 || props.totalItems === 0) return 1;
  return Math.ceil(props.totalItems / itemsPerPage.value);
});

const startItem = computed(() => {
  return (page.value - 1) * itemsPerPage.value + 1;
});

const endItem = computed(() => {
  return Math.min(page.value * itemsPerPage.value, props.totalItems);
});

// Generování viditelných stránek pro paginaci
const visiblePages = computed(() => {
  const current = page.value;
  const total = pageCount.value;
  const delta = 2; // Kolik stránek zobrazit na každé straně

  if (total <= 7) {
    // Pokud je málo stránek, zobraz všechny
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = [];

  // Vždy zobraz první stránku
  pages.push(1);

  // Výpočet rozsahu kolem aktuální stránky
  const start = Math.max(2, current - delta);
  const end = Math.min(total - 1, current + delta);

  // Přidej ... pokud je mezera mezi 1 a start
  if (start > 2) {
    pages.push('...');
  }

  // Přidej stránky kolem aktuální
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // Přidej ... pokud je mezera mezi end a poslední stránkou
  if (end < total - 1) {
    pages.push('...');
  }

  // Vždy zobraz poslední stránku
  if (total > 1) {
    pages.push(total);
  }

  return pages;
});

const getPaymentChipColor = (paymentType) => {
  if (paymentType === 'Platba kartou' || paymentType === 'Card') return 'blue-darken-1';
  if (paymentType === 'Platba hotově' || paymentType === 'Cash') return 'green-darken-1';
  return 'grey';
};
</script>

<style>
.highlight {
  background-color: #A0522D;
}
</style>