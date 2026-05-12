import { AuthController } from "../controllers/auth.controller";
import { Router } from "express";
import { withAuthGuard } from "../middlewares/auth.middleware";

const router = Router();
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/logout", withAuthGuard(), AuthController.logout);
router.get("/me", withAuthGuard(), AuthController.getProfile);

export default router;
