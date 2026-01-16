/**
 * Error Handler Middleware
 * Centralized error handling for the application
 */
const DomainError = require('../../domain/errors/DomainError');
const ValidationError = require('../../domain/errors/ValidationError');
const AuthenticationError = require('../../domain/errors/AuthenticationError');
const AuthorizationError = require('../../domain/errors/AuthorizationError');
const NotFoundError = require('../../domain/errors/NotFoundError');
const ConflictError = require('../../domain/errors/ConflictError');

/**
 * Error handler middleware
 */
const errorHandlerMiddleware = (logger) => {
  return (err, req, res, next) => {
    // Log error
    logger.error('Error occurred', {
      error: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      ip: req.ip,
    });

    // Default error response
    let statusCode = 500;
    let message = 'Internal server error';
    let errors = null;

    // Handle specific error types
    if (err instanceof ValidationError) {
      statusCode = 400;
      message = err.message;
    } else if (err instanceof AuthenticationError) {
      statusCode = 401;
      message = err.message;
    } else if (err instanceof AuthorizationError) {
      statusCode = 403;
      message = err.message;
    } else if (err instanceof NotFoundError) {
      statusCode = 404;
      message = err.message;
    } else if (err instanceof ConflictError) {
      statusCode = 409;
      message = err.message;
    } else if (err instanceof DomainError) {
      statusCode = 422;
      message = err.message;
    } else if (err.name === 'MongoError' || err.name === 'MongooseError') {
      statusCode = 500;
      message = 'Database error';
    } else if (err.name === 'CastError') {
      statusCode = 400;
      message = 'Invalid ID format';
    }

    // Don't expose internal errors in production
    if (process.env.NODE_ENV === 'production' && statusCode === 500) {
      message = 'Internal server error';
    }

    // Send error response
    res.status(statusCode).json({
      success: false,
      message,
      ...(errors && { errors }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  };
};

module.exports = errorHandlerMiddleware;
