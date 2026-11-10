import baseApi from "../BaseApi/BaseApi";
import type {
  AuthResponse,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  LoginPayload,
  LogoutResponse,
  RefreshTokenResponse,
  RegisterPayload,
  RegisterResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
  SignupPayload,
} from "./auth.types";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginPayload>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Me", "Guides", "Bookmarks"],
    }),

    register: builder.mutation<RegisterResponse, RegisterPayload>({
      query: (payload) => ({
        url: "/auth/register",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Me", "Guides", "Bookmarks"],
    }),

    // Compatibility alias for signup
    signup: builder.mutation<RegisterResponse, SignupPayload>({
      query: (payload) => ({
        url: "/auth/register",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Me", "Guides", "Bookmarks"],
    }),

    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Me", "Guides", "Bookmarks"],
    }),

    refreshToken: builder.mutation<RefreshTokenResponse, void>({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
      }),
      invalidatesTags: ["Me"],
    }),

    forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordPayload>({
      query: (payload) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: payload,
      }),
    }),

    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordPayload>({
      query: (payload) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useSignupMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;

export default authApi;
