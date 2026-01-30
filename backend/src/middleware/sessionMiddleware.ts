import type { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import {
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_MAX_AGE,
} from "@unpossible/shared";

declare module "express-serve-static-core" {
  interface Request {
    sessionId: string;
  }
}

export const sessionMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let sessionId = req.cookies[SESSION_COOKIE_NAME] as string | undefined;

  if (!sessionId) {
    sessionId = uuidv4();
    res.cookie(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: SESSION_COOKIE_MAX_AGE,
      secure: process.env["NODE_ENV"] === "production",
    });
  }

  req.sessionId = sessionId;
  next();
};
