import { PrismaClient } from "@prisma/client";
import { systemLogger } from "../utils/logger.util";

declare global {
  var isDbHealthy: boolean | undefined;
  var monitorStarted: boolean | undefined;
}

if (globalThis.isDbHealthy === undefined) {
  globalThis.isDbHealthy = true;
}

export const getSystemHealth = () => globalThis.isDbHealthy;

export const startHealthMonitor = (prisma: PrismaClient) => {
  if (globalThis.monitorStarted) return;
  globalThis.monitorStarted = true;

  systemLogger.info("Health Monitor Cron Job started...");

  setInterval(async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;

      if (!globalThis.isDbHealthy) {
        systemLogger.info(
          "SYS-000: System recovered. PostgreSQL connection restored.",
        );
        globalThis.isDbHealthy = true;
      }
    } catch (error: any) {
      globalThis.isDbHealthy = false;
      systemLogger.error(
        `SYS-004: Cannot connect to PostgreSQL. Fail-fast activated! Details: ${error.message}`,
      );
    }
  }, 60000);
};
