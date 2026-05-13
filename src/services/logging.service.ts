import { AuditLogPayload } from "../types/audit-log-payload";
import { systemLogger } from "../utils/logger.util";
import { AuditEvent } from "../helper/audit-log.constants";
import { LoggingRepository } from "../repositories/logging.repository";
import { AppError } from "../utils/app-error";
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
      const logError = AuditEvent.SYSTEM.LOG_BROKEN;
      systemLogger.error(
        `${logError.code}: ${logError.description} Details: ${error}`,
      );
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Failed to save log to DB", 500);
    }
  }

  async getLogsService() {
    try {
      const result = await this.loggingRepo.getLogs();
      return result;
    } catch (error) {
      const logError = AuditEvent.SYSTEM.LOG_BROKEN;
      systemLogger.error(
        `${logError.code}: ${logError.description} Details: ${error}`,
      );
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Failed to get logs from DB", 500);
    }
  }
}
