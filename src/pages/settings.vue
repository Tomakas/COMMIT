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
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

import SettingsAppearance from '@/components/settings/Appearance.vue';
import SettingsCompany from '@/components/settings/Company.vue';
import SettingsIntegrations from '@/components/settings/Integrations.vue';
import SettingsPlaceholder from '@/components/settings/Placeholder.vue';

const { t } = useI18n();
const activeTabId = ref('appearancel');

const tabs = computed(() => [
  { id: 'appearancel', name: t('settings_tabs.appearance'), component: SettingsAppearance },
  { id: 'company', name: t('settings_tabs.company'), component: SettingsCompany },
  { id: 'permissions', name: t('settings_tabs.permissions'), component: SettingsPlaceholder },
  { id: 'remote-orders', name: t('settings_tabs.remoteOrders'), component: SettingsPlaceholder },
  { id: 'suspicious-activity', name: t('settings_tabs.suspiciousActivity'), component: SettingsPlaceholder },
  { id: 'integrations', name: t('settings_tabs.integrations'), component: SettingsIntegrations },
  { id: 'licences', name: t('settings_tabs.licences'), component: SettingsPlaceholder }
]);
</script>