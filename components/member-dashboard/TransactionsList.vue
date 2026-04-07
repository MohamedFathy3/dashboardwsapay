<template>
  <div class="member-panel h-full">
    <div class="px-6 py-6">
      <h4 class="mb-1 text-xl font-semibold text-slate-900">Recent Transactions</h4>
      <p class="mb-5 text-sm text-slate-500 sm:text-base">
        Your latest activity is listed here after confirmed transfers.
      </p>

      <div
        v-if="!transactions.length"
        class="member-empty-state"
      >
        No transactions available yet.
      </div>

      <div v-else class="member-transactions">
        <div
          v-for="transaction in transactions"
          :key="transaction.id"
          class="member-transaction-item"
        >
          <div class="min-w-0">
            <strong class="block capitalize text-slate-900">
              {{ isIncoming(transaction, currentMemberId) ? "Deposit" : "Withdrawal" }}
            </strong>
            <span
              v-if="transaction.member_display_name"
              class="block text-sm text-slate-500"
            >
              {{ transaction.member_display_name }}
            </span>
            <span class="text-sm text-slate-500">
              {{ transaction.display_description || "No reference provided" }}
            </span>
          </div>

          <div class="text-right">
            <strong
              :class="isIncoming(transaction, currentMemberId) ? 'text-green-600' : 'text-red-600'"
            >
              {{ isIncoming(transaction, currentMemberId) ? "+" : "-" }}{{ transaction.amount }}
              {{ transaction.currency }}
            </strong>
            <span class="block text-sm text-slate-500">{{ transaction.createdAt || "" }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isIncoming } from "~/utils/transactionHelpers";
import type { MemberTransaction } from "~/utils/transactionHelpers";

defineProps<{
  transactions: MemberTransaction[];
  currentMemberId: string;
}>();
</script>
