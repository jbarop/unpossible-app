import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { execSync } from "child_process";
import { prisma } from "../lib/prisma.js";

describe("Database Seeding", () => {
  beforeAll(async () => {
    // Clean up the database before seeding
    await prisma.vote.deleteMany();
    await prisma.quote.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should seed the database with quotes when running db:seed", async () => {
    // Verify database is empty
    const countBefore = await prisma.quote.count();
    expect(countBefore).toBe(0);

    // Run the seed script
    execSync("yarn db:seed", {
      cwd: process.cwd(),
      stdio: "pipe",
    });

    // Verify quotes were seeded
    const countAfter = await prisma.quote.count();
    expect(countAfter).toBeGreaterThan(0);
    expect(countAfter).toBe(50); // We expect exactly 50 quotes from seed.ts
  });

  it("should have valid quote data after seeding", async () => {
    const quotes = await prisma.quote.findMany({ take: 5 });

    for (const quote of quotes) {
      expect(quote.id).toBeDefined();
      expect(quote.text).toBeTruthy();
      expect(quote.text.length).toBeGreaterThan(0);
      expect(quote.season).toBeGreaterThanOrEqual(1);
      expect(quote.episode).toBeGreaterThanOrEqual(1);
      expect(quote.votes).toBeGreaterThanOrEqual(0);
    }
  });

  it("should include the famous 'unpossible' quote", async () => {
    const unpossibleQuote = await prisma.quote.findFirst({
      where: {
        text: {
          contains: "unpossible",
        },
      },
    });

    expect(unpossibleQuote).not.toBeNull();
    expect(unpossibleQuote?.text).toContain("Me fail English?");
  });
});
