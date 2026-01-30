-- CreateTable
CREATE TABLE "quotes" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "season" INTEGER NOT NULL,
    "episode" INTEGER NOT NULL,
    "votes" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "votes" (
    "id" TEXT NOT NULL,
    "quote_id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "votes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "quotes_votes_idx" ON "quotes"("votes");

-- CreateIndex
CREATE INDEX "quotes_season_idx" ON "quotes"("season");

-- CreateIndex
CREATE INDEX "quotes_season_episode_idx" ON "quotes"("season", "episode");

-- CreateIndex
CREATE INDEX "votes_session_id_idx" ON "votes"("session_id");

-- CreateIndex
CREATE UNIQUE INDEX "votes_quote_id_session_id_key" ON "votes"("quote_id", "session_id");

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_quote_id_fkey" FOREIGN KEY ("quote_id") REFERENCES "quotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
