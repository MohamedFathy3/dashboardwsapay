// composables/useTransactionDisplay.ts
import type { Ref, ComputedRef } from 'vue'
import type { Transaction, TransactionDirection } from '@/types/transaction'

export interface UseTransactionDisplayOptions {
  currentMemberId?: Ref<string | number | undefined> | ComputedRef<string | number | undefined>
}

export interface TransactionDisplayReturn {
  isIncoming: (transaction: Transaction) => boolean
  getTransactionDirection: (transaction: Transaction) => TransactionDirection
}

export function useTransactionDisplay(
  options: UseTransactionDisplayOptions = {}
): TransactionDisplayReturn {
  const getCurrentMemberId = (): string | number => {
    if (!options.currentMemberId) return ''
    
    if ('value' in options.currentMemberId) {
      const value = options.currentMemberId.value
      if (value === undefined || value === null) return ''
      return String(value)
    }
    
    return ''
  }
  
  const isIncoming = (transaction: Transaction): boolean => {
    const type = transaction.type?.toLowerCase() ?? ''
    const description = transaction.description?.toLowerCase() ?? ''
    const currentMemberId = getCurrentMemberId()
    
    if (currentMemberId) {
      if (transaction.to_user_id && String(transaction.to_user_id) === currentMemberId) {
        return true
      }
      
      if (transaction.from_user_id && String(transaction.from_user_id) === currentMemberId) {
        return false
      }
      
      if (transaction.user_id && String(transaction.user_id) === currentMemberId) {
        return false
      }
    }
    
    const incomingPatterns = [
      /received from/i, /transfer from/i, /credited by/i, 
      /payment received/i, /deposit from/i
    ]
    
    const outgoingPatterns = [
      /sent to/i, /transfer to/i, /debited to/i, 
      /payment sent/i, /withdrawal to/i
    ]
    
    if (incomingPatterns.some(pattern => pattern.test(description))) return true
    if (outgoingPatterns.some(pattern => pattern.test(description))) return false
    
    const incomingTypes = ['add', 'deposit', 'receive', 'credit', 'incoming']
    const outgoingTypes = ['withdraw', 'withdrawal', 'debit', 'send', 'outgoing']
    
    if (incomingTypes.includes(type)) return true
    if (outgoingTypes.includes(type)) return false
    
    return false
  }
  
  const getTransactionDirection = (transaction: Transaction): TransactionDirection => {
    return isIncoming(transaction) ? 'incoming' : 'outgoing'
  }
  
  return {
    isIncoming,
    getTransactionDirection
  }
}