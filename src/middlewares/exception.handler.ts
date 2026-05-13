import { NextFunction, Request, Response } from "express";
import { systemLogger } from "../utils/logger.util";
import { AppError } from "../utils/app-error";

export const withErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  systemLogger.error(`Unhandled Exception: ${message}\nStack: ${stack}`);

  return res.status(statusCode).json({
    success: false,
    error: statusCode === 500 ? "Internal Server Error" : "Request Error",
    message: message || "Internal Server Error. Please try again.",
  });
};
