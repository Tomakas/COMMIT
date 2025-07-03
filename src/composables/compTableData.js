// src/composables/compTableData.js
import { ref, computed, watch, onMounted } from 'vue';
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
 * - Musí vracet objekt { items: [], totalCount: number, [optional: categories: []] }.
 * @param {Function} [config.fetchSumData] - Volitelná asynchronní funkce pro načtení souhrnných dat.
 * - Přijímá (locale, filterParams).
 * - Musí vracet objekt { sum: string, total: string }.
 *
 * @returns {object} - Reaktivní proměnné a funkce pro použití v šabloně komponenty.
 */
export function useCompTableData(config) {
  const appStore = useAppStore();
  const { appLocale, currentPage, itemsPerPage, totalReceipts, totalSum } = storeToRefs(appStore);

  const loading = ref(false);
  const searchText = ref('');
  const columnDialog = ref(false);
  const tablePanels = ref(config.panels);
  const activePanelId = ref(tablePanels.value[0]?.id || null);
  const sortBy = ref([{ key: 'mcode', order: 'asc' }]);
  const sortDesc = ref(false);

  const currentTotalItems = ref(0);

  const activePanel = computed(() => {
    return tablePanels.value.find(p => p.id === activePanelId.value);
  });

  const handleHeadersUpdate = (newHeaders) => {
    if (activePanel.value) {
      activePanel.value.headers = newHeaders;
    }
  };

  /**
   * Funkce pro načtení dat a souhrnů. Volána reaktivně.
   */
  const loadData = async () => {
    console.log('--- loadData() VOLÁNA ---');
    console.log(`  Active Panel: ${activePanelId.value}`);
    console.log(`  currentPage: ${currentPage.value}`);
    console.log(`  itemsPerPage: ${itemsPerPage.value}`);
    console.log(`  Loading status (before set): ${loading.value}`);

    if (loading.value) {
      console.log('  Načítání už probíhá, přeskakuji volání API.');
      return;
    }

    loading.value = true;
    try {
      const filterParams = {
        custom: JSON.stringify([appStore.getReceiptsFrom, appStore.getReceiptsTo]),
        customTime: "[null,null]",
        generateFilters: true,
        filter: { "paymentType": "", "user": "", "device": "", "totalFrom": "", "totalTo": "", "query": "", "discount": "", "valid": "", "customer": "" },
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        quarter: Math.floor((new Date().getMonth() + 3) / 3),
        day: "today",
        week: "thisWeek",
        useServerTime: false,
        type: "custom",
      };

      const fetchParams = {
        query: searchText.value,
        limit: itemsPerPage.value,
        offset: (currentPage.value - 1) * itemsPerPage.value,
        sortBy: sortBy.value,
        sortDesc: sortDesc.value,
      };

      const tableDataResult = await config.fetchData(appLocale.value, currentPage.value, itemsPerPage.value, fetchParams);


      for (const panelId in tableDataResult) {
        const panel = tablePanels.value.find(p => p.id === panelId);
        if (panel) {
          panel.items = tableDataResult[panelId].items;
          if (panelId === activePanelId.value) {
            currentTotalItems.value = tableDataResult[panelId].totalCount;
            console.log(`  Updated currentTotalItems for ${panelId}: ${currentTotalItems.value}`);
          }
        }
      }

      if (config.fetchSumData && activePanelId.value === 'receipts') {
        const sumDataResult = await config.fetchSumData(appLocale.value, filterParams);
        if (sumDataResult) {
          totalSum.value = sumDataResult.sum || '0,00 Kč';
          totalReceipts.value = parseInt(sumDataResult.total) || 0;
          console.log(`  Updated totalSum: ${totalSum.value}, totalReceipts: ${totalReceipts.value}`);
        }
      } else if (activePanelId.value !== 'receipts') {
        totalReceipts.value = 0;
        totalSum.value = '0,00 Kč';
      }

    } catch (error) {
      console.error(`Chyba při načítání dat v useCompTableData pro ${config.panels[0]?.id}:`, error);
      tablePanels.value.forEach(p => { p.items = []; });
      totalReceipts.value = 0;
      totalSum.value = '0,00 Kč';
      currentTotalItems.value = 0;
    } finally {
      loading.value = false;
      console.log('--- loadData() UKONČENA ---');
    }
  };

  const initialLoadTriggered = ref(false); // Nový flag pro řízení prvního spuštění

  watch(
    [activePanelId, appLocale, currentPage, itemsPerPage, appStore.getReceiptsFrom, appStore.getReceiptsTo, sortBy, sortDesc, searchText],
    ([newActivePanelId, newAppLocale, newCurrentPage, newItemsPerPage, newDateFrom, newDateTo],
      [oldActivePanelId, oldAppLocale, oldCurrentPage, oldItemsPerPage, oldDateFrom, oldDateTo]) => {

      console.log('--- WATCH TRIGGERED ---');
      console.log(`  activePanelId: ${oldActivePanelId} -> ${newActivePanelId}`);
      console.log(`  appLocale: ${oldAppLocale} -> ${newAppLocale}`);
      console.log(`  currentPage: ${oldCurrentPage} -> ${newCurrentPage}`);
      console.log(`  itemsPerPage: ${oldItemsPerPage} -> ${newItemsPerPage}`);
      console.log(`  DateFrom: ${oldDateFrom} -> ${newDateFrom}`);
      console.log(`  DateTo: ${oldDateTo} -> ${newDateTo}`);

      // Zabraňte prvnímu spuštění, pokud se jedná o nechtěnou inicializaci,
      // ale pouze po ověření, že se nejedná o smysluplnou změnu
      if (!initialLoadTriggered.value &&
        newActivePanelId === oldActivePanelId &&
        newAppLocale === oldAppLocale &&
        newCurrentPage === oldCurrentPage &&
        newItemsPerPage === oldItemsPerPage &&
        newDateFrom === oldDateFrom &&
        newDateTo === oldDateTo) {
        console.log('  Skipping initial redundant watch trigger.');
        initialLoadTriggered.value = true;
        return;
      }

      initialLoadTriggered.value = true; // Nastavte na true po prvním smysluplném triggeru

      // Reset currentPage na 1, pokud se změní aktivní panel nebo datumové filtry
      // Toto je nyní explicitně řešeno, aby se zamezilo dvojímu spouštění
      // Používáme String() pro bezpečné porovnání undefined/null s řetězci
      const dateFilterChanged = String(newDateFrom) !== String(oldDateFrom) || String(newDateTo) !== String(oldDateTo);

      if (
        newActivePanelId !== oldActivePanelId ||
        dateFilterChanged
      ) {
        if (currentPage.value !== 1) { // Pouze resetujeme, pokud už nejsme na stránce 1
          console.log(`  RESETTING currentPage to 1 due to panel/date change.`);
          currentPage.value = 1;
          // Return, protože změna currentPage sama spustí tento watch znovu
          // a tehdy se provede loadData.
          return;
        }
      }

      // Spustíme loadData, protože nastala nějaká relevantní změna
      console.log('  Calling loadData from main watch effect.');
      loadData();
    },
    { immediate: true }
  );

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
    totalSum,
    totalItems: currentTotalItems,
    sortBy,
    sortDesc,
  };
}