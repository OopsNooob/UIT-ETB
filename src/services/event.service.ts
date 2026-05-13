import { Request } from "express";
import { EventRepository } from "../repositories/event.repository";
import { SafeLoggingService } from "./safe-logging.service";
import { LoggerHelper } from "../helper/logger.helper";
import { AuditEvent } from "../helper/audit-log.constants";
import { MessageCode } from "../helper/message.constants";

export type CreateEventInput = {
  title: string;
  description: string;
  location: string;
  start_date: string | Date;
  end_date: string | Date;
  total_capacity: number;
  banner_url?: string | null;
};

export type UpdateEventInput = Partial<CreateEventInput> & {
  status?: "draft" | "published" | "cancelled" | "completed";
};

export class EventService {
  private eventRepository: EventRepository;
  private loggingService: SafeLoggingService;

  constructor() {
    this.eventRepository = new EventRepository();
    this.loggingService = new SafeLoggingService();
  }

  async createEvent(req: Request, authUser: any, input: CreateEventInput) {
    if (!authUser || !["organizer", "admin"].includes(authUser.role)) {
      throw new Error(`${MessageCode.MSG_16.description}`);
    }

    const {
      title,
      description,
      location,
      start_date,
      end_date,
      total_capacity,
      banner_url,
    } = input;

    if (!title || !description || !location) {
      throw new Error(
        "Validation error: title, description, and location are required",
      );
    }

    if (!start_date || !end_date) {
      throw new Error("Validation error: start_date and end_date are required");
    }

    if (!Number.isInteger(total_capacity) || total_capacity <= 0) {
      throw new Error(
        "Validation error: total_capacity must be a positive integer",
      );
    }

    const start = new Date(start_date);
    const end = new Date(end_date);
    const now = new Date();

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      throw new Error("Validation error: start_date or end_date is invalid");
    }

    if (start <= now) {
      throw new Error("Validation error: start_date must be in the future");
    }

    if (end <= start) {
      throw new Error("Validation error: end_date must be after start_date");
    }

    const event = await this.eventRepository.createEvent({
      title,
      description,
      location,
      start_date: start,
      end_date: end,
      total_capacity,
      remaining_capacity: total_capacity,
      banner_url: banner_url || null,
      organizer_id: authUser.id,
      created_by: authUser.id,
      status: "draft",
    });

    const log = LoggerHelper.createLogPayload(
      req,
      AuditEvent.BUSINESS.EVENT_CREATED,
      authUser.id,
      {
        targetEntity: "Event",
        targetId: event.id,
        details: {
          eventId: event.id,
          title: event.title,
        },
      },
    );
    this.loggingService.logFire(log);

    return event;
  }

  async updateEvent(authUser: any, eventId: string, input: UpdateEventInput) {
    if (!authUser || !["organizer", "admin"].includes(authUser.role)) {
      throw new Error(`${MessageCode.MSG_16.description}`);
    }

    const event = await this.eventRepository.getEventById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    if (authUser.role !== "admin" && event.organizer_id !== authUser.id) {
      throw new Error("Unauthorized: You can only update your own events");
    }

    const updateData: any = {};

    if (input.title !== undefined) updateData.title = input.title;
    if (input.description !== undefined)
      updateData.description = input.description;
    if (input.location !== undefined) updateData.location = input.location;
    if (input.banner_url !== undefined)
      updateData.banner_url = input.banner_url;
    if (input.status !== undefined) updateData.status = input.status;

    if (input.start_date || input.end_date) {
      const start = input.start_date
        ? new Date(input.start_date)
        : event.start_date;
      const end = input.end_date ? new Date(input.end_date) : event.end_date;

      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        throw new Error("Validation error: start_date or end_date is invalid");
      }

      if (end <= start) {
        throw new Error("Validation error: end_date must be after start_date");
      }

      updateData.start_date = start;
      updateData.end_date = end;
    }

    if (input.total_capacity !== undefined) {
      if (
        !Number.isInteger(input.total_capacity) ||
        input.total_capacity <= 0
      ) {
        throw new Error(
          "Validation error: total_capacity must be a positive integer",
        );
      }

      const sold = event.total_capacity - event.remaining_capacity;
      if (input.total_capacity < sold) {
        throw new Error(
          "Cannot reduce capacity below the number of sold tickets",
        );
      }

      updateData.total_capacity = input.total_capacity;
      updateData.remaining_capacity = input.total_capacity - sold;
    }

    updateData.updated_by = authUser.id;

    return this.eventRepository.updateEvent(event.id, updateData);
  }

  async getEventById(eventId: string) {
    const event = await this.eventRepository.getEventById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    return event;
  }

  async getAllEvents(organizerId?: string, page?: number, limit?: number) {
    return this.eventRepository.getAllEvents(organizerId, { page, limit });
  }
}
