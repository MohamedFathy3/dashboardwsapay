// types/auth.ts
export type AuthAccountType = 'admin';

export type AuthAction = 'login' | 'details' | 'logout';

export type BalanceItem = {
  currency: string;
  balance: number;
};

export type TransactionItem = {
  id: number | string;
  type: string;
  amount: number | string;
  currency: string;
  description?: string;
  createdAt?: string;
};

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  displayName?: string;
  status?: string;
  balances?: BalanceItem[];
  lastTransactions?: TransactionItem[];
};

export type LoginCredential = {
  email: string;
  password: string;
};



export type MemberBalance = {
  currency: string;
  balance: number;
};

export type MemberTransaction = {
  id: number;
  amount: string;
  currency: string;
  toUser: { id: number; name: string } | null;
  type: 'transfer' | 'add' | 'withdraw';
  description: string;
  createdAt: string;
};

export type MemberProfile = {
  id: number;
  name: string;
  email: string;
  displayName: string;
  phone: string;
  status: 'pending' | 'approved' | 'suspended';
  balances: MemberBalance[];
  lastTransactions: MemberTransaction[];
};