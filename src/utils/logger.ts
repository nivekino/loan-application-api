import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import os from "os";

const env = process.env.NODE_ENV || "development";
const level = env === "development" ? "debug" : "info";

const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const transports = [
  new winston.transports.Console({
    level: env === "test" ? "error" : level,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }),
  new DailyRotateFile({
    level: "error",
    filename: "./logs/error-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "30d",
  }),
  new DailyRotateFile({
    filename: "./logs/application-%DATE%.log",
    datePattern: "YYYY-MM-DD-HH",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
  }),
];

const exceptionHandlers =
  env === "production"
    ? [new winston.transports.File({ filename: "./logs/exceptions.log" })]
    : [];

const logger = winston.createLogger({
  level,
  format,
  transports,
  exceptionHandlers,
  exitOnError: false,
  defaultMeta: { service: "Vinculos Estrategicos", hostname: os.hostname() },
});

export default logger;
