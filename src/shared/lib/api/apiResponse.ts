export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export type PaginatedApiResponse<T> = ApiResponse<PaginatedData<T>>;

export function isApiResponse<T = unknown>(value: unknown): value is ApiResponse<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'success' in value &&
    typeof (value as { success: unknown }).success === 'boolean'
  );
}

export function unwrapApiResponse<T>(response: ApiResponse<T> | T, fallback?: T): T {
  if (isApiResponse<T>(response)) {
    if (response.data !== undefined) {
      return response.data;
    }
    if (fallback !== undefined) {
      return fallback;
    }
  }
  return response as T;
}

export function createSuccessResponse<T>(data: T, message = 'Success'): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
  };
}

export function createErrorResponse<T = unknown>(message: string, errors: unknown = null): ApiResponse<T> {
  return {
    success: false,
    message,
    errors,
  };
}
