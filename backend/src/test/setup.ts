import { prisma } from "../lib/prisma.js";
import { createApp } from "../app.js";
import type { Express } from "express";

export let app: Express;

export async function setupTestApp() {
  app = createApp();
  return app;
}

export async function cleanupDatabase() {
  await prisma.vote.deleteMany();
  await prisma.quote.deleteMany();
  // Note: We don't delete admin_sessions here because:
  // 1. Each test logs in fresh and gets new cookies
  // 2. The pg-simple session store uses a separate pool which can cause race conditions
  // 3. Sessions expire naturally or are cleaned up in afterAll
}

export async function seedTestQuotes() {
  const quotes = [
    { text: "Me fail English? That's unpossible!", season: 6, episode: 8, votes: 10 },
    { text: "I'm learnding!", season: 9, episode: 14, votes: 5 },
    { text: "My cat's breath smells like cat food.", season: 3, episode: 22, votes: 15 },
    { text: "Hi, Super Nintendo Chalmers!", season: 7, episode: 21, votes: 20 },
    { text: "I bent my wookie.", season: 5, episode: 12, votes: 8 },
  ];

  const created = await prisma.quote.createMany({
    data: quotes,
  });

  return prisma.quote.findMany({ orderBy: { votes: "desc" } });
}

export { prisma };
