import { ApiResponse, MessageResponse, PaginatedData, PaginationQuery } from "../common.types";

export type PetSize = "SMALL" | "MEDIUM" | "LARGE" | "GIANT";
export type CareLevel = "LOW" | "MODERATE" | "HIGH";

export interface PetBreedSummary {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  shortDescription?: string | null;
  originCountry?: string | null;
  size?: PetSize | null;
  careLevel?: CareLevel | null;
  temperament?: string | null;
  tags?: string[];
  speciesId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PetSpecies {
  id: string;
  name: string;
  slug: string;
  scientificGroup?: string | null;
  shortDescription?: string | null;
  image?: string | null;
  categoryIcon?: string | null;
  breeds?: PetBreedSummary[];
  _count?: {
    breeds: number;
    guides?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PetBreed extends PetBreedSummary {
  species?: PetSpecies;
}

export interface SpeciesQuery extends PaginationQuery {}

export interface BreedQuery extends PaginationQuery {
  speciesId?: string;
}

export interface CreateSpeciesPayload {
  name: string;
  slug?: string;
  scientificGroup?: string;
  image?: string;
  categoryIcon?: string;
  shortDescription?: string;
}

export interface UpdateSpeciesPayload extends Partial<CreateSpeciesPayload> {}

export interface CreateBreedPayload {
  name: string;
  speciesId: string;
  slug?: string;
  image?: string;
  shortDescription?: string;
  tags?: string[];
  originCountry?: string;
  size?: PetSize;
  careLevel?: CareLevel;
  temperament?: string;
}

export interface UpdateBreedPayload extends Partial<Omit<CreateBreedPayload, "speciesId">> {
  speciesId?: string;
}

export type PaginatedSpeciesResponse = ApiResponse<PaginatedData<PetSpecies>>;
export type SpeciesResponse = ApiResponse<PetSpecies>;
export type PaginatedBreedsResponse = ApiResponse<PaginatedData<PetBreed>>;
export type BreedResponse = ApiResponse<PetBreed>;
export type DeletePetResponse = ApiResponse<MessageResponse>;

