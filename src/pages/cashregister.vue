<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col v-for="n in 3" :key="n" cols="12" sm="6" lg="4">
        <v-card class="d-flex align-center justify-center" min-height="600">
          <v-card-title class="text-h5 text-center">
            Pokladna {{ n }}
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// Placeholder pro stránku pokladen.
</script>

<style scoped>
.v-card {
  margin-bottom: 16px;
}

/* Na tabletu a větším, kde jsou karty vedle sebe, nechceme dvojitý okraj */
@media (min-width: 600px) {

  .v-row .v-col:last-child .v-card,
  .v-row .v-col:nth-last-child(2) .v-card {
    margin-bottom: 0;
  }
}

/* Na mobilu, kde je jen jeden sloupec, odstraníme okraj jen u poslední karty */
@media (max-width: 599px) {
  .v-row .v-col:last-child .v-card {
    margin-bottom: 0;
  }
}
</style>
