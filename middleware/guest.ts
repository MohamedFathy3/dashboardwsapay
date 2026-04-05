export default defineNuxtRouteMiddleware(async (to, from) => {
  // Avoid SSR issues
  if (!process.client) return;

  if (to.path === "/") {
    return;
  }

  const userStore = useUserStore();

  // Guest pages should stay quiet for unauthenticated visitors.
  if (!userStore.token) {
    return;
  }

  try {
    await userStore.fetchAuthUser();
  } catch (error) {
    userStore.setToken();
    userStore.setUser();
    return;
  }

  if (userStore.user || userStore.token) {
    return navigateTo('/dashboard');
  }
});
