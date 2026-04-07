<template>
  <!-- Add refresh controls row -->
  <div class="row mb-3">
    <div class="col-md-10">
      <ThemeBreadcrumb
        title="Member"
        :items="[{ label: 'member details', to: '/countries' }]"
        :add="false"
        :filters="false"
        :exportBtn="false"
      />
    </div>
    <div class="col-md-2 d-flex align-items-center justify-content-end gap-2">
      <!-- Status filter -->
      <select
        v-model="status"
        @change="onStatusChange($event.target.value)"
        class="bg-select"
      >
        <option
          v-for="option in statusOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </div>
  </div>
  <div v-if="member === null" class="bg-white">
    <ThemeSkelton/>
  </div>
  <div v-if="member && member.data">
    <!-- Main Modal for Balance Management -->
    <Modal
      :showModal="showModal"
      @update:showModal="showModal = $event"
      :formFields="formFields"
      :title="modalTitle"
      :apiTitle="apiTitle"
      :apiName="apINewOrOldBalance"
      @success="handleModalSuccess"
      @error="handleModalError"
      @refresh="handleModalRefresh"
    />
    <!-- Sub Account Modal -->
    <Modal
      :showModal="showSubAccountModal"
      @update:showModal="showSubAccountModal = $event"
      :formFields="subAccountFormFields"
      title="Add New Sub Account"
      apiTitle="add"
      :apiName="`members/${memberId}/sub-accounts`"
      @success="handleSubAccountSuccess"
      @error="handleSubAccountError"
      @refresh="handleSubAccountRefresh"
    />
    <section class="user-details">
      <div class="row">
        <!-- Account Info -->
        <div class="col-md-6">
          <h5 class="card-title">
            <i class="feather icon-user mr-50"></i>
            Account Info
          </h5>
          <div class="card shadow-sm mb-0">
            <div class="card-body card-padding">
              <div class="media">
                <a href="javascript: void(0);">
                  <img
                    :src="member.data?.logo ?? '/app-assets/images/logo/no-image-icon.png'"
                    class="rounded mr-75"
                    alt="profile image"
                    height="64"
                    width="64"
                  />
                </a>
                <div class="media-body d-grid">
                  <label
                    class="ml-50 mb-sm-0 cursor-pointer text-bold-600 waves-effect waves-light"
                    for="account-upload"
                    >{{ member.data?.name }}</label
                  >
                  <label
                    class="ml-50 mb-sm-0 cursor-pointer text-bold-600 waves-effect waves-light"
                    for="account-upload"
                  >
                    <img
                      :src="member.data?.country?.flag ?? ''"
                      width="20"
                      class="align-middle radius-2"
                      alt="Country flag"
                    />
                    {{ member.data?.country?.name ?? "no data" }}
                  </label>
                  <label
                    class="table-text ml-50 text-bold-600 cursor-pointer email"
                    @click="copyToClipboard(member.data?.email)"
                  >
                    <small>
                      <i class="feather icon-mail"></i>
                      {{ member.data?.email }}</small
                    >
                  </label>
                </div>
              </div>

              <table class="table table-borderless mb-0">
                <tbody>
                  <tr>
                    <th class="text-muted">Display Name</th>
                    <td class="table-text">
                      {{ member.data?.displayName ?? "--" }}
                    </td>
                  </tr>
                  <tr>
                    <th class="text-muted">Phone</th>
                    <td class="table-text">{{ member.data?.phone ?? "--" }}</td>
                  </tr>
                  <tr>
                    <th class="text-muted">Address</th>
                    <td class="table-text">
                      {{ member.data?.address ?? "--" }}
                    </td>
                  </tr>
                  <tr>
                    <th class="text-muted">State</th>
                    <td class="table-text">{{ member.data?.state ?? "--" }}</td>
                  </tr>
                  <tr>
                    <th class="text-muted">Postal Code</th>
                    <td class="table-text">
                      {{ member.data?.postalCode ?? "--" }}
                    </td>
                  </tr>
                  <tr>
                    <th class="text-muted">Created At</th>
                    <td class="table-text">
                      {{ member.data?.createdAt ?? "--" }}
                    </td>
                  </tr>
                  <tr>
                    <th class="text-muted">Status</th>
                    <td>
                      <div
                        :class="[
                          'text-bold-600',
                          'chip',
                          {
                            'chip-semi-dark': member.data?.status === 'pending',
                            'chip-success': member.data?.status === 'approved',
                            'chip-warning': member.data?.status === 'suspended',
                            'chip-danger': member.data?.status === 'deactivate',
                          },
                        ]"
                      >
                        <div class="chip-body">
                          <div class="chip-text capitalize">
                            {{ member.data?.status }}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Balances -->
        <div class="col-md-6 col-12">
          <h5
            class="card-title d-flex align-items-center justify-content-between"
          >
            <div>
              <i class="feather icon-save mr-50"></i>
              Balances
            </div>
            <div>
              <!-- Manage button: Show when at least 1 currency exists -->
              <div
                class="btn btn-primary avatar m-0 btn-icon p-0 justify-start"
                @click="openManageModal()"
                v-if="hasAnyCurrency"
              >
                <div class="avatar-content">
                  <i class="feather icon-repeat font-medium-3"></i>
                </div>
              </div>
              <!-- Add button: Show when less than 3 currencies exist -->
              <div
                class="btn btn-primary avatar ml-2 btn-icon p-0 justify-end"
                @click="openAddModal()"
                v-if="canAddMoreCurrencies"
              >
                <div class="avatar-content">
                  <i class="feather icon-plus font-medium-3"></i>
                </div>
              </div>
            </div>
          </h5>

          <!-- Display all 3 currencies - show actual balance if exists, otherwise show 0 -->
          <div class="card mb-0">
            <div
              class="card-header balance-header d-flex justify-content-between align-items-center"
              v-for="currency in currencies"
              :key="currency.value"
            >
              <div class="d-flex align-items-center">
                <h4 class="mb-0" :class="getBalanceTextClass(currency.value)">
                  {{ getBalanceForCurrency(currency.value) }} {{ currency.value }}
                </h4>
                <!-- Zero balance label -->
                <span 
                  v-if="currencyExists(currency.value) && getBalanceForCurrency(currency.value) <= 0"
                  class="zero-balance-label ml-2"
                >
                  (zero balance)
                </span>
              </div>
              <!-- Empty space for alignment -->
              <div style="width: 40px;"></div>
            </div>
          </div>

          <div class="">
            <h5
              class="card-title d-flex justify-content-between align-items-center"
            >
              <div>
                <i class="feather icon-lock mr-50"></i>
                Latest Transactions
              </div>
              <div class="chip bg-chip cursor-pointer" @click="allTransactions">
                <div class="chip-body">
                  <span class="chip-text">
                    <i class="feather icon-eye"></i>
                    view details</span
                  >
                </div>
              </div>
            </h5>
            <div
              v-if="member.data?.lastTransactions && member.data?.lastTransactions.length"
            >
              <div
                v-for="sub in member.data?.lastTransactions"
                :key="sub.id"
                class="card shadow-sm border card-balance"
              >
                <div class="card-body card-padding">
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <strong class="text-capitalize text-dark">
                      {{ sub.type === "add" ? "Deposit" : "Withdrawal" }}
                    </strong>
                    <span
                      :class="sub.type === 'add' ? 'text-success' : 'text-danger'"
                      class="fw-bold"
                    >
                      {{ sub.type === "add" ? "+" : "-" }}{{ sub.amount }}
                      {{ sub.currency }}
                    </span>
                  </div>
                  <p class="text-muted fst-italic mb-0">
                    {{ sub.description }}
                  </p>
                  <div class="text-end text-secondary">
                    {{ sub.createdAt }}
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <div class="card shadow-sm mb-0 border card-balance">
                <div class="card-body card-padding">
                  <div
                    class="d-flex justify-content-center p-2 align-items-center"
                  >
                    <strong class="text-capitalize text-muted text-center">
                      There are no transactions to display at the moment.
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sub Accounts -->
        <div class="col-12">
          <h5 class="card-title d-flex justify-content-between align-items-center">
            <div>
              <i class="feather icon-lock mr-50"></i>
              Sub Accounts
            </div>
            <button 
              class="btn btn-primary btn-sm"
              @click="openSubAccountModal"
            >
              <i class="feather icon-plus"></i> Add New Account
            </button>
          </h5>

          <div class="card">
            <div class="card-body card-padding">
              <div v-if="!member.data?.subAccounts?.length" class="text-center text-muted py-4">
                No sub accounts found. Click "Add New Account" to create one.
              </div>
              <div v-else class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Display Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="sub in member.data?.subAccounts" :key="sub.id">
                      <td>{{ sub.name }}</td>
                      <td>{{ sub.displayName }}</td>
                      <td>{{ sub.email }}</td>
                      <td>{{ sub.phone }}</td>
                      <td>{{ sub.createdAt }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
const route = useRoute();
const memberId = route.params.id;

import { useRouter } from "vue-router";
const router = useRouter();
const { updateStatus } = useApiStatusUpdate();
import Modal from "@/components/theme/Modal.vue";
const status = ref(null);
const notify = useNotify();

// ========== AUTO-REFRESH SETUP ==========
const autoRefreshEnabled = ref(true);
const refreshInterval = ref(null);
const lastRefreshTime = ref(null);
const isRefreshing = ref(false);
const AUTO_REFRESH_INTERVAL = 15000;

// Keep your original useApiItem hook
const {
  data: member,
  pending,
  error,
  refresh: refreshMemberData,
} = useApiItem({
  api: "members",
  id: memberId,
});

// ========== AUTO-REFRESH FUNCTIONS ==========
const startAutoRefresh = () => {
  stopAutoRefresh();
  
  refreshInterval.value = setInterval(async () => {
    if (autoRefreshEnabled.value && document.visibilityState === 'visible') {
      await refreshAllData();
    }
  }, AUTO_REFRESH_INTERVAL);
};

const stopAutoRefresh = () => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value);
    refreshInterval.value = null;
  }
};

const toggleAutoRefresh = () => {
  autoRefreshEnabled.value = !autoRefreshEnabled.value;
  if (autoRefreshEnabled.value) {
    startAutoRefresh();
    notify.success('Auto-refresh enabled');
  } else {
    stopAutoRefresh();
    notify.info('Auto-refresh disabled');
  }
};

const refreshAllData = async () => {
  if (isRefreshing.value) return;
  
  isRefreshing.value = true;
  lastRefreshTime.value = new Date();
  
  try {
    if (refreshMemberData) {
      await refreshMemberData();
    }
  } catch (error) {
    console.error('Auto-refresh failed:', error);
  } finally {
    isRefreshing.value = false;
  }
};

const manualRefresh = async () => {
  await refreshAllData();
  notify.success('Data refreshed!');
};

// ========== LIFE CYCLE HOOKS ==========
onMounted(() => {
  if (autoRefreshEnabled.value) {
    startAutoRefresh();
  }
  
  if (process.client) {
    document.addEventListener('visibilitychange', handleVisibilityChange);
  }
});

onBeforeUnmount(() => {
  stopAutoRefresh();
  if (process.client) {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  }
});

const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible' && autoRefreshEnabled.value) {
    refreshAllData();
    startAutoRefresh();
  } else if (document.visibilityState === 'hidden') {
    stopAutoRefresh();
  }
};
// ===========================================

// Refs & Reactive States
const showModal = ref(false);
const showSubAccountModal = ref(false);

// Initialize status after member data loads
watch(member, (newMember) => {
  if (newMember?.data) {
    status.value = newMember.data.status ?? "pending";
  }
}, { immediate: true });

const modalTitle = ref("");
const apiTitle = ref("add");
const formFields = ref([]);
const subAccountFormFields = ref([]);
const apINewOrOldBalance = ref("");
const currencies = [
  { label: "USD", value: "USD", name: "USD" },
  { label: "EUR", value: "EUR", name: "EUR" },
  { label: "GBP", value: "GBP", name: "GBP" },
];

const transactionTypes = [
  { label: "Withdraw", value: "withdraw" },
  { label: "Deposit", value: "add" },
];

// Track ALL existing currencies in backend (including zero balances)
const allExistingCurrencies = ref([]);

// Update allExistingCurrencies when member data loads
watch(member, (newMember) => {
  if (newMember?.data?.balances) {
    allExistingCurrencies.value = newMember.data.balances.map(b => b.currency);
    console.log('Backend currencies (ALL):', allExistingCurrencies.value);
  } else {
    allExistingCurrencies.value = [];
  }
}, { immediate: true, deep: true });

// Helper functions
const currencyExists = (currencyCode) => {
  return allExistingCurrencies.value.includes(currencyCode);
};

const getBalanceForCurrency = (currencyCode) => {
  if (!member.value?.data?.balances) return 0;
  
  const currencyBalance = member.value.data.balances.find(
    b => b.currency === currencyCode
  );
  
  return currencyBalance ? currencyBalance.balance : 0;
};

// Helper to get text color based on balance
const getBalanceTextClass = (currencyCode) => {
  const balance = getBalanceForCurrency(currencyCode);
  if (balance > 0) {
    return 'text-success';
  } else if (balance === 0 && currencyExists(currencyCode)) {
    return 'text-muted';
  }
  return 'text-secondary';
};

// Computed properties for button visibility
const hasAnyCurrency = computed(() => {
  return allExistingCurrencies.value.length > 0;
});

const canAddMoreCurrencies = computed(() => {
  // Can add if less than 3 currencies exist
  return allExistingCurrencies.value.length < 3;
});

// ========== Sub Account Functions ==========
const openSubAccountModal = () => {
  // Set up form fields for sub account
  subAccountFormFields.value = [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Enter Name",
      required: true,
      class: "form-control",
      value: ""
    },
    {
      name: "display_name",
      label: "Display Name",
      type: "text",
      placeholder: "Enter Display Name",
      required: true,
      class: "form-control",
      value: ""
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter Email",
      required: true,
      class: "form-control",
      value: ""
    },
    {
      name: "phone",
      label: "Phone",
      type: "text",
      placeholder: "Enter Phone Number",
      required: true,
      class: "form-control",
      value: ""
    }
  ];

  showSubAccountModal.value = true;
};

const handleSubAccountSuccess = (response) => {
  console.log('Sub account created:', response);
  notify.success('Sub account created successfully!');
  showSubAccountModal.value = false;
  
  // Refresh member data to show new sub account
  setTimeout(() => {
    refreshAllData();
  }, 1000);
};

const handleSubAccountError = (error) => {
  console.error('Sub account error:', error);
  
  let errorMessage = 'Failed to create sub account';
  
  if (error.message) {
    errorMessage = error.message;
  } else if (error.data?.message) {
    errorMessage = error.data.message;
  } else if (error.data?.errors) {
    const errors = error.data.errors;
    errorMessage = Object.values(errors).flat().join(', ');
  }
  
  notify.error(errorMessage);
  showSubAccountModal.value = false;
};

const handleSubAccountRefresh = () => {
  console.log('Sub account refresh event');
  setTimeout(() => refreshAllData(), 1000);
};

// ========== Modal Functions ==========

// Add new currency (only when less than 3 exist)
const openAddModal = () => {
  if (!canAddMoreCurrencies.value) {
    notify.error('Maximum 3 currencies allowed. Use "Manage Balance" for transactions.');
    return;
  }
  
  modalTitle.value = "Add New Currency";
  apiTitle.value = "add";
  // Use CREATE wallet endpoint
  apINewOrOldBalance.value = `members/${memberId}/wallet`;
  
  // Show only currencies that don't exist yet
  const availableCurrencies = currencies.filter(currency => 
    !allExistingCurrencies.value.includes(currency.value)
  );
  
  if (availableCurrencies.length === 0) {
    notify.error('All currencies already exist. Use "Manage Balance" for transactions.');
    return;
  }
  
  formFields.value = [
    {
      name: "currency",
      label: "Currency",
      type: "select",
      placeholder: "Choose Currency",
      required: true,
      class: "form-control",
      options: availableCurrencies,
      value: availableCurrencies.length === 1 ? availableCurrencies[0].value : ""
    },
    {
      name: "balance",
      label: "Initial Balance",
      type: "number",
      placeholder: "Enter Initial Balance",
      required: true,
      class: "form-control",
      min: 0.01,
      step: "0.01",
      value: ""
    }
  ];

  showModal.value = true;
};

// Manage existing currencies (deposit/withdraw)
const openManageModal = () => {
  if (!hasAnyCurrency.value) {
    notify.error('No currencies to manage. Please add a currency first.');
    return;
  }
  
  modalTitle.value = "Manage Balance";
  apiTitle.value = "manage";
  // Use transaction endpoint
  apINewOrOldBalance.value = `members/${memberId}/wallet/transaction`;
  
  // Show only currencies that exist in backend
  const existingCurrencyOptions = allExistingCurrencies.value.map(currency => ({
    label: currency,
    value: currency,
    name: currency
  }));
  
  formFields.value = [
    {
      name: "currency",
      label: "Currency",
      type: "select",
      placeholder: "Choose Currency",
      required: true,
      class: "form-control",
      options: existingCurrencyOptions,
      value: existingCurrencyOptions.length === 1 ? existingCurrencyOptions[0].value : ""
    },
    {
      name: "balance",
      label: "Amount",
      type: "number",
      placeholder: "Enter Amount",
      required: true,
      class: "form-control",
      min: 0.01,
      step: "0.01",
      value: ""
    },
    {
      name: "type",
      label: "Transaction Type",
      type: "select",
      placeholder: "Choose Type",
      required: true,
      class: "form-control",
      options: transactionTypes,
      value: "add"
    },
    {
      name: "description",
      label: "Description (Optional)",
      type: "textarea",
      placeholder: "Enter Description",
      required: false,
      class: "form-control",
      value: ""
    }
  ];

  showModal.value = true;
};

// Modal event handlers
const handleModalSuccess = (response) => {
  console.log('Modal success event:', response);
  
  let successMessage = 'Operation completed successfully!';
  
  if (apiTitle.value === 'add') {
    successMessage = 'Currency added successfully!';
    
    // Add new currency to tracking list
    const newCurrency = formFields.value.find(f => f.name === 'currency')?.value;
    if (newCurrency && !allExistingCurrencies.value.includes(newCurrency)) {
      allExistingCurrencies.value.push(newCurrency);
    }
  } else {
    const transactionType = formFields.value.find(f => f.name === 'type')?.value;
    if (transactionType === 'add') {
      successMessage = 'Deposit completed successfully!';
    } else {
      successMessage = 'Withdrawal completed successfully!';
      
      // If withdrawal resulted in wallet deletion
      if (response?.data?.walletDeleted) {
        const currency = formFields.value.find(f => f.name === 'currency')?.value;
        if (currency) {
          allExistingCurrencies.value = allExistingCurrencies.value.filter(c => c !== currency);
          successMessage = 'Withdrawal completed. Wallet deleted as balance reached 0.';
        }
      }
    }
  }
  
  notify.success(successMessage);
  showModal.value = false;
  
  // Refresh data
  setTimeout(() => {
    refreshAllData();
  }, 1000);
};

const handleModalError = (error) => {
  console.error('Modal error event:', error);
  
  let errorMessage = 'Operation failed';
  
  if (error.message) {
    errorMessage = error.message;
  } else if (error.data?.message) {
    errorMessage = error.data.message;
  } else if (error.data?.errors) {
    // Handle validation errors
    const errors = error.data.errors;
    errorMessage = Object.values(errors).flat().join(', ');
  }
  
  // Handle specific error cases
  if (errorMessage.includes('already exists') || errorMessage.includes('Wallet with this currency already exists')) {
    errorMessage = 'This currency already exists. Please use "Manage Balance" for deposits.';
    // Refresh currency list
    refreshAllData();
  } else if (errorMessage.includes('Insufficient') || errorMessage.includes('balance')) {
    errorMessage = 'Insufficient balance for this transaction.';
  } else if (error.status === 400) {
    errorMessage = errorMessage || 'Invalid request. Please check your input.';
  }
  
  notify.error(errorMessage);
  showModal.value = false;
};

const handleModalRefresh = () => {
  console.log('Modal refresh event received');
  setTimeout(() => refreshAllData(), 1000);
};

watch(showModal, (newVal) => {
  if (!newVal) {
    // Modal was closed, refresh data
    setTimeout(() => refreshAllData(), 500);
  }
});

watch(showSubAccountModal, (newVal) => {
  if (!newVal) {
    // Sub account modal was closed
    setTimeout(() => refreshAllData(), 500);
  }
});

const copyToClipboard = (email) => {
  navigator.clipboard
    .writeText(email)
    .then(() => {
      notify.success("Copied to clipboard!");
    })
    .catch(() => {
      notify.error("Failed to copy");
    });
};

const allTransactions = () => {
  router.push(`transactions/${memberId}`);
};

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Suspended", value: "suspended" },
  { label: "Deactivate", value: "deactivate" },
];

// Change handler (with API call)
const onStatusChange = async (newStatus) => {
  try {
    await updateStatus({
      api: "members",
      type: "status",
      id: memberId,
      method: "POST",
      status: newStatus,
    });

    notify.success("Status Changed Successfully");
    
    if (member.value?.data) {
      member.value.data.status = newStatus;
    }
    
    setTimeout(() => refreshAllData(), 1000);
  } catch (error) {
    notify.error("Failed to change status");
    status.value = member.value?.data?.status;
  }
};
</script>

<style>
.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.bg-select {
  background-color: #e6e6e6;
  transition: 0.3s ease-in-out;
  font-weight: 500;
  box-shadow: 1px 1px 2px 1px #cacaca;
  display: inline-flex;
  margin-bottom: 5px;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  vertical-align: middle;
  -webkit-align-self: center;
  -ms-flex-item-align: center;
  align-self: center;
  border: none;
  border-radius: 15px;
  font-size: 13px;
  padding: 5px 10px;
  cursor: pointer;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  border-radius: 0.2rem;
}

.balance-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.balance-header:last-child {
  border-bottom: none;
}

/* Style for zero balance label */
.zero-balance-label {
  font-size: 0.8rem;
  color: #888;
  font-style: italic;
  background-color: #f8f9fa;
  padding: 2px 8px;
  border-radius: 10px;
  border: 1px dashed #dee2e6;
}

/* Color coding for balances */
.text-success {
  color: #28a745 !important;
  font-weight: 600;
}

.text-muted {
  color: #6c757d !important;
  opacity: 0.7;
}

.text-secondary {
  color: #6c757d !important;
}
</style>
