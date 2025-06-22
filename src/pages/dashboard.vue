<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12" sm="6" lg="6">
        <v-card class="d-flex align-center justify-center fill-height" min-height="50">
          <v-card-title class="text-h5">Placeholder 1</v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" lg="6">
        <v-card class="d-flex align-center justify-center fill-height" min-height="50">
          <v-card-title class="text-h5">Placeholder 2</v-card-title>
        </v-card>
      </v-col>

      <v-col v-for="n in 9" :key="n" cols="12" sm="6" lg="4">
        <v-card class="d-flex align-center justify-center fill-height" min-height="200">
          <v-card-title class="text-h5">Placeholder {{ n + 2 }}</v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
</script>

<style scoped></style>
