import { describe, it, expect, vi, beforeEach } from "vitest";
import { prisma } from "../lib/__mocks__/prisma.js";

vi.mock("../lib/prisma.js", () => ({
  prisma,
}));

import { hasVoted, createVote, getVotedQuoteIds } from "./voteService.js";
import { NotFoundError, ConflictError } from "../lib/errors.js";

const mockQuote = {
  id: "quote-uuid-1",
  text: "Me fail English? That's unpossible!",
  season: 6,
  episode: 8,
  votes: 42,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockVote = {
  id: "vote-uuid-1",
  quoteId: "quote-uuid-1",
  sessionId: "session-123",
  createdAt: new Date(),
};

describe("VoteService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("hasVoted", () => {
    it("returns true if user has voted", async () => {
      prisma.vote.findUnique.mockResolvedValue(mockVote);

      const result = await hasVoted("quote-uuid-1", "session-123");

      expect(result).toBe(true);
      expect(prisma.vote.findUnique).toHaveBeenCalledWith({
        where: {
          quoteId_sessionId: {
            quoteId: "quote-uuid-1",
            sessionId: "session-123",
          },
        },
      });
    });

    it("returns false if user has not voted", async () => {
      prisma.vote.findUnique.mockResolvedValue(null);

      const result = await hasVoted("quote-uuid-1", "session-456");

      expect(result).toBe(false);
    });
  });

  describe("createVote", () => {
    it("creates a vote and returns new vote count", async () => {
      prisma.quote.findUnique.mockResolvedValue(mockQuote);
      prisma.vote.findUnique.mockResolvedValue(null);

      const mockTx = {
        vote: { create: vi.fn() },
        quote: { update: vi.fn().mockResolvedValue({ ...mockQuote, votes: 43 }) },
      };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
      prisma.$transaction.mockImplementation((callback: any) => callback(mockTx));

      const result = await createVote("quote-uuid-1", "session-456");

      expect(result).toBe(43);
      expect(mockTx.vote.create).toHaveBeenCalledWith({
        data: {
          quoteId: "quote-uuid-1",
          sessionId: "session-456",
        },
      });
      expect(mockTx.quote.update).toHaveBeenCalledWith({
        where: { id: "quote-uuid-1" },
        data: { votes: { increment: 1 } },
      });
    });

    it("throws NotFoundError if quote does not exist", async () => {
      prisma.quote.findUnique.mockResolvedValue(null);

      await expect(createVote("non-existent", "session-123")).rejects.toThrow(
        NotFoundError
      );
      await expect(createVote("non-existent", "session-123")).rejects.toThrow(
        "Quote not found"
      );
    });

    it("throws ConflictError if user already voted", async () => {
      prisma.quote.findUnique.mockResolvedValue(mockQuote);
      prisma.vote.findUnique.mockResolvedValue(mockVote);

      await expect(
        createVote("quote-uuid-1", "session-123")
      ).rejects.toThrow(ConflictError);
      await expect(
        createVote("quote-uuid-1", "session-123")
      ).rejects.toThrow("Already voted for this quote");
    });
  });

  describe("getVotedQuoteIds", () => {
    it("returns array of quote IDs user has voted for", async () => {
      prisma.vote.findMany.mockResolvedValue([
        { quoteId: "quote-1" },
        { quoteId: "quote-2" },
        { quoteId: "quote-3" },
      ]);

      const result = await getVotedQuoteIds("session-123");

      expect(result).toEqual(["quote-1", "quote-2", "quote-3"]);
      expect(prisma.vote.findMany).toHaveBeenCalledWith({
        where: { sessionId: "session-123" },
        select: { quoteId: true },
      });
    });

    it("returns empty array if user has not voted", async () => {
      prisma.vote.findMany.mockResolvedValue([]);

      const result = await getVotedQuoteIds("session-456");

      expect(result).toEqual([]);
    });
  });
});
