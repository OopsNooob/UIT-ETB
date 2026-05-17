import { AuthController } from "../controllers/user.controller";
import { Router } from "express";
import { withAuthGuard } from "../middlewares/auth.middleware";

const userRoutes = Router();

userRoutes.get("/", withAuthGuard(["admin"]), AuthController.getUsers);
userRoutes.patch("/:id", withAuthGuard(), AuthController.updateProfile);
userRoutes.patch("/ban/:id", withAuthGuard(["admin"]), AuthController.ban);
userRoutes.patch("/unban/:id", withAuthGuard(["admin"]), AuthController.unban);
userRoutes.delete("/:id", withAuthGuard(["admin"]), AuthController.delete);

export default userRoutes;
