// composables/useTransactionFormatter.ts
import type { Transaction, FormattedTransaction } from '@/types/transaction'

export interface FormatterOptions {
  locale?: string
  dateFormat?: Intl.DateTimeFormatOptions
}

export interface TransactionFormatterReturn {
  formatAmount: (amount: number | string, currency: string) => string
  formatDate: (date: string | Date | undefined) => string
  formatTransaction: (transaction: Transaction) => FormattedTransaction
  formatDescription: (description: string | undefined, maxLength?: number) => string
}

export function useTransactionFormatter(
  options: FormatterOptions = {}
): TransactionFormatterReturn {
  const {
    locale = 'en-US',
    dateFormat = { year: 'numeric', month: 'short', day: 'numeric' }
  } = options
  
  const formatAmount = (amount: number | string, currency: string): string => {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    
    if (isNaN(numericAmount)) {
      return `0.00 ${currency}`
    }
    
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency.toUpperCase(),
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(numericAmount)
    } catch (error) {
      return `${numericAmount.toFixed(2)} ${currency.toUpperCase()}`
    }
  }
  
  const formatDate = (date: string | Date | undefined): string => {
    if (!date) return ''
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date
      return new Intl.DateTimeFormat(locale, dateFormat).format(dateObj)
    } catch (error) {
      return String(date)
    }
  }
  
  const formatDescription = (description: string | undefined, maxLength: number = 100): string => {
    if (!description) return 'No reference provided'
    
    if (description.length <= maxLength) {
      return description
    }
    
    return `${description.substring(0, maxLength)}...`
  }
  
  const formatTransaction = (transaction: Transaction): FormattedTransaction => {
    return {
      ...transaction,
      formattedAmount: formatAmount(transaction.amount, transaction.currency),
      formattedDate: formatDate(transaction.createdAt),
      formattedDescription: formatDescription(transaction.display_description || transaction.description),
      amountNumber: typeof transaction.amount === 'string' 
        ? parseFloat(transaction.amount) 
        : transaction.amount
    }
  }
  
  return {
    formatAmount,
    formatDate,
    formatTransaction,
    formatDescription
  }
}