import { createApp } from "./app.js";
import { logger } from "./lib/logger.js";
import { prisma } from "./lib/prisma.js";

const PORT = process.env["PORT"] ?? 3000;

const app = createApp();

async function main() {
  try {
    await prisma.$connect();
    logger.info("Connected to database");

    app.listen(PORT, () => {
      logger.info({ port: PORT }, "Server started");
    });
  } catch (error) {
    logger.fatal({ error }, "Failed to start server");
    process.exit(1);
  }
}

function handleShutdown(signal: string) {
  return () => {
    logger.info(`${signal} received, shutting down...`);
    void prisma.$disconnect().finally(() => {
      process.exit(0);
    });
  };
}

process.on("SIGTERM", handleShutdown("SIGTERM"));
process.on("SIGINT", handleShutdown("SIGINT"));

main().catch((error: unknown) => {
  logger.fatal({ error }, "Unhandled error during startup");
  process.exit(1);
});
