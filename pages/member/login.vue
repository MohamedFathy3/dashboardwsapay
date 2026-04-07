
<template>
  <div class="member-login-container">
    <div class="member-login-overlay"></div>

    <div class="member-login-shell">
      <div class="member-login-card">
        <div class="text-center mb-4">
          <h2>Member Login</h2>
          <p>Access your member dashboard</p>
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
    await memberStore.login(form, '/member/dashboard');
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
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background:
    linear-gradient(135deg, rgba(14, 32, 64, 0.92), rgba(24, 82, 149, 0.84)),
    url('/app-assets/images/pages/vuexy-login-bg.jpg') center center / cover no-repeat;
}

.member-login-overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.14), transparent 34%),
    radial-gradient(circle at bottom right, rgba(180, 217, 255, 0.14), transparent 30%);
}

.member-login-shell {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 464px;
  padding: 64px 24px;
}

.member-login-card {
  padding: 32px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 24px 70px rgba(8, 24, 48, 0.24);
  width: 100%;
}

.member-login-card h2 {
  margin-bottom: 14px;
  color: #10233f;
  font-size: 1.9rem;
  line-height: 1.25;
  font-weight: 700;
}

.member-login-card p {
  margin-bottom: 24px;
  color: #5c6b80;
  line-height: 1.75;
}

.member-login-card label {
  margin-bottom: 8px;
  color: #10233f;
  font-weight: 600;
}

.member-login-card .form-control {
  min-height: 52px;
  border: 1px solid #dce6f5;
  border-radius: 16px;
  background: #f5f8fd;
  color: #10233f;
  box-shadow: none;
}

.member-login-card .form-control::placeholder {
  color: #6d7a8f;
}

.member-login-card .form-control:focus {
  border-color: #185295;
  background: #ffffff;
  box-shadow: 0 0 0 0.2rem rgba(24, 82, 149, 0.12);
}

.member-login-card .btn-primary {
  min-height: 52px;
  border: none;
  border-radius: 999px;
  font-weight: 600;
  background: linear-gradient(135deg, #10233f, #185295);
  box-shadow: 0 14px 30px rgba(24, 82, 149, 0.24);
}

.member-login-card .btn-primary:hover,
.member-login-card .btn-primary:focus,
.member-login-card .btn-primary:active {
  background: linear-gradient(135deg, #10233f, #185295);
}

@media (max-width: 575.98px) {
  .member-login-shell {
    padding: 28px 16px;
  }

  .member-login-card {
    padding: 24px 20px;
    border-radius: 22px;
  }

  .member-login-card h2 {
    font-size: 1.55rem;
  }
}
</style>
