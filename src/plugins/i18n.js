// src/plugins/i18n.js
import { createI18n } from 'vue-i18n'

// Zde definujeme všechny naše překlady
const messages = {
  cs: {
    nav: {
      dashboard: 'Přehled',
      sales: 'Prodeje',
      items: 'Položky',
      warehouse: 'Sklad',
      cashregister: 'Pokladna',
      addressbook: 'Adresář',
      export: 'Export',
      settings: 'Nastavení',
    },
    userMenu: {
      profile: 'Nastavení profilu',
      stores: 'Prodejny',
      logout: 'Odhlásit se',
    },
    settings: {
      lookAndFeel: 'Vzhled a chování',
      company: 'Firma',
      permissions: 'Oprávnění',
      mode: 'Režim zobrazení',
      navMenu: 'Umístění menu',
      menuText: 'Styl menu',
      language: 'Jazyk',
    },
    sales: {
      productSales: 'Prodej produktů',
      receipts: 'Vystavené účtenky'
    }
  },
  en: {
    nav: {
      dashboard: 'Dashboard',
      sales: 'Sales',
      items: 'Items',
      warehouse: 'Warehouse',
      cashregister: 'Cash Register',
      addressbook: 'Address Book',
      export: 'Export',
      settings: 'Settings',
    },
    userMenu: {
      profile: 'Profile setting',
      stores: 'Stores',
      logout: 'Logout',
    },
    settings: {
      lookAndFeel: 'Look & Feel',
      company: 'Company',
      permissions: 'Permissions',
      // ... other settings keys
      mode: 'Display Mode',
      navMenu: 'Navigation Menu',
      menuText: 'Menu Style',
      language: 'Language',
    },
    sales: {
      productSales: 'Product sales',
      receipts: 'Issued receipts'
    }
  }
}

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages,
})

export default i18n
