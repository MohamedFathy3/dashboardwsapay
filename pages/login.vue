<template>
  <section class="d-flex justify-content-center align-items-center min-vh-100 main-login">

    <div class="d-flex justify-content-center ">
      <div class="card  bg-authentication">
        <div class="row m-0">
          <div
            class="col-lg-6 d-lg-block d-none text-center align-self-center px-1 py-0"
          >
            <img src="/app-assets/images/pages/login.png" alt="branding logo" />
          </div>
          <div class="col-lg-6 col-12 p-0">
            <div class="card h-100">
              <div class="card-header pb-1">
                <div class="card-title">
                  <h4 class="mb-0">Login</h4>
                </div>
              </div>
              <p class="px-2">Welcome back, please login to your account.</p>
              <div class="card-content">
                <div class="card-body pt-1">
                  <!-- Start Form -->
                  <form @submit.prevent="login">
                    <fieldset
                      class="form-label-group form-group position-relative has-icon-left"
                    >
                      <input
                        v-model="auth.email"
                        type="email"
                        class="form-control"
                        id="user-name"
                        placeholder="Email"
                        :class="{
                          'border border-danger': !v$.email.$pending && v$.email.$error,
                        }"
                      />
                      <div class="form-control-position">
                        <i class="feather icon-user"></i>
                      </div>
                      <label for="user-name">Email</label>

                      <!-- Email Error Message -->
                      <div v-if="!v$.email.$pending && v$.email.$error" class="text-danger">
                        <small>Email is required and must be valid.</small>
                      </div>
                    </fieldset>

                    <fieldset
                      class="form-label-group position-relative has-icon-left"
                    >
                      <input
                        v-model="auth.password"
                        type="password"
                        class="form-control"
                        id="user-password"
                        placeholder="Password"
                        :class="{
                          'border border-danger': !v$.password.$pending && v$.password.$error,
                        }"
                      />
                      <div class="form-control-position">
                        <i class="feather icon-lock"></i>
                      </div>
                      <label for="user-password">Password</label>

                      <!-- Password Error Message -->
                      <div v-if="!v$.password.$pending && v$.password.$error" class="text-danger">
                        <small>Password is required.</small>
                      </div>
                    </fieldset>

                    <div class="form-group d-flex justify-content-between align-items-center">
                      <div class="text-left">
                        <fieldset class="checkbox">
                          <div class="vs-checkbox-con vs-checkbox-primary">
                            <input type="checkbox" v-model="auth.remember" />
                            <span class="vs-checkbox">
                              <span class="vs-checkbox--check">
                                <i class="vs-icon feather icon-check"></i>
                              </span>
                            </span>
                            <span class="">Remember me</span>
                          </div>
                        </fieldset>
                      </div>
                      <div class="text-right">
                        <a href="auth-forgot-password.html" class="card-link"
                          >Forgot Password?</a
                        >
                      </div>
                    </div>

                    <button
                      type="submit"
                      :disabled="v$.$pending"
                      class="btn btn-primary float-right btn-inline"
                    >
                      Login
                    </button>
                    <div v-if="errorMessage" class="text-danger mt-2">
                      <small>{{ errorMessage }}</small>
                    </div>
                  </form>
                  <!-- End Form -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

  

  
  <script setup lang="ts">
import { email, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
  

definePageMeta({
  layout: "auth",
  title: "Login",
  middleware: "auth",
});

interface Credentials {
  email: string;
  password: string;
  remember: boolean;
}

const auth = ref<Credentials>({ email: "", password: "", remember: false });
const route = useRoute();
const redirectPath = computed(() => route.query?.redirect);
const errorMessage = ref<string | null>(null);

// Validation Rules
const rules = computed(() => ({
  email: { required, email },
  password: { required },
}));
const v$ = useVuelidate(rules, auth);

async function login() {
  const result = await v$.value.$validate();
  if (!result) return; // Validation failed, return early
  errorMessage.value = null;
  const redirect = Array.isArray(redirectPath.value)
    ? redirectPath.value[0]
    : redirectPath.value;

  const userStore = useUserStore();

  try {
    await userStore.login(auth.value, redirect);
  } catch (error: any) {
    errorMessage.value = error?.message || "Login failed. Please try again.";
  }
}
</script>


<style>
.main-login {
  background: url('/app-assets/images/pages/vuexy-login-bg.jpg') center center no-repeat;
  background-size: cover;
}

.bg-authentication {
    background-color: #eff2f7;
}
</style>
