// Zod validation comes from API backend
import { AxiosError } from "axios";
import type { UseFormSetError, FieldValues, Path } from "react-hook-form";
import type { ApiError } from "../../types";


// Returns the top-level error message from a backend response
export function getErrorMessage(
    error: unknown,
    fallback = "Something went wrong"
): string {
        if (error instanceof AxiosError) {
    return (error.response?.data as ApiError)?.message ?? fallback;
  }
  return fallback;
}

// Returns field errors as flat object
export function getFieldErrors(error: unknown):Record<string, string> {
    if (error instanceof AxiosError) {
        const data = error.response?.data as ApiError | undefined;
        if (!data?.errors) return {};
          return Object.fromEntries(
            Object.entries(data.errors).map(([field, msgs]) => [field, msgs[0]])
       );
    }
    return {}
}

// Applies backend field errors directly to react-hook-form via setError()
export function applyFieldErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>
): void {
  const fieldErrors = getFieldErrors(error);
  Object.entries(fieldErrors).forEach(([field, message]) => {
    setError(field as Path<T>, { message });
  });
}

