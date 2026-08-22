<template>
  <UCard>
    <UForm :state="form" @submit="handleSubmit">
      <!-- العملة -->
      <UFormGroup label="Currency" name="currency">
        <USelect
          v-model="form.currency"
          :options="currencyOptions"
          required
        />
      </UFormGroup>

      <!-- بنك -->
      <UFormGroup label="Bank Name" name="bank_name">
        <UInput v-model="form.bank_name" required />
      </UFormGroup>

      <UFormGroup label="Bank Country" name="bank_country">
        <UInput v-model="form.bank_country" required />
      </UFormGroup>

      <!-- الحساب -->
      <UFormGroup label="Account Name" name="account_name">
        <UInput v-model="form.account_name" required />
      </UFormGroup>

      <UFormGroup label="Account Type" name="account_type">
        <USelect
          v-model="form.account_type"
          :options="['AccountNumber', 'IBAN']"
          required
        />
      </UFormGroup>

      <UFormGroup v-if="form.account_type === 'AccountNumber'" label="Account Number" name="account_number">
        <UInput v-model="form.account_number" required />
      </UFormGroup>

      <UFormGroup v-else label="IBAN" name="iban">
        <UInput v-model="form.iban" required />
      </UFormGroup>

      <!-- البنك المستفيد -->
      <UDivider label="Beneficiary Bank" />

      <UFormGroup label="Beneficiary Bank" name="beneficiary_bank">
        <UInput v-model="form.beneficiary_bank" required />
      </UFormGroup>

      <UFormGroup label="Beneficiary Bank Address" name="beneficiary_bank_address">
        <UTextarea v-model="form.beneficiary_bank_address" required />
      </UFormGroup>

      <UFormGroup label="SWIFT Code" name="swift">
        <UInput v-model="form.swift" required />
      </UFormGroup>

      <UFormGroup v-if="form.currency === 'usd'" label="Routing Number" name="routing_number">
        <UInput v-model="form.routing_number" />
      </UFormGroup>

      <UFormGroup v-if="form.currency === 'gbp'" label="Sort Code" name="sort_code">
        <UInput v-model="form.sort_code" />
      </UFormGroup>

      <!-- المستفيد -->
      <UDivider label="Beneficiary" />

      <UFormGroup label="Beneficiary Name" name="beneficiary_name">
        <UInput v-model="form.beneficiary_name" required />
      </UFormGroup>

      <UFormGroup label="Beneficiary Address" name="beneficiary_address">
        <UTextarea v-model="form.beneficiary_address" required />
      </UFormGroup>

      <UFormGroup label="Beneficiary Account Number" name="beneficiary_account_number">
        <UInput v-model="form.beneficiary_account_number" required />
      </UFormGroup>

      <!-- أزرار -->
      <div class="flex gap-3 mt-6">
        <UButton type="submit" color="primary" :loading="loading">
          Save
        </UButton>
        <UButton color="gray" variant="ghost" @click="emit('cancel')">
          Cancel
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import type { BankSetting } from '~/types/setting';

const props = defineProps<{
  setting?: BankSetting | null;
  loading?: boolean;
}>();

const emit = defineEmits<{
  submit: [data: Partial<BankSetting>];
  cancel: [];
}>();

const currencyOptions = [
  { label: 'USD', value: 'usd' },
  { label: 'EUR', value: 'eur' },
  { label: 'GBP', value: 'gbp' },
];

const form = reactive<Partial<BankSetting>>({
  currency: 'usd',
  account_type: 'AccountNumber',
  ...props.setting,
});

watch(() => props.setting, (newVal) => {
  if (newVal) {
    Object.assign(form, newVal);
  }
});

const handleSubmit = () => {
  emit('submit', form);
};
</script>