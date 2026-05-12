import { AuditLogPayload } from "../types/audit-log-payload";
import { systemLogger } from "../utils/logger.util";
import { AuditEvent } from "../helper/audit-log.constants";
import { LoggingRepository } from "../repositories/logging.repository";
export class LoggingService {
  private loggingRepo: LoggingRepository;

  constructor() {
    this.loggingRepo = new LoggingRepository();
  }

  async createLogService(payload: AuditLogPayload) {
    try {
      const result = await this.loggingRepo.createLog(payload);
      return result;
    } catch (error) {
      console.error("Failed to save log to DB:", error);
      const logError = AuditEvent.SYSTEM.LOG_BROKEN;
      systemLogger.error(
        `${logError.code}: ${logError.description} Details: ${error}`,
      );
      throw error;
    }
  }
}
