<template>
  <div class="member-panel">
    <div class="px-6 py-6">
      <div class="mb-5 flex items-start justify-between gap-3">
        <div>
          <h4 class="mb-1 text-xl font-semibold text-slate-900">Transfer Funds</h4>
          <p class="mb-0 text-sm text-slate-500 sm:text-base">
            Send funds to another approved member using one of your funded currencies.
          </p>
        </div>
      </div>

      <div
        v-if="transferError"
        class="member-alert-error mb-4"
        role="alert"
      >
        {{ transferError }}
      </div>

      <form @submit.prevent="emit('submit')">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div class="md:col-span-2">
            <fieldset class="member-fieldset">
              <label class="member-label">From Account</label>
              <input
                :value="memberDisplayName"
                type="text"
                class="member-input"
                disabled
              />
            </fieldset>
          </div>

          <div>
            <fieldset class="member-fieldset">
              <label class="member-label">Recipient Company</label>
              <select
                :value="transferForm.recipientId"
                class="member-select"
                @change="updateField('recipientId', ($event.target as HTMLSelectElement).value)"
              >
                <option value="" disabled>Select recipient company</option>
                <option
                  v-for="member in approvedRecipients"
                  :key="member.id"
                  :value="String(member.id)"
                >
                  {{ member.displayName || member.name }}
                </option>
              </select>
            </fieldset>
          </div>

          <div>
            <fieldset class="member-fieldset">
              <label class="member-label">Amount</label>
              <input
                :value="transferForm.amount"
                type="number"
                min="0.01"
                step="0.01"
                class="member-input"
                placeholder="Enter amount"
                @input="updateField('amount', ($event.target as HTMLInputElement).value)"
              />
            </fieldset>
          </div>

          <div>
            <fieldset class="member-fieldset">
              <label class="member-label">Currency</label>
              <select
                :value="transferForm.currency"
                class="member-select"
                @change="updateField('currency', ($event.target as HTMLSelectElement).value)"
              >
                <option value="" disabled>Select currency</option>
                <option
                  v-for="currency in transferCurrencies"
                  :key="currency.currency"
                  :value="currency.currency"
                >
                  {{ currency.label }}
                </option>
              </select>
            </fieldset>
          </div>

          <div>
            <fieldset class="member-fieldset">
              <label class="member-label">Reference / Notes</label>
              <input
                :value="transferForm.reference"
                type="text"
                class="member-input"
                placeholder="Optional transfer note"
                @input="updateField('reference', ($event.target as HTMLInputElement).value.trim())"
              />
            </fieldset>
          </div>
        </div>

        <div class="mt-2 flex flex-wrap gap-3">
          <button
            type="submit"
            class="member-button-primary"
            :disabled="isSubmittingTransfer"
          >
            Preview Transfer
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  MemberRecipient,
  TransferCurrency,
} from "~/composables/useMemberDashboard";
import type { TransferFormState } from "~/composables/useTransfer";

const props = defineProps<{
  memberDisplayName: string;
  approvedRecipients: MemberRecipient[];
  transferCurrencies: TransferCurrency[];
  transferForm: TransferFormState;
  transferError: string;
  isSubmittingTransfer: boolean;
}>();

const emit = defineEmits<{
  submit: [];
  "update:transferForm": [TransferFormState];
}>();

const updateField = <K extends keyof TransferFormState>(
  field: K,
  value: TransferFormState[K],
) => {
  emit("update:transferForm", {
    ...props.transferForm,
    [field]: value,
  });
};
</script>
