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
        <v-chip
          :color="status === 'Aktivní' ? 'success' : 'grey'"
          size="small"
          class="mr-2"
        >
          {{ status }}
        </v-chip>
        <v-btn icon="mdi-cog" variant="text" size="small"></v-btn>
      </div>
    </v-card-title>

    <v-card-text class="py-2">
      <div class="text-caption text-medium-emphasis">Kód pokladny: <span class="font-weight-medium">{{ code }}</span></div>
      <div class="text-caption text-medium-emphasis">Poslední aktivita: <span class="font-weight-medium">{{ lastActivity }}</span></div>
      <div class="text-caption text-medium-emphasis">Mód pokladny: <span class="font-weight-medium">{{ mode }}</span></div>
      <div class="text-caption text-medium-emphasis">Přihlášený uživatel: <span class="font-weight-medium">{{ loggedInUser }}</span></div>
      <v-divider class="my-2"></v-divider>
      <div class="d-flex justify-space-between align-baseline my-2">
        <div class="text-caption text-medium-emphasis">Stav hotovosti:</div>
        <div class="text-subtitle-1 font-weight-bold">{{ cashAmount }}</div>
      </div>
      <div class="d-flex justify-space-between align-baseline">
        <div class="text-caption text-medium-emphasis">Počet objednávek:</div>
        <div class="text-subtitle-1 font-weight-bold">{{ orderCount }}</div>
      </div>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions class="d-flex flex-wrap pa-2">
      <v-btn
        color="success"
        variant="flat"
        size="small"
        class="ma-1"
        prepend-icon="mdi-swap-horizontal"
      >
        {{ isShiftOpen ? 'DENÍK' : 'SMĚNY' }}
      </v-btn>
      <v-btn
        color="success"
        variant="flat"
        size="small"
        class="ma-1"
        prepend-icon="mdi-clipboard-list-outline"
      >
        OBJEDNÁVKY
      </v-btn>
      <v-btn
        color="primary"
        variant="flat"
        size="small"
        class="ma-1"
        prepend-icon="mdi-receipt"
      >
        ÚČTENKY
      </v-btn>
      <v-btn
        color="primary"
        variant="flat"
        size="small"
        class="ma-1"
        prepend-icon="mdi-currency-usd"
      >
        PRODEJE
      </v-btn>
      <v-btn
        color="error"
        variant="flat"
        size="small"
        class="ma-1"
        prepend-icon="mdi-chart-bar"
      >
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
    type: String, // 'Aktivní' nebo 'Neaktivní'
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  lastActivity: {
    type: String, // Formátované datum a čas
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
    type: String, // Formátovaná částka s měnou
    default: '0,00 Kč',
  },
  orderCount: {
    type: Number,
    default: 0,
  },
  isShiftOpen: { // Pro dynamické zobrazení textu na tlačítku SMĚNY/DENÍK
    type: Boolean,
    default: false,
  }
});
</script>

<style scoped>
.cash-register-card {
  border-radius: 8px;
  overflow: hidden; /* Důležité pro zaoblené rohy */
  margin-bottom: 16px; /* Mezera mezi kartami */
}

/* Styly pro aktivní/neaktivní karty - volitelné, ale pomáhá vizuálně */
.active-card {
  border: 1px solid rgba(var(--v-theme-success), 0.5); /* Lehce nazelenalý rámeček */
  box-shadow: 0 4px 8px rgba(var(--v-theme-success), 0.1);
}

.inactive-card {
  border: 1px solid rgba(var(--v-theme-error), 0.5); /* Lehce načervenalý rámeček */
  box-shadow: 0 4px 8px rgba(var(--v-theme-error), 0.1);
}

/* Úprava mezer mezi tlačítky pro lepší vzhled na malých obrazovkách */
.v-card-actions .v-btn {
  flex-grow: 1; /* Tlačítka se roztáhnou, aby vyplnila prostor */
  min-width: 120px; /* Minimální šířka pro tlačítka */
}

/* Můžete si pohrát s m-auto pro zarovnání tlačítek, pokud byste chtěli jiné uspořádání */
.v-card-actions {
  justify-content: space-around; /* Rozmístí tlačítka rovnoměrně */
}
</style>
