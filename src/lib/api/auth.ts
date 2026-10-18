import type {
  AuthTokens,
  EmailAvailabilityResponse,
  LoginRequest,
  RawUser,
  RegisterRequest,
} from "@/types/user";

import { apiRequest } from "./client";
import { sanitizeUser } from "./sanitize";

export const authApi = {
  login: (body: LoginRequest) =>
    apiRequest<AuthTokens>("/auth/login", { method: "POST", body }),
  profile: (signal?: AbortSignal) =>
    apiRequest<RawUser>("/auth/profile", { auth: true, signal }).then(
      sanitizeUser,
    ),
  register: (body: RegisterRequest) =>
    apiRequest<RawUser>("/users", { method: "POST", body }).then(sanitizeUser),
  isEmailAvailable: (email: string) =>
    apiRequest<EmailAvailabilityResponse>("/users/is-available", {
      method: "POST",
      body: { email },
    }),
};
