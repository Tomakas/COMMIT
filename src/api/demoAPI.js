// src/api/demoAPI.js

import { getProducts as getDemoProducts, getDirectory as getDemoDirectory } from '@/demo/demoAPI.js';
import { getDemoData as getDemoSales } from '@/demo/demoGenerator.js';

export async function getItems(locale) {
  console.log(`API [DEMO]: Vracím demo položky (locale: ${locale})...`);
  return await getDemoProducts(locale);
}

export async function getDirectory(locale) {
  console.log(`API [DEMO]: Vracím demo adresář (locale: ${locale})...`);
  return await getDemoDirectory(locale);
}

export async function getSales() {
  console.log(`API [DEMO]: Vracím demo prodeje...`);
  return getDemoSales() || [];
}
