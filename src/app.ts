import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { withHealthGuard } from "./middlewares/health.guard";
import { withErrorHandler } from "./middlewares/exception.handler";
import authRoute from "./routes/auth.routes";
import loggingRoute from "./routes/logging.route";
import eventRoutes from "./routes/event.routes";
import ticketRoutes from "./routes/ticket.routes";
import userRoutes from "./routes/user.routes";
import requestIp from "request-ip";

const app = express();
app.set("trust proxy", true);
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3001")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(morgan("dev"));
app.use(express.json());
app.use(requestIp.mw());

app.use("/api/v1", withHealthGuard);

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running!",
  });
});

// Auth
app.use("/api/v1/auth", authRoute);

// Users
app.use("/api/v1/users", userRoutes);

// Logging
app.use("/api/v1/logs", loggingRoute);

// Events
app.use("/api/v1/events", eventRoutes);

// Ticket Types
app.use("/api/v1/tickets", ticketRoutes);

app.get("/api/test-crash", (req, res, next) => {
  try {
    const fakeObject: any = null;
    fakeObject.doSomethingCrazy();
  } catch (error) {
    next(error);
  }
});

app.use(withErrorHandler);

export default app;
