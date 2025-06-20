----
pages/sales.vue
<template>
  <v-container class="fill-height" fluid>
    <v-responsive class="align-center text-center fill-height">

      <v-card class="mx-auto" flat>
        <v-toolbar flat>
          <v-tabs
            v-model="tab"
            align-tabs="center"
            color="primary"
            grow
          >
            <v-tab value="products">Prodej produktů</v-tab>
            <v-tab value="receipts">Vystavené účtenky</v-tab>
          </v-tabs>

          <v-text-field
            density="compact"
            variant="solo"
            label="Hledat..."
            append-inner-icon="mdi-magnify"
            single-line
            hide-details
            class="ml-4 mr-2 flex-grow-1"
          ></v-text-field>

          <v-btn icon="mdi-filter" class="mx-1"></v-btn>
          <v-btn icon="mdi-download" class="mx-1"></v-btn>
          <v-btn icon="mdi-plus-circle" class="mx-1"></v-btn>
        </v-toolbar>

        <v-window v-model="tab">
          <v-window-item value="products">
            <v-card flat>
              <v-card-text>
                <h2 class="text-h6 mb-2">Tabulka: Prodej produktů</h2>
                <v-data-table
                  :headers="productHeaders"
                  :items="productSales"
                  item-value="product"
                  class="elevation-1"
                ></v-data-table>
              </v-card-text>
            </v-card>
          </v-window-item>

          <v-window-item value="receipts">
            <v-card flat>
              <v-card-text>
                <h2 class="text-h6 mb-2">Tabulka: Vystavené účtenky</h2>
                <v-data-table
                  :headers="receiptHeaders"
                  :items="receipts"
                  item-value="id"
                  class="elevation-1"
                ></v-data-table>
              </v-card-text>
            </v-card>
          </v-window-item>
        </v-window>
      </v-card>
    </v-responsive>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

const tab = ref('products');

const productHeaders = [
  { title: 'Produkt', align: 'start', key: 'product' },
  { title: 'Množství', align: 'end', key: 'quantity' },
  { title: 'Cena/ks', align: 'end', key: 'pricePerUnit' },
  { title: 'Celková cena', align: 'end', key: 'totalPrice' },
];

// Generování 50+ fiktivních produktů
const productSales = Array.from({ length: 55 }, (_, i) => {
  const products = ['Smartphone Pro', 'Chytré hodinky', 'Bezdrátová sluchátka', 'Laptop Ultra', 'Tablet Air', 'Herní konzole', 'Monitor Gaming', 'SSD Disk 1TB', 'USB Flash Disk 64GB', 'Externí disk 2TB'];
  const product = products[i % products.length] + ` (${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${i + 1})`;
  const quantity = Math.floor(Math.random() * 10) + 1;
  const pricePerUnit = Math.floor(Math.random() * 900) + 50;
  const totalPrice = quantity * pricePerUnit;
  return { product, quantity, pricePerUnit, totalPrice };
});

const receiptHeaders = [
  { title: 'ID účtenky', align: 'start', key: 'id' },
  { title: 'Datum', align: 'end', key: 'date' },
  { title: 'Celkem', align: 'end', key: 'amount' },
  { title: 'Zákazník', align: 'end', key: 'customer' },
];

// Generování 50+ fiktivních účtenek
const receipts = Array.from({ length: 52 }, (_, i) => {
  const customers = ['Jan Novák', 'Alena Dvořáková', 'Petr Svoboda', 'Eva Horáková', 'Michal Pospíšil', 'Lucie Králová', 'Tomáš Veselý', 'Kateřina Benešová'];
  const date = `2025-06-${String(Math.floor(Math.random() * 30) + 1).padStart(2, '0')}`;
  const amount = Math.floor(Math.random() * 5000) + 100;
  const customer = customers[i % customers.length];
  return { id: `R${(i + 1).toString().padStart(3, '0')}`, date, amount, customer };
});
</script>
