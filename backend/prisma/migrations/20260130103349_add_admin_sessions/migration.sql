-- CreateTable
CREATE TABLE "admin_sessions" (
    "sid" VARCHAR(255) NOT NULL,
    "sess" JSONB NOT NULL,
    "expire" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "admin_sessions_pkey" PRIMARY KEY ("sid")
);

-- CreateIndex
CREATE INDEX "admin_sessions_expire_idx" ON "admin_sessions"("expire");
