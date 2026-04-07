export type RegistrationForm = {
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

export type CountryOption = {
  id: string | number;
  name: string;
};

type ValidationErrorsMap = Record<string, string | string[]>;

type ApiErrorPayload = {
  message?: string;
  errors?: ValidationErrorsMap;
};

type CountriesEnvelope = {
  data?: unknown;
};

export const createRegistrationForm = (): RegistrationForm => ({
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

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isCountryOption = (value: unknown): value is CountryOption =>
  isObject(value) &&
  (typeof value.id === "string" || typeof value.id === "number") &&
  typeof value.name === "string";

export const normalizeCountryOptions = (response: unknown): CountryOption[] => {
  if (Array.isArray(response)) {
    return response.filter(isCountryOption);
  }

  if (isObject(response)) {
    const responseData = (response as CountriesEnvelope).data;

    if (Array.isArray(responseData)) {
      return responseData.filter(isCountryOption);
    }

    if (isObject(responseData) && Array.isArray(responseData.data)) {
      return responseData.data.filter(isCountryOption);
    }
  }

  return [];
};

const extractValidationError = (errors: unknown): string => {
  if (!isObject(errors)) {
    return "";
  }

  for (const value of Object.values(errors)) {
    if (typeof value === "string" && value.trim()) {
      return value;
    }

    if (Array.isArray(value)) {
      const firstMessage = value.find(
        (item): item is string => typeof item === "string" && item.trim().length > 0,
      );

      if (firstMessage) {
        return firstMessage;
      }
    }
  }

  return "";
};

const getApiErrorPayload = (error: unknown): ApiErrorPayload | null => {
  if (!isObject(error)) {
    return null;
  }

  if (isObject(error.data)) {
    return error.data as ApiErrorPayload;
  }

  if (isObject(error.response) && isObject(error.response._data)) {
    return error.response._data as ApiErrorPayload;
  }

  return null;
};

export const extractErrorMessage = (error: unknown, fallback: string): string => {
  const payload = getApiErrorPayload(error);

  if (typeof payload?.message === "string" && payload.message.trim()) {
    return payload.message;
  }

  const validationMessage = extractValidationError(payload?.errors);
  if (validationMessage) {
    return validationMessage;
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
};
