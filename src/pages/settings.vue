  <template>
    <v-container class="fill-height" fluid>
      <v-responsive class="fill-height">
        <v-card class="mx-auto" flat>
          <v-toolbar flat>
            <v-tabs v-model="tab" align-tabs="center" color="primary" grow>
              <v-tab v-for="item in tabs" :key="item.id" :value="item.id">
                {{ item.name }}
              </v-tab>
            </v-tabs>
          </v-toolbar>

          <v-window v-model="tab">
            <v-window-item v-for="item in tabs" :key="item.id" :value="item.id">

              <div v-if="item.id === 'look-and-feel'">
                <v-card-text class="text-left">

                  <p class="text-subtitle-1 font-weight-medium mb-2">Mode</p>
                  <v-btn-toggle v-model="mode" color="primary" mandatory rounded="lg">
                    <v-btn value="light" icon="mdi-weather-sunny" size="x-large" </v-btn>
                      <v-btn value="dark" icon="mdi-weather-night" size="x-large"></v-btn>
                      <v-btn value="system" icon="mdi-laptop" size="x-large"></v-btn>
                  </v-btn-toggle>

                  <v-divider class="my-6"></v-divider>

                  <p class="text-subtitle-1 font-weight-medium mb-2">Navigation Menu</p>
                  <v-btn-toggle v-model="navMenuLayout" color="primary" mandatory rounded="lg">
                    <v-btn value="left" icon="mdi-dock-left" size="x-large"></v-btn>
                    <v-btn value="top" icon="mdi-dock-top" size="x-large"></v-btn>
                  </v-btn-toggle>

                  <v-divider class="my-6"></v-divider>

                  <p class="text-subtitle-1 font-weight-medium mb-2">Menu Text</p>
                  <v-btn-toggle v-model="menuStyle" color="primary" mandatory rounded="lg">
                    <v-btn value="full" icon="mdi-format-list-text" size="x-large"></v-btn>
                    <v-btn value="condensed" icon="mdi-dots-grid" size="x-large"></v-btn>
                  </v-btn-toggle>

                </v-card-text>
              </div>
              <div v-else>
                <v-card-text>
                  <p>Obsah pro: <strong>{{ item.name }}</strong></p>
                </v-card-text>
              </div>

            </v-window-item>
          </v-window>
        </v-card>
      </v-responsive>
    </v-container>
  </template>

<script setup>
import { ref, computed } from 'vue';
import { useAppStore } from '@/stores/app';
import { storeToRefs } from 'pinia';

// Načtení Pinia store
const appStore = useAppStore();

// Lokální stav pro taby zůstává
const tab = ref('look-and-feel');
const tabs = [
  { id: 'look-and-feel', name: 'Look & Feel' },
  { id: 'company', name: 'Company' },
  { id: 'taxes', name: 'Taxes' },
  { id: 'receipt-designer', name: 'Receipt Designer' },
  { id: 'permissions', name: 'Permissions' },
  { id: 'remote-orders', name: 'Remote Orders' },
  { id: 'suspicious-activity', name: 'Suspicious Activity' },
  { id: 'api-integrations', name: 'API and Integrations' },
  { id: 'licences', name: 'Licences' }
];

// Vypočtená vlastnost pro propojení `v-btn-toggle` s Pinia store
const mode = computed({
  get: () => appStore.theme,
  set: (value) => {
    appStore.theme = value;
  }
});

// Zbytek skriptu zůstává beze změny
const navMenuLayout = computed({
  get: () => appStore.navInAppBar ? 'top' : 'left',
  set: (value) => {
    appStore.navInAppBar = value === 'top';
  }
});

const menuStyle = computed({
  get: () => appStore.navWithText ? 'full' : 'condensed',
    set: (value) => {
      appStore.navWithText = value === 'full';
    }
  });
  </script>
