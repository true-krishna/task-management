const DomainError = require('./DomainError');

/**
 * Authorization Error
 */
class AuthorizationError extends DomainError {
  constructor(message = 'Access denied') {
    super(message, 403);
  }
}

module.exports = AuthorizationError;
