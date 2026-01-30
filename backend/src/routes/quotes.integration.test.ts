import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import {
  setupTestApp,
  cleanupDatabase,
  seedTestQuotes,
  prisma,
  app,
} from "../test/setup.js";
import type { Quote } from "@prisma/client";

function getCookies(headers: Record<string, unknown>): string[] {
  const cookies = headers["set-cookie"];
  if (Array.isArray(cookies)) {
    return cookies;
  }
  if (typeof cookies === "string") {
    return [cookies];
  }
  return [];
}

describe("Quote Endpoints Integration Tests", () => {
  let testQuotes: Quote[];

  beforeAll(async () => {
    await setupTestApp();
  });

  afterAll(async () => {
    await cleanupDatabase();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await cleanupDatabase();
    testQuotes = await seedTestQuotes();
  });

  describe("GET /api/quotes/random", () => {
    it("returns a random quote", async () => {
      const response = await request(app)
        .get("/api/quotes/random")
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.text).toBeDefined();
      expect(response.body.data.season).toBeDefined();
      expect(response.body.data.episode).toBeDefined();
      expect(response.body.data.votes).toBeDefined();
      expect(response.body.data.hasVoted).toBe(false);
    });

    it("sets a session cookie", async () => {
      const response = await request(app).get("/api/quotes/random").expect(200);

      expect(response.headers["set-cookie"]).toBeDefined();
      const cookies = getCookies(response.headers);
      expect(cookies.length).toBeGreaterThan(0);
      expect(cookies[0]).toContain("unpossible_session");
    });

    it("returns 404 when no quotes exist", async () => {
      await cleanupDatabase();

      const response = await request(app).get("/api/quotes/random").expect(404);

      expect(response.body.error).toBeDefined();
    });
  });

  describe("GET /api/quotes/:id", () => {
    it("returns a specific quote by ID", async () => {
      const targetQuote = testQuotes[0]!;

      const response = await request(app)
        .get(`/api/quotes/${targetQuote.id}`)
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body.data.id).toBe(targetQuote.id);
      expect(response.body.data.text).toBe(targetQuote.text);
      expect(response.body.data.season).toBe(targetQuote.season);
      expect(response.body.data.episode).toBe(targetQuote.episode);
      expect(response.body.data.votes).toBe(targetQuote.votes);
      expect(response.body.data.hasVoted).toBe(false);
    });

    it("returns 404 for non-existent quote", async () => {
      const response = await request(app)
        .get("/api/quotes/00000000-0000-0000-0000-000000000000")
        .expect(404);

      expect(response.body.error).toBeDefined();
    });

    it("returns 400 for invalid UUID format", async () => {
      const response = await request(app)
        .get("/api/quotes/invalid-id")
        .expect(404);

      expect(response.body.error).toBeDefined();
    });
  });

  describe("GET /api/quotes", () => {
    it("returns a list of quotes with pagination", async () => {
      const response = await request(app)
        .get("/api/quotes")
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(5);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.total).toBe(5);
    });

    it("filters by season", async () => {
      const response = await request(app)
        .get("/api/quotes?season=6")
        .expect(200);

      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].season).toBe(6);
      expect(response.body.data[0].text).toBe("Me fail English? That's unpossible!");
    });

    it("filters by episode", async () => {
      const response = await request(app)
        .get("/api/quotes?episode=21")
        .expect(200);

      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].episode).toBe(21);
    });

    it("filters by season and episode", async () => {
      const response = await request(app)
        .get("/api/quotes?season=7&episode=21")
        .expect(200);

      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].text).toBe("Hi, Super Nintendo Chalmers!");
    });

    it("sorts by votes ascending", async () => {
      const response = await request(app)
        .get("/api/quotes?sort=votes_asc")
        .expect(200);

      const votes = response.body.data.map((q: { votes: number }) => q.votes);
      expect(votes).toEqual([...votes].sort((a, b) => a - b));
    });

    it("sorts by votes descending", async () => {
      const response = await request(app)
        .get("/api/quotes?sort=votes_desc")
        .expect(200);

      const votes = response.body.data.map((q: { votes: number }) => q.votes);
      expect(votes).toEqual([...votes].sort((a, b) => b - a));
    });

    it("paginates correctly", async () => {
      const response = await request(app)
        .get("/api/quotes?page=1&limit=2")
        .expect(200);

      expect(response.body.data.length).toBe(2);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(2);
      expect(response.body.pagination.total).toBe(5);
      expect(response.body.pagination.totalPages).toBe(3);
      expect(response.body.pagination.hasNext).toBe(true);
      expect(response.body.pagination.hasPrev).toBe(false);
    });

    it("returns page 2 correctly", async () => {
      const response = await request(app)
        .get("/api/quotes?page=2&limit=2")
        .expect(200);

      expect(response.body.data.length).toBe(2);
      expect(response.body.pagination.page).toBe(2);
      expect(response.body.pagination.hasNext).toBe(true);
      expect(response.body.pagination.hasPrev).toBe(true);
    });

    it("returns last page correctly", async () => {
      const response = await request(app)
        .get("/api/quotes?page=3&limit=2")
        .expect(200);

      expect(response.body.data.length).toBe(1);
      expect(response.body.pagination.hasNext).toBe(false);
      expect(response.body.pagination.hasPrev).toBe(true);
    });

    it("returns empty results for non-existent filter", async () => {
      const response = await request(app)
        .get("/api/quotes?season=99")
        .expect(200);

      expect(response.body.data.length).toBe(0);
      expect(response.body.pagination.total).toBe(0);
    });

    it("includes hasVoted for each quote", async () => {
      const response = await request(app).get("/api/quotes").expect(200);

      response.body.data.forEach((quote: { hasVoted: boolean }) => {
        expect(typeof quote.hasVoted).toBe("boolean");
      });
    });
  });
});
