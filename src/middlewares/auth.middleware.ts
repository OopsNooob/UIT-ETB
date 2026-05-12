import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt.util";

export const withAuthGuard = (allowedRoles: string[] = []) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: Please log in",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded: any = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: Token is invalid or expired",
      });
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
      return res.status(403).json({
        success: false,
        error: "Forbidden: You do not have permission to access this resource",
      });
    }

    res.locals.authUser = decoded;
    return next();
  };
};
