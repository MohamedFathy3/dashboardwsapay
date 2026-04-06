<!-- pages/member/login.vue -->
<template>
  <div class="member-login-container">
    <div class="member-login-card">
      <div class="text-center mb-4">
        <h2>Member Login</h2>
        <p class="text-muted">Access your member dashboard</p>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="form-group mb-3">
          <label>Email Address</label>
          <input
            v-model="form.email"
            type="email"
            class="form-control"
            required
            placeholder="Enter your email"
          />
        </div>

        <div class="form-group mb-4">
          <label>Password</label>
          <input
            v-model="form.password"
            type="password"
            class="form-control"
            required
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" class="btn btn-primary w-100" :disabled="memberStore.isLoading">
          {{ memberStore.isLoading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const memberStore = useMemberStore();

const form = reactive({
  email: '',
  password: ''
});

const handleLogin = async () => {
  try {
    await memberStore.login(form, '/dashboard');
  } catch (error) {
    // Error already handled in store
    console.error('Login failed:', error);
  }
};

definePageMeta({
  layout: 'auth',
  middleware: 'guest'
});
</script>

<style scoped>
.member-login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.member-login-card {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
}
</style>