import { LoggingService } from "./logging.service";
import { AuditLogPayload } from "../types/audit-log-payload";
import { AuditEvent } from "../helper/audit-log.constants";
import { systemLogger } from "../utils/logger.util";

export class SafeLoggingService {
  private loggingService: LoggingService;

  constructor() {
    this.loggingService = new LoggingService();
  }

  async logAsync(payload: AuditLogPayload): Promise<void> {
    try {
      await this.loggingService.createLogService(payload);
    } catch (error: any) {
      const failureLog = AuditEvent.SYSTEM.LOG_BROKEN;
      systemLogger.error(
        `${failureLog.code}: ${failureLog.description} Details: ${error.message}`,
      );
    }
  }

  logFire(payload: AuditLogPayload): void {
    this.logAsync(payload);
  }
}
