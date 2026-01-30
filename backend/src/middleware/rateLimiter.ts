import rateLimit from "express-rate-limit";

const isDevMode = process.env["NODE_ENV"] === "development";

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: isDevMode ? 1000 : 100, // Higher limit in development for E2E testing
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});

export const voteLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: isDevMode ? 100 : 10, // Higher limit in development for E2E testing
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many votes, please try again later." },
});
