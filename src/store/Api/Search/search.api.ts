import baseApi from "../BaseApi/BaseApi";
import type { UniversalSearchResponse } from "./search.types";

export const searchApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    universalSearch: builder.query<
      UniversalSearchResponse,
      { q: string; limit?: number }
    >({
      query: ({ q, limit = 5 }) => ({
        url: "/search",
        params: { q, limit },
      }),
    }),
  }),
});

export const { useUniversalSearchQuery, useLazyUniversalSearchQuery } = searchApi;
