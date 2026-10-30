import app from "./app";
import { logger } from "./lib/logger";
import { ensureStaffSeeded } from "./lib/firebase-admin";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function start(): Promise<void> {
  const seededCount = await ensureStaffSeeded();
  logger.info({ seededCount }, "Firebase staff records reconciled");

  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }

    logger.info({ port }, "Server listening");
  });
}

void start().catch((error: unknown) => {
  const errorName = error instanceof Error ? error.name : "UnknownError";
  logger.error({ errorName }, "API server startup failed during Firebase initialization");
  process.exitCode = 1;
});
