import winston from "winston";
import path from "path";
import fs from "fs";

const logsDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  }),
);

const dbLogFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message }) => {
    const formattedMessage =
      typeof message === "string" ? message : JSON.stringify(message);

    return `[${timestamp}] [${level.toUpperCase()}] ${formattedMessage}`;
  }),
);

export const systemLogger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, "system.log"),
      level: "info",
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logsDir, "error.log"),
      level: "error",
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  ],
});

export const dbLogger = winston.createLogger({
  level: "debug",
  format: dbLogFormat,
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, "db.log"),
      level: "debug",
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});
