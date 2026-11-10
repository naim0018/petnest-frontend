import { ApiResponse, MessageResponse, PaginatedData, PaginationQuery } from "../common.types";
import { UserRole } from "../Auth/auth.types";

export interface UserProfileDetails {
  id: string;
  userId: string;
  bio?: string | null;
  specialization?: string | null;
  avatar?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  zipCode?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserDetails {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  interestedSpeciesId?: string | null;
  interestedBreedId?: string | null;
  interestedSpecies?: {
    id: string;
    name: string;
    image?: string | null;
  } | null;
  interestedBreed?: {
    id: string;
    name: string;
    image?: string | null;
  } | null;
  profile?: UserProfileDetails | null;
  createdAt: string;
  updatedAt: string;
}

// Backward compatibility with previous user.type.ts
export type UserProfile = UserDetails;

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  phone?: string;
  interestedSpeciesId?: string | null;
  interestedBreedId?: string | null;
  bio?: string | null;
  specialization?: string | null;
  avatar?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  zipCode?: string | null;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface UserQuery extends PaginationQuery {
  role?: UserRole;
}

export interface UpdateRolePayload {
  role: UserRole;
}

export type UserDetailsResponse = ApiResponse<UserDetails>;
export type PaginatedUsersResponse = ApiResponse<PaginatedData<UserDetails>>;
export type ChangePasswordResponse = ApiResponse<MessageResponse>;
export type DeleteUserResponse = ApiResponse<MessageResponse>;

