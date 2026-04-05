// plugins/init-auth.client.ts
export default defineNuxtPlugin(async () => {
    const { $pinia } = useNuxtApp();
    const userStore = useUserStore($pinia);
  
    if (userStore.token && !userStore.user) {
      await userStore.fetchAuthUser();
    }
  });
  
