<template>
  <div class="flex flex-wrap gap-4 mb-6">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search settings..."
      class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-64"
      @input="applyFilters"
    />

    <select
      v-model="selectedCurrency"
      class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-48"
      @change="applyFilters"
    >
      <option value="">All Currencies</option>
      <option value="usd">USD</option>
      <option value="eur">EUR</option>
      <option value="gbp">GBP</option>
    </select>

    <button
      class="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
      @click="resetFilters"
    >
      Reset
    </button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  filter: [filters: { search?: string; currency?: string }];
}>();

const searchQuery = ref('');
const selectedCurrency = ref('');

const applyFilters = () => {
  emit('filter', {
    search: searchQuery.value || undefined,
    currency: selectedCurrency.value || undefined,
  });
};

const resetFilters = () => {
  searchQuery.value = '';
  selectedCurrency.value = '';
  applyFilters();
};
</script>