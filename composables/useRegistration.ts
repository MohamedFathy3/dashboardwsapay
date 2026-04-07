import useVuelidate from "@vuelidate/core";
import { email, helpers, minLength, required } from "@vuelidate/validators";
import {
  createRegistrationForm,
  extractErrorMessage,
  normalizeCountryOptions,
  type CountryOption,
  type RegistrationForm,
} from "~/utils/registration";

export function useRegistration() {
  const notify = useNotify();
  const router = useRouter();

  const form = reactive<RegistrationForm>(createRegistrationForm());
  const isSubmitting = ref(false);
  const countriesLoading = ref(true);
  const successMessage = ref("");
  const errorMessage = ref("");
  const countryOptions = ref<CountryOption[]>([]);
  const redirectTimeoutId = ref<ReturnType<typeof setTimeout> | null>(null);

  const phoneRule = helpers.regex(/^\+?[0-9()\-\s]{7,20}$/);

  const rules = computed(() => ({
    name: { required },
    displayName: { required },
    email: { required, email },
    phone: { required, phoneRule },
    password: {
      required,
      minLength: helpers.withMessage(
        "Password must be at least 8 characters.",
        minLength(8),
      ),
    },
    address: { required },
    city: { required },
    state: { required },
    postalCode: { required },
    countryId: { required },
  }));

  const v$ = useVuelidate(rules, form);

  const showError = (field: { $dirty: boolean; $error: boolean }) =>
    field.$dirty && field.$error;

  const inputClass = (field: { $dirty: boolean; $error: boolean }) => ({
    "border border-danger": showError(field),
  });

  const resetMessages = () => {
    successMessage.value = "";
    errorMessage.value = "";
  };

  const resetForm = () => {
    Object.assign(form, createRegistrationForm());
    v$.value.$reset();
  };

  const clearRedirectTimeout = () => {
    if (redirectTimeoutId.value) {
      clearTimeout(redirectTimeoutId.value);
      redirectTimeoutId.value = null;
    }
  };

  const scheduleRedirect = () => {
    clearRedirectTimeout();

    redirectTimeoutId.value = setTimeout(() => {
      router.push("/login");
    }, 1000);
  };

  const loadCountries = async () => {
    countriesLoading.value = true;

    try {
      const response = await useApiFetch<unknown>("/fetch-countries");
      countryOptions.value = normalizeCountryOptions(response);
    } catch (error: unknown) {
      countryOptions.value = [];
      errorMessage.value = extractErrorMessage(error, "Failed to load countries.");
      notify.error(errorMessage.value);
    } finally {
      countriesLoading.value = false;
    }
  };

  const submitRegistration = async () => {
    if (isSubmitting.value) {
      return;
    }

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
          ...form,
          countryId: String(form.countryId ?? ""),
          status: "pending",
        },
      });

      successMessage.value =
        "Registration submitted successfully. Your account is pending approval. You will be redirected to login.";
      notify.success(successMessage.value);

      resetForm();
      scheduleRedirect();
    } catch (error: unknown) {
      errorMessage.value = extractErrorMessage(
        error,
        "Registration failed. Please review your information and try again.",
      );
      notify.error(errorMessage.value);
    } finally {
      isSubmitting.value = false;
    }
  };

  const init = async () => {
    await loadCountries();
  };

  const cleanup = () => {
    clearRedirectTimeout();
  };

  return {
    form,
    v$,
    isSubmitting,
    countriesLoading,
    successMessage,
    errorMessage,
    countryOptions,
    showError,
    inputClass,
    resetMessages,
    resetForm,
    loadCountries,
    submitRegistration,
    init,
    cleanup,
  };
}
