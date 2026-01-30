import { Router } from "express";
import { z } from "zod";
import { UnauthorizedError } from "../../lib/errors.js";
import { asyncHandler } from "../../middleware/errorHandler.js";

declare module "express-session" {
  interface SessionData {
    isAdmin?: boolean;
  }
}

export const adminAuthRouter = Router();

const loginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

adminAuthRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { password } = loginSchema.parse(req.body);

    const adminPassword = process.env["ADMIN_PASSWORD"];
    if (!adminPassword) {
      throw new Error("ADMIN_PASSWORD not configured");
    }

    if (password !== adminPassword) {
      throw new UnauthorizedError("Invalid password");
    }

    req.session.isAdmin = true;

    res.json({ success: true, message: "Logged in successfully" });
  })
);

adminAuthRouter.post(
  "/logout",
  asyncHandler(async (req, res) => {
    await new Promise<void>((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    res.clearCookie("admin.sid");
    res.json({ success: true, message: "Logged out successfully" });
  })
);

adminAuthRouter.get(
  "/me",
  asyncHandler(async (req, res) => {
    if (!req.session.isAdmin) {
      throw new UnauthorizedError("Not authenticated");
    }

    res.json({ authenticated: true });
  })
);
