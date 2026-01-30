import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import {
  setupTestApp,
  cleanupDatabase,
  seedTestQuotes,
  prisma,
  app,
} from "../../test/setup.js";
import type { Quote } from "@prisma/client";

const ADMIN_PASSWORD = process.env["ADMIN_PASSWORD"] ?? "test-password";

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

async function loginAsAdmin(): Promise<string[]> {
  const response = await request(app)
    .post("/api/admin/login")
    .send({ password: ADMIN_PASSWORD });
  return getCookies(response.headers);
}

describe("Admin Quote Management Integration Tests", () => {
  let testQuotes: Quote[];
  let adminCookies: string[];

  beforeAll(async () => {
    process.env["ADMIN_PASSWORD"] = ADMIN_PASSWORD;
    await setupTestApp();
  });

  afterAll(async () => {
    await cleanupDatabase();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await cleanupDatabase();
    testQuotes = await seedTestQuotes();
    adminCookies = await loginAsAdmin();
  });

  describe("GET /api/admin/quotes", () => {
    it("returns all quotes when authenticated", async () => {
      const response = await request(app)
        .get("/api/admin/quotes")
        .set("Cookie", adminCookies)
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(5);
    });

    it("returns 401 when not authenticated", async () => {
      const response = await request(app)
        .get("/api/admin/quotes")
        .expect(401);

      expect(response.body.error).toBeDefined();
    });

    it("paginates correctly", async () => {
      const response = await request(app)
        .get("/api/admin/quotes?page=1&limit=2")
        .set("Cookie", adminCookies)
        .expect(200);

      expect(response.body.data.length).toBe(2);
      expect(response.body.pagination.total).toBe(5);
      expect(response.body.pagination.totalPages).toBe(3);
    });
  });

  describe("POST /api/admin/quotes", () => {
    it("creates a new quote", async () => {
      const newQuote = {
        text: "I ate too much plastic candy.",
        season: 4,
        episode: 15,
      };

      const response = await request(app)
        .post("/api/admin/quotes")
        .set("Cookie", adminCookies)
        .send(newQuote)
        .expect(201)
        .expect("Content-Type", /json/);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.text).toBe(newQuote.text);
      expect(response.body.data.season).toBe(newQuote.season);
      expect(response.body.data.episode).toBe(newQuote.episode);
      expect(response.body.data.votes).toBe(0);

      // Verify in database
      const dbQuote = await prisma.quote.findUnique({
        where: { id: response.body.data.id },
      });
      expect(dbQuote).not.toBeNull();
      expect(dbQuote!.text).toBe(newQuote.text);
    });

    it("returns 401 when not authenticated", async () => {
      const newQuote = {
        text: "Test quote",
        season: 1,
        episode: 1,
      };

      await request(app)
        .post("/api/admin/quotes")
        .send(newQuote)
        .expect(401);
    });

    it("returns 400 with missing text", async () => {
      const response = await request(app)
        .post("/api/admin/quotes")
        .set("Cookie", adminCookies)
        .send({ season: 1, episode: 1 })
        .expect(400);

      expect(response.body.error).toBeDefined();
    });

    it("returns 400 with missing season", async () => {
      const response = await request(app)
        .post("/api/admin/quotes")
        .set("Cookie", adminCookies)
        .send({ text: "Test", episode: 1 })
        .expect(400);

      expect(response.body.error).toBeDefined();
    });

    it("returns 400 with missing episode", async () => {
      const response = await request(app)
        .post("/api/admin/quotes")
        .set("Cookie", adminCookies)
        .send({ text: "Test", season: 1 })
        .expect(400);

      expect(response.body.error).toBeDefined();
    });

    it("returns 400 with invalid season (zero)", async () => {
      const response = await request(app)
        .post("/api/admin/quotes")
        .set("Cookie", adminCookies)
        .send({ text: "Test", season: 0, episode: 1 })
        .expect(400);

      expect(response.body.error).toBeDefined();
    });

    it("returns 400 with text too long", async () => {
      const longText = "a".repeat(1001);
      const response = await request(app)
        .post("/api/admin/quotes")
        .set("Cookie", adminCookies)
        .send({ text: longText, season: 1, episode: 1 })
        .expect(400);

      expect(response.body.error).toBeDefined();
    });
  });

  describe("PUT /api/admin/quotes/:id", () => {
    it("updates a quote", async () => {
      const targetQuote = testQuotes[0]!;
      const updateData = { text: "Updated quote text" };

      const response = await request(app)
        .put(`/api/admin/quotes/${targetQuote.id}`)
        .set("Cookie", adminCookies)
        .send(updateData)
        .expect(200);

      expect(response.body.data.text).toBe(updateData.text);
      expect(response.body.data.season).toBe(targetQuote.season);

      // Verify in database
      const dbQuote = await prisma.quote.findUnique({
        where: { id: targetQuote.id },
      });
      expect(dbQuote!.text).toBe(updateData.text);
    });

    it("updates multiple fields", async () => {
      const targetQuote = testQuotes[0]!;
      const updateData = {
        text: "New text",
        season: 10,
        episode: 5,
      };

      const response = await request(app)
        .put(`/api/admin/quotes/${targetQuote.id}`)
        .set("Cookie", adminCookies)
        .send(updateData)
        .expect(200);

      expect(response.body.data.text).toBe(updateData.text);
      expect(response.body.data.season).toBe(updateData.season);
      expect(response.body.data.episode).toBe(updateData.episode);
    });

    it("returns 401 when not authenticated", async () => {
      const targetQuote = testQuotes[0]!;

      await request(app)
        .put(`/api/admin/quotes/${targetQuote.id}`)
        .send({ text: "Updated" })
        .expect(401);
    });

    it("returns 404 for non-existent quote", async () => {
      const response = await request(app)
        .put("/api/admin/quotes/00000000-0000-0000-0000-000000000000")
        .set("Cookie", adminCookies)
        .send({ text: "Updated" })
        .expect(404);

      expect(response.body.error).toBeDefined();
    });

    it("returns 400 for invalid UUID", async () => {
      const response = await request(app)
        .put("/api/admin/quotes/invalid-id")
        .set("Cookie", adminCookies)
        .send({ text: "Updated" })
        .expect(400);

      expect(response.body.error).toBeDefined();
    });
  });

  describe("DELETE /api/admin/quotes/:id", () => {
    it("deletes a quote", async () => {
      const targetQuote = testQuotes[0]!;

      await request(app)
        .delete(`/api/admin/quotes/${targetQuote.id}`)
        .set("Cookie", adminCookies)
        .expect(204);

      // Verify deletion
      const dbQuote = await prisma.quote.findUnique({
        where: { id: targetQuote.id },
      });
      expect(dbQuote).toBeNull();
    });

    it("cascades delete to votes", async () => {
      const targetQuote = testQuotes[0]!;

      // Create a vote for the quote
      await prisma.vote.create({
        data: {
          quoteId: targetQuote.id,
          sessionId: "test-session-123",
        },
      });

      // Verify vote exists
      const voteBefore = await prisma.vote.findFirst({
        where: { quoteId: targetQuote.id },
      });
      expect(voteBefore).not.toBeNull();

      // Delete quote
      await request(app)
        .delete(`/api/admin/quotes/${targetQuote.id}`)
        .set("Cookie", adminCookies)
        .expect(204);

      // Verify vote was also deleted
      const voteAfter = await prisma.vote.findFirst({
        where: { quoteId: targetQuote.id },
      });
      expect(voteAfter).toBeNull();
    });

    it("returns 401 when not authenticated", async () => {
      const targetQuote = testQuotes[0]!;

      await request(app)
        .delete(`/api/admin/quotes/${targetQuote.id}`)
        .expect(401);
    });

    it("returns 404 for non-existent quote", async () => {
      const response = await request(app)
        .delete("/api/admin/quotes/00000000-0000-0000-0000-000000000000")
        .set("Cookie", adminCookies)
        .expect(404);

      expect(response.body.error).toBeDefined();
    });

    it("returns 400 for invalid UUID", async () => {
      const response = await request(app)
        .delete("/api/admin/quotes/invalid-id")
        .set("Cookie", adminCookies)
        .expect(400);

      expect(response.body.error).toBeDefined();
    });
  });
});
