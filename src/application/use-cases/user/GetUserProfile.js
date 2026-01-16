const NotFoundError = require('../../../domain/errors/NotFoundError');

/**
 * Use Case: Get User Profile
 * Retrieves the current user's profile information from cache or database
 */
class GetUserProfile {
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
   * @returns {Promise<Object>} User profile data
   */
  async execute(userId) {
    try {
      this.logger.debug('GetUserProfile use case executing', { userId });

      // Check cache first
      const cacheKey = `user:profile:${userId}`;
      const cachedUser = await this.cacheService.get(cacheKey);

      if (cachedUser) {
        this.logger.debug('User profile found in cache', { userId });
        return JSON.parse(cachedUser);
      }

      // Get from database
      const user = await this.userRepository.findById(userId);

      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Prepare profile data (exclude sensitive fields)
      const profileData = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLoginAt: user.lastLoginAt,
      };

      // Cache the profile (1 hour TTL)
      await this.cacheService.set(cacheKey, JSON.stringify(profileData), 3600);

      this.logger.info('User profile retrieved successfully', { userId });

      return profileData;
    } catch (error) {
      this.logger.error('Error in GetUserProfile use case', {
        userId,
        error: error.message,
      });
      throw error;
    }
  }
}

module.exports = GetUserProfile;
