export const runtime = "nodejs";

import { prisma } from "./src/config/db.connection";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { systemLogger } = await import("./src/utils/logger.util");
    systemLogger.info(
      "[STARTUP] Next.js server initializing - instrumentation hook triggered",
    );
    systemLogger.info("[STARTUP] Database connection and health monitor ready");
  }
}

/**
 * Next.js Instrumentation Hook
 * https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 *
 * Runs ONCE when the server starts:
 * - Initializes Prisma database connection
 * - Starts health monitor cron job
 * - Logs startup messages for debugging
 */
