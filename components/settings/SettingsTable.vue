<template>
  <div class="table-responsive">
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Currency</th>
          <th>Bank</th>
          <th>Account</th>
          <th>Number</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in settings" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ getCurrencyFromId(item.id) }}</td>
          <td>{{ item.bankName || '-' }}</td>
          <td>{{ item.accountName }}</td>
          <td>{{ item.accountNumber || '-' }}</td>
          <td>
            <span :class="item.active ? 'text-green-600' : 'text-red-600'">
              {{ item.active ? 'Active' : 'Inactive' }}
            </span>
          </td>
          <td>
            <button 
              class="btn btn-primary btn-sm"
              @click="handleEdit(item)"
            >
              <i class="feather icon-edit"></i> Edit
            </button>
            <button 
              class="btn btn-danger btn-sm"
              @click="handleDelete(item.id)"
            >
              <i class="feather icon-trash"></i> Delete
            </button>
          </td>
        </tr>
        <tr v-if="!settings.length">
          <td colspan="7" class="text-center">No data</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { BankSetting } from '~/types/setting';

const props = defineProps<{
  settings: BankSetting[];
}>();

const emit = defineEmits(['edit', 'delete']);

// استنتاج العملة من الـ ID
const getCurrencyFromId = (id: number) => {
  const currencies: Record<number, string> = { 1: 'USD', 2: 'EUR', 3: 'GBP' };
  return currencies[id] || 'USD';
};

// ⭐ Edit
const handleEdit = (item: BankSetting) => {
  console.log('🔵 Table emitting edit:', item);
  emit('edit', item);
};

// ⭐ Delete
const handleDelete = (id: number) => {
  console.log('🔴 Table emitting delete:', id);
  emit('delete', id);
};
</script>