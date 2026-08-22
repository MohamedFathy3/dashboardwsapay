<!-- components/RecentTransactions.vue -->
<template>
  <div class="col-12 col-xl-5">
    <div class="card member-panel h-100">
      <div class="card-body">
        <h4 class="mb-1">Recent Transactions</h4>
        <p class="text-muted mb-2">Your latest activity is listed here after confirmed transfers.</p>

        <!-- Error State -->
        <div v-if="error" class="alert alert-danger">
          <i class="fas fa-exclamation-triangle me-2"></i>
          {{ error }}
          <button @click="$emit('retry')" class="btn btn-sm btn-outline-danger ms-2">
            Try Again
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="!displayedTransactions.length && !isLoading" class="member-empty-state">
          <i class="fas fa-receipt fa-2x mb-2 opacity-50"></i>
          <p class="mb-0">No transactions available yet.</p>
        </div>

        <!-- Loading State -->
        <div v-else-if="isLoading && !displayedTransactions.length" class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <!-- Transactions List -->
        <div v-else class="member-transactions">
          <!-- First 5 Transactions -->
          <TransitionGroup name="transaction-list">
            <div
              v-for="transaction in displayedTransactions"
              :key="transaction.id"
              class="member-transaction-item"
            >
              <div class="flex-grow-1">
                <strong class="d-block text-capitalize">
                  {{ getTransactionType(transaction) }}
                </strong>
                <span
                  v-if="transaction.member_display_name"
                  class="d-block text-muted small"
                >
                  <i class="fas fa-user me-1"></i>
                  {{ transaction.member_display_name }}
                </span>
                <span class="text-muted small">
                  <i class="fas fa-comment me-1"></i>
                  {{ transaction.display_description || "No reference provided" }}
                </span>
              </div>
              <div class="text-end">
                <strong :class="getTransactionColor(transaction)">
                  {{ getTransactionSign(transaction) }}{{ formatAmount(transaction.amount, transaction.currency) }}
                </strong>
                <span class="d-block text-muted small">
                  <i class="far fa-calendar-alt me-1"></i>
                  {{ formatDate(transaction.createdAt) }}
                </span>
              </div>
            </div>
          </TransitionGroup>

          <!-- Show More Button (Local) -->
          <ShowMoreButton 
            v-if="hasMoreItems && !showAll"
            :remaining-count="remainingCount"
            :is-expanded="showAll"
            @toggle="toggleShowAll"
          />

          <!-- Additional Transactions (Hidden until Show More) -->
          <div v-show="showAll" class="additional-transactions mt-2">
            <TransitionGroup name="transaction-list">
              <div
                v-for="transaction in remainingTransactions"
                :key="transaction.id"
                class="member-transaction-item additional-item"
              >
                <div class="flex-grow-1">
                  <strong class="d-block text-capitalize">
                    {{ getTransactionType(transaction) }}
                  </strong>
                  <span
                    v-if="transaction.member_display_name"
                    class="d-block text-muted small"
                  >
                    <i class="fas fa-user me-1"></i>
                    {{ transaction.member_display_name }}
                  </span>
                  <span class="text-muted small">
                    <i class="fas fa-comment me-1"></i>
                    {{ transaction.display_description || "No reference provided" }}
                  </span>
                </div>
                <div class="text-end">
                  <strong :class="getTransactionColor(transaction)">
                    {{ getTransactionSign(transaction) }}{{ formatAmount(transaction.amount, transaction.currency) }}
                  </strong>
                  <span class="d-block text-muted small">
                    <i class="far fa-calendar-alt me-1"></i>
                    {{ formatDate(transaction.createdAt) }}
                  </span>
                </div>
              </div>
            </TransitionGroup>
            
            <!-- Load More from Server Button -->
            <div v-if="hasMoreOnServer" class="text-center mt-3">
              <button 
                @click="$emit('load-more')" 
                class="btn btn-outline-primary btn-sm"
                :disabled="isLoadingMore"
              >
                <i v-if="isLoadingMore" class="fas fa-spinner fa-spin me-1"></i>
                <i v-else class="fas fa-download me-1"></i>
                {{ isLoadingMore ? 'Loading...' : 'Load More Transactions' }}
              </button>
            </div>
            
            <!-- No More Transactions Message -->
            <div v-else-if="!hasMoreOnServer && transactions.length > 5" class="text-center mt-3">
              <p class="text-muted small mb-0">
                <i class="fas fa-check-circle me-1"></i>
                No more transactions to load
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, toRef } from 'vue'
import ShowMoreButton from './ShowMoreButton.vue'
import { useTransactionsList } from '@/composables/useTransactionsList'
import { useTransactionFormatter } from '@/composables/useTransactionFormatter'
import type { Transaction } from '@/types/transaction'

const props = defineProps<{
  transactions: Transaction[]
  currentMemberId?: string | number
  hasMore?: boolean
  isLoading?: boolean
  isLoadingMore?: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  'load-more': []
  'retry': []
}>()

const currentMemberIdRef = toRef(props, 'currentMemberId')
const { formatAmount, formatDate } = useTransactionFormatter()

const {
  displayedTransactions,
  remainingTransactions,
  showAll,
  hasMoreItems,
  remainingCount,
  toggleShowAll,
  isIncoming,
  loadTransactions
} = useTransactionsList(props.transactions, {
  itemsPerPage: 5,
  currentMemberId: currentMemberIdRef
})

// Helper functions
const getTransactionType = (transaction: Transaction): string => {
  return isIncoming(transaction) ? 'Deposit' : 'Withdrawal'
}

const getTransactionColor = (transaction: Transaction): string => {
  return isIncoming(transaction) ? 'text-success' : 'text-danger'
}

const getTransactionSign = (transaction: Transaction): string => {
  return isIncoming(transaction) ? '+' : '-'
}

// Watch for transactions changes
watch(() => props.transactions, (newTransactions) => {
  loadTransactions(newTransactions)
}, { immediate: true, deep: true })
</script>

<style scoped>
.member-transactions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.member-transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 16px;
  background: #f7f9fc;
  transition: all 0.2s ease;
}

.member-transaction-item:hover {
  background: #eef2f7;
  transform: translateX(4px);
}

.member-empty-state {
  padding: 3rem 2rem;
  border-radius: 16px;
  background: #f7f9fc;
  color: #708198;
  text-align: center;
}

.additional-transactions {
  animation: slideDown 0.3s ease-out;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding-top: 0.75rem;
}

.additional-item {
  opacity: 0.9;
  transition: opacity 0.2s ease;
}

.additional-item:hover {
  opacity: 1;
}

/* Transaction List Animations */
.transaction-list-move,
.transaction-list-enter-active,
.transaction-list-leave-active {
  transition: all 0.3s ease;
}

.transaction-list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.transaction-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.transaction-list-leave-active {
  position: absolute;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 767.98px) {
  .member-transaction-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .member-transaction-item .text-end {
    text-align: left !important;
    margin-top: 8px;
  }
}
</style>