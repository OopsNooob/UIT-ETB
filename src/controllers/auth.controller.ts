import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { SafeLoggingService } from "../services/safe-logging.service";
import { LoggerHelper } from "../helper/logger.helper";
import { AuditEvent } from "../helper/audit-log.constants";

class AuthControllerClass {
  private authService: AuthService;
  private loggingService: SafeLoggingService;

  constructor() {
    this.authService = new AuthService();
    this.loggingService = new SafeLoggingService();
  }

  register = async (req: Request, res: Response) => {
    try {
      const body = req.body;

      const user = await this.authService.registerUser(body);

      const log = LoggerHelper.createLogPayload(
        req,
        AuditEvent.SECURITY.USER_REGISTERED,
        user.id,
      );
      this.loggingService.logFire(log);

      return res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const body = req.body;

      const result = await this.authService.loginUser(body);

      const log = LoggerHelper.createLogPayload(
        req,
        AuditEvent.SECURITY.USER_LOGIN,
        result.user.id,
      );
      this.loggingService.logFire(log);

      console.log(log);

      return res.status(200).json({
        success: true,
        user: result.user,
        token: result.token,
        message: result.message,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  };

  logout = async (req: Request, res: Response) => {
    try {
      const authUser: any = (res.locals && res.locals.authUser) || null;
      const userId = authUser?.id;
      const result = await this.authService.logout(userId);

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  };

  getProfile = async (req: Request, res: Response) => {
    try {
      const authUser: any = (res.locals && res.locals.authUser) || null;
      const userId = authUser?.id;
      const result = await this.authService.getProfile(userId);

      return res.status(200).json({
        success: true,
        user: result.user,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  };
}

export const AuthController = new AuthControllerClass();
