export default defineNuxtRouteMiddleware(async (to, from) => {
  const { $pinia } = useNuxtApp();
  const userStore = useUserStore($pinia);

  if (to.path === '/login') {
    return;
  }

  if (userStore.token && userStore.user) {
    return;
  }

  if (userStore.token) {
    try {
      await userStore.fetchAuthUser();
      return;
    } catch (err) {
      console.error('Error fetching user data:', err);
      userStore.clearAuth();
    }
  }

  return navigateTo({ path: '/login', query: { redirect: to.fullPath } });
});
