<template>
  <v-toolbar v-if="!display.mobile.value" flat class="px-2">
    <v-tabs v-if="panels.length > 1" :model-value="activePanelId" @update:model-value="$emit('update:activePanelId', $event)" color="primary">
      <v-tab v-for="panel in panels" :key="panel.id" :value="panel.id">
        {{ panel.name }}
      </v-tab>
    </v-tabs>

    <v-text-field v-if="showSearch" :model-value="searchText" append-inner-icon="mdi-magnify" @update:model-value="$emit('update:searchText', $event)"
      density="compact" variant="outlined" :label="t('table.search')" single-line hide-details class="mx-4"></v-text-field>

    <v-spacer></v-spacer>

    <v-btn v-if="showSum" icon="mdi-sigma" class="mx-1" variant="text"></v-btn>
    <v-btn v-if="showFilter" icon="mdi-filter" class="mx-1" variant="text"></v-btn>
    <v-btn v-if="showSettings" icon="mdi-cog" class="mx-1" variant="text"></v-btn>
  </v-toolbar>

  <div v-else>
    <v-toolbar v-if="panels.length > 1" density="compact">
      <v-tabs :model-value="activePanelId" @update:model-value="$emit('update:activePanelId', $event)" color="primary" grow center-active>
        <v-tab v-for="panel in panels" :key="panel.id" :value="panel.id">
          {{ panel.name }}
        </v-tab>
      </v-tabs>
    </v-toolbar>

    <v-toolbar density="compact">
      <v-text-field v-if="showSearch" class="ml-2" :model-value="searchText" @update:model-value="$emit('update:searchText', $event)"
        density="compact" variant="outlined" :label="t('table.search')" hide-details></v-text-field>

      <v-btn v-if="showSum" icon="mdi-sigma" variant="text"></v-btn>
      <v-btn v-if="showFilter" icon="mdi-filter" variant="text"></v-btn>
      <v-btn v-if="showSettings" icon="mdi-cog" variant="text"></v-btn>
    </v-toolbar>
    <v-divider></v-divider>
  </div>
</template>

<script setup>
import { useDisplay } from 'vuetify';
import { defineProps, defineEmits } from 'vue';
import { useI18n } from 'vue-i18n';

const display = useDisplay();
const { t } = useI18n();

defineProps({
  // Pole s konfigurací pro každý panel/tabulku
  panels: {
    type: Array,
    required: true,
  },
  // ID aktivního panelu (pro v-model)
  activePanelId: {
    type: String,
    required: true,
  },
  // Text pro vyhledávání (pro v-model)
  searchText: {
    type: String,
    required: true,
  },
  // Props pro zobrazení/skrytí ovládacích prvků
  showSearch: { type: Boolean, default: false },
  showFilter: { type: Boolean, default: false },
  showSum: { type: Boolean, default: false },
  showSettings: { type: Boolean, default: false },
});

defineEmits(['update:activePanelId', 'update:searchText']);
</script>
