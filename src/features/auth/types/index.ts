export interface User {
  id: number;
  name: string;
  email: string;
  role: 'doctor' | 'patient' | 'admin';
  avatarUrl?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: 'patient' | 'doctor';
}

export interface LoginResponse {
  user: User;
  accessToken?: string;
}
