import baseApi from '../BaseApi/BaseApi';
import type {
  GeminiConfigResponse,
  GoogleOAuthConfigResponse,
  OAuthStatusResponse,
  TestGeminiKeyPayload,
  TestGeminiKeyResponse,
  UpdateGeminiKeyPayload,
  UpdateGoogleOAuthPayload,
} from './settings.types';

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGeminiConfig: builder.query<GeminiConfigResponse, void>({
      query: () => '/settings/gemini',
      providesTags: ['Settings'],
    }),
    updateGeminiKey: builder.mutation<
      GeminiConfigResponse,
      UpdateGeminiKeyPayload
    >({
      query: (body) => ({
        url: '/settings/gemini',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Settings'],
    }),
    removeGeminiKey: builder.mutation<GeminiConfigResponse, void>({
      query: () => ({
        url: '/settings/gemini',
        method: 'DELETE',
      }),
      invalidatesTags: ['Settings'],
    }),
    testGeminiKey: builder.mutation<
      TestGeminiKeyResponse,
      TestGeminiKeyPayload | void
    >({
      query: (body) => ({
        url: '/settings/gemini/test',
        method: 'POST',
        body: body || {},
      }),
    }),
    getGoogleOAuthConfig: builder.query<GoogleOAuthConfigResponse, void>({
      query: () => '/settings/google-oauth',
      providesTags: ['Settings'],
    }),
    updateGoogleOAuthConfig: builder.mutation<
      GoogleOAuthConfigResponse,
      UpdateGoogleOAuthPayload
    >({
      query: (body) => ({
        url: '/settings/google-oauth',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Settings'],
    }),
    removeGoogleOAuthConfig: builder.mutation<GoogleOAuthConfigResponse, void>({
      query: () => ({
        url: '/settings/google-oauth',
        method: 'DELETE',
      }),
      invalidatesTags: ['Settings'],
    }),
    getPublicOAuthStatus: builder.query<OAuthStatusResponse, void>({
      query: () => '/auth/oauth/status',
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetGeminiConfigQuery,
  useUpdateGeminiKeyMutation,
  useRemoveGeminiKeyMutation,
  useTestGeminiKeyMutation,
  useGetGoogleOAuthConfigQuery,
  useUpdateGoogleOAuthConfigMutation,
  useRemoveGoogleOAuthConfigMutation,
  useGetPublicOAuthStatusQuery,
} = settingsApi;
