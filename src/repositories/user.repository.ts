import { prisma } from "../config/db.connection";
import { Prisma } from "@prisma/client";

export type UserPaginationOptions = {
  page?: number;
  limit?: number;
};

export class UserRepository {
  async getAllUsers(options: UserPaginationOptions = {}) {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 10;
    const skip = (page - 1) * limit;

    const whereClause = { deleted_at: null };

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          status: true,
          is_active: true,
          created_at: true,
          updated_at: true,
        },
      }),
      prisma.user.count({
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

  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email, deleted_at: null },
    });
  }

  async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id, deleted_at: null },
      omit: {
        password_hash: true,
      },
    });
  }

  async createUser(data: Prisma.UserCreateInput) {
    return await prisma.user.create({
      data,
    });
  }

  async updateUser(data: Prisma.UserUpdateInput, targetId: string) {
    return await prisma.user.update({
      where: {
        id: targetId,
      },
      data,
      omit: {
        password_hash: true,
      },
    });
  }

  async deleteUser(targetId: string) {
    return await prisma.user.update({
      where: {
        id: targetId,
      },
      data: {
        deleted_at: new Date(),
      },
      omit: {
        password_hash: true,
      },
    });
  }
}
