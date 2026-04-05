import { defineStore } from 'pinia';
import type { LocationQueryValue } from 'vue-router';
import { useNotify } from '~/composables/useNotify';

const notify = useNotify();

type AuthAccountType = 'admin' | 'member';

type BalanceItem = {
  currency: string;
  balance: number;
};

type TransactionItem = {
  id: number | string;
  type: string;
  amount: number | string;
  currency: string;
  description?: string;
  createdAt?: string;
};

type AuthUser = {
  id: number;
  name: string;
  email: string;
  displayName?: string;
  status?: string;
  balances?: BalanceItem[];
  lastTransactions?: TransactionItem[];
};

type Credential = {
  email: string;
  password: string;
};

type AuthAction = 'login' | 'details' | 'logout';

const authEndpointCandidates: Record<AuthAccountType, Record<AuthAction, string[]>> = {
  admin: {
    login: ['/admin/login'],
    details: ['/admin/details'],
    logout: ['/admin/logout'],
  },
  member: {
    login: ['/login/members'],
    details: ['/member/details', '/members/details', '/profile'],
    logout: ['/member/logout', '/members/logout'],
  },
};

const getLoginToken = (payload: any): string => {
  return (
    payload?.token ||
    payload?.data?.token ||
    payload?.message?.access_token ||
    ''
  );
};

const getLoginUser = <T>(payload: any): T | null => {
  return (
    payload?.message?.data ||
    payload?.data?.data ||
    payload?.data ||
    null
  ) as T | null;
};

const getPayloadData = <T>(payload: any): T => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload.data as T;
  }

  return payload as T;
};

const getLoginPriority = (email: string): AuthAccountType[] => {
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail === 'adam@wsa-network.com') {
    return ['admin'];
  }

  return ['admin', 'member'];
};

export const useUserStore = defineStore('user', () => {
  const user = ref<AuthUser | null>(null);
  const token = useCookie<string>('PFS_AUTH_TOKEN', { maxAge: 60 * 60 * 2 });
  const accountType = useCookie<AuthAccountType | ''>('PFS_AUTH_TYPE', { maxAge: 60 * 60 * 2 });
  const memberId = useCookie<string>('PFS_MEMBER_ID', { maxAge: 60 * 60 * 2 });

  const hasUser = computed(() => !!user.value);
  const isAdmin = computed(() => accountType.value === 'admin');
  const isMember = computed(() => accountType.value === 'member');
  const displayName = computed(() => user.value?.displayName || user.value?.name || '');

  const setToken = (data?: string) => {
    token.value = data || '';
  };

  const setUser = (data?: AuthUser | null) => {
    user.value = data || null;
    memberId.value = data?.id ? String(data.id) : '';
  };

  const setAccountType = (value?: AuthAccountType | '') => {
    accountType.value = value || '';
  };

  const clearAuth = () => {
    setToken();
    setUser();
    setAccountType();
    memberId.value = '';
  };

  const requestEndpoint = async <T>(
    paths: string[],
    options: Record<string, any> = {}
  ): Promise<T> => {
    let lastError: any = null;

    for (const path of paths) {
      try {
        return await useApiFetch<T>(path, {
          ...options,
          skipUnauthorizedHandler: true,
        });
      } catch (error: any) {
        lastError = error;
      }
    }

    throw lastError;
  };

  const fetchAuthUser = async (preferredType?: AuthAccountType) => {
    if ((preferredType === 'member' || accountType.value === 'member') && memberId.value) {
      try {
        const response = await useApiFetch<any>(`/user/member/${memberId.value}`, {
          method: 'GET',
          skipUnauthorizedHandler: true,
        });

        const authUser = getPayloadData<AuthUser>(response);
        setUser(authUser);
        setAccountType('member');
        return authUser;
      } catch (error: any) {
        if (preferredType === 'member' || accountType.value === 'member') {
          clearAuth();
          throw error;
        }
      }
    }

    const typesToTry: AuthAccountType[] = preferredType
      ? [preferredType]
      : accountType.value
        ? [
            accountType.value as AuthAccountType,
            ...(accountType.value === 'admin' ? ['member'] : ['admin']),
          ]
        : ['admin', 'member'];

    let lastError: any = null;

    for (const type of typesToTry) {
      try {
        const response = await requestEndpoint<any>(authEndpointCandidates[type].details, {
          method: 'GET',
        });

        const authUser = getPayloadData<AuthUser>(response);
        setUser(authUser);
        setAccountType(type);
        return authUser;
      } catch (error: any) {
        lastError = error;
      }
    }

    clearAuth();
    throw lastError;
  };

  const login = async (data: Credential, path?: string | LocationQueryValue) => {
    let lastError: any = null;

    for (const type of getLoginPriority(data.email)) {
      try {
        const response = await requestEndpoint<any>(authEndpointCandidates[type].login, {
          method: 'POST',
          body: data,
        });

        const authToken = getLoginToken(response);
        if (!authToken) {
          throw new Error('Login token was not returned by the server.');
        }

        setToken(authToken);
        setAccountType(type);

        const loginUser = getLoginUser<AuthUser>(response);
        if (loginUser) {
          setUser(loginUser);
        } else {
          await fetchAuthUser(type);
        }

        if (type === 'member' && user.value?.status?.toLowerCase() !== 'approved') {
          clearAuth();
          throw new Error('Your member account is still pending approval.');
        }

        const redirect = Array.isArray(path) ? path[0] : path;

        await nextTick();
        await navigateTo(redirect || '/dashboard');
        notify.success(`Logged in successfully as ${type}.`);
        return;
      } catch (error: any) {
        lastError = error;
        clearAuth();
      }
    }

    const message =
      lastError?.data?.message ||
      lastError?.response?._data?.message ||
      lastError?.message ||
      'Login failed. Please check your credentials.';

    throw new Error(message);
  };

  const logout = async (redirectPath = '/login') => {
    try {
      const currentType = accountType.value as AuthAccountType | '';
      if (currentType) {
        await requestEndpoint(authEndpointCandidates[currentType].logout, {
          method: 'POST',
        });
      }
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      clearAuth();
      if (redirectPath) {
        await navigateTo(redirectPath);
      }
    }
  };

  return {
    user,
    token,
    accountType,
    memberId,
    hasUser,
    isAdmin,
    isMember,
    displayName,
    logout,
    login,
    fetchAuthUser,
    setUser,
    setToken,
    setAccountType,
    clearAuth,
  };
});
