import baseApi from "../BaseApi/BaseApi";
import type {
  CleanupOrphansResponse,
  DeleteMediaResponse,
  UploadMediaResponse,
} from "./media.types";

const mediaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadMedia: builder.mutation<UploadMediaResponse, FormData>({
      query: (formData) => ({
        url: "/media/upload",
        method: "POST",
        body: formData,
        // Fetch/browser handles Content-Type boundary automatically for FormData
      }),
      invalidatesTags: [{ type: "Media", id: "LIST" }],
    }),

    deleteMedia: builder.mutation<DeleteMediaResponse, string>({
      query: (id) => ({
        url: `/media/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Media", id },
        { type: "Media", id: "LIST" },
      ],
    }),

    cleanupOrphans: builder.mutation<CleanupOrphansResponse, void>({
      query: () => ({
        url: "/media/cleanup-orphans",
        method: "POST",
      }),
      invalidatesTags: [{ type: "Media", id: "LIST" }],
    }),
  }),
});

export const {
  useUploadMediaMutation,
  useDeleteMediaMutation,
  useCleanupOrphansMutation,
} = mediaApi;

export default mediaApi;

