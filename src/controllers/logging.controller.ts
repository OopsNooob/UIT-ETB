import { Request, Response, NextFunction } from "express";
import { LoggingService } from "../services/logging.service";
class LoggingControllerClass {
  private loggingService: LoggingService;

  constructor() {
    this.loggingService = new LoggingService();
  }

  createLog = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body;

      const result = await this.loggingService.createLogService(body);

      return res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  };

  getLogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const logs = await this.loggingService.getLogsService();

      return res.status(200).json({
        success: true,
        data: logs,
      });
    } catch (error: any) {
      next(error);
    }
  };
}

export const LoggingController = new LoggingControllerClass();
