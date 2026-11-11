import { ApiResponse, MessageResponse } from "../common.types";

export type UserRole = "USER" | "AUTHOR" | "VET" | "ADMIN" | "SUPERADMIN";

export interface UserProfileSummary {
  id: string;
  userId: string;
  bio?: string | null;
  specialization?: string | null;
  avatar?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  zipCode?: string | null;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  isEmailVerified?: boolean;
  profile?: UserProfileSummary | null;
  interestedSpecies?: { id: string; name: string; image?: string | null } | null;
  interestedBreed?: { id: string; name: string; image?: string | null } | null;
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  interestedSpecies?: string;
  interestedBreed?: string;
}

export type SignupPayload = RegisterPayload;

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword?: string;
  password?: string;
}

export interface RegisterResponseData {
  message: string;
  user: AuthUser;
}

export type AuthResponse = ApiResponse<AuthUser>;
export type RegisterResponse = ApiResponse<RegisterResponseData>;
export type LogoutResponse = ApiResponse<MessageResponse>;
export type RefreshTokenResponse = ApiResponse<MessageResponse>;
export type ForgotPasswordResponse = ApiResponse<MessageResponse>;
export type ResetPasswordResponse = ApiResponse<MessageResponse>;

