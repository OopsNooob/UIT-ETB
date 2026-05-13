import { Request, Response, NextFunction } from "express";
import { TicketService } from "../services/ticket.service";
import { LoggerHelper } from "../helper/logger.helper";

class TicketControllerClass {
  private ticketService: TicketService;

  constructor() {
    this.ticketService = new TicketService();
  }

  createTicketTypes = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const authUser = res.locals.authUser;
      const eventId = req.params.eventId;
      const payload = req.body?.ticketTypes || req.body;
      const result = await this.ticketService.createTicketTypesForEvent(
        authUser,
        eventId,
        payload,
      );

      return res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  };
}

export const TicketController = new TicketControllerClass();
