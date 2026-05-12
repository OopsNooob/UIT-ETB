import { NextFunction, Request, Response } from "express";
import { systemLogger } from "../utils/logger.util";

export const withErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  systemLogger.error(
    `Unhandled Exception: ${error.message}\nStack: ${error.stack}`,
  );

  return res.status(500).json({
    success: false,
    error: "Internal Server Error",
    message: "Internal Server Error. Please try again.",
  });
};
