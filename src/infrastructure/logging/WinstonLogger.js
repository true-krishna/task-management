/**
 * Winston Logger Implementation
 */
const ILogger = require('../../domain/interfaces/services/ILogger');

class WinstonLogger extends ILogger {
  constructor(winstonLogger) {
    super();
    this.logger = winstonLogger;
  }

  info(message, meta = {}) {
    this.logger.info(message, meta);
  }

  error(message, meta = {}) {
    this.logger.error(message, meta);
  }

  warn(message, meta = {}) {
    this.logger.warn(message, meta);
  }

  debug(message, meta = {}) {
    this.logger.debug(message, meta);
  }

  http(message, meta = {}) {
    this.logger.info(message, { ...meta, level: 'http' });
  }
}

module.exports = WinstonLogger;
