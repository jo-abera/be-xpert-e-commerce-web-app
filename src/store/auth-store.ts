import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Tokens are persisted in localStorage so sessions survive refresh.
 * Note: a frontend-only app cannot offer the protection of httpOnly, backend-managed sessions.
 */
interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      clear: () => set({ accessToken: null, refreshToken: null }),
    }),
    { name: "nexus-auth" },
  ),
);
