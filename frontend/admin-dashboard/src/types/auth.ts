export interface Admin {
  id: string;
  username: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  admin: Admin;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
