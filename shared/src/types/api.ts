import type { Quote } from "./quote.js";

export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface QuoteListParams {
  season?: number;
  episode?: number;
  sort?: "votes_asc" | "votes_desc";
  page?: number;
  limit?: number;
}

export interface QuoteWithVoted extends Quote {
  hasVoted: boolean;
}

export interface VoteResponse {
  success: boolean;
  votes: number;
}
