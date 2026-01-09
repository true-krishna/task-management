/**
 * Logger Interface
 */
class ILogger {
  info(_message, _meta) {
    throw new Error('Method not implemented');
  }

  error(_message, _meta) {
    throw new Error('Method not implemented');
  }

  warn(_message, _meta) {
    throw new Error('Method not implemented');
  }

  debug(_message, _meta) {
    throw new Error('Method not implemented');
  }

  http(_message, _meta) {
    throw new Error('Method not implemented');
  }
}

module.exports = ILogger;
