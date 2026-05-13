import { Router } from "express";
import { EventController } from "../controllers/event.controller";
import { withAuthGuard } from "../middlewares/auth.middleware";

const eventRoutes = Router();

eventRoutes.post(
  "/",
  withAuthGuard(["organizer", "admin"]),
  EventController.createEvent,
);

eventRoutes.put(
  "/:id",
  withAuthGuard(["organizer", "admin"]),
  EventController.updateEvent,
);

eventRoutes.get("/", EventController.getAllEvents);

eventRoutes.get("/:id", EventController.getEventById);

export default eventRoutes;
