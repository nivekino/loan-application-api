"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const winston_1 = tslib_1.__importDefault(require("winston"));
const winston_daily_rotate_file_1 = tslib_1.__importDefault(require("winston-daily-rotate-file"));
const os_1 = tslib_1.__importDefault(require("os"));
// Determine log level from environment
const env = process.env.NODE_ENV || 'development'; // Default to development
const level = env === 'development' ? 'debug' : 'info'; // Default to debug in development
const format = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.errors({ stack: true }), // Format error stack traces
winston_1.default.format.json());
const transports = [
    new winston_1.default.transports.Console({
        level: env === 'test' ? 'error' : level, // Only log errors in test mode
        format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple())
    }),
    new winston_daily_rotate_file_1.default({
        level: 'error', // Separate file transport for errors
        filename: './logs/error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '30d' // Keep error logs for 30 days
    }),
    new winston_daily_rotate_file_1.default({
        filename: './logs/application-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d'
    })
];
// Only handle exceptions in production
const exceptionHandlers = env === 'production' ? [
    new winston_1.default.transports.File({ filename: './logs/exceptions.log' })
] : [];
const logger = winston_1.default.createLogger({
    level,
    format,
    transports,
    exceptionHandlers,
    exitOnError: false, // Do not exit on handled exceptions
    defaultMeta: { service: 'Vinculos Estrategicos', hostname: os_1.default.hostname() } // Meta information
});
exports.default = logger;
//# sourceMappingURL=logger.js.map