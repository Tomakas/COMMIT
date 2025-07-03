// src/plugins/axios.js

import axios from 'axios';
import { useAppStore } from ' @/stores/app';
import { useRouter } from 'vue-router'; // Import useRouter

const API_BASE_URL = 'https://api.elementarypos.com';
const API_KEY = import.meta.env.VITE_APP_API_KEY || 'ak-hljMyQ9Vq67bQ2cswg7n8nbRoJpOpy';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    common: {
      'Accept': 'application/json',
    },
    post: {
      'Content-Type': 'application/json'
    }
  }
});

apiClient.interceptors.request.use(
  (config) => {
    if (API_KEY) {
      config.headers['X-Api-Key'] = API_KEY;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const appStore = useAppStore();
    const router = useRouter(); // Get router instance here

    if (error.response) {
      console.error('API chyba (response):', error.response.status, error.response.data);
      if (error.response.status === 401) {
        console.log('Chyba 401: Neautorizovaný přístup. Odhlašuji uživatele a přesměrovávám na přihlašovací stránku.');
        appStore.logout();
        router.push('/login');
      }
      return Promise.reject(error.response);
    } else if (error.request) {
      console.error('API chyba (request): Žádná odpověď od serveru.', error.request);
      return Promise.reject(new Error('Žádná odpověď od serveru. Zkontrolujte připojení.'));
    } else {
      console.error('API chyba (setup):', error.message);
      return Promise.reject(new Error('Chyba při nastavení API požadavku.'));
    }
  }
);

export { apiClient };

export default {
  install(app) {
    app.config.globalProperties.$api = apiClient;
  }
};