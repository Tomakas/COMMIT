// src/plugins/axios.js
import axios from 'axios';
import { useAppStore } from '@/stores/app';
import router from '@/router';

const apiClient = axios.create({
  baseURL: 'https://api-test.elementarypos.com',
});

// Request Interceptor: Automaticky přidá API klíč do každého požadavku, POKUD je uživatel přihlášen.
apiClient.interceptors.request.use(
  (config) => {
    const appStore = useAppStore();
    const userToken = appStore.token;

    // Pokud je k dispozici token přihlášeného uživatele, přidáme ho do hlavičky.
    // Pro nepřihlášené požadavky (jako je samotný login) se nyní žádný 'X-Api-Key' nepřidá.
    if (userToken) {
      config.headers['X-Api-Key'] = userToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Globální ošetření chyb (zůstává beze změny)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const appStore = useAppStore();

    if (error.response && error.response.status === 401) {
      appStore.logout();
      router.push('/login');
    }

    console.error('API Error:', error.response?.data?.message || error.message);

    return Promise.reject(error);
  }
);

export default apiClient;
