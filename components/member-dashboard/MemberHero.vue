<template>
  <div class="member-panel member-hero-card mb-6">
    <div class="px-6 py-6">
      <div class="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div>
          <span class="member-eyebrow">Member Dashboard</span>
          <h2 class="member-title mb-1">Welcome, {{ memberDisplayName }}</h2>
          <p class="mb-0 text-sm text-slate-500 sm:text-base">
            Manage your balances and initiate transfers from your approved member account.
          </p>
        </div>

        <button
          type="button"
          class="member-button-outline mt-2 lg:mt-0"
          @click="emit('refresh')"
        >
          Refresh Data
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  memberDisplayName: string;
}>();

const emit = defineEmits<{
  refresh: [];
}>();
</script>
