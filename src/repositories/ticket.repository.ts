import { Prisma } from "@prisma/client";
import { prisma } from "../config/db.connection";

export class TicketRepository {
  async createTicketTypes(data: Prisma.TicketTypeUncheckedCreateInput[]) {
    return prisma.$transaction(
      data.map((ticketType) => prisma.ticketType.create({ data: ticketType })),
    );
  }

  async findTicketTypeByEventId(eventId: string) {
    return prisma.ticketType.findMany({
      where: {
        event_id: eventId,
        deleted_at: null,
      },
      orderBy: { created_at: "asc" },
    });
  }
}
