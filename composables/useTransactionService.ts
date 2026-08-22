import type { Transaction } from '@/types/transaction'

export function useTransactionService() {
  const getTransactions = async (params: {
    memberId: string | number
    page: number
    limit: number
  }) => {
    const response = await useApiFetch<{
      data: Transaction[]
      total: number
    }>('/transactions', {
      method: 'GET',
      params: {
        member_id: params.memberId,
        page: params.page,
        limit: params.limit
      },
      authType: 'member'
    })
    
    return {
      data: response.data || [],
      hasMore: response.data?.length === params.limit,
      total: response.total || 0
    }
  }
  
  return { getTransactions }
}