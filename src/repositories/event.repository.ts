import { Prisma } from "@prisma/client";
import { prisma } from "../config/db.connection";

export type EventPaginationOptions = {
  page?: number;
  limit?: number;
};

export class EventRepository {
  async createEvent(data: Prisma.EventUncheckedCreateInput) {
    return prisma.event.create({
      data,
    });
  }

  async updateEvent(id: string, data: Prisma.EventUpdateInput) {
    return prisma.event.update({
      where: { id },
      data,
    });
  }

  async getEventById(id: string) {
    return prisma.event.findFirst({
      where: {
        id,
        deleted_at: null,
      },
    });
  }

  // All users & admins
  async getAllEvents(
    organizerId?: string,
    options: EventPaginationOptions = {},
  ) {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 10;
    const skip = (page - 1) * limit;

    const whereClause = organizerId
      ? { organizer_id: organizerId, deleted_at: null }
      : { deleted_at: null };

    const [items, total] = await prisma.$transaction([
      prisma.event.findMany({
        where: whereClause,
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
      }),
      prisma.event.count({
        where: whereClause,
      }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
