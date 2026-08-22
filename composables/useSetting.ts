import type { 
  BankSetting, 
  SettingsFilter, 
  SettingsResponse, 
  DeleteSettingsPayload,
  UpdateSettingPayload,
  CreateSettingPayload 
} from '~/types/setting';

export function useSetting() {
  const notify = useNotify();
  const isLoading = ref(false);

  // جلب كل الإعدادات
  const getSettings = async (filters?: SettingsFilter) => {
    isLoading.value = true;
    try {
      const response = await useApiFetch<SettingsResponse>('/setting/index', {
        method: 'POST',
        body: {
          filters: filters || {},
          orderBy: 'id',
          orderByDirection: 'asc',
          perPage: 20,
          paginate: false,
          deleted: false,
        },
      });
      return response;
    } catch (error) {
      notify.error('Failed to load settings');
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // جلب إعداد معين
  const getSetting = async (id: number) => {
    isLoading.value = true;
    try {
      const response = await useApiFetch<BankSetting>(`/setting/${id}`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      notify.error('Failed to load setting');
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // تحديث إعداد (باستخدام camelCase)
  const updateSetting = async (id: number, data: UpdateSettingPayload) => {
    isLoading.value = true;
    try {
      const response = await useApiFetch<BankSetting>(`/setting/${id}`, {
        method: 'PUT',
        body: data,
      });
      notify.success('Setting updated successfully!');
      return response;
    } catch (error) {
      notify.error('Failed to update setting');
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // حذف إعدادات
  const deleteSettings = async (ids: number[]) => {
    isLoading.value = true;
    try {
      await useApiFetch('/setting/delete', {
        method: 'DELETE',
        body: { items: ids } as DeleteSettingsPayload,
      });
      notify.success('Settings deleted successfully!');
      return true;
    } catch (error) {
      notify.error('Failed to delete settings');
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // إنشاء إعداد جديد
  const createSetting = async (data: CreateSettingPayload) => {
    isLoading.value = true;
    try {
      const response = await useApiFetch<BankSetting>('/setting', {
        method: 'POST',
        body: data,
      });
      notify.success('Setting created successfully!');
      return response;
    } catch (error) {
      notify.error('Failed to create setting');
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    getSettings,
    getSetting,
    updateSetting,
    deleteSettings,
    createSetting,
  };
}