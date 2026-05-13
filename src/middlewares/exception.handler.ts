import { NextFunction, Request, Response } from "express";
import { systemLogger } from "../utils/logger.util";

export const withErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  systemLogger.error(`Unhandled Exception: ${message}\nStack: ${stack}`);

  return res.status(500).json({
    success: false,
    error: "Internal Server Error",
    message: "Internal Server Error. Please try again.",
  });
};
