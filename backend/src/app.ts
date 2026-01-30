import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { httpLogger } from "./lib/logger.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { sessionMiddleware } from "./middleware/sessionMiddleware.js";
import { healthRouter } from "./routes/health.js";
import { quotesRouter } from "./routes/quotes.js";
import { votesRouter } from "./routes/votes.js";

export function createApp(): Express {
  const app = express();

  // Request logging
  app.use(httpLogger);

  // CORS configuration
  app.use(
    cors({
      origin: process.env["FRONTEND_URL"] ?? "http://localhost:5173",
      credentials: true,
    })
  );

  // Body parsing
  app.use(express.json());

  // Cookie parsing
  app.use(cookieParser());

  // Session middleware for visitor tracking
  app.use(sessionMiddleware);

  // Routes
  app.use("/api/health", healthRouter);
  app.use("/api/quotes", quotesRouter);
  app.use("/api/quotes", votesRouter);

  // Error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
