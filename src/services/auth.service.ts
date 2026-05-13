import { UserRepository } from "../repositories/user.repository";
import bcrypt from "bcrypt";
import { MessageCode } from "../helper/message.constants";
import jwt from "jsonwebtoken";
export class AuthService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
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
      throw new Error(`${MessageCode.MSG_0.description}`);
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
      throw new Error(`${MessageCode.MSG_2.description}`);
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error(`${MessageCode.MSG_2.description}`);
    }

    // if (user.status === "banned") {
    //   throw new Error("Your account has been banned");
    // }

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
      throw new Error(`${MessageCode.MSG_12.description}`);
    }

    return {
      user,
    };
  }
}
