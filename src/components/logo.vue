<template>
  <div
    class="logo-wrapper"
    :style="{ width: width, height: height }"
  >
    <LogoSVG />
  </div>
</template>

<script setup>

import LogoSVG from '@/assets/logo.svg?component';

defineProps({
  width: { type: String, default: '170px' },
  height: { type: String, default: '30px' }
});
</script>

<style scoped>
.logo-wrapper {
  /* Výchozí barva pro currentColor v SVG */
  color: #000000;
  transition: color 0.25s ease-in-out;
}

/* Reakce na Vuetify motiv */
.v-theme--dark .logo-wrapper {
  color: #FFFFFF;
}

.logo-wrapper svg {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
