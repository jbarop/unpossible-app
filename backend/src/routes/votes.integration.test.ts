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

describe("Vote Endpoints Integration Tests", () => {
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

  describe("POST /api/quotes/:id/vote", () => {
    it("successfully votes for a quote", async () => {
      const targetQuote = testQuotes[0]!;
      const initialVotes = targetQuote.votes;

      const response = await request(app)
        .post(`/api/quotes/${targetQuote.id}/vote`)
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body.data.success).toBe(true);
      expect(response.body.data.votes).toBe(initialVotes + 1);

      // Verify the vote was persisted
      const updatedQuote = await prisma.quote.findUnique({
        where: { id: targetQuote.id },
      });
      expect(updatedQuote!.votes).toBe(initialVotes + 1);
    });

    it("creates a vote record in the database", async () => {
      const targetQuote = testQuotes[0]!;

      const response = await request(app)
        .post(`/api/quotes/${targetQuote.id}/vote`)
        .expect(200);

      // Extract session ID from cookie
      const cookies = response.headers["set-cookie"];
      const sessionCookie = cookies?.[0];
      const sessionIdMatch = sessionCookie?.match(/unpossible_session=([^;]+)/);
      const sessionId = sessionIdMatch?.[1];

      expect(sessionId).toBeDefined();

      // Verify vote record was created
      const vote = await prisma.vote.findFirst({
        where: { quoteId: targetQuote.id },
      });
      expect(vote).not.toBeNull();
      expect(vote!.sessionId).toBe(sessionId);
    });

    it("returns 409 when voting for the same quote twice", async () => {
      const targetQuote = testQuotes[0]!;

      // First vote
      const firstResponse = await request(app)
        .post(`/api/quotes/${targetQuote.id}/vote`)
        .expect(200);

      const cookies = firstResponse.headers["set-cookie"];

      // Second vote with the same session
      const secondResponse = await request(app)
        .post(`/api/quotes/${targetQuote.id}/vote`)
        .set("Cookie", cookies)
        .expect(409);

      expect(secondResponse.body.error).toBeDefined();
      expect(secondResponse.body.message).toContain("Already voted");
    });

    it("allows voting for different quotes with same session", async () => {
      const quote1 = testQuotes[0]!;
      const quote2 = testQuotes[1]!;

      // Vote for first quote
      const firstResponse = await request(app)
        .post(`/api/quotes/${quote1.id}/vote`)
        .expect(200);

      const cookies = firstResponse.headers["set-cookie"];

      // Vote for second quote with same session
      const secondResponse = await request(app)
        .post(`/api/quotes/${quote2.id}/vote`)
        .set("Cookie", cookies)
        .expect(200);

      expect(secondResponse.body.data.success).toBe(true);
    });

    it("returns 404 for non-existent quote", async () => {
      const response = await request(app)
        .post("/api/quotes/00000000-0000-0000-0000-000000000000/vote")
        .expect(404);

      expect(response.body.error).toBeDefined();
    });

    it("updates hasVoted status after voting", async () => {
      const targetQuote = testQuotes[0]!;

      // Get quote before voting
      const beforeResponse = await request(app)
        .get(`/api/quotes/${targetQuote.id}`)
        .expect(200);

      const cookies = beforeResponse.headers["set-cookie"];
      expect(beforeResponse.body.data.hasVoted).toBe(false);

      // Vote
      await request(app)
        .post(`/api/quotes/${targetQuote.id}/vote`)
        .set("Cookie", cookies)
        .expect(200);

      // Get quote after voting
      const afterResponse = await request(app)
        .get(`/api/quotes/${targetQuote.id}`)
        .set("Cookie", cookies)
        .expect(200);

      expect(afterResponse.body.data.hasVoted).toBe(true);
    });

    it("tracks votes across multiple quotes correctly", async () => {
      const quote1 = testQuotes[0]!;
      const quote2 = testQuotes[1]!;

      // Vote for both quotes
      const firstResponse = await request(app)
        .post(`/api/quotes/${quote1.id}/vote`)
        .expect(200);

      const cookies = firstResponse.headers["set-cookie"];

      await request(app)
        .post(`/api/quotes/${quote2.id}/vote`)
        .set("Cookie", cookies)
        .expect(200);

      // Get quotes list and verify hasVoted status
      const listResponse = await request(app)
        .get("/api/quotes")
        .set("Cookie", cookies)
        .expect(200);

      const votedQuote1 = listResponse.body.data.find(
        (q: { id: string }) => q.id === quote1.id
      );
      const votedQuote2 = listResponse.body.data.find(
        (q: { id: string }) => q.id === quote2.id
      );
      const unvotedQuote = listResponse.body.data.find(
        (q: { id: string }) => q.id === testQuotes[2]!.id
      );

      expect(votedQuote1.hasVoted).toBe(true);
      expect(votedQuote2.hasVoted).toBe(true);
      expect(unvotedQuote.hasVoted).toBe(false);
    });
  });
});
