// config/authEndpoints.ts
export type AuthAccountType = 'admin';

export type AuthAction = 'login' | 'details' | 'logout';

export const authEndpoints: Record<AuthAccountType, Record<AuthAction, string[]>> = {
  admin: {
    login: ['/admin/login'],
    details: ['/admin/details'],
    logout: ['/admin/logout'],
  },
};