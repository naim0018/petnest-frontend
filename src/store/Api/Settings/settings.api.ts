import baseApi from '../BaseApi/BaseApi';
import type {
  GeminiConfigResponse,
  TestGeminiKeyPayload,
  TestGeminiKeyResponse,
  UpdateGeminiKeyPayload,
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
  }),
  overrideExisting: false,
});

export const {
  useGetGeminiConfigQuery,
  useUpdateGeminiKeyMutation,
  useRemoveGeminiKeyMutation,
  useTestGeminiKeyMutation,
} = settingsApi;
