import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../middleware/errorHandler.js";
import { BadRequestError } from "../lib/errors.js";
import {
  getRandomQuote,
  getQuoteById,
  getQuotes,
  getAvailableFilters,
  type QuoteSort,
} from "../services/quoteService.js";
import { getVotedQuoteIds, hasVoted } from "../services/voteService.js";
import { DEFAULT_PAGE_SIZE } from "@unpossible/shared";

export const quotesRouter = Router();

const quoteListQuerySchema = z.object({
  season: z.coerce.number().int().positive().optional(),
  episode: z.coerce.number().int().positive().optional(),
  sort: z.enum(["votes_asc", "votes_desc"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(DEFAULT_PAGE_SIZE),
});

function extractId(param: string | string[] | undefined): string {
  if (!param) {
    throw new BadRequestError("Missing id parameter");
  }
  return Array.isArray(param) ? (param[0] ?? "") : param;
}

quotesRouter.get(
  "/random",
  asyncHandler(async (req, res) => {
    const quote = await getRandomQuote();
    const voted = await hasVoted(quote.id, req.sessionId);

    res.json({
      data: {
        ...quote,
        hasVoted: voted,
      },
    });
  })
);

quotesRouter.get(
  "/filters",
  asyncHandler(async (_req, res) => {
    const filters = await getAvailableFilters();
    res.json({ data: filters });
  })
);

quotesRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = extractId(req.params["id"]);
    const quote = await getQuoteById(id);
    const voted = await hasVoted(quote.id, req.sessionId);

    res.json({
      data: {
        ...quote,
        hasVoted: voted,
      },
    });
  })
);

quotesRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const query = quoteListQuerySchema.parse(req.query);

    const result = await getQuotes(
      {
        season: query.season,
        episode: query.episode,
      },
      {
        page: query.page,
        limit: query.limit,
      },
      query.sort as QuoteSort | undefined
    );

    const votedIds = await getVotedQuoteIds(req.sessionId);
    const votedSet = new Set(votedIds);

    const dataWithVoted = result.data.map((quote) => ({
      ...quote,
      hasVoted: votedSet.has(quote.id),
    }));

    res.json({
      data: dataWithVoted,
      pagination: result.pagination,
    });
  })
);
