'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import {
  getCurrentAdmin,
  loginAdmin,
} from '@/service/auth-service';
import type { LoginCredentials } from '@/types/auth';

export function useAdminLogin() {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => loginAdmin(credentials),
  });
}

export function useCurrentAdmin(enabled: boolean) {
  return useQuery({
    queryKey: ['admin', 'current'],
    queryFn: getCurrentAdmin,
    enabled,
    retry: false,
    staleTime: 60_000,
  });
}
