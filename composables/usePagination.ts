// composables/usePagination.ts
import { ref, computed, type Ref, type ComputedRef } from 'vue'

export interface PaginationOptions {
  itemsPerPage?: number
  initialShowAll?: boolean
}

export interface PaginationReturn<T> {
  showAll: Ref<boolean>
  currentPage: Ref<number>
  displayedItems: ComputedRef<T[]>
  remainingItems: ComputedRef<T[]>
  hasMoreItems: ComputedRef<boolean>
  remainingCount: ComputedRef<number>
  totalPages: ComputedRef<number>
  toggleShowAll: () => void
  reset: () => void
  goToPage: (page: number) => void
  nextPage: () => void
  previousPage: () => void
}

export function usePagination<T>(
  items: Ref<T[]> | ComputedRef<T[]> | (() => T[]),
  options: PaginationOptions = {}
): PaginationReturn<T> {
  const { itemsPerPage = 5, initialShowAll = false } = options
  
  const showAll = ref<boolean>(initialShowAll)
  const currentPage = ref<number>(1)
  
  const getItems = (): T[] => {
    if (typeof items === 'function') {
      return items()
    }
    if ('value' in items) {
      return items.value
    }
    return items
  }
  
  const totalPages = computed<number>(() => {
    const itemsArray = getItems()
    return Math.ceil(itemsArray.length / itemsPerPage)
  })
  
  const displayedItems = computed<T[]>(() => {
    const itemsArray = getItems()
    
    if (showAll.value) {
      return itemsArray
    }
    
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return itemsArray.slice(start, end)
  })
  
  const remainingItems = computed<T[]>(() => {
    const itemsArray = getItems()
    if (showAll.value) return []
    return itemsArray.slice(itemsPerPage)
  })
  
  const hasMoreItems = computed<boolean>(() => {
    const itemsArray = getItems()
    return itemsArray.length > itemsPerPage
  })
  
  const remainingCount = computed<number>(() => {
    const itemsArray = getItems()
    return Math.max(0, itemsArray.length - itemsPerPage)
  })
  
  const toggleShowAll = (): void => {
    showAll.value = !showAll.value
    if (!showAll.value) {
      currentPage.value = 1
    }
  }
  
  const reset = (): void => {
    showAll.value = false
    currentPage.value = 1
  }
  
  const goToPage = (page: number): void => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
      showAll.value = false
    }
  }
  
  const nextPage = (): void => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
      showAll.value = false
    }
  }
  
  const previousPage = (): void => {
    if (currentPage.value > 1) {
      currentPage.value--
      showAll.value = false
    }
  }
  
  return {
    showAll,
    currentPage,
    displayedItems,
    remainingItems,
    hasMoreItems,
    remainingCount,
    totalPages,
    toggleShowAll,
    reset,
    goToPage,
    nextPage,
    previousPage
  }
}