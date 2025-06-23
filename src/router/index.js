/**
 * router/index.js
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'
import { useAppStore } from '@/stores/app';

// 1. Získáme základní routy a aplikujeme na ně layouty
const finalRoutes = setupLayouts(routes);

// 2. Přidáme na začátek pole naši routu pro přesměrování
finalRoutes.unshift({
  path: '/',
  redirect: '/login',
});

// 3. Vytvoříme instanci routeru POUZE JEDNOU s finální sadou rout
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: finalRoutes,
});

// === NAVIGATION GUARD START ===
router.beforeEach((to, from, next) => {
  // We need access to the store inside the guard
  const appStore = useAppStore();
  const isLoggedIn = appStore.isAuthenticated;

  // 1. User wants to go to the login page
  if (to.path === '/login') {
    if (isLoggedIn) {
      // If already logged in, redirect to the dashboard
      next('/dashboard');
    } else {
      // If not logged in, allow access to the login page
      next();
    }
  }
  // 2. User wants to go to any other page
  else {
    if (isLoggedIn) {
      // If logged in, allow access
      next();
    } else {
      // If not logged in, redirect to the login page
      next('/login');
    }
  }
});
// === NAVIGATION GUARD END ===

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err)
    } else {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router;
