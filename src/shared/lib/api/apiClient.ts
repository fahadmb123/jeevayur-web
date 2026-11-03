import { environment } from '@/shared/config/environment';
import { tokenStorage } from '@/shared/lib/auth/tokenStorage';
import { ApiError } from './ApiError';

let refreshPromise: Promise<string | null> | null = null;

function buildHeaders(customHeaders?: HeadersInit): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const token = tokenStorage.getAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return {
    ...headers,
    ...customHeaders,
  };
}

async function requestRefreshToken(): Promise<string | null> {
  try {
    const url = `${environment.apiBaseUrl}/api/auth/refresh`;
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      tokenStorage.clearAccessToken();
      return null;
    }

    const data = await response.json().catch(() => null);
    if (data?.accessToken) {
      tokenStorage.setAccessToken(data.accessToken);
      return data.accessToken;
    }

    tokenStorage.clearAccessToken();
    return null;
  } catch {
    tokenStorage.clearAccessToken();
    return null;
  } finally {
    refreshPromise = null;
  }
}

async function request<TResponse>(path: string, options: RequestInit = {}, isRetry = false): Promise<TResponse> {
  let response: Response;
  const url = `${environment.apiBaseUrl}${path}`;

  try {
    response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: buildHeaders(options.headers),
    });
  } catch {
    throw new ApiError(0, 'Unable to connect to the API service');
  }

  const isAuthRoute =
    path.startsWith('/api/auth/login') ||
    path.startsWith('/api/auth/refresh') ||
    path.startsWith('/api/auth/logout');

  if (response.status === 401 && !isRetry && !isAuthRoute) {
    if (!refreshPromise) {
      refreshPromise = requestRefreshToken();
    }
    const newAccessToken = await refreshPromise;

    if (newAccessToken) {
      return request<TResponse>(path, options, true);
    }
  }

  if (response.status === 401) {
    tokenStorage.clearAccessToken();
  }

  if (response.status === 204) {
    return undefined as unknown as TResponse;
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      response.status,
      payload?.error?.message || payload?.message || 'Request failed',
      payload?.error
    );
  }

  return payload as TResponse;
}

export const apiClient = {
  get<TResponse>(path: string, headers?: HeadersInit): Promise<TResponse> {
    return request<TResponse>(path, { method: 'GET', headers });
  },

  post<TResponse, TBody = unknown>(path: string, body?: TBody, headers?: HeadersInit): Promise<TResponse> {
    return request<TResponse>(path, {
      method: 'POST',
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  put<TResponse, TBody = unknown>(path: string, body?: TBody, headers?: HeadersInit): Promise<TResponse> {
    return request<TResponse>(path, {
      method: 'PUT',
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  patch<TResponse, TBody = unknown>(path: string, body?: TBody, headers?: HeadersInit): Promise<TResponse> {
    return request<TResponse>(path, {
      method: 'PATCH',
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  delete<TResponse>(path: string, headers?: HeadersInit): Promise<TResponse> {
    return request<TResponse>(path, { method: 'DELETE', headers });
  },
};
