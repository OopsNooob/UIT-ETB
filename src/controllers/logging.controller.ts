import { Request, Response } from "express";
import { LoggingService } from "../services/logging.service";
class LoggingControllerClass {
  private loggingService: LoggingService;

  constructor() {
    this.loggingService = new LoggingService();
  }

  createLog = async (req: Request, res: Response) => {
    try {
      const body = req.body;

      const result = await this.loggingService.createLogService(body);

      return res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  };

  getLogs = async (req: Request, res: Response) => {
    try {
      const logs = await this.loggingService.getLogsService();

      return res.status(200).json({
        success: true,
        data: logs,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  };
}

export const LoggingController = new LoggingControllerClass();
