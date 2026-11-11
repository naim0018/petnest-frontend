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
        size
        careLevel
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

// ==================== 2. TANSTACK QUERY HOOKS ====================

/**
 * Hook to fetch a single species by UUID or Slug
 */
export function useSpecies(idOrSlug: string) {
  return useQuery({
    queryKey: ["species", idOrSlug],
    queryFn: async () => {
      const data: any = await request(GRAPHQL_ENDPOINT, GET_SPECIES, {
        idOrSlug,
      });
      return data.species;
    },
    enabled: Boolean(idOrSlug), // Only run query if idOrSlug is provided
  });
}

/**
 * Hook to fetch a single breed by UUID or Slug
 */
export function useBreed(idOrSlug: string) {
  return useQuery({
    queryKey: ["breed", idOrSlug],
    queryFn: async () => {
      const data: any = await request(GRAPHQL_ENDPOINT, GET_BREED, {
        idOrSlug,
      });
      return data.breed;
    },
    enabled: Boolean(idOrSlug), // Only run query if idOrSlug is provided
  });
}