<template>
  <v-dialog :model-value="dialog" @update:model-value="$emit('update:dialog', $event)" max-width="500px" persistent>
    <v-card>
      <v-card-title><span class="text-h5">Column Settings</span></v-card-title>
      <v-card-text>
        <p class="text-caption mb-4">Drag to reorder and toggle column visibility.</p>
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
        <v-btn color="blue-darken-1" variant="text" @click="$emit('update:dialog', false)">Cancel</v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="saveChanges">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import draggable from 'vuedraggable';

const props = defineProps({
  dialog: { type: Boolean, required: true },
  headers: { type: Array, required: true }
});

const emit = defineEmits(['update:dialog', 'update:headers']);

const editableHeaders = ref([]);

watch(() => props.headers, (newHeaders) => {
  // Klonuje hlavičky při každé změně (např. přepnutí tabu), nejen při otevření dialogu
  editableHeaders.value = JSON.parse(JSON.stringify(newHeaders));
}, { immediate: true, deep: true });


const saveChanges = () => {
  emit('update:headers', editableHeaders.value);
  emit('update:dialog', false);
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
