import baseApi from "../BaseApi/BaseApi";
import type {
  AdminCategoriesResponse,
  AdminFaqsResponse,
  BookmarkResponse,
  BookmarksResponse,
  CreateCategoryPayload,
  CreateFaqPayload,
  CreateGuidePayload,
  DeleteGuideResponse,
  EditorialGuideResponse,
  EditorialStatsResponse,
  GuideDetailResponse,
  GuideQuery,
  LikeResponse,
  PaginatedGuidesResponse,
  PublicCategoriesResponse,
  PublicFaqsResponse,
  ReviewGuidePayload,
  SingleCategoryResponse,
  SingleFaqResponse,
  UpdateCategoryPayload,
  UpdateFaqPayload,
  UpdateGuidePayload,
} from "./guides.types";

const guidesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ==================== PUBLIC CATEGORIES ====================

    findAllCategoriesPublic: builder.query<PublicCategoriesResponse, void>({
      query: () => "/guides/categories",
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

    findAllPublicGuides: builder.query<PaginatedGuidesResponse, GuideQuery | void>({
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

    // ==================== EDITORIAL HUB & REVIEW QUEUE ====================

    getEditorialStats: builder.query<EditorialStatsResponse, void>({
      query: () => "/guides/editorial/stats",
      providesTags: ["EditorialStats"],
    }),

    findAllEditorial: builder.query<PaginatedGuidesResponse, GuideQuery | void>({
      query: (params) => ({
        url: "/guides/editorial",
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
      query: (id) => `/guides/editorial/${id}`,
      providesTags: (_result, _error, id) => [{ type: "EditorialGuides", id }],
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
        { type: "EditorialGuides", id },
        { type: "EditorialGuides", id: "LIST" },
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
      invalidatesTags: [{ type: "GuideFaqs", id: "LIST" }],
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
      invalidatesTags: (_result, _error, { id }) => [
        { type: "GuideFaqs", id },
        { type: "GuideFaqs", id: "LIST" },
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
      ],
    }),
  }),
});

export const {
  // Public
  useFindAllCategoriesPublicQuery,
  useFindOneCategoryQuery,
  useFindAllFaqsPublicQuery,
  useFindAllPublicGuidesQuery,
  useFindOnePublicGuideBySlugQuery,
  // User Engagement
  useToggleLikeMutation,
  useToggleBookmarkMutation,
  useGetMyBookmarksQuery,
  // Editorial
  useGetEditorialStatsQuery,
  useFindAllEditorialQuery,
  useFindOneEditorialQuery,
  useCreateGuideMutation,
  useUpdateGuideMutation,
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
  useUpdateFaqMutation,
  useRemoveFaqMutation,
} = guidesApi;

export default guidesApi;

