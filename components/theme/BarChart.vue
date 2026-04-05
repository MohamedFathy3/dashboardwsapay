<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  data: { date: string; value: number }[];
}>();

// Convert "value" → "approved" (required by y-axis)
const chartData = computed(() => {
  return props.data.map((item) => ({
    date: item.date,
    value: Number(item.value) || 0,
    approved: Number(item.value) || 0,
  }));
});

// Categories must match key name
const categories = {
  approved: { name: "Approved" },
};

// Format X axis (months)
const xFormatter = (i: number) => {
  const item = chartData.value[i];
  if (!item) return "";

  return new Date(item.date).toLocaleDateString("en-US", {
    month: "short",
  });
};
</script>

<template>
  <BarChart
    :data="chartData"
    :height="250"
    :categories="categories"
    :y-axis="['approved']"
    :x-formatter="xFormatter"
    :y-min="0"
    :y-max="5"
    :yNumTicks="6"
    :yGridLine="true"
    :group-padding="0"
    :bar-padding="0.2"
    :legend-position="LegendPosition.Top"
  />
</template>