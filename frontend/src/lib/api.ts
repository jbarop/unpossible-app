import type {
  ApiResponse,
  PaginatedResponse,
  QuoteListParams,
  QuoteWithVoted,
  VoteResponse,
} from "@unpossible/shared";

const API_BASE = "/api";

class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchJson<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (options?.headers) {
    const optHeaders = options.headers;
    if (optHeaders instanceof Headers) {
      optHeaders.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(optHeaders)) {
      optHeaders.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else {
      Object.assign(headers, optHeaders);
    }
  }

  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers,
  });

  if (!response.ok) {
    let errorMessage = "Request failed";
    try {
      const errorBody = (await response.json()) as { message?: string };
      if (errorBody.message) {
        errorMessage = errorBody.message;
      }
    } catch {
      errorMessage = "An error occurred";
    }
    throw new ApiError(response.status, errorMessage);
  }

  return response.json() as Promise<T>;
}

export const api = {
  quotes: {
    getRandom: () =>
      fetchJson<ApiResponse<QuoteWithVoted>>(`${API_BASE}/quotes/random`),

    getById: (id: string) =>
      fetchJson<ApiResponse<QuoteWithVoted>>(`${API_BASE}/quotes/${id}`),

    getList: (params?: QuoteListParams) => {
      const searchParams = new URLSearchParams();
      if (params?.season) searchParams.set("season", String(params.season));
      if (params?.episode) searchParams.set("episode", String(params.episode));
      if (params?.sort) searchParams.set("sort", params.sort);
      if (params?.page) searchParams.set("page", String(params.page));
      if (params?.limit) searchParams.set("limit", String(params.limit));
      const query = searchParams.toString();
      return fetchJson<PaginatedResponse<QuoteWithVoted>>(
        `${API_BASE}/quotes${query ? `?${query}` : ""}`,
      );
    },

    vote: (id: string) =>
      fetchJson<VoteResponse>(`${API_BASE}/quotes/${id}/vote`, {
        method: "POST",
      }),
  },
};
