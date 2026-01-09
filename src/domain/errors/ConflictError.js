const DomainError = require('./DomainError');

/**
 * Conflict Error
 */
class ConflictError extends DomainError {
  constructor(message = 'Resource conflict') {
    super(message, 409);
  }
}

module.exports = ConflictError;
