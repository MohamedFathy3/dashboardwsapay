<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Bank Accounts</h1>
    </div>

    <div v-if="!isClient" class="text-center py-10 text-gray-500">
      Loading...
    </div>
    
    <SettingsTable
      v-else
      :settings="settings"
      :meta="meta"
      :deleteBtns="true"
      :columns="columns"
      @edit="handleEdit"
      @show="handleShow"
      @delete="handleDelete"
      @select="handleSelect"
      @create="handleCreate"
    />

    <div v-if="selectedIds.length > 0" class="mt-4 flex justify-end">
      <button
        @click="handleBulkDelete"
        class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
      >
        Delete Selected ({{ selectedIds.length }})
      </button>
    </div>

    <!-- ⭐ المودل -->
    <SettingsModal
      :show-modal="isEditModalOpen"
      :setting-data="selectedSetting"
      title="Update Bank Account"
      :refresh="loadSettings"
      @update:show-modal="isEditModalOpen = $event"
      @updated="handleUpdateSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import type { BankSetting, SettingsFilter } from '~/types/setting';
import SettingsModal from '~/components/settings/Modal.vue';

const isClient = ref(false);
const { getSettings, deleteSettings, isLoading } = useSetting();
const settings = ref<BankSetting[]>([]);
const selectedIds = ref<number[]>([]);
const meta = ref({
  from: 1,
  to: 10,
  total: 0,
  per_page: 10,
  links: []
});

const isEditModalOpen = ref(false);
const selectedSetting = ref<BankSetting | null>(null);

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'currency', label: 'Currency' },
  { key: 'bankName', label: 'Bank' },
  { key: 'accountName', label: 'Account' },
  { key: 'accountNumber', label: 'Number' },
  { key: 'active', label: 'Status' },
  { key: 'actions', label: 'Actions' },
];

const loadSettings = async (filters?: SettingsFilter) => {
  try {
    const response = await getSettings(filters);
    settings.value = response?.data || [];
    console.log('✅ Settings loaded:', settings.value);
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
};

// ⭐ فتح المودل
const handleEdit = (setting: BankSetting) => {
  console.log('🔵 Edit clicked:', setting);
  selectedSetting.value = setting;
  isEditModalOpen.value = true;
};

const handleShow = (id: number) => {
  navigateTo(`/settings/${id}`);
};

const handleCreate = () => {
  navigateTo('/settings/create');
};

const handleDelete = async (id: number) => {
  if (confirm('Are you sure you want to delete this account?')) {
    await deleteSettings([id]);
    await loadSettings();
  }
};

const handleSelect = (ids: number[]) => {
  selectedIds.value = ids;
};

const handleBulkDelete = async () => {
  if (selectedIds.value.length === 0) return;
  if (confirm(`Delete ${selectedIds.value.length} settings?`)) {
    await deleteSettings(selectedIds.value);
    selectedIds.value = [];
    await loadSettings();
  }
};

const handleUpdateSuccess = () => {
  loadSettings();
};

onMounted(() => {
  isClient.value = true;
  loadSettings();
});
</script>