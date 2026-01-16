const NotFoundError = require('../../../domain/errors/NotFoundError');
const ValidationError = require('../../../domain/errors/ValidationError');

/**
 * Use Case: Deactivate User
 * Soft deletes a user by setting isActive to false (admin only)
 */
class DeactivateUser {
  /**
   * @param {Object} dependencies
   * @param {import('../../../domain/interfaces/repositories/IUserRepository')} dependencies.userRepository
   * @param {import('../../../domain/interfaces/repositories/IRefreshTokenRepository')} dependencies.refreshTokenRepository
   * @param {import('../../../domain/interfaces/services/ICacheService')} dependencies.cacheService
   * @param {import('../../../domain/interfaces/services/ILogger')} dependencies.logger
   */
  constructor({ userRepository, refreshTokenRepository, cacheService, logger }) {
    this.userRepository = userRepository;
    this.refreshTokenRepository = refreshTokenRepository;
    this.cacheService = cacheService;
    this.logger = logger;
  }

  /**
   * Execute the use case
   * @param {string} userId - The ID of the user to deactivate
   * @param {string} adminId - The ID of the admin performing the action
   * @returns {Promise<Object>} Result of deactivation
   */
  async execute(userId, adminId) {
    try {
      this.logger.debug('DeactivateUser use case executing', {
        userId,
        adminId,
      });

      // Check if user exists
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Prevent self-deactivation
      if (userId === adminId) {
        throw new ValidationError('Cannot deactivate your own account');
      }

      // Check if already deactivated
      if (!user.isActive) {
        throw new ValidationError('User is already deactivated');
      }

      // Soft delete the user
      const deactivatedUser = await this.userRepository.delete(userId);

      if (!deactivatedUser) {
        throw new NotFoundError('User not found after deactivation');
      }

      // Revoke all refresh tokens for this user
      await this.refreshTokenRepository.revokeAllByUserId(userId);

      // Invalidate all user-related caches
      await Promise.all([
        this.cacheService.del(`user:profile:${userId}`),
        this.cacheService.delPattern('user:all:*'), // Invalidate all user list caches
      ]);

      this.logger.info('User deactivated successfully', {
        userId,
        deactivatedBy: adminId,
      });

      return {
        success: true,
        message: 'User deactivated successfully',
        user: {
          id: deactivatedUser.id,
          email: deactivatedUser.email,
          isActive: deactivatedUser.isActive,
        },
      };
    } catch (error) {
      this.logger.error('Error in DeactivateUser use case', {
        userId,
        error: error.message,
      });
      throw error;
    }
  }
}

module.exports = DeactivateUser;
