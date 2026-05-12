import { NextFunction, Request, Response } from "express";
import { getSystemHealth } from "../workers/health.cron";

export const withHealthGuard = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!getSystemHealth()) {
    return res.status(503).json({
      success: false,
      error: "Service Unavailable",
      message:
        "The system is under maintenance or unable to connect to the server. Transaction flow has been interrupted (Fail-fast).",
    });
  }

  return next();
};
