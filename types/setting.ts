// الـ Interface المطابق للـ API
export interface BankSetting {
  id: number;
  accountName: string;
  accountType: 'AccountNumber' | 'IBAN';
  accountNumber: string | null;
  bankName: string | null;
  bankCountry: string;
  beneficiaryBank: string | null;
  beneficiaryBankAddress: string | null;
  swift: string | null;
  routingNumber: string | null;
  beneficiaryName: string | null;
  beneficiaryAddress: string | null;
  beneficiaryAccountNumber: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// الفلاتر
export interface SettingsFilter {
  search?: string;
  currency?: 'usd' | 'eur' | 'gbp' | '';
}

// الـ Response من الـ API
export interface SettingsResponse {
  data: BankSetting[];
  result: string;
  message: string;
  status: number;
}

// Payload الحذف
export interface DeleteSettingsPayload {
  items: number[];
}

// الـ Payload للتحديث (نفس الحقول بس بدون id)
export type UpdateSettingPayload = Omit<BankSetting, 'id' | 'createdAt' | 'updatedAt' | 'active'>;

// الـ Payload للإضافة
export type CreateSettingPayload = Omit<BankSetting, 'id' | 'createdAt' | 'updatedAt' | 'active'>;