// src/composables/compTableData.js
import { ref, computed, onMounted, watch } from 'vue';
import { useAppStore } from '@/stores/app';
import { storeToRefs } from 'pinia';
import { getReceiptsSum } from '@/services/api';

/**
 * Composable funkce pro správu logiky stránek s datovými tabulkami.
 *
 * @param {object} config - Konfigurační objekt specifický pro danou stránku.
 * @param {Array} config.panels - Pole panelů (záložek) s jejich konfigurací (id, name, headers).
 * @param {Function} config.fetchData - Asynchronní funkce pro načtení a zpracování dat tabulky.
 * - Přijímá (locale, page, limit, filterParams).
 * - Musí vracet objekt { items: [], totalCount: number }.
 * @param {Function} [config.fetchSumData] - Volitelná asynchronní funkce pro načtení souhrnných dat.
 * - Přijímá (locale, filterParams).
 * - Musí vracet objekt { sum: string, total: string }.
 *
 * @returns {object} - Reaktivní proměnné a funkce pro použití v šabloně komponenty.
 */
export function useCompTableData(config) {
  const appStore = useAppStore();
  const { appLocale, currentPage, itemsPerPage, totalReceipts, totalSum } = storeToRefs(appStore);

  const loading = ref(true);
  const searchText = ref('');
  const columnDialog = ref(false);
  const tablePanels = ref(config.panels);
  const activePanelId = ref(tablePanels.value[0]?.id || null);

  const activePanel = computed(() => {
    return tablePanels.value.find(p => p.id === activePanelId.value);
  });

  const handleHeadersUpdate = (newHeaders) => {
    if (activePanel.value) {
      activePanel.value.headers = newHeaders;
    }
  };

  /**
   * Hlavní funkce pro načtení dat a souhrnů.
   */
  const loadData = async () => {
    loading.value = true;
    try {
      // 1. Připravíme parametry, které budou sdíleny pro oba API dotazy
      // (bez limitu a stránky, které jsou specifické pro getReceipts)
      // Zde získáme aktuální filtry z Pinia store, např. getReceiptsFrom, getReceiptsTo
      // V sales.vue je už máte, takže zde budeme předávat jen locale
      const filterParams = {
        custom: JSON.stringify([appStore.getReceiptsFrom, appStore.getReceiptsTo]), // Používáme data z Pinia store
        customTime: "[null,null]",
        generateFilters: true,
        filter: { "paymentType": "", "user": "", "device": "", "totalFrom": "", "totalTo": "", "query": "", "discount": "", "valid": "", "customer": "" },
        // API stále vyžaduje tyto, i když pro 'custom' rozsah nebudou použity
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        quarter: Math.floor((new Date().getMonth() + 3) / 3),
        day: "today",
        week: "thisWeek",
        useServerTime: false,
        type: "custom",
      };

      // 2. Volání fetchData pro data tabulky
      // Přebíráme page a itemsPerPage z Pinia store
      const tableDataResult = await config.fetchData(appLocale.value, currentPage.value, itemsPerPage.value, filterParams);

      for (const panelId in tableDataResult) {
        const panel = tablePanels.value.find(p => p.id === panelId);
        if (panel) {
          panel.items = tableDataResult[panelId].items;
          // NEBUDEME AKTUALIZOVAT totalReceipts ZDE, PROTOŽE fetchData vraci totalCount: 0
          // totalReceipts se bude aktualizovat z fetchSumData
        }
      }

      // 3. Volání fetchSumData pro souhrnné údaje (pokud je funkce definována)
      if (config.fetchSumData && activePanelId.value === 'receipts') { // Voláme jen pro Receipts panel
        const sumDataResult = await config.fetchSumData(appLocale.value, filterParams);
        if (sumDataResult) {
          totalSum.value = sumDataResult.sum || '0,00 Kč';
          // ZDE AKTUALIZUJEME totalReceipts Z total Z getReceiptsSum
          totalReceipts.value = parseInt(sumDataResult.total) || 0;
        }
      }

    } catch (error) {
      console.error(`Chyba při načítání dat v useCompTableData pro ${config.panels[0]?.id}:`, error);
      tablePanels.value.forEach(p => { p.items = []; });
      totalReceipts.value = 0;
      totalSum.value = '0,00 Kč';
    } finally {
      loading.value = false;
    }
  };

  watch([appLocale, currentPage, itemsPerPage, appStore.getReceiptsFrom, appStore.getReceiptsTo], loadData); // Sledujeme i změny datových filtrů
  onMounted(loadData);

  return {
    loading,
    searchText,
    columnDialog,
    tablePanels,
    activePanelId,
    activePanel,
    handleHeadersUpdate,
    loadData,
    currentPage,
    itemsPerPage,
    totalReceipts,
    totalSum, // Exportujeme totalSum
  };
}
