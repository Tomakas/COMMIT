<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
// Okamžité přesměrování na cestu /dashboard, když se načte tato stránka.
router.replace('/dashboard')
</script>

<template>
  <div class="text-center text-caption pa-4">
    Přesměrovávám na Dashboard...
  </div>
</template>
