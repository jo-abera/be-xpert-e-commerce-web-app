import type { RawUser } from "@/types/user";

import { apiRequest } from "./client";
import { sanitizeUser } from "./sanitize";

export const usersApi = {
  list: (signal?: AbortSignal) =>
    apiRequest<RawUser[]>("/users", { signal }).then((list) =>
      Array.isArray(list) ? list.map(sanitizeUser) : [],
    ),
  get: (id: number, signal?: AbortSignal) =>
    apiRequest<RawUser>(`/users/${id}`, { signal }).then(sanitizeUser),
  delete: (id: number) =>
    apiRequest<void>(`/users/${id}`, { method: "DELETE", auth: true }),
};
