import { prisma } from "../config/db.connection";
import { AuditLogPayload } from "../types/audit-log-payload";
import { systemLogger } from "../utils/logger.util";
import { AuditEvent } from "../helper/audit-log.constants";

// Logging
export class AuditService {
  static log(payload: AuditLogPayload) {
    try {
      prisma.auditLog.create({
        data: {
          user_id: payload.userId || null,
          event_code: payload.eventCode,
          severity_level: payload.severityLevel,
          action: payload.action,
          target_entity: payload.targetEntity,
          target_id: payload.targetId || null,
          ip_address: payload.ipAddress,
          details: payload.details,
        },
      });
    } catch (error) {
      console.error("Failed to save log to DB:", error);
      const logError = AuditEvent.SYSTEM.LOG_BROKEN;
      systemLogger.error(
        `${logError.code}: ${logError.description} Details: ${error}`,
      );
    }
  }
}
