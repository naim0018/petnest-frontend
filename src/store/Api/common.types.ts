export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedData<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  error?: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface MessageResponse {
  message: string;
}

