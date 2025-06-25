<template>
  <div class="login-wrapper">
    <div class="logo-background position-absolute d-flex flex-wrap justify-center align-center">
      <Logo v-for="n in 150" :key="n" width="250" class="background-logo-instance" />
    </div>

    <v-container class="fill-height login-content position-relative">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="elevation-12 pa-4">
            <v-card-title class="text-center text-h5 mb-4">
              Vítejte v Elementary POS
            </v-card-title>
            <v-card-text class="pb-0">
              <v-text-field v-model="username" label="Uživatelské jméno nebo e-mail" prepend-inner-icon="mdi-account-outline" variant="outlined"
                class="mb-4"></v-text-field>

              <v-text-field v-model="password" label="Heslo" prepend-inner-icon="mdi-lock-outline" variant="outlined" type="password"></v-text-field>
            </v-card-text>
            <v-card-actions class="px-4 pb-4 pt-4">
              <v-btn color="primary" @click="handleLogin" block size="large" variant="flat">
                Přihlásit se
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<route lang="yaml">
meta:
  layout: blank
</route>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/app';

const router = useRouter();
const appStore = useAppStore();

const username = ref('');
const password = ref('');

const handleLogin = () => {
  appStore.isAuthenticated = true;
  router.push('/dashboard');
};
</script>

<style scoped>
.login-wrapper {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.logo-background {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  /* ZMĚNA ZDE: Mezery jsou nyní menší */
  gap: 30px;
}

.background-logo-instance {
  transform: rotate(-15deg);
  pointer-events: none;
  opacity: 0.1;
}
</style>
