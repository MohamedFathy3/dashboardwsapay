<template>
  <section class="register-page">
    <div class="register-overlay"></div>

    <div class="container position-relative register-shell">
      <div class="row justify-content-center">
        <div class="col-12 col-xl-10">
          <div class="row align-items-stretch register-grid">
            <div class="col-12 col-lg-5 mb-2 mb-lg-0">
              <div class="register-copy-card h-100">
                <span class="register-pill">Open Account</span>
                <h1>Apply to join WSA PAY</h1>
                <p>
                  Submit your company details to create a member account. New applications
                  are created with a <strong>pending</strong> status and can log in only
                  after admin approval.
                </p>

                <div class="register-info-list">
                  <div class="info-item">
                    <strong>Step 1</strong>
                    <span>Complete the application form with your business details.</span>
                  </div>
                  <div class="info-item">
                    <strong>Step 2</strong>
                    <span>Your member account is created and marked as pending.</span>
                  </div>
                  <div class="info-item">
                    <strong>Step 3</strong>
                    <span>Once approved by admin, you can log in normally.</span>
                  </div>
                </div>

                <NuxtLink to="/member/login" class="register-back-link">
                  Already approved? Go to login
                </NuxtLink>
              </div>
            </div>

            <div class="col-12 col-lg-7">
              <div class="card register-form-card">
                <div class="card-body p-0">
                  <div class="register-form-header">
                    <h2>Registration Form</h2>
                    <p>All fields are required to complete your application.</p>
                  </div>

                  <div
                    v-if="successMessage"
                    class="alert alert-success register-alert"
                    role="alert"
                  >
                    {{ successMessage }}
                  </div>

                  <div
                    v-if="errorMessage"
                    class="alert alert-danger register-alert"
                    role="alert"
                  >
                    {{ errorMessage }}
                  </div>

                  <form @submit.prevent="submitRegistration" novalidate>
                    <div class="row">
                      <div class="col-12 col-md-6">
                        <fieldset class="form-group">
                          <label for="name" class="form-label">Name</label>
                          <input
                            id="name"
                            v-model.trim="form.name"
                            type="text"
                            class="form-control"
                            placeholder="Enter company or contact name"
                            :class="inputClass(v$.name)"
                          />
                          <small v-if="showError(v$.name)" class="text-danger">
                            Name is required.
                          </small>
                        </fieldset>
                      </div>

                      <div class="col-12 col-md-6">
                        <fieldset class="form-group">
                          <label for="displayName" class="form-label">Display Name</label>
                          <input
                            id="displayName"
                            v-model.trim="form.displayName"
                            type="text"
                            class="form-control"
                            placeholder="Enter display name"
                            :class="inputClass(v$.displayName)"
                          />
                          <small v-if="showError(v$.displayName)" class="text-danger">
                            Display name is required.
                          </small>
                        </fieldset>
                      </div>

                      <div class="col-12 col-md-6">
                        <fieldset class="form-group">
                          <label for="email" class="form-label">Email</label>
                          <input
                            id="email"
                            v-model.trim="form.email"
                            type="email"
                            class="form-control"
                            placeholder="Enter business email"
                            :class="inputClass(v$.email)"
                          />
                          <small v-if="showError(v$.email)" class="text-danger">
                            Enter a valid email address.
                          </small>
                        </fieldset>
                      </div>

                      <div class="col-12 col-md-6">
                        <fieldset class="form-group">
                          <label for="phone" class="form-label">Phone</label>
                          <input
                            id="phone"
                            v-model.trim="form.phone"
                            type="tel"
                            class="form-control"
                            placeholder="Enter phone number"
                            :class="inputClass(v$.phone)"
                          />
                          <small v-if="showError(v$.phone)" class="text-danger">
                            Enter a valid phone number.
                          </small>
                        </fieldset>
                      </div>

                      <div class="col-12 col-md-6">
                        <fieldset class="form-group">
                          <label for="password" class="form-label">Password</label>
                          <input
                            id="password"
                            v-model.trim="form.password"
                            type="password"
                            class="form-control"
                            placeholder="Create a password"
                            :class="inputClass(v$.password)"
                          />
                          <small v-if="showError(v$.password)" class="text-danger">
                            Password is required and must be at least 8 characters.
                          </small>
                        </fieldset>
                      </div>

                      <div class="col-12">
                        <fieldset class="form-group">
                          <label for="address" class="form-label">Address</label>
                          <input
                            id="address"
                            v-model.trim="form.address"
                            type="text"
                            class="form-control"
                            placeholder="Enter business address"
                            :class="inputClass(v$.address)"
                          />
                          <small v-if="showError(v$.address)" class="text-danger">
                            Address is required.
                          </small>
                        </fieldset>
                      </div>

                      <div class="col-12 col-md-6">
                        <fieldset class="form-group">
                          <label for="city" class="form-label">City</label>
                          <input
                            id="city"
                            v-model.trim="form.city"
                            type="text"
                            class="form-control"
                            placeholder="Enter city"
                            :class="inputClass(v$.city)"
                          />
                          <small v-if="showError(v$.city)" class="text-danger">
                            City is required.
                          </small>
                        </fieldset>
                      </div>

                      <div class="col-12 col-md-6">
                        <fieldset class="form-group">
                          <label for="state" class="form-label">State</label>
                          <input
                            id="state"
                            v-model.trim="form.state"
                            type="text"
                            class="form-control"
                            placeholder="Enter state"
                            :class="inputClass(v$.state)"
                          />
                          <small v-if="showError(v$.state)" class="text-danger">
                            State is required.
                          </small>
                        </fieldset>
                      </div>

                      <div class="col-12 col-md-6">
                        <fieldset class="form-group">
                          <label for="postalCode" class="form-label">Postal Code</label>
                          <input
                            id="postalCode"
                            v-model.trim="form.postalCode"
                            type="text"
                            class="form-control"
                            placeholder="Enter postal code"
                            :class="inputClass(v$.postalCode)"
                          />
                          <small v-if="showError(v$.postalCode)" class="text-danger">
                            Postal code is required.
                          </small>
                        </fieldset>
                      </div>

                      <div class="col-12 col-md-6">
                        <fieldset class="form-group">
                          <label for="countryId" class="form-label">Country</label>
                          <select
                            id="countryId"
                            v-model="form.countryId"
                            class="form-control"
                            :class="inputClass(v$.countryId)"
                            :disabled="countriesLoading"
                          >
                            <option value="" disabled>
                              {{ countriesLoading ? "Loading countries..." : "Select country" }}
                            </option>
                            <option
                              v-for="country in countryOptions"
                              :key="country.id"
                              :value="String(country.id)"
                            >
                              {{ country.name }}
                            </option>
                          </select>
                          <small v-if="showError(v$.countryId)" class="text-danger">
                            Country is required.
                          </small>
                        </fieldset>
                      </div>
                    </div>

                    <div class="register-actions">
                      <button
                        type="submit"
                        class="btn btn-primary register-submit"
                        :disabled="isSubmitting || countriesLoading"
                      >
                        {{ isSubmitting ? "Submitting..." : "Submit Application" }}
                      </button>

                      <NuxtLink to="/member/login" class="btn btn-outline-secondary register-secondary">
                        Login
                      </NuxtLink>
                    </div>

                    <p class="register-note mb-0">
                      Your account will stay pending until an admin updates your status to approved.
                    </p>
                  </form>
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
import useVuelidate from "@vuelidate/core";
import { email, helpers, minLength, required } from "@vuelidate/validators";

definePageMeta({
  layout: "auth",
  middleware: "guest",
  title: "Register",
});

type RegistrationForm = {
  name: string;
  displayName: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  countryId: string;
};

type CountryOption = {
  id: string | number;
  name: string;
};

const notify = useNotify();
const router = useRouter();

const form = ref<RegistrationForm>({
  name: "",
  displayName: "",
  email: "",
  phone: "",
  password: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  countryId: "",
});

const isSubmitting = ref(false);
const countriesLoading = ref(true);
const successMessage = ref("");
const errorMessage = ref("");
const countryOptions = ref<CountryOption[]>([]);

const phoneRule = helpers.regex(/^\+?[0-9()\-\s]{7,20}$/);

const rules = computed(() => ({
  name: { required },
  displayName: { required },
  email: { required, email },
  phone: { required, phoneRule },
  password: { required, minLength: helpers.withMessage("Password must be at least 8 characters.", minLength(8)) },
  address: { required },
  city: { required },
  state: { required },
  postalCode: { required },
  countryId: { required },
}));

const v$ = useVuelidate(rules, form);

const loadCountries = async () => {
  countriesLoading.value = true;

  try {
    const response = await useApiFetch<{ data?: CountryOption[] }>("/fetch-countries");
    countryOptions.value = response?.data || [];
  } catch (error: any) {
    countryOptions.value = [];
    errorMessage.value = extractErrorMessage(error, "Failed to load countries.");
    notify.error(errorMessage.value);
  } finally {
    countriesLoading.value = false;
  }
};

const showError = (field: { $dirty: boolean; $error: boolean }) => field.$dirty && field.$error;

const inputClass = (field: { $dirty: boolean; $error: boolean }) => ({
  "border border-danger": showError(field),
});

const resetMessages = () => {
  successMessage.value = "";
  errorMessage.value = "";
};

const resetForm = () => {
  form.value = {
    name: "",
    displayName: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    countryId: "",
  };
  v$.value.$reset();
};

const extractErrorMessage = (error: any, fallback: string) => {
  const apiMessage = error?.data?.message || error?.response?._data?.message;

  if (apiMessage) {
    return apiMessage;
  }

  const validationErrors = error?.data?.errors || error?.response?._data?.errors;
  if (validationErrors && typeof validationErrors === "object") {
    const firstError = Object.values(validationErrors).flat()[0];
    if (typeof firstError === "string" && firstError) {
      return firstError;
    }
  }

  return error?.message || fallback;
};

const submitRegistration = async () => {
  resetMessages();

  const isValid = await v$.value.$validate();
  if (!isValid) {
    errorMessage.value = "Please complete all fields correctly before submitting.";
    return;
  }

  isSubmitting.value = true;

  try {
    await useApiFetch("/application-form", {
      method: "POST",
      body: {
        ...form.value,
        countryId: String(form.value.countryId),
        status: "pending",
      },
    });

    successMessage.value =
      "Registration submitted successfully. Your account is pending approval. You will be redirected to login.";
    notify.success(successMessage.value);
    resetForm();

    setTimeout(() => {
      router.push("/login");
    }, 1400);
  } catch (error: any) {
    errorMessage.value = extractErrorMessage(
      error,
      "Registration failed. Please review your information and try again."
    );
    notify.error(errorMessage.value);
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  loadCountries();
});
</script>

<style scoped>
.register-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background:
    linear-gradient(135deg, rgba(14, 32, 64, 0.92), rgba(24, 82, 149, 0.84)),
    url('/app-assets/images/pages/vuexy-login-bg.jpg') center center / cover no-repeat;
}

.register-overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.12), transparent 30%),
    radial-gradient(circle at bottom right, rgba(180, 217, 255, 0.12), transparent 28%);
}

.register-shell {
  z-index: 1;
  padding-top: 48px;
  padding-bottom: 48px;
}

.register-grid {
  row-gap: 24px;
}

.register-copy-card,
.register-form-card {
  border: 0;
  border-radius: 28px;
  box-shadow: 0 24px 70px rgba(8, 24, 48, 0.24);
}

.register-copy-card {
  padding: 32px;
  background: rgba(11, 26, 52, 0.76);
  color: #ffffff;
  backdrop-filter: blur(12px);
}

.register-pill {
  display: inline-flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.16);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.register-copy-card h1 {
  margin-bottom: 16px;
  color: #ffffff;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.15;
  font-weight: 700;
}

.register-copy-card p {
  margin-bottom: 28px;
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.8;
}

.register-info-list {
  display: grid;
  gap: 16px;
  margin-bottom: 28px;
}

.info-item {
  padding: 18px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.info-item strong {
  display: block;
  margin-bottom: 6px;
  color: #ffffff;
}

.info-item span {
  display: block;
  color: rgba(255, 255, 255, 0.74);
  line-height: 1.65;
}

.register-back-link {
  color: #ffffff;
  font-weight: 600;
  text-decoration: underline;
}

.register-form-card {
  padding: 32px;
  background: rgba(255, 255, 255, 0.96);
}

.register-form-header {
  margin-bottom: 24px;
}

.register-form-header h2 {
  margin-bottom: 10px;
  color: #10233f;
  font-size: 2rem;
  font-weight: 700;
}

.register-form-header p {
  margin-bottom: 0;
  color: #627086;
  line-height: 1.7;
}

.register-alert {
  margin-bottom: 20px;
  border-radius: 16px;
}

.form-label {
  margin-bottom: 8px;
  color: #24364d;
  font-weight: 600;
}

.form-control {
  min-height: 48px;
  border-radius: 14px;
  border-color: #dbe4f0;
  box-shadow: none;
}

.form-control:focus {
  border-color: #1f6bc1;
  box-shadow: 0 0 0 0.2rem rgba(31, 107, 193, 0.12);
}

.register-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 10px;
  margin-bottom: 18px;
}

.register-submit,
.register-secondary {
  min-width: 190px;
  min-height: 48px;
  border-radius: 999px;
  font-weight: 600;
}

.register-note {
  color: #627086;
  line-height: 1.7;
}

@media (max-width: 991.98px) {
  .register-shell {
    padding-top: 32px;
    padding-bottom: 32px;
  }
}

@media (max-width: 575.98px) {
  .register-copy-card,
  .register-form-card {
    padding: 24px 20px;
    border-radius: 22px;
  }

  .register-form-header h2 {
    font-size: 1.7rem;
  }

  .register-submit,
  .register-secondary {
    width: 100%;
  }
}
</style>
