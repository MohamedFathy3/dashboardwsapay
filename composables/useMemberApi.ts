// composables/useMemberApi.ts
import type { LoginCredential } from '~/types/auth';

export const useMemberApi = () => {
  const request = async <T>(path: string, options: Record<string, any> = {}): Promise<T> => {
    return await useApiFetch<T>(path, {
      ...options,
      authType: 'member',
      skipUnauthorizedHandler: true,
    });
  };

  const login = (credentials: LoginCredential) =>
    request<any>('/login/members', { method: 'POST', body: credentials });

  const getProfile = () =>
    request<any>('/check-auth/members', { method: 'GET' });

  const getRecipients = () =>
    request<any>('/members/index', {
      method: 'POST',
      body: {
        paginate: false,
        filters: { status: 'approved' }
      }
    });

  const transfer = (data: {
    to_user_id: number;
    amount: number;
    currency: string;
    description: string;
  }) => request<any>('/wallet/transfer', { method: 'POST', body: data });

  return { login, getProfile, getRecipients, transfer };
};
