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
  overrideExisting: true,
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
      providesTags: (result, _error, idOrSlug) => [
        { type: "Species", id: idOrSlug },
        ...(result?.data?.id ? [{ type: "Species" as const, id: result.data.id }] : []),
        ...(result?.data?.slug ? [{ type: "Species" as const, id: result.data.slug }] : []),
        { type: "Species", id: "DETAIL" },
      ],
    }),

    createSpecies: builder.mutation<SpeciesResponse, CreateSpeciesPayload>({
      query: (payload) => ({
        url: "/pets/species",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        { type: "Species", id: "LIST" },
        { type: "Species" },
      ],
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
      invalidatesTags: (result, _error, { id }) => [
        { type: "Species", id },
        ...(result?.data?.slug ? [{ type: "Species" as const, id: result.data.slug }] : []),
        { type: "Species", id: "LIST" },
        { type: "Species", id: "DETAIL" },
        { type: "Species" },
      ],
    }),

    removeSpecies: builder.mutation<
      DeletePetResponse,
      string | { id: string; force?: boolean }
    >({
      query: (arg) => {
        const id = typeof arg === "string" ? arg : arg.id;
        const force = typeof arg === "object" ? arg.force : false;
        return {
          url: `/pets/species/${id}${force ? "?force=true" : ""}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (_result, _error, arg) => {
        const id = typeof arg === "string" ? arg : arg.id;
        return [
          { type: "Species", id },
          { type: "Species", id: "LIST" },
          { type: "Species", id: "DETAIL" },
          { type: "Species" },
          { type: "Breeds", id: "LIST" },
          { type: "Breeds" },
        ];
      },
    }),

    // ==================== BREEDS ====================

    findBreedsBySpecies: builder.query<
      PaginatedBreedsResponse,
      { speciesIdOrSlug: string; query?: BreedQuery | void }
    >({
      query: ({ speciesIdOrSlug, query }) => ({
        url: `/pets/species/${speciesIdOrSlug}/breeds`,
        params: query || {},
      }),
      providesTags: (result, _error, { speciesIdOrSlug }) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ id }) => ({ type: "Breeds" as const, id })),
              { type: "Breeds", id: `SPECIES_${speciesIdOrSlug}` },
              { type: "Breeds", id: "LIST" },
            ]
          : [
              { type: "Breeds", id: `SPECIES_${speciesIdOrSlug}` },
              { type: "Breeds", id: "LIST" },
            ],
    }),

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
      providesTags: (result, _error, idOrSlug) => [
        { type: "Breeds", id: idOrSlug },
        ...(result?.data?.id ? [{ type: "Breeds" as const, id: result.data.id }] : []),
        ...(result?.data?.slug ? [{ type: "Breeds" as const, id: result.data.slug }] : []),
      ],
    }),

    createBreed: builder.mutation<BreedResponse, CreateBreedPayload>({
      query: (payload) => ({
        url: "/pets/breeds",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (result, _error, payload) => [
        { type: "Breeds", id: "LIST" },
        { type: "Species", id: "LIST" },
        { type: "Species", id: "DETAIL" },
        ...(payload?.speciesId ? [{ type: "Species" as const, id: payload.speciesId }] : []),
        ...(result?.data?.speciesId ? [{ type: "Species" as const, id: result.data.speciesId }] : []),
        ...(result?.data?.species?.id ? [{ type: "Species" as const, id: result.data.species.id }] : []),
        ...(result?.data?.species?.slug ? [{ type: "Species" as const, id: result.data.species.slug }] : []),
        { type: "Species" },
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
      invalidatesTags: (result, _error, { id, payload }) => [
        { type: "Breeds", id },
        { type: "Breeds", id: "LIST" },
        { type: "Species", id: "LIST" },
        { type: "Species", id: "DETAIL" },
        ...(payload?.speciesId ? [{ type: "Species" as const, id: payload.speciesId }] : []),
        ...(result?.data?.speciesId ? [{ type: "Species" as const, id: result.data.speciesId }] : []),
        ...(result?.data?.species?.id ? [{ type: "Species" as const, id: result.data.species.id }] : []),
        ...(result?.data?.species?.slug ? [{ type: "Species" as const, id: result.data.species.slug }] : []),
        { type: "Species" },
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
        { type: "Species", id: "DETAIL" },
        { type: "Species" },
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
  useFindBreedsBySpeciesQuery,
  useFindAllBreedsQuery,
  useFindOneBreedQuery,
  useCreateBreedMutation,
  useUpdateBreedMutation,
  useRemoveBreedMutation,
} = petsApi;

export default petsApi;

