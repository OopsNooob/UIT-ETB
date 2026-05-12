export interface AuditLogPayload {
  userId?: string;
  eventCode: string;
  severityLevel: string;
  action: string;
  targetEntity: string;
  targetId?: string;
  ipAddress: string;
  details: any;
}
