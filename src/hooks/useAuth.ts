import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api';
import { ApiError } from '@/lib/api/client';
import { useAuthStore } from "@/store/auth-store";
import { useAdminStore } from "@/store/admin-store";
import type { LoginRequest, RegisterRequest } from '@/types/user';

export const authKeys = {
  profile: ['auth', 'profile'] as const
};

export function useProfile() {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: authKeys.profile,
    queryFn: ({ signal }) => authApi.profile(signal),
    enabled: Boolean(token)
  });
}

export function useLogin() {
  const qc = useQueryClient();
  const setTokens = useAuthStore((s) => s.setTokens);
  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      try {
        const tokens = await authApi.login(credentials);
        setTokens(tokens.access_token, tokens.refresh_token);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          throw new ApiError('Incorrect email or password.', 401);
        }
        throw err;
      }
      const profile = await authApi.profile();
      qc.setQueryData(authKeys.profile, profile);
      return profile;
    }
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (input: RegisterRequest) => {
      const { isAvailable } = await authApi.isEmailAvailable(input.email);
      if (!isAvailable) throw new ApiError('An account with this email already exists.', 409);
      return authApi.register(input);
    }
  });
}

export function useLogout() {
  const qc = useQueryClient();
  const clear = useAuthStore((s) => s.clear);
  const disableDevAccess = useAdminStore((s) => s.disableDevAccess);
  return useCallback(() => {
    clear();
    disableDevAccess();
    qc.removeQueries({ queryKey: authKeys.profile });
  }, [clear, disableDevAccess, qc]);
}