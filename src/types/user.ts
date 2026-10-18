export type UserRole = 'customer' | 'admin';

/** Public user shape. The API also returns `password` — it is stripped in the service layer and never rendered. */
export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  avatar: string;
  creationAt?: string;
  updatedAt?: string;
}

export interface RawUser extends User {
  password?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  avatar: string;
}

export interface EmailAvailabilityResponse {
  isAvailable: boolean;
}