import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../../middleware/errorHandler.js";
import { requireAdmin } from "../../middleware/adminAuth.js";
import {
  getAllQuotes,
  createQuote,
  updateQuote,
  deleteQuote,
} from "../../services/adminQuoteService.js";
import { DEFAULT_PAGE_SIZE } from "@unpossible/shared";

export const adminQuotesRouter = Router();

adminQuotesRouter.use(requireAdmin);

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(DEFAULT_PAGE_SIZE),
});

const createQuoteSchema = z.object({
  text: z.string().min(1, "Quote text is required").max(1000, "Quote text is too long"),
  season: z.number().int().positive("Season must be a positive integer"),
  episode: z.number().int().positive("Episode must be a positive integer"),
});

const updateQuoteSchema = z.object({
  text: z.string().min(1, "Quote text is required").max(1000, "Quote text is too long").optional(),
  season: z.number().int().positive("Season must be a positive integer").optional(),
  episode: z.number().int().positive("Episode must be a positive integer").optional(),
});

const idParamSchema = z.object({
  id: z.string().uuid("Invalid quote ID"),
});

adminQuotesRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const { page, limit } = paginationSchema.parse(req.query);

    const result = await getAllQuotes({ page, limit });

    res.json(result);
  })
);

adminQuotesRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const data = createQuoteSchema.parse(req.body);

    const quote = await createQuote(data);

    res.status(201).json({ data: quote });
  })
);

adminQuotesRouter.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = idParamSchema.parse(req.params);
    const data = updateQuoteSchema.parse(req.body);

    const quote = await updateQuote(id, data);

    res.json({ data: quote });
  })
);

adminQuotesRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = idParamSchema.parse(req.params);

    await deleteQuote(id);

    res.status(204).send();
  })
);
