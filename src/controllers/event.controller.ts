import { Request, Response, NextFunction } from "express";
import { EventService } from "../services/event.service";
import { LoggerHelper } from "../helper/logger.helper";
import { SafeLoggingService } from "../services/safe-logging.service";
import { AuditEvent } from "../helper/audit-log.constants";

class EventControllerClass {
  private eventService: EventService;
  private loggingService: SafeLoggingService;

  constructor() {
    this.eventService = new EventService();
    this.loggingService = new SafeLoggingService();
  }

  createEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authUser = res.locals.authUser;
      const result = await this.eventService.createEvent(
        req,
        authUser,
        req.body,
      );

      const createdEventLog = LoggerHelper.createBusinessLog(
        req,
        AuditEvent.BUSINESS.EVENT_CREATED.code,
        AuditEvent.BUSINESS.EVENT_CREATED.description,
        authUser?.id,
        "Event",
        result.id,
      );
      this.loggingService.logFire(createdEventLog);

      return res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  };

  updateEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authUser = res.locals.authUser;
      const result = await this.eventService.updateEvent(
        authUser,
        String(req.params.id),
        req.body,
      );

      const updatedEventLog = LoggerHelper.createBusinessLog(
        req,
        AuditEvent.BUSINESS.EVENT_UPDATED_SUCCESSFULLY.code,
        AuditEvent.BUSINESS.EVENT_UPDATED_SUCCESSFULLY.description,
        authUser?.id,
        "Event",
        result.id,
      );
      this.loggingService.logFire(updatedEventLog);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      const failedUpdateLog = LoggerHelper.createBusinessLog(
        req,
        AuditEvent.BUSINESS.EVENT_UPDATE_FAILED.code,
        AuditEvent.BUSINESS.EVENT_UPDATE_FAILED.description,
        res.locals?.authUser?.id,
        "Event",
        String(req.params.id),
      );
      this.loggingService.logFire(failedUpdateLog);
      next(error);
    }
  };

  getEventById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.eventService.getEventById(
        String(req.params.id),
      );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  };

  getAllEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const organizerId = req.query.organizer_id
        ? String(req.query.organizer_id)
        : undefined;
      const page = req.query.page ? Number(req.query.page) : undefined;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;

      const result = await this.eventService.getAllEvents(
        organizerId,
        page,
        limit,
      );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  };
}

export const EventController = new EventControllerClass();
