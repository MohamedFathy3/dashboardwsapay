<template>
  <section class="member-dashboard">
    <div
      v-if="isProfileLoading"
      class="member-panel"
    >
      <div class="px-6 py-4 text-center">
        Loading your dashboard...
      </div>
    </div>

    <div
      v-else-if="!isApprovedMember"
      class="member-panel"
    >
      <div class="px-6 py-4 text-center">
        <h4 class="mb-1 text-xl font-semibold text-slate-900">Account Pending Approval</h4>
        <p class="mb-0 text-slate-500">
          Your member profile exists, but dashboard access is only available after approval.
        </p>
      </div>
    </div>

    <template v-else>
      <MemberHero
        :member-display-name="memberDisplayName"
        @refresh="refreshMemberDashboard"
      />

      <BalanceCards :balance-cards="balanceCards" />

      <div class="mt-2 grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div class="xl:col-span-7">
          <TransferForm
            :member-display-name="memberDisplayName"
            :approved-recipients="recipients"
            :transfer-currencies="transferCurrencies"
            :transfer-form="transferForm"
            :transfer-error="transferError"
            :is-submitting-transfer="isSubmittingTransfer"
            @submit="openTransferPreview"
            @update:transfer-form="updateTransferForm"
          />
        </div>

        <div class="xl:col-span-5">
          <TransactionsList
            :transactions="memberTransactions"
            :current-member-id="currentMemberId"
          />
        </div>
      </div>

      <TransferPreviewModal
        :show="showPreviewModal"
        :member-display-name="memberDisplayName"
        :selected-recipient-name="selectedRecipientName"
        :preview-amount="previewAmount"
        :reference="transferForm.reference"
        :is-submitting-transfer="isSubmittingTransfer"
        @close="closeTransferPreview"
        @confirm="confirmTransfer"
      />
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import BalanceCards from "~/components/member-dashboard/BalanceCards.vue";
import MemberHero from "~/components/member-dashboard/MemberHero.vue";
import TransactionsList from "~/components/member-dashboard/TransactionsList.vue";
import TransferForm from "~/components/member-dashboard/TransferForm.vue";
import TransferPreviewModal from "~/components/member-dashboard/TransferPreviewModal.vue";
import { useMemberDashboard } from "~/composables/useMemberDashboard";
import { useTransfer } from "~/composables/useTransfer";

const {
  loading: isProfileLoading,
  profile,
  recipients,
  memberDisplayName,
  balanceCards,
  transferCurrencies,
  memberTransactions,
  isApprovedMember,
  loadMemberProfile,
  refreshMemberDashboard,
} = useMemberDashboard();

const {
  transferForm,
  transferError,
  isSubmittingTransfer,
  showPreviewModal,
  selectedRecipientName,
  previewAmount,
  updateTransferForm,
  openTransferPreview,
  closeTransferPreview,
  confirmTransfer,
} = useTransfer({
  approvedRecipients: recipients,
  transferCurrencies,
  loadMemberProfile,
});

const currentMemberId = computed(() => String(profile.value.id || ""));

onMounted(async () => {
  await refreshMemberDashboard();
});

definePageMeta({
  layout: "default",
  middleware: "auth-member",
  title: "Member Dashboard",
});
</script>
