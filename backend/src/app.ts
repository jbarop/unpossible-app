import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { httpLogger } from "./lib/logger.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { sessionMiddleware } from "./middleware/sessionMiddleware.js";
import { adminSessionMiddleware } from "./middleware/adminSessionMiddleware.js";
import { generalLimiter } from "./middleware/rateLimiter.js";
import { healthRouter } from "./routes/health.js";
import { quotesRouter } from "./routes/quotes.js";
import { votesRouter } from "./routes/votes.js";
import { adminAuthRouter } from "./routes/admin/auth.js";
import { adminQuotesRouter } from "./routes/admin/quotes.js";

export function createApp(): Express {
  const app = express();

  // Request logging
  app.use(httpLogger);

  // Security headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:"],
          fontSrc: ["'self'"],
          connectSrc: ["'self'"],
          objectSrc: ["'none'"],
          frameAncestors: ["'none'"],
        },
      },
      crossOriginEmbedderPolicy: false, // Disabled for local development
    })
  );

  // Rate limiting
  app.use(generalLimiter);

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

  // Admin routes with their own session store
  app.use("/api/admin", adminSessionMiddleware);
  app.use("/api/admin", adminAuthRouter);
  app.use("/api/admin/quotes", adminQuotesRouter);

  // Error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
