<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col v-for="register in cashRegistersData" :key="register.code" cols="12" sm="6" lg="4">
        <CashRegisterCard
          :name="register.name"
          :status="register.status"
          :code="register.code"
          :last-activity="register.lastActivity"
          :mode="register.mode"
          :logged-in-user="register.loggedInUser"
          :cash-amount="register.cashAmount"
          :order-count="register.orderCount"
          :is-shift-open="register.isShiftOpen"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// Předpokládané automatické importy komponenty CashRegisterCard díky unplugin-vue-components.
// Pokud by se komponenta nenaimportovala automaticky, přidejte:
// import CashRegisterCard from '@/components/CashRegisterCard.vue';

// Import pro formátování, pokud ještě není
import { formatDate, formatCurrency } from '@/utils/formatters.js'; // Ujistěte se, že máte tento soubor

// Příklad demo dat pro pokladny
const cashRegistersData = [
  {
    name: 'Hlavní pokladna - Prodej',
    status: 'Aktivní',
    code: 'POS-001',
    lastActivity: formatDate('2025-06-13T16:30:00', { includeSeconds: false }),
    mode: 'Pokladna',
    loggedInUser: 'Petra33',
    cashAmount: formatCurrency(12500.50, { locale: 'cs-CZ', currency: 'CZK' }),
    orderCount: 12,
    isShiftOpen: true, // Ukázka pro DENÍK
  },
  {
    name: 'Kavárna - Bar',
    status: 'Aktivní',
    code: 'BAR-002',
    lastActivity: formatDate('2025-06-13T16:15:00', { includeSeconds: false }),
    mode: 'Pokladna',
    loggedInUser: 'Jan Kovač',
    cashAmount: formatCurrency(5800.75, { locale: 'cs-CZ', currency: 'CZK' }),
    orderCount: 0,
    isShiftOpen: false, // Ukázka pro SMĚNY
  },
  {
    name: 'Sklad - Expedice',
    status: 'Neaktivní',
    code: 'WH-003',
    lastActivity: formatDate('2025-06-12T09:00:00', { includeSeconds: false }),
    mode: 'Zákaznický displej',
    loggedInUser: 'Není přihlášen',
    cashAmount: formatCurrency(0, { locale: 'cs-CZ', currency: 'CZK' }),
    orderCount: 0,
    isShiftOpen: false,
  },
];
</script>

<style scoped>
/* Styly z původního cashregister.vue, pokud je chcete zachovat */
.v-card {
  margin-bottom: 16px;
}

/* Na tabletu a větším, kde jsou karty vedle sebe, nechceme dvojitý okraj */
@media (min-width: 600px) {
  .v-row .v-col:last-child .v-card,
  .v-row .v-col:nth-last-child(2) .v-card {
    margin-bottom: 0;
  }
}

/* Na mobilu, kde je jen jeden sloupec, odstraníme okraj jen u poslední karty */
@media (max-width: 599px) {
  .v-row .v-col:last-child .v-card {
    margin-bottom: 0;
  }
}
</style>
