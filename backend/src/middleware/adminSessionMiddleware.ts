import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import pg from "pg";

const PgSession = connectPgSimple(session);

const pool = new pg.Pool({
  connectionString: process.env["DATABASE_URL"],
});

export const adminSessionMiddleware = session({
  store: new PgSession({
    pool,
    tableName: "admin_sessions",
    createTableIfMissing: false,
  }),
  secret: process.env["SESSION_SECRET"] ?? "dev-secret-change-in-production",
  resave: false,
  saveUninitialized: false,
  name: "admin.sid",
  cookie: {
    secure: process.env["NODE_ENV"] === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
});
