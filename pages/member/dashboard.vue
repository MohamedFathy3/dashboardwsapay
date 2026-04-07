<template>
    <section class="member-dashboard">
    <div v-if="isProfileLoading" class="card member-panel">
        <div class="card-body text-center py-4">
        Loading your dashboard...
        </div>
    </div>

    <div v-else-if="!isApprovedMember" class="card member-panel">
        <div class="card-body text-center py-4">
        <h4 class="mb-1">Account Pending Approval</h4>
        <p class="mb-0 text-muted">
        Your member profile exists, but dashboard access is only available after approval.
        </p>
        </div>
    </div>

    <template v-else>
        <div class="member-hero card member-panel">
        <div class="card-body">
            <div class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center">
            <div>
                <span class="member-eyebrow">Member Dashboard</span>
                <h2 class="member-title mb-1">Welcome, {{ memberDisplayName }}</h2>
                <p class="text-muted mb-0">
                Manage your balances and initiate transfers from your approved member account.
                </p>
            </div>
            <button class="btn btn-outline-primary mt-2 mt-lg-0" @click="refreshMemberDashboard">
                Refresh Data
            </button>
            </div>
        </div>
        </div>

        <div class="row">
        <div
            v-for="balanceCard in balanceCards"
            :key="balanceCard.currency"
            class="col-12 col-md-6 col-xl-4"
        >
        <div class="card member-balance-card">
            <div class="card-body">
                <p class="member-balance-label">{{ balanceCard.label }}</p>
                <h3 class="member-balance-amount">{{ formatMoney(balanceCard.balance, balanceCard.currency) }}</h3>
                <span class="member-balance-code">{{ balanceCard.currency }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-2">
        <div class="col-12 col-xl-7">
          <div class="card member-panel">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h4 class="mb-1">Transfer Funds</h4>
                  <p class="text-muted mb-0">
                    Send funds to another approved member using one of your funded currencies.
                  </p>
                </div>
              </div>

              <div v-if="transferError" class="alert alert-danger" role="alert">
                {{ transferError }}
              </div>

              <form @submit.prevent="openTransferPreview">
                <div class="row">
                  <div class="col-12">
                    <fieldset class="form-group">
                      <label class="form-label">From Account</label>
                      <input
                        :value="memberDisplayName"
                        type="text"
                        class="form-control"
                        disabled
                      />
                    </fieldset>
                  </div>

                  <div class="col-12 col-md-6">
                    <fieldset class="form-group">
                      <label class="form-label">Recipient Company</label>
                      <select v-model="transferForm.recipientId" class="form-control">
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

                  <div class="col-12 col-md-6">
                    <fieldset class="form-group">
                      <label class="form-label">Amount</label>
                      <input
                        v-model="transferForm.amount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        class="form-control"
                        placeholder="Enter amount"
                      />
                    </fieldset>
                  </div>

                  <div class="col-12 col-md-6">
                    <fieldset class="form-group">
                      <label class="form-label">Currency</label>
                      <select v-model="transferForm.currency" class="form-control">
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

                  <div class="col-12 col-md-6">
                    <fieldset class="form-group">
                      <label class="form-label">Reference / Notes</label>
                      <input
                        v-model.trim="transferForm.reference"
                        type="text"
                        class="form-control"
                        placeholder="Optional transfer note"
                      />
                    </fieldset>
                  </div>
                </div>

                <div class="d-flex flex-wrap gap-1">
                  <button type="submit" class="btn btn-primary" :disabled="isSubmittingTransfer">
                    Preview Transfer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div class="col-12 col-xl-5">
          <div class="card member-panel h-100">
            <div class="card-body">
              <h4 class="mb-1">Recent Transactions</h4>
              <p class="text-muted mb-2">Your latest activity is listed here after confirmed transfers.</p>

              <div v-if="!memberTransactions.length" class="member-empty-state">
                No transactions available yet.
              </div>

              <div v-else class="member-transactions">
                <div
                  v-for="transaction in memberTransactions"
                  :key="transaction.id"
                  class="member-transaction-item"
                >
                  <div>
                    <strong class="d-block text-capitalize">
                      {{ isIncoming(transaction) ? "Deposit" : "Withdrawal" }}
                    </strong>
                    <span
                      v-if="transaction.member_display_name"
                      class="d-block text-muted small"
                    >
                      {{ transaction.member_display_name }}
                    </span>
                    <span class="text-muted small">
                      {{ transaction.display_description || "No reference provided" }}
                    </span>
                  </div>
                  <div class="text-right">
                    <strong
                      :class="isIncoming(transaction) ? 'text-success' : 'text-danger'"
                    >
                      {{ isIncoming(transaction) ? "+" : "-" }}{{ transaction.amount }}
                      {{ transaction.currency }}
                    </strong>
                    <span class="d-block text-muted small">{{ transaction.createdAt || "" }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showPreviewModal" class="transfer-preview-backdrop">
        <div class="transfer-preview-card">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <div>
              <p class="transfer-preview-eyebrow">Transfer Preview</p>
              <h4 class="mb-0">Confirm this transfer</h4>
            </div>
            <button class="btn btn-link text-muted p-0" @click="showPreviewModal = false">
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
              <strong>{{ transferForm.reference || "No note added" }}</strong>
            </div>
          </div>

          <div class="d-flex flex-wrap gap-1 mt-2">
            <button class="btn btn-outline-secondary" @click="showPreviewModal = false">
              Cancel
            </button>
            <button class="btn btn-primary" :disabled="isSubmittingTransfer" @click="confirmTransfer">
              {{ isSubmittingTransfer ? "Confirming..." : "Confirm Transfer" }}
            </button>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">

type MemberRecipient = {
  id: number | string;
  name: string;
  displayName?: string;
  status?: string;
  balances?: Array<{ currency: string; balance: number | string }>;
  wallets?: Array<{ currency?: string; balance?: number | string }>;
};

type MemberTransaction = {
  id: number | string;
  type: string;
  amount: number | string;
  currency: string;
  description?: string;
  display_description?: string;
  createdAt?: string;
  member_id?: number | string;
  user_id?: number | string;
  from_user_id?: number | string;
  to_user_id?: number | string;
  member_display_name?: string;
};

type MemberBalance = {
  currency: "GBP" | "USD" | "EUR";
  label: string;
  balance: number;
};

const memberStore = useMemberStore();
const notify = useNotify();

const isProfileLoading = ref(false);
const approvedRecipients = ref<MemberRecipient[]>([]);
const isSubmittingTransfer = ref(false);
const showPreviewModal = ref(false);
const transferError = ref("");
const memberDisplayNameCache = ref<Record<string, { display_name?: string; name?: string }>>({});

const transferForm = ref({
  recipientId: "",
  amount: "",
  currency: "",
  reference: "",
});

const memberProfile = computed(() => memberStore.profile || {});

const memberDisplayName = computed(
  () => memberProfile.value.displayName || memberProfile.value.name || "Member"
);

const memberBalances = computed<MemberBalance[]>(() => {
  const balances = (memberProfile.value.balances || memberProfile.value.wallets || []) as Array<{
    currency: string;
    balance: number | string;
  }>;
  const balanceMap = new Map(
    balances.map((item) => [String(item.currency).toUpperCase(), Number(item.balance) || 0])
  );
  return [
    { currency: "GBP", label: "British Pound", balance: balanceMap.get("GBP") || 0 },
    { currency: "USD", label: "US Dollar", balance: balanceMap.get("USD") || 0 },
    { currency: "EUR", label: "Euro", balance: balanceMap.get("EUR") || 0 },
];
});

const balanceCards = computed(() => memberBalances.value);

const transferCurrencies = computed(() =>
  memberBalances.value
    .filter((item) => item.balance > 0)
    .map((item) => ({
      currency: item.currency,
      label: `${item.label} (${item.currency})`,
      balance: item.balance,
    }))
);

const getTransactionMemberId = (transaction: MemberTransaction) => {
  const candidateId =
    transaction.member_id ??
    transaction.user_id ??
    transaction.from_user_id ??
    transaction.to_user_id;

  if (candidateId) {
    return String(candidateId);
  }

  const descriptionMatch = transaction.description?.match(/user\s*#\s*(\d+)/i);

  return descriptionMatch?.[1] || "";
};

const getCachedMemberDisplayName = (memberId: string) => {
  if (!memberId) return "";

  const cachedMember = memberDisplayNameCache.value[memberId];

  return cachedMember?.display_name || cachedMember?.name || memberId;
};

const getTransactionDisplayDescription = (transaction: MemberTransaction, memberDisplayNameValue: string) => {
  const description = transaction.description?.trim();

  if (!description) return "";
  if (!memberDisplayNameValue) return description;

  return description
    .replace(/Transfer to user #\d+/i, `Transfer to ${memberDisplayNameValue}`)
    .replace(/Transfer from user #\d+/i, `Transfer from ${memberDisplayNameValue}`)
    .replace(/user #\d+/i, memberDisplayNameValue);
};

const memberTransactions = computed<MemberTransaction[]>(() => {
  const transactions = (memberProfile.value.lastTransactions || memberProfile.value.transactions || []) as MemberTransaction[];

  return transactions.map((transaction) => {
    const memberId = getTransactionMemberId(transaction);
    const memberDisplayNameValue = memberId ? getCachedMemberDisplayName(memberId) : "";

    return {
      ...transaction,
      member_display_name: memberDisplayNameValue,
      display_description: getTransactionDisplayDescription(transaction, memberDisplayNameValue),
    };
  });
});

const isApprovedMember = computed(
  () => memberProfile.value.status?.toLowerCase() === "approved"
);

const selectedRecipient = computed(() =>
  approvedRecipients.value.find((member) => String(member.id) === transferForm.value.recipientId) || null
);

const selectedRecipientName = computed(
  () => selectedRecipient.value?.displayName || selectedRecipient.value?.name || ""
);

const previewAmount = computed(() => {
  const amount = Number(transferForm.value.amount) || 0;
  return formatMoney(amount, transferForm.value.currency || "USD");
});

const formatMoney = (value: number, currency: string) => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch (error) {
    return `${value.toFixed(2)} ${currency}`;
  }
};

const isIncoming = (transaction: MemberTransaction): boolean => {
  const type = transaction.type?.toLowerCase() ?? "";
  const description = transaction.description?.toLowerCase() ?? "";
  const currentMemberId = String(memberProfile.value.id || "");

  if (currentMemberId) {
    // If I am the recipient, always treat it as incoming.
    if (transaction.to_user_id && String(transaction.to_user_id) === currentMemberId) {
      return true;
    }

    // If I am the sender, always treat it as outgoing.
    if (transaction.from_user_id && String(transaction.from_user_id) === currentMemberId) {
      return false;
    }

    // Some payloads use `user_id` for the actor who initiated the transfer.
    if (transaction.user_id && String(transaction.user_id) === currentMemberId) {
      return false;
    }
  }

  // Descriptions are more reliable than `type` for member-to-member transfers.
  if (
    /received from|transfer from|credited by|payment received/.test(description)
  ) {
    return true;
  }

  if (
    /sent to|transfer to|debited to|payment sent/.test(description)
  ) {
    return false;
  }

  // Unambiguous deposit types
  if (type === "add" || type === "deposit" || type === "receive" || type === "credit") {
    return true;
  }

  // Unambiguous withdrawal types
  if (type === "withdraw" || type === "withdrawal" || type === "debit") {
    return false;
  }

  return false;
};

const loadMemberProfile = async () => {
  isProfileLoading.value = true;

  try {
    await memberStore.fetchProfile();
    await loadMemberDisplayNames(memberTransactions.value);
  } catch (error: any) {
    notify.error(error?.message || "Failed to load your member profile.");
  } finally {
    isProfileLoading.value = false;
  }
};

const loadMemberDisplayNames = async (transactionsList: MemberTransaction[] = []) => {
  const memberIds = [
    ...new Set(
      transactionsList
        .map((transaction) => getTransactionMemberId(transaction))
        .filter(Boolean)
    ),
  ].filter((memberId) => !memberDisplayNameCache.value[memberId]);

  if (!memberIds.length) return;

  await Promise.all(
    memberIds.map(async (memberId) => {
      try {
        const response = await useApiFetch(`/members/${memberId}`, {
          authType: "member",
          method: "GET",
        });

        memberDisplayNameCache.value = {
          ...memberDisplayNameCache.value,
          [memberId]: response?.data || {},
        };
      } catch (error) {
        console.error(`Failed to load member ${memberId}`, error);
      }
    })
  );
};

const loadApprovedRecipients = async () => {
  try {
    const response = await useApiFetch<{ data?: MemberRecipient[] }>(`/members/index`, {
      authType: "member",
      method: "POST",
      body: {
        paginate: false,
        filters: {
          status: "approved",
        },
      },
    });

    approvedRecipients.value = (response?.data || []).filter(
      (member) => String(member.id) !== String(memberProfile.value.id)
    );
  } catch (error) {
    approvedRecipients.value = [];
    console.error("Failed to load approved recipients:", error);
  }
};

const resetTransferForm = () => {
  transferForm.value = {
    recipientId: "",
    amount: "",
    currency: "",
    reference: "",
  };
};

const validateTransferForm = () => {
  transferError.value = "";

  if (!transferForm.value.recipientId) {
    transferError.value = "Please choose a recipient company.";
    return false;
  }

  if (!transferForm.value.amount || Number(transferForm.value.amount) <= 0) {
    transferError.value = "Please enter a valid transfer amount.";
    return false;
  }

  if (!transferForm.value.currency) {
    transferError.value = "Please choose a currency.";
    return false;
  }

  const selectedCurrency = transferCurrencies.value.find(
    (currency) => currency.currency === transferForm.value.currency
  );

  if (!selectedCurrency) {
    transferError.value = "This currency is not available for transfer.";
    return false;
  }

  if (Number(transferForm.value.amount) > selectedCurrency.balance) {
    transferError.value = "The transfer amount exceeds your available balance.";
    return false;
  }

  return true;
};

const openTransferPreview = () => {
  if (!validateTransferForm()) {
    return;
  }

  showPreviewModal.value = true;
};

const submitTransferRequest = async () => {
  const payload = {
    to_user_id: Number(selectedRecipient.value?.id),
    amount: Number(transferForm.value.amount),
    currency: transferForm.value.currency,
    description:
      transferForm.value.reference ||
      `Transfer to ${selectedRecipientName.value}`,
  };

  return await useApiFetch("/wallet/transfer", {
    authType: "member",
    method: "POST",
    body: payload,
    skipUnauthorizedHandler: true,
  });
};

const confirmTransfer = async () => {
  if (!validateTransferForm()) {
    showPreviewModal.value = false;
    return;
  }

  isSubmittingTransfer.value = true;

  try {
    await submitTransferRequest();
    notify.success("Transfer confirmed successfully.");
    showPreviewModal.value = false;
    resetTransferForm();
    await loadMemberProfile();
  } catch (error: any) {
    showPreviewModal.value = false;

    const backendMessage =
      error?.data?.error ||
      error?.data?.message ||
      error?.response?._data?.message ||
      error?.response?._data?.error ||
      error?.message ||
      "Transfer failed. Please try again.";

    if (/wallet not found/i.test(backendMessage)) {
      transferError.value = "The recipient does not have a wallet for this currency yet. Contact the admin.";
    } else {
      transferError.value = /balance.*0\.01/i.test(backendMessage)
        ? "Rejected"
        : backendMessage;

      notify.error(transferError.value);
    }
  } finally {
    isSubmittingTransfer.value = false;
  }
};

const refreshMemberDashboard = async () => {
  await loadMemberProfile();
  await loadApprovedRecipients();
};

onMounted(async () => {
  await refreshMemberDashboard();
});

definePageMeta({
  layout: "default",
  middleware: "auth-member",
  title: "Member Dashboard",
});
</script>

<style scoped>
.member-dashboard {
  padding-bottom: 1rem;
}

.member-panel,
.member-balance-card {
  border: 0;
  border-radius: 22px;
  box-shadow: 0 18px 45px rgba(16, 35, 63, 0.08);
}

.member-hero {
  background: linear-gradient(135deg, #ffffff, #f4f8ff);
  margin-bottom: 1.5rem;
}

.member-eyebrow,
.transfer-preview-eyebrow {
  display: inline-block;
  margin-bottom: 0.75rem;
  color: #1f6bc1;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.member-title {
  color: #10233f;
}

.member-balance-card {
  background: linear-gradient(160deg, #10233f, #1f6bc1);
  color: #ffffff;
}

.member-balance-label {
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.72);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.82rem;
}

.member-balance-amount {
  margin-bottom: 0.4rem;
  color: #ffffff;
  font-size: 2rem;
}

.member-balance-code {
  display: inline-flex;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  font-size: 0.8rem;
}

.member-transactions {
  display: grid;
  gap: 12px;
}

.member-transaction-item {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 16px;
  background: #f7f9fc;
}

.member-empty-state {
  padding: 2rem;
  border-radius: 16px;
  background: #f7f9fc;
  color: #708198;
  text-align: center;
}

.transfer-preview-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(16, 35, 63, 0.42);
}

.transfer-preview-card {
  width: min(100%, 560px);
  padding: 24px;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 24px 60px rgba(16, 35, 63, 0.18);
}

.transfer-preview-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.preview-label {
  display: block;
  margin-bottom: 6px;
  color: #6d7a8f;
  font-size: 0.82rem;
}

.gap-1 {
  gap: 0.75rem;
}

@media (max-width: 767.98px) {
  .member-balance-amount {
    font-size: 1.6rem;
  }

  .transfer-preview-grid {
    grid-template-columns: 1fr;
  }
}
</style>
