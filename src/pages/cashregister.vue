<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col v-for="register in cashRegistersData" :key="register.code" cols="12" sm="6" lg="4">
        <CashRegisterCard :name="register.name" :status="register.status" :code="register.code" :last-activity="register.lastActivity"
          :mode="register.mode" :logged-in-user="register.loggedInUser" :cash-amount="register.cashAmount" :order-count="register.orderCount"
          :is-shift-open="register.isShiftOpen" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>

import { formatDate, formatCurrency } from '@/utils/formatters.js';

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
  },
];
</script>

<style scoped></style>
