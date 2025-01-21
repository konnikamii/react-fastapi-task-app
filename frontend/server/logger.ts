/* eslint-disable */
import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const logger = createLogger({
  transports: [
    // console logger
    new transports.Console({
      level: "debug",
      format: format.combine(
        format.timestamp({ format: "HH:mm:ss.SSS" }),
        format.colorize(),
        format.printf(({ level, message, timestamp }) => {
          return `${timestamp} ${level}: ${message}`;
        })
      ),
    }),
    // rotating file for info logs
    new DailyRotateFile({
      level: "critical",
      filename: "./logs/Critical-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "10m",
      maxFiles: "1d",
      format: format.combine(
        format.timestamp(),
        format.json(),
        format.metadata(),
        format.prettyPrint()
      ),
    }),
    // rotating file for error logs
    new DailyRotateFile({
      level: "error",
      filename: "./logs/Errors-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "10m",
      maxFiles: "7d",
      format: format.combine(
        format.timestamp(),
        format.json(),
        format.metadata(),
        format.prettyPrint()
      ),
    }),
  ],
});

// Error logger
export const errLogger = createLogger({
  transports: [
    new DailyRotateFile({
      filename: "./logs/InterErrors-%DATE%.log",
      dirname: "./logs",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "10m",
      maxFiles: "7d",
    }),
  ],
  format: format.combine(
    format.json(),
    format.timestamp(),
    format.printf((info) => {
      return `${info.timestamp} ${info.level}: ${info.message}`;
    })
  ),
});

export default logger;