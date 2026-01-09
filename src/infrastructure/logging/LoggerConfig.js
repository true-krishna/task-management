/**
 * Winston Logger Configuration
 */
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const config = require('../../main/config/env');
const path = require('path');

class LoggerConfig {
  static configure() {
    const logFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.json()
    );

    const transports = [];

    // Console transport
    if (config.nodeEnv === 'development') {
      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(
              (info) => `${info.timestamp} [${info.level}]: ${info.message}`
            )
          ),
        })
      );
    }

    // File transports
    const logPath = config.logging.filePath;

    // Error logs
    transports.push(
      new DailyRotateFile({
        filename: path.join(logPath, 'error-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        maxSize: config.logging.maxSize,
        maxDays: config.logging.maxFiles,
        format: logFormat,
      })
    );

    // Combined logs
    transports.push(
      new DailyRotateFile({
        filename: path.join(logPath, 'combined-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        maxSize: config.logging.maxSize,
        maxDays: config.logging.maxFiles,
        format: logFormat,
      })
    );

    const logger = winston.createLogger({
      level: config.logging.level,
      format: logFormat,
      transports,
      exceptionHandlers: [
        new DailyRotateFile({
          filename: path.join(logPath, 'exceptions-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          maxSize: config.logging.maxSize,
          maxDays: config.logging.maxFiles,
        }),
      ],
      rejectionHandlers: [
        new DailyRotateFile({
          filename: path.join(logPath, 'rejections-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          maxSize: config.logging.maxSize,
          maxDays: config.logging.maxFiles,
        }),
      ],
    });

    return logger;
  }
}

module.exports = LoggerConfig;
