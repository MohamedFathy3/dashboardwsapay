<template>
  <div>
    <ClientOnly>
      <Breadcrumb
        title="Memebers"
        :items="[{ label: 'List of members', to: '/members' }]"
        :add="false"
        :filter="(filter = true)"
        @open-filter="openModalFilter"
        @openModal="openAddModal"
      />
    </ClientOnly>

    <!-- ===== CARDS (DYNAMIC) ===== -->
    <div class="row dashboard">
      <div class="col-lg-3 col-md-6 col-12">
        <Card
          :total="statusMap.pending"
          label="Pending"
          iconClass="feather icon-clock"
          colorMain="text-primary"
          bgClss="bg-rgba-primary"
        />
      </div>

      <div class="col-lg-3 col-md-6 col-12">
        <Card
          :total="statusMap.approved"
          label="Approved"
          iconClass="feather icon-users"
          colorMain="text-success"
          bgClss="bg-rgba-success"
        />
      </div>

      <div class="col-lg-3 col-md-6 col-12">
        <Card
          :total="statusMap.suspended"
          label="Suspended"
          iconClass="feather icon-circle"
          colorMain="text-primary"
          bgClss="bg-rgba-primary"
        />
      </div>

      <div class="col-lg-3 col-md-6 col-12">
        <Card
          :total="statusMap.deactivate"
          label="Deactivate"
          iconClass="feather icon-lock"
          colorMain="text-danger"
          bgClss="bg-rgba-danger"
        />
      </div>
    </div>

    <!-- ===== MODALS ===== -->
    <Modal
      :showModal="showModal"
      @update:showModal="showModal = $event"
      :formFields="formFields"
      :title="modalTitle"
      :apiTitle="apiTitle"
      :id="selectedId"
      :refresh="refresh"
    />

    <ModalFilter
      v-if="filter"
      :title="'Filter Transactions'"
      :items="filterItems"
      :modalFilter="modalFilter"
      @close="modalFilter = false"
      @filter-filters="submitFilters"
      @reset-filters="resetFilters"
    />

    <!-- ===== TABLE ===== -->
    <div v-if="members === null" class="bg-white">
      <ThemeSkelton :columns="columns"/>
    </div>

    <Table
      v-if="members && members.data && members.data.length > 0"
      :columns="columns"
      :data="members.data"
      :meta="members.meta"
      @change-page="handlePageChange"
      @change-per-page="handlePerPageChange"
      @change-search="handleSearchChange"
      @view-item="viewItem"
      @edit-item="openEditModal"
      @delete-item="handleDeleteItem"
      @delete-selected="handleDeleteSelected"
      @deleted-items="showDeletedItems"
      @get-items="showAllItems"
      @sort-data="handleSortData"
      :deleteBtns="true"
      :tableTitle="'members'"
    />
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount } from "vue";
import { useNuxtApp } from "#app";
import Breadcrumb from "@/components/theme/Breadcrumb.vue";
import Modal from "@/components/theme/Modal.vue";
import ModalFilter from "@/components/theme/ModalFilter.vue";
import Card from "@/components/theme/Card.vue";
import Table from "@/components/theme/Table.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const memberStore = useMemberStore();
const { $swal } = useNuxtApp();

// =====================
//  STATUS API (NEW)
// =====================
const statuses = ref([]);

onMounted(async () => {
  try {
    const res = await useApiFetch(`/users/statuses`, {
      method: "POST",
      body: {},
    });

    statuses.value = res?.data || [];
  } catch (err) {
    console.error(err);
  }
});

// =====================
// STATUS MAP (CARDS)
// =====================
const statusMap = computed(() => {
  const map = {
    pending: 0,
    approved: 0,
    suspended: 0,
    deactivate: 0,
  };

  statuses.value.forEach((item) => {
    const key = String(item.status).trim().toLowerCase();
    const value = Number(item.total) || 0;

    if (key && key in map) {
      map[key] += value;
    }
  });

  return map;
});

// =====================
// EXISTING STATE
// =====================
const showModal = ref(false);
const filter = ref(false);

const modalTitle = ref("");
const apiTitle = ref("add");
const selectedId = ref(null);
const formFields = ref([]);

const currentPage = ref(1);
const perPage = ref(5);
const search = ref("");
const sortColumn = ref("id");
const sortDirection = ref("desc");
const showDeleted = ref(false);
const modalFilter = ref(false);
const appliedFilters = ref({});

const members = ref(null);

// =====================
// FILTERS & TABLE
// =====================
const filterItems = [
  { name: "name", label: "Name", type: "text", class: "form-control" },
  { name: "email", label: "Email", type: "email", class: "form-control" },
  { name: "country_id", label: "Country", type: "select", class: "form-control" },
  { name: "status", label: "Status", type: "select", class: "form-control" },
];

const columns = [
  { label: "Name", key: "name" },
  { label: "Status", key: "status" },
  { label: "Actions", key: "actions" },
];

// =====================
// FORM CONFIG
// =====================
const formFieldsConfig = [
  { name: "name", label: "Name", type: "text", required: true, class: "form-control" },
  { name: "email", label: "Email", type: "email", required: true, class: "form-control" },
  { name: "password", label: "Password", type: "password", class: "form-control" },
];

// =====================
// API LIST
// =====================
const { data, refresh } = useApiIndex({
  api: "members",
  key: "members-list",
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
    filters: { ...appliedFilters.value },
  }),
});

// Sync API → table
watch(
  data,
  (newData) => {
    members.value = newData;
  },
  { immediate: true }
);

// =====================
// MODAL ACTIONS
// =====================
const openAddModal = () => {
  modalTitle.value = "Add Memeber";
  apiTitle.value = "add";
  selectedId.value = null;
  formFields.value = formFieldsConfig.map((f) => ({ ...f, value: "" }));
  showModal.value = true;
};

const openEditModal = (item) => {
  modalTitle.value = "Edit Memeber";
  apiTitle.value = "update";
  selectedId.value = item.id;
  formFields.value = formFieldsConfig.map((f) => ({
    ...f,
    value: f.name === "password" ? "" : item[f.name],
  }));
  showModal.value = true;
};

// =====================
// TABLE HANDLERS
// =====================
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

// =====================
// DELETE
// =====================
const handleDeleteItem = async (id) => {
  if (await confirmDelete()) {
    const { data } = await useApiDelete({ api: "members", ids: [id] });
    if (data) {
      showDeleteSuccess();
      refresh();
    }
  }
};

const handleDeleteSelected = async (ids) => {
  if (await confirmDelete(ids.length)) {
    const { data } = await useApiDelete({ api: "members", ids });
    if (data) {
      showDeleteSuccess();
      refresh();
    }
  }
};

// =====================
// TOGGLE DELETED
// =====================
const showDeletedItems = () => {
  showDeleted.value = true;
  currentPage.value = 1;
};

const showAllItems = () => {
  showDeleted.value = false;
  currentPage.value = 1;
};

// =====================
// ALERTS
// =====================
const confirmDelete = async (count = 1) => {
  const result = await $swal.fire({
    title: "Are you sure?",
    text: `You’re deleting ${count} item(s)!`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  });
  return result.isConfirmed;
};

const showDeleteSuccess = () => {
  $swal.fire({
    icon: "success",
    title: "Deleted!",
    text: "The item(s) have been deleted.",
  });
};

// =====================
// FILTERS
// =====================
const openModalFilter = () => {
  modalFilter.value = true;
};

const submitFilters = (filters) => {
  const cleaned = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v !== null && v !== "")
  );
  appliedFilters.value = cleaned;
  refresh();
};

const resetFilters = () => {
  appliedFilters.value = {};
};

// =====================
// NAVIGATION
// =====================
const viewItem = (id) => {
  memberStore.setMember(id);
  router.push(`/dashboard/members/${id}`);
};

// =====================
// CLEANUP
// =====================
onBeforeUnmount(() => {
  appliedFilters.value = {};
});

watch(showModal, (val) => {
  if (!val) appliedFilters.value = {};
});

// =====================
// PAGE META
// =====================
definePageMeta({
  layout: "default",
  middleware: "auth",
  title: "members",
});
</script>

<style scoped>
/* optional */
</style>
