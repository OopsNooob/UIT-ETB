import { EventRepository } from "../repositories/event.repository";
import { TicketRepository } from "../repositories/ticket.repository";

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
      throw new Error(
        "Unauthorized: Only organizers or admins can create ticket types",
      );
    }

    if (!Array.isArray(ticketTypes) || ticketTypes.length === 0) {
      throw new Error(
        "Validation error: ticketTypes must be a non-empty array",
      );
    }

    const event = await this.eventRepository.getEventById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    if (authUser.role !== "admin" && event.organizer_id !== authUser.id) {
      throw new Error(
        "Unauthorized: You can only manage ticket types for your own events",
      );
    }

    const totalQuantity = ticketTypes.reduce(
      (sum, ticket) => sum + Number(ticket.total_quantity || 0),
      0,
    );

    if (totalQuantity !== event.total_capacity) {
      throw new Error(
        "Validation error: total ticket quantities must match event capacity",
      );
    }

    const mappedTicketTypes = ticketTypes.map((ticket) => {
      if (!ticket.name || !ticket.description) {
        throw new Error("Validation error: name and description are required");
      }

      if (typeof ticket.price !== "number" || ticket.price < 0) {
        throw new Error(
          "Validation error: price must be greater than or equal to 0",
        );
      }

      if (
        !Number.isInteger(ticket.total_quantity) ||
        ticket.total_quantity <= 0
      ) {
        throw new Error(
          "Validation error: total_quantity must be a positive integer",
        );
      }

      const saleStart = new Date(ticket.sale_start);
      const saleEnd = new Date(ticket.sale_end);

      if (
        Number.isNaN(saleStart.getTime()) ||
        Number.isNaN(saleEnd.getTime())
      ) {
        throw new Error("Validation error: sale_start or sale_end is invalid");
      }

      if (saleEnd <= saleStart) {
        throw new Error("Validation error: sale_end must be after sale_start");
      }

      if (saleEnd > event.end_date) {
        throw new Error(
          "Validation error: sale_end must be before event end_date",
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
