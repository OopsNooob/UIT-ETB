import { Router } from "express";
import { LoggingController } from "../controllers/logging.controller";

const loggingRoute = Router();

loggingRoute.get("/", LoggingController.getLogs);
loggingRoute.post("/", LoggingController.createLog);

export default loggingRoute;
