import { ApiError } from './ApiError';

export interface FormattedError {
  message: string;
  status: number;
  code?: string;
  fieldErrors: Record<string, string>;
  isNetworkError: boolean;
  isAuthError: boolean;
  isValidationError: boolean;
  isNotFound: boolean;
  isServerError: boolean;
}

export interface ApiErrorHandlerOptions {
  fallbackMessage?: string;
  notify?: (message: string) => void;
  onAuthError?: () => void;
  onValidationError?: (fieldErrors: Record<string, string>) => void;
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function getErrorMessage(
  error: unknown,
  fallbackMessage = 'An unexpected error occurred. Please try again.'
): string {
  if (!error) {
    return fallbackMessage;
  }

  if (typeof error === 'string') {
    return error.trim() ? error : fallbackMessage;
  }

  if (isApiError(error)) {
    return error.message || fallbackMessage;
  }

  if (error instanceof Error) {
    return error.message || fallbackMessage;
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    const msg = (error as { message: unknown }).message;
    if (typeof msg === 'string' && msg.trim()) {
      return msg;
    }
  }

  return fallbackMessage;
}

export function getFieldErrors(error: unknown): Record<string, string> {
  if (isApiError(error)) {
    return error.fieldErrors;
  }
  return {};
}

export function isNetworkError(error: unknown): boolean {
  return isApiError(error) && error.isNetworkError;
}

export function isAuthError(error: unknown): boolean {
  return isApiError(error) && error.isAuthError;
}

export function isValidationError(error: unknown): boolean {
  return isApiError(error) && error.isValidationError;
}

export function isNotFoundError(error: unknown): boolean {
  return isApiError(error) && error.isNotFound;
}

export function isServerError(error: unknown): boolean {
  return isApiError(error) && error.isServerError;
}

export function formatApiError(
  error: unknown,
  fallbackMessage = 'An unexpected error occurred. Please try again.'
): FormattedError {
  if (isApiError(error)) {
    return {
      message: error.message || fallbackMessage,
      status: error.status,
      code: error.code,
      fieldErrors: error.fieldErrors,
      isNetworkError: error.isNetworkError,
      isAuthError: error.isAuthError,
      isValidationError: error.isValidationError,
      isNotFound: error.isNotFound,
      isServerError: error.isServerError,
    };
  }

  const message = getErrorMessage(error, fallbackMessage);

  return {
    message,
    status: 500,
    fieldErrors: {},
    isNetworkError: false,
    isAuthError: false,
    isValidationError: false,
    isNotFound: false,
    isServerError: true,
  };
}

export function handleApiError(
  error: unknown,
  options?: ApiErrorHandlerOptions
): FormattedError {
  const formatted = formatApiError(error, options?.fallbackMessage);

  if (formatted.isAuthError && options?.onAuthError) {
    options.onAuthError();
  }

  if (formatted.isValidationError && options?.onValidationError && Object.keys(formatted.fieldErrors).length > 0) {
    options.onValidationError(formatted.fieldErrors);
  }

  if (options?.notify) {
    options.notify(formatted.message);
  }

  return formatted;
}

