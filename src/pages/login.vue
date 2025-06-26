<template>
  <div class="login-wrapper">
    <div class="logo-background position-absolute d-flex flex-wrap justify-center align-center">
      <Logo v-for="n in 150" :key="n" width="250" class="background-logo-instance" />
    </div>
    <v-container class="fill-height login-content position-relative">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="elevation-12">
            <v-toolbar color="transparent">
              <v-spacer />
              <v-select v-model="locale" :items="[{ title: 'Česky', value: 'cs' }, { title: 'English', value: 'en' }]" density="compact" hide-details
                variant="outlined" class="pa-5"></v-select>
            </v-toolbar>
            <v-card-title class="d-flex justify-center align-center text-h5">
              <span>{{ t('login.welcome') }}</span>
            </v-card-title>
            <v-card-text>
              <v-alert v-if="error" type="error" density="compact" class="mb-4" closable @click:close="error = null">
                {{ error }}
              </v-alert>
              <v-text-field
                v-model="username"
                :label="t('login.username_or_email')"
                prepend-inner-icon="mdi-account-outline"
                variant="outlined"
                class="mt-4"
                @keyup.enter="handleStandardLogin"
              ></v-text-field>
              <v-text-field
                v-model="password"
                :label="t('login.password')"
                prepend-inner-icon="mdi-lock-outline"
                variant="outlined"
                type="password"
                @keyup.enter="handleStandardLogin"
              ></v-text-field>
              <div class="d-flex justify-space-between text-caption mt-2">
                <a href="#" class="text-decoration-none text-primary">{{ t('login.create_account') }}</a>
                <a href="#" class="text-decoration-none text-primary">{{ t('login.forgot_password') }}</a>
              </div>
            </v-card-text>
            <v-card-actions class="flex-column pa-4">
              <v-btn :loading="loading"
                color="primary"
                @click="handleStandardLogin"
                block
                size="large"
                variant="flat"
              >
                {{ t('login.log_in') }}
              </v-btn>
              <v-btn
                :loading="loading"
                color="secondary"
                @click="handleDemoLogin"
                block
                size="large"
                variant="outlined"
                class="mt-4"
              >
                {{ t('login.enter_demo') }}
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
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useAppStore } from '@/stores/app';

const { t, locale } = useI18n();
const router = useRouter();
const appStore = useAppStore();

const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref(null);

const handleStandardLogin = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.post('https://api.elementarypos.com/auth/login-with-password', {
      userName: username.value,
      password: password.value,
      fe: true,
    });
    appStore.setLoginData(response.data, username.value, false);
    await router.push('/dashboard');
  } catch (err) {
    if (err.response?.data?.message) {
      error.value = err.response.data.message;
    } else {
      error.value = 'Došlo k neočekávané chybě.';
    }
    appStore.logout(); // Vyčistí stav po neúspěšném pokusu
  } finally {
    loading.value = false;
  }
};

const handleDemoLogin = async () => {
  loading.value = true;
  error.value = null;
  try {
    const demoApiData = {
      apiKey: 'demo-api-key-' + Date.now(),
      companyId: 'demo-company-id',
      userId: 'demo-user-id',
      adminUser: true,
      role: 'admin',
      rights: ["orders", "cashRegisterSettings", "createNegativeReceipt", "addDiscount", "shiftSales", "createCustomer", "updateCustomer"],
    };
    appStore.setLoginData(demoApiData, 'demo@user.cz', true);
    await new Promise(resolve => setTimeout(resolve, 500));
    await router.push('/dashboard');
  } catch (e) {
    error.value = 'Přihlášení do dema selhalo.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-wrapper {
  position: relative;
  height: 100vh;
  overflow: hidden;
}
.logo-background {
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 0;
  gap: 0;
}
.background-logo-instance {
  transform: rotate(-15deg);
  pointer-events: none;
  opacity: 0.1;
}
</style>
