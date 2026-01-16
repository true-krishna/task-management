const NotFoundError = require('../../../domain/errors/NotFoundError');
const ValidationError = require('../../../domain/errors/ValidationError');
const UserRole = require('../../../domain/enums/UserRole');

/**
 * Use Case: Update User Role
 * Updates a user's role (admin only)
 */
class UpdateUserRole {
  /**
   * @param {Object} dependencies
   * @param {import('../../../domain/interfaces/repositories/IUserRepository')} dependencies.userRepository
   * @param {import('../../../domain/interfaces/services/ICacheService')} dependencies.cacheService
   * @param {import('../../../domain/interfaces/services/ILogger')} dependencies.logger
   */
  constructor({ userRepository, cacheService, logger }) {
    this.userRepository = userRepository;
    this.cacheService = cacheService;
    this.logger = logger;
  }

  /**
   * Execute the use case
   * @param {string} userId - The ID of the user to update
   * @param {string} newRole - The new role (admin | user)
   * @param {string} adminId - The ID of the admin performing the action
   * @returns {Promise<Object>} Updated user data
   */
  async execute(userId, newRole, adminId) {
    try {
      this.logger.debug('UpdateUserRole use case executing', {
        userId,
        newRole,
        adminId,
      });

      // Validate role
      if (!Object.values(UserRole).includes(newRole)) {
        throw new ValidationError(`Invalid role. Must be one of: ${Object.values(UserRole).join(', ')}`);
      }

      // Check if user exists
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Prevent self role change
      if (userId === adminId) {
        throw new ValidationError('Cannot change your own role');
      }

      // Check if role is already the same
      if (user.role === newRole) {
        throw new ValidationError(`User already has role: ${newRole}`);
      }

      // Update user role
      const updatedUser = await this.userRepository.update(userId, { role: newRole });

      if (!updatedUser) {
        throw new NotFoundError('User not found after update');
      }

      // Invalidate all user-related caches
      await Promise.all([
        this.cacheService.del(`user:profile:${userId}`),
        this.cacheService.delPattern('user:all:*'), // Invalidate all user list caches
      ]);

      this.logger.info('User role updated successfully', {
        userId,
        oldRole: user.role,
        newRole,
        updatedBy: adminId,
      });

      // Return safe user data
      return {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
        isActive: updatedUser.isActive,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      };
    } catch (error) {
      this.logger.error('Error in UpdateUserRole use case', {
        userId,
        newRole,
        error: error.message,
      });
      throw error;
    }
  }
}

module.exports = UpdateUserRole;
