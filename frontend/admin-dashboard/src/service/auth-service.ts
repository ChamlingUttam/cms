import { apiClient } from '@/api/client';
import { authEndpoints } from '@/api-endpoints/auth';
import type {
  Admin,
  AdminCredentialUpdate,
  ApiResponse,
  LoginCredentials,
  LoginResponse,
} from '@/types/auth';

const TOKEN_KEY = 'admin-token';
const AUTH_CHANGE_EVENT = 'admin:auth-change';

function notifyAuthChange() {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export async function loginAdmin(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const { data } = await apiClient.post<ApiResponse<LoginResponse>>(
    authEndpoints.login,
    credentials,
  );

  window.localStorage.setItem(TOKEN_KEY, data.data.token);
  notifyAuthChange();
  return data.data;
}

export async function getCurrentAdmin(): Promise<Admin> {
  const { data } = await apiClient.get<ApiResponse<{ admin: Admin }>>(
    authEndpoints.currentAdmin,
  );

  return data.data.admin;
}

export async function updateAdminCredentials(
  credentials: AdminCredentialUpdate,
): Promise<LoginResponse> {
  const { data } = await apiClient.patch<ApiResponse<LoginResponse>>(
    authEndpoints.changeFields,
    credentials,
  );

  window.localStorage.setItem(TOKEN_KEY, data.data.token);
  notifyAuthChange();
  return data.data;
}

export async function logoutAdmin() {
  try {
    await apiClient.post(authEndpoints.logout);
  } finally {
    clearAdminToken();
  }
}

export function getAdminToken() {
  return window.localStorage.getItem(TOKEN_KEY);
}

export function subscribeToAuthChanges(onChange: () => void) {
  window.addEventListener('storage', onChange);
  window.addEventListener(AUTH_CHANGE_EVENT, onChange);

  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(AUTH_CHANGE_EVENT, onChange);
  };
}

export function clearAdminToken() {
  window.localStorage.removeItem(TOKEN_KEY);
  notifyAuthChange();
}
