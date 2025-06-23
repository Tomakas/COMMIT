<template>
  <div class="login-wrapper">
    <div class="logo-background">
      <Logo v-for="n in 150" :key="n" height="120" class="background-logo-instance" />
    </div>

    <v-container class="fill-height login-content">
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
// Komponenta Logo se importuje automaticky díky nastavení projektu

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
  /* Vytvoříme kontext pro absolutní pozicování pozadí */
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  /* Zabrání zobrazení scrollbarů, pokud by se pozadí vykreslilo mimo */
}

.logo-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  /* Umístí pozadí za obsah */

  /* Použijeme flexbox pro vytvoření mřížky */
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 60px;
  /* Mezery mezi logy */
}

.background-logo-instance {
  /* Klíčový styl pro zprůhlednění a natočení loga */
  opacity: 0.04;
  transform: rotate(-15deg);
  /* Zabráníme tomu, aby loga reagovala na myš */
  pointer-events: none;
}

.login-content {
  /* Zajistíme, že přihlašovací formulář bude nad pozadím */
  position: relative;
  z-index: 1;
}
</style>
