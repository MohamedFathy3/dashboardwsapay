<template>
  <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
    <div
      v-for="balanceCard in balanceCards"
      :key="balanceCard.currency"
      class="min-w-0"
    >
      <div class="member-balance-card">
        <div class="px-6 py-6">
          <p class="member-balance-label">{{ balanceCard.label }}</p>
          <h3 class="member-balance-amount !text-white">
            {{ formatMoney(balanceCard.balance, balanceCard.currency) }}
          </h3>
          <span class="member-balance-code">{{ balanceCard.currency }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatMoney } from "~/utils/formatMoney";
import type { MemberBalance } from "~/composables/useMemberDashboard";

defineProps<{
  balanceCards: MemberBalance[];
}>();
</script>
