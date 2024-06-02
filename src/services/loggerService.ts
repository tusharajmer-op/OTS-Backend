import winston, { transports, format } from 'winston';
import { addColors } from 'winston/lib/winston/config';
import DailyRotateFile from 'winston-daily-rotate-file';
import { LOG_LEVELS } from '../utilities/constants';

const date: Date = new Date();

/**
 * Get today's date in the format DD-MM-YYYY.
 * @returns {string} The formatted date string.
 */
const getTodayDate = (): string => {
    const todaysDate: string = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    return todaysDate;
};

const TRANSPORTS = {
    // Console transport for logging to the console
    console: new transports.Console({
        level: 'debug',
        format: format.combine(
            format.timestamp(
                { format: 'DD-MM-YYYY HH-mm-ss' }
            ),
            format.printf(data => {
                return `${data.timestamp} [${data.level.toUpperCase()} : ${data.message} ]`;
            }),
            format.colorize({
                all: true
            })
        )
    }),

    // File transport for logging errors to a file
    error_log: new transports.File({
        level: 'error',
        filename: `logs/${getTodayDate()}-error.log`,
        format: format.combine(
            format.timestamp(
                { format: 'DD-MM-YYYY HH-mm-ss' }
            ),
            format.printf(data => {
                return `${data.timestamp} [${data.level.toUpperCase()} : ${data.message} ]`;
            }),
            format.colorize({
                all: true
            })
        )
    }),

    // File transport for logging all levels to a file
    combined_log: new transports.File({
        level: 'debug',
        filename: `logs/${getTodayDate()}-combined.log`,
        format: format.combine(
            format.timestamp(
                { format: 'dd-MM-YYYY HH-mm-ss' }
            ),
            format.printf(data => {
                return `${data.timestamp} [${data.level.toUpperCase()} : ${data.message} ]`;
            }),
            format.colorize({
                all: true
            })
        )
    }),

    // File transport for logging critical errors to a file
    alert_log: new transports.File({
        level: 'crit',
        filename: `logs/${getTodayDate()}-alert.log`,
        format: format.combine(
            format.timestamp(
                { format: 'DD-MM-YYYY HH-mm-ss' }
            ),
            format.printf(data => {
                return `${data.timestamp} [${data.level.toUpperCase()} : ${data.message} ]`;
            }),
            format.colorize({
                all: true
            })
        )
    }),
};

export default class Logger {
    private static logger: winston.Logger;

    /**
     * Configure the logger with the specified transports and log levels.
     */
    public static configure = () => {
        addColors(LOG_LEVELS.colors);
        this.logger = winston.createLogger({
            levels: LOG_LEVELS.level,
            transports: [
                TRANSPORTS.console,
                TRANSPORTS.alert_log,
                TRANSPORTS.error_log,
                TRANSPORTS.combined_log
            ],
            rejectionHandlers: [
                new transports.File({ 'filename': `logs/${getTodayDate()}-rejection.log` })
            ]
        });
    };

    // Log methods for different log levels

    /**
     * Log an emergency message.
     * @param {string} message - The log message.
     */
    public static emerge(message: string) {
        this.logger.emerg(message);
    }

    /**
     * Log an alert message.
     * @param {string} message - The log message.
     */
    public static alert(message: string) {
        this.logger.alert(message);
    }

    /**
     * Log a critical message.
     * @param {string} message - The log message.
     */
    public static crit(message: string) {
        this.logger.crit(message);
    }

    /**
     * Log an error message.
     * @param {string} message - The log message.
     */
    public static error(message: string) {
        this.logger.error(message);
    }

    /**
     * Log a warning message.
     * @param {string} message - The log message.
     */
    public static warning(message: string) {
        this.logger.warning(message);
    }

    /**
     * Log a notice message.
     * @param {string} message - The log message.
     */
    public static notice(message: string) {
        this.logger.notice(message);
    }

    /**
     * Log an info message.
     * @param {string} message - The log message.
     */
    public static info(message: string) {
        this.logger.info(message);
    }

    /**
     * Log a debug message.
     * @param {string} message - The log message.
     */
    public static debug(message: string) {
        this.logger.debug(message);
    }
}

// Create file transports for rotating log files

const errorRotate: DailyRotateFile = new DailyRotateFile({
    filename: `logs/${getTodayDate()}-error.log`,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
});

errorRotate.on('error', error => {
    Logger.error(error.message);
});

const combineRotate: DailyRotateFile = new DailyRotateFile({
    filename: `logs/${getTodayDate()}-combined.log`,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
});

combineRotate.on('error', error => {
    Logger.error(error.message);
});

const alertRotate: DailyRotateFile = new DailyRotateFile({
    filename: `logs/${getTodayDate()}-alert.log`,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
});

alertRotate.on('error', error => {
    Logger.error(error.message);
});

const rejectionRotate: DailyRotateFile = new DailyRotateFile({
    filename: `logs/${getTodayDate()}-rejection.log`,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
});

rejectionRotate.on('error', error => {
    Logger.error(error.message);
});
