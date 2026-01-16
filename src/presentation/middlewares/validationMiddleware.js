/**
 * Validation Middleware
 * Validates request data against Joi schemas
 */
const ValidationError = require('../../domain/errors/ValidationError');

/**
 * Create validation middleware
 */
const validationMiddleware = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message).join(', ');
      return next(new ValidationError(errorMessages));
    }

    // Replace request body with validated and sanitized data
    req.body = value;
    next();
  };
};

module.exports = validationMiddleware;
