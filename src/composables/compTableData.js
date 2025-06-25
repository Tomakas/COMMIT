import { ref, computed, onMounted, watch } from 'vue';
import { useAppStore } from '@/stores/app';
import { storeToRefs } from 'pinia';

/**
 * Composable funkce pro správu logiky stránek s datovými tabulkami.
 *
 * @param {object} config - Konfigurační objekt specifický pro danou stránku.
 * @param {Array} config.panels - Pole panelů (záložek) s jejich konfigurací (id, name, headers).
 * @param {Function} config.fetchData - Asynchronní funkce pro načtení a zpracování dat.
 * - Jako argument přijímá aktuální jazyk (locale).
 * - Musí vracet objekt, kde klíče odpovídají ID panelů a hodnoty jsou pole položek pro daný panel.
 * - Příklad pro stránku 'sales': return { receipts: [...], products: [...] }
 *
 * @returns {object} - Reaktivní proměnné a funkce pro použití v šabloně komponenty.
 */
export function useCompTableData(config) {
  // Přístup k globálnímu stavu (pro sledování změny jazyka)
  const appStore = useAppStore();
  const { appLocale } = storeToRefs(appStore);

  // --- Reaktivní stav sdílený napříč stránkami ---
  const loading = ref(true);
  const searchText = ref('');
  const columnDialog = ref(false);
  const tablePanels = ref(config.panels); // Inicializace panelů z předané konfigurace
  const activePanelId = ref(tablePanels.value[0]?.id || null);

  // --- Vypočtená vlastnost pro aktivní panel ---
  const activePanel = computed(() => {
    return tablePanels.value.find(p => p.id === activePanelId.value);
  });

  // --- Sdílené funkce ---
  /**
   * Zpracovává aktualizaci sloupců z dialogového okna.
   * @param {Array} newHeaders - Nová konfigurace hlaviček.
   */
  const handleHeadersUpdate = (newHeaders) => {
    if (activePanel.value) {
      activePanel.value.headers = newHeaders;
    }
  };

  /**
   * Hlavní funkce pro načtení dat. Používá specifickou funkci `fetchData`
   * předanou v konfiguraci, aby byla znovupoužitelná pro různé stránky.
   */
  const loadData = async () => {
    loading.value = true;
    try {
      // Zavoláme specifickou fetchData funkci, kterou nám stránka předala
      const processedData = await config.fetchData(appLocale.value);

      // Aktualizujeme položky v panelech na základě klíčů a hodnot vrácených z fetchData
      for (const panelId in processedData) {
        const panel = tablePanels.value.find(p => p.id === panelId);
        if (panel) {
          panel.items = processedData[panelId];
        }
      }

    } catch (error) {
      console.error(`Chyba při načítání dat v useCompTableData pro ${config.panels[0]?.id}:`, error);
      // V případě chyby bezpečně vyprázdníme všechny panely
      tablePanels.value.forEach(p => { p.items = []; });
    } finally {
      loading.value = false;
    }
  };

  // --- Lifecycle Hooks a Watchers ---
  watch(appLocale, loadData); // Znovu načteme data při změně jazyka
  onMounted(loadData);       // Načteme data při prvním načtení stránky

  // --- Vrácení veřejného API, které bude dostupné na stránce ---
  return {
    loading,
    searchText,
    columnDialog,
    tablePanels,
    activePanelId,
    activePanel,
    handleHeadersUpdate,
  };
}
