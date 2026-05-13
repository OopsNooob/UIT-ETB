import { Router } from "express";
import { TicketController } from "../controllers/ticket.controller";
import { withAuthGuard } from "../middlewares/auth.middleware";

const ticketRoutes = Router();

ticketRoutes.post(
  "/:eventId/ticket-types",
  withAuthGuard(["organizer", "admin"]),
  TicketController.createTicketTypes,
);

export default ticketRoutes;
