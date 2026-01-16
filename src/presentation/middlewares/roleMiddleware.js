/**
 * Role-Based Access Control Middleware
 * Checks if user has required role(s)
 */
const AuthorizationError = require('../../domain/errors/AuthorizationError');
const UserRole = require('../../domain/enums/UserRole');

/**
 * Create role middleware
 * @param {Array<string>} allowedRoles - Array of allowed roles
 */
const roleMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        throw new AuthorizationError('Authentication required');
      }

      // Check if user has required role
      const userRole = req.user.role;

      if (!allowedRoles.includes(userRole)) {
        throw new AuthorizationError('Insufficient permissions');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Admin only middleware
 */
const adminOnly = () => roleMiddleware([UserRole.ADMIN]);

/**
 * User or Admin middleware
 */
const userOrAdmin = () => roleMiddleware([UserRole.USER, UserRole.ADMIN]);

module.exports = {
  roleMiddleware,
  adminOnly,
  userOrAdmin,
};
