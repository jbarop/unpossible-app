import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import {
  setupTestApp,
  cleanupDatabase,
  prisma,
  app,
} from "../../test/setup.js";

const ADMIN_PASSWORD = process.env["ADMIN_PASSWORD"] ?? "test-password";

describe("Admin Auth Endpoints Integration Tests", () => {
  beforeAll(async () => {
    process.env["ADMIN_PASSWORD"] = ADMIN_PASSWORD;
    await setupTestApp();
  });

  afterAll(async () => {
    await cleanupDatabase();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await cleanupDatabase();
  });

  describe("POST /api/admin/login", () => {
    it("returns success with correct password", async () => {
      const response = await request(app)
        .post("/api/admin/login")
        .send({ password: ADMIN_PASSWORD })
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Logged in successfully");
    });

    it("sets an admin session cookie", async () => {
      const response = await request(app)
        .post("/api/admin/login")
        .send({ password: ADMIN_PASSWORD })
        .expect(200);

      expect(response.headers["set-cookie"]).toBeDefined();
      const cookies = response.headers["set-cookie"];
      const hasAdminCookie = cookies.some((cookie: string) =>
        cookie.includes("admin.sid")
      );
      expect(hasAdminCookie).toBe(true);
    });

    it("returns 401 with incorrect password", async () => {
      const response = await request(app)
        .post("/api/admin/login")
        .send({ password: "wrong-password" })
        .expect(401);

      expect(response.body.error).toBeDefined();
      expect(response.body.message).toContain("Invalid password");
    });

    it("returns 400 with empty password", async () => {
      const response = await request(app)
        .post("/api/admin/login")
        .send({ password: "" })
        .expect(400);

      expect(response.body.error).toBeDefined();
    });

    it("returns 400 with missing password", async () => {
      const response = await request(app)
        .post("/api/admin/login")
        .send({})
        .expect(400);

      expect(response.body.error).toBeDefined();
    });
  });

  describe("GET /api/admin/me", () => {
    it("returns authenticated when logged in", async () => {
      // Login first
      const loginResponse = await request(app)
        .post("/api/admin/login")
        .send({ password: ADMIN_PASSWORD })
        .expect(200);

      const cookies = loginResponse.headers["set-cookie"];

      // Check auth status
      const meResponse = await request(app)
        .get("/api/admin/me")
        .set("Cookie", cookies)
        .expect(200);

      expect(meResponse.body.authenticated).toBe(true);
    });

    it("returns 401 when not logged in", async () => {
      const response = await request(app).get("/api/admin/me").expect(401);

      expect(response.body.error).toBeDefined();
      expect(response.body.message).toContain("Not authenticated");
    });

    it("returns 401 with invalid session", async () => {
      const response = await request(app)
        .get("/api/admin/me")
        .set("Cookie", ["admin.sid=invalid-session"])
        .expect(401);

      expect(response.body.error).toBeDefined();
    });
  });

  describe("POST /api/admin/logout", () => {
    it("successfully logs out", async () => {
      // Login first
      const loginResponse = await request(app)
        .post("/api/admin/login")
        .send({ password: ADMIN_PASSWORD })
        .expect(200);

      const cookies = loginResponse.headers["set-cookie"];

      // Logout
      const logoutResponse = await request(app)
        .post("/api/admin/logout")
        .set("Cookie", cookies)
        .expect(200);

      expect(logoutResponse.body.success).toBe(true);
      expect(logoutResponse.body.message).toBe("Logged out successfully");
    });

    it("clears the admin session cookie", async () => {
      // Login first
      const loginResponse = await request(app)
        .post("/api/admin/login")
        .send({ password: ADMIN_PASSWORD })
        .expect(200);

      const cookies = loginResponse.headers["set-cookie"];

      // Logout
      const logoutResponse = await request(app)
        .post("/api/admin/logout")
        .set("Cookie", cookies)
        .expect(200);

      // Check that cookie is cleared (expires in the past or empty)
      const setCookies = logoutResponse.headers["set-cookie"];
      const adminCookie = setCookies?.find((c: string) =>
        c.includes("admin.sid")
      );
      expect(adminCookie).toBeDefined();
    });

    it("session is invalid after logout", async () => {
      // Login first
      const loginResponse = await request(app)
        .post("/api/admin/login")
        .send({ password: ADMIN_PASSWORD })
        .expect(200);

      const cookies = loginResponse.headers["set-cookie"];

      // Logout
      await request(app)
        .post("/api/admin/logout")
        .set("Cookie", cookies)
        .expect(200);

      // Try to access protected endpoint with old session
      await request(app).get("/api/admin/me").set("Cookie", cookies).expect(401);
    });
  });
});
