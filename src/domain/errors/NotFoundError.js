const DomainError = require('./DomainError');

/**
 * Not Found Error
 */
class NotFoundError extends DomainError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

module.exports = NotFoundError;
