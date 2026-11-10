import baseApi from "../BaseApi/BaseApi";
import type {
  BreedQuery,
  BreedResponse,
  CreateBreedPayload,
  CreateSpeciesPayload,
  DeletePetResponse,
  PaginatedBreedsResponse,
  PaginatedSpeciesResponse,
  SpeciesQuery,
  SpeciesResponse,
  UpdateBreedPayload,
  UpdateSpeciesPayload,
} from "./pets.types";

const petsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ==================== SPECIES ====================

    findAllSpecies: builder.query<PaginatedSpeciesResponse, SpeciesQuery | void>({
      query: (params) => ({
        url: "/pets/species",
        params: params || {},
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ id }) => ({ type: "Species" as const, id })),
              { type: "Species", id: "LIST" },
            ]
          : [{ type: "Species", id: "LIST" }],
    }),

    findOneSpecies: builder.query<SpeciesResponse, string>({
      query: (idOrSlug) => `/pets/species/${idOrSlug}`,
      providesTags: (_result, _error, idOrSlug) => [{ type: "Species", id: idOrSlug }],
    }),

    createSpecies: builder.mutation<SpeciesResponse, CreateSpeciesPayload>({
      query: (payload) => ({
        url: "/pets/species",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Species", id: "LIST" }],
    }),

    updateSpecies: builder.mutation<
      SpeciesResponse,
      { id: string; payload: UpdateSpeciesPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/pets/species/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Species", id },
        { type: "Species", id: "LIST" },
      ],
    }),

    removeSpecies: builder.mutation<DeletePetResponse, string>({
      query: (id) => ({
        url: `/pets/species/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Species", id },
        { type: "Species", id: "LIST" },
      ],
    }),

    // ==================== BREEDS ====================

    findAllBreeds: builder.query<PaginatedBreedsResponse, BreedQuery | void>({
      query: (params) => ({
        url: "/pets/breeds",
        params: params || {},
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ id }) => ({ type: "Breeds" as const, id })),
              { type: "Breeds", id: "LIST" },
            ]
          : [{ type: "Breeds", id: "LIST" }],
    }),

    findOneBreed: builder.query<BreedResponse, string>({
      query: (idOrSlug) => `/pets/breeds/${idOrSlug}`,
      providesTags: (_result, _error, idOrSlug) => [{ type: "Breeds", id: idOrSlug }],
    }),

    createBreed: builder.mutation<BreedResponse, CreateBreedPayload>({
      query: (payload) => ({
        url: "/pets/breeds",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        { type: "Breeds", id: "LIST" },
        { type: "Species", id: "LIST" },
      ],
    }),

    updateBreed: builder.mutation<
      BreedResponse,
      { id: string; payload: UpdateBreedPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/pets/breeds/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Breeds", id },
        { type: "Breeds", id: "LIST" },
        { type: "Species", id: "LIST" },
      ],
    }),

    removeBreed: builder.mutation<DeletePetResponse, string>({
      query: (id) => ({
        url: `/pets/breeds/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Breeds", id },
        { type: "Breeds", id: "LIST" },
        { type: "Species", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useFindAllSpeciesQuery,
  useFindOneSpeciesQuery,
  useCreateSpeciesMutation,
  useUpdateSpeciesMutation,
  useRemoveSpeciesMutation,
  useFindAllBreedsQuery,
  useFindOneBreedQuery,
  useCreateBreedMutation,
  useUpdateBreedMutation,
  useRemoveBreedMutation,
} = petsApi;

export default petsApi;

