<template>
  <v-container class="fill-height" fluid>
    <v-responsive class="fill-height">
      <v-card class="mx-auto" flat>
        <v-toolbar flat>
          <v-tabs v-model="activeTabId" align-tabs="center" color="primary" grow>
            <v-tab v-for="item in tabs" :key="item.id" :value="item.id">
              {{ item.name }}
            </v-tab>
          </v-tabs>
        </v-toolbar>

        <v-window v-model="activeTabId">
          <v-window-item v-for="item in tabs" :key="item.id" :value="item.id">
            <component :is="item.component" />
          </v-window-item>
        </v-window>
      </v-card>
    </v-responsive>
  </v-container>
</template>

<script setup>
import { ref, shallowRef } from 'vue';

import SettingsLookFeel from '@/components/settings/LookFeel.vue';
import SettingsCompany from '@/components/settings/Company.vue';
// Placeholder pro ostatní komponenty
import SettingsPlaceholder from '@/components/settings/Placeholder.vue';


const activeTabId = ref('look-and-feel');

const tabs = shallowRef([
  { id: 'look-and-feel', name: 'Look & Feel', component: SettingsLookFeel },
  { id: 'company', name: 'Company', component: SettingsCompany },
  { id: 'permissions', name: 'Permissions', component: SettingsPlaceholder },
  { id: 'remote-orders', name: 'Remote Orders', component: SettingsPlaceholder },
  { id: 'suspicious-activity', name: 'Suspicious Activity', component: SettingsPlaceholder },
  { id: 'integrations', name: 'Integrations', component: SettingsPlaceholder },
  { id: 'licences', name: 'Licences', component: SettingsPlaceholder }
]);


</script>
