<template>
  <transition name="fade">
    <div
      class="modal d-block text-left"
      v-if="showModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="myModalLabel1"
      aria-hidden="true"
      id="animation"
    >
      <div class="modal-dialog modal-dialog-scrollable modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="myModalLabel1">{{ title }}</h4>
            <button type="button" class="close" @click="closeModal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <!-- ⭐ الفورم -->
            <form @submit.prevent="handleSubmit">
              <div class="row">
                <!-- العملة (غير قابلة للتعديل) -->
                <div class="col-md-6 form-group">
                  <label class="form-label">Currency <span class="text-danger">*</span></label>
                  <div class="form-control bg-light" style="cursor: not-allowed;">
                    {{ getCurrencyFromId(settingData?.id || 1) }}
                  </div>
                  <small class="text-muted">Currency cannot be changed</small>
                </div>

                <!-- نوع الحساب -->
                <div class="col-md-6 form-group">
                  <label class="form-label">Account Type <span class="text-danger">*</span></label>
                  <select v-model="form.accountType" class="form-control" required>
                    <option value="AccountNumber">Account Number</option>
                    <option value="IBAN">IBAN</option>
                  </select>
                </div>

                <!-- اسم الحساب -->
                <div class="col-md-6 form-group">
                  <label class="form-label">Account Name <span class="text-danger">*</span></label>
                  <input v-model="form.accountName" type="text" class="form-control" placeholder="Enter account name" required />
                </div>

                <!-- رقم الحساب أو IBAN -->
                <div class="col-md-6 form-group">
                  <label class="form-label">{{ form.accountType === 'IBAN' ? 'IBAN' : 'Account Number' }} <span class="text-danger">*</span></label>
                  <input v-model="form.accountNumber" type="text" class="form-control" :placeholder="form.accountType === 'IBAN' ? 'Enter IBAN' : 'Enter account number'" required />
                </div>

                <!-- اسم البنك -->
                <div class="col-md-6 form-group">
                  <label class="form-label">Bank Name <span class="text-danger">*</span></label>
                  <input v-model="form.bankName" type="text" class="form-control" placeholder="Enter bank name" required />
                </div>

                <!-- دولة البنك -->
                <div class="col-md-6 form-group">
                  <label class="form-label">Bank Country <span class="text-danger">*</span></label>
                  <input v-model="form.bankCountry" type="text" class="form-control" placeholder="Enter bank country" required />
                </div>

                <!-- البنك المستفيد -->
                <div class="col-md-6 form-group">
                  <label class="form-label">Beneficiary Bank <span class="text-danger">*</span></label>
                  <input v-model="form.beneficiaryBank" type="text" class="form-control" placeholder="Enter beneficiary bank" required />
                </div>

                <!-- عنوان البنك المستفيد -->
                <div class="col-md-12 form-group">
                  <label class="form-label">Beneficiary Bank Address <span class="text-danger">*</span></label>
                  <input v-model="form.beneficiaryBankAddress" type="text" class="form-control" placeholder="Enter beneficiary bank address" required />
                </div>

                <!-- SWIFT -->
                <div class="col-md-6 form-group">
                  <label class="form-label">SWIFT Code <span class="text-danger">*</span></label>
                  <input v-model="form.swift" type="text" class="form-control uppercase" placeholder="Enter SWIFT code" required />
                </div>

                <!-- Routing Number (فقط للـ USD) -->
                <div v-if="getCurrencyFromId(settingData?.id || 1) === 'USD'" class="col-md-6 form-group">
                  <label class="form-label">Routing Number</label>
                  <input v-model="form.routingNumber" type="text" class="form-control" placeholder="Enter routing number" />
                </div>

                <!-- اسم المستفيد -->
                <div class="col-md-6 form-group">
                  <label class="form-label">Beneficiary Name <span class="text-danger">*</span></label>
                  <input v-model="form.beneficiaryName" type="text" class="form-control" placeholder="Enter beneficiary name" required />
                </div>

                <!-- عنوان المستفيد -->
                <div class="col-md-6 form-group">
                  <label class="form-label">Beneficiary Address <span class="text-danger">*</span></label>
                  <input v-model="form.beneficiaryAddress" type="text" class="form-control" placeholder="Enter beneficiary address" required />
                </div>

                <!-- رقم حساب المستفيد -->
                <div class="col-md-6 form-group">
                  <label class="form-label">Beneficiary Account Number <span class="text-danger">*</span></label>
                  <input v-model="form.beneficiaryAccountNumber" type="text" class="form-control" placeholder="Enter beneficiary account number" required />
                </div>
              </div>

              <!-- ⭐ الأزرار -->
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeModal">
                  Cancel
                </button>
                <button type="submit" class="btn btn-primary" :disabled="isLoading">
                  <span v-if="isLoading" class="spinner-border spinner-border-sm mr-1" role="status"></span>
                  {{ isLoading ? 'Updating...' : '💾 Update Account' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useSetting } from '~/composables/useSetting';

const props = defineProps({
  showModal: { type: Boolean, default: false },
  title: { type: String, default: 'Update Bank Account' },
  settingData: { type: Object, default: null },
  refresh: { type: Function, default: () => {} },
});

const emit = defineEmits(['update:showModal', 'updated']);

const { updateSetting } = useSetting();
const isLoading = ref(false);

// ⭐ نموذج البيانات
const form = ref({
  accountName: '',
  accountType: 'AccountNumber',
  accountNumber: '',
  bankName: '',
  bankCountry: '',
  beneficiaryBank: '',
  beneficiaryBankAddress: '',
  swift: '',
  routingNumber: '',
  beneficiaryName: '',
  beneficiaryAddress: '',
  beneficiaryAccountNumber: '',
});

// ⭐ استنتاج العملة من الـ ID
const getCurrencyFromId = (id) => {
  const currencies = { 1: 'USD', 2: 'EUR', 3: 'GBP' };
  return currencies[id] || 'USD';
};

// ⭐ لما تتغير البيانات، حطها في الفورم
watch(
  () => props.settingData,
  (newVal) => {
    console.log('📦 Setting data received in modal:', newVal);
    if (newVal) {
      form.value = {
        accountName: newVal.accountName || '',
        accountType: newVal.accountType || 'AccountNumber',
        accountNumber: newVal.accountNumber || '',
        bankName: newVal.bankName || '',
        bankCountry: newVal.bankCountry || '',
        beneficiaryBank: newVal.beneficiaryBank || '',
        beneficiaryBankAddress: newVal.beneficiaryBankAddress || '',
        swift: newVal.swift || '',
        routingNumber: newVal.routingNumber || '',
        beneficiaryName: newVal.beneficiaryName || '',
        beneficiaryAddress: newVal.beneficiaryAddress || '',
        beneficiaryAccountNumber: newVal.beneficiaryAccountNumber || '',
      };
      console.log('✅ Form populated:', form.value);
    }
  },
  { immediate: true, deep: true }
);

// ⭐ تقديم الفورم
const handleSubmit = async () => {
  if (!props.settingData) {
    console.error('❌ No setting data to update');
    return;
  }

  try {
    isLoading.value = true;
    console.log('🔄 Updating setting:', props.settingData.id, form.value);
    await updateSetting(props.settingData.id, form.value);
    if (props.refresh) props.refresh();
    emit('updated');
    closeModal();
  } catch (error) {
    console.error('❌ Update failed:', error);
  } finally {
    isLoading.value = false;
  }
};

// ⭐ إغلاق المودل
const closeModal = () => {
  emit('update:showModal', false);
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal {
  background: rgba(0, 0, 0, 0.5);
}

.modal-lg {
  max-width: 900px;
}

.uppercase {
  text-transform: uppercase;
}

.text-danger {
  color: #dc3545;
}

.bg-light {
  background-color: #f8f9fa !important;
}
</style>