<template>
  <v-card-text class="text-left pa-4">
    <v-btn color="primary" @click="handleGeneration">
      Get Demo Data
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
  if (confirm('Opravdu si přejete přepsat stávající demo data?')) {
    console.log(`Zahajuji generování demo dat pro lokalizaci: ${appLocale.value}...`);

    await generateAndStoreDemoData({ locale: appLocale.value });

    alert('Nová demo data byla úspěšně vygenerována a uložena.');
  }
};
</script>
