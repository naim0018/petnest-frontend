import baseApi from "../BaseApi/BaseApi";
import type {
  AdminCategoriesResponse,
  AdminFaqsResponse,
  BookmarkResponse,
  BookmarksResponse,
  BulkCreateFaqPayload,
  BulkFaqsResponse,
  BulkImportZipResponse,
  CreateCategoryPayload,
  CreateFaqPayload,
  CreateGuidePayload,
  DeleteGuideResponse,
  EditorialGuideResponse,
  EditorialStatsResponse,
  GenerateGuideAiPayload,
  GenerateGuideAiResponse,
  GuideDetailResponse,
  GuideQuery,
  GuideSummary,
  LikeResponse,
  PaginatedGuidesResponse,
  PaginatedPublicGuidesResponse,
  PublicCategoriesResponse,
  PublicFaqsResponse,
  ReviewGuidePayload,
  SingleCategoryResponse,
  SingleFaqResponse,
  SliderGuidesResponse,
  UpdateCategoryPayload,
  UpdateFaqPayload,
  UpdateGuidePayload,
} from "./guides.types";

const guidesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ==================== PUBLIC CATEGORIES ====================

    findAllCategoriesPublic: builder.query<
      PublicCategoriesResponse,
      { excludeBasic?: boolean } | void
    >({
      query: (params) => ({
        url: "/guides/categories",
        params: params || {},
      }),
      providesTags: [{ type: "GuideCategories", id: "LIST" }],
    }),

    findOneCategory: builder.query<SingleCategoryResponse, string>({
      query: (idOrSlug) => `/guides/categories/${idOrSlug}`,
      providesTags: (_result, _error, idOrSlug) => [
        { type: "GuideCategories", id: idOrSlug },
      ],
    }),

    // ==================== PUBLIC FAQS ====================

    findAllFaqsPublic: builder.query<
      PublicFaqsResponse,
      { species?: string; guideId?: string } | void
    >({
      query: (params) => ({
        url: "/guides/faqs",
        params: params || {},
      }),
      providesTags: [{ type: "GuideFaqs", id: "LIST" }],
    }),

    // ==================== PUBLIC GUIDES ====================

    getSliderGuides: builder.query<
      SliderGuidesResponse,
      { species?: string; breed?: string; lang?: string } | void
    >({
      query: (params) => ({
        url: "/guides/slider",
        params: params || {},
      }),
      providesTags: [{ type: "Guides", id: "SLIDER" }],
    }),

    findAllPublicGuides: builder.query<
      PaginatedPublicGuidesResponse,
      GuideQuery | void
    >({
      query: (params) => ({
        url: "/guides",
        params: params || {},
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ id }) => ({ type: "Guides" as const, id })),
              { type: "Guides", id: "LIST" },
            ]
          : [{ type: "Guides", id: "LIST" }],
    }),

    findOnePublicGuideBySlug: builder.query<GuideDetailResponse, string>({
      query: (slug) => `/guides/${slug}`,
      providesTags: (result, _error, slug) => [
        { type: "Guides", id: result?.data?.guide?.id || slug },
      ],
    }),

    findRelatedGuides: builder.query<
      { success: boolean; statusCode: number; data: GuideSummary[] },
      { idOrSlug: string; limit?: number }
    >({
      query: ({ idOrSlug, limit = 4 }) => ({
        url: `/guides/${encodeURIComponent(idOrSlug)}/related`,
        params: { limit },
      }),
      providesTags: (_result, _error, { idOrSlug }) => [
        { type: "Guides", id: `RELATED_${idOrSlug}` },
      ],
    }),

    // ==================== USER ENGAGEMENT ====================

    toggleLike: builder.mutation<LikeResponse, string>({
      query: (id) => ({
        url: `/guides/${id}/like`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "Guides", id }],
    }),

    toggleBookmark: builder.mutation<BookmarkResponse, string>({
      query: (id) => ({
        url: `/guides/${id}/bookmark`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Guides", id },
        { type: "Bookmarks", id: "LIST" },
      ],
    }),

    getMyBookmarks: builder.query<
      BookmarksResponse,
      { page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "/guides/me/bookmarks",
        params: params || {},
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ id }) => ({
                type: "Bookmarks" as const,
                id,
              })),
              { type: "Bookmarks", id: "LIST" },
            ]
          : [{ type: "Bookmarks", id: "LIST" }],
    }),

    // ==================== ALL GUIDES & STATS ====================

    getEditorialStats: builder.query<EditorialStatsResponse, void>({
      query: () => "/guides/stats",
      providesTags: ["EditorialStats"],
    }),

    findAllEditorial: builder.query<PaginatedGuidesResponse, GuideQuery | void>({
      query: (params) => ({
        url: "/guides/all",
        params: params || {},
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ id }) => ({
                type: "EditorialGuides" as const,
                id,
              })),
              { type: "EditorialGuides", id: "LIST" },
            ]
          : [{ type: "EditorialGuides", id: "LIST" }],
    }),

    findOneEditorial: builder.query<EditorialGuideResponse, string>({
      query: (id) => `/guides/all/${id}`,
      providesTags: (_result, _error, id) => [{ type: "EditorialGuides", id }],
    }),

    generateGuideAi: builder.mutation<
      GenerateGuideAiResponse,
      GenerateGuideAiPayload
    >({
      query: (payload) => ({
        url: "/guides/generate-ai",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        { type: "Guides", id: "LIST" },
        { type: "EditorialGuides", id: "LIST" },
        "EditorialStats",
      ],
    }),

    createGuide: builder.mutation<EditorialGuideResponse, CreateGuidePayload>({
      query: (payload) => ({
        url: "/guides",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        { type: "Guides", id: "LIST" },
        { type: "EditorialGuides", id: "LIST" },
        "EditorialStats",
      ],
    }),

    bulkImportGuidesZip: builder.mutation<BulkImportZipResponse, FormData>({
      query: (formData) => ({
        url: "/guides/bulk-import-zip",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [
        { type: "Guides", id: "LIST" },
        { type: "EditorialGuides" },
        { type: "EditorialGuides", id: "LIST" },
        "EditorialStats",
      ],
    }),

    updateGuide: builder.mutation<
      EditorialGuideResponse,
      { id: string; payload: UpdateGuidePayload }
    >({
      query: ({ id, payload }) => ({
        url: `/guides/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Guides", id },
        { type: "Guides", id: "LIST" },
        { type: "Guides", id: "BREED_LIST" },
        { type: "Guides", id: "SPECIES_LIST" },
        { type: "EditorialGuides", id },
        { type: "EditorialGuides", id: "LIST" },
        "EditorialStats",
      ],
    }),

    importGuideZip: builder.mutation<
      EditorialGuideResponse,
      { id: string; file: File }
    >({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: `/guides/${id}/import-zip`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Guides", id },
        { type: "Guides", id: "LIST" },
        { type: "Guides", id: "BREED_LIST" },
        { type: "Guides", id: "SPECIES_LIST" },
        { type: "EditorialGuides", id },
        { type: "EditorialGuides", id: "LIST" },
        "EditorialStats",
      ],
    }),

    reviewGuide: builder.mutation<
      PaginatedGuidesResponse,
      { id: string; payload: ReviewGuidePayload }
    >({
      query: ({ id, payload }) => ({
        url: `/guides/${id}/review`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Guides", id },
        { type: "Guides", id: "LIST" },
        { type: "Guides", id: "BREED_LIST" },
        { type: "Guides", id: "SPECIES_LIST" },
        { type: "EditorialGuides", id },
        { type: "EditorialGuides", id: "LIST" },
        "EditorialStats",
      ],
    }),

    deleteGuide: builder.mutation<DeleteGuideResponse, string>({
      query: (id) => ({
        url: `/guides/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Guides", id },
        { type: "Guides", id: "LIST" },
        { type: "EditorialGuides", id },
        { type: "EditorialGuides", id: "LIST" },
        "EditorialStats",
      ],
    }),

    // ==================== ADMIN CATEGORIES ====================

    findAllCategoriesAdmin: builder.query<
      AdminCategoriesResponse,
      { search?: string } | void
    >({
      query: (params) => ({
        url: "/guides/admin/categories",
        params: params || {},
      }),
      providesTags: [{ type: "GuideCategories", id: "LIST" }],
    }),

    createCategory: builder.mutation<SingleCategoryResponse, CreateCategoryPayload>({
      query: (payload) => ({
        url: "/guides/categories",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "GuideCategories", id: "LIST" }],
    }),

    updateCategory: builder.mutation<
      SingleCategoryResponse,
      { id: string; payload: UpdateCategoryPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/guides/categories/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "GuideCategories", id },
        { type: "GuideCategories", id: "LIST" },
      ],
    }),

    removeCategory: builder.mutation<DeleteGuideResponse, string>({
      query: (id) => ({
        url: `/guides/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "GuideCategories", id },
        { type: "GuideCategories", id: "LIST" },
      ],
    }),

    // ==================== ADMIN FAQS ====================

    findAllFaqsAdmin: builder.query<
      AdminFaqsResponse,
      { species?: string; guideId?: string } | void
    >({
      query: (params) => ({
        url: "/guides/admin/faqs",
        params: params || {},
      }),
      providesTags: [{ type: "GuideFaqs", id: "LIST" }],
    }),

    createFaq: builder.mutation<SingleFaqResponse, CreateFaqPayload>({
      query: (payload) => ({
        url: "/guides/faqs",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (_result, _error, payload) => [
        { type: "GuideFaqs", id: "LIST" },
        ...(payload.guideId
          ? [{ type: "EditorialGuides" as const, id: payload.guideId }]
          : []),
        { type: "EditorialGuides", id: "LIST" },
      ],
    }),

    createFaqsBulk: builder.mutation<BulkFaqsResponse, BulkCreateFaqPayload>({
      query: (payload) => ({
        url: "/guides/faqs/bulk",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        { type: "GuideFaqs", id: "LIST" },
        { type: "EditorialGuides", id: "LIST" },
      ],
    }),

    updateFaq: builder.mutation<
      SingleFaqResponse,
      { id: string; payload: UpdateFaqPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/guides/faqs/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id, payload }) => [
        { type: "GuideFaqs", id },
        { type: "GuideFaqs", id: "LIST" },
        ...(payload.guideId
          ? [{ type: "EditorialGuides" as const, id: payload.guideId }]
          : []),
        "EditorialGuides",
      ],
    }),

    removeFaq: builder.mutation<DeleteGuideResponse, string>({
      query: (id) => ({
        url: `/guides/faqs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "GuideFaqs", id },
        { type: "GuideFaqs", id: "LIST" },
        "EditorialGuides",
      ],
    }),

    // ==================== GUIDES BY SPECIES OR BREED ====================

    findGuidesBySpecies: builder.query<
      PaginatedGuidesResponse,
      { speciesIdOrSlug: string; query?: GuideQuery }
    >({
      query: ({ speciesIdOrSlug, query }) => ({
        url: `/guides/species/${speciesIdOrSlug}`,
        params: query || {},
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ id }) => ({
                type: "Guides" as const,
                id,
              })),
              { type: "Guides", id: "SPECIES_LIST" },
            ]
          : [{ type: "Guides", id: "SPECIES_LIST" }],
    }),

    findGuidesByBreed: builder.query<
      PaginatedGuidesResponse,
      { breedIdOrSlug: string; query?: GuideQuery }
    >({
      query: ({ breedIdOrSlug, query }) => ({
        url: `/guides/breed/${breedIdOrSlug}`,
        params: query || {},
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ id }) => ({
                type: "Guides" as const,
                id,
              })),
              { type: "Guides", id: "BREED_LIST" },
            ]
          : [{ type: "Guides", id: "BREED_LIST" }],
    }),
  }),
});

export const {
  // Public
  useFindAllCategoriesPublicQuery,
  useFindOneCategoryQuery,
  useFindAllFaqsPublicQuery,
  useGetSliderGuidesQuery,
  useFindAllPublicGuidesQuery,
  useFindOnePublicGuideBySlugQuery,
  useFindRelatedGuidesQuery,
  useFindGuidesBySpeciesQuery,
  useFindGuidesByBreedQuery,
  // User Engagement
  useToggleLikeMutation,
  useToggleBookmarkMutation,
  useGetMyBookmarksQuery,
  // Editorial
  useGetEditorialStatsQuery,
  useFindAllEditorialQuery,
  useFindOneEditorialQuery,
  useGenerateGuideAiMutation,
  useCreateGuideMutation,
  useBulkImportGuidesZipMutation,
  useUpdateGuideMutation,
  useImportGuideZipMutation,
  useReviewGuideMutation,
  useDeleteGuideMutation,
  // Admin Categories
  useFindAllCategoriesAdminQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useRemoveCategoryMutation,
  // Admin FAQs
  useFindAllFaqsAdminQuery,
  useCreateFaqMutation,
  useCreateFaqsBulkMutation,
  useUpdateFaqMutation,
  useRemoveFaqMutation,
} = guidesApi;

export async function downloadGuideZip(
  guideId: string,
  slug?: string,
): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
  const res = await fetch(`${baseUrl}/guides/${guideId}/export-zip`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(`Failed to download guide ZIP (status: ${res.status})`);
  }
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slug || guideId}.zip`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export default guidesApi;

