<!-- pages/member/pending.vue -->
<template>
  <div class="pending-container">
    <div class="pending-card">
      <div class="text-center">
        <div class="pending-icon">⏳</div>
        <h2>Account Pending Approval</h2>
        <p class="text-muted mt-3">
          Thank you for registering! Your account is currently waiting for admin approval.
        </p>
        <p class="text-muted">
          You will receive access to your dashboard once your account is approved.
        </p>
        <button @click="logout" class="btn btn-outline-primary mt-4">
          Back to Login
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const memberStore = useMemberStore();

const logout = async () => {
  await memberStore.logout('/member/login');
};

definePageMeta({
  layout: 'auth'
});
</script>

<style scoped>
.pending-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.pending-card {
  background: white;
  padding: 3rem;
  border-radius: 1rem;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 500px;
}

.pending-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}
</style>