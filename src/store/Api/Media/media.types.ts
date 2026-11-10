import { ApiResponse, MessageResponse } from "../common.types";

export type MediaFolder = "guides" | "pets" | "avatars";

export interface MediaAsset {
  id: string;
  objectKey: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  width?: number | null;
  height?: number | null;
  altText?: string | null;
  uploadedById?: string | null;
  guideId?: string | null;
  createdAt: string;
}

export interface CleanupOrphansData {
  message: string;
  deletedCount: number;
}

export type UploadMediaResponse = ApiResponse<MediaAsset>;
export type DeleteMediaResponse = ApiResponse<MessageResponse>;
export type CleanupOrphansResponse = ApiResponse<CleanupOrphansData>;

