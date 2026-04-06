import type { LocationQueryValue } from "vue-router";
import type { AuthAccountType } from "~/config/authEndpoints";
import type { AuthUser, LoginCredential } from "~/types/auth";

export const useUserStore = defineStore('user', () => {
  const { loginRequest, detailsRequest, logoutRequest } = useAuthApi();
  const { extractToken, extractUser, extractData } = useAuthParser();
  const notify = useNotify();

  const user = ref<AuthUser | null>(null);
  const token = useCookie<string>('PFS_AUTH_TOKEN', { maxAge: 60 * 60 * 2 });
  const accountType = useCookie<AuthAccountType>('PFS_AUTH_TYPE', { 
    maxAge: 60 * 60 * 2,
    default: () => 'admin' 
  });

  const hasUser = computed(() => !!user.value);
  const isAdmin = computed(() => true); // دايماً admin
  const displayName = computed(() => user.value?.displayName || user.value?.name || '');

  const clearAuth = () => {
    token.value = '';
    user.value = null;
    accountType.value = 'admin';
  };

  const fetchAuthUser = async () => {
    try {
      const res = await detailsRequest('admin');
      const authUser = extractData<AuthUser>(res);
      user.value = authUser;
      accountType.value = 'admin';
      return authUser;
    } catch (err) {
      clearAuth();
      throw err;
    }
  };

  const login = async (credentials: LoginCredential, path?: string | LocationQueryValue) => {
    try {
      const res = await loginRequest('admin', credentials);
      const authToken = extractToken(res);

      if (!authToken) throw new Error('No token returned.');

      token.value = authToken;
      accountType.value = 'admin';

      const loginUser = extractUser<AuthUser>(res);
      if (loginUser) {
        user.value = loginUser;
      } else {
        await fetchAuthUser();
      }

      const redirect = Array.isArray(path) ? path[0] : path;
      await nextTick();
      await navigateTo(redirect || '/dashboard');
      notify.success('Logged in successfully.');
    } catch (err: any) {
      clearAuth();
      throw new Error(err?.data?.message || err?.message || 'Login failed.');
    }
  };

  const logout = async (redirectPath = '/login') => {
    try {
      await logoutRequest('admin');
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      clearAuth();
      if (redirectPath) await navigateTo(redirectPath);
    }
  };

  return {
    user, token, accountType,
    hasUser, isAdmin, displayName,
    login, logout, fetchAuthUser, clearAuth,
  };
});