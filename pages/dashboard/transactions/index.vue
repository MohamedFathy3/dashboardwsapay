<template>
  <ClientOnly>
    <Breadcrumb
      title="Transactions"
      :items="[{ label: 'List of transactions', to: '/transactions' }]"
      :add="false"
      :filter="(filter = true)"
      :exportBtn="true"
      @open-filter="openModalFilter"
      @export-data="exportData"
    />
  </ClientOnly>

  <ModalFilter
    v-if="filter"
    :title="'Filter Transactions'"
    :items="filterItems"
    :modalFilter="modalFilter"
    @close="modalFilter = false"
    @filter-filters="submitFilters"
    @reset-filters="resetFilters"
  />
  <div v-if="transactions === null" class="bg-white">
    <ThemeSkelton :columns="columns"/>
  </div>
  
  <Table
    v-if="transactions && transactions.data && transactions.data.length > 0"
    :columns="columns"
    :data="transactions.data"
    :meta="transactions.meta"
    @change-page="handlePageChange"
    @change-per-page="handlePerPageChange"
    @change-search="handleSearchChange"
    @sort-data="handleSortData"
    :deleteBtns="false"
    :tableTitle="'transactions'"
  />
</template>
  
  <script setup>
import { ref, watch } from "vue";
import Breadcrumb from "@/components/theme/Breadcrumb.vue";
import Table from "@/components/theme/Table.vue";
import ModalFilter from "@/components/theme/ModalFilter.vue";
const currentPage = ref(1);
const perPage = ref(5);
const search = ref("");
const sortColumn = ref('id');
const sortDirection = ref('desc');
const showDeleted = ref(false);

const transactions = ref(null);
const appliedFilters = ref({});

const showModal = ref(false);
const filter = ref(false);
const modalFilter = ref(false);

const filterItems = [
  {
    name: "from",
    label: "From Date",
    type: "date",
    placeholder: "Enter date",
    class: "form-control",
  },
  {
    name: "to",
    label: "To Date",
    type: "date",
    placeholder: "Enter date",
    class: "form-control",
  },
  {
    name: "currency",
    label: "Currency",
    type: "select",
    placeholder: "Enter currencies",
    class: "form-control",
  },
  {
    name: "type",
    label: "Type",
    type: "select",
    placeholder: "Enter types",
    class: "form-control",
  },
];
// Table Columns
const columns = [
  { label: "Amount", key: "amount" },
  { label: "Balance Type", key: "type" },
  { label: "Currency", key: "currency" },
  { label: "Created At", key: "created_at" },
];

// API Data Fetch
const { data, refresh } = useApiIndex({
  api: `transactions`,
  key: "transactions-list",
  watch: [
    currentPage,
    perPage,
    search,
    sortColumn,
    sortDirection,
    showDeleted,
    appliedFilters,
  ],
  params: () => ({
    page: currentPage.value,
    per_page: perPage.value,
    search: search.value,
    order_by: sortColumn.value,
    sort: sortDirection.value,
    deleted: showDeleted.value,
    filters: {
      ...appliedFilters.value,
    },
  }),
});
// Sync data on change or page reload
watch(
  data,
  (newData) => {
    transactions.value = newData;
  },
  { immediate: true }
);

// Page Meta
definePageMeta({
  layout: "default",
  middleware: "auth",
  title: "Transactions",
});

// ========== Table Handlers ==========
const handlePageChange = (url) => {
  const page = new URL(url).searchParams.get("page");
  if (page) currentPage.value = Number(page);
};

const handlePerPageChange = (value) => {
  perPage.value = Number(value);
};

const handleSearchChange = (value) => {
  search.value = value;
};

const handleSortData = (column) => {
  sortColumn.value = column.key;
  sortDirection.value = column.sort;
};

// ========== Filter Submission ==========
const submitFilters = (filters) => {
  if (filters && Object.keys(filters).length > 0) {
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([_, v]) => v !== null && v !== "" && v !== undefined
      )
    );

    appliedFilters.value = cleanedFilters;
    refresh(); // refresh the API call with updated filters
  }
};
const openModalFilter = () => {
  modalFilter.value = true;
};

const exportData = async () => {
  try {
    const { data, error } = await useApiPdf({
      api: 'transactions-pdf',
      filters: appliedFilters.value,
      order_by: sortColumn.value,
      sort: sortDirection.value,
      params: () => ({
        search: search.value,
        page: currentPage.value,
        per_page: perPage.value,
      }),
    });

    if (error.value) {
      console.error("Export failed:", error.value);
      return;
    }

    if (data.value) {
      const blob = new Blob([data.value], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'transactions-report.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    }
  } catch (e) {
    console.error("Unexpected error during export:", e);
  }
};

// ========== Cleanup ==========
onBeforeUnmount(() => {
  appliedFilters.value = {};
});
// Cleanup applied filters when modal is closed
watch(showModal, (newValue) => {
  if (!newValue) {
    appliedFilters.value = {};
  }
});
// Cleanup applied filters when modal is closed

const resetFilters = () => {
  appliedFilters.value = {};
};
</script>
  
