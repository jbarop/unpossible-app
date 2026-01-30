import { prisma } from "../lib/prisma.js";
import { NotFoundError } from "../lib/errors.js";
import type { Quote, QuoteCreate, QuoteUpdate } from "@unpossible/shared";
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from "@unpossible/shared";

interface AdminQuotePagination {
  page: number;
  limit: number;
}

interface AdminQuoteListResult {
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

export async function getAllQuotes(
  pagination: AdminQuotePagination = { page: 1, limit: DEFAULT_PAGE_SIZE }
): Promise<AdminQuoteListResult> {
  const { page, limit: requestedLimit } = pagination;
  const limit = Math.min(requestedLimit, MAX_PAGE_SIZE);
  const skip = (page - 1) * limit;

  const [quotes, total] = await Promise.all([
    prisma.quote.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.quote.count(),
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

export async function createQuote(data: QuoteCreate): Promise<Quote> {
  const quote = await prisma.quote.create({
    data: {
      text: data.text,
      season: data.season,
      episode: data.episode,
    },
  });

  return toQuote(quote);
}

export async function updateQuote(
  id: string,
  data: QuoteUpdate
): Promise<Quote> {
  const existing = await prisma.quote.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new NotFoundError("Quote not found");
  }

  const quote = await prisma.quote.update({
    where: { id },
    data: {
      ...(data.text !== undefined && { text: data.text }),
      ...(data.season !== undefined && { season: data.season }),
      ...(data.episode !== undefined && { episode: data.episode }),
    },
  });

  return toQuote(quote);
}

export async function deleteQuote(id: string): Promise<void> {
  const existing = await prisma.quote.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new NotFoundError("Quote not found");
  }

  await prisma.quote.delete({
    where: { id },
  });
}
