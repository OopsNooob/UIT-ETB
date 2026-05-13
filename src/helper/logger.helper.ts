import { Request } from "express";
import requestIp from "request-ip";
import { AuditLogPayload } from "../types/audit-log-payload";
import { dbLogger } from "../utils/logger.util";

export type AuditEventObject = {
  code: string;
  description: string;
};

function normalizeIp(ip?: string | null): string {
  if (!ip) return "";
  if (ip.startsWith("::ffff:")) return ip.split("::ffff:")[1];
  if (ip === "::1") return "127.0.0.1";
  return ip;
}

export class LoggerHelper {
  static createLogPayload(
    req: Request,
    auditEvent: AuditEventObject,
    userId?: string,
    overrides?: Partial<AuditLogPayload>,
  ): AuditLogPayload {
    const ipAddress = normalizeIp(requestIp.getClientIp(req) || req.clientIp || req.ip);
    const log = {
      userId: userId || undefined,
      eventCode: auditEvent.code,
      severityLevel: "normal",
      action: auditEvent.code.split("-")[0],
      targetEntity: "System",
      targetId: undefined,
      ipAddress,
      details: auditEvent.description,
      ...overrides,
    };

    dbLogger.debug(log);
    return log;
  }

  static createBusinessLog(
    req: Request,
    eventCode: string,
    description: string,
    userId?: string,
    targetEntity?: string,
    targetId?: string,
  ): AuditLogPayload {
    const ip = normalizeIp(requestIp.getClientIp(req) || req.clientIp || req.ip);

    const log = {
      userId: userId || undefined,
      eventCode,
      severityLevel: "normal",
      action: "Business Event",
      targetEntity: targetEntity || "Event",
      targetId: targetId || undefined,
      ipAddress: ip,
      details: description,
    };
    dbLogger.debug(log);
    return log;
  }
}
