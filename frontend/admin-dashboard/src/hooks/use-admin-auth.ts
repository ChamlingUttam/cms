'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getCurrentAdmin,
  loginAdmin,
  updateAdminCredentials,
} from '@/service/auth-service';
import type { AdminCredentialUpdate, LoginCredentials } from '@/types/auth';

const currentAdminQueryKey = ['admin', 'current'] as const;

export function useAdminLogin() {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => loginAdmin(credentials),
  });
}

export function useCurrentAdmin(enabled: boolean) {
  return useQuery({
    queryKey: currentAdminQueryKey,
    queryFn: getCurrentAdmin,
    enabled,
    retry: false,
    staleTime: 60_000,
  });
}

export function useUpdateAdminCredentials() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: AdminCredentialUpdate) =>
      updateAdminCredentials(credentials),
    onSuccess: ({ admin }) => {
      queryClient.setQueryData(currentAdminQueryKey, admin);
    },
  });
}
