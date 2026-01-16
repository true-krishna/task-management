/**
 * Authentication Middleware
 * Verifies JWT access token and attaches user to request
 */
const AuthenticationError = require('../../domain/errors/AuthenticationError');

/**
 * Create authentication middleware
 */
const authMiddleware = ({ verifyTokenUseCase, logger }) => {
  return async (req, res, next) => {
    try {
      // Get token from Authorization header
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AuthenticationError('No token provided');
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix

      // Verify token and get user
      const user = await verifyTokenUseCase.execute({ token });

      // Attach user to request
      req.user = user;

      logger.debug('User authenticated', { userId: user.id });

      next();
    } catch (error) {
      logger.warn('Authentication failed', { error: error.message });
      next(error);
    }
  };
};

module.exports = authMiddleware;
