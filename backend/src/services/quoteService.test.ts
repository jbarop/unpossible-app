import { describe, it, expect, vi, beforeEach } from "vitest";
import { prisma } from "../lib/__mocks__/prisma.js";

vi.mock("../lib/prisma.js", () => ({
  prisma,
}));

import { getRandomQuote, getQuoteById, getQuotes } from "./quoteService.js";
import { NotFoundError } from "../lib/errors.js";

const mockQuote = {
  id: "test-uuid-1",
  text: "Me fail English? That's unpossible!",
  season: 6,
  episode: 8,
  votes: 42,
  createdAt: new Date("2024-01-01T00:00:00Z"),
  updatedAt: new Date("2024-01-01T00:00:00Z"),
};

describe("QuoteService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getRandomQuote", () => {
    it("returns a random quote", async () => {
      prisma.quote.count.mockResolvedValue(10);
      prisma.quote.findFirst.mockResolvedValue(mockQuote);

      const result = await getRandomQuote();

      expect(result).toEqual({
        id: "test-uuid-1",
        text: "Me fail English? That's unpossible!",
        season: 6,
        episode: 8,
        votes: 42,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      });
      expect(prisma.quote.count).toHaveBeenCalled();
      expect(prisma.quote.findFirst).toHaveBeenCalled();
    });

    it("throws NotFoundError when no quotes exist", async () => {
      prisma.quote.count.mockResolvedValue(0);

      await expect(getRandomQuote()).rejects.toThrow(NotFoundError);
      await expect(getRandomQuote()).rejects.toThrow("No quotes found");
    });

    it("throws NotFoundError when findFirst returns null", async () => {
      prisma.quote.count.mockResolvedValue(10);
      prisma.quote.findFirst.mockResolvedValue(null);

      await expect(getRandomQuote()).rejects.toThrow(NotFoundError);
    });
  });

  describe("getQuoteById", () => {
    it("returns a quote by id", async () => {
      prisma.quote.findUnique.mockResolvedValue(mockQuote);

      const result = await getQuoteById("test-uuid-1");

      expect(result).toEqual({
        id: "test-uuid-1",
        text: "Me fail English? That's unpossible!",
        season: 6,
        episode: 8,
        votes: 42,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      });
      expect(prisma.quote.findUnique).toHaveBeenCalledWith({
        where: { id: "test-uuid-1" },
      });
    });

    it("throws NotFoundError when quote does not exist", async () => {
      prisma.quote.findUnique.mockResolvedValue(null);

      await expect(getQuoteById("non-existent")).rejects.toThrow(NotFoundError);
      await expect(getQuoteById("non-existent")).rejects.toThrow(
        "Quote not found"
      );
    });
  });

  describe("getQuotes", () => {
    const mockQuotes = [
      mockQuote,
      {
        ...mockQuote,
        id: "test-uuid-2",
        text: "I'm learnding!",
        votes: 30,
      },
    ];

    it("returns paginated quotes", async () => {
      prisma.quote.findMany.mockResolvedValue(mockQuotes);
      prisma.quote.count.mockResolvedValue(50);

      const result = await getQuotes({}, { page: 1, limit: 20 });

      expect(result.data).toHaveLength(2);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 20,
        total: 50,
        totalPages: 3,
        hasNext: true,
        hasPrev: false,
      });
    });

    it("filters by season", async () => {
      prisma.quote.findMany.mockResolvedValue([mockQuote]);
      prisma.quote.count.mockResolvedValue(1);

      await getQuotes({ season: 6 }, { page: 1, limit: 20 });

      expect(prisma.quote.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { season: 6 },
        })
      );
    });

    it("filters by episode", async () => {
      prisma.quote.findMany.mockResolvedValue([mockQuote]);
      prisma.quote.count.mockResolvedValue(1);

      await getQuotes({ episode: 8 }, { page: 1, limit: 20 });

      expect(prisma.quote.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { episode: 8 },
        })
      );
    });

    it("filters by both season and episode", async () => {
      prisma.quote.findMany.mockResolvedValue([mockQuote]);
      prisma.quote.count.mockResolvedValue(1);

      await getQuotes({ season: 6, episode: 8 }, { page: 1, limit: 20 });

      expect(prisma.quote.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { season: 6, episode: 8 },
        })
      );
    });

    it("sorts by votes ascending", async () => {
      prisma.quote.findMany.mockResolvedValue(mockQuotes);
      prisma.quote.count.mockResolvedValue(2);

      await getQuotes({}, { page: 1, limit: 20 }, "votes_asc");

      expect(prisma.quote.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { votes: "asc" },
        })
      );
    });

    it("sorts by votes descending", async () => {
      prisma.quote.findMany.mockResolvedValue(mockQuotes);
      prisma.quote.count.mockResolvedValue(2);

      await getQuotes({}, { page: 1, limit: 20 }, "votes_desc");

      expect(prisma.quote.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { votes: "desc" },
        })
      );
    });

    it("limits results to MAX_PAGE_SIZE", async () => {
      prisma.quote.findMany.mockResolvedValue([]);
      prisma.quote.count.mockResolvedValue(0);

      await getQuotes({}, { page: 1, limit: 1000 });

      expect(prisma.quote.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 100,
        })
      );
    });

    it("calculates pagination correctly", async () => {
      prisma.quote.findMany.mockResolvedValue([]);
      prisma.quote.count.mockResolvedValue(45);

      const result = await getQuotes({}, { page: 2, limit: 20 });

      expect(result.pagination).toEqual({
        page: 2,
        limit: 20,
        total: 45,
        totalPages: 3,
        hasNext: true,
        hasPrev: true,
      });
      expect(prisma.quote.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 20,
          take: 20,
        })
      );
    });

    it("hasPrev is false on first page", async () => {
      prisma.quote.findMany.mockResolvedValue([]);
      prisma.quote.count.mockResolvedValue(100);

      const result = await getQuotes({}, { page: 1, limit: 20 });

      expect(result.pagination.hasPrev).toBe(false);
    });

    it("hasNext is false on last page", async () => {
      prisma.quote.findMany.mockResolvedValue([]);
      prisma.quote.count.mockResolvedValue(40);

      const result = await getQuotes({}, { page: 2, limit: 20 });

      expect(result.pagination.hasNext).toBe(false);
    });
  });
});
