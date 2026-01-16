const NotFoundError = require('../../../domain/errors/NotFoundError');
const ValidationError = require('../../../domain/errors/ValidationError');

/**
 * Use Case: Update User Profile
 * Updates the current user's profile information and invalidates cache
 */
class UpdateUserProfile {
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
   * @param {string} userId - The ID of the user
   * @param {Object} updateData - Data to update
   * @param {string} [updateData.firstName] - First name
   * @param {string} [updateData.lastName] - Last name
   * @param {string} [updateData.avatar] - Avatar URL
   * @returns {Promise<Object>} Updated user profile
   */
  async execute(userId, updateData) {
    try {
      this.logger.debug('UpdateUserProfile use case executing', {
        userId,
        fields: Object.keys(updateData),
      });

      // Validate that at least one field is provided
      if (Object.keys(updateData).length === 0) {
        throw new ValidationError('No fields provided for update');
      }

      // Check if user exists
      const existingUser = await this.userRepository.findById(userId);
      if (!existingUser) {
        throw new NotFoundError('User not found');
      }

      // Only allow updating specific fields (security)
      const allowedFields = ['firstName', 'lastName', 'avatar'];
      const filteredData = {};

      for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
          filteredData[field] = updateData[field];
        }
      }

      if (Object.keys(filteredData).length === 0) {
        throw new ValidationError('No valid fields provided for update');
      }

      // Update user
      const updatedUser = await this.userRepository.update(userId, filteredData);

      if (!updatedUser) {
        throw new NotFoundError('User not found after update');
      }

      // Invalidate cache
      const cacheKey = `user:profile:${userId}`;
      await this.cacheService.del(cacheKey);
      await this.cacheService.del('user:all'); // Invalidate user list cache

      this.logger.info('User profile updated successfully', {
        userId,
        updatedFields: Object.keys(filteredData),
      });

      // Prepare response data
      const profileData = {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
        isActive: updatedUser.isActive,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
        lastLoginAt: updatedUser.lastLoginAt,
      };

      return profileData;
    } catch (error) {
      this.logger.error('Error in UpdateUserProfile use case', {
        userId,
        error: error.message,
      });
      throw error;
    }
  }
}

module.exports = UpdateUserProfile;
