import { prisma } from "../config/db.connection";
import { Prisma } from "@prisma/client";

export class UserRepository {
  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email, deleted_at: null },
    });
  }

  async createUser(data: Prisma.UserCreateInput) {
    return await prisma.user.create({
      data,
    });
  }
}
