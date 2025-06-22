<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12 pa-4">
          <v-card-title class="text-center text-h5 mb-4">
            Vítejte v Elementary POS
          </v-card-title>
          <v-card-text>
            <p class="text-center text-medium-emphasis">
              Pro pokračování se prosím přihlaste.
            </p>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              @click="handleLogin"
              block
              size="large"
              variant="flat"
            >
              Přihlásit se
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<route lang="yaml">
meta:
  layout: blank
</route>

<script setup>
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/app';

const router = useRouter();
const appStore = useAppStore();

const handleLogin = () => {
  appStore.isAuthenticated = true;
  
  router.push('/dashboard');
};
</script>