<template>

  <div class="d-flex align-center flex-wrap pa-2 justify-center fill-height rounded">
    <v-btn-toggle v-model="activePeriod" @update:modelValue="setRange" color="primary" mandatory variant="outlined" density="comfortable">
      <v-btn value="day">DEN</v-btn>
      <v-btn value="week">TÝDEN</v-btn>
      <v-btn value="month">MĚSÍC</v-btn>
      <v-btn value="year">ROK</v-btn>
      <v-btn value="custom" disabled>VLASTNÍ</v-btn>
    </v-btn-toggle>
            <div class="d-flex align-center">
      <v-btn icon="mdi-chevron-left" variant="text" @click="navigate(-1)"></v-btn>
      <div class="text-center mx-1" style="min-width: 200px;">
        {{ displayedRangeText }}
      </div>
      <v-btn icon="mdi-chevron-right" variant="text" @click="navigate(1)" :disabled="isTodayOrFuture()"></v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAppStore } from '@/stores/app';
import { storeToRefs } from 'pinia';

const appStore = useAppStore();
const { dateRangeFrom, dateRangeTo } = storeToRefs(appStore);

const activePeriod = ref('day');

const setTime = (date, hours, mins, secs, ms) => {
  const newDate = new Date(date);
  newDate.setHours(hours, mins, secs, ms);
  return newDate;
};

const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return setTime(new Date(d.setDate(diff)), 0, 0, 0, 0);
};

const getEndOfWeek = (date) => {
  const startOfWeek = getStartOfWeek(date);
  return setTime(new Date(startOfWeek.setDate(startOfWeek.getDate() + 6)), 23, 59, 59, 999);
};

const setRange = (period) => {
  const now = new Date();
  activePeriod.value = period;
  if (period === 'day') {
    dateRangeFrom.value = setTime(now, 0, 0, 0, 0).toISOString();
    dateRangeTo.value = setTime(now, 23, 59, 59, 999).toISOString();
  } else if (period === 'week') {
    dateRangeFrom.value = getStartOfWeek(now).toISOString();
    dateRangeTo.value = getEndOfWeek(now).toISOString();
  } else if (period === 'month') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    dateRangeFrom.value = setTime(start, 0, 0, 0, 0).toISOString();
    dateRangeTo.value = setTime(end, 23, 59, 59, 999).toISOString();
  } else if (period === 'year') {
    const year = now.getFullYear();
    dateRangeFrom.value = setTime(new Date(year, 0, 1), 0, 0, 0, 0).toISOString();
    dateRangeTo.value = setTime(new Date(year, 11, 31), 23, 59, 59, 999).toISOString();
  }
};

const navigate = (direction) => {
  let from = new Date(dateRangeFrom.value);
  if (activePeriod.value === 'day') {
    from.setDate(from.getDate() + direction);
    dateRangeFrom.value = setTime(from, 0, 0, 0, 0).toISOString();
    dateRangeTo.value = setTime(from, 23, 59, 59, 999).toISOString();
  } else if (activePeriod.value === 'week') {
    from.setDate(from.getDate() + (7 * direction));
    dateRangeFrom.value = getStartOfWeek(from).toISOString();
    dateRangeTo.value = getEndOfWeek(from).toISOString();
  } else if (activePeriod.value === 'month') {
    from.setMonth(from.getMonth() + direction, 1);
    const start = new Date(from.getFullYear(), from.getMonth(), 1);
    const end = new Date(from.getFullYear(), from.getMonth() + 1, 0);
    dateRangeFrom.value = setTime(start, 0, 0, 0, 0).toISOString();
    dateRangeTo.value = setTime(end, 23, 59, 59, 999).toISOString();
  } else if (activePeriod.value === 'year') {
    from.setFullYear(from.getFullYear() + direction);
    const year = from.getFullYear();
    dateRangeFrom.value = setTime(new Date(year, 0, 1), 0, 0, 0, 0).toISOString();
    dateRangeTo.value = setTime(new Date(year, 11, 31), 23, 59, 59, 999).toISOString();
  }
};

const isToday = (someDate) => {
  const today = new Date();
  return someDate.getDate() === today.getDate() &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear();
}

const isTodayOrFuture = () => {
  const to = new Date(dateRangeTo.value);
  const today = setTime(new Date(), 0, 0, 0, 0);
  return to >= today;
}

const monthNamesCaps = ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"];

const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
};

const displayedRangeText = computed(() => {
  if (!dateRangeFrom.value) return '';
  const from = new Date(dateRangeFrom.value);
  const to = new Date(dateRangeTo.value);
  switch (activePeriod.value) {
    case 'day':
      if (isToday(from)) return `Dnes (${formatDate(from)})`;
      return formatDate(from);
    case 'week':
      return `${formatDate(from)} - ${formatDate(to)}`;
    case 'month':
      return `${monthNamesCaps[from.getMonth()]} ${from.getFullYear()}`;
    case 'year':
      return from.getFullYear();
    default:
      return '';
  }
});

onMounted(() => {
  setRange('day');
});
</script>
