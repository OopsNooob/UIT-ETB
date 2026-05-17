import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/user.service";
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

  register = async (req: Request, res: Response, next: NextFunction) => {
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
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body;

      const result = await this.authService.loginUser(body);

      const log = LoggerHelper.createLogPayload(
        req,
        AuditEvent.SECURITY.USER_LOGIN,
        result.user.id,
      );
      this.loggingService.logFire(log);

      return res.status(200).json({
        success: true,
        user: result.user,
        token: result.token,
        message: result.message,
      });
    } catch (error: any) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authUser: any = (res.locals && res.locals.authUser) || null;
      const userId = authUser?.id;
      const result = await this.authService.logout(userId);

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      next(error);
    }
  };

  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authUser: any = (res.locals && res.locals.authUser) || null;
      const userId = authUser?.id;
      const result = await this.authService.getProfile(userId);

      return res.status(200).json({
        success: true,
        user: result.user,
      });
    } catch (error: any) {
      next(error);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authUser: any = (res.locals && res.locals.authUser) || null;
      const authUserId = authUser?.id;
      const authUserRole = authUser?.role;

      const body = req.body;

      const targetId = req.params.id as string;

      if (authUserId !== targetId && authUserRole !== "admin") {
        return res.status(403).json({
          success: false,
          message:
            "Forbidden: You do not have permission to perform this action.",
        });
      }

      const result = await this.authService.updateProfile(body, targetId);

      return res.status(200).json({
        success: true,
        user: result,
      });
    } catch (error: any) {
      next(error);
    }
  };

  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.getUsers();

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  };

  ban = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authUser: any = (res.locals && res.locals.authUser) || null;
      const adminId = authUser?.id;

      const targetId = req.params.id as string;

      const result = await this.authService.banUser(adminId, targetId);

      const banLog = LoggerHelper.createBusinessLog(
        req,
        AuditEvent.BUSINESS.BAN.code,
        AuditEvent.BUSINESS.BAN.description,
        authUser?.id,
        "User",
        targetId,
      );
      this.loggingService.logFire(banLog);

      return res.status(200).json({
        success: true,
        user: result,
      });
    } catch (error: any) {
      next(error);
    }
  };

  unban = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authUser: any = (res.locals && res.locals.authUser) || null;
      const adminId = authUser?.id;

      const targetId = req.params.id as string;

      const result = await this.authService.unbanUser(adminId, targetId);

      const unbanLog = LoggerHelper.createBusinessLog(
        req,
        AuditEvent.BUSINESS.UNBAN.code,
        AuditEvent.BUSINESS.UNBAN.description,
        authUser?.id,
        "User",
        targetId,
      );
      this.loggingService.logFire(unbanLog);

      return res.status(200).json({
        success: true,
        user: result,
      });
    } catch (error: any) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authUser: any = (res.locals && res.locals.authUser) || null;

      const targetId = req.params.id as string;

      await this.authService.deleteUser(targetId);

      const deleteLog = LoggerHelper.createBusinessLog(
        req,
        AuditEvent.BUSINESS.DELETE.code,
        AuditEvent.BUSINESS.DELETE.description,
        authUser?.id,
        "User",
        targetId,
      );
      this.loggingService.logFire(deleteLog);

      return res.status(200).json({
        success: true,
      });
    } catch (error: any) {
      next(error);
    }
  };
}

export const AuthController = new AuthControllerClass();
