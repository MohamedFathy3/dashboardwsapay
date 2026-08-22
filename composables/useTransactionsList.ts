// composables/useTransactionsList.ts
import { ref, computed, type Ref, type ComputedRef } from 'vue'
import type { Transaction, DisplayableTransaction } from '@/types/transaction'
import { usePagination } from './usePagination'
import { useTransactionDisplay } from './useTransactionDisplay'
import { useTransactionFormatter } from './useTransactionFormatter'

export interface UseTransactionsListOptions {
  itemsPerPage?: number
  currentMemberId?: Ref<string | number | undefined> | ComputedRef<string | number | undefined>
}

export interface UseTransactionsListReturn {
  transactions: Ref<Transaction[]>
  displayedTransactions: ComputedRef<DisplayableTransaction[]>
  remainingTransactions: ComputedRef<Transaction[]>
  showAll: Ref<boolean>
  hasMoreItems: ComputedRef<boolean>
  remainingCount: ComputedRef<number>
  toggleShowAll: () => void
  isIncoming: (transaction: Transaction) => boolean
  loadTransactions: (newTransactions: Transaction[]) => void
}

export function useTransactionsList(
  initialTransactions: Transaction[] = [],
  options: UseTransactionsListOptions = {}
): UseTransactionsListReturn {
  const { itemsPerPage = 5, currentMemberId } = options
  
  const transactions = ref<Transaction[]>(initialTransactions)
  const { formatTransaction } = useTransactionFormatter()
  const { isIncoming } = useTransactionDisplay({ currentMemberId })
  
  const {
    displayedItems: paginatedTransactions,
    remainingItems,
    showAll,
    hasMoreItems,
    remainingCount,
    toggleShowAll
  } = usePagination(transactions, { itemsPerPage })
  
  const displayedTransactions = computed<DisplayableTransaction[]>(() => {
    return paginatedTransactions.value.map(transaction => {
      const formatted = formatTransaction(transaction)
      
      return {
        ...formatted,
        display_description: formatted.formattedDescription,
        member_display_name: transaction.member_display_name || '',
        direction: isIncoming(transaction) ? 'incoming' : 'outgoing'
      }
    })
  })
  
  const loadTransactions = (newTransactions: Transaction[]): void => {
    transactions.value = [...newTransactions]
  }
  
  return {
    transactions,
    displayedTransactions,
    remainingTransactions: remainingItems,
    showAll,
    hasMoreItems,
    remainingCount,
    toggleShowAll,
    isIncoming,
    loadTransactions
  }
}