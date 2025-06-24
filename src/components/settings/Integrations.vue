<template>
  <v-card-text class="text-left pa-4">
    <v-btn color="primary" @click="handleGeneration">
      Generovat a uložit demo data
    </v-btn>
  </v-card-text>
</template>

<script setup>
import { useAppStore } from '@/stores/app';
import { storeToRefs } from 'pinia';
import { generateAndStoreDemoData } from '@/demo/demoGenerator.js';

const appStore = useAppStore();
const { appLocale } = storeToRefs(appStore);

const handleGeneration = async () => {
  // Zobrazíme upozornění pro uživatele
  if (confirm('Opravdu si přejete přepsat stávající demo data?')) {
    console.log(`Zahajuji generování demo dat pro lokalizaci: ${appLocale.value}...`);

    // Zavoláme funkci pro generování s aktuálně nastavenou lokalizací
    await generateAndStoreDemoData({ locale: appLocale.value });

    // Informujeme uživatele o dokončení
    alert('Nová demo data byla úspěšně vygenerována a uložena.');
  }
};
</script>
