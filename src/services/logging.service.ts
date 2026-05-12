import { prisma } from "../config/db.connection";

interface AuditLogPayload {
  userId?: string;
  eventCode: string;
  severityLevel: string;
  action: string;
  targetEntity: string;
  targetId?: string;
  ipAddress: string;
  details: any;
}

export class AuditService {
  static async log(payload: AuditLogPayload) {
    try {
      await prisma.auditLog.create({
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
    }
  }
}
