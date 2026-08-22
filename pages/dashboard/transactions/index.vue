<template>
  <div class="p-6">
    <!-- Breadcrumb -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Transactions</h1>
        <p class="text-sm text-gray-500">Manage all transactions</p>
      </div>
      <div class="flex gap-2">
        <button
          @click="openFilter"
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filter
        </button>
        <button
          @click="exportData"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div v-if="showFilters" class="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <!-- Member -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Member</label>
          <select 
            v-model="filters.member_id" 
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
          >
            <option value="">All Members</option>
            <option 
              v-for="member in members" 
              :key="member.id" 
              :value="member.id"
            >
              {{ member.displayName || member.name || member.email }}
            </option>
          </select>
        </div>

        <!-- From Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">From Date</label>
          <div class="relative">
            <input 
              v-model="filters.from" 
              type="date" 
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            <svg class="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <!-- To Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">To Date</label>
          <div class="relative">
            <input 
              v-model="filters.to" 
              type="date" 
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            <svg class="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <!-- Currency -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Currency</label>
          <select 
            v-model="filters.currency" 
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
          >
            <option value="">All Currencies</option>
            <option value="USD">🇺🇸 USD</option>
            <option value="EUR">🇪🇺 EUR</option>
            <option value="GBP">🇬🇧 GBP</option>
          </select>
        </div>

        <!-- Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Type</label>
          <select 
            v-model="filters.type" 
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
          >
            <option value="">All Types</option>
            <option value="add">💰 Deposit</option>
            <option value="withdraw">🏦 Withdraw</option>
            <option value="transfer">🔄 Transfer</option>
          </select>
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
          <select 
            v-model="filters.status" 
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
          >
            <option value="">All Status</option>
            <option value="approved">✅ Approved</option>
            <option value="pending">⏳ Pending</option>
            <option value="rejected">❌ Rejected</option>
          </select>
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
        <button 
          @click="resetFilters" 
          class="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
        >
          Reset
        </button>
        <button 
          @click="applyFilters" 
          class="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm hover:shadow"
        >
          Apply Filters
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
      <div class="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p class="mt-3 text-gray-500">Loading transactions...</p>
    </div>

    <!-- Table -->
    <div v-else-if="transactions && transactions.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="transaction in transactions" :key="transaction.id" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">#{{ transaction.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {{ getInitials(transaction.member_display_name || transaction.user_name || 'U') }}
                  </div>
                  <span class="ml-3 text-sm font-medium text-gray-900">
                    {{ transaction.member_display_name || transaction.user_name || 'N/A' }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getAmountClass(transaction.type)">
                  {{ transaction.type === 'add' ? '+' : transaction.type === 'withdraw' ? '-' : '' }}
                  ${{ formatAmount(transaction.amount) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                  {{ transaction.currency }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getTypeClass(transaction.type)">
                  {{ getTypeLabel(transaction.type) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                {{ transaction.description || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(transaction.status)">
                  {{ transaction.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(transaction.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <button
                  v-if="transaction.status === 'pending'"
                  @click="approveTransaction(transaction.id)"
                  class="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition shadow-sm"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Approve
                </button>
                <span v-else class="text-sm text-gray-400">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span class="text-sm text-gray-500">
          Showing <span class="font-medium text-gray-700">{{ meta.from }}</span> to 
          <span class="font-medium text-gray-700">{{ meta.to }}</span> of 
          <span class="font-medium text-gray-700">{{ meta.total }}</span> entries
        </span>
        <div class="flex gap-1">
          <button
            v-for="link in meta.links"
            :key="link.label"
            @click="link.url && changePage(link.url)"
            :disabled="!link.url"
            :class="[
              'px-3.5 py-1.5 text-sm rounded-lg transition',
              link.active 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
              !link.url && 'opacity-50 cursor-not-allowed'
            ]"
            v-html="link.label"
          ></button>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else class="bg-white rounded-xl shadow-sm p-16 text-center border border-gray-200">
      <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
        <svg class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 class="mt-4 text-lg font-semibold text-gray-700">No transactions found</h3>
      <p class="text-gray-500 mt-1">Try adjusting your filters or search criteria</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useApiFetch } from '~/composables/useApiFetch';

// State
const transactions = ref<any[]>([]);
const members = ref<any[]>([]);
const meta = ref<any>({});
const isLoading = ref(false);
const showFilters = ref(false);

// Filters
const filters = ref({
  member_id: '',
  from: '',
  to: '',
  currency: '',
  type: '',
  status: '',
});

// Pagination
const currentPage = ref(1);
const perPage = ref(10);
const search = ref('');
const sortColumn = ref('id');
const sortDirection = ref('desc');

// Member cache
const memberCache = ref<Record<number, any>>({});

// Load Members
const loadMembers = async () => {
  try {
    const response = await useApiFetch('/members/index', {
      method: 'POST',
      body: {
        filters: {},
        perPage: 100,
        paginate: false,
        orderBy: 'id',
        orderByDirection: 'asc',
      },
    });

    if (response?.data) {
      members.value = response.data;
      members.value.forEach((member: any) => {
        memberCache.value[member.id] = member;
      });
    }
  } catch (error) {
    console.error('Failed to load members:', error);
  }
};

// Load transactions
const loadTransactions = async () => {
  isLoading.value = true;
  try {
    const filterParams: any = {};
    
    if (filters.value.member_id) filterParams.user_id = filters.value.member_id;
    if (filters.value.from) filterParams.from = filters.value.from;
    if (filters.value.to) filterParams.to = filters.value.to;
    if (filters.value.currency) filterParams.currency = filters.value.currency;
    if (filters.value.type) filterParams.type = filters.value.type;
    if (filters.value.status) filterParams.status = filters.value.status;

    const response = await useApiFetch('/transactions/index', {
      method: 'POST',
      body: {
        page: currentPage.value,
        per_page: perPage.value,
        search: search.value,
        order_by: sortColumn.value,
        sort: sortDirection.value,
        filters: filterParams,
      },
    });

    if (response?.data) {
      transactions.value = response.data.map((t: any) => ({
        ...t,
        member_display_name: getMemberName(t),
      }));
      meta.value = response.meta || {};
    }
  } catch (error) {
    console.error('Failed to load transactions:', error);
  } finally {
    isLoading.value = false;
  }
};

// Get member name
const getMemberName = (transaction: any) => {
  const memberId = transaction.user_id || transaction.from_user_id || transaction.to_user_id;
  if (memberId && memberCache.value[memberId]) {
    return memberCache.value[memberId].displayName || 
           memberCache.value[memberId].name || 
           memberCache.value[memberId].email;
  }
  return transaction.user_name || transaction.from_user_name || 'N/A';
};

// Approve
const approveTransaction = async (id: number) => {
  if (!confirm('Are you sure you want to approve this transaction?')) return;
  
  try {
    await useApiFetch(`/admin/wallet-transactions/${id}/approve`, {
      method: 'POST',
    });
    await loadTransactions();
  } catch (error) {
    console.error('Failed to approve transaction:', error);
  }
};

// Change page
const changePage = (url: string) => {
  const page = new URL(url).searchParams.get('page');
  if (page) {
    currentPage.value = Number(page);
    loadTransactions();
  }
};

// Apply filters
const applyFilters = () => {
  currentPage.value = 1;
  loadTransactions();
  showFilters.value = false;
};

// Reset filters
const resetFilters = () => {
  filters.value = {
    member_id: '',
    from: '',
    to: '',
    currency: '',
    type: '',
    status: '',
  };
  applyFilters();
};

// Open filter
const openFilter = () => {
  showFilters.value = !showFilters.value;
};

// Export
const exportData = async () => {
  try {
    const filterParams: any = {};
    if (filters.value.member_id) filterParams.user_id = filters.value.member_id;
    if (filters.value.from) filterParams.from = filters.value.from;
    if (filters.value.to) filterParams.to = filters.value.to;
    if (filters.value.currency) filterParams.currency = filters.value.currency;
    if (filters.value.type) filterParams.type = filters.value.type;
    if (filters.value.status) filterParams.status = filters.value.status;

    const response = await useApiFetch('/transactions-pdf', {
      method: 'POST',
      body: {
        filters: filterParams,
        order_by: sortColumn.value,
        sort: sortDirection.value,
        search: search.value,
      },
    });

    if (response) {
      const blob = new Blob([response as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'transactions-report.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('Export failed:', error);
  }
};

// Helpers
const getInitials = (name: string) => {
  if (!name) return 'U';
  return name.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase();
};

const formatAmount = (amount: string) => {
  return parseFloat(amount).toFixed(2);
};

const formatDate = (date: string) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    add: 'Deposit',
    withdraw: 'Withdraw',
    transfer: 'Transfer',
  };
  return labels[type] || type;
};

const getTypeClass = (type: string) => {
  const classes: Record<string, string> = {
    add: 'px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700',
    withdraw: 'px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700',
    transfer: 'px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700',
  };
  return classes[type] || 'px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700';
};

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    approved: 'px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700',
    pending: 'px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700',
    rejected: 'px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700',
  };
  return classes[status] || 'px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700';
};

const getAmountClass = (type: string) => {
  return type === 'add' ? 'text-emerald-600 font-bold' : 
         type === 'withdraw' ? 'text-red-600 font-bold' : 
         'text-blue-600 font-bold';
};

// Watch
watch([currentPage, perPage, search], () => {
  loadTransactions();
});

// Mount
onMounted(async () => {
  await loadMembers();
  await loadTransactions();
});
</script>