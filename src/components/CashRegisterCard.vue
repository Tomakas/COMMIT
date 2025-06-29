<template>
  <v-card :class="['cash-register-card', status === 'Aktivní' ? 'active-card' : 'inactive-card']">
    <v-card-title class="d-flex justify-space-between align-center pb-2">
      <div class="d-flex align-center">
        <v-icon :color="status === 'Aktivní' ? 'success' : 'error'">
          {{ status === 'Aktivní' ? 'mdi-check-circle' : 'mdi-alert-circle' }}
        </v-icon>
        <span class="ml-2 text-h6">{{ name }}</span>
      </div>
      <div class="d-flex align-center">
        <v-chip :color="status === 'Aktivní' ? 'success' : 'grey'" size="small" class="mr-2">
          {{ status === 'Aktivní' ? t('cashRegister.statusActive') : t('cashRegister.statusInactive') }}
        </v-chip>
        <v-btn icon="mdi-cog" variant="text"></v-btn>
      </div>
    </v-card-title>

    <v-card-text class="py-2">
      <div class="text-caption text-medium-emphasis">{{ t('cashRegister.code') }}: <span class="font-weight-medium">{{ code }}</span></div>
      <div class="text-caption text-medium-emphasis">{{ t('cashRegister.lastActivity') }}: <span class="font-weight-medium">{{ lastActivity }}</span>
      </div>
      <div class="text-caption text-medium-emphasis">{{ t('cashRegister.mode') }}: <span class="font-weight-medium">{{ mode }}</span></div>
      <div class="text-caption text-medium-emphasis">{{ t('cashRegister.loggedInUser') }}: <span class="font-weight-medium">{{ loggedInUser }}</span>
      </div>
      <v-divider class="my-2"></v-divider>
      <div class="d-flex justify-space-between align-baseline my-2">
        <div class="text-caption text-medium-emphasis">{{ t('cashRegister.cashAmount') }}:</div>
        <div class="text-subtitle-1 font-weight-bold">{{ cashAmount }}</div>
      </div>
      <div class="d-flex justify-space-between align-baseline">
        <div class="text-caption text-medium-emphasis">{{ t('cashRegister.orderCount') }}:</div>
        <div class="text-subtitle-1 font-weight-bold">{{ orderCount }}</div>
      </div>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions class="d-flex flex-wrap pa-2">
      <v-btn color="success" variant="flat" class="ma-1" prepend-icon="mdi-swap-horizontal">
        {{ t('cashRegister.shiftsBtn') }}
      </v-btn>
      <v-btn color="success" variant="flat" class="ma-1" prepend-icon="mdi-cash">
        {{ t('cashRegister.cashBookBtn') }}
      </v-btn>
      <v-btn color="success" variant="flat" class="ma-1" prepend-icon="mdi-clipboard-list-outline">
        {{ t('cashRegister.ordersBtn') }}
      </v-btn>
      <v-btn color="primary" variant="flat" class="ma-1" prepend-icon="mdi-receipt">
        {{ t('cashRegister.receiptsBtn') }}
      </v-btn>
      <v-btn color="primary" variant="flat" class="ma-1" prepend-icon="mdi-currency-usd">
        {{ t('cashRegister.salesBtn') }}
      </v-btn>
      <v-btn color="error" variant="flat" class="ma-1" prepend-icon="mdi-chart-bar">
        {{ t('cashRegister.zReportsBtn') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

defineProps({
  name: { type: String, required: true },
  status: { type: String, required: true },
  code: { type: String, required: true },
  lastActivity: { type: String, default: 'N/A' },
  mode: { type: String, default: 'N/A' },
  loggedInUser: { type: String, default: 'N/A' }, // Změnit default na N/A, pak překládat až při zobrazení
  cashAmount: { type: String, default: '0,00 Kč' },
  orderCount: { type: Number, default: 0 },
});
</script>

<style scoped>
.active-card {
  border: 2px solid rgba(var(--v-theme-success), 0.5);
}

.inactive-card {
  border: 2px solid rgba(var(--v-theme-error), 0.5);
}

.v-card-actions .v-btn {
  flex-grow: 1;
}
</style>
