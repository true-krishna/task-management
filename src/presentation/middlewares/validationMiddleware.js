/**
 * Validation Middleware
 * Validates request data against Joi schemas
 */
const ValidationError = require('../../domain/errors/ValidationError');

/**
 * Create validation middleware
 * @param {Object} schema - Joi schema
 * @param {string} source - Source of data to validate ('body', 'query', 'params')
 */
const validationMiddleware = (schema, source = 'body') => {
  return (req, res, next) => {
    // Get data from the specified source
    const dataToValidate = req[source];

    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message).join(', ');
      return next(new ValidationError(errorMessages));
    }

    // Replace request data with validated and sanitized data
    req[source] = value;
    next();
  };
};

module.exports = validationMiddleware;
