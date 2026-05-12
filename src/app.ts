import express, { Request, Response } from "express";

const app = express();

// app.use(helmet());
// app.use(cors());
// app.use(morgan("dev"));
app.use(express.json());

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running!",
  });
});

export default app;
