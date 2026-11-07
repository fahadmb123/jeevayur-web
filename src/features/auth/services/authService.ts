import type { LoginResponse, LoginCredentials, User } from '../types';
import { apiClient } from '@/shared/lib/api/apiClient';
import { ApiError } from '@/shared/lib/api/ApiError';
import { tokenStorage } from '@/shared/lib/auth/tokenStorage';

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    const response = await apiClient.post<LoginResponse, LoginCredentials>('/api/auth/login', credentials);
    if (response.accessToken) {
      tokenStorage.setAccessToken(response.accessToken);
    }
    return response.user;
  },

  async requestPasswordReset(email: string): Promise<string> {
    const response = await apiClient.post<{ message: string }, { email: string }>(
      '/api/auth/forgot-password',
      { email }
    );
    return response.message || 'If an account exists with this email, password reset instructions have been sent.';
  },

  async resetPassword(token: string, newPassword: string): Promise<string> {
    const response = await apiClient.post<
      { message: string },
      { token: string; newPassword: string }
    >('/api/auth/reset-password', { token, newPassword });
    return response.message || 'Password has been updated successfully.';
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/auth/logout', {});
    } finally {
      tokenStorage.clearAccessToken();
    }
  },

  async refreshToken(): Promise<string | null> {
    try {
      const response = await apiClient.post<LoginResponse>('/api/auth/refresh');
      if (response.accessToken) {
        tokenStorage.setAccessToken(response.accessToken);
        return response.accessToken;
      }
      return null;
    } catch {
      tokenStorage.clearAccessToken();
      return null;
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get<{ user: User }>('/api/auth/me');
      return response.user;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        tokenStorage.clearAccessToken();
        return null;
      }
      throw error;
    }
  },
};
