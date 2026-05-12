import { PrismaClient } from "@prisma/client";
import { systemLogger } from "../utils/logger.util";
import { AuditEvent } from "../helper/audit-log.constants";

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
        const recoveryLog = AuditEvent.SYSTEM.DB_CONNECTION_STATUS_CHANGED;
        systemLogger.info(`${recoveryLog.code}: ${recoveryLog.description}`);
        globalThis.isDbHealthy = true;
        return;
      }

      const healthyLog = AuditEvent.SYSTEM.DB_WORKING;
      systemLogger.info(`${healthyLog.code}: ${healthyLog.description}`);
    } catch (error: any) {
      globalThis.isDbHealthy = false;
      const dbFailureLog = AuditEvent.SYSTEM.DB_NOT_WORKING;
      systemLogger.error(
        `${dbFailureLog.code}: ${dbFailureLog.description} Details: ${error.message}`,
      );
    }
  }, 60000);
};
