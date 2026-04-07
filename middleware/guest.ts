export default defineNuxtRouteMiddleware(async (to, from) => {
  // Avoid SSR issues
  if (!process.client) return;

  if (to.path === "/") {
    return;
  }

  const isMemberGuestRoute = to.path.startsWith("/member/");
  const userStore = useUserStore();
  const memberStore = useMemberStore();

  if (isMemberGuestRoute) {
    if (!memberStore.token) {
      return;
    }

    try {
      await memberStore.checkAuth();
    } catch (error) {
      return;
    }

    return navigateTo(memberStore.isApproved ? "/member/dashboard" : "/member/pending");
  }

  // Guest pages should stay quiet for unauthenticated visitors.
  if (!userStore.token) {
    return;
  }

  try {
    await userStore.fetchAuthUser();
  } catch (error) {
    userStore.clearAuth();
    return;
  }

  if (userStore.user || userStore.token) {
    return navigateTo('/dashboard');
  }
});
