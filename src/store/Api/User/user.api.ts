import baseApi from "../BaseApi/BaseApi";
import type {
  ChangePasswordPayload,
  ChangePasswordResponse,
  DeleteUserResponse,
  PaginatedUsersResponse,
  UpdateProfilePayload,
  UpdateRolePayload,
  UserDetailsResponse,
  UserQuery,
} from "./user.types";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<UserDetailsResponse, void>({
      query: () => "/users/me",
      providesTags: ["Me"],
    }),

    updateMe: builder.mutation<UserDetailsResponse, UpdateProfilePayload>({
      query: (payload) => ({
        url: "/users/me",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Me", { type: "Users", id: "LIST" }],
    }),

    changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordPayload>({
      query: (payload) => ({
        url: "/users/change-password",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Me"],
    }),

    getUsers: builder.query<PaginatedUsersResponse, UserQuery | void>({
      query: (params) => ({
        url: "/users",
        params: params || {},
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ id }) => ({ type: "Users" as const, id })),
              { type: "Users", id: "LIST" },
            ]
          : [{ type: "Users", id: "LIST" }],
    }),

    getUserById: builder.query<UserDetailsResponse, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Users", id }],
    }),

    updateUserRole: builder.mutation<
      UserDetailsResponse,
      { id: string; role: UpdateRolePayload["role"] }
    >({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
        "Me",
      ],
    }),

    deleteUser: builder.mutation<DeleteUserResponse, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),

    // Backward compatibility aliases
    getUserProfile: builder.query<UserDetailsResponse, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Users", id }],
    }),

    updateUserProfile: builder.mutation<
      UserDetailsResponse,
      { id: string; payload: UpdateProfilePayload }
    >({
      query: ({ payload }) => ({
        url: "/users/me",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Me", { type: "Users", id: "LIST" }],
    }),
  }),
});

export const {
  useGetMeQuery,
  useUpdateMeMutation,
  useChangePasswordMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} = userApi;

export default userApi;
