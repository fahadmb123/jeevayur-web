export interface ApiErrorPayload {
  message?: string;
  statusCode?: number;
  code?: string;
  errors?: unknown;
  details?: unknown;
  timestamp?: string;
  [key: string]: unknown;
}

export interface ApiErrorOptions {
  code?: string;
  errors?: unknown;
  raw?: unknown;
}

function parseFieldErrors(errors: unknown): Record<string, string> {
  const result: Record<string, string> = {};

  if (!errors) {
    return result;
  }

  if (Array.isArray(errors)) {
    for (const item of errors) {
      if (typeof item === 'object' && item !== null) {
        const field = 'field' in item && typeof item.field === 'string'
          ? item.field.replace(/^(body|query|params)\./, '')
          : 'path' in item && Array.isArray(item.path)
            ? item.path.join('.').replace(/^(body|query|params)\./, '')
            : null;

        const message = 'message' in item && typeof item.message === 'string'
          ? item.message
          : null;

        if (field && message && !result[field]) {
          result[field] = message;
        }
      }
    }
    return result;
  }

  if (typeof errors === 'object') {
    for (const [key, value] of Object.entries(errors)) {
      if (typeof value === 'string') {
        const sanitizedKey = key.replace(/^(body|query|params)\./, '');
        result[sanitizedKey] = value;
      } else if (Array.isArray(value) && typeof value[0] === 'string') {
        const sanitizedKey = key.replace(/^(body|query|params)\./, '');
        result[sanitizedKey] = value[0];
      }
    }
  }

  return result;
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly code?: string;
  public readonly errors?: unknown;
  public readonly fieldErrors: Record<string, string>;
  public readonly raw?: unknown;
  public readonly payload?: ApiErrorPayload;

  constructor(status: number, message: string, options?: ApiErrorOptions | ApiErrorPayload) {
    super(message);
    this.status = status;
    this.name = 'ApiError';

    const opts = options as (ApiErrorOptions & ApiErrorPayload) | undefined;
    this.code = opts?.code;
    this.errors = opts?.errors ?? opts?.details;
    this.raw = opts?.raw ?? options;
    this.payload = typeof options === 'object' && options !== null ? (options as ApiErrorPayload) : undefined;
    this.fieldErrors = parseFieldErrors(this.errors);

    Object.setPrototypeOf(this, ApiError.prototype);
  }

  public get isNetworkError(): boolean {
    return this.status === 0;
  }

  public get isAuthError(): boolean {
    return this.status === 401 || this.status === 403;
  }

  public get isUnauthorized(): boolean {
    return this.status === 401;
  }

  public get isForbidden(): boolean {
    return this.status === 403;
  }

  public get isNotFound(): boolean {
    return this.status === 404;
  }

  public get isValidationError(): boolean {
    return this.status === 400 || this.status === 422 || this.code === 'VALIDATION' || this.code === 'VALIDATION_ERROR';
  }

  public get isServerError(): boolean {
    return this.status >= 500;
  }
}
