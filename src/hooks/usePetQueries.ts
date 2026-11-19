"use client";

import { useQuery } from "@tanstack/react-query";
import { request, gql } from "graphql-request";

const GRAPHQL_ENDPOINT =
  (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000") + "/graphql";

// ==================== 1. GRAPHQL DOCUMENTS ====================

const GET_SPECIES = gql`
  query GetSpecies($idOrSlug: String!) {
    species(idOrSlug: $idOrSlug) {
      id
      name
      slug
      categoryIcon
      image
      shortDescription
      breeds {
        id
        name
        slug
        image
      }
    }
  }
`;

const GET_BREED = gql`
  query GetBreed($idOrSlug: String!) {
    breed(idOrSlug: $idOrSlug) {
      id
      name
      slug
      originCountry
      size
      careLevel
      temperament
      image
      species {
        id
        name
        slug
        categoryIcon
      }
    }
  }
`;

// Targeted GraphQL query requesting ONLY species id, name, and image for dropdown filters
export const GET_ALL_SPECIES_DROPDOWN = gql`
  query GetAllSpeciesDropdown {
    allSpecies {
      id
      name
      image
    }
  }
`;

// Targeted GraphQL query requesting ONLY breed id, name, and image for dropdown filters
export const GET_BREEDS_BY_SPECIES_DROPDOWN = gql`
  query GetBreedsBySpeciesDropdown($speciesIdOrSlug: String!) {
    breedsBySpecies(speciesIdOrSlug: $speciesIdOrSlug) {
      id
      name
      image
    }
  }
`;

export interface SpeciesDropdownItem {
  id: string;
  name: string;
  image?: string | null;
}

export interface BreedDropdownItem {
  id: string;
  name: string;
  image?: string | null;
}

// ==================== 2. TANSTACK QUERY HOOKS ====================

/**
 * Hook to fetch a single species by UUID or Slug
 */
export function useSpecies(idOrSlug: string) {
  return useQuery({
    queryKey: ["species", idOrSlug],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = await request(GRAPHQL_ENDPOINT, GET_SPECIES, {
        idOrSlug,
      });
      return data.species;
    },
    enabled: Boolean(idOrSlug),
  });
}

/**
 * Hook to fetch a single breed by UUID or Slug
 */
export function useBreed(idOrSlug: string) {
  return useQuery({
    queryKey: ["breed", idOrSlug],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = await request(GRAPHQL_ENDPOINT, GET_BREED, {
        idOrSlug,
      });
      return data.breed;
    },
    enabled: Boolean(idOrSlug),
  });
}

/**
 * Hook to fetch lightweight species list for dropdowns (id, name, image only)
 */
export function useAllSpeciesDropdown() {
  return useQuery<SpeciesDropdownItem[]>({
    queryKey: ["allSpeciesDropdown"],
    queryFn: async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = await request(GRAPHQL_ENDPOINT, GET_ALL_SPECIES_DROPDOWN);
        if (data?.allSpecies && Array.isArray(data.allSpecies)) {
          return data.allSpecies;
        }
      } catch {
        // Fallback to REST endpoint if GraphQL request encounters error
      }

      // REST fallback requesting species list and picking only id, name, image
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"}/pets/species?limit=100`
      );
      const json = await res.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (json?.data?.items || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        image: item.image || item.categoryIcon || null,
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch lightweight breeds by species for dropdowns (id, name, image only)
 */
export function useBreedsBySpeciesDropdown(speciesIdOrSlug: string) {
  return useQuery<BreedDropdownItem[]>({
    queryKey: ["breedsBySpeciesDropdown", speciesIdOrSlug],
    queryFn: async () => {
      if (!speciesIdOrSlug) return [];

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = await request(GRAPHQL_ENDPOINT, GET_BREEDS_BY_SPECIES_DROPDOWN, {
          speciesIdOrSlug,
        });
        if (data?.breedsBySpecies && Array.isArray(data.breedsBySpecies)) {
          return data.breedsBySpecies;
        }
      } catch {
        // Fallback to REST endpoint if GraphQL request encounters error
      }

      // REST fallback requesting breeds and picking only id, name, image
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"}/pets/species/${speciesIdOrSlug}/breeds?limit=100`
      );
      const json = await res.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (json?.data?.items || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        image: item.image || null,
      }));
    },
    enabled: Boolean(speciesIdOrSlug),
    staleTime: 5 * 60 * 1000,
  });
}
