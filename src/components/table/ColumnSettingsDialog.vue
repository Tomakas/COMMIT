<template>
  <v-dialog :model-value="dialog" @update:model-value="$emit('update:dialog', $event)" max-width="500px" persistent>
    <v-card>
      <v-card-title><span class="text-h5">{{ t('tableSettings.columnSettings') }}</span></v-card-title>
      <v-card-text>
        <p class="text-caption mb-4">{{ t('tableSettings.dragHint') }}</p>
        <v-list class="column-list">
          <draggable v-model="editableHeaders" item-key="key" handle=".drag-handle">
            <template #item="{ element: header }">
              <v-list-item class="pl-0">
                <template v-slot:prepend>
                  <v-icon v-if="!header.required" class="drag-handle">mdi-drag-vertical</v-icon>
                  <v-icon v-else class="ml-1 mr-3"></v-icon>
                </template>
                <v-list-item-title>{{ header.title }}</v-list-item-title>
                <template v-slot:append>
                  <v-checkbox-btn v-model="header.visible" :disabled="header.required"></v-checkbox-btn>
                </template>
              </v-list-item>
            </template>
          </draggable>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="$emit('update:dialog', false)">{{ t('common.cancel') }}</v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="resetChanges">{{ t('common.reset') }}</v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="saveChanges">{{ t('common.save') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import draggable from 'vuedraggable';
import { useI18n } from 'vue-i18n';
import { useColumnSettingsStore } from '@/stores/columnSettings';

const { t } = useI18n();
const columnSettingsStore = useColumnSettingsStore();

const props = defineProps({
  dialog: { type: Boolean, required: true },
  headers: { type: Array, required: true },
  tableId: { type: String, required: true },
});

const emit = defineEmits(['update:dialog', 'update:headers']);

const editableHeaders = ref([]);

watch(() => props.headers, (newHeaders) => {
  const persistedHeaders = columnSettingsStore.getHeaders(props.tableId);
  if (persistedHeaders) {
    editableHeaders.value = JSON.parse(JSON.stringify(persistedHeaders.filter(h => h.configurable !== false)));
  } else {
    editableHeaders.value = JSON.parse(JSON.stringify(newHeaders.filter(h => h.configurable !== false)));
  }
}, { immediate: true, deep: true });

const saveChanges = () => {
  columnSettingsStore.setHeaders(props.tableId, editableHeaders.value);
  emit('update:headers', editableHeaders.value);
  emit('update:dialog', false);
};

const resetChanges = () => {
  columnSettingsStore.resetHeaders(props.tableId);
  // Re-initialize editableHeaders from the original props.headers
  editableHeaders.value = JSON.parse(JSON.stringify(props.headers.filter(h => h.configurable !== false)));
  emit('update:headers', editableHeaders.value);
};
</script>

<style scoped>
.column-list {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.drag-handle {
  cursor: grab;
}

.drag-handle:active {
  cursor: grabbing;
}
</style>