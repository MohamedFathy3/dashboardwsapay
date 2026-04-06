// stores/memberStore.ts
import { defineStore } from 'pinia';
import type { LoginCredential } from '~/types/auth';

export const useMemberStore = defineStore('member', () => {
  const memberApi = useMemberApi();
  const notify = useNotify();

  const profile = ref<any>(null);
  const token = useCookie<string>('MEMBER_AUTH_TOKEN', { 
    maxAge: 60 * 60 * 2,
    sameSite: 'lax'
  });
  const recipients = ref<any[]>([]);
  const isLoading = ref(false);

  const isApproved = computed(() => 
    profile.value?.status?.toLowerCase() === 'approved'
  );

  const balances = computed(() => profile.value?.balances || []);
  const transactions = computed(() => profile.value?.lastTransactions || []);

  const parseProfileData = (response: any): any => {
    // API response structure: { result, data, message: { data: {...}, access_token } }
    const userData = response?.message?.data || response?.data || response;
    
    return {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      displayName: userData.displayName,
      phone: userData.phone,
      status: userData.status,
      balances: userData.balances?.map((b: any) => ({
        currency: b.currency,
        balance: parseFloat(b.balance)
      })) || [],
      lastTransactions: userData.lastTransactions?.map((t: any) => ({
        id: t.id,
        amount: t.amount,
        currency: t.currency,
        type: t.type,
        description: t.description,
        createdAt: t.createdAt,
        toUser: t.toUser
      })) || []
    };
  };

  const login = async (credentials: LoginCredential, redirectPath = '/dashboard') => {
    isLoading.value = true;
    
    try {
      const response = await memberApi.login(credentials);
      
      // استخراج التوكن من الـ response الصحيح
      const authToken = response?.message?.access_token || 
                       response?.access_token || 
                       response?.token;
      
      if (!authToken) {
        console.error('Response structure:', response);
        throw new Error('No access token received from server');
      }
      
      // حفظ التوكن
      token.value = authToken;
      
      // استخراج بيانات المستخدم من الـ response
      const userData = response?.message?.data || response?.data;
      
      if (userData) {
        profile.value = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          displayName: userData.displayName,
          phone: userData.phone,
          status: userData.status,
          balances: userData.balances?.map((b: any) => ({
            currency: b.currency,
            balance: parseFloat(b.balance)
          })) || [],
          lastTransactions: userData.lastTransactions || []
        };
      } else {
        // لو البيانات مش موجودة في الـ login response، نجيبها من check-auth
        await fetchProfile();
      }
      
      notify.success(`Welcome back, ${profile.value?.displayName || profile.value?.name || 'Member'}!`);
      
      // التوجيه للـ dashboard
      await navigateTo(redirectPath);
      
      return response;
    } catch (error: any) {
      console.error('Login error:', error);
      notify.error(error?.message || 'Login failed. Please check your credentials.');
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchProfile = async () => {
    isLoading.value = true;
    try {
      const response = await memberApi.getProfile();
      profile.value = parseProfileData(response);
      return profile.value;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      // لو فشل جلب البيانات، نسجل خروج
      if (token.value) {
        await logout();
      }
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchRecipients = async () => {
    try {
      const response = await memberApi.getRecipients();
      recipients.value = (response?.data || []).filter(
        (r: any) => String(r.id) !== String(profile.value?.id)
      );
    } catch (error) {
      console.error('Failed to fetch recipients:', error);
      recipients.value = [];
    }
  };

  const sendTransfer = async (data: {
    to_user_id: number;
    amount: number;
    currency: string;
    description: string;
  }) => {
    const response = await memberApi.transfer(data);
    await fetchProfile(); // تحديث الرصيد بعد التحويل
    return response;
  };

  const logout = async (redirectPath = '/member/login') => {
    token.value = '';
    profile.value = null;
    recipients.value = [];
    await navigateTo(redirectPath);
  };

  const refreshDashboard = async () => {
    await Promise.all([fetchProfile(), fetchRecipients()]);
  };

  // التحقق من وجود توكن صالح عند تحميل الـ store
  const checkAuth = async () => {
    if (token.value && !profile.value) {
      try {
        await fetchProfile();
        return true;
      } catch {
        await logout();
        return false;
      }
    }
    return !!token.value;
  };

  return {
    profile,
    token,
    recipients,
    isLoading,
    isApproved,
    balances,
    transactions,
    login,
    logout,
    fetchProfile,
    fetchRecipients,
    sendTransfer,
    refreshDashboard,
    checkAuth
  };
});