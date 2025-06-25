// src/pages/login.vue
<template>
  <div class="login-wrapper">
    <div class="logo-background position-absolute d-flex flex-wrap justify-center align-center">
      <Logo v-for="n in 150" :key="n" width="250" class="background-logo-instance" />
    </div>
    <v-container class="fill-height login-content position-relative">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="elevation-12 align-center">
            <v-select v-model="locale" :items="[{ title: 'Česky', value: 'cs' }, { title: 'English', value: 'en' }]" density="compact" hide-details
                variant="outlined" style="max-width: 120px;"></v-select>
            <v-card-title class="d-flex justify-space-between align-center text-h5">
              <span>{{ t('login.welcome') }}</span>

            </v-card-title>
            <v-card-text>
              <v-text-field v-model="username" :label="t('login.username_or_email')" prepend-inner-icon="mdi-account-outline" variant="outlined"
                class="mt-4"></v-text-field>
              <v-text-field v-model="password" :label="t('login.password')" prepend-inner-icon="mdi-lock-outline" variant="outlined"
                type="password"></v-text-field>
              <div class="d-flex justify-space-between text-caption mt-2">
                <a href="#" class="text-decoration-none text-primary">{{ t('login.create_account') }}</a>
                <a href="#" class="text-decoration-none text-primary">{{ t('login.forgot_password') }}</a>
              </div>
            </v-card-text>
            <v-card-actions class="flex-column pa-4">
              <v-btn color="primary" @click="handleStandardLogin" block size="large" variant="flat">
                {{ t('login.log_in') }}
              </v-btn>
              <v-btn color="secondary" @click="handleDemoLogin" block size="large" variant="outlined" class="mt-4">
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
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/app';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { generateAndStoreDemoData } from '@/demo/demoGenerator.js';

const router = useRouter();
const appStore = useAppStore();
const { appLocale } = storeToRefs(appStore);
const { t, locale } = useI18n();

const username = ref('');
const password = ref('');

locale.value = appLocale.value;
watch(locale, (newLocale) => {
  appLocale.value = newLocale;
});
watch(appLocale, (newLocale) => {
  locale.value = newLocale;
});
// -----------------------------

const handleStandardLogin = () => {
  appStore.isDemoMode = false;
  appStore.isAuthenticated = true;
  router.push('/dashboard');
};

const handleDemoLogin = async () => {
  appStore.isDemoMode = true;
  await generateAndStoreDemoData({ locale: appLocale.value });
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
  gap: 0;
}

.background-logo-instance {
  transform: rotate(-15deg);
  pointer-events: none;
  opacity: 0.1;
}
</style>
