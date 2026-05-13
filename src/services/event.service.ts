import { Request } from "express";
import { EventRepository } from "../repositories/event.repository";
import { MessageCode } from "../helper/message.constants";
import { AppError } from "../utils/app-error";

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

  constructor() {
    this.eventRepository = new EventRepository();
  }

  async createEvent(req: Request, authUser: any, input: CreateEventInput) {
    if (!authUser || !["organizer", "admin"].includes(authUser.role)) {
      throw new AppError(`${MessageCode.MSG_16.description}`, 403);
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
      throw new AppError(
        "Validation error: title, description, and location are required",
        400,
      );
    }

    if (!start_date || !end_date) {
      throw new AppError(
        "Validation error: start_date and end_date are required",
        400,
      );
    }

    if (!Number.isInteger(total_capacity) || total_capacity <= 0) {
      throw new AppError(
        "Validation error: total_capacity must be a positive integer",
        400,
      );
    }

    const start = new Date(start_date);
    const end = new Date(end_date);
    const now = new Date();

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      throw new AppError(
        "Validation error: start_date or end_date is invalid",
        400,
      );
    }

    if (start <= now) {
      throw new AppError(
        "Validation error: start_date must be in the future",
        400,
      );
    }

    if (end <= start) {
      throw new AppError(
        "Validation error: end_date must be after start_date",
        400,
      );
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

    return event;
  }

  async updateEvent(authUser: any, eventId: string, input: UpdateEventInput) {
    if (!authUser || !["organizer", "admin"].includes(authUser.role)) {
      throw new AppError(`${MessageCode.MSG_16.description}`, 403);
    }

    const event = await this.eventRepository.getEventById(eventId);
    if (!event) {
      throw new AppError("Event not found", 404);
    }

    if (authUser.role !== "admin" && event.organizer_id !== authUser.id) {
      throw new AppError(
        "Unauthorized: You can only update your own events",
        403,
      );
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
        throw new AppError(
          "Validation error: start_date or end_date is invalid",
          400,
        );
      }

      if (end <= start) {
        throw new AppError(
          "Validation error: end_date must be after start_date",
          400,
        );
      }

      updateData.start_date = start;
      updateData.end_date = end;
    }

    if (input.total_capacity !== undefined) {
      if (
        !Number.isInteger(input.total_capacity) ||
        input.total_capacity <= 0
      ) {
        throw new AppError(
          "Validation error: total_capacity must be a positive integer",
          400,
        );
      }

      const sold = event.total_capacity - event.remaining_capacity;
      if (input.total_capacity < sold) {
        throw new AppError(
          "Cannot reduce capacity below the number of sold tickets",
          400,
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
      throw new AppError("Event not found", 404);
    }

    return event;
  }

  async getAllEvents(organizerId?: string, page?: number, limit?: number) {
    return this.eventRepository.getAllEvents(organizerId, { page, limit });
  }
}
