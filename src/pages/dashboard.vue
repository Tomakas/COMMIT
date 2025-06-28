// src/pages/dashboard.vue
<template>
  <v-container fluid class="pa-2">
    <v-row>

      <v-col cols="12" sm="12" lg="6">
        <v-card class="d-flex flex-column justify-center fill-height pa-2" >
        <DateRangeSelector />
        </v-card>
      </v-col>

      <v-col cols="12" sm="12" lg="6">
        <v-card class="d-flex flex-column justify-center fill-height pa-2" >
          <div class="d-flex justify-space-between align-baseline">
            <span class="text-body-1">Tržba:</span>
            <span class="text-h7 font-weight-bold">18 654,50 Kč</span>
            <span class="text-body-1">Účtenek:</span>
            <span class="text-h7 font-weight-bold">128</span>
          </div>
        </v-card>
      </v-col>

      <v-col v-for="n in 9" :key="n" cols="12" sm="6" lg="4">
        <v-card class="d-flex align-center justify-center fill-height" min-height="200">
          <v-card-title class="text-h6">Placeholder {{ n + 2 }}</v-card-title>
        </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>
<script setup>
</script>
<style scoped></style>
