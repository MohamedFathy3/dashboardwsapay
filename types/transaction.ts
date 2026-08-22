// types/transaction.ts

// هذا كان المفروض يكون union type وليس interface
export type TransactionDirection = 'incoming' | 'outgoing'

// هذا interface للبيانات الإضافية
export interface TransactionDirectionInfo {
  isIncoming: boolean
  isOutgoing: boolean
  type: 'Deposit' | 'Withdrawal'
  sign: '+' | '-'
  colorClass: string
}

export interface Transaction {
  id: string | number
  type: string
  amount: number
  currency: string
  description?: string
  display_description?: string
  createdAt?: string
  member_id?: number | string
  user_id?: number | string
  from_user_id?: number | string
  to_user_id?: number | string
  member_display_name?: string
  status?: 'pending' | 'completed' | 'failed'
}

export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled'

export interface FormattedTransaction extends Transaction {
  formattedAmount: string
  formattedDate: string
  formattedDescription: string
  amountNumber: number
}

export interface DisplayableTransaction extends FormattedTransaction {
  display_description: string
  member_display_name: string
  direction: TransactionDirection
}

export interface CachedTransactionData {
  data: Transaction | Transaction[]
  timestamp: number
}

export interface TransactionFilters {
  startDate?: Date
  endDate?: Date
  minAmount?: number
  maxAmount?: number
  type?: TransactionDirection
  status?: TransactionStatus
  currency?: string
}




export interface GetTransactionsParams {
  memberId: string | number
  page?: number
  limit?: number
  offset?: number
  startDate?: string
  endDate?: string
  currency?: string
}

export interface GetTransactionsResponse {
  data: Transaction[]
  hasMore: boolean
  total: number
  page: number
  limit: number
}