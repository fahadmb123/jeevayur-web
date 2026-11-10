import { useState, useCallback } from 'react';
import { getErrorMessage, getFieldErrors, formatApiError, isApiError, type FormattedError } from './errorHandler';

export interface UseApiErrorReturn {
  error: unknown;
  errorMessage: string | null;
  fieldErrors: Record<string, string>;
  formatted: FormattedError | null;
  status: number | null;
  hasError: boolean;
  clearError: () => void;
  setError: (error: unknown, fallbackMessage?: string) => void;
  handleError: (error: unknown, fallbackMessage?: string) => string;
}

export function useApiError(
  defaultFallback = 'An unexpected error occurred. Please try again.'
): UseApiErrorReturn {
  const [error, setRawError] = useState<unknown>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formatted, setFormatted] = useState<FormattedError | null>(null);
  const [status, setStatus] = useState<number | null>(null);

  const clearError = useCallback(() => {
    setRawError(null);
    setErrorMessage(null);
    setFieldErrors({});
    setFormatted(null);
    setStatus(null);
  }, []);

  const setError = useCallback(
    (err: unknown, fallback?: string) => {
      if (!err) {
        clearError();
        return;
      }
      const msg = getErrorMessage(err, fallback || defaultFallback);
      const fmt = formatApiError(err, fallback || defaultFallback);
      setRawError(err);
      setErrorMessage(msg);
      setFieldErrors(getFieldErrors(err));
      setFormatted(fmt);
      setStatus(isApiError(err) ? err.status : null);
    },
    [clearError, defaultFallback]
  );

  const handleError = useCallback(
    (err: unknown, fallback?: string): string => {
      const msg = getErrorMessage(err, fallback || defaultFallback);
      const fmt = formatApiError(err, fallback || defaultFallback);
      setRawError(err);
      setErrorMessage(msg);
      setFieldErrors(getFieldErrors(err));
      setFormatted(fmt);
      setStatus(isApiError(err) ? err.status : null);
      return msg;
    },
    [defaultFallback]
  );

  return {
    error,
    errorMessage,
    fieldErrors,
    formatted,
    status,
    hasError: errorMessage !== null,
    clearError,
    setError,
    handleError,
  };
}
