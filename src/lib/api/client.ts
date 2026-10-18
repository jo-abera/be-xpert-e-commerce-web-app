import { useAuthStore } from "@/store/auth-store";
import type { AuthTokens } from "@/types/user";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'https://api.escuelajs.co/api/v1';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  auth?: boolean;
  signal?: AbortSignal;
}

async function parseErrorMessage(res: Response): Promise<string> {
  try {
    const data: {message?: string | string[];} = await res.json();
    if (Array.isArray(data.message)) return data.message.join('. ');
    if (typeof data.message === 'string') return data.message;
  } catch {

    // Non-JSON body — fall through to generic message.
  }return `Request failed (${res.status}).`;
}

let refreshPromise: Promise<boolean> | null = null;

async function refreshTokens(): Promise<boolean> {
  const { refreshToken, setTokens, clear } = useAuthStore.getState();
  if (!refreshToken) return false;
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });
        if (!res.ok) {
          clear();
          return false;
        }
        const tokens = (await res.json()) as AuthTokens;
        setTokens(tokens.access_token, tokens.refresh_token);
        return true;
      } catch {
        return false;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}, isRetry = false): Promise<T> {
  const { method = 'GET', body, auth = false, signal } = options;
  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = useAuthStore.getState().accessToken;
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err;
    throw new ApiError('Network error — check your connection and try again.', 0);
  }

  if (res.status === 401 && auth && !isRetry) {
    const refreshed = await refreshTokens();
    if (refreshed) return apiRequest<T>(path, options, true);
    useAuthStore.getState().clear();
    throw new ApiError('Your session has expired. Please log in again.', 401);
  }

  if (!res.ok) throw new ApiError(await parseErrorMessage(res), res.status);
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/** EscuelaJS responds 400 "Could not find any entity" for missing records. */
export function isNotFoundError(error: unknown): boolean {
  if (!(error instanceof ApiError)) return false;
  return error.status === 404 || error.status === 400 && /find|entity|not found/i.test(error.message);
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}