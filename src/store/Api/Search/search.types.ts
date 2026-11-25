export interface SearchGuideItem {
  id: string;
  title: string;
  slug: string;
  coverImage?: string | null;
  readTimeMinutes?: number;
  category?: { name: string; slug: string } | null;
  species?: { name: string; slug: string } | null;
}

export interface SearchBreedItem {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  species: { name: string; slug: string };
}

export interface SearchSpeciesItem {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  categoryIcon?: string | null;
}

export interface SearchAuthorItem {
  id: string;
  name: string;
  role: string;
  avatar?: string | null;
}

export interface UniversalSearchData {
  guides: SearchGuideItem[];
  breeds: SearchBreedItem[];
  species: SearchSpeciesItem[];
  authors: SearchAuthorItem[];
  totalMatches: number;
}

export interface UniversalSearchResponse {
  success: boolean;
  message?: string;
  data: UniversalSearchData;
}
