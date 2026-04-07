<template>
  <div
    v-if="show"
    class="transfer-preview-backdrop"
  >
    <div class="transfer-preview-card">
      <div class="mb-5 flex items-start justify-between gap-3">
        <div>
          <p class="member-eyebrow mb-3">Transfer Preview</p>
          <h4 class="mb-0 text-xl font-semibold text-slate-900">Confirm this transfer</h4>
        </div>

        <button
          type="button"
          class="member-button-link"
          @click="emit('close')"
        >
          Close
        </button>
      </div>

      <div class="transfer-preview-grid">
        <div>
          <span class="preview-label">From</span>
          <strong>{{ memberDisplayName }}</strong>
        </div>
        <div>
          <span class="preview-label">Recipient</span>
          <strong>{{ selectedRecipientName }}</strong>
        </div>
        <div>
          <span class="preview-label">Amount</span>
          <strong>{{ previewAmount }}</strong>
        </div>
        <div>
          <span class="preview-label">Reference</span>
          <strong>{{ reference || "No note added" }}</strong>
        </div>
      </div>

      <div class="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          class="member-button-secondary"
          @click="emit('close')"
        >
          Cancel
        </button>
        <button
          type="button"
          class="member-button-primary"
          :disabled="isSubmittingTransfer"
          @click="emit('confirm')"
        >
          {{ isSubmittingTransfer ? "Confirming..." : "Confirm Transfer" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean;
  memberDisplayName: string;
  selectedRecipientName: string;
  previewAmount: string;
  reference: string;
  isSubmittingTransfer: boolean;
}>();

const emit = defineEmits<{
  close: [];
  confirm: [];
}>();
</script>
