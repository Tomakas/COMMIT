// src/plugins/axios.js

import axios from 'axios';

// Načítání proměnných prostředí (Příklad pro Vite, Vue CLI má process.env.VUE_APP_)
// V produkci by API_KEY NIKDY neměl být přímo v kódu, ale z .env souboru!
const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL || 'https://api.elementarypos.com';
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

// Request Interceptor: Přidání API klíče
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

// Response Interceptor: Globální zpracování chyb odpovědi
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('API chyba (response):', error.response.status, error.response.data);
      if (error.response.status === 401) {
        console.log('Chyba 401: Neautorizovaný přístup. Možné přesměrování...');
        // Zde můžete přidat logiku pro přesměrování na přihlašovací stránku
        // router.push('/login'); // Použijte, pokud máte router k dispozici
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

// DŮLEŽITÉ: Exportujeme apiClient jako pojmenovaný export
export { apiClient };

// Toto je export pro Vue plugin systém (aby bylo dostupné přes app.config.globalProperties.$api)
export default {
  install(app) {
    app.config.globalProperties.$api = apiClient;
  }
};
