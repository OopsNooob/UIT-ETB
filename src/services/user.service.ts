import { UserRepository } from "../repositories/user.repository";
import { EventRepository } from "../repositories/event.repository";
import { TicketRepository } from "../repositories/ticket.repository";
import bcrypt from "bcrypt";
import { MessageCode } from "../helper/message.constants";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/app-error";
import { Prisma } from "@prisma/client";
import { UpdateProfilePayload } from "../types/user-payload";

export class AuthService {
  private userRepo: UserRepository;
  private eventRepo: EventRepository;
  private ticketRepo: TicketRepository;

  constructor() {
    this.userRepo = new UserRepository();
    this.eventRepo = new EventRepository();
    this.ticketRepo = new TicketRepository();
  }

  generateToken(payload: any) {
    const JWT_SECRET = process.env.JWT_SECRET || "etb-super-secret-key-2026";
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });

    return accessToken;
  }

  async registerUser(payload: any) {
    const { name, email, password, role } = payload;

    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) {
      throw new AppError(`${MessageCode.MSG_0.description}`, 409);
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await this.userRepo.createUser({
      name,
      email,
      password_hash: hashedPassword,
      role: role || "user",
    });

    const { password_hash, ...safeUser } = newUser;
    void password_hash;
    return safeUser;
  }

  async loginUser(payload: any) {
    const { email, password } = payload;

    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new AppError(`${MessageCode.MSG_2.description}`, 401);
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new AppError(`${MessageCode.MSG_2.description}`, 401);
    }

    if (user.status === "banned") {
      throw new AppError("Your account has been banned", 403);
    }

    const token = this.generateToken({ id: user.id, role: user.role });
    const message = MessageCode.MSG_3.description;

    return {
      user: {
        name: user.name,
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        is_active: user.is_active,
        created_at: user.created_at,
        updated_at: user.updated_at,
        deleted_at: user.deleted_at,
      },
      token,
      message,
    };
  }

  async logout(userId: string) {
    return { message: "Logged out successfully" };
  }

  async getProfile(userId: string) {
    const user = await this.userRepo.findById(userId);

    if (!user) {
      throw new AppError(`${MessageCode.MSG_12.description}`, 404);
    }

    return {
      user,
    };
  }

  async updateProfile(payload: UpdateProfilePayload, targetId: string) {
    const user = await this.userRepo.findById(targetId);
    if (!user) {
      throw new AppError(`${MessageCode.MSG_12.description}`, 404);
    }

    if (payload.email) {
      const emailTakenUser = await this.userRepo.findByEmail(payload.email);
      if (emailTakenUser && emailTakenUser.id !== targetId) {
        throw new AppError(`${MessageCode.MSG_5.description}`, 409);
      }
    }

    const updateData: Prisma.UserUpdateInput = {};

    if (payload.name !== undefined) updateData.name = payload.name;
    if (payload.email !== undefined) updateData.email = payload.email;
    if (payload.phone !== undefined) updateData.phone = payload.phone;
    if (payload.password) {
      const saltRounds = 10;
      updateData.password_hash = await bcrypt.hash(
        payload.password,
        saltRounds,
      );
    }

    const updatedUser = await this.userRepo.updateUser(updateData, targetId);
    return updatedUser;
  }

  async banUser(adminId: string, targetId: string) {
    const user = await this.userRepo.findById(targetId);
    if (!user) {
      throw new AppError(`${MessageCode.MSG_12.description}`, 404);
    }

    if (user.role === "admin") {
      throw new AppError(`Cannot ban an Administrator`, 409);
    }

    if (adminId === targetId) {
      throw new AppError(`Cannot ban yourself`, 409);
    }

    if (user.status === "banned") {
      throw new AppError(
        `Cannot ban this account as it was already banned`,
        409,
      );
    }

    const updateData: Prisma.UserUpdateInput = {};

    updateData.status = "banned";

    const updatedUser = await this.userRepo.updateUser(updateData, targetId);
    return updatedUser;
  }

  async unbanUser(adminId: string, targetId: string) {
    const user = await this.userRepo.findById(targetId);
    if (!user) {
      throw new AppError(`${MessageCode.MSG_12.description}`, 404);
    }

    if (adminId === targetId) {
      throw new AppError(`Admins cannot change their own ban status`, 403);
    }

    if (user.status === "active") {
      throw new AppError(
        `Cannot unban this account as it was already active`,
        409,
      );
    }

    const updateData: Prisma.UserUpdateInput = {};

    updateData.status = "active";

    const updatedUser = await this.userRepo.updateUser(updateData, targetId);
    return updatedUser;
  }

  async getUsers() {
    return this.userRepo.getAllUsers();
  }

  async deleteUser(targetId: string) {
    const existingUser = await this.userRepo.findById(targetId);

    if (!existingUser) {
      throw new AppError(`${MessageCode.MSG_12.description}`, 401);
    }

    const linkedEvents = await this.eventRepo.getAllEvents(targetId);

    if (existingUser.role === "organizer" && linkedEvents.total !== 0) {
      throw new AppError(`Cannot delete: Organizer has created events`, 401);
    }

    const linkedTickets = await this.ticketRepo.getTicketByUserId(targetId);

    if (existingUser.role === "user" && linkedTickets.length !== 0) {
      throw new AppError(`Cannot delete: User has transaction history`, 401);
    }

    return await this.userRepo.deleteUser(targetId);
  }
}
