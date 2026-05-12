import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

class AuthControllerClass {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response) => {
    try {
      const body = req.body;

      const user = await this.authService.registerUser(body);

      return res.status(201).json({
        success: true,
        message: "Registration successful",
        data: user,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  };
}

export const AuthController = new AuthControllerClass();
