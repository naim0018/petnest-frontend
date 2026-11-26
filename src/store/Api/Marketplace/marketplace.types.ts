export type ListingStatus = 'DRAFT' | 'ACTIVE' | 'SOLD_OUT' | 'ARCHIVED';

export type PetGender = 'MALE' | 'FEMALE' | 'PROVEN_PAIR' | 'UNSEXED';
export type HealthVerificationStatus =
  | 'HEALTHY_UNVERIFIED'
  | 'VACCINATED'
  | 'DEWORMED'
  | 'VET_CERTIFIED';
export type LiveDeliveryMethod = 'LOCAL_PICKUP' | 'BREEDER_SPECIAL_TRANSIT';

export type FoodType =
  | 'SEED_MIX'
  | 'PELLETS'
  | 'DRY_KIBBLE'
  | 'WET_CANNED'
  | 'TREATS'
  | 'SUPPLEMENT';
export type WeightUnit = 'G' | 'KG' | 'LB' | 'OZ';
export type FoodLifeStage =
  | 'BABY_HANDFEEDING'
  | 'JUNIOR'
  | 'ADULT'
  | 'BREEDING'
  | 'SENIOR'
  | 'ALL_STAGES';

export type AccessoryCategory =
  | 'CAGE'
  | 'AQUARIUM_TERRARIUM'
  | 'PERCH_BRANCH'
  | 'FEEDER_BOWL'
  | 'BED_NEST'
  | 'TOY'
  | 'CARRIER'
  | 'HARNESS_LEASH'
  | 'GROOMING_TOOL';

export type BookFormat = 'PAPERBACK' | 'HARDCOVER' | 'DIGITAL_PDF';
export type MedicineDosageForm =
  | 'ORAL_DROPS'
  | 'WATER_SOLUBLE_POWDER'
  | 'TABLET'
  | 'TOPICAL_SPRAY'
  | 'OINTMENT'
  | 'INJECTION';

export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedMarketplaceResponse<T> {
  items: T[];
  meta: PaginatedMeta;
}

// 1. LIVE PET
export interface LivePetListing {
  id: string;
  title: string;
  slug: string;
  status: ListingStatus;
  price: number;
  salePrice?: number | null;
  buyingPrice?: number | null;
  quantity: number;
  speciesId: string;
  breedId?: string | null;
  gender: PetGender;
  ageText: string;
  dob?: string | null;
  colorMutation?: string | null;
  ringNumber?: string | null;
  microchipId?: string | null;
  healthStatus: HealthVerificationStatus;
  dewormed: boolean;
  vaccinated: boolean;
  dnaSexingCertUrl?: string | null;
  pedigreePaperUrl?: string | null;
  deliveryMethod: LiveDeliveryMethod;
  transitGuarantee: boolean;
  pickupAddress?: string | null;
  thumbnailImage?: string | null;
  coverImage: string;
  galleryImages: string[];
  videoUrl?: string | null;
  videoUrls?: string[];
  description: string;
  isFeatured: boolean;
  storeName: string;
  createdAt: string;
  updatedAt: string;
  species?: { id: string; name: string; slug: string };
  breed?: { id: string; name: string; slug: string } | null;
}

export interface CreateLivePetPayload {
  title: string;
  price: number;
  salePrice?: number;
  buyingPrice?: number;
  quantity?: number;
  speciesId: string;
  breedId?: string;
  gender?: PetGender;
  ageText: string;
  dob?: string;
  colorMutation?: string;
  ringNumber?: string;
  microchipId?: string;
  healthStatus?: HealthVerificationStatus;
  dewormed?: boolean;
  vaccinated?: boolean;
  dnaSexingCertUrl?: string;
  pedigreePaperUrl?: string;
  deliveryMethod?: LiveDeliveryMethod;
  transitGuarantee?: boolean;
  pickupAddress?: string;
  thumbnailImage?: string;
  coverImage?: string;
  galleryImages?: string[];
  videoUrl?: string;
  videoUrls?: string[];
  description: string;
  isFeatured?: boolean;
  status?: ListingStatus;
  storeName?: string;
}

export type UpdateLivePetPayload = Partial<CreateLivePetPayload> & { id: string };

// 2. PET FOOD
export interface PetFoodListing {
  id: string;
  title: string;
  slug: string;
  status: ListingStatus;
  price: number;
  salePrice?: number | null;
  buyingPrice?: number | null;
  stockQuantity: number;
  sku?: string | null;
  brand: string;
  foodType: FoodType;
  lifeStage: FoodLifeStage;
  netWeight: number;
  weightUnit: WeightUnit;
  targetSpeciesId: string;
  ingredients?: string | null;
  guaranteedAnalysis?: any;
  expiryDate?: string | null;
  isOrganic: boolean;
  thumbnailImage?: string | null;
  coverImage: string;
  galleryImages: string[];
  videoUrls?: string[];
  description: string;
  isFeatured: boolean;
  storeName: string;
  createdAt: string;
  updatedAt: string;
  targetSpecies?: { id: string; name: string };
}

export interface CreatePetFoodPayload {
  title: string;
  price: number;
  salePrice?: number;
  buyingPrice?: number;
  stockQuantity?: number;
  sku?: string;
  brand: string;
  foodType: FoodType;
  lifeStage?: FoodLifeStage;
  netWeight: number;
  weightUnit?: WeightUnit;
  targetSpeciesId: string;
  ingredients?: string;
  guaranteedAnalysis?: any;
  expiryDate?: string;
  isOrganic?: boolean;
  thumbnailImage?: string;
  coverImage?: string;
  galleryImages?: string[];
  videoUrls?: string[];
  description: string;
  isFeatured?: boolean;
  status?: ListingStatus;
  storeName?: string;
}

export type UpdatePetFoodPayload = Partial<CreatePetFoodPayload> & { id: string };

// 3. ACCESSORY
export interface PetAccessoryListing {
  id: string;
  title: string;
  slug: string;
  status: ListingStatus;
  price: number;
  salePrice?: number | null;
  buyingPrice?: number | null;
  stockQuantity: number;
  sku?: string | null;
  category: AccessoryCategory;
  brand?: string | null;
  targetSpeciesId?: string | null;
  dimensions?: string | null;
  barSpacing?: string | null;
  material?: string | null;
  color?: string | null;
  sizeOption?: string | null;
  thumbnailImage?: string | null;
  coverImage: string;
  galleryImages: string[];
  videoUrls?: string[];
  description: string;
  isFeatured: boolean;
  storeName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccessoryPayload {
  title: string;
  price: number;
  salePrice?: number;
  buyingPrice?: number;
  stockQuantity?: number;
  sku?: string;
  category: AccessoryCategory;
  brand?: string;
  targetSpeciesId?: string;
  dimensions?: string;
  barSpacing?: string;
  material?: string;
  color?: string;
  sizeOption?: string;
  thumbnailImage?: string;
  coverImage?: string;
  galleryImages?: string[];
  videoUrls?: string[];
  description: string;
  isFeatured?: boolean;
  status?: ListingStatus;
  storeName?: string;
}

export type UpdateAccessoryPayload = Partial<CreateAccessoryPayload> & { id: string };

// 4. BOOK
export interface PetBookListing {
  id: string;
  title: string;
  slug: string;
  status: ListingStatus;
  price: number;
  salePrice?: number | null;
  buyingPrice?: number | null;
  stockQuantity: number;
  author: string;
  publisher?: string | null;
  language: string;
  format: BookFormat;
  isbn?: string | null;
  totalPages?: number | null;
  publicationYear?: number | null;
  edition?: string | null;
  downloadUrl?: string | null;
  samplePdfUrl?: string | null;
  thumbnailImage?: string | null;
  coverImage: string;
  galleryImages: string[];
  videoUrls?: string[];
  description: string;
  isFeatured: boolean;
  storeName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookPayload {
  title: string;
  price: number;
  salePrice?: number;
  buyingPrice?: number;
  stockQuantity?: number;
  author: string;
  publisher?: string;
  language?: string;
  format?: BookFormat;
  isbn?: string;
  totalPages?: number;
  publicationYear?: number;
  edition?: string;
  downloadUrl?: string;
  samplePdfUrl?: string;
  thumbnailImage?: string;
  coverImage?: string;
  galleryImages?: string[];
  videoUrls?: string[];
  description: string;
  isFeatured?: boolean;
  status?: ListingStatus;
  storeName?: string;
}

export type UpdateBookPayload = Partial<CreateBookPayload> & { id: string };

// 5. MEDICINE
export interface PetMedicineListing {
  id: string;
  title: string;
  slug: string;
  status: ListingStatus;
  price: number;
  salePrice?: number | null;
  buyingPrice?: number | null;
  stockQuantity: number;
  sku?: string | null;
  genericName: string;
  manufacturer?: string | null;
  dosageForm: MedicineDosageForm;
  packSize: string;
  prescriptionRequired: boolean;
  targetSpeciesList: string[];
  dosageInstructions: string;
  expiryDate?: string | null;
  batchNumber?: string | null;
  thumbnailImage?: string | null;
  coverImage: string;
  galleryImages: string[];
  videoUrls?: string[];
  description: string;
  isFeatured: boolean;
  storeName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicinePayload {
  title: string;
  price: number;
  salePrice?: number;
  buyingPrice?: number;
  stockQuantity?: number;
  sku?: string;
  genericName: string;
  manufacturer?: string;
  dosageForm: MedicineDosageForm;
  packSize: string;
  prescriptionRequired?: boolean;
  targetSpeciesList?: string[];
  dosageInstructions: string;
  expiryDate?: string;
  batchNumber?: string;
  thumbnailImage?: string;
  coverImage?: string;
  galleryImages?: string[];
  videoUrls?: string[];
  description: string;
  isFeatured?: boolean;
  status?: ListingStatus;
  storeName?: string;
}

export type UpdateMedicinePayload = Partial<CreateMedicinePayload> & { id: string };

// OVERVIEW & COMMON
export interface MarketplaceOverviewResponse {
  counts: {
    total: number;
    livePets: number;
    food: number;
    accessories: number;
    books: number;
    medicine: number;
  };
  valuation?: {
    totalCostValuation: number;
    totalRetailValuation: number;
    estimatedGrossProfit: number;
    avgMarginPercent: number;
  };
  recent: Array<{
    id: string;
    title: string;
    price: number;
    status: ListingStatus;
    coverImage: string;
    createdAt: string;
    domain: 'LIVE_PET' | 'PET_FOOD' | 'GEAR_ACCESSORIES';
  }>;
}

export interface UpdateStatusPayload {
  type: 'pets' | 'food' | 'accessories' | 'books' | 'medicine';
  id: string;
  status: ListingStatus;
}
