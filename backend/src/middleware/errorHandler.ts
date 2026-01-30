import type {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import { ZodError } from "zod";
import { AppError, ValidationError } from "../lib/errors.js";
import { logger } from "../lib/logger.js";

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  // Express error handlers require 4 parameters
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    if (err instanceof ValidationError && err.errors) {
      res.status(err.statusCode).json({
        error: err.code,
        message: err.message,
        statusCode: err.statusCode,
        errors: err.errors,
      });
      return;
    }

    res.status(err.statusCode).json({
      error: err.code,
      message: err.message,
      statusCode: err.statusCode,
    });
    return;
  }

  if (err instanceof ZodError) {
    const errors: Record<string, string[]> = {};
    for (const issue of err.issues) {
      const path = issue.path.join(".");
      errors[path] ??= [];
      errors[path].push(issue.message);
    }

    res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "Validation failed",
      statusCode: 400,
      errors,
    });
    return;
  }

  logger.error({ err }, "Unhandled error");

  res.status(500).json({
    error: "INTERNAL_ERROR",
    message: "Internal server error",
    statusCode: 500,
  });
};

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({
    error: "NOT_FOUND",
    message: "Route not found",
    statusCode: 404,
  });
};

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const asyncHandler =
  (fn: AsyncHandler) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
