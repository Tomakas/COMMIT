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
        <v-chip :color="status === 'Aktivní' ? 'success' : 'grey'" class="mr-2">
          {{ status }}
        </v-chip>
        <v-btn icon="mdi-cog" variant="text"></v-btn>
      </div>
    </v-card-title>

    <v-card-text class="py-2">
      <div>Kód pokladny: <span class="font-weight-medium">{{ code }}</span></div>
      <div>Poslední aktivita: <span class="font-weight-medium">{{ lastActivity }}</span></div>
      <div>Mód pokladny: <span class="font-weight-medium">{{ mode }}</span></div>
      <div>Přihlášený uživatel: <span class="font-weight-medium">{{ loggedInUser }}</span></div>
      <v-divider class="my-2"></v-divider>
      <div class="d-flex justify-space-between align-baseline my-2">
        <div>Stav hotovosti:</div>
        <div class="text-subtitle-1 font-weight-bold">{{ cashAmount }}</div>
      </div>
      <div class="d-flex justify-space-between align-baseline">
        <div>Počet objednávek:</div>
        <div class="text-subtitle-1 font-weight-bold">{{ orderCount }}</div>
      </div>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions class="d-flex flex-wrap pa-2">
      <v-btn color="success" variant="flat" class="ma-1" prepend-icon="mdi-swap-horizontal">
        SMĚNY
      </v-btn>

      <v-btn color="success" variant="flat" class="ma-1" prepend-icon="mdi-cash">
        POKLADNÍ DENÍK
      </v-btn>

      <v-btn color="success" variant="flat" class="ma-1" prepend-icon="mdi-clipboard-list-outline">
        OBJEDNÁVKY
      </v-btn>
      <v-btn color="primary" variant="flat" class="ma-1" prepend-icon="mdi-receipt">
        ÚČTENKY
      </v-btn>
      <v-btn color="primary" variant="flat" class="ma-1" prepend-icon="mdi-currency-usd">
        PRODEJE
      </v-btn>
      <v-btn color="error" variant="flat" class="ma-1" prepend-icon="mdi-chart-bar">
        Z-REPORTY
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  lastActivity: {
    type: String,
    default: 'N/A',
  },
  mode: {
    type: String,
    default: 'N/A',
  },
  loggedInUser: {
    type: String,
    default: 'Není přihlášen',
  },
  cashAmount: {
    type: String,
    default: '0,00 Kč',
  },
  orderCount: {
    type: Number,
    default: 0,
  },
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
