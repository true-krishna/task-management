const DomainError = require('./DomainError');

/**
 * Authentication Error
 */
class AuthenticationError extends DomainError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
  }
}

module.exports = AuthenticationError;
