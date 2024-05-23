
import winston, { transports, format } from 'winston';
import { addColors } from 'winston/lib/winston/config';
import DailyRotateFile from 'winston-daily-rotate-file';
import { LOG_LEVELS } from '../utilities/constants';
const date: Date = new Date();

const getTodayDate = (): string => {
    const todaysDate: string = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    return todaysDate;
};
const TRANSPORTS = {
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
    public static emerge(message: string) {
        this.logger.emerg(message);
    }
    public static alert(message: string) {
        this.logger.alert(message);
    }
    public static crit(message: string) {
        this.logger.crit(message);
    }
    public static error(message: string) {
        this.logger.error(message);
    }
    public static warning(message: string) {
        this.logger.warning(message);
    }
    public static notice(message: string) {
        this.logger.notice(message);
    }
    public static info(message: string) {
        this.logger.info(message);
    }
    public static debug(message: string) {
        this.logger.debug(message);
    }
}
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


