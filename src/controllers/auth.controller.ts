import { AuthService } from "../services/auth.service";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async register(req: Request) {
    try {
      const body = await req.json();

      // Gọi xuống tầng Service
      const user = await this.authService.registerUser(body);

      return Response.json(
        {
          success: true,
          message: "Đăng ký thành công",
          data: user,
        },
        { status: 201 },
      );
    } catch (error: any) {
      // Bắt lỗi và trả về chuẩn JSON (Exception Masking - ADD ID 67)
      return Response.json(
        {
          success: false,
          message: error.message || "Lỗi máy chủ nội bộ",
        },
        { status: 400 },
      );
    }
  }
}
