import { ApiResponse, MessageResponse, PaginatedData, PaginationQuery } from "../common.types";
import { PetBreedSummary, PetSpecies } from "../Pets/pets.types";
import { UserProfileSummary } from "../Auth/auth.types";

export type GuideStatus =
  | "DRAFT"
  | "IN_REVIEW"
  | "PUBLISHED"
  | "NEEDS_REVISION"
  | "ARCHIVED";

export type GuideType = "PILLAR" | "ARTICLE" | "CHECKLIST";

export interface GuideCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  displayOrder: number;
  isActive: boolean;
  _count?: {
    guides: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AdminCategory extends GuideCategory {
  guidesCount: number;
  totalViews: number;
}

export interface GuideAuthorSummary {
  id: string;
  name: string;
  email: string;
  role: string;
  profile?: UserProfileSummary | null;
}

export interface GuideReviewerSummary {
  id: string;
  name: string;
  role: string;
}

export interface GuideFaq {
  id: string;
  question: string;
  answer: string;
  displayOrder: number;
  isActive: boolean;
  speciesId?: string | null;
  guideId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GuideSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  type: GuideType;
  coverImage?: string | null;
  coverImageAlt?: string | null;
  videoUrl?: string | null;
  readTimeMinutes: number;
  tags: string[];
  status: GuideStatus;
  isFeatured: boolean;
  viewCount: number;
  likeCount: number;
  bookmarkCount: number;
  publishedAt?: string | null;
  lastReviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  author: GuideAuthorSummary;
  reviewer?: GuideReviewerSummary | null;
  species?: PetSpecies | null;
  breeds?: PetBreedSummary[];
  category: GuideCategory;
  isLiked?: boolean;
  isBookmarked?: boolean;
  reviewNotes?: string | null;
}

export interface GuideDetail extends GuideSummary {
  keyTakeaways: string[];
  content: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  previousSlugs: string[];
  faqs?: GuideFaq[];
}

export interface GuideDetailResponseData {
  redirectTo: string | null;
  guide: GuideDetail;
  relatedGuides: GuideSummary[];
}

export interface GuideQuery extends PaginationQuery {
  species?: string;
  breed?: string;
  category?: string;
  type?: GuideType;
  status?: GuideStatus;
  isFeatured?: boolean;
  authorId?: string;
}

export interface BookmarkedGuideSummary extends GuideSummary {
  bookmarkedAt: string;
  isBookmarked: true;
}

export interface EditorialStats {
  publishedCount: number;
  inReviewCount: number;
  draftCount: number;
  needsRevisionCount: number;
  activeAuthorsCount: number;
  totalViews: number;
  totalLikes: number;
  totalBookmarks: number;
}

export interface CreateGuidePayload {
  title: string;
  slug?: string;
  excerpt: string;
  keyTakeaways?: string[];
  content: string;
  type?: GuideType;
  coverImage?: string | null;
  coverImageAlt?: string;
  videoUrl?: string | null;
  speciesId?: string | null;
  breedIds?: string[];
  categoryId: string;
  tags?: string[];
  status?: GuideStatus;
  isFeatured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export interface UpdateGuidePayload extends Partial<CreateGuidePayload> {}

export interface ReviewGuidePayload {
  decision: "PUBLISH" | "NEEDS_REVISION" | "ARCHIVE";
  reviewNotes?: string;
  markExpertReviewed?: boolean;
}

export interface CreateCategoryPayload {
  name: string;
  slug?: string;
  description?: string;
  icon?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpdateCategoryPayload extends Partial<CreateCategoryPayload> {}

export interface CreateFaqPayload {
  question: string;
  answer: string;
  displayOrder?: number;
  isActive?: boolean;
  speciesId?: string;
  guideId?: string;
}

export interface UpdateFaqPayload extends Partial<CreateFaqPayload> {}

export interface LikeResponseData {
  liked: boolean;
  likeCount: number;
}

export interface BookmarkResponseData {
  bookmarked: boolean;
  bookmarkCount: number;
}

// Responses
export type PublicCategoriesResponse = ApiResponse<GuideCategory[]>;
export type SingleCategoryResponse = ApiResponse<GuideCategory>;
export type AdminCategoriesResponse = ApiResponse<AdminCategory[]>;
export type PublicFaqsResponse = ApiResponse<GuideFaq[]>;
export type AdminFaqsResponse = ApiResponse<GuideFaq[]>;
export type SingleFaqResponse = ApiResponse<GuideFaq>;
export type PaginatedGuidesResponse = ApiResponse<PaginatedData<GuideSummary>>;
export type GuideDetailResponse = ApiResponse<GuideDetailResponseData>;
export type EditorialGuideResponse = ApiResponse<GuideDetail>;
export type EditorialStatsResponse = ApiResponse<EditorialStats>;
export type LikeResponse = ApiResponse<LikeResponseData>;
export type BookmarkResponse = ApiResponse<BookmarkResponseData>;
export type BookmarksResponse = ApiResponse<PaginatedData<BookmarkedGuideSummary>>;
export type DeleteGuideResponse = ApiResponse<MessageResponse>;

