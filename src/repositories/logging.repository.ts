import { prisma } from "../config/db.connection";
import { AuditLogPayload } from "../types/audit-log-payload";

export class LoggingRepository {
  async createLog(payload: AuditLogPayload) {
    return await prisma.auditLog.create({
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
  }

  async getLogs() {
    return await prisma.auditLog.findMany();
  }
}
