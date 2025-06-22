<template>
  <v-container fluid>
    <v-card class="mx-auto" flat>
      <TablePanel v-model:activePanelId="activePanelId" v-model:searchText="searchText" :panels="tablePanels"
        :show-search="true" :show-filter="true" :show-settings="true" />

      <ReuseTable v-if="activePanel" :headers="activePanel.headers" :items="activePanel.items" :search="searchText" />
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import TablePanel from '@/components/table/tablePanel.vue';
import ReuseTable from '@/components/table/reuseTable.vue';

const searchText = ref('');

// Definujeme konfiguraci pro tabulku adresáře.
// Opět je v poli jen jeden objekt, takže se nezobrazí taby.
const tablePanels = ref([
  {
    id: 'addressbook',
    name: 'Adresář',
    headers: [
      { title: 'Jméno / Firma', key: 'name', minWidth: '220px', required: true, mobileMain: 'left' },
      { title: 'Typ', key: 'type', required: false, mobileListLeft: true, mobileMain: 'right' },
      { title: 'E-mail', key: 'email', minWidth: '220px', required: true, mobileListLeft: true },
      { title: 'Telefon', key: 'phone', minWidth: '160px', required: true, mobileListLeft: true },
      { title: 'Město', key: 'city', required: false, mobileListLeft: true }, // Jde doprava
      { title: 'IČO', key: 'ico', required: false, mobileListLeft: false }, // Jde doprava
    ],
    // Vygenerujeme fiktivní data pro adresář
    items: Array.from({ length: 65 }, (_, i) => {
      const isCompany = i % 3 === 0;
      const firstNames = ['Jan', 'Petra', 'Martin', 'Eva', 'Tomáš', 'Lucie'];
      const lastNames = ['Novák', 'Svobodová', 'Černý', 'Dvořáková', 'Procházka', 'Kučerová'];
      const companies = ['Stavby s.r.o.', 'Gastro Servis a.s.', 'IT Řešení', 'Velkoobchod Zelenina', 'Právní kancelář JUDr. Hájek'];
      const types = ['Zákazník', 'Dodavatel', 'Partner'];
      const cities = ['Praha', 'Brno', 'Ostrava', 'Plzeň', 'Liberec', 'Olomouc'];

      const name = isCompany ? companies[i % companies.length] : `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`;
      const email = `${name.toLowerCase().replace(/[.\s]/g, '').substring(0, 15)}@example.cz`;

      return {
        name: name,
        type: types[i % types.length],
        email: email,
        phone: `+420 ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100}`,
        city: cities[i % cities.length],
        ico: isCompany ? Math.floor(Math.random() * 90000000 + 10000000).toString() : 'N/A'
      }
    }),
  },
]);

// ID aktivního panelu
const activePanelId = ref(tablePanels.value[0]?.id);

// Vypočítaná vlastnost, která vrací konfiguraci aktivního panelu
const activePanel = computed(() => {
  return tablePanels.value.find(p => p.id === activePanelId.value);
});
</script>
