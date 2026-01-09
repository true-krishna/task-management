const DomainError = require('./DomainError');

/**
 * Validation Error
 */
class ValidationError extends DomainError {
  constructor(message, errors = []) {
    super(message, 400);
    this.errors = errors;
  }
}

module.exports = ValidationError;
