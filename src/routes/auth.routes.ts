import { AuthController } from "../controllers/auth.controller";
import { Router } from "express";
import { withAuthGuard } from "../middlewares/auth.middleware";
import { Request, Response } from "express";

const router = Router();
router.post("/register", AuthController.register);

router.get("/me", withAuthGuard(), (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Authenticated user information",
    data: res.locals.authUser,
  });
});

export default router;
