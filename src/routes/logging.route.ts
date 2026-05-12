import { Router } from "express";
import { LoggingController } from "../controllers/logging.controller";

const loggingRoute = Router();

loggingRoute.post("/", LoggingController.createLog);

export default loggingRoute;
