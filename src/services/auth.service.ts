import { UserRepository } from "../repositories/user.repository";
import bcrypt from "bcrypt";

export class AuthService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  async registerUser(payload: any) {
    const { name, email, password, role } = payload;

    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) {
      throw new Error("Email is already registered in the system.");
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const newUser = await this.userRepo.createUser({
      name,
      email,
      password_hash,
      role: role || "user",
    });

    const { password_hash: _, ...safeUser } = newUser;
    return safeUser;
  }
}
