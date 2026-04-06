// middleware/auth-member.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  const memberStore = useMemberStore();
  
  // Check if user is authenticated
  const isAuthenticated = await memberStore.checkAuth();
  
  if (!isAuthenticated) {
    return navigateTo('/member/login');
  }
  
  if (to.path === '/dashboard' && !memberStore.isApproved) {
    return navigateTo('/member/pending');
  }
});