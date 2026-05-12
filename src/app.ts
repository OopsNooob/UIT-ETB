import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { withHealthGuard } from "./middlewares/health.guard";
import { withErrorHandler } from "./middlewares/exception.handler";
import authRoute from "./routes/auth.routes";

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1", withHealthGuard);

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running!",
  });
});

// Auth
app.use("/api/v1/auth", authRoute);

app.use(withErrorHandler);

export default app;
