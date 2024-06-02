"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importStar(require("winston"));
const config_1 = require("winston/lib/winston/config");
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const constants_1 = require("../utilities/constants");
const date = new Date();
/**
 * Get today's date in the format DD-MM-YYYY.
 * @returns {string} The formatted date string.
 */
const getTodayDate = () => {
    const todaysDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    return todaysDate;
};
const TRANSPORTS = {
    // Console transport for logging to the console
    console: new winston_1.transports.Console({
        level: 'debug',
        format: winston_1.format.combine(winston_1.format.timestamp({ format: 'DD-MM-YYYY HH-mm-ss' }), winston_1.format.printf(data => {
            return `${data.timestamp} [${data.level.toUpperCase()} : ${data.message} ]`;
        }), winston_1.format.colorize({
            all: true
        }))
    }),
    // File transport for logging errors to a file
    error_log: new winston_1.transports.File({
        level: 'error',
        filename: `logs/${getTodayDate()}-error.log`,
        format: winston_1.format.combine(winston_1.format.timestamp({ format: 'DD-MM-YYYY HH-mm-ss' }), winston_1.format.printf(data => {
            return `${data.timestamp} [${data.level.toUpperCase()} : ${data.message} ]`;
        }), winston_1.format.colorize({
            all: true
        }))
    }),
    // File transport for logging all levels to a file
    combined_log: new winston_1.transports.File({
        level: 'debug',
        filename: `logs/${getTodayDate()}-combined.log`,
        format: winston_1.format.combine(winston_1.format.timestamp({ format: 'dd-MM-YYYY HH-mm-ss' }), winston_1.format.printf(data => {
            return `${data.timestamp} [${data.level.toUpperCase()} : ${data.message} ]`;
        }), winston_1.format.colorize({
            all: true
        }))
    }),
    // File transport for logging critical errors to a file
    alert_log: new winston_1.transports.File({
        level: 'crit',
        filename: `logs/${getTodayDate()}-alert.log`,
        format: winston_1.format.combine(winston_1.format.timestamp({ format: 'DD-MM-YYYY HH-mm-ss' }), winston_1.format.printf(data => {
            return `${data.timestamp} [${data.level.toUpperCase()} : ${data.message} ]`;
        }), winston_1.format.colorize({
            all: true
        }))
    }),
};
class Logger {
    static logger;
    /**
     * Configure the logger with the specified transports and log levels.
     */
    static configure = () => {
        (0, config_1.addColors)(constants_1.LOG_LEVELS.colors);
        this.logger = winston_1.default.createLogger({
            levels: constants_1.LOG_LEVELS.level,
            transports: [
                TRANSPORTS.console,
                TRANSPORTS.alert_log,
                TRANSPORTS.error_log,
                TRANSPORTS.combined_log
            ],
            rejectionHandlers: [
                new winston_1.transports.File({ 'filename': `logs/${getTodayDate()}-rejection.log` })
            ]
        });
    };
    // Log methods for different log levels
    /**
     * Log an emergency message.
     * @param {string} message - The log message.
     */
    static emerge(message) {
        this.logger.emerg(message);
    }
    /**
     * Log an alert message.
     * @param {string} message - The log message.
     */
    static alert(message) {
        this.logger.alert(message);
    }
    /**
     * Log a critical message.
     * @param {string} message - The log message.
     */
    static crit(message) {
        this.logger.crit(message);
    }
    /**
     * Log an error message.
     * @param {string} message - The log message.
     */
    static error(message) {
        this.logger.error(message);
    }
    /**
     * Log a warning message.
     * @param {string} message - The log message.
     */
    static warning(message) {
        this.logger.warning(message);
    }
    /**
     * Log a notice message.
     * @param {string} message - The log message.
     */
    static notice(message) {
        this.logger.notice(message);
    }
    /**
     * Log an info message.
     * @param {string} message - The log message.
     */
    static info(message) {
        this.logger.info(message);
    }
    /**
     * Log a debug message.
     * @param {string} message - The log message.
     */
    static debug(message) {
        this.logger.debug(message);
    }
}
exports.default = Logger;
// Create file transports for rotating log files
const errorRotate = new winston_daily_rotate_file_1.default({
    filename: `logs/${getTodayDate()}-error.log`,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
});
errorRotate.on('error', error => {
    Logger.error(error.message);
});
const combineRotate = new winston_daily_rotate_file_1.default({
    filename: `logs/${getTodayDate()}-combined.log`,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
});
combineRotate.on('error', error => {
    Logger.error(error.message);
});
const alertRotate = new winston_daily_rotate_file_1.default({
    filename: `logs/${getTodayDate()}-alert.log`,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
});
alertRotate.on('error', error => {
    Logger.error(error.message);
});
const rejectionRotate = new winston_daily_rotate_file_1.default({
    filename: `logs/${getTodayDate()}-rejection.log`,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
});
rejectionRotate.on('error', error => {
    Logger.error(error.message);
});
