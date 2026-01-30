import { prisma } from "../lib/prisma.js";
import { ConflictError, NotFoundError } from "../lib/errors.js";

export async function hasVoted(
  quoteId: string,
  sessionId: string
): Promise<boolean> {
  const vote = await prisma.vote.findUnique({
    where: {
      quoteId_sessionId: {
        quoteId,
        sessionId,
      },
    },
  });

  return vote !== null;
}

export async function createVote(
  quoteId: string,
  sessionId: string
): Promise<number> {
  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
  });

  if (!quote) {
    throw new NotFoundError("Quote not found");
  }

  const alreadyVoted = await hasVoted(quoteId, sessionId);
  if (alreadyVoted) {
    throw new ConflictError("Already voted for this quote");
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.vote.create({
      data: {
        quoteId,
        sessionId,
      },
    });

    const updatedQuote = await tx.quote.update({
      where: { id: quoteId },
      data: { votes: { increment: 1 } },
    });

    return updatedQuote.votes;
  });

  return result;
}

export async function getVotedQuoteIds(sessionId: string): Promise<string[]> {
  const votes = await prisma.vote.findMany({
    where: { sessionId },
    select: { quoteId: true },
  });

  return votes.map((v) => v.quoteId);
}
