import type { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../lib/errors.js";

export const requireAdmin = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.session.isAdmin) {
    throw new UnauthorizedError("Admin authentication required");
  }
  next();
};
