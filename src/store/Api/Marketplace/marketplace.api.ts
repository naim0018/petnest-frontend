import baseApi from '../BaseApi/BaseApi';
import type {
  CreateAccessoryPayload,
  CreateBookPayload,
  CreateLivePetPayload,
  CreateMedicinePayload,
  CreatePetFoodPayload,
  LivePetListing,
  MarketplaceOverviewResponse,
  PaginatedMarketplaceResponse,
  PetAccessoryListing,
  PetBookListing,
  PetFoodListing,
  PetMedicineListing,
  UpdateAccessoryPayload,
  UpdateBookPayload,
  UpdateLivePetPayload,
  UpdateMedicinePayload,
  UpdatePetFoodPayload,
  UpdateStatusPayload,
} from './marketplace.types';

const marketplaceApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // ==================== OVERVIEW & QUICK STATUS ====================

    getMarketplaceOverview: builder.query<MarketplaceOverviewResponse, void>({
      query: () => '/marketplace/admin/overview',
      providesTags: [{ type: 'Marketplace', id: 'OVERVIEW' }],
    }),

    updateListingStatus: builder.mutation<{ success: boolean }, UpdateStatusPayload>({
      query: ({ type, id, status }) => ({
        url: `/marketplace/${type}/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: [
        { type: 'Marketplace', id: 'LIST' },
        { type: 'Marketplace', id: 'OVERVIEW' },
      ],
    }),

    // ==================== 1. LIVE PETS ====================

    getLivePets: builder.query<PaginatedMarketplaceResponse<LivePetListing>, Record<string, any> | void>({
      query: (params) => ({
        url: '/marketplace/pets',
        params: params || {},
      }),
      providesTags: [{ type: 'Marketplace', id: 'PETS_LIST' }],
    }),

    getLivePetById: builder.query<LivePetListing, string>({
      query: (id) => `/marketplace/pets/${id}`,
      providesTags: (_res, _err, id) => [{ type: 'Marketplace', id: `PET_${id}` }],
    }),

    createLivePet: builder.mutation<LivePetListing, CreateLivePetPayload>({
      query: (body) => ({
        url: '/marketplace/pets',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Marketplace', id: 'PETS_LIST' },
        { type: 'Marketplace', id: 'OVERVIEW' },
      ],
    }),

    updateLivePet: builder.mutation<LivePetListing, UpdateLivePetPayload>({
      query: ({ id, ...body }) => ({
        url: `/marketplace/pets/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: 'Marketplace', id: `PET_${id}` },
        { type: 'Marketplace', id: 'PETS_LIST' },
      ],
    }),

    deleteLivePet: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/marketplace/pets/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Marketplace', id: 'PETS_LIST' }],
    }),

    // ==================== 2. PET FOOD ====================

    getPetFoods: builder.query<PaginatedMarketplaceResponse<PetFoodListing>, Record<string, any> | void>({
      query: (params) => ({
        url: '/marketplace/food',
        params: params || {},
      }),
      providesTags: [{ type: 'Marketplace', id: 'FOOD_LIST' }],
    }),

    getPetFoodById: builder.query<PetFoodListing, string>({
      query: (id) => `/marketplace/food/${id}`,
      providesTags: (_res, _err, id) => [{ type: 'Marketplace', id: `FOOD_${id}` }],
    }),

    createPetFood: builder.mutation<PetFoodListing, CreatePetFoodPayload>({
      query: (body) => ({
        url: '/marketplace/food',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Marketplace', id: 'FOOD_LIST' },
        { type: 'Marketplace', id: 'OVERVIEW' },
      ],
    }),

    updatePetFood: builder.mutation<PetFoodListing, UpdatePetFoodPayload>({
      query: ({ id, ...body }) => ({
        url: `/marketplace/food/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: 'Marketplace', id: `FOOD_${id}` },
        { type: 'Marketplace', id: 'FOOD_LIST' },
      ],
    }),

    deletePetFood: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/marketplace/food/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Marketplace', id: 'FOOD_LIST' }],
    }),

    // ==================== 3. ACCESSORIES ====================

    getAccessories: builder.query<PaginatedMarketplaceResponse<PetAccessoryListing>, Record<string, any> | void>({
      query: (params) => ({
        url: '/marketplace/accessories',
        params: params || {},
      }),
      providesTags: [{ type: 'Marketplace', id: 'ACCESSORY_LIST' }],
    }),

    getAccessoryById: builder.query<PetAccessoryListing, string>({
      query: (id) => `/marketplace/accessories/${id}`,
      providesTags: (_res, _err, id) => [{ type: 'Marketplace', id: `ACCESSORY_${id}` }],
    }),

    createAccessory: builder.mutation<PetAccessoryListing, CreateAccessoryPayload>({
      query: (body) => ({
        url: '/marketplace/accessories',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Marketplace', id: 'ACCESSORY_LIST' },
        { type: 'Marketplace', id: 'OVERVIEW' },
      ],
    }),

    updateAccessory: builder.mutation<PetAccessoryListing, UpdateAccessoryPayload>({
      query: ({ id, ...body }) => ({
        url: `/marketplace/accessories/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: 'Marketplace', id: `ACCESSORY_${id}` },
        { type: 'Marketplace', id: 'ACCESSORY_LIST' },
      ],
    }),

    deleteAccessory: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/marketplace/accessories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Marketplace', id: 'ACCESSORY_LIST' }],
    }),

    // ==================== 4. BOOKS ====================

    getBooks: builder.query<PaginatedMarketplaceResponse<PetBookListing>, Record<string, any> | void>({
      query: (params) => ({
        url: '/marketplace/books',
        params: params || {},
      }),
      providesTags: [{ type: 'Marketplace', id: 'BOOK_LIST' }],
    }),

    getBookById: builder.query<PetBookListing, string>({
      query: (id) => `/marketplace/books/${id}`,
      providesTags: (_res, _err, id) => [{ type: 'Marketplace', id: `BOOK_${id}` }],
    }),

    createBook: builder.mutation<PetBookListing, CreateBookPayload>({
      query: (body) => ({
        url: '/marketplace/books',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Marketplace', id: 'BOOK_LIST' },
        { type: 'Marketplace', id: 'OVERVIEW' },
      ],
    }),

    updateBook: builder.mutation<PetBookListing, UpdateBookPayload>({
      query: ({ id, ...body }) => ({
        url: `/marketplace/books/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: 'Marketplace', id: `BOOK_${id}` },
        { type: 'Marketplace', id: 'BOOK_LIST' },
      ],
    }),

    deleteBook: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/marketplace/books/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Marketplace', id: 'BOOK_LIST' }],
    }),

    // ==================== 5. MEDICINE ====================

    getMedicines: builder.query<PaginatedMarketplaceResponse<PetMedicineListing>, Record<string, any> | void>({
      query: (params) => ({
        url: '/marketplace/medicine',
        params: params || {},
      }),
      providesTags: [{ type: 'Marketplace', id: 'MEDICINE_LIST' }],
    }),

    getMedicineById: builder.query<PetMedicineListing, string>({
      query: (id) => `/marketplace/medicine/${id}`,
      providesTags: (_res, _err, id) => [{ type: 'Marketplace', id: `MEDICINE_${id}` }],
    }),

    createMedicine: builder.mutation<PetMedicineListing, CreateMedicinePayload>({
      query: (body) => ({
        url: '/marketplace/medicine',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Marketplace', id: 'MEDICINE_LIST' },
        { type: 'Marketplace', id: 'OVERVIEW' },
      ],
    }),

    updateMedicine: builder.mutation<PetMedicineListing, UpdateMedicinePayload>({
      query: ({ id, ...body }) => ({
        url: `/marketplace/medicine/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: 'Marketplace', id: `MEDICINE_${id}` },
        { type: 'Marketplace', id: 'MEDICINE_LIST' },
      ],
    }),

    deleteMedicine: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/marketplace/medicine/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Marketplace', id: 'MEDICINE_LIST' }],
    }),
  }),
});

export const {
  useGetMarketplaceOverviewQuery,
  useUpdateListingStatusMutation,

  // Live Pets
  useGetLivePetsQuery,
  useGetLivePetByIdQuery,
  useCreateLivePetMutation,
  useUpdateLivePetMutation,
  useDeleteLivePetMutation,

  // Pet Food
  useGetPetFoodsQuery,
  useGetPetFoodByIdQuery,
  useCreatePetFoodMutation,
  useUpdatePetFoodMutation,
  useDeletePetFoodMutation,

  // Accessories
  useGetAccessoriesQuery,
  useGetAccessoryByIdQuery,
  useCreateAccessoryMutation,
  useUpdateAccessoryMutation,
  useDeleteAccessoryMutation,

  // Books
  useGetBooksQuery,
  useGetBookByIdQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,

  // Medicine
  useGetMedicinesQuery,
  useGetMedicineByIdQuery,
  useCreateMedicineMutation,
  useUpdateMedicineMutation,
  useDeleteMedicineMutation,
} = marketplaceApi;

export default marketplaceApi;
