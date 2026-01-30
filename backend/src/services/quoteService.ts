import { prisma } from "../lib/prisma.js";
import { NotFoundError } from "../lib/errors.js";
import type { Quote } from "@unpossible/shared";
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from "@unpossible/shared";

export interface QuoteFilters {
  season?: number;
  episode?: number;
}

export interface QuotePagination {
  page: number;
  limit: number;
}

export type QuoteSort = "votes_asc" | "votes_desc";

export interface QuoteListResult {
  data: Quote[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

function toQuote(dbQuote: {
  id: string;
  text: string;
  season: number;
  episode: number;
  votes: number;
  createdAt: Date;
  updatedAt: Date;
}): Quote {
  return {
    id: dbQuote.id,
    text: dbQuote.text,
    season: dbQuote.season,
    episode: dbQuote.episode,
    votes: dbQuote.votes,
    createdAt: dbQuote.createdAt.toISOString(),
    updatedAt: dbQuote.updatedAt.toISOString(),
  };
}

export async function getRandomQuote(): Promise<Quote> {
  const count = await prisma.quote.count();

  if (count === 0) {
    throw new NotFoundError("No quotes found");
  }

  const skip = Math.floor(Math.random() * count);
  const quote = await prisma.quote.findFirst({
    skip,
    take: 1,
  });

  if (!quote) {
    throw new NotFoundError("No quotes found");
  }

  return toQuote(quote);
}

export async function getQuoteById(id: string): Promise<Quote> {
  const quote = await prisma.quote.findUnique({
    where: { id },
  });

  if (!quote) {
    throw new NotFoundError("Quote not found");
  }

  return toQuote(quote);
}

export async function getQuotes(
  filters: QuoteFilters = {},
  pagination: QuotePagination = { page: 1, limit: DEFAULT_PAGE_SIZE },
  sort?: QuoteSort
): Promise<QuoteListResult> {
  const { page, limit: requestedLimit } = pagination;
  const limit = Math.min(requestedLimit, MAX_PAGE_SIZE);
  const skip = (page - 1) * limit;

  const where: { season?: number; episode?: number } = {};

  if (filters.season !== undefined) {
    where.season = filters.season;
  }
  if (filters.episode !== undefined) {
    where.episode = filters.episode;
  }

  const orderBy: { votes?: "asc" | "desc" } = {};

  if (sort === "votes_asc") {
    orderBy.votes = "asc";
  } else if (sort === "votes_desc") {
    orderBy.votes = "desc";
  }

  const [quotes, total] = await Promise.all([
    prisma.quote.findMany({
      where,
      orderBy:
        Object.keys(orderBy).length > 0 ? orderBy : { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.quote.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: quotes.map(toQuote),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}
