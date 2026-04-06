import { authEndpoints, type AuthAccountType } from '@/config/authEndpoints';
import type { LoginCredential } from '~/types/auth';

export const useAuthApi = () => {
  const request = async <T>(
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
      } catch (err) {
        lastError = err;
      }
    }
    throw lastError;
  };
  
  const loginRequest = (type: AuthAccountType, body: LoginCredential) =>
    request<any>(authEndpoints[type].login, { method: 'POST', body });

  const detailsRequest = (type: AuthAccountType) =>
    request<any>(authEndpoints[type].details, { method: 'GET' });

  const logoutRequest = (type: AuthAccountType) =>
    request(authEndpoints[type].logout, { method: 'POST' });

  return { loginRequest, detailsRequest, logoutRequest };
};