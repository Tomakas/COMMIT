<template>
  <v-dialog :model-value="dialog" @update:model-value="$emit('update:dialog', $event)" max-width="400px" persistent>
    <v-card>
      <v-card-title class="headline">{{ t('tableFilter.filterSettings') }}</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="dateFrom" :label="t('tableFilter.dateFrom')" type="date" variant="outlined" density="compact"
              hide-details></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="dateTo" :label="t('tableFilter.dateTo')" type="date" variant="outlined" density="compact"
              hide-details></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="cancel">{{ t('common.cancel') }}</v-btn>
        <v-btn color="primary" variant="flat" @click="applyFilters">{{ t('common.apply') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAppStore } from '@/stores/app';
import { storeToRefs } from 'pinia';

const { t } = useI18n();
const appStore = useAppStore();
const { getReceiptsFrom, getReceiptsTo } = storeToRefs(appStore); // Získání referencí z Pinia store

const props = defineProps({
  dialog: { type: Boolean, required: true },
});

const emit = defineEmits(['update:dialog', 'apply-filters']);

const dateFrom = ref('');
const dateTo = ref('');

watch(() => props.dialog, (newVal) => {
  if (newVal) {
    dateFrom.value = getReceiptsFrom.value;
    dateTo.value = getReceiptsTo.value;
  }
});

onMounted(() => {
  dateFrom.value = getReceiptsFrom.value;
  dateTo.value = getReceiptsTo.value;
});

const applyFilters = () => {
  getReceiptsFrom.value = dateFrom.value;
  getReceiptsTo.value = dateTo.value;
  emit('apply-filters');
  emit('update:dialog', false);
};

const cancel = () => {
  emit('update:dialog', false);
};
</script>

<style scoped></style>
