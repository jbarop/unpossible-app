import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import { BadRequestError } from "../lib/errors.js";
import { createVote } from "../services/voteService.js";

export const votesRouter = Router();

function extractId(param: string | string[] | undefined): string {
  if (!param) {
    throw new BadRequestError("Missing id parameter");
  }
  return Array.isArray(param) ? (param[0] ?? "") : param;
}

votesRouter.post(
  "/:id/vote",
  asyncHandler(async (req, res) => {
    const quoteId = extractId(req.params["id"]);
    const sessionId = req.sessionId;

    const newVoteCount = await createVote(quoteId, sessionId);

    res.json({
      data: {
        success: true,
        votes: newVoteCount,
      },
    });
  })
);
