<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Contacts Management</h1>

    <!-- Filters -->
    <!-- <div class="bg-white p-4 rounded-lg shadow mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          v-model="filters.name"
          placeholder="Search by name"
          class="border rounded px-3 py-2"
          @input="debounceFetch"
        />
        <input
          v-model="filters.email"
          placeholder="Search by email"
          class="border rounded px-3 py-2"
          @input="debounceFetch"
        />
        <input
          v-model="filters.subject"
          placeholder="Search by subject"
          class="border rounded px-3 py-2"
          @input="debounceFetch"
        />
        <input
          v-model="filters.message"
          placeholder="Search by message"
          class="border rounded px-3 py-2"
          @input="debounceFetch"
        />
      </div>

      <div class="mt-4 flex flex-wrap gap-4 items-center">
        <label class="flex items-center gap-2">
          <span>Sort by:</span>
          <select v-model="orderBy" class="border rounded px-3 py-2" @change="fetchContacts">
            <option value="id">ID</option>
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="created_at">Created At</option>
          </select>
        </label>

        <label class="flex items-center gap-2">
          <span>Direction:</span>
          <select v-model="orderByDirection" class="border rounded px-3 py-2" @change="fetchContacts">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>

        <label class="flex items-center gap-2">
          <span>Per page:</span>
          <select v-model="perPage" class="border rounded px-3 py-2" @change="fetchContacts">
            <option v-for="n in [10, 20, 50, 100]" :key="n" :value="n">{{ n }}</option>
          </select>
        </label>

        <button
          @click="resetFilters"
          class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Reset Filters
        </button>
      </div>
    </div> -->

    <!-- Table -->
    <div class="bg-white rounded-lg shadow overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="loading">
            <td colspan="6" class="px-6 py-4 text-center text-gray-500">Loading...</td>
          </tr>
          <tr v-else-if="contacts.length === 0">
            <td colspan="6" class="px-6 py-4 text-center text-gray-500">No contacts found</td>
          </tr>
          <tr v-for="contact in contacts" :key="contact.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ contact.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ contact.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ contact.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ contact.subject }}</td>
            <td class="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{{ contact.message }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(contact.created_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="mt-6 flex items-center justify-between">
      <div class="text-sm text-gray-500">
        Showing {{ meta.from }} to {{ meta.to }} of {{ meta.total }} entries
      </div>
      <div class="flex gap-2">
        <button
          @click="changePage(meta.current_page - 1)"
          :disabled="meta.current_page <= 1"
          class="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-50"
        >
          Previous
        </button>
        <span class="px-4 py-2 border rounded bg-blue-50 text-blue-600">
          {{ meta.current_page }} / {{ meta.last_page }}
        </span>
        <button
          @click="changePage(meta.current_page + 1)"
          :disabled="meta.current_page >= meta.last_page"
          class="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useApiFetch } from '~/composables/useApiFetch'
import { debounce } from 'lodash-es'

// State
const contacts = ref<any[]>([])
const loading = ref(false)
const meta = ref({
  current_page: 1,
  from: 0,
  last_page: 1,
  per_page: 20,
  to: 0,
  total: 0,
})

// Filter state - مطابق للـ JSON اللي حضرتك مديهالي
const filters = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const orderBy = ref('id')
const orderByDirection = ref<'asc' | 'desc'>('asc')
const perPage = ref(20)

// Fetch contacts
const fetchContacts = async () => {
  loading.value = true
  try {
    const response = await useApiFetch<any>('/contact/index', {
      method: 'POST',
      body: {
        filters: filters.value,
        orderBy: orderBy.value,
        orderByDirection: orderByDirection.value,
        perPage: perPage.value,
        paginate: 1,
        deleted: false,
      },
    })

    // لو الـ response جايب البيانات في `data`
    contacts.value = response.data || []
    meta.value = response.meta || meta.value
  } catch (error) {
    console.error('Error fetching contacts:', error)
  } finally {
    loading.value = false
  }
}

// Change page
const changePage = (page: number) => {
  if (page < 1 || page > meta.value.last_page) return
  fetchContacts()
  // إضافة الـ page في الـ body لو الـ API بتدعمه
}

// Reset filters
const resetFilters = () => {
  filters.value = { name: '', email: '', subject: '', message: '' }
  orderBy.value = 'id'
  orderByDirection.value = 'asc'
  perPage.value = 20
  fetchContacts()
}

// Debounce for search inputs
const debounceFetch = debounce(fetchContacts, 500)

// Format date
const formatDate = (date: string) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Fetch on mount
onMounted(() => {
  fetchContacts()
})
</script>