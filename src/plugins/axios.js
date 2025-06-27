// src/plugins/axios.js
import axios from "axios";
import { useAppStore } from "@/stores/app";
// import router from '@/router'; // ODSTRANĚNO

const apiClient = axios.create({
  baseURL: "https://api-test.elementarypos.com",
});

// Request Interceptor: Automaticky přidá API klíč do každého požadavku, POKUD je uživatel přihlášen.
apiClient.interceptors.request.use(
  (config) => {
    const appStore = useAppStore();
    const userToken = appStore.token;

    if (userToken) {
      config.headers["X-Api-Key"] = userToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Globální ošetření chyb
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const appStore = useAppStore();

    if (error.response && error.response.status === 401) {
      // Pouze zavoláme logout. O přesměrování se postará router guard.
      appStore.logout();
      // router.push('/login'); // ODSTRANĚNO
    }

    console.error("API Error:", error.response?.data?.message || error.message);

    return Promise.reject(error);
  }
);

export default apiClient;
