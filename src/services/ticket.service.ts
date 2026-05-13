import { EventRepository } from "../repositories/event.repository";
import { TicketRepository } from "../repositories/ticket.repository";
import { AppError } from "../utils/app-error";

export type CreateTicketTypeInput = {
  name: string;
  description: string;
  price: number;
  total_quantity: number;
  sale_start: string | Date;
  sale_end: string | Date;
};

export class TicketService {
  private eventRepository: EventRepository;
  private ticketRepository: TicketRepository;

  constructor() {
    this.eventRepository = new EventRepository();
    this.ticketRepository = new TicketRepository();
  }

  async createTicketTypesForEvent(
    authUser: any,
    eventId: string,
    ticketTypes: CreateTicketTypeInput[],
  ) {
    if (!authUser || !["organizer", "admin"].includes(authUser.role)) {
      throw new AppError(
        "Unauthorized: Only organizers or admins can create ticket types",
        403,
      );
    }

    if (!Array.isArray(ticketTypes) || ticketTypes.length === 0) {
      throw new AppError(
        "Validation error: ticketTypes must be a non-empty array",
        400,
      );
    }

    const event = await this.eventRepository.getEventById(eventId);
    if (!event) {
      throw new AppError("Event not found", 404);
    }

    if (authUser.role !== "admin" && event.organizer_id !== authUser.id) {
      throw new AppError(
        "Unauthorized: You can only manage ticket types for your own events",
        403,
      );
    }

    const totalQuantity = ticketTypes.reduce(
      (sum, ticket) => sum + Number(ticket.total_quantity || 0),
      0,
    );

    if (totalQuantity !== event.total_capacity) {
      throw new AppError(
        "Validation error: total ticket quantities must match event capacity",
        400,
      );
    }

    const mappedTicketTypes = ticketTypes.map((ticket) => {
      if (!ticket.name || !ticket.description) {
        throw new AppError(
          "Validation error: name and description are required",
          400,
        );
      }

      if (typeof ticket.price !== "number" || ticket.price < 0) {
        throw new AppError(
          "Validation error: price must be greater than or equal to 0",
          400,
        );
      }

      if (
        !Number.isInteger(ticket.total_quantity) ||
        ticket.total_quantity <= 0
      ) {
        throw new AppError(
          "Validation error: total_quantity must be a positive integer",
          400,
        );
      }

      const saleStart = new Date(ticket.sale_start);
      const saleEnd = new Date(ticket.sale_end);

      if (
        Number.isNaN(saleStart.getTime()) ||
        Number.isNaN(saleEnd.getTime())
      ) {
        throw new AppError(
          "Validation error: sale_start or sale_end is invalid",
          400,
        );
      }

      if (saleEnd <= saleStart) {
        throw new AppError(
          "Validation error: sale_end must be after sale_start",
          400,
        );
      }

      if (saleEnd > event.end_date) {
        throw new AppError(
          "Validation error: sale_end must be before event end_date",
          400,
        );
      }

      return {
        event_id: eventId,
        name: ticket.name,
        description: ticket.description,
        price: ticket.price,
        total_quantity: ticket.total_quantity,
        sale_start: saleStart,
        sale_end: saleEnd,
        created_by: authUser.id,
      };
    });

    return this.ticketRepository.createTicketTypes(mappedTicketTypes);
  }

  async getTicketTypesByEventId() {}
}
